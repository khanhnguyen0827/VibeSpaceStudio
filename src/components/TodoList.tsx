import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // date ISO string
}

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('vibespace_todos', [
    { id: '1', text: 'Nhấp liên kết Lofi thư giãn', completed: false, createdAt: new Date().toISOString() },
    { id: '2', text: 'Trộn tiếng mưa và tiếng lửa trại', completed: true, createdAt: new Date().toISOString() },
    { id: '3', text: 'Bắt đầu một chu kỳ Pomodoro tập trung', completed: false, createdAt: new Date().toISOString() },
  ]);
  const [inputValue, setInputValue] = useState('');

  // Smart Daily Reset Logic
  useEffect(() => {
    try {
      const lastVisitDate = localStorage.getItem('vibespace_last_visit');
      const todayDateString = new Date().toDateString(); // e.g. "Thu Aug 06 2026"

      if (lastVisitDate && lastVisitDate !== todayDateString) {
        // A new day has started! Keep only unfinished tasks
        setTodos((prevTodos) => {
          const carriedOverTodos = prevTodos.filter((todo) => !todo.completed);
          // If all tasks were completed, we can initialize with a clean slate
          return carriedOverTodos;
        });
      }

      // Record current date as the last visited session date
      localStorage.setItem('vibespace_last_visit', todayDateString);
    } catch (e) {
      console.warn('Failed to verify daily reset:', e);
    }
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [...prev, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div
      className="glass-panel flex-column fade-up-anim"
      style={{
        padding: '1.5rem',
        height: '100%',
        animationDelay: '0.1s',
      }}
    >
      {/* Title & Counter Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--frost-white)' }}>
          Danh sách việc cần làm
        </h2>
        <span
          className="text-mono"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--glass-glow-border)',
            borderRadius: '9999px',
            fontSize: '11px',
            padding: '0.2rem 0.6rem',
            color: 'var(--lavender-slate)',
          }}
        >
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Task Input form */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', position: 'relative', marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Thêm công việc mới..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--glass-glow-border)',
            borderRadius: '0.75rem',
            padding: '0.75rem 2.5rem 0.75rem 1rem',
            fontSize: '13px',
            color: 'var(--frost-white)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--sunrise-tangerine)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--glass-glow-border)')}
        />
        <button
          type="submit"
          className="interactive-element"
          style={{
            position: 'absolute',
            right: '0.35rem',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'var(--sunrise-tangerine)',
            color: 'var(--canvas-bg)',
            width: '2rem',
            height: '2rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            add
          </span>
        </button>
      </form>

      {/* Todo checklist container */}
      <div
        className="custom-scrollbar"
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          paddingRight: '0.25rem',
        }}
      >
        {todos.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '120px',
              color: 'var(--lavender-slate)',
              fontSize: '13px',
              textAlign: 'center',
              opacity: 0.7,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px', marginBottom: '0.5rem' }}>
              playlist_add_check
            </span>
            Hôm nay chưa có việc gì.<br />Hãy thêm công việc mới nhé!
          </div>
        ) : (
          todos.map((todo) => {
            return (
              <div
                key={todo.id}
                className="task-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid transparent',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'var(--glass-glow-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Styled checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="custom-checkbox"
                  style={{ marginRight: '0.75rem', flexShrink: 0 }}
                />

                {/* Text */}
                <span
                  className="task-text"
                  onClick={() => toggleTodo(todo.id)}
                  style={{
                    fontSize: '13px',
                    color: 'var(--frost-white)',
                    flexGrow: 1,
                    userSelect: 'none',
                    lineHeight: '1.4',
                  }}
                >
                  {todo.text}
                </span>

                {/* Delete button */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="interactive-element task-delete-btn"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--lavender-slate)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    marginLeft: '0.5rem',
                    opacity: 0,
                    transition: 'opacity 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff6b6b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--lavender-slate)')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    delete
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info showing Auto-reset */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--glass-glow-border)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span
          className="text-mono"
          style={{
            fontSize: '11px',
            color: 'var(--lavender-slate)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            sync
          </span>
          Đã bật tự động reset ngày mới
        </span>
      </div>

      {/* CSS helper injector */}
      <style>{`
        .task-item:hover .task-delete-btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
