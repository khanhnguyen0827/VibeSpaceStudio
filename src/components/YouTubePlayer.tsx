import React, { useEffect, useRef, useState } from 'react';

export interface CuratedStream {
  id: string;
  title: string;
  channel: string;
  videoId: string;
}

const CURATED_STREAMS: CuratedStream[] = [
  {
    id: 'lofi-girl',
    title: 'Lofi Hip Hop Radio 🐾 Beats to Relax/Study',
    channel: 'Lofi Girl',
    videoId: 'jfKfPfyJRdk',
  },
  {
    id: 'chillhop',
    title: 'Chillhop Radio ☕ Beats to study/relax',
    channel: 'Chillhop Music',
    videoId: '5ypzR7_fN-4',
  },
  {
    id: 'cozy-cafe',
    title: 'Cozy Coffee Shop Lofi ☕ Jazz Lofi Beats',
    channel: 'Cozy Lofi',
    videoId: 'lP26UCnoVMU',
  },
  {
    id: 'synthwave',
    title: 'Synthwave Radio 🌌 Retro Synth beats',
    channel: 'Lofi Girl Synthwave',
    videoId: '4xDzrJKXOOY',
  },
  {
    id: 'jazz-lofi',
    title: 'Jazz Lofi Radio 🎷 Smooth Jazz Beats',
    channel: 'Lofi Jazz Cafe',
    videoId: 'kgx4XNHqiPE',
  },
];

interface YouTubePlayerProps {
  volume: number; // 0 to 100
  onVolumeChange: (vol: number) => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export function YouTubePlayer({ volume, onVolumeChange }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStream, setCurrentStream] = useState<CuratedStream>(CURATED_STREAMS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const playerRef = useRef<any>(null);
  const iframeContainerId = 'youtube-hidden-player';

  // Load YouTube script once
  useEffect(() => {
    if (window.YT) {
      setIsApiLoaded(true);
      return;
    }

    // Embed tag
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiLoaded(true);
    };

    return () => {
      // Avoid polluting window
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, []);

  // Initialize YT Player when api loads
  useEffect(() => {
    if (!isApiLoaded) return;

    try {
      playerRef.current = new window.YT.Player(iframeContainerId, {
        height: '1px',
        width: '1px',
        videoId: currentStream.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
            }
          },
        },
      });
    } catch (e) {
      console.error('Failed to create YouTube player instance:', e);
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isApiLoaded]);

  // Sync volume state with YT Player volume
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleSelectStream = (stream: CuratedStream) => {
    setCurrentStream(stream);
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById(stream.videoId);
    }
  };

  // Helper to extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(customUrl);
    if (videoId) {
      const newStream: CuratedStream = {
        id: 'custom',
        title: 'Custom YouTube Audio Feed',
        channel: 'User Link',
        videoId: videoId,
      };
      setCurrentStream(newStream);
      setIsPlaying(true);
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(videoId);
      }
      setCustomUrl('');
    } else {
      alert('Không tìm thấy ID video hợp lệ trong đường dẫn YouTube của bạn!');
    }
  };

  // Filter curated channels matching query
  const filteredStreams = CURATED_STREAMS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="flex-column"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--glass-glow-border)',
        borderRadius: '1rem',
        padding: '1rem',
        gap: '0.75rem',
      }}
    >
      {/* Hidden YouTube Iframe Placeholder container */}
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <div id={iframeContainerId} />
      </div>

      {/* Music info header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
        <button
          onClick={togglePlay}
          className="interactive-element"
          style={{
            border: 'none',
            background: 'var(--sunrise-tangerine)',
            color: 'var(--canvas-bg)',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <div style={{ flexGrow: 1, overflow: 'hidden' }}>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--frost-white)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentStream.title}
          </p>
          <p
            className="text-mono"
            style={{
              fontSize: '11px',
              color: 'var(--lavender-slate)',
            }}
          >
            {currentStream.channel}
          </p>
        </div>
      </div>

      {/* Volume slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--lavender-slate)' }}>
          {volume === 0 ? 'volume_off' : volume < 50 ? 'volume_down' : 'volume_up'}
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{ flexGrow: 1 }}
        />
        <span className="text-mono" style={{ fontSize: '11px', color: 'var(--lavender-slate)', width: '25px', textAlign: 'right' }}>
          {volume}%
        </span>
      </div>

      {/* Paste direct link form */}
      <form onSubmit={handleCustomUrlSubmit} style={{ display: 'flex', position: 'relative' }}>
        <input
          type="text"
          placeholder="Dán link YouTube tại đây..."
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--glass-glow-border)',
            borderRadius: '0.75rem',
            padding: '0.5rem 2.5rem 0.5rem 0.75rem',
            fontSize: '12px',
            color: 'var(--frost-white)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="interactive-element"
          style={{
            position: 'absolute',
            right: '0.25rem',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'var(--sunrise-tangerine)',
            color: 'var(--canvas-bg)',
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            east
          </span>
        </button>
      </form>

      {/* Curated list selection dropdown / panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '0.25rem', marginBottom: '0.15rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--lavender-slate)', paddingLeft: '0.25rem' }}>
            Chọn luồng nhạc lofi sẵn có:
          </p>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--glass-glow-border)',
              borderRadius: '0.35rem',
              padding: '0.15rem 0.4rem',
              fontSize: '10px',
              color: 'var(--frost-white)',
              width: '90px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--sunrise-tangerine)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--glass-glow-border)')}
          />
        </div>
        <div
          className="custom-scrollbar"
          style={{
            maxHeight: '100px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            paddingRight: '0.25rem',
          }}
        >
          {filteredStreams.map((stream) => {
            const isSelected = stream.videoId === currentStream.videoId;
            return (
              <button
                key={stream.id}
                onClick={() => handleSelectStream(stream)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: isSelected ? 'rgba(255, 123, 107, 0.1)' : 'rgba(255, 255, 255, 0.01)',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  color: isSelected ? 'var(--sunrise-tangerine)' : 'var(--frost-white)',
                  fontSize: '11px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: isSelected ? 'bold' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                  {stream.channel}
                </span>
                <span style={{ fontSize: '9px', opacity: 0.6 }} className="text-mono">
                  {isSelected ? 'Đang phát' : 'Chọn'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
