import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';

export function useSocket() {
  useEffect(() => {
    socketService.connect();

    return () => {
      // Depending on if you want the socket to stay alive across remounts
      // you might not want to disconnect here, but for now we'll match original behavior.
      socketService.disconnect();
    };
  }, []);

  const shutdown = useCallback(() => {
    fetch('/api/shutdown', { method: 'POST' }).catch(() => {});
  }, []);

  return {
    socketService,
    shutdown,
  };
}
