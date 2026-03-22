import { C } from '../../colors';

export default function ProgressBar({ value, color, label, showValue = true, height = 8 }) {
  const col = color || C.BLUE;
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: C.MUTED }}>
          <span>{label}</span>
          {showValue && <span style={{ color: col, fontFamily: "'DM Mono', monospace" }}>{value}%</span>}
        </div>
      )}
      <div style={{ width: '100%', height, background: C.RAISED, borderRadius: height / 2, overflow: 'hidden' }}>
        <div style={{
          width: `${Math.min(100, value)}%`,
          height: '100%',
          background: col,
          borderRadius: height / 2,
          transition: 'width 0.5s ease',
          boxShadow: value > 0 ? `0 0 6px ${col}55` : 'none',
        }} />
      </div>
    </div>
  );
}
