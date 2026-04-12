import { createContext } from 'react';

export interface ExplosionData {
  phrase: string;
  subtitle: string;
}

export interface LaunchDaddyContextType {
  isLaunchDaddyMode: boolean;
  toggleLaunchDaddy: () => void;
  triggerExplosion: () => void;
  isExploding: boolean;
  explosionId: number;
  explosionData: ExplosionData | null;
  secretTapCount: number;
  handleSecretTap: () => void;
}

export const LaunchDaddyContext = createContext<LaunchDaddyContextType | null>(null);
