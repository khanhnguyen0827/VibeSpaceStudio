import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type TimerMode = 'focus' | 'short_break' | 'long_break';

export interface PomodoroDurations {
  focus: number; // in minutes
  short_break: number; // in minutes
  long_break: number; // in minutes
}

const DEFAULT_DURATIONS: PomodoroDurations = {
  focus: 25,
  short_break: 5,
  long_break: 15,
};

export function usePomodoro() {
  const [durations, setDurations] = useLocalStorage<PomodoroDurations>('vibespace_pomodoro_durations', DEFAULT_DURATIONS);
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(durations.focus * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useLocalStorage<number>('vibespace_pomodoro_sessions', 1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync timeLeft when durations or mode change, if timer is not running
  useEffect(() => {
    if (!isRunning) {
      resetTimer(timerMode, durations);
    }
  }, [durations, timerMode]);

  // Main countdown timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed!
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playChimeSound();
            handleModeCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timerMode]);

  // Sync browser tab title with timer countdown
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    let modeLabel = 'Focus';
    if (timerMode === 'short_break') modeLabel = 'Short Break';
    if (timerMode === 'long_break') modeLabel = 'Long Break';

    if (isRunning) {
      document.title = `(${formattedTime}) ${modeLabel} | VibeSpace`;
    } else {
      document.title = 'VibeSpace Focus Dashboard';
    }
  }, [timeLeft, isRunning, timerMode]);

  // Synthesize a beautiful, high-quality two-tone bell chime using Web Audio API
  const playChimeSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Play high chime tone (A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 1.2);
      
      // Play secondary lower chime tone after offset (E5)
      setTimeout(() => {
        if (ctx.state === 'closed') return;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 1.5);
      }, 180);
    } catch (e) {
      console.warn('Failed to play AudioContext chime:', e);
    }
  };

  const handleModeCompletion = () => {
    if (timerMode === 'focus') {
      // Completed focus: automatically recommend short break
      setTimerMode('short_break');
      // Increment focus sessions count
      setSessionCount((prev) => (prev % 4 === 0 ? 1 : prev + 1));
    } else {
      // Completed break: go back to focus
      setTimerMode('focus');
    }
  };

  const toggleStart = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (mode: TimerMode = timerMode, currentDurations: PomodoroDurations = durations) => {
    setIsRunning(false);
    if (mode === 'focus') {
      setTimeLeft(currentDurations.focus * 60);
    } else if (mode === 'short_break') {
      setTimeLeft(currentDurations.short_break * 60);
    } else if (mode === 'long_break') {
      setTimeLeft(currentDurations.long_break * 60);
    }
  };

  const skipMode = () => {
    setIsRunning(false);
    handleModeCompletion();
  };

  const changeDurations = (newDurations: PomodoroDurations) => {
    setDurations(newDurations);
  };

  return {
    timeLeft,
    isRunning,
    timerMode,
    sessionCount,
    durations,
    setTimerMode,
    toggleStart,
    resetTimer,
    skipMode,
    changeDurations,
  };
}
