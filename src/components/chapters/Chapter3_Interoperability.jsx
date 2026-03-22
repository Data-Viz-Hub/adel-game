import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import Modal from '../shared/Modal';
import { USEFUL_CONNECTIONS, ADEL_NODES } from '../../gameData';
import { calcInteropProgress } from '../../gameReducer';
import { C } from '../../colors';

const SVG_W = 700;
const SVG_H = 480;

const STEPS = [
  { title: 'Deploy Security Server', desc: 'Each agency needs a Security Server in the cloud. Auto-checked against Chapter 1 migration status.', action: 'Deploy Security Server' },
  { title: 'Exchange mTLS Certificates', desc: 'Establish a trusted encrypted channel. Cost: 1 💰', action: 'Exchange Certificates (−1 💰)' },
  { title: 'Register Legal Agreement & Catalog', desc: 'Connection metadata must be registered in the Data Catalog. Legal agreement governs data exchange.', action: 'Register & Activate Connection' },
];

export default function Chapter3_Interoperability({ state, dispatch }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const progress = calcInteropProgress(state);
  const active = Object.values(state.connections).filter(c => c.active).length;

  function connKey(a, b) { return [a, b].sort().join('--'); }

  function isUseful(a, b) {
    return USEFUL_CONNECTIONS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  }

  function handleNodeClick(nodeId) {
    if (!selectedNode) { setSelectedNode(nodeId); return; }
    if (selectedNode === nodeId) { setSelectedNode(null); return; }
    if (!isUseful(selectedNode, nodeId)) { setSelectedNode(null); return; }

    const key = connKey(selectedNode, nodeId);
    if (state.connections[key]?.active) { setSelectedNode(null); return; }

    const checkCloud = (nid) => {
      const node = ADEL_NODES.find(n => n.id === nid);
      if (!node?.agencyId) return true;
      const agency = state.agencies.find(a => a.id === node.agencyId);
      if (agency && (!agency.zone || agency.zone === 'legacy')) {
        alert(`⚠️ ${node.name} not in cloud — migrate first (Chapter 1)`);
        return false;
      }
      return true;
    };
    if (!checkCloud(selectedNode) || !checkCloud(nodeId)) { setSelectedNode(null); return; }

    if (!state.dataFields.some(f => f.cataloged)) {
      alert('⚠️ Register at least one data field in the Catalog first (Chapter 2)');
      setSelectedNode(null);
      return;
    }

    dispatch({ type: 'OPEN_CONNECTION_MODAL', connectionKey: key });
    setSelectedNode(null);
  }

  const modalKey = state.connectionModalOpen;
  const step = state.connectionStep;

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 3 — ADEL Network</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Connect agencies via the ADEL data exchange hub. Each connection requires 3 steps: Security Server → mTLS Certificate → Legal Agreement.
      </p>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <ProgressBar value={progress} label="Interoperability Progress" height={10} />
        </div>
        <div style={{ fontSize: 12, color: C.MUTED, whiteSpace: 'nowrap' }}>
          {active}/{USEFUL_CONNECTIONS.length} active
        </div>
      </div>

      {/* Rogue alert */}
      {state.rogueAlertPending && (
        <div style={{
          background: '#2D0A0A', border: `2px solid #E53E3E`,
          borderRadius: 8, padding: '14px 16px', marginBottom: 16,
          animation: 'pulse 1s ease-in-out infinite',
        }}>
          <div style={{ color: '#FC8181', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            🚨 Rogue Service Detected — No Catalog Validation!
          </div>
          <p style={{ color: '#FCA5A5', fontSize: 12, margin: '0 0 10px', lineHeight: 1.5 }}>
            An agency is publishing a service bypassing governance protocols.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => dispatch({ type: 'DISMISS_ROGUE_ALERT' })} style={{
              padding: '7px 16px', background: `${C.BLUE_DIM}88`, border: `1px solid ${C.BLUE}`,
              color: C.TEXT, borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 12,
            }}>✓ Block Rogue Service</button>
            <button onClick={() => dispatch({ type: 'MISS_ROGUE_ALERT' })} style={{
              padding: '7px 16px', background: C.CARD, border: `1px solid ${C.BORDER}`,
              color: C.MUTED, borderRadius: 6, cursor: 'pointer', fontSize: 12,
            }}>Ignore (+10 duplicates)</button>
          </div>
        </div>
      )}

      {selectedNode && (
        <div style={{
          padding: '8px 14px', marginBottom: 12,
          background: `${C.BLUE_DIM}44`, border: `1px solid ${C.BLUE}`,
          borderRadius: 6, fontSize: 13, color: C.BLUE,
        }}>
          Selected: <strong style={{ color: C.TEXT }}>{ADEL_NODES.find(n => n.id === selectedNode)?.name}</strong> — tap a second node to connect
        </div>
      )}

      {/* SVG Network — horizontally scrollable on mobile */}
      <div className="h-scroll" style={{
        background: '#030812', border: `1px solid ${C.BORDER}`,
        borderRadius: 10, padding: 8,
      }}>
        <svg width={SVG_W} height={SVG_H} style={{ display: 'block' }}>
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={C.ORANGE} stopOpacity="0.25" />
              <stop offset="100%" stopColor={C.ORANGE} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 48} x2={SVG_W} y2={i * 48} stroke={C.RAISED} strokeWidth={1} />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 52} y1={0} x2={i * 52} y2={SVG_H} stroke={C.RAISED} strokeWidth={1} />
          ))}

          {/* Connections */}
          {USEFUL_CONNECTIONS.map(([a, b]) => {
            const key = connKey(a, b);
            const isActive = state.connections[key]?.active;
            const nA = ADEL_NODES.find(n => n.id === a);
            const nB = ADEL_NODES.find(n => n.id === b);
            if (!nA || !nB) return null;
            return (
              <g key={key}>
                <line
                  x1={nA.x} y1={nA.y} x2={nB.x} y2={nB.y}
                  stroke={isActive ? C.BLUE : C.BORDER}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? '0' : '4,4'}
                  opacity={isActive ? 0.85 : 0.4}
                />
                {isActive && (
                  <circle r={2.5} fill={C.ORANGE} opacity={0.9}>
                    <animateMotion dur={`${2 + Math.random()}s`} repeatCount="indefinite"
                      path={`M${nA.x},${nA.y} L${nB.x},${nB.y}`} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {ADEL_NODES.map(node => {
            const isHub = node.isHub;
            const isSel = selectedNode === node.id;
            const isHov = hoveredNode === node.id;
            const agency = node.agencyId ? state.agencies.find(a => a.id === node.agencyId) : null;
            const inCloud = agency ? (agency.zone && agency.zone !== 'legacy') : true;
            const r = isHub ? 20 : 13;
            const borderColor = isHub ? C.ORANGE : isSel ? C.ORANGE : inCloud ? C.BLUE : '#E53E3E';

            return (
              <g key={node.id}
                onClick={() => !isHub && handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: isHub ? 'default' : 'pointer' }}
              >
                {isHub && <circle cx={node.x} cy={node.y} r={38} fill="url(#hubGlow)" />}
                <circle
                  cx={node.x} cy={node.y} r={r}
                  fill={C.CARD}
                  stroke={borderColor}
                  strokeWidth={isSel || isHub ? 2.5 : 1.5}
                />
                {isHub ? (
                  <text x={node.x} y={node.y + 4} textAnchor="middle"
                    fill={C.ORANGE} fontSize={9} fontWeight={700}>ADEL</text>
                ) : (
                  <text x={node.x} y={node.y + 4} textAnchor="middle"
                    fill={borderColor} fontSize={9} fontWeight={700}>
                    {node.id.replace('n', '')}
                  </text>
                )}
                {(isHov || isSel) && (
                  <text x={node.x} y={node.y - r - 5} textAnchor="middle"
                    fill={C.TEXT} fontSize={9} style={{ pointerEvents: 'none' }}>
                    {node.name}
                  </text>
                )}
                {agency && !inCloud && (
                  <text x={node.x + r - 3} y={node.y - r + 4} fill="#E53E3E" fontSize={9}>!</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: C.MUTED, flexWrap: 'wrap' }}>
        <span><span style={{ color: C.ORANGE }}>●</span> ADEL Hub</span>
        <span><span style={{ color: C.BLUE }}>●</span> Cloud agency</span>
        <span><span style={{ color: '#E53E3E' }}>●</span> Not migrated</span>
        <span style={{ marginLeft: 'auto' }}>Tap two nodes to connect</span>
      </div>

      {/* Connection modal */}
      {modalKey && (
        <Modal title="Establish ADEL Connection" onClose={() => dispatch({ type: 'CLOSE_CONNECTION_MODAL' })}>
          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', margin: '0 auto 4px',
                  background: step > i ? C.BLUE_DIM : step === i ? C.RAISED : C.CARD,
                  border: `2px solid ${step > i ? C.BLUE : step === i ? C.ORANGE : C.BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: step > i ? C.BLUE : step === i ? C.ORANGE : C.FAINT,
                  fontWeight: 700,
                }}>
                  {step > i ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 9, color: step === i ? C.MUTED : C.FAINT }}>
                  {['Security', 'Certs', 'Legal'][i]}
                </div>
              </div>
            ))}
          </div>

          {step < 3 && (
            <>
              <h4 style={{ margin: '0 0 6px', color: C.TEXT, fontSize: 14 }}>{STEPS[step].title}</h4>
              <p style={{ color: C.MUTED, fontSize: 12, marginBottom: 12 }}>{STEPS[step].desc}</p>
              {step === 1 && (
                <div style={{
                  padding: '10px', background: C.BG, borderRadius: 7,
                  fontSize: 11, fontFamily: 'monospace', color: C.BLUE, marginBottom: 12,
                }}>
                  Root CA → Intermediate CA → Agency Cert → mTLS ✓
                </div>
              )}
              <button
                onClick={() => dispatch({ type: 'ADVANCE_CONNECTION_STEP', connectionKey: modalKey })}
                style={{
                  width: '100%', padding: '12px',
                  background: C.ORANGE, border: 'none', color: '#000',
                  borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                }}
              >
                {STEPS[step].action}
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
