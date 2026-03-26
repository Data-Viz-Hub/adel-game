import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import { GOVERNMENT_SERVICES } from '../../gameData';
import { calcLifeEventsProgress } from '../../gameReducer';
import { C } from '../../colors';

export default function Chapter6_LifeEvents({ state, dispatch, locked }) {
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(null);
  const progress = calcLifeEventsProgress(state);

  function getBlockers(event) {
    const blockers = new Set();
    event.requiredConnections?.forEach(([a, b]) => {
      const key = [a, b].sort().join('--');
      if (!state.connections[key]?.active) blockers.add('⚠ Missing ADEL connection — go to Chapter 3');
    });
    event.requiredFields?.forEach(fid => {
      const f = state.dataFields.find(f => f.id === fid);
      if (!f?.cataloged) blockers.add(`⚠ "${f?.label}" not cataloged — go to Chapter 2`);
    });
    event.requiredTools?.forEach(tid => {
      const t = state.serviceTools.find(t => t.id === tid);
      if (!t?.deployed) blockers.add(`⚠ "${t?.name}" not deployed — go to Chapter 4`);
    });
    if (event.requiredChannel) {
      const asgn = state.channelAssignments[event.requiredChannel];
      if (!asgn?.correct) {
        const svc = GOVERNMENT_SERVICES.find(s => s.id === event.requiredChannel);
        blockers.add(`⚠ Channel for "${svc?.name}" not optimized — go to Chapter 5`);
      }
    }
    return [...blockers];
  }

  function handleOptimize(event) {
    setAnimating(event.id);
    setTimeout(() => {
      dispatch({ type: 'OPTIMIZE_LIFE_EVENT', eventId: event.id });
      setAnimating(null);
    }, 1800);
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 6 — Life Events</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Transform 8 citizen life events from bureaucratic chaos to seamless digital journeys. Each event checks all prior layers.
      </p>

      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={progress} label={`Life Events — ${state.lifeEvents.filter(e => e.optimized).length}/8 optimized`} height={10} />
      </div>

      <div className="grid-auto">
        {state.lifeEvents.map(event => {
          const blockers = event.optimized ? [] : getBlockers(event);
          const canOptimize = blockers.length === 0 && !event.optimized;
          const isAnim = animating === event.id;
          const isOpen = selected === event.id;

          return (
            <div key={event.id} style={{
              background: C.CARD,
              border: `2px solid ${event.optimized ? C.BLUE + '66' : isOpen ? C.BORDER : C.BORDER}`,
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

                  <div style={{ fontSize: 11, color: C.MUTED, marginBottom: 10, lineHeight: 1.5 }}>
                    {event.agencyNames.join(' → ')}
                  </div>

                  {!event.optimized && blockers.length > 0 && (
                    <div style={{
                      background: `${C.ORANGE}11`, border: `1px solid ${C.ORANGE}44`,
                      borderRadius: 7, padding: '10px 12px', marginBottom: 10,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.ORANGE, marginBottom: 5 }}>
                        {blockers.length} blocker{blockers.length > 1 ? 's' : ''}:
                      </div>
                      {blockers.map((b, i) => (
                        <div key={i} style={{ fontSize: 11, color: C.ORANGE, marginBottom: 2 }}>{b}</div>
                      ))}
                    </div>
                  )}

                  {!event.optimized ? (
                    <button
                      onClick={() => canOptimize && !locked && handleOptimize(event)}
                      disabled={!canOptimize || isAnim || locked}
                      style={{
                        width: '100%', padding: '11px',
                        background: canOptimize ? C.BLUE_DIM : C.RAISED,
                        border: `2px solid ${canOptimize ? C.BLUE : C.BORDER}`,
                        color: canOptimize ? C.TEXT : C.FAINT,
                        borderRadius: 8, cursor: canOptimize ? 'pointer' : 'not-allowed',
                        fontSize: 13, fontWeight: 700,
                      }}
                    >
                      {isAnim ? '✨ Optimizing…' : canOptimize ? '🚀 Optimize Life Event' : `🔒 ${blockers.length} blocker${blockers.length > 1 ? 's' : ''} remaining`}
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
