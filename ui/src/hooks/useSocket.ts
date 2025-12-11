import { useEffect, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { Shot, SessionStats, SessionState } from '../types/shot';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [latestShot, setLatestShot] = useState<Shot | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      newSocket.emit('get_session');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('shot', (data: { shot: Shot; stats: SessionStats }) => {
      console.log('Shot received:', data);
      setLatestShot(data.shot);
      setShots((prev) => [...prev, data.shot]);
      setStats(data.stats);
    });

    newSocket.on('session_state', (data: SessionState & { mock_mode?: boolean }) => {
      console.log('Session state received:', data);
      setShots(data.shots);
      setStats(data.stats);
      if (data.mock_mode !== undefined) {
        setMockMode(data.mock_mode);
      }
      if (data.shots.length > 0) {
        setLatestShot(data.shots[data.shots.length - 1]);
      }
    });

    newSocket.on('session_cleared', () => {
      setShots([]);
      setStats(null);
      setLatestShot(null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const clearSession = useCallback(() => {
    socket?.emit('clear_session');
  }, [socket]);

  const setClub = useCallback((club: string) => {
    socket?.emit('set_club', { club });
  }, [socket]);

  const simulateShot = useCallback(() => {
    socket?.emit('simulate_shot');
  }, [socket]);

  return {
    connected,
    mockMode,
    latestShot,
    shots,
    stats,
    clearSession,
    setClub,
    simulateShot,
  };
}
