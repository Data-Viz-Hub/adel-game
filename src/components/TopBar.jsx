import { C } from '../colors';

export default function TopBar({ state }) {
  const metrics = [
    { label: 'Satisfaction',   value: state.citizenSatisfaction,  unit: '%',  icon: '😊' },
    { label: 'Interop',        value: state.interoperabilityScore, unit: '%',  icon: '🔗' },
    { label: 'Duplicates',     value: state.duplicatesRemaining,   unit: '',   icon: '📋' },
    { label: 'Trust',          value: state.trustIndex,            unit: '%',  icon: '🛡️' },
    { label: 'Budget',         value: state.budget,                unit: '💰', icon: null },
  ];

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: C.BG,
      borderBottom: `2px solid ${C.BLUE_DIM}`,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        height: 52,
      }}>
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontWeight: 700,
            color: C.ORANGE, letterSpacing: '0.05em',
          }}>ADEL</span>
        </div>

        <div style={{ width: 1, height: 28, background: C.BORDER, flexShrink: 0 }} />

        {/* Metrics — scroll on mobile */}
        <div style={{
          flex: 1,
          display: 'flex', gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px',
              background: C.CARD,
              border: `1px solid ${C.BORDER}`,
              borderRadius: 6,
              minWidth: 0,
            }}>
              {m.icon && <span style={{ fontSize: 13 }}>{m.icon}</span>}
              <div>
                <div style={{ fontSize: 9, color: C.MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 700,
                  color: C.ORANGE,
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1.1,
                }}>
                  {m.value}{m.unit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Turn */}
        <div style={{
          flexShrink: 0,
          padding: '4px 10px', background: C.CARD,
          border: `1px solid ${C.BORDER}`, borderRadius: 6,
          fontSize: 11, color: C.MUTED,
        }}>
          T<span style={{ color: C.TEXT, fontWeight: 700 }}>{state.turn}</span>
        </div>
      </div>
    </div>
  );
}
