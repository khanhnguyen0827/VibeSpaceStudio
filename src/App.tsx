import { useLocalStorage } from './hooks/useLocalStorage';
import { BackgroundManager } from './components/BackgroundManager';
import { TodoList } from './components/TodoList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { YouTubePlayer } from './components/YouTubePlayer';
import { SoundMixer } from './components/SoundMixer';
import { useAudioMix } from './hooks/useAudioMix';
import { usePomodoro } from './hooks/usePomodoro';

function App() {
  // Global Settings and Panel Visibilities
  const [currentBgId, setCurrentBgId] = useLocalStorage<string>('vibespace_bg_id', 'pine-forest');
  const [bgOpacity, setBgOpacity] = useLocalStorage<number>('vibespace_bg_opacity', 60);
  const [isVideoEnabled, setIsVideoEnabled] = useLocalStorage<boolean>('vibespace_video_enabled', true);
  const [youtubeVolume, setYoutubeVolume] = useLocalStorage<number>('vibespace_yt_volume', 40);
  const [showTodoList, setShowTodoList] = useLocalStorage<boolean>('vibespace_show_todo', true);
  const [showAudioBoard, setShowAudioBoard] = useLocalStorage<boolean>('vibespace_show_audio', true);

  // Audio and Pomodoro hook controllers
  const { channels, setVolume, toggleMute, resetMix } = useAudioMix();
  const pomodoro = usePomodoro();

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex-column" style={{ minHeight: '100dvh', position: 'relative' }}>
      {/* Dynamic Nature Background Layer */}
      <BackgroundManager
        currentBgId={currentBgId}
        onChangeBg={setCurrentBgId}
        bgOpacity={bgOpacity}
        onChangeOpacity={setBgOpacity}
        isVideoEnabled={isVideoEnabled}
        onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
      />

      {/* Main Header navigation */}
      <header className="header-bar">
        <div 
          className="text-accent"
          style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '24px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          VibeSpace
        </div>

        <div className="nav-buttons">
          {/* Toggle Todo List panel */}
          <button
            onClick={() => setShowTodoList(!showTodoList)}
            className="icon-btn"
            style={{ color: showTodoList ? 'var(--sunrise-tangerine)' : 'var(--lavender-slate)' }}
            title={showTodoList ? 'Ẩn danh sách việc cần làm' : 'Hiện danh sách việc cần làm'}
          >
            <span className="material-symbols-outlined">playlist_add_check</span>
          </button>

          {/* Toggle Audio panel */}
          <button
            onClick={() => setShowAudioBoard(!showAudioBoard)}
            className="icon-btn"
            style={{ color: showAudioBoard ? 'var(--sunrise-tangerine)' : 'var(--lavender-slate)' }}
            title={showAudioBoard ? 'Ẩn bảng âm thanh' : 'Hiện bảng âm thanh'}
          >
            <span className="material-symbols-outlined">volume_up</span>
          </button>

          {/* Toggle Fullscreen mode */}
          <button
            onClick={toggleFullscreen}
            className="icon-btn"
            title="Bật/Tắt Toàn màn hình"
          >
            <span className="material-symbols-outlined">fullscreen</span>
          </button>
        </div>
      </header>

      {/* Main Grid content wrapper */}
      <main className="dashboard-container">
        <div 
          className="dashboard-grid"
          style={{
            gridTemplateColumns: `
              ${showTodoList ? '3fr' : '0fr'} 
              6fr 
              ${showAudioBoard ? '3fr' : '0fr'}
            `,
            transition: 'grid-template-columns 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
          }}
        >
          {/* Left panel: Task board */}
          <div 
            style={{ 
              opacity: showTodoList ? 1 : 0, 
              visibility: showTodoList ? 'visible' : 'hidden',
              transform: showTodoList ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
              height: 'calc(100vh - 8rem)',
              minWidth: showTodoList ? '250px' : '0px',
            }}
          >
            {showTodoList && <TodoList />}
          </div>

          {/* Center panel: Clock */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: 'calc(100vh - 8rem)',
            }}
          >
            <PomodoroTimer {...pomodoro} />
          </div>

          {/* Right panel: Sound settings board */}
          <div 
            style={{ 
              opacity: showAudioBoard ? 1 : 0, 
              visibility: showAudioBoard ? 'visible' : 'hidden',
              transform: showAudioBoard ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
              height: 'calc(100vh - 8rem)',
              minWidth: showAudioBoard ? '250px' : '0px',
            }}
          >
            {showAudioBoard && (
              <div 
                className="glass-panel flex-column fade-up-anim" 
                style={{ 
                  padding: '1.5rem', 
                  height: '100%',
                  gap: '1.5rem',
                  animationDelay: '0.3s'
                }}
              >
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--frost-white)' }}>
                  Bảng âm thanh
                </h2>

                {/* YouTube player */}
                <YouTubePlayer volume={youtubeVolume} onVolumeChange={setYoutubeVolume} />

                {/* White Noise slider mixer */}
                <SoundMixer
                  channels={channels}
                  setVolume={setVolume}
                  toggleMute={toggleMute}
                  resetMix={resetMix}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer text */}
      <footer 
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '2rem',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <p className="text-mono" style={{ fontSize: '11px', color: 'var(--lavender-slate)', opacity: 0.6 }}>
          VibeSpace — Không cần đăng ký. Dữ liệu lưu cục bộ.
        </p>
      </footer>
    </div>
  );
}

export default App;
