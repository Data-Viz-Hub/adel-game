export default function ProgressBar({ value, color = '#4ade80', label, showValue = true, height = 8 }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: '#94a3b8' }}>
          <span>{label}</span>
          {showValue && <span style={{ color }}>{value}%</span>}
        </div>
      )}
      <div style={{
        width: '100%', height, background: '#1e293b', borderRadius: height / 2, overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.min(100, value)}%`,
          height: '100%',
          background: value >= 80 ? `linear-gradient(90deg, ${color}, #fff5)` : color,
          borderRadius: height / 2,
          transition: 'width 0.6s ease',
          boxShadow: value > 0 ? `0 0 8px ${color}66` : 'none',
        }} />
      </div>
    </div>
  );
}
