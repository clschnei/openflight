import { useSocket } from '../hooks/useSocket';
import './CameraFeed.css';

export function CameraFeed() {
  const { cameraStatus, toggleCamera, toggleCameraStream } = useSocket();

  if (!cameraStatus.available) {
    return (
      <div className="camera-feed camera-feed--unavailable">
        <div className="camera-feed__status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          <h3>Camera Unavailable</h3>
          <p>Launch angle detection is disabled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-feed">
      <div className="camera-feed__header">
        <div className="camera-feed__title">
          <h3>Launch Angle Camera</h3>
          <span className={`status-pill ${cameraStatus.enabled ? 'status-pill--active' : 'status-pill--inactive'}`}>
            {cameraStatus.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div className="camera-feed__controls">
          <button 
            className={`btn ${cameraStatus.enabled ? 'btn--danger' : 'btn--primary'}`}
            onClick={toggleCamera}
          >
            {cameraStatus.enabled ? 'Disable' : 'Enable'}
          </button>
          <button 
            className="btn btn--secondary"
            onClick={toggleCameraStream}
            disabled={!cameraStatus.enabled}
          >
            {cameraStatus.streaming ? 'Stop Stream' : 'Start Stream'}
          </button>
        </div>
      </div>

      <div className="camera-feed__content">
        {cameraStatus.enabled && cameraStatus.streaming ? (
          <div className="camera-feed__stream">
            <img 
              src="/api/camera/stream" 
              alt="Camera Stream" 
              key={cameraStatus.streaming ? 'streaming' : 'stopped'}
            />
            {cameraStatus.ball_detected && (
              <div className="camera-feed__overlay">
                <div className="ball-marker" />
                <span className="ball-confidence">
                  Ball: {(cameraStatus.ball_confidence * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="camera-feed__placeholder">
            {!cameraStatus.enabled ? (
              <p>Enable camera to see launch angle data</p>
            ) : (
              <p>Stream disabled. Click 'Start Stream' to see live feed.</p>
            )}
          </div>
        )}
      </div>

      <div className="camera-feed__info">
        <div className="info-item">
          <span className="info-label">Detection</span>
          <span className={`info-value ${cameraStatus.ball_detected ? 'info-value--success' : ''}`}>
            {cameraStatus.ball_detected ? 'Ball Detected' : 'No Ball'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Confidence</span>
          <span className="info-value">{(cameraStatus.ball_confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
