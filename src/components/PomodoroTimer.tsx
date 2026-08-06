import { useState } from 'react';
import type { TimerMode, PomodoroDurations } from '../hooks/usePomodoro';

interface PomodoroTimerProps {
  timeLeft: number;
  isRunning: boolean;
  timerMode: TimerMode;
  sessionCount: number;
  durations: PomodoroDurations;
  setTimerMode: (mode: TimerMode) => void;
  toggleStart: () => void;
  resetTimer: () => void;
  skipMode: () => void;
  changeDurations: (newDurations: PomodoroDurations) => void;
}

export function PomodoroTimer({
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
}: PomodoroTimerProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [focusInput, setFocusInput] = useState(durations.focus);
  const [shortInput, setShortInput] = useState(durations.short_break);
  const [longInput, setLongInput] = useState(durations.long_break);

  // Formatting remaining time to mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate circular progress
  const totalSeconds =
    timerMode === 'focus'
      ? durations.focus * 60
      : timerMode === 'short_break'
      ? durations.short_break * 60
      : durations.long_break * 60;

  const progressPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  // Circumference of r=45 is 2 * PI * 45 ≈ 282.74
  const strokeDashoffset = 283 - (progressPercent / 100) * 283;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    changeDurations({
      focus: focusInput,
      short_break: shortInput,
      long_break: longInput,
    });
    setShowSettings(false);
  };

  return (
    <div
      className="flex-column align-center fade-up-anim"
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '1.5rem',
        animationDelay: '0.2s',
      }}
    >
      {/* Mode Switcher Tabs */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          padding: '0.35rem',
          borderRadius: '9999px',
          marginBottom: '2rem',
          gap: '0.25rem',
        }}
      >
        {(['focus', 'short_break', 'long_break'] as TimerMode[]).map((mode) => {
          const isActive = timerMode === mode;
          let modeLabel = 'Tập trung';
          if (mode === 'short_break') modeLabel = 'Nghỉ ngắn';
          if (mode === 'long_break') modeLabel = 'Nghỉ dài';

          return (
            <button
              key={mode}
              onClick={() => {
                setTimerMode(mode);
                resetTimer();
              }}
              className="interactive-element"
              style={{
                border: 'none',
                background: isActive ? 'var(--frosted-panel)' : 'transparent',
                color: isActive ? 'var(--sunrise-tangerine)' : 'var(--lavender-slate)',
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s',
              }}
            >
              {modeLabel}
            </button>
          );
        })}
      </div>

      {/* Clock Face Circle */}
      <div
        className="relative flex align-center justify-between"
        style={{
          width: '280px',
          height: '280px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        {/* SVG Progress Ring */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'rotate(-90deg)',
          }}
          viewBox="0 0 100 100"
        >
          {/* Background circle track */}
          <circle cx="50" cy="50" fill="none" r="45" stroke="var(--glass-glow-border)" strokeWidth="1.5" />
          {/* Active progress arc path */}
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="var(--sunrise-tangerine)"
            strokeWidth="2.5"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: isRunning ? 'drop-shadow(0 0 6px var(--sunrise-tangerine-glow))' : 'none',
              transition: 'stroke-dashoffset 0.5s ease',
            }}
          />
        </svg>

        {/* Remaining Time Number Display */}
        <div
          className="text-mono"
          style={{
            fontSize: '56px',
            fontWeight: 500,
            color: 'var(--frost-white)',
            zIndex: 10,
            letterSpacing: '-0.02em',
            textShadow: isRunning ? '0 0 15px rgba(255, 123, 107, 0.25)' : 'none',
          }}
        >
          {formattedTime}
        </div>
      </div>

      {/* Controller Buttons Bar */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 2rem',
          borderRadius: '9999px',
          gap: '1.75rem',
        }}
      >
        {/* Reset button */}
        <button onClick={resetTimer} className="icon-btn" title="Đặt lại đồng hồ">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
            restart_alt
          </span>
        </button>

        {/* Start / Pause center toggle */}
        <button
          onClick={toggleStart}
          className="interactive-element"
          style={{
            border: 'none',
            background: 'var(--sunrise-tangerine)',
            color: 'var(--canvas-bg)',
            width: '3.75rem',
            height: '3.75rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 15px var(--sunrise-tangerine-glow)',
          }}
          title={isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Skip button */}
        <button onClick={skipMode} className="icon-btn" title="Bỏ qua chế độ">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
            skip_next
          </span>
        </button>
      </div>

      {/* Sessions tracker & Settings toggle */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '13px',
          color: 'var(--lavender-slate)',
        }}
      >
        <span className="text-mono">Chu kỳ: {sessionCount} / 4</span>
        <span style={{ color: 'var(--glass-glow-border)' }}>|</span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--lavender-slate)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '13px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            tune
          </span>
          Cấu hình giờ
        </button>
      </div>

      {/* Duration customizer overlay */}
      {showSettings && (
        <form
          onSubmit={handleSaveSettings}
          className="glass-panel"
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h4 style={{ fontSize: '15px', color: 'var(--frost-white)', borderBottom: '1px solid var(--glass-glow-border)', paddingBottom: '0.5rem' }}>
            Cấu hình thời gian (phút)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--lavender-slate)', display: 'block', marginBottom: '0.25rem' }}>
                Tập trung
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={focusInput}
                onChange={(e) => setFocusInput(Number(e.target.value))}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-glow-border)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  color: 'var(--frost-white)',
                  textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--lavender-slate)', display: 'block', marginBottom: '0.25rem' }}>
                Nghỉ ngắn
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={shortInput}
                onChange={(e) => setShortInput(Number(e.target.value))}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-glow-border)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  color: 'var(--frost-white)',
                  textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--lavender-slate)', display: 'block', marginBottom: '0.25rem' }}>
                Nghỉ dài
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={longInput}
                onChange={(e) => setLongInput(Number(e.target.value))}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-glow-border)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  color: 'var(--frost-white)',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--lavender-slate)',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="interactive-element"
              style={{
                backgroundColor: 'var(--sunrise-tangerine)',
                border: 'none',
                color: 'var(--canvas-bg)',
                borderRadius: '0.5rem',
                padding: '0.35rem 1rem',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              Lưu
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
