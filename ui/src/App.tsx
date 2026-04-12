import { useState, useEffect } from 'react';
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
  const { shots, isNewShot, shotVersion } = useShotContext();

  const [currentView, setCurrentView] = useState<View>('live');
  const [selectedClub, setSelectedClub] = useState('driver');
  const { isLaunchDaddyMode, isExploding, triggerExplosion } = useLaunchDaddy();

  // Trigger explosion when a new shot is detected in Launch Daddy mode
  useEffect(() => {
    if (isNewShot && isLaunchDaddyMode) {
      triggerExplosion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shotVersion triggers the effect; isNewShot is only a guard
  }, [shotVersion, isLaunchDaddyMode, triggerExplosion]);

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

function App() {
  return (
    <LaunchDaddyProvider>
      <ShotProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </ShotProvider>
    </LaunchDaddyProvider>
  );
}

export default App;
