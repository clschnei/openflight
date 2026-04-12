import { useState, useCallback } from 'react';
import {
  LaunchDaddyProvider,
  useLaunchDaddy,
  LaunchDaddyOverlay,
  LaunchDaddySecretIndicator,
} from './components/LaunchDaddy';
import { ShotProvider } from './state/ShotProvider';
import { SocketProvider } from './state/SocketProvider';

import { Header } from './components/layout/Header';
import { Nav } from './components/layout/Nav';
import { ViewManager } from './components/layout/ViewManager';

import './App.css';

type View = 'live' | 'stats' | 'shots' | 'camera' | 'debug';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('live');
  const { isLaunchDaddyMode, isExploding } = useLaunchDaddy();

  return (
    <div className={`app ${isLaunchDaddyMode ? 'app--launch-daddy' : ''} ${isExploding ? 'app--exploding' : ''}`}>
      <LaunchDaddyOverlay />
      <LaunchDaddySecretIndicator />

      <Header />

      <Nav currentView={currentView} onViewChange={setCurrentView} />

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
