import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import { GOVERNMENT_SERVICES } from '../../gameData';
import { calcLifeEventsProgress } from '../../gameReducer';

export default function Chapter6_LifeEvents({ state, dispatch }) {
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const progress = calcLifeEventsProgress(state);
  const optimized = state.lifeEvents.filter(e => e.optimized).length;

  function getBlockers(event) {
    const blockers = [];
    const activeConnections = Object.values(state.connections).filter(c => c.active);

    // Check ADEL connections
    event.requiredConnections?.forEach(([a, b]) => {
      const key = [a, b].sort().join('--');
      const conn = state.connections[key];
      if (!conn?.active) {
        const nodeNames = event.agencyNames;
        blockers.push(`⚠️ Missing ADEL connection — go to Chapter 3`);
      }
    });

    // Check data fields
    event.requiredFields?.forEach(fieldId => {
      const field = state.dataFields.find(f => f.id === fieldId);
      if (!field?.cataloged) {
        blockers.push(`⚠️ "${field?.label || fieldId}" not cataloged — go to Chapter 2`);
      }
    });

    // Check required tools
    event.requiredTools?.forEach(toolId => {
      const tool = state.serviceTools.find(t => t.id === toolId);
      if (!tool?.deployed) {
        blockers.push(`⚠️ "${tool?.name || toolId}" not deployed — go to Chapter 4`);
      }
    });

    // Check channel assignment
    if (event.requiredChannel) {
      const assignment = state.channelAssignments[event.requiredChannel];
      if (!assignment?.correct) {
        const svc = GOVERNMENT_SERVICES.find(s => s.id === event.requiredChannel);
        blockers.push(`⚠️ Channel for "${svc?.name}" not optimized — go to Chapter 5`);
      }
    }

    return [...new Set(blockers)]; // dedupe
  }

  function handleOptimize(event) {
    setAnimating(event.id);
    setTimeout(() => {
      dispatch({ type: 'OPTIMIZE_LIFE_EVENT', eventId: event.id });
      setAnimating(null);
    }, 2000);
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: '#2dd4bf', fontSize: 22 }}>Layer 6 — Life Events</h2>
        <span style={{ color: '#64748b', fontSize: 14 }}>Life Happens</span>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        Transform 8 critical citizen life events from bureaucratic nightmares to seamless digital journeys.
        Each event requires all dependencies to be in place before optimization.
      </p>

      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={progress} color="#2dd4bf" label="Life Events Progress" height={12} />
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
          {optimized}/8 events optimized
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
        {state.lifeEvents.map(event => {
          const blockers = event.optimized ? [] : getBlockers(event);
          const canOptimize = blockers.length === 0 && !event.optimized;
          const isAnimating = animating === event.id;
          const isSelected = selected === event.id;

          return (
            <div key={event.id} style={{
              background: '#111827',
              border: `2px solid ${event.optimized ? '#2dd4bf66' : isSelected ? '#334155' : '#1e293b'}`,
              borderRadius: 12, overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Header */}
              <div
                onClick={() => setSelected(isSelected ? null : event.id)}
                style={{
                  padding: '14px 16px', cursor: 'pointer',
                  background: event.optimized ? '#0a2520' : '#0f172a',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <span style={{ fontSize: 28 }}>{event.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15 }}>{event.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{event.description}</div>
                </div>
                {event.optimized ? (
                  <span style={{ color: '#2dd4bf', fontSize: 20 }}>✓</span>
                ) : (
                  <span style={{ color: '#334155', fontSize: 16 }}>{isSelected ? '▲' : '▼'}</span>
                )}
              </div>

              {/* Expanded content */}
              {(isSelected || event.optimized) && (
                <div style={{ padding: '16px' }}>
                  {/* Before / After */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      padding: '12px', background: '#1e0a0a', borderRadius: 8,
                      border: '1px solid #ef444433',
                    }}>
                      <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Current State
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>
                        {isAnimating ? '...' : event.optimized ? event.targetSteps : event.currentSteps}
                        <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 4 }}>steps</span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fca5a5', marginTop: 4 }}>
                        {isAnimating ? '...' : event.optimized ? (event.targetDays === 0 ? 'instant' : `${event.targetDays}d`) : `${event.currentDays}d`}
                      </div>
                    </div>
                    <div style={{
                      padding: '12px', background: '#0a201a', borderRadius: 8,
                      border: '1px solid #2dd4bf33',
                    }}>
                      <div style={{ fontSize: 11, color: '#2dd4bf', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        ADEL Target
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#2dd4bf' }}>
                        {event.targetSteps}
                        <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 4 }}>steps</span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#99f6e4', marginTop: 4 }}>
                        {event.targetDays === 0 ? 'instant' : `${event.targetDays}d`}
                      </div>
                    </div>
                  </div>

                  {/* Agencies */}
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
                    Agencies involved: {event.agencyNames.join(' → ')}
                  </div>

                  {/* Blockers */}
                  {!event.optimized && blockers.length > 0 && (
                    <div style={{
                      background: '#1a1200', border: '1px solid #f59e0b44',
                      borderRadius: 8, padding: '10px 14px', marginBottom: 12,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 6 }}>
                        Blockers ({blockers.length}):
                      </div>
                      {blockers.map((b, i) => (
                        <div key={i} style={{ fontSize: 12, color: '#fbbf24', marginBottom: 3 }}>{b}</div>
                      ))}
                    </div>
                  )}

                  {/* Optimize button */}
                  {!event.optimized && (
                    <button
                      onClick={() => canOptimize && handleOptimize(event)}
                      disabled={!canOptimize || isAnimating}
                      style={{
                        width: '100%', padding: '12px',
                        background: canOptimize ? '#0a2520' : '#111',
                        border: `2px solid ${canOptimize ? '#2dd4bf' : '#334155'}`,
                        color: canOptimize ? '#2dd4bf' : '#475569',
                        borderRadius: 8, cursor: canOptimize ? 'pointer' : 'not-allowed',
                        fontSize: 14, fontWeight: 700,
                        transition: 'all 0.2s',
                      }}
                    >
                      {isAnimating ? '✨ Optimizing...' :
                        canOptimize ? '🚀 Optimize Life Event' : `🔒 ${blockers.length} blocker${blockers.length > 1 ? 's' : ''} remaining`}
                    </button>
                  )}

                  {event.optimized && (
                    <div style={{
                      padding: '12px', background: '#0a2520',
                      border: '1px solid #2dd4bf', borderRadius: 8,
                      textAlign: 'center', color: '#2dd4bf', fontWeight: 700,
                    }}>
                      ✅ Life event transformed — citizens experience seamless digital journey
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
