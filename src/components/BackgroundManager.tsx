
export interface BackgroundOption {
  id: string;
  name: string;
  vietnameseName: string;
  type: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
}

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'pine-forest',
    name: 'Pine Forest',
    vietnameseName: 'Rừng thông',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-trees-from-below-vertical-shot-4416-large.mp4',
  },
  {
    id: 'ocean',
    name: 'Ocean Shore',
    vietnameseName: 'Bờ biển',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-rocks-from-above-41584-large.mp4',
  },
  {
    id: 'cozy-rain',
    name: 'Rainy Window',
    vietnameseName: 'Đô thị mưa',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-drops-on-a-window-view-12344-large.mp4',
  },
  {
    id: 'campfire',
    name: 'Campfire',
    vietnameseName: 'Lửa trại',
    type: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bonfire-burning-in-the-forest-at-night-42861-large.mp4',
  },
  {
    id: 'mountain',
    name: 'Mountain Sunset',
    vietnameseName: 'Núi non',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  },
];

interface BackgroundManagerProps {
  currentBgId: string;
  onChangeBg: (id: string) => void;
  bgOpacity: number; // 0 to 100 (where 0 means fully black, 100 means full brightness)
  onChangeOpacity: (opacity: number) => void;
  isVideoEnabled: boolean;
  onToggleVideo: () => void;
}

export function BackgroundManager({
  currentBgId,
  onChangeBg,
  bgOpacity,
  onChangeOpacity,
  isVideoEnabled,
  onToggleVideo,
}: BackgroundManagerProps) {
  const currentBg = BACKGROUNDS.find((bg) => bg.id === currentBgId) || BACKGROUNDS[0];

  // Opacity conversion (0-100% brightness is converted to opacity overlay of black backdrop)
  // When brightness is 100%, black overlay is 0% opacity (visible). When brightness is 20%, black overlay is 80% opacity (dark).
  const overlayOpacity = (100 - bgOpacity) / 100;

  return (
    <>
      {/* Background Visual Layer */}
      <div className="ambient-bg" style={{ backgroundImage: `url(${currentBg.imageUrl})` }}>
        {isVideoEnabled && currentBg.videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            key={currentBg.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <source src={currentBg.videoUrl} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Dark Overlay Layer for Dimming Control */}
      <div
        className="ambient-overlay"
        style={{
          opacity: overlayOpacity,
          backgroundColor: '#000000',
        }}
      />

      {/* Floating Background Selector Controls Panel (typically at bottom drawer) */}
      <div className="glass-panel spring-transition" style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        gap: '1.5rem',
        pointerEvents: 'auto',
      }}>
        {/* Toggle Video/Image */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onToggleVideo}
            className="icon-btn"
            title={isVideoEnabled ? 'Chuyển sang ảnh tĩnh' : 'Chuyển sang video'}
            style={{ color: isVideoEnabled ? 'var(--sunrise-tangerine)' : 'var(--lavender-slate)' }}
          >
            <span className="material-symbols-outlined">
              {isVideoEnabled ? 'video_settings' : 'image'}
            </span>
          </button>
          <span className="text-mono" style={{ fontSize: '12px', color: 'var(--lavender-slate)' }}>
            {isVideoEnabled ? 'Video' : 'Ảnh'}
          </span>
        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--glass-glow-border)' }} />

        {/* Thumbnail Selector list */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {BACKGROUNDS.map((bg) => {
            const isSelected = bg.id === currentBgId;
            return (
              <button
                key={bg.id}
                onClick={() => onChangeBg(bg.id)}
                className="interactive-element"
                style={{
                  border: isSelected ? '2px solid var(--sunrise-tangerine)' : '1px solid var(--glass-glow-border)',
                  borderRadius: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: isSelected ? 'rgba(255, 123, 107, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? 'var(--sunrise-tangerine)' : 'var(--frost-white)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  transition: 'all 0.2s',
                }}
              >
                {bg.vietnameseName}
              </button>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--glass-glow-border)' }} />

        {/* Brightness Dim Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '120px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--lavender-slate)' }}>
            wb_sunny
          </span>
          <input
            type="range"
            min="10"
            max="100"
            value={bgOpacity}
            onChange={(e) => onChangeOpacity(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </>
  );
}
