import { C } from '../../colors';

export default function Modal({ title, children, onClose, width = 500 }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)',
      padding: '16px',
    }} onClick={onClose}>
      <div style={{
        background: C.CARD, border: `1px solid ${C.BORDER}`,
        borderRadius: 12, padding: '24px 20px',
        width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ margin: 0, color: C.TEXT, fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: C.MUTED,
            cursor: 'pointer', fontSize: 22, padding: '0 4px', lineHeight: 1,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
