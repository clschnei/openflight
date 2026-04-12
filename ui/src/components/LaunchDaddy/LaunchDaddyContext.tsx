import { useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { LaunchDaddyContext, type ExplosionData } from './launchDaddyTypes';

const LAUNCH_PHRASES = [
  'STRATOSPHERE',
  'ORBIT ACHIEVED',
  'TO THE MOON',
  'NUCLEAR LAUNCH',
  'ABSOLUTE BOMB',
  'INTO ORBIT',
  'LAUNCHED',
  'OBLITERATED',
  'VAPORIZED',
] as const;

const SUBTITLES = [
  'THE LONGEST HITTER IN THE WORLD',
  'THAT BALL HAD A FAMILY',
  'CALL THE AUTHORITIES',
  'WEAPONS GRADE DISTANCE',
  'SPONSORED BY NASA',
  'REGISTERED AS A WEAPON',
  'BROKE THE SOUND BARRIER',
] as const;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function LaunchDaddyProvider({ children }: { children: ReactNode }) {
  const [isLaunchDaddyMode, setIsLaunchDaddyMode] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [explosionId, setExplosionId] = useState(0);
  const [explosionData, setExplosionData] = useState<ExplosionData | null>(null);
  const [secretTapCount, setSecretTapCount] = useState(0);
  const secretTapCountRef = useRef(0);
  const lastTapTime = useRef(0);

  const toggleLaunchDaddy = useCallback(() => {
    setIsLaunchDaddyMode((prev) => !prev);
    setSecretTapCount(0);
    secretTapCountRef.current = 0;
  }, []);

  const triggerExplosion = useCallback(() => {
    if (!isLaunchDaddyMode) return;
    
    setExplosionData({
      phrase: randomFrom(LAUNCH_PHRASES),
      subtitle: randomFrom(SUBTITLES),
    });
    setExplosionId((id) => id + 1);
    setIsExploding(true);
    
    setTimeout(() => setIsExploding(false), 2500);
  }, [isLaunchDaddyMode]);

  // Secret activation: tap 5 times quickly on the logo
  const handleSecretTap = useCallback(() => {
    const now = Date.now();
    const nextCount = now - lastTapTime.current > 2000 ? 1 : secretTapCountRef.current + 1;
    if (nextCount >= 5) {
      setIsLaunchDaddyMode((mode) => !mode);
      secretTapCountRef.current = 0;
      setSecretTapCount(0);
    } else {
      secretTapCountRef.current = nextCount;
      setSecretTapCount(nextCount);
    }
    lastTapTime.current = now;
  }, []);

  return (
    <LaunchDaddyContext.Provider
      value={{
        isLaunchDaddyMode,
        toggleLaunchDaddy,
        triggerExplosion,
        isExploding,
        explosionId,
        explosionData,
        secretTapCount,
        handleSecretTap,
      }}
    >
      {children}
    </LaunchDaddyContext.Provider>
  );
}
