import { getLayerProgress, isChapterUnlocked } from '../gameReducer';
import { C } from '../colors';

const CHAPTERS = [
  { id: 1, name: 'Legal',          icon: '⚖️', key: 'legal' },
  { id: 2, name: 'Infrastructure', icon: '🏗️', key: 'infrastructure' },
  { id: 3, name: 'Data Layer',     icon: '🗄️', key: 'dataLayer' },
  { id: 4, name: 'ADEL Network',   icon: '🔗', key: 'interoperability' },
  { id: 5, name: 'App Services',   icon: '⚙️', key: 'appServices' },
  { id: 6, name: 'Channels',       icon: '📡', key: 'channels' },
  { id: 7, name: 'Life Events',    icon: '🌟', key: 'lifeEvents' },
];

export default function Navigation({ state, dispatch }) {
  const progress = getLayerProgress(state);

  return (
    <div className="nav-bar" style={{
      background: C.CARD,
      borderBottom: `1px solid ${C.BORDER}`,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', padding: '0 8px',
        minWidth: 'max-content',
      }}>
        {CHAPTERS.map(ch => {
          const unlocked = isChapterUnlocked(ch.id, state);
          const isActive = state.activeChapter === ch.id;
          const pct = progress[ch.key] || 0;

          return (
            <button
              key={ch.id}
              onClick={() => dispatch({ type: 'SET_CHAPTER', chapter: ch.id })}
              style={{
                padding: '10px 14px 8px',
                background: 'none', border: 'none',
                borderBottom: isActive ? `3px solid ${C.ORANGE}` : '3px solid transparent',
                color: isActive ? C.ORANGE : C.MUTED,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                minWidth: 80,
                transition: 'color 0.15s',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>{ch.icon}</span>
                <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>
                  {ch.name}
                </span>
                {!unlocked && <span style={{ fontSize: 9, opacity: 0.6 }}>⚠</span>}
              </div>
              {/* Progress bar */}
              <div style={{ width: '100%', height: 2, background: C.BORDER, borderRadius: 1 }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: isActive ? C.ORANGE : C.BLUE,
                  borderRadius: 1, transition: 'width 0.4s',
                  opacity: unlocked ? 1 : 0.2,
                }} />
              </div>
              <div style={{
                fontSize: 9, fontFamily: "'DM Mono', monospace",
                color: isActive ? C.ORANGE : C.FAINT,
                lineHeight: 1,
              }}>
                {pct}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
