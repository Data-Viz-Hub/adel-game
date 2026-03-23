import { C } from '../colors';
import { formatGameDate, GAME_DEADLINE_DAY } from '../gameReducer';

export default function TopBar({ state }) {
  const daysLeft = GAME_DEADLINE_DAY - state.gameDay;
  const pct = Math.min(100, Math.round((state.gameDay / GAME_DEADLINE_DAY) * 100));

  // Color shifts green → yellow → orange → red as deadline approaches
  const urgency = daysLeft <= 60 ? '#E53E3E'
    : daysLeft <= 150 ? C.ORANGE
    : daysLeft <= 300 ? '#ECC94B'
    : C.BLUE;

  const metrics = [
    { label: 'Satisfaction', value: state.citizenSatisfaction, unit: '%', icon: '😊' },
    { label: 'Interop',      value: state.interoperabilityScore, unit: '%', icon: '🔗' },
    { label: 'Duplicates',   value: state.duplicatesRemaining,  unit: '',  icon: '📋' },
    { label: 'Trust',        value: state.trustIndex,           unit: '%', icon: '🛡️' },
    { label: 'Budget',       value: state.budget,               unit: '💰', icon: null },
  ];

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: C.BG,
      borderBottom: `1px solid ${C.BORDER}`,
    }}>
      {/* Time progress bar across the very top */}
      <div style={{ height: 3, background: C.RAISED, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.BLUE_DIM}, ${urgency})`,
          transition: 'width 0.5s linear',
        }} />
      </div>

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 12px',
        display: 'flex', alignItems: 'center', gap: 10,
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

        {/* Date / deadline block */}
        <div style={{
          flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: 1,
          padding: '3px 10px',
          background: C.CARD,
          border: `1px solid ${daysLeft <= 60 ? urgency + '88' : C.BORDER}`,
          borderRadius: 6,
          boxShadow: daysLeft <= 60 ? `0 0 8px ${urgency}44` : 'none',
        }}>
          <div style={{ fontSize: 9, color: C.MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
            📅 {formatGameDate(state.gameDay)}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, lineHeight: 1.1,
            color: urgency,
            fontFamily: "'DM Mono', monospace",
          }}>
            {daysLeft > 0 ? `${daysLeft}d left` : 'DEADLINE'}
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: C.BORDER, flexShrink: 0 }} />

        {/* Metrics — scrollable strip */}
        <div style={{
          flex: 1,
          display: 'flex', gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '3px 8px',
              background: C.CARD,
              border: `1px solid ${C.BORDER}`,
              borderRadius: 6,
            }}>
              {m.icon && <span style={{ fontSize: 12 }}>{m.icon}</span>}
              <div>
                <div style={{ fontSize: 9, color: C.MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
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

        {/* Turn pill */}
        <div style={{
          flexShrink: 0,
          padding: '3px 8px', background: C.CARD,
          border: `1px solid ${C.BORDER}`, borderRadius: 6,
          fontSize: 11, color: C.MUTED,
        }}>
          T<span style={{ color: C.TEXT, fontWeight: 700 }}>{state.turn}</span>
        </div>
      </div>
    </div>
  );
}
