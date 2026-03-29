import { useState, useEffect, useRef } from 'react';
import {
  calcInfraProgress, calcDataProgress, calcInteropProgress,
  calcAppServicesProgress, calcChannelsProgress, calcLifeEventsProgress,
  calcLegalProgress,
} from '../gameReducer';
import { USEFUL_CONNECTIONS, ADEL_NODES } from '../gameData';
import { C } from '../colors';

const W = 700;
const H = 440;

// Scattered chaos positions — agencies spread randomly, no logic
const CHAOS_POS = {
  n01: { x: 120, y: 80  },
  n02: { x: 580, y: 60  },
  n03: { x: 320, y: 40  },
  n04: { x: 650, y: 200 },
  n05: { x: 60,  y: 310 },
  n06: { x: 420, y: 380 },
  n07: { x: 200, y: 400 },
  n08: { x: 600, y: 370 },
  n09: { x: 70,  y: 160 },
  n10: { x: 490, y: 150 },
  n11: { x: 310, y: 210 },
};

// Organized positions — 4 semantic clusters
// Fiscal cluster (right): n01 Finance, n04 Revenue, n11 EGov Infra Center
// Social cluster (left): n05 Social Insurance, n06 Employment, n07 Labor
// Civil/Legal cluster (top-center): n02 Justice, n09 Interior, n08 Cadastre
// Health/Stats cluster (bottom-center): n03 Health, n10 Statistics
const ORGANIZED_POS = {
  n01: { x: 560, y: 120 },  // Finance — fiscal
  n04: { x: 620, y: 220 },  // Revenue — fiscal
  n11: { x: 560, y: 320 },  // EGov — fiscal/infra
  n05: { x: 120, y: 200 },  // Social Insurance — social
  n06: { x: 80,  y: 310 },  // Employment — social
  n07: { x: 150, y: 320 },  // Labor — social
  n02: { x: 300, y: 70  },  // Justice — civil
  n09: { x: 220, y: 140 },  // Interior — civil
  n08: { x: 380, y: 130 },  // Cadastre — civil
  n03: { x: 280, y: 360 },  // Health — health
  n10: { x: 400, y: 360 },  // Statistics — health
};

// Semantically wrong tangled connections for chaos state
const CHAOS_CONNECTIONS = [
  ['n01','n06'],['n01','n08'],['n01','n03'],
  ['n02','n05'],['n02','n10'],['n02','n07'],
  ['n03','n09'],['n03','n06'],['n03','n04'],
  ['n04','n07'],['n04','n08'],['n04','n03'],
  ['n05','n01'],['n05','n10'],['n05','n02'],
  ['n06','n09'],['n06','n08'],
  ['n07','n10'],['n07','n04'],
  ['n08','n05'],['n08','n10'],
  ['n09','n01'],['n09','n11'],
  ['n10','n06'],['n10','n11'],
  ['n11','n07'],['n11','n02'],['n11','n03'],
];

const CLUSTER_LABELS = [
  { label: 'Fiscal',    x: 590, y: 390, color: '#355C8C' },  // blue primary
  { label: 'Social',    x: 80,  y: 390, color: '#15B094' },  // tealMain
  { label: 'Civil',     x: 300, y: 30,  color: '#474E95' },  // violetMain
  { label: 'Health',    x: 340, y: 420, color: '#D81884' },  // magentaMain
];

