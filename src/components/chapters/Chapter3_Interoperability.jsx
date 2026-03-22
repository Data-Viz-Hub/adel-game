import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import Modal from '../shared/Modal';
import { USEFUL_CONNECTIONS, ADEL_NODES } from '../../gameData';
import { calcInteropProgress } from '../../gameReducer';

const CANVAS_W = 740;
const CANVAS_H = 520;

const CONNECTION_STEPS = [
  {
    title: 'Step 1: Deploy Security Server',
    desc: 'Each agency needs a Security Server provisioned in the cloud. Security Servers encrypt all data exchanges.',
    action: 'Deploy Security Server',
  },
  {
    title: 'Step 2: Exchange mTLS Certificates',
    desc: 'Mutual TLS certificates establish a trusted encrypted channel between agencies. Cost: 1 budget unit.',
    action: 'Exchange Certificates (−1 💰)',
  },
  {
    title: 'Step 3: Register Legal Agreement & Data Catalog',
    desc: 'The connection metadata must be registered in the Data Catalog. A legal agreement governs data exchange.',
    action: 'Register & Activate Connection',
  },
];

export default function Chapter3_Interoperability({ state, dispatch }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const progress = calcInteropProgress(state);
  const activeConnections = Object.values(state.connections).filter(c => c.active).length;

  function getConnectionKey(a, b) {
    const sorted = [a, b].sort();
    return `${sorted[0]}--${sorted[1]}`;
  }

  function isUsefulConnection(a, b) {
    return USEFUL_CONNECTIONS.some(([x, y]) =>
      (x === a && y === b) || (x === b && y === a)
    );
  }

  function handleNodeClick(nodeId) {
    if (!selectedNode) {
      setSelectedNode(nodeId);
      return;
    }
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      return;
    }
    if (!isUsefulConnection(selectedNode, nodeId)) {
      setSelectedNode(null);
      return;
    }
    const key = getConnectionKey(selectedNode, nodeId);
    if (state.connections[key]?.active) {
      setSelectedNode(null);
      return;
    }
    // Check infra: agency must be in a cloud zone
    const node = ADEL_NODES.find(n => n.id === nodeId);
    const selNode = ADEL_NODES.find(n => n.id === selectedNode);
    if (node?.agencyId) {
      const agency = state.agencies.find(a => a.id === node.agencyId);
      if (agency && (!agency.zone || agency.zone === 'legacy')) {
        dispatch({ type: 'DISMISS_NOTIFICATION' });
        alert(`⚠️ ${node.name} has not migrated to cloud — deploy Security Server first (Chapter 1)`);
        setSelectedNode(null);
        return;
      }
    }
    if (selNode?.agencyId) {
      const agency = state.agencies.find(a => a.id === selNode.agencyId);
      if (agency && (!agency.zone || agency.zone === 'legacy')) {
        alert(`⚠️ ${selNode.name} has not migrated to cloud — deploy Security Server first (Chapter 1)`);
        setSelectedNode(null);
        return;
      }
    }
    // Check data catalog
    const cataloged = state.dataFields.filter(f => f.cataloged).length;
    if (cataloged === 0) {
      alert('⚠️ Register data fields in the Catalog first (Chapter 2) before establishing connections.');
      setSelectedNode(null);
      return;
    }
    dispatch({ type: 'OPEN_CONNECTION_MODAL', connectionKey: key });
    setSelectedNode(null);
  }

  const modalKey = state.connectionModalOpen;
  const step = state.connectionStep;

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: '#60a5fa', fontSize: 22 }}>Layer 3 — Interoperability</h2>
        <span style={{ color: '#64748b', fontSize: 14 }}>ADEL / X-Road Network</span>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
        Connect government agencies to the ADEL data exchange hub. Each connection requires a 3-step validation:
        Security Server → mTLS Certificate → Legal Agreement + Catalog Registration.
      </p>

      <div style={{ marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <ProgressBar value={progress} color="#60a5fa" label="Interoperability Progress" height={12} />
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {activeConnections}/{USEFUL_CONNECTIONS.length} connections
        </div>
      </div>

      {state.rogueAlertPending && (
        <div style={{
          background: '#3b1818', border: '2px solid #ef4444', borderRadius: 10,
          padding: '16px 20px', marginBottom: 20,
          animation: 'pulse 1s ease-in-out infinite',
        }}>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            🚨 COMPLIANCE ALERT — Rogue Service Detected!
          </div>
          <p style={{ color: '#fca5a5', fontSize: 13, margin: '0 0 12px' }}>
            An agency is attempting to publish a service without Data Catalog validation.
            This violates governance protocols and will increase duplicate records.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => dispatch({ type: 'DISMISS_ROGUE_ALERT' })} style={{
              padding: '8px 20px', background: '#166534', border: '1px solid #4ade80',
              color: '#4ade80', borderRadius: 6, cursor: 'pointer', fontWeight: 700,
            }}>
              ✓ Block Rogue Service
            </button>
            <button onClick={() => dispatch({ type: 'MISS_ROGUE_ALERT' })} style={{
              padding: '8px 20px', background: '#1e293b', border: '1px solid #334155',
              color: '#64748b', borderRadius: 6, cursor: 'pointer',
            }}>
              Ignore (−governance, +10 duplicates)
            </button>
          </div>
        </div>
      )}

      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
        Click two agency nodes to connect them. Blue nodes = selected. Green lines = active connections.
        {selectedNode && <strong style={{ color: '#60a5fa' }}> Node selected: {ADEL_NODES.find(n => n.id === selectedNode)?.name}</strong>}
      </p>

      {/* Network visualization */}
      <div style={{
        background: '#080f1a', border: '1px solid #1e293b', borderRadius: 12,
        padding: 12, overflowX: 'auto',
      }}>
        <svg width={CANVAS_W} height={CANVAS_H} style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 52} x2={CANVAS_W} y2={i * 52}
              stroke="#0f2040" strokeWidth={1} />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 52} y1={0} x2={i * 52} y2={CANVAS_H}
              stroke="#0f2040" strokeWidth={1} />
          ))}

          {/* Connections */}
          {USEFUL_CONNECTIONS.map(([a, b]) => {
            const key = getConnectionKey(a, b);
            const active = state.connections[key]?.active;
            const nodeA = ADEL_NODES.find(n => n.id === a);
            const nodeB = ADEL_NODES.find(n => n.id === b);
            if (!nodeA || !nodeB) return null;
            return (
              <g key={key}>
                <line
                  x1={nodeA.x} y1={nodeA.y} x2={nodeB.x} y2={nodeB.y}
                  stroke={active ? '#60a5fa' : '#1e293b'}
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray={active ? '0' : '4,4'}
                  opacity={active ? 0.8 : 0.4}
                />
                {active && (
                  <circle r={3} fill="#60a5fa" opacity={0.9}>
                    <animateMotion dur={`${2 + Math.random()}s`} repeatCount="indefinite"
                      path={`M${nodeA.x},${nodeA.y} L${nodeB.x},${nodeB.y}`} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {ADEL_NODES.map(node => {
            const isHub = node.isHub;
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            const agency = node.agencyId ? state.agencies.find(a => a.id === node.agencyId) : null;
            const inCloud = agency ? (agency.zone && agency.zone !== 'legacy') : true;
            const nodeColor = isHub ? '#fbbf24' : isSelected ? '#60a5fa' : inCloud ? '#4ade80' : '#ef4444';
            const r = isHub ? 22 : 14;

            return (
              <g key={node.id}
                onClick={() => !isHub && handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: isHub ? 'default' : 'pointer' }}
              >
                {isHub && (
                  <circle cx={node.x} cy={node.y} r={40} fill="url(#hubGlow)" />
                )}
                <circle
                  cx={node.x} cy={node.y} r={r}
                  fill={isHub ? '#1a1200' : '#0f172a'}
                  stroke={nodeColor}
                  strokeWidth={isSelected || isHub ? 3 : 2}
                />
                {isHub ? (
                  <text x={node.x} y={node.y + 5} textAnchor="middle"
                    fill="#fbbf24" fontSize={10} fontWeight={700}>ADEL</text>
                ) : (
                  <text x={node.x} y={node.y + 4} textAnchor="middle"
                    fill={nodeColor} fontSize={10} fontWeight={700}>
                    {node.id.replace('n', '')}
                  </text>
                )}
                {(isHovered || isSelected) && (
                  <text x={node.x} y={node.y - r - 6} textAnchor="middle"
                    fill="#f1f5f9" fontSize={10}
                    style={{ pointerEvents: 'none' }}>
                    {node.name}
                  </text>
                )}
                {agency && !inCloud && (
                  <text x={node.x + r - 4} y={node.y - r + 4}
                    fill="#ef4444" fontSize={10}>!</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 12, color: '#64748b' }}>
        <span><span style={{ color: '#fbbf24' }}>●</span> ADEL Hub</span>
        <span><span style={{ color: '#4ade80' }}>●</span> Agency (cloud)</span>
        <span><span style={{ color: '#ef4444' }}>●</span> Agency (not migrated)</span>
        <span><span style={{ color: '#60a5fa' }}>●</span> Selected</span>
        <span style={{ marginLeft: 'auto' }}>Click two nodes to connect them</span>
      </div>

      {/* Connection modal */}
      {modalKey && (
        <Modal title="Establish ADEL Connection" onClose={() => dispatch({ type: 'CLOSE_CONNECTION_MODAL' })} width={520}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {CONNECTION_STEPS.map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                    background: step > i ? '#166534' : step === i ? '#1d4ed8' : '#1e293b',
                    border: `2px solid ${step > i ? '#4ade80' : step === i ? '#60a5fa' : '#334155'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, color: step > i ? '#4ade80' : step === i ? '#60a5fa' : '#475569',
                    fontWeight: 700,
                  }}>
                    {step > i ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 10, color: step === i ? '#94a3b8' : '#475569' }}>
                    {['Security', 'Certificates', 'Legal'][i]}
                  </div>
                </div>
              ))}
            </div>

            {step < 3 && (
              <div>
                <h4 style={{ color: '#f1f5f9', marginTop: 0 }}>{CONNECTION_STEPS[step]?.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>{CONNECTION_STEPS[step]?.desc}</p>
                {step === 1 && (
                  <div style={{ padding: '12px', background: '#0f172a', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', color: '#60a5fa', marginBottom: 12 }}>
                    Root CA → Intermediate CA → Agency Certificate<br />
                    ↳ mTLS handshake established ✓
                  </div>
                )}
                <button
                  onClick={() => dispatch({ type: 'ADVANCE_CONNECTION_STEP', connectionKey: modalKey })}
                  style={{
                    width: '100%', padding: '12px', marginTop: 8,
                    background: '#1d4ed8', border: 'none', color: '#fff',
                    borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  }}
                >
                  {CONNECTION_STEPS[step]?.action}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
