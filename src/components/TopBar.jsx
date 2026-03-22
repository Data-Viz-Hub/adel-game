export default function TopBar({ state }) {
  const metrics = [
    { label: 'Citizen Satisfaction', value: state.citizenSatisfaction, unit: '%', color: '#2dd4bf', icon: '😊' },
    { label: 'Interoperability', value: state.interoperabilityScore, unit: '%', color: '#60a5fa', icon: '🔗' },
    { label: 'Duplicate Records', value: state.duplicatesRemaining, unit: '', color: '#f87171', icon: '📋', invert: true },
    { label: 'Trust Index', value: state.trustIndex, unit: '%', color: '#f59e0b', icon: '🛡️' },
    { label: 'Budget', value: state.budget, unit: '💰', color: '#4ade80', icon: '💼' },
  ];

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#070d1a',
      borderBottom: '1px solid #1e293b',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: 12,
        height: 56,
      }}>
        {/* Logo */}
        <div style={{ marginRight: 8 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.06em',
          }}>ADEL</span>
          <span style={{ fontSize: 10, color: '#475569', marginLeft: 6, letterSpacing: '0.05em' }}>
            DIGITAL ARMENIA
          </span>
        </div>

        <div style={{ width: 1, height: 32, background: '#1e293b' }} />

        {/* Metrics */}
        <div style={{
          flex: 1, display: 'flex', gap: 4, justifyContent: 'flex-end', flexWrap: 'wrap',
        }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', background: '#0f172a',
              border: '1px solid #1e293b', borderRadius: 8,
              minWidth: 130,
            }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 700, color: m.color,
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1,
                }}>
                  {m.value}{m.unit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Turn counter */}
        <div style={{
          padding: '6px 14px', background: '#0f172a',
          border: '1px solid #1e293b', borderRadius: 8,
          fontSize: 12, color: '#475569',
        }}>
          Turn <span style={{ color: '#94a3b8', fontWeight: 700 }}>{state.turn}</span>
        </div>
      </div>
    </div>
  );
}