function splitLabel(name) {
  const words = name.split(' ');
  if (words.length === 1) return [name];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const LAYERS = [
  { key: 'infra',     label: 'Infrastructure',      fn: calcInfraProgress },
  { key: 'data',      label: 'Data Catalog',         fn: calcDataProgress },
  { key: 'interop',   label: 'ADEL Network',         fn: calcInteropProgress },
  { key: 'apps',      label: 'App Services',         fn: calcAppServicesProgress },
  { key: 'channels',  label: 'Channels',             fn: calcChannelsProgress },
  { key: 'life',      label: 'Life Events',          fn: calcLifeEventsProgress },
  { key: 'legal',     label: 'Legal',                fn: calcLegalProgress },
];

export default function TransformationView({ state, onClose }) {
  const [replayKey, setReplayKey] = useState(0);
  const [animT, setAnimT] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const layerPcts = LAYERS.map(l => ({ ...l, pct: l.fn(state) }));
  const overallProgress = Math.round(layerPcts.reduce((s, l) => s + l.pct, 0) / layerPcts.length);
  const targetT = overallProgress / 100;

  useEffect(() => {
    startRef.current = null;
    setAnimT(0);
    const DURATION = 2800;

    function frame(ts) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const raw = Math.min(elapsed / DURATION, 1);
      const t = easeInOut(raw) * targetT;
      setAnimT(t);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [replayKey, targetT]);

  function getNodePos(id) {
    const cp = CHAOS_POS[id];
    const op = ORGANIZED_POS[id];
    if (!cp || !op) return { x: W / 2, y: H / 2 };
    return {
      x: lerp(cp.x, op.x, animT),
      y: lerp(cp.y, op.y, animT),
    };
  }

  const activeConnKeys = new Set(
    Object.entries(state.connections)
      .filter(([, c]) => c.active)
      .map(([k]) => k)
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: '#0A1628',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.ORANGE }}>Digital Transformation</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Chaos → Order — {overallProgress}% complete</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setReplayKey(k => k + 1)}
            style={{
              padding: '7px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)', borderRadius: 6, cursor: 'pointer', fontSize: 12,
            }}
          >
            ↺ Replay
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '7px 14px', background: C.BLUE, border: `1px solid ${C.BLUE_DIM}`,
              color: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700,
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* SVG panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <div className="h-scroll" style={{ width: '100%' }}>
            <svg width={W} height={H} style={{ display: 'block', margin: '0 auto', background: '#0D1E38', borderRadius: 8 }}>
              {/* Background grid */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h${i}`} x1={0} y1={i * (H / 9)} x2={W} y2={i * (H / 9)}
                  stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              ))}
              {Array.from({ length: 15 }).map((_, i) => (
                <line key={`v${i}`} x1={i * (W / 14)} y1={0} x2={i * (W / 14)} y2={H}
                  stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              ))}

              {/* Chaos connections (fade out as animT increases) */}
              {CHAOS_CONNECTIONS.map(([a, b], idx) => {
                const pa = getNodePos(a);
                const pb = getNodePos(b);
                const op = Math.max(0, (1 - animT * 2));
                if (op <= 0) return null;
                return (
                  <line key={`chaos-${idx}`}
                    x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                    stroke="#FF6B6B" strokeWidth={1} opacity={op * 0.6}
                    strokeDasharray="3,4"
                  />
                );
              })}

              {/* Organized connections (fade in) */}
              {USEFUL_CONNECTIONS.map(([a, b]) => {
                const key = [a, b].sort().join('--');
                const isActive = activeConnKeys.has(key);
                const pa = getNodePos(a);
                const pb = getNodePos(b);
                const op = Math.max(0, animT * 2 - 0.2) * (isActive ? 1 : 0.25);
                if (op <= 0) return null;
                return (
                  <g key={`org-${key}`}>
                    <line
                      x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                      stroke={isActive ? '#6FA8FF' : 'rgba(255,255,255,0.2)'}
                      strokeWidth={isActive ? 2 : 1}
                      opacity={op}
                    />
                    {isActive && animT > 0.6 && (
                      <circle r={2.5} fill={C.ORANGE} opacity={op * 0.9}>
                        <animateMotion
                          dur={`${2 + (parseInt(a.replace('n','')) % 3) * 0.5}s`}
                          repeatCount="indefinite"
                          path={`M${pa.x},${pa.y} L${pb.x},${pb.y}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Cluster labels (appear at animT > 0.5) */}
              {animT > 0.5 && CLUSTER_LABELS.map(cl => (
                <text key={cl.label} x={cl.x} y={cl.y} textAnchor="middle"
                  fill={cl.color} fontSize={10} fontWeight={700}
                  opacity={Math.min(1, (animT - 0.5) * 4)}
                >
                  {cl.label}
                </text>
              ))}

              {/* Nodes */}
              {ADEL_NODES.map(node => {
                const pos = getNodePos(node.id);
                const agency = node.agencyId ? state.agencies?.find(a => a.id === node.agencyId) : null;
                const inCloud = agency ? (agency.zone && agency.zone !== 'legacy') : false;
                const nodeColor = inCloud ? '#6FA8FF' : '#FF8C6B';
                const lines = splitLabel(node.name);
                const lineOffset = lines.length === 2 ? 4.5 : 0;

                return (
                  <g key={node.id}>
                    <circle
                      cx={pos.x} cy={pos.y} r={18}
                      fill="#1A2E50"
                      stroke={nodeColor}
                      strokeWidth={2}
                    />
                    {lines.map((line, i) => (
                      <text key={i}
                        x={pos.x} y={pos.y - lineOffset + i * 9 + 3}
                        textAnchor="middle"
                        fill={nodeColor} fontSize={6.5} fontWeight={700}
                        style={{ pointerEvents: 'none' }}
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}

              {/* Labels: CHAOS / ORDER */}
              <text x={30} y={30} fill="#FF6B6B" fontSize={13} fontWeight={700}
                opacity={Math.max(0, 1 - animT * 3)}>
                CHAOS
              </text>
              <text x={W - 30} y={30} textAnchor="end" fill="#6FA8FF" fontSize={13} fontWeight={700}
                opacity={Math.min(1, animT * 3)}>
                ORDER
              </text>
            </svg>
          </div>
        </div>

        {/* Metrics sidebar */}
        <div style={{
          width: 220, flexShrink: 0,
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 14px',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>
            Layer Progress
          </div>

          {layerPcts.map(l => (
            <div key={l.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
                <span>{l.label}</span>
                <span style={{ color: l.pct >= 80 ? '#6FA8FF' : l.pct >= 40 ? C.ORANGE : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                  {l.pct}%
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${l.pct}%`, height: '100%',
                  background: l.pct >= 80 ? '#6FA8FF' : l.pct >= 40 ? C.ORANGE : 'rgba(255,255,255,0.25)',
                  borderRadius: 3, transition: 'width 0.4s',
                }} />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 8, padding: '12px', background: 'rgba(255,255,255,0.07)',
            borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Overall</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: overallProgress >= 80 ? '#6FA8FF' : C.ORANGE }}>
              {overallProgress}%
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
              {overallProgress >= 100 ? '🏆 Complete!' :
               overallProgress >= 80 ? '🚀 Almost there' :
               overallProgress >= 50 ? '⚡ Good progress' :
               '🔧 Building...'}
            </div>
          </div>

          <div style={{ padding: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Connections</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#6FA8FF' }}>
              {activeConnKeys.size}<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>/{USEFUL_CONNECTIONS.length}</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>active ADEL links</div>
          </div>
        </div>
      </div>
    </div>
  );
}
