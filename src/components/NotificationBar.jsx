import { C } from '../colors';

const TYPE = {
  success: { border: C.BLUE,    bg: `${C.BLUE}15`,    color: C.BLUE,    icon: '✓'  },
  error:   { border: C.ERROR,   bg: C.ERROR_BG,        color: C.ERROR,   icon: '✗'  },
  warning: { border: C.WARNING, bg: C.WARNING_BG,      color: C.MUTED,   icon: '⚠'  },
  info:    { border: C.BLUE,    bg: `${C.BLUE}0F`,     color: C.MUTED,   icon: 'ℹ'  },
};

export default function NotificationBar({ notifications, dispatch }) {
  if (!notifications?.length) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16,
      display: 'flex', flexDirection: 'column', gap: 6,
      zIndex: 500, maxWidth: 'min(360px, calc(100vw - 32px))',
    }}>
      {notifications.map(n => {
        const s = TYPE[n.type] || TYPE.info;
        return (
          <div key={n.id} style={{
            background: s.bg, border: `1px solid ${s.border}`,
            borderRadius: 7, padding: '9px 12px',
            display: 'flex', alignItems: 'flex-start', gap: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            animation: 'slideIn 0.2s ease',
          }}>
            <span style={{ fontSize: 13, color: s.color, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
            <span style={{ fontSize: 12, color: s.color, flex: 1, lineHeight: 1.4 }}>{n.message}</span>
            <button
              onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: n.id })}
              style={{
                background: 'none', border: 'none', color: C.FAINT,
                cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0,
              }}
            >×</button>
          </div>
        );
      })}
    </div>
  );
}
