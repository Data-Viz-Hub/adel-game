import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import { GOVERNMENT_SERVICES } from '../../gameData';
import { calcChannelsProgress } from '../../gameReducer';
import { C } from '../../colors';

const CHANNELS = [
  { id: 'zero',     label: '⚡ Zero',     desc: 'Fully automated' },
  { id: 'mobile',   label: '📱 Mobile',   desc: 'Smartphone app' },
  { id: 'portal',   label: '🖥 Portal',   desc: 'Web browser' },
  { id: 'physical', label: '🏛 Physical', desc: 'In-person' },
];

export default function Chapter5_Channels({ state, dispatch, locked }) {
  const [hintId, setHintId] = useState(null);
  const progress = calcChannelsProgress(state);

  const eid = state.serviceTools.find(t => t.id === 'st01');
  const notif = state.serviceTools.find(t => t.id === 'st04');
  const activeConns = Object.values(state.connections).filter(c => c.active).length;
  const correct = Object.values(state.channelAssignments).filter(a => a.correct).length;

  function isLocked(ch, svc) {
    if (ch.id === 'zero') {
      if (!notif?.deployed) return 'Requires Notification Engine (Layer 5)';
      if (activeConns < 3) return 'Requires ≥3 ADEL connections (Layer 4)';
    }
    if (ch.id === 'portal' && svc.requiresEid && !eid?.deployed)
      return 'Requires e-Identity Gateway (Layer 5)';
    if (ch.id === 'mobile') {
      if (svc.requiresEid && !eid?.deployed) return 'Requires e-Identity Gateway (Layer 5)';
      if (svc.requiresNotification && !notif?.deployed) return 'Requires Notification Engine (Layer 5)';
    }
    return null;
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 6 — Channels</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Assign the optimal delivery channel for 16 services. Decision tree: automatable → Zero-Channel; routine → Mobile; complex → Portal; legally required → Physical.
      </p>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={progress} label={`Channels — ${correct}/16 correct`} height={10} />
        <div style={{ fontSize: 11, color: C.MUTED, marginTop: 6 }}>🔓 Layer 7 (Life Events) unlocks at 60%</div>
      </div>

      {/* Channel legend */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {CHANNELS.map(ch => (
          <div key={ch.id} style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11,
            background: C.RAISED, border: `1px solid ${C.BORDER}`, color: C.MUTED,
          }}>
            {ch.label} — {ch.desc}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GOVERNMENT_SERVICES.map(svc => {
          const asgn = state.channelAssignments[svc.id];
          const isCorrect = asgn?.correct;
          const showHint = hintId === svc.id;

          return (
            <div key={svc.id} style={{
              background: C.CARD,
              border: `1px solid ${isCorrect ? C.BLUE + '66' : asgn?.channel && !isCorrect ? C.ERROR + '44' : C.BORDER}`,
              borderRadius: 8, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
                {/* Service name */}
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 700, color: C.TEXT, fontSize: 13 }}>{svc.name}</div>
                  {showHint && (
                    <div style={{
                      fontSize: 11, color: C.MUTED, marginTop: 6,
                      padding: '7px 10px', background: C.RAISED,
                      borderRadius: 5, borderLeft: `3px solid ${C.BLUE}`,
                      lineHeight: 1.5,
                    }}>
                      💡 {svc.hint}
                    </div>
                  )}
                  {!isCorrect && asgn?.channel && (
                    <div style={{ fontSize: 10, color: C.ERROR, marginTop: 4 }}>
                      ✗ {svc.hint}
                    </div>
                  )}
                </div>

                {/* Hint button */}
                <button onClick={() => setHintId(showHint ? null : svc.id)} style={{
                  padding: '3px 8px', background: 'none', border: `1px solid ${C.BORDER}`,
                  color: C.MUTED, borderRadius: 5, cursor: 'pointer', fontSize: 10, flexShrink: 0,
                }}>
                  {showHint ? 'Hide' : '💡'}
                </button>

                {/* Channel buttons */}
                <div className="channel-row" style={{ justifyContent: 'flex-end' }}>
                  {CHANNELS.map(ch => {
                    const lockReason = isLocked(ch, svc);
                    const isSel = asgn?.channel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => !lockReason && !isCorrect && !locked && dispatch({ type: 'ASSIGN_CHANNEL', serviceId: svc.id, channel: ch.id })}
                        title={lockReason || ch.desc}
                        style={{
                          padding: '5px 10px',
                          background: isSel
                            ? (isCorrect ? `${C.BLUE}22` : C.ERROR_BG)
                            : C.RAISED,
                          border: `1px solid ${isSel
                            ? (isCorrect ? C.BLUE : C.ERROR)
                            : lockReason ? C.FAINT : C.BORDER}`,
                          color: lockReason ? C.FAINT : isSel ? (isCorrect ? C.BLUE : C.ERROR) : C.MUTED,
                          borderRadius: 5, cursor: lockReason || isCorrect ? 'not-allowed' : 'pointer',
                          fontSize: 11, fontWeight: isSel ? 700 : 400,
                          opacity: lockReason ? 0.4 : 1,
                          transition: 'all 0.15s',
                        }}
                      >
                        {ch.label}
                      </button>
                    );
                  })}
                </div>

                {isCorrect && <span style={{ color: C.BLUE, fontSize: 18, flexShrink: 0 }}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
