import { useState, useMemo } from 'react';
import type { Shot } from '../types/shot';
import { computeStats, getUniqueClubs } from '../types/shot';
import './StatsView.css';

interface StatsViewProps {
  shots: Shot[];
  onClearSession: () => void;
}

export function StatsView({ shots, onClearSession }: StatsViewProps) {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  const availableClubs = useMemo(() => getUniqueClubs(shots), [shots]);

  const filteredShots = useMemo(() => {
    if (selectedClub === null) return shots;
    return shots.filter((s) => s.club === selectedClub);
  }, [shots, selectedClub]);

  const stats = useMemo(() => computeStats(filteredShots), [filteredShots]);

  if (shots.length === 0) {
    return (
      <div className="stats-view stats-view--empty">
        <p>No shots recorded yet</p>
      </div>
    );
  }

  return (
    <div className="stats-view">
      {/* Club Filter Tabs */}
      <div className="club-tabs">
        <button
          className={`club-tabs__tab ${selectedClub === null ? 'club-tabs__tab--active' : ''}`}
          onClick={() => setSelectedClub(null)}
        >
          All ({shots.length})
        </button>
        {availableClubs.map((club) => {
          const count = shots.filter((s) => s.club === club).length;
          return (
            <button
              key={club}
              className={`club-tabs__tab ${selectedClub === club ? 'club-tabs__tab--active' : ''}`}
              onClick={() => setSelectedClub(club)}
            >
              {club.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card__value">{stats.shot_count}</span>
          <span className="stat-card__label">Shots</span>
        </div>
        <div className="stat-card stat-card--primary">
          <span className="stat-card__value">{stats.avg_ball_speed.toFixed(1)}</span>
          <span className="stat-card__label">Avg Ball</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{stats.max_ball_speed.toFixed(1)}</span>
          <span className="stat-card__label">Max Ball</span>
        </div>
        <div className="stat-card stat-card--primary">
          <span className="stat-card__value">{stats.avg_carry_est.toFixed(0)}</span>
          <span className="stat-card__label">Avg Carry</span>
        </div>
        {stats.avg_club_speed && (
          <div className="stat-card">
            <span className="stat-card__value">{stats.avg_club_speed.toFixed(1)}</span>
            <span className="stat-card__label">Avg Club</span>
          </div>
        )}
        {stats.avg_smash_factor && (
          <div className="stat-card">
            <span className="stat-card__value">{stats.avg_smash_factor.toFixed(2)}</span>
            <span className="stat-card__label">Avg Smash</span>
          </div>
        )}
      </div>

      {/* Clear Button */}
      <button className="clear-button" onClick={onClearSession}>
        Clear Session
      </button>
    </div>
  );
}
