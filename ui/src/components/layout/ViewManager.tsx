import { ShotDisplay } from '../ShotDisplay';
import { StatsView } from '../StatsView';
import { ShotList } from '../ShotList';
import { CameraFeed } from '../CameraFeed';
import { DebugPanel } from '../DebugPanel';
import { useSocket } from '../../hooks/useSocket';
import { useShotContext } from '../../state/useShotContext';

type View = 'live' | 'stats' | 'shots' | 'camera' | 'debug';

interface ViewManagerProps {
  currentView: View;
}

export function ViewManager({ currentView }: ViewManagerProps) {
  const {
    mockMode,
    debugMode,
    debugReadings,
    debugShotLogs,
    radarConfig,
    cameraStatus,
    triggerDiagnostics,
    triggerStatus,
    clearSession,
    simulateShot,
    toggleDebug,
    updateRadarConfig,
    toggleCamera,
    toggleCameraStream,
  } = useSocket();

  const { latestShot, shots, isNewShot, shotVersion } = useShotContext();

  return (
    <main className="main">
      {currentView === 'live' && (
        <div className="live-view">
          {isNewShot && <div key={shotVersion} className="shot-flash" />}
          <ShotDisplay key={shotVersion} shot={latestShot} animate={isNewShot} />
          {mockMode && (
            <button className="simulate-button" onClick={simulateShot}>
              Simulate Shot
            </button>
          )}
        </div>
      )}
      {currentView === 'stats' && <StatsView shots={shots} onClearSession={clearSession} />}
      {currentView === 'shots' && <ShotList shots={shots} />}
      {currentView === 'camera' && (
        <CameraFeed cameraStatus={cameraStatus} onToggleCamera={toggleCamera} onToggleStream={toggleCameraStream} />
      )}
      {currentView === 'debug' && (
        <DebugPanel
          enabled={debugMode}
          readings={debugReadings}
          shotLogs={debugShotLogs}
          radarConfig={radarConfig}
          cameraStatus={cameraStatus}
          mockMode={mockMode}
          onToggle={toggleDebug}
          onUpdateConfig={updateRadarConfig}
          triggerDiagnostics={triggerDiagnostics}
          triggerStatus={triggerStatus}
        />
      )}
    </main>
  );
}
