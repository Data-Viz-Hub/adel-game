import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import { calcLifeEventsProgress, getLifeEventPrerequisites } from '../../gameReducer';
import { C } from '../../colors';

const TYPE_CHAPTER = { connection: 4, dataField: 3, tool: 5, channel: 6 };
const TYPE_LABEL = { connection: 'Layer 4', dataField: 'Layer 3', tool: 'Layer 5', channel: 'Layer 6' };

export default function Chapter6_LifeEvents({ state, dispatch, locked }) {
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(null);
  const progress = calcLifeEventsProgress(state);

  function handleOptimize(event) {
    setAnimating(event.id);
    setTimeout(() => {
      dispatch({ type: 'OPTIMIZE_LIFE_EVENT', eventId: event.id });
      setAnimating(null);
    }, 1800);
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 7 — Life Events</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Transform 8 citizen life events from bureaucratic chaos to seamless digital journeys. Each event checks all prior layers.
      </p>

      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={progress} label={`Life Events — ${state.lifeEvents.filter(e => e.optimized).length}/8 optimized`} height={10} />
      </div>

      <div className="grid-auto">
        {state.lifeEvents.map(event => {
          const prereqs = event.optimized ? { allMet: true, items: [] } : getLifeEventPrerequisites(event, state);
          const canOptimize = prereqs.allMet && !event.optimized;
          const unmetCount = prereqs.items.filter(i => !i.met).length;
          const isAnim = animating === event.id;
          const isOpen = selected === event.id;

          return (
            <div key={event.id} style={{
              background: C.CARD,
              border: `2px solid ${event.optimized ? C.BLUE + '66' : C.BORDER}`,
              borderRadius: 10, overflow: 'hidden',
            }}>
              {/* Header */}
              <div
                onClick={() => setSelected(isOpen ? null : event.id)}
                style={{
                  padding: '12px 14px', cursor: 'pointer',
                  background: event.optimized ? `${C.BLUE_DIM}44` : C.RAISED,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{event.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: C.TEXT, fontSize: 13 }}>{event.name}</div>
                  <div style={{ fontSize: 10, color: C.MUTED, marginTop: 2 }}>{event.description}</div>
                </div>
                {event.optimized
                  ? <span style={{ color: C.BLUE, fontSize: 18, flexShrink: 0 }}>✓</span>
                  : <span style={{ color: C.FAINT, fontSize: 14, flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                }
              </div>

              {/* Expanded */}
              {(isOpen || event.optimized) && (
                <div style={{ padding: '14px' }}>
                  {/* Before / After */}
                  <div className="grid-halves" style={{ marginBottom: 12 }}>
                    <div style={{
                      padding: '10px 12px', background: C.ERROR_BG,
                      borderRadius: 7, border: `1px solid ${C.ERROR}33`,
                    }}>
                      <div style={{ fontSize: 9, color: C.ERROR, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Current</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.ERROR }}>
                        {isAnim ? '…' : event.optimized ? event.targetSteps : event.currentSteps}
                        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 3 }}>steps</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.ERROR }}>
                        {isAnim ? '…' : event.optimized ? (event.targetDays === 0 ? 'instant' : `${event.targetDays}d`) : `${event.currentDays}d`}
                      </div>
                    </div>
                    <div style={{
                      padding: '10px 12px', background: `${C.BLUE_DIM}22`,
                      borderRadius: 7, border: `1px solid ${C.BLUE}33`,
                    }}>
                      <div style={{ fontSize: 9, color: C.BLUE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>ADEL Target</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.BLUE }}>
                        {event.targetSteps}
                        <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 3 }}>steps</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.BLUE }}>
                        {event.targetDays === 0 ? 'instant' : `${event.targetDays}d`}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: C.MUTED, marginBottom: 12, lineHeight: 1.5 }}>
                    {event.agencyNames.join(' → ')}
                  </div>

                  {/* Prerequisites checklist */}
                  {!event.optimized && prereqs.items.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: C.FAINT,
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
                      }}>
                        Prerequisites — {prereqs.items.filter(i => i.met).length}/{prereqs.items.length} met
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {prereqs.items.map(item => (
                          <div key={item.id} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 10px',
                            background: item.met ? `${C.BLUE}08` : C.ERROR_BG,
                            border: `1px solid ${item.met ? C.BLUE + '33' : C.ERROR + '33'}`,
                            borderRadius: 6,
                          }}>
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{item.met ? '✅' : '❌'}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: item.met ? C.BLUE : C.ERROR }}>
                                {item.icon} {item.label}
                              </div>
                              <div style={{ fontSize: 10, color: C.MUTED, marginTop: 1 }}>{item.detail}</div>
                            </div>
                            {!item.met && (
                              <button
                                onClick={() => dispatch({ type: 'SET_CHAPTER', chapter: item.targetChapter })}
                                style={{
                                  flexShrink: 0, padding: '4px 10px',
                                  background: C.BLUE, border: 'none',
                                  color: '#fff', borderRadius: 5,
                                  cursor: 'pointer', fontSize: 10, fontWeight: 700,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                → {TYPE_LABEL[item.type]}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!event.optimized ? (
                    <button
                      onClick={() => {
                        if (canOptimize && !locked) handleOptimize(event);
                        else setSelected(event.id);
                      }}
                      disabled={isAnim}
                      style={{
                        width: '100%', padding: '11px',
                        background: canOptimize ? C.BLUE_DIM : C.RAISED,
                        border: `2px solid ${canOptimize ? C.BLUE : C.BORDER}`,
                        color: canOptimize ? C.TEXT : C.MUTED,
                        borderRadius: 8, cursor: isAnim ? 'default' : 'pointer',
                        fontSize: 13, fontWeight: 700,
                      }}
                    >
                      {isAnim ? '✨ Optimizing…' : canOptimize ? '🚀 Optimize Life Event' : `🔒 ${unmetCount} prerequisite${unmetCount !== 1 ? 's' : ''} remaining`}
                    </button>
                  ) : (
                    <div style={{
                      padding: '10px', background: `${C.BLUE_DIM}44`,
                      border: `1px solid ${C.BLUE}`, borderRadius: 7,
                      textAlign: 'center', color: C.BLUE, fontWeight: 700, fontSize: 12,
                    }}>
                      ✅ Life event optimized — seamless digital journey
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
