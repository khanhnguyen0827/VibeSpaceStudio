import type { SoundChannel } from '../hooks/useAudioMix';

interface SoundMixerProps {
  channels: SoundChannel[];
  setVolume: (id: string, volume: number) => void;
  toggleMute: (id: string) => void;
  resetMix: () => void;
}

export function SoundMixer({ channels, setVolume, toggleMute, resetMix }: SoundMixerProps) {
  return (
    <div className="flex-column" style={{ gap: '1rem' }}>
      {/* Mixer Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--glass-glow-border)',
          paddingBottom: '0.5rem',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--frost-white)' }}>
          Tiếng ồn trắng (White Noise)
        </h3>
        <button
          onClick={resetMix}
          className="text-mono"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--lavender-slate)',
            fontSize: '11px',
            cursor: 'pointer',
            padding: '0.2rem 0.5rem',
            borderRadius: '0.35rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sunrise-tangerine)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--lavender-slate)')}
        >
          Đặt lại Mixer
        </button>
      </div>

      {/* Mixer channels slider list */}
      <div
        className="custom-scrollbar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxHeight: '280px',
          overflowY: 'auto',
          paddingRight: '0.25rem',
        }}
      >
        {channels.map((channel) => {
          const isChannelActive = channel.volume > 0 && !channel.muted;
          return (
            <div
              key={channel.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: isChannelActive ? 1 : 0.45,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Channel Icon indicator */}
              <div
                style={{
                  width: '28px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: isChannelActive ? 'var(--sunrise-tangerine)' : 'var(--lavender-slate)',
                  transition: 'color 0.2s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {channel.icon}
                </span>
              </div>

              {/* Channel label and slider */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--frost-white)' }}>{channel.vietnameseName}</span>
                  <span className="text-mono" style={{ color: 'var(--lavender-slate)' }}>{channel.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={channel.volume}
                  onChange={(e) => setVolume(channel.id, Number(e.target.value))}
                />
              </div>

              {/* Mute button toggle */}
              <button
                onClick={() => toggleMute(channel.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isChannelActive ? 'var(--lavender-slate)' : 'var(--glass-glow-border)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sunrise-tangerine)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isChannelActive ? 'var(--lavender-slate)' : 'var(--glass-glow-border)')}
                title={isChannelActive ? 'Tắt âm' : 'Bật âm'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {isChannelActive ? 'volume_up' : 'volume_off'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
