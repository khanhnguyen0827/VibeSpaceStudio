import { useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface SoundChannel {
  id: string;
  name: string;
  vietnameseName: string;
  icon: string;
  url: string;
  volume: number; // 0 to 100
  muted: boolean;
}

const DEFAULT_CHANNELS: SoundChannel[] = [
  {
    id: 'rain',
    name: 'Rain',
    vietnameseName: 'Mưa rơi',
    icon: 'rainy',
    url: 'https://cdn.pixabay.com/audio/2021/09/06/audio_472b509ef7.mp3',
    volume: 30,
    muted: true,
  },
  {
    id: 'campfire',
    name: 'Campfire',
    vietnameseName: 'Lửa trại',
    icon: 'local_fire_department',
    url: 'https://cdn.pixabay.com/audio/2021/08/09/audio_82c1615894.mp3',
    volume: 0,
    muted: true,
  },
  {
    id: 'wind',
    name: 'Wind',
    vietnameseName: 'Tiếng gió',
    icon: 'air',
    url: 'https://cdn.pixabay.com/audio/2022/03/09/audio_8fa099ee70.mp3',
    volume: 0,
    muted: true,
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    vietnameseName: 'Sóng biển',
    icon: 'waves',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2e2930263f.mp3',
    volume: 0,
    muted: true,
  },
  {
    id: 'cafe',
    name: 'Cafe Ambience',
    vietnameseName: 'Quán cà phê',
    icon: 'local_cafe',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_4f09d8469e.mp3',
    volume: 0,
    muted: true,
  },
  {
    id: 'birds',
    name: 'Forest Birds',
    vietnameseName: 'Chim rừng',
    icon: 'forest',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_e204c355bc.mp3',
    volume: 0,
    muted: true,
  },
  {
    id: 'keyboard',
    name: 'Keyboard Typing',
    vietnameseName: 'Tiếng gõ phím',
    icon: 'keyboard',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_51f0ee0434.mp3',
    volume: 0,
    muted: true,
  },
];

export function useAudioMix() {
  const [channels, setChannels] = useLocalStorage<SoundChannel[]>('vibespace_white_noise', DEFAULT_CHANNELS);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Initialize audio elements once
  useEffect(() => {
    channels.forEach((channel) => {
      if (!audioRefs.current[channel.id]) {
        const audio = new Audio(channel.url);
        audio.loop = true;
        audio.preload = 'none'; // Preload when needed to save bandwidth
        audioRefs.current[channel.id] = audio;
      }
    });

    // Cleanup on unmount
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
      });
    };
  }, []);

  // Update audio instances when state changes
  useEffect(() => {
    channels.forEach((channel) => {
      const audio = audioRefs.current[channel.id];
      if (audio) {
        // Update volume (0.0 to 1.0)
        audio.volume = channel.volume / 100;
        
        // Handle play / pause based on volume and mute states
        const shouldPlay = channel.volume > 0 && !channel.muted;
        
        if (shouldPlay) {
          if (audio.paused) {
            audio.play().catch((err) => {
              // Browser requires user interaction before autoplay
              console.log('Audio autoplay blocked or failed:', err);
            });
          }
        } else {
          if (!audio.paused) {
            audio.pause();
          }
        }
      }
    });
  }, [channels]);

  // Set volume for a specific channel
  const setVolume = (id: string, volume: number) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          return {
            ...ch,
            volume,
            // Automatically unmute if setting volume above 0
            muted: volume === 0 ? true : false,
          };
        }
        return ch;
      })
    );
  };

  // Toggle mute state for a channel
  const toggleMute = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          // If unmuting a muted channel with 0 volume, set volume to 50
          const newMuted = !ch.muted;
          const newVolume = !newMuted && ch.volume === 0 ? 50 : ch.volume;
          return {
            ...ch,
            muted: newMuted,
            volume: newVolume,
          };
        }
        return ch;
      })
    );
  };

  // Reset entire mix (mute all)
  const resetMix = () => {
    setChannels((prev) =>
      prev.map((ch) => ({
        ...ch,
        volume: 0,
        muted: true,
      }))
    );
  };

  return {
    channels,
    setVolume,
    toggleMute,
    resetMix,
  };
}
