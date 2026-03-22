const TYPE_STYLES = {
  success: { border: '#4ade80', bg: '#0a1e0f', color: '#4ade80', icon: '✓' },
  error:   { border: '#ef4444', bg: '#1e0a0a', color: '#fca5a5', icon: '✗' },
  warning: { border: '#f59e0b', bg: '#1a1200', color: '#fde68a', icon: '⚠️' },
  info:    { border: '#60a5fa', bg: '#0a1220', color: '#93c5fd', icon: 'ℹ' },
};

export default function NotificationBar({ notifications, dispatch }) {
  if (!notifications?.length) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      display: 'flex', flexDirection: 'column', gap: 8,
      zIndex: 1000, maxWidth: 380,
    }}>
      {notifications.map(n => {
        const s = TYPE_STYLES[n.type] || TYPE_STYLES.info;
        return (
          <div key={n.id} style={{
            background: s.bg, border: `1px solid ${s.border}`,
            borderRadius: 8, padding: '10px 14px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.2s ease',
          }}>
            <span style={{ fontSize: 14, color: s.color, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
            <span style={{ fontSize: 13, color: s.color, flex: 1, lineHeight: 1.4 }}>{n.message}</span>
            <button
              onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: n.id })}
              style={{
                background: 'none', border: 'none', color: '#475569',
                cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1,
                flexShrink: 0,
              }}
            >×</button>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
