import { useMemo } from 'react';
import { useShotContext } from '../state/useShotContext';
import './ShotDisplay.css';

function getConfidenceClass(confidence: number): 'low' | 'medium' | 'high' {
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.4) return 'medium';
  return 'low';
}

interface ShotDisplayProps {
  animate?: boolean;
}

export function ShotDisplay({ animate }: ShotDisplayProps) {
  const { latestShot } = useShotContext();
  const shot = latestShot;

  const carryRange = useMemo(() => {
    if (!shot) return null;
    return `${shot.carry_range[0]}–${shot.carry_range[1]} yds`;
  }, [shot]);

  if (!shot) {
    return (
      <div className="shot-display shot-display--empty">
        <p>Awaiting shot...</p>
      </div>
    );
  }

  return (
    <div className={`shot-display ${animate ? 'shot-display--animate' : ''}`}>
      <div className="shot-display__main">
        <div className="shot-display__value shot-display__value--large">
          <span className="value">{shot.ball_speed_mph.toFixed(1)}</span>
          <span className="unit">MPH</span>
          <span className="label">Ball Speed</span>
        </div>
        <div className="shot-display__value shot-display__value--large">
          <span className="value">{shot.estimated_carry_yards}</span>
          <span className="unit">YDS</span>
          <span className="label">Carry (Est)</span>
          {carryRange && <span className="shot-display__range">{carryRange}</span>}
        </div>
      </div>

      <div className="shot-display__secondary">
        <div className="shot-display__value">
          <span className="value">{shot.club_speed_mph ? shot.club_speed_mph.toFixed(1) : '--'}</span>
          <span className="unit">MPH</span>
          <span className="label">Club Speed</span>
        </div>
        <div className="shot-display__value">
          <span className="value">{shot.smash_factor ? shot.smash_factor.toFixed(2) : '--'}</span>
          <span className="unit">SF</span>
          <span className="label">Smash Factor</span>
        </div>
        <div className="shot-display__value">
          <span className="value">
            {shot.launch_angle_vertical !== null ? `${shot.launch_angle_vertical.toFixed(1)}°` : '--'}
          </span>
          {shot.launch_angle_confidence !== null && (
            <span
              className={`shot-display__confidence shot-display__confidence--${getConfidenceClass(
                shot.launch_angle_confidence
              )}`}
              title={`Confidence: ${(shot.launch_angle_confidence * 100).toFixed(0)}%`}
            />
          )}
          <span className="label">Launch Angle</span>
        </div>
        <div className="shot-display__value">
          <span className="value">
            {shot.spin_rpm !== null ? shot.spin_rpm.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '--'}
          </span>
          <span className="unit">RPM</span>
          <span className="label">Spin Rate</span>
        </div>
      </div>
    </div>
  );
}
