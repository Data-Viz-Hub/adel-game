import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import { GOVERNMENT_SERVICES } from '../../gameData';
import { calcChannelsProgress } from '../../gameReducer';

const CHANNELS = [
  { id: 'zero', label: '⚡ Zero-Channel', desc: 'Fully automated — citizen does nothing', color: '#4ade80' },
  { id: 'mobile', label: '📱 Mobile App', desc: 'Smartphone interaction', color: '#60a5fa' },
  { id: 'portal', label: '🖥️ Web Portal', desc: 'Desktop/browser interaction', color: '#a78bfa' },
  { id: 'physical', label: '🏛️ Physical', desc: 'In-person visit required', color: '#94a3b8' },
];

export default function Chapter5_Channels({ state, dispatch }) {
  const [hintVisible, setHintVisible] = useState(null);
  const progress = calcChannelsProgress(state);

  const eid = state.serviceTools.find(t => t.id === 'st01');
  const notificationEngine = state.serviceTools.find(t => t.id === 'st04');
  const activeConnections = Object.values(state.connections).filter(c => c.active).length;

  function getChannelLock(svc) {
    const assignment = state.channelAssignments[svc.id];
    if (assignment?.correct) return null;
    return null; // channels are always accessible to assign, but we show warnings
  }

  function getAvailableChannels(svc) {
    return CHANNELS.map(ch => {
      let locked = false;
      let lockReason = null;
      if (ch.id === 'zero') {
        if (!notificationEngine?.deployed) {
          locked = true;
          lockReason = 'Requires Notification Engine (Chapter 4)';
        }
        if (activeConnections < 3) {
          locked = true;
          lockReason = 'Requires ≥3 ADEL connections (Chapter 3)';
        }
      }
      if (ch.id === 'portal' && svc.requiresEid && !eid?.deployed) {
        locked = true;
        lockReason = 'Requires e-Identity Gateway (Chapter 4)';
      }
      if (ch.id === 'mobile') {
        if (svc.requiresEid && !eid?.deployed) {
          locked = true;
          lockReason = 'Requires e-Identity Gateway (Chapter 4)';
        }
        if (svc.requiresNotification && !notificationEngine?.deployed) {
          locked = true;
          lockReason = 'Requires Notification Engine (Chapter 4)';
        }
      }
      return { ...ch, locked, lockReason };
    });
  }

  const correct = Object.values(state.channelAssignments).filter(a => a.correct).length;
  const assigned = Object.values(state.channelAssignments).filter(a => a.channel !== null).length;

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: '#fb923c', fontSize: 22 }}>Layer 5 — Channels</h2>
        <span style={{ color: '#64748b', fontSize: 14 }}>Every Door Opens</span>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        Assign the optimal delivery channel for 16 government services. Follow the decision tree:
        automatable → Zero-Channel; frequent/mobile → Mobile App; complex/document-heavy → Portal; legally required in-person → Physical.
      </p>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={progress} color="#fb923c" label="Channels Progress" height={12} />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#64748b' }}>
          <span>{correct}/{GOVERNMENT_SERVICES.length} correct · {assigned} assigned</span>
          <span>🔓 Life Events unlocks at 60%</span>
        </div>
      </div>

      {/* Channel legend */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {CHANNELS.map(ch => (
          <div key={ch.id} style={{
            padding: '6px 12px', background: ch.color + '11',
            border: `1px solid ${ch.color}44`, borderRadius: 20, fontSize: 12, color: ch.color,
          }}>
            {ch.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GOVERNMENT_SERVICES.map(svc => {
          const assignment = state.channelAssignments[svc.id];
          const channels = getAvailableChannels(svc);
          const assignedChannel = channels.find(c => c.id === assignment?.channel);
          const isCorrect = assignment?.correct;
          const showHint = hintVisible === svc.id;

          return (
            <div key={svc.id} style={{
              background: '#111827',
              border: `1px solid ${isCorrect ? '#4ade8066' : assignment?.channel ? '#ef444444' : '#1e293b'}`,
              borderRadius: 10, padding: '14px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{svc.name}</div>
                  {showHint && (
                    <div style={{
                      fontSize: 12, color: '#94a3b8', marginTop: 6,
                      padding: '8px 12px', background: '#0f172a', borderRadius: 6,
                      borderLeft: '3px solid #60a5fa',
                    }}>
                      💡 {svc.hint}
                    </div>
                  )}
                  {!isCorrect && assignment?.channel && (
                    <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>
                      ✗ Incorrect — {svc.hint}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setHintVisible(showHint ? null : svc.id)}
                  style={{
                    padding: '4px 10px', background: 'none',
                    border: '1px solid #334155', color: '#64748b',
                    borderRadius: 6, cursor: 'pointer', fontSize: 11,
                  }}
                >
                  {showHint ? 'Hide hint' : '💡 Hint'}
                </button>

                <div style={{ display: 'flex', gap: 6 }}>
                  {channels.map(ch => (
                    <button
                      key={ch.id}
                      onClick={() => !ch.locked && !isCorrect && dispatch({ type: 'ASSIGN_CHANNEL', serviceId: svc.id, channel: ch.id })}
                      title={ch.locked ? ch.lockReason : ch.desc}
                      style={{
                        padding: '6px 12px',
                        background: assignment?.channel === ch.id
                          ? (isCorrect ? ch.color + '33' : '#3b1818')
                          : '#1e293b',
                        border: `1px solid ${assignment?.channel === ch.id
                          ? (isCorrect ? ch.color : '#ef4444')
                          : ch.locked ? '#1e293b' : ch.color + '55'}`,
                        color: ch.locked ? '#334155' : ch.color,
                        borderRadius: 6, cursor: ch.locked || isCorrect ? 'not-allowed' : 'pointer',
                        fontSize: 12, fontWeight: assignment?.channel === ch.id ? 700 : 400,
                        opacity: ch.locked ? 0.4 : 1,
                        transition: 'all 0.15s',
                      }}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>

                {isCorrect && (
                  <span style={{ color: '#4ade80', fontSize: 20 }}>✓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
