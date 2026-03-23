import { getLayerProgress } from '../gameReducer';
import { C } from '../colors';

const LAYERS = [
  { name: 'Infrastructure',   key: 'infrastructure',   target: 80 },
  { name: 'Data Layer',       key: 'dataLayer',        target: 80 },
  { name: 'Interoperability', key: 'interoperability', target: 80 },
  { name: 'App Services',     key: 'appServices',      target: 70 },
  { name: 'Channels',         key: 'channels',         target: 75 },
  { name: 'Life Events',      key: 'lifeEvents',       target: 75 },
  { name: 'Legal',            key: 'legal',            target: 60 },
];

export default function GameOverScreen({ state, onRestart }) {
  const progress = getLayerProgress(state);
  const lawsEnacted = state.laws.filter(l => l.enacted).length;

  // Score: weighted average of layer completion vs targets
  const score = Math.round(
    LAYERS.reduce((sum, l) => sum + Math.min(100, Math.round(progress[l.key] / l.target * 100)), 0) / LAYERS.length
  );

  const grade = score >= 90 ? { label: 'A', color: C.BLUE }
    : score >= 75 ? { label: 'B', color: C.ORANGE }
    : score >= 55 ? { label: 'C', color: '#ECC94B' }
    : { label: 'F', color: '#E53E3E' };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(3,8,18,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px 16px', overflowY: 'auto',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        maxWidth: 560, width: '100%', textAlign: 'center',
        animation: 'spin-in 0.35s ease',
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>⌛</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(26px, 6vw, 38px)',
          fontWeight: 900, color: '#E53E3E',
          margin: '0 0 8px', letterSpacing: '0.03em',
        }}>
          Deadline Missed
        </h1>
        <p style={{ color: C.MUTED, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          January 1, 2027 arrived and Armenia's digital transformation
          was not complete. The new government cancelled the programme.
        </p>

        {/* Grade */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
          border: `3px solid ${grade.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, fontWeight: 900, color: grade.color,
          fontFamily: "'Cormorant Garamond', serif",
          boxShadow: `0 0 24px ${grade.color}44`,
        }}>
          {grade.label}
        </div>
        <div style={{ fontSize: 12, color: C.MUTED, marginBottom: 24 }}>
          Completion score: <strong style={{ color: grade.color }}>{score}%</strong> of targets reached
        </div>

        {/* Layer results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24, textAlign: 'left' }}>
          {LAYERS.map(l => {
            const pct = progress[l.key];
            const met = pct >= l.target;
            return (
              <div key={l.key} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px',
                background: C.CARD, border: `1px solid ${met ? C.BLUE + '55' : '#E53E3E33'}`,
                borderRadius: 7,
              }}>
                <span style={{ fontSize: 14, color: met ? C.BLUE : '#FC8181', flexShrink: 0 }}>
                  {met ? '✓' : '✗'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: C.TEXT }}>{l.name}</span>
                    <span style={{ color: met ? C.BLUE : '#FC8181', fontFamily: "'DM Mono', monospace" }}>
                      {pct}% / {l.target}%
                    </span>
                  </div>
                  <div style={{ height: 4, background: C.RAISED, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: met ? C.BLUE : '#E53E3E',
                      borderRadius: 2,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{
            padding: '8px 12px',
            background: C.CARD,
            border: `1px solid ${lawsEnacted >= 3 ? C.BLUE + '55' : '#E53E3E33'}`,
            borderRadius: 7, fontSize: 12, color: C.TEXT,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Laws enacted</span>
            <span style={{
              color: lawsEnacted >= 3 ? C.BLUE : '#FC8181',
              fontFamily: "'DM Mono', monospace",
            }}>
              {lawsEnacted >= 3 ? '✓' : '✗'} {lawsEnacted} / 3 required
            </span>
          </div>
        </div>

        <button
          onClick={onRestart}
          style={{
            width: '100%', padding: '14px',
            background: C.BLUE_DIM, border: `2px solid ${C.BLUE}`,
            color: C.TEXT, borderRadius: 10,
            cursor: 'pointer', fontSize: 15, fontWeight: 700,
          }}
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}
