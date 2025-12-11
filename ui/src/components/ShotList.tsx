import type { Shot } from '../types/shot';
import './ShotList.css';

interface ShotListProps {
  shots: Shot[];
}

export function ShotList({ shots }: ShotListProps) {
  const reversedShots = [...shots].reverse();

  if (shots.length === 0) {
    return (
      <div className="shot-list shot-list--empty">
        <p>No shots recorded yet</p>
      </div>
    );
  }

  return (
    <div className="shot-list">
      {reversedShots.map((shot, index) => (
        <div key={shot.timestamp} className="shot-row">
          <span className="shot-row__number">#{shots.length - index}</span>
          <span className="shot-row__club">{shot.club}</span>
          <span className="shot-row__speed">{shot.ball_speed_mph.toFixed(1)}</span>
          <span className="shot-row__carry">{shot.estimated_carry_yards} yds</span>
          {shot.smash_factor && (
            <span className="shot-row__smash">{shot.smash_factor.toFixed(2)}</span>
          )}
        </div>
      ))}
    </div>
  );
}
