import { getLayerProgress } from '../gameReducer';
import { C } from '../colors';

const LAYERS = [
  { name: 'Infrastructure',    key: 'infrastructure' },
  { name: 'Data Layer',        key: 'dataLayer' },
  { name: 'Interoperability',  key: 'interoperability' },
  { name: 'App Services',      key: 'appServices' },
  { name: 'Channels',          key: 'channels' },
  { name: 'Life Events',       key: 'lifeEvents' },
  { name: 'Legal',             key: 'legal' },
];

export default function VictoryScreen({ state, onClose }) {
  const progress = getLayerProgress(state);
  const stars = Array.from({ length: 50 });

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: `radial-gradient(ellipse at center, ${C.BLUE_DIM} 0%, ${C.BG} 70%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, overflowY: 'auto', padding: '20px 16px',
    }}>
      {/* Stars */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {stars.map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
            background: i % 2 === 0 ? C.ORANGE : C.BLUE,
            borderRadius: '50%',
            animation: `twinkle ${1.5 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center', maxWidth: 640, position: 'relative', animation: 'spin-in 0.4s ease' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🇦🇲</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(28px, 6vw, 42px)',
          fontWeight: 900, margin: '0 0 8px',
          color: C.ORANGE, letterSpacing: '0.04em',
        }}>
          Digital Armenia Achieved
        </h1>

        <p style={{ fontSize: 14, color: C.MUTED, margin: '0 0 28px', lineHeight: 1.6 }}>
          You have architected Armenia's national digital transformation.<br />
          7 layers built. Citizens empowered. Services seamless.
        </p>

        {/* Key metrics */}
        <div className="grid-4" style={{ marginBottom: 24, gap: 8 }}>
          {[
            { label: 'Satisfaction',  value: `${state.citizenSatisfaction}%` },
            { label: 'Interop',       value: `${state.interoperabilityScore}%` },
            { label: 'Trust',         value: `${state.trustIndex}%` },
            { label: 'Duplicates',    value: state.duplicatesRemaining },
          ].map(m => (
            <div key={m.label} style={{
              padding: '12px 8px', background: C.CARD,
              border: `1px solid ${C.BORDER}`, borderRadius: 8,
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.ORANGE, fontFamily: "'DM Mono', monospace" }}>
                {m.value}
              </div>
              <div style={{ fontSize: 10, color: C.MUTED, marginTop: 3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Layer badges */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          {LAYERS.map(l => (
            <div key={l.key} style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 11,
              background: `${C.BLUE_DIM}55`, border: `1px solid ${C.BLUE}66`, color: C.BLUE,
            }}>
              {l.name}: {progress[l.key]}%
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          padding: '13px 32px',
          background: C.ORANGE, border: 'none', color: '#fff',
          borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 700,
          boxShadow: `0 4px 20px ${C.ORANGE}44`,
        }}>
          Continue Playing
        </button>
      </div>
    </div>
  );
}
