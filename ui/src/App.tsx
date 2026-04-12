import { useState, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import {
  LaunchDaddyProvider,
  useLaunchDaddy,
  LaunchDaddyOverlay,
  LaunchDaddySecretIndicator,
} from './components/LaunchDaddy';
import { ShotProvider } from './state/ShotProvider';
import { SocketProvider } from './state/SocketProvider';
import { useShotContext } from './state/useShotContext';

import { Header } from './components/layout/Header';
import { Nav } from './components/layout/Nav';
import { ViewManager } from './components/layout/ViewManager';

import './App.css';

type View = 'live' | 'stats' | 'shots' | 'camera' | 'debug';

function AppContent() {
  const { setClub } = useSocket();
  const { shots } = useShotContext();

  const [currentView, setCurrentView] = useState<View>('live');
  const [selectedClub, setSelectedClub] = useState('driver');
  const { isLaunchDaddyMode, isExploding } = useLaunchDaddy();

  const handleClubChange = (club: string) => {
    setSelectedClub(club);
    setClub(club);
  };

  return (
    <div className={`app ${isLaunchDaddyMode ? 'app--launch-daddy' : ''} ${isExploding ? 'app--exploding' : ''}`}>
      <LaunchDaddyOverlay />
      <LaunchDaddySecretIndicator />

      <Header selectedClub={selectedClub} onClubChange={handleClubChange} />

      <Nav currentView={currentView} onViewChange={setCurrentView} shotCount={shots.length} />

      <ViewManager currentView={currentView} />
    </div>
  );
}

function AppWithProviders() {
  const { isLaunchDaddyMode, triggerExplosion } = useLaunchDaddy();

  const handleNewShot = useCallback(() => {
    if (isLaunchDaddyMode) {
      triggerExplosion();
    }
  }, [isLaunchDaddyMode, triggerExplosion]);

  return (
    <ShotProvider onNewShot={handleNewShot}>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </ShotProvider>
  );
}

function App() {
  return (
    <LaunchDaddyProvider>
      <AppWithProviders />
    </LaunchDaddyProvider>
  );
}

export default App;
