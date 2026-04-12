import { useEffect, useState, useCallback, useRef, ReactNode, useMemo } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { Shot, SessionStats, SessionState, TriggerDiagnostic, TriggerStatus } from '../types/shot';
import { useShotContext } from './useShotContext';
import {
  SocketContext,
  DebugContext,
  type DebugReading,
  type DebugShotLog,
  type RadarConfig,
  type CameraStatus,
} from './SocketContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const { addShot, setShots, clearShots } = useShotContext();

  // Low-frequency / UI state
  const [connected, setConnected] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [selectedClub, setSelectedClub] = useState('driver');
  const [radarConfig, setRadarConfig] = useState<RadarConfig>({
    min_speed: 10,
    max_speed: 220,
    min_magnitude: 0,
    transmit_power: 0,
  });
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({
    available: false,
    enabled: false,
    streaming: false,
    ball_detected: false,
    ball_confidence: 0,
  });
  const [triggerStatus, setTriggerStatus] = useState<TriggerStatus>({
    mode: 'rolling-buffer',
    trigger_type: null,
    radar_connected: false,
    radar_port: null,
    triggers_total: 0,
    triggers_accepted: 0,
    triggers_rejected: 0,
  });

  // High-frequency / Debug state
  const [debugReadings, setDebugReadings] = useState<DebugReading[]>([]);
  const [debugShotLogs, setDebugShotLogs] = useState<DebugShotLog[]>([]);
  const [triggerDiagnostics, setTriggerDiagnostics] = useState<TriggerDiagnostic[]>([]);

  // Stable refs for event handlers
  const addShotRef = useRef(addShot);
  const setShotsRef = useRef(setShots);
  const clearShotsRef = useRef(clearShots);

  useEffect(() => {
    addShotRef.current = addShot;
    setShotsRef.current = setShots;
    clearShotsRef.current = clearShots;
  }, [addShot, setShots, clearShots]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('get_session');
      newSocket.emit('get_trigger_status');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('shot', (data: { shot: Shot; stats: SessionStats }) => {
      addShotRef.current(data.shot);
    });

    newSocket.on('session_state', (data: SessionState & {
      mock_mode?: boolean;
      debug_mode?: boolean;
      camera_available?: boolean;
      camera_enabled?: boolean;
      camera_streaming?: boolean;
      ball_detected?: boolean;
    }) => {
      setShotsRef.current(data.shots);
      if (data.mock_mode !== undefined) setMockMode(data.mock_mode);
      if (data.debug_mode !== undefined) setDebugMode(data.debug_mode);
      if (data.club) setSelectedClub(data.club);
      if (data.camera_available !== undefined) {
        setCameraStatus((prev) => ({
          ...prev,
          available: data.camera_available!,
          enabled: data.camera_enabled || false,
          streaming: data.camera_streaming || false,
          ball_detected: data.ball_detected || false,
        }));
      }
    });

    newSocket.on('debug_toggled', (data: { enabled: boolean }) => {
      setDebugMode(data.enabled);
      if (!data.enabled) {
        setDebugReadings([]);
        setDebugShotLogs([]);
      }
    });

    newSocket.on('debug_shot', (data: DebugShotLog) => {
      setDebugShotLogs((prev) => {
        const updated = [...prev, data];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
    });

    newSocket.on('debug_reading', (data: DebugReading) => {
      setDebugReadings((prev) => {
        const updated = [...prev, data];
        return updated.length > 50 ? updated.slice(-50) : updated;
      });
    });

    newSocket.on('radar_config', (data: RadarConfig) => {
      setRadarConfig(data);
    });

    newSocket.on('camera_status', (data: CameraStatus) => {
      setCameraStatus(data);
    });

    newSocket.on('ball_detection', (data: { detected: boolean; confidence: number }) => {
      setCameraStatus((prev) => ({
        ...prev,
        ball_detected: data.detected,
        ball_confidence: data.confidence,
      }));
    });

    newSocket.on('session_cleared', () => {
      clearShotsRef.current();
    });

    newSocket.on('trigger_diagnostic', (data: TriggerDiagnostic) => {
      setTriggerDiagnostics((prev) => {
        const updated = [...prev, data];
        return updated.length > 50 ? updated.slice(-50) : updated;
      });
      setTriggerStatus((prev) => ({
        ...prev,
        triggers_total: prev.triggers_total + 1,
        triggers_accepted: prev.triggers_accepted + (data.accepted ? 1 : 0),
        triggers_rejected: prev.triggers_rejected + (data.accepted ? 0 : 1),
      }));
    });

    newSocket.on('trigger_status', (data: TriggerStatus) => {
      setTriggerStatus(data);
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, []);

  const clearSession = useCallback(() => {
    socketRef.current?.emit('clear_session');
  }, []);

  const setClub = useCallback((club: string) => {
    setSelectedClub(club);
    socketRef.current?.emit('set_club', { club });
  }, []);

  const simulateShot = useCallback(() => {
    socketRef.current?.emit('simulate_shot');
  }, []);

  const toggleDebug = useCallback(() => {
    socketRef.current?.emit('toggle_debug');
  }, []);

  const updateRadarConfig = useCallback((config: Partial<RadarConfig>) => {
    socketRef.current?.emit('set_radar_config', config);
  }, []);

  const toggleCamera = useCallback(() => {
    socketRef.current?.emit('toggle_camera');
  }, []);

  const toggleCameraStream = useCallback(() => {
    socketRef.current?.emit('toggle_camera_stream');
  }, []);

  const shutdown = useCallback(() => {
    fetch('/api/shutdown', { method: 'POST' }).catch(() => {});
  }, []);

  const socketContextValue = useMemo(() => ({
    connected,
    mockMode,
    debugMode,
    radarConfig,
    cameraStatus,
    triggerStatus,
    selectedClub,
    clearSession,
    setClub,
    simulateShot,
    toggleDebug,
    updateRadarConfig,
    toggleCamera,
    toggleCameraStream,
    shutdown,
  }), [
    connected,
    mockMode,
    debugMode,
    radarConfig,
    cameraStatus,
    triggerStatus,
    selectedClub,
    clearSession,
    setClub,
    simulateShot,
    toggleDebug,
    updateRadarConfig,
    toggleCamera,
    toggleCameraStream,
    shutdown
  ]);

  const debugContextValue = useMemo(() => ({
    debugReadings,
    debugShotLogs,
    triggerDiagnostics,
  }), [debugReadings, debugShotLogs, triggerDiagnostics]);

  return (
    <SocketContext.Provider value={socketContextValue}>
      <DebugContext.Provider value={debugContextValue}>
        {children}
      </DebugContext.Provider>
    </SocketContext.Provider>
  );
}
