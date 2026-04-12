import { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useLaunchDaddy } from '../LaunchDaddy';
import { ClubPicker } from '../ClubPicker';
import { BallDetectionIndicator } from '../BallDetectionIndicator';
import { ConnectionStatus } from '../ConnectionStatus';
import { LaunchDaddyBrand } from '../LaunchDaddy';
import Logo from '../../logo/Logo';

interface HeaderProps {
  selectedClub: string;
  onClubChange: (club: string) => void;
}

export function Header({ selectedClub, onClubChange }: HeaderProps) {
  const {
    connected,
    cameraStatus,
    toggleCamera,
    shutdown,
  } = useSocket();

  const { isLaunchDaddyMode, handleSecretTap } = useLaunchDaddy();
  const [showShutdown, setShowShutdown] = useState(false);

  return (
    <>
      <header className="header">
        {/* Secret activation area - click/tap 5 times quickly */}
        <div
          className="header__secret-tap"
          onClick={handleSecretTap}
          onKeyDown={(e) => e.key === 'Enter' && handleSecretTap()}
          role="button"
          tabIndex={0}
          style={{
            padding: '8px',
            cursor: 'pointer',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          {isLaunchDaddyMode ? <LaunchDaddyBrand /> : <Logo size="small" variant="light" />}
        </div>
        <div className="header__controls">
          <ClubPicker selectedClub={selectedClub} onClubChange={handleClubChange} />
          <BallDetectionIndicator
            available={cameraStatus.available}
            enabled={cameraStatus.enabled}
            detected={cameraStatus.ball_detected}
            confidence={cameraStatus.ball_confidence}
            onToggle={toggleCamera}
          />
          <ConnectionStatus connected={connected} />
          <button
            className="power-button"
            onClick={() => setShowShutdown(true)}
            title="Shut down"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {showShutdown && (
        <div className="shutdown-overlay">
          <div className="shutdown-dialog">
            <p>Shut down OpenFlight?</p>
            <div className="shutdown-dialog__buttons">
              <button className="shutdown-dialog__confirm" onClick={() => { shutdown(); setShowShutdown(false); }}>
                Shut Down
              </button>
              <button className="shutdown-dialog__cancel" onClick={() => setShowShutdown(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  function handleClubChange(club: string) {
    onClubChange(club);
  }
}
