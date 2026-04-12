import { ShotDisplay } from '../ShotDisplay';
import { StatsView } from '../StatsView';
import { ShotList } from '../ShotList';
import { CameraFeed } from '../CameraFeed';
import { DebugPanel } from '../DebugPanel';
import { useShotContext } from '../../state/useShotContext';
import { useSocket } from '../../hooks/useSocket';

type View = 'live' | 'stats' | 'shots' | 'camera' | 'debug';

interface ViewManagerProps {
  currentView: View;
}

export function ViewManager({ currentView }: ViewManagerProps) {
  const { isNewShot, shotVersion } = useShotContext();
  const { mockMode, simulateShot } = useSocket();

  return (
    <main className="main">
      {currentView === 'live' && (
        <div className="live-view">
          {isNewShot && <div key={shotVersion} className="shot-flash" />}
          <ShotDisplay animate={isNewShot} />
          {mockMode && (
            <button className="simulate-button" onClick={simulateShot}>
              Simulate Shot
            </button>
          )}
        </div>
      )}
      {currentView === 'stats' && <StatsView />}
      {currentView === 'shots' && <ShotList />}
      {currentView === 'camera' && <CameraFeed />}
      {currentView === 'debug' && <DebugPanel />}
    </main>
  );
}
