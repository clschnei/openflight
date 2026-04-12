import { createContext } from 'react';
import type { TriggerDiagnostic, TriggerStatus } from '../types/shot';

export interface DebugReading {
  speed: number;
  direction: 'inbound' | 'outbound' | 'unknown';
  magnitude: number | null;
  timestamp: string;
}

export interface RadarConfig {
  min_speed: number;
  max_speed: number;
  min_magnitude: number;
  transmit_power: number;
}

export interface CameraStatus {
  available: boolean;
  enabled: boolean;
  streaming: boolean;
  ball_detected: boolean;
  ball_confidence: number;
}

export interface DebugShotLog {
  type: 'shot';
  timestamp: string;
  radar: {
    ball_speed_mph: number;
    club_speed_mph: number | null;
    smash_factor: number | null;
    peak_magnitude: number;
  };
  camera: {
    launch_angle_vertical: number;
    launch_angle_horizontal: number;
    launch_angle_confidence: number;
    positions_tracked: number;
    launch_detected: boolean;
  } | null;
  club: string;
}

export interface SocketContextValue {
  connected: boolean;
  mockMode: boolean;
  debugMode: boolean;
  radarConfig: RadarConfig;
  cameraStatus: CameraStatus;
  triggerStatus: TriggerStatus;
  selectedClub: string;
  clearSession: () => void;
  setClub: (club: string) => void;
  simulateShot: () => void;
  toggleDebug: () => void;
  updateRadarConfig: (config: Partial<RadarConfig>) => void;
  toggleCamera: () => void;
  toggleCameraStream: () => void;
  shutdown: () => void;
}

export interface DebugContextValue {
  debugReadings: DebugReading[];
  debugShotLogs: DebugShotLog[];
  triggerDiagnostics: TriggerDiagnostic[];
}

export const SocketContext = createContext<SocketContextValue | undefined>(undefined);
export const DebugContext = createContext<DebugContextValue | undefined>(undefined);
