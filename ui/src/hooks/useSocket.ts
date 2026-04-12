import { useContext } from 'react';
import { SocketContext, DebugContext } from '../state/SocketContext';

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a SocketProvider');
  }
  return context;
}

export type { DebugReading, RadarConfig, CameraStatus, DebugShotLog } from '../state/SocketContext';
