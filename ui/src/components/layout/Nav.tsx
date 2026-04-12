import { Icons } from '../icons/NavigationIcons';
import { useSocket } from '../../hooks/useSocket';
import { useShotContext } from '../../state/useShotContext';

type View = 'live' | 'stats' | 'shots' | 'camera' | 'debug';

interface NavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Nav({ currentView, onViewChange }: NavProps) {
  const { debugMode, cameraStatus } = useSocket();
  const { shots } = useShotContext();

  return (
    <nav className="nav">
      <button
        className={`nav__button ${currentView === 'live' ? 'nav__button--active' : ''}`}
        onClick={() => onViewChange('live')}
      >
        {Icons.live}
        <span>Live</span>
      </button>
      <button
        className={`nav__button ${currentView === 'stats' ? 'nav__button--active' : ''}`}
        onClick={() => onViewChange('stats')}
      >
        {Icons.stats}
        <span>Stats</span>
      </button>
      <button
        className={`nav__button ${currentView === 'shots' ? 'nav__button--active' : ''}`}
        onClick={() => onViewChange('shots')}
      >
        {Icons.shots}
        <span>Shots</span>
        {shots.length > 0 && <span className="nav__badge">{shots.length}</span>}
      </button>
      <button
        className={`nav__button ${currentView === 'camera' ? 'nav__button--active' : ''} ${cameraStatus.streaming ? 'nav__button--streaming' : ''}`}
        onClick={() => onViewChange('camera')}
      >
        {Icons.camera}
        <span>Camera</span>
        {cameraStatus.ball_detected && <span className="nav__ball-dot" />}
      </button>
      <button
        className={`nav__button ${currentView === 'debug' ? 'nav__button--active' : ''} ${debugMode ? 'nav__button--recording' : ''}`}
        onClick={() => onViewChange('debug')}
      >
        {Icons.debug}
        <span>Debug</span>
        {debugMode && <span className="nav__recording-dot" />}
      </button>
    </nav>
  );
}
