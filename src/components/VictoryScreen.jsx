import { getLayerProgress } from '../gameReducer';

export default function VictoryScreen({ state, onClose }) {
  const progress = getLayerProgress(state);
  const layers = [
    { name: 'Infrastructure', key: 'infrastructure', color: '#4ade80' },
    { name: 'Data Layer', key: 'dataLayer', color: '#a78bfa' },
    { name: 'Interoperability', key: 'interoperability', color: '#60a5fa' },
    { name: 'App Services', key: 'appServices', color: '#f59e0b' },
    { name: 'Channels', key: 'channels', color: '#fb923c' },
    { name: 'Life Events', key: 'lifeEvents', color: '#2dd4bf' },
    { name: 'Legal', key: 'legal', color: '#f87171' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #0a1628 0%, #000 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000,
    }}>
      {/* Animated stars */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: ['#4ade80', '#60a5fa', '#fbbf24', '#a78bfa', '#2dd4bf'][Math.floor(Math.random() * 5)],
            borderRadius: '50%',
            animation: `twinkle ${1 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      <div style={{
        textAlign: 'center', maxWidth: 700, padding: '0 24px', position: 'relative',
      }}>
        {/* Armenia map icon */}
        <div style={{ fontSize: 64, marginBottom: 16 }}>🇦🇲</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 42, fontWeight: 900, margin: '0 0 8px',
          background: 'linear-gradient(135deg, #4ade80, #60a5fa, #fbbf24)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '0.04em',
        }}>
          Digital Armenia Achieved
        </h1>

        <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 32px', lineHeight: 1.6 }}>
          You have successfully architected Armenia's national digital transformation.
          7 layers built. Citizens empowered. Services seamless.
        </p>

        {/* Score grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28,
        }}>
          {[
            { label: 'Satisfaction', value: `${state.citizenSatisfaction}%`, color: '#2dd4bf' },
            { label: 'Interop Score', value: `${state.interoperabilityScore}%`, color: '#60a5fa' },
            { label: 'Trust Index', value: `${state.trustIndex}%`, color: '#f59e0b' },
            { label: 'Duplicates Left', value: state.duplicatesRemaining, color: '#4ade80' },
          ].map(m => (
            <div key={m.label} style={{
              padding: '14px', background: '#0f172a',
              border: `1px solid ${m.color}44`, borderRadius: 10,
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontFamily: 'DM Mono, monospace' }}>
                {m.value}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Layer progress summary */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          {layers.map(l => (
            <div key={l.key} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 12,
              background: l.color + '22',
              border: `1px solid ${l.color}66`,
              color: l.color,
            }}>
              {l.name}: {progress[l.key]}%
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #1d4ed8, #4338ca)',
              border: 'none', color: '#fff',
              borderRadius: 10, cursor: 'pointer',
              fontSize: 15, fontWeight: 700,
              boxShadow: '0 4px 20px #3b82f633',
            }}
          >
            Continue Playing
          </button>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
