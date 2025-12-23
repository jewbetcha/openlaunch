import { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import { ShotDisplay } from './components/ShotDisplay';
import { StatsView } from './components/StatsView';
import { ShotList } from './components/ShotList';
import { DebugPanel } from './components/DebugPanel';
import { CameraFeed } from './components/CameraFeed';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ClubPicker } from './components/ClubPicker';
import { BallDetectionIndicator } from './components/BallDetectionIndicator';
import './App.css';

type View = 'live' | 'stats' | 'shots' | 'camera' | 'debug';

function App() {
  const {
    connected,
    mockMode,
    debugMode,
    debugReadings,
    radarConfig,
    latestShot,
    shots,
    cameraStatus,
    clearSession,
    setClub,
    simulateShot,
    toggleDebug,
    updateRadarConfig,
    toggleCamera,
    toggleCameraStream,
  } = useSocket();
  const [currentView, setCurrentView] = useState<View>('live');
  const [selectedClub, setSelectedClub] = useState('driver');

  const handleClubChange = (club: string) => {
    setSelectedClub(club);
    setClub(club);
  };

  return (
    <div className="app">
      <header className="header">
        <img src="/logo-header.png" alt="OpenLaunch" className="header__logo" />
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
        </div>
      </header>

      <nav className="nav">
        <button
          className={`nav__button ${currentView === 'live' ? 'nav__button--active' : ''}`}
          onClick={() => setCurrentView('live')}
        >
          Live
        </button>
        <button
          className={`nav__button ${currentView === 'stats' ? 'nav__button--active' : ''}`}
          onClick={() => setCurrentView('stats')}
        >
          Stats
        </button>
        <button
          className={`nav__button ${currentView === 'shots' ? 'nav__button--active' : ''}`}
          onClick={() => setCurrentView('shots')}
        >
          Shots
          {shots.length > 0 && (
            <span className="nav__badge">{shots.length}</span>
          )}
        </button>
        <button
          className={`nav__button ${currentView === 'camera' ? 'nav__button--active' : ''} ${cameraStatus.streaming ? 'nav__button--streaming' : ''}`}
          onClick={() => setCurrentView('camera')}
        >
          Camera
          {cameraStatus.ball_detected && <span className="nav__ball-dot" />}
        </button>
        <button
          className={`nav__button ${currentView === 'debug' ? 'nav__button--active' : ''} ${debugMode ? 'nav__button--recording' : ''}`}
          onClick={() => setCurrentView('debug')}
        >
          Debug
          {debugMode && <span className="nav__recording-dot" />}
        </button>
      </nav>

      <main className="main">
        {currentView === 'live' && (
          <div className="live-view">
            {latestShot && <div key={latestShot.timestamp} className="shot-flash" />}
            <ShotDisplay key={latestShot?.timestamp} shot={latestShot} isLatest={true} />
            {mockMode && (
              <button className="simulate-button" onClick={simulateShot}>
                Simulate Shot
              </button>
            )}
          </div>
        )}
        {currentView === 'stats' && (
          <StatsView shots={shots} onClearSession={clearSession} />
        )}
        {currentView === 'shots' && (
          <ShotList shots={shots} />
        )}
        {currentView === 'camera' && (
          <CameraFeed
            cameraStatus={cameraStatus}
            onToggleCamera={toggleCamera}
            onToggleStream={toggleCameraStream}
          />
        )}
        {currentView === 'debug' && (
          <DebugPanel
            enabled={debugMode}
            readings={debugReadings}
            radarConfig={radarConfig}
            mockMode={mockMode}
            onToggle={toggleDebug}
            onUpdateConfig={updateRadarConfig}
          />
        )}
      </main>
    </div>
  );
}

export default App;
