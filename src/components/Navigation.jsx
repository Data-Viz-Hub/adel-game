import { getLayerProgress, isChapterUnlocked, getLockReason } from '../gameReducer';
import ProgressBar from './shared/ProgressBar';

const CHAPTERS = [
  { id: 1, name: 'Infrastructure', short: 'Infra', color: '#4ade80', icon: '🏗️', progressKey: 'infrastructure' },
  { id: 2, name: 'Data Layer', short: 'Data', color: '#a78bfa', icon: '🗄️', progressKey: 'dataLayer' },
  { id: 3, name: 'Interoperability', short: 'ADEL', color: '#60a5fa', icon: '🔗', progressKey: 'interoperability' },
  { id: 4, name: 'App Services', short: 'Apps', color: '#f59e0b', icon: '⚙️', progressKey: 'appServices' },
  { id: 5, name: 'Channels', short: 'Ch.', color: '#fb923c', icon: '📡', progressKey: 'channels' },
  { id: 6, name: 'Life Events', short: 'Life', color: '#2dd4bf', icon: '🌟', progressKey: 'lifeEvents' },
  { id: 7, name: 'Legal', short: 'Law', color: '#f87171', icon: '⚖️', progressKey: 'legal' },
];

export default function Navigation({ state, dispatch }) {
  const progress = getLayerProgress(state);

  return (
    <div style={{
      background: '#080f1a',
      borderBottom: '1px solid #1e293b',
      padding: '0 24px',
      overflowX: 'auto',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', gap: 4, paddingBottom: 0,
      }}>
        {CHAPTERS.map(ch => {
          const unlocked = isChapterUnlocked(ch.id, progress);
          const lockReasons = getLockReason(ch.id, progress);
          const isActive = state.activeChapter === ch.id;
          const pct = progress[ch.progressKey] || 0;
          const color = ch.color;

          return (
            <button
              key={ch.id}
              onClick={() => {
                if (unlocked) dispatch({ type: 'SET_CHAPTER', chapter: ch.id });
              }}
              title={!unlocked ? `Locked: ${lockReasons.join(', ')}` : ch.name}
              style={{
                padding: '10px 16px 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                color: !unlocked ? '#334155' : isActive ? color : '#64748b',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                minWidth: 90,
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ fontSize: 15, opacity: unlocked ? 1 : 0.3 }}>{ch.icon}</span>
                <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>
                  {ch.name}
                </span>
                {!unlocked && <span style={{ fontSize: 10, color: '#475569' }}>🔒</span>}
              </div>
              <div style={{ width: '100%', height: 3, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: color, opacity: unlocked ? 1 : 0.3,
                  transition: 'width 0.5s',
                }} />
              </div>
              <div style={{ fontSize: 9, color: unlocked ? color : '#334155', fontFamily: "'DM Mono', monospace" }}>
                {pct}%
              </div>

              {/* Lock tooltip */}
              {!unlocked && (
                <div style={{
                  position: 'absolute', bottom: '110%', left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0f172a', border: '1px solid #334155',
                  borderRadius: 6, padding: '6px 10px', width: 200,
                  fontSize: 11, color: '#94a3b8', zIndex: 200,
                  pointerEvents: 'none',
                  display: 'none',
                }} className="lock-tooltip">
                  {lockReasons.map((r, i) => <div key={i}>• {r}</div>)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
