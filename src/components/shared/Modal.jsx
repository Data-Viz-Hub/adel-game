export default function Modal({ title, children, onClose, width = 500 }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: '#0f172a', border: '1px solid #334155',
        borderRadius: 12, padding: 28, width, maxWidth: '95vw',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: 18 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#64748b',
            cursor: 'pointer', fontSize: 20, padding: '0 4px', lineHeight: 1,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
