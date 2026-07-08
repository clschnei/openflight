import { socketService } from '../services/socketService';
import { useCameraStore } from '../stores/useCameraStore';
import './BallDetectionIndicator.css';

export function BallDetectionIndicator() {
  const { available, enabled, ball_detected: detected, ball_confidence: confidence } = useCameraStore(
    (state) => state.cameraStatus,
  );

  if (!available) {
    return null;
  }

  const getStatusClass = () => {
    if (!enabled) return 'ball-indicator--disabled';
    if (detected) return 'ball-indicator--detected';
    return 'ball-indicator--searching';
  };

  const getStatusText = () => {
    if (!enabled) return 'Camera Off';
    if (detected) return `Ball ${Math.round(confidence * 100)}%`;
    return 'No Ball';
  };

  return (
    <button
      className={`ball-indicator ${getStatusClass()}`}
      onClick={() => socketService.toggleCamera()}
      title={enabled ? 'Click to disable camera' : 'Click to enable camera'}
    >
      <span className="ball-indicator__icon">{detected ? '⚪' : '◯'}</span>
      <span className="ball-indicator__text">{getStatusText()}</span>
    </button>
  );
}
