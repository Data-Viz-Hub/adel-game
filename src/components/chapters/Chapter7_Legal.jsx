import ProgressBar from '../shared/ProgressBar';
import { getLayerProgress, calcLegalProgress } from '../../gameReducer';
import { C } from '../../colors';

export default function Chapter7_Legal({ state, dispatch }) {
  const progress = calcLegalProgress(state);
  const layerProgress = getLayerProgress(state);
  const allEffective = state.laws.every(l => l.enacted && l.bonusApplied);

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 7 — Legal & Governance</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Enact 4 foundational laws. Laws can be enacted at any time, but their impact only activates once the corresponding technical layer is ready.
      </p>

      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={progress} label="Legal & Governance Progress" height={10} />
      </div>

      {allEffective && (
        <div style={{
          background: `${C.BLUE_DIM}44`,
          border: `2px solid ${C.ORANGE}`,
          borderRadius: 10, padding: '16px 20px', marginBottom: 20,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>🏛️</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.ORANGE, marginBottom: 4 }}>
            Information Systems Management Board — ACTIVATED
          </div>
          <div style={{ fontSize: 12, color: C.MUTED }}>
            All 4 laws enacted and effective. Global 1.2× multiplier applied.
          </div>
        </div>
      )}

      <div className="grid-auto">
        {state.laws.map(law => {
          const layerPct = layerProgress[law.dependentLayer] || 0;
          const techReady = layerPct >= law.dependentThreshold;

          const statusColor = law.bonusApplied ? C.BLUE : law.enacted ? C.ORANGE : C.FAINT;
          const statusLabel = law.bonusApplied ? '✓ Effective'
            : law.enacted ? '⏳ Enacted — awaiting tech'
            : 'Draft';

          return (
            <div key={law.id} style={{
              background: C.CARD,
              border: `2px solid ${law.bonusApplied ? C.BLUE + '55' : law.enacted ? C.ORANGE + '55' : C.BORDER}`,
              borderRadius: 10, padding: '18px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{law.icon}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <h3 style={{ margin: 0, color: C.TEXT, fontSize: 14, fontWeight: 700, flex: 1, marginRight: 8 }}>
                  {law.name}
                </h3>
                <span style={{ fontSize: 10, color: statusColor, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {statusLabel}
                </span>
              </div>

              <p style={{ fontSize: 12, color: C.MUTED, marginBottom: 10, lineHeight: 1.6 }}>
                {law.description}
              </p>

              <div style={{
                padding: '8px 12px', background: C.RAISED, borderRadius: 6,
                marginBottom: 12, fontSize: 11,
              }}>
                <div style={{ color: C.BLUE, fontWeight: 700, marginBottom: 3 }}>Effect when active:</div>
                <div style={{ color: C.MUTED }}>{law.effect}</div>
              </div>

              {/* Tech layer requirement */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.MUTED, marginBottom: 4 }}>
                  <span>Requires: {law.impactArea} ≥ {law.dependentThreshold}%</span>
                  <span style={{ color: techReady ? C.BLUE : C.ORANGE }}>{layerPct}% {techReady ? '✓' : ''}</span>
                </div>
                <div style={{ height: 5, background: C.RAISED, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, layerPct)}%`, height: '100%',
                    background: techReady ? C.BLUE : C.ORANGE,
                    borderRadius: 3, transition: 'width 0.4s',
                  }} />
                </div>
              </div>

              {law.enacted && !law.bonusApplied && (
                <div style={{
                  padding: '7px 10px', background: `${C.ORANGE}11`,
                  border: `1px solid ${C.ORANGE}44`, borderRadius: 6,
                  fontSize: 11, color: C.ORANGE, marginBottom: 10,
                }}>
                  ⚖️ Law enacted — needs {law.impactArea} at {law.dependentThreshold}% to take effect
                </div>
              )}

              {!law.enacted ? (
                <button onClick={() => dispatch({ type: 'ENACT_LAW', lawId: law.id })} style={{
                  width: '100%', padding: '11px',
                  background: C.BLUE_DIM, border: `2px solid ${C.BLUE}`,
                  color: C.TEXT, borderRadius: 8, cursor: 'pointer',
                  fontSize: 13, fontWeight: 700,
                }}>
                  ⚖️ Enact Law
                </button>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '9px',
                  color: law.bonusApplied ? C.BLUE : C.ORANGE,
                  fontSize: 12, fontWeight: 600,
                }}>
                  {law.bonusApplied ? '✅ Fully effective' : '⏳ Awaiting technical readiness'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, padding: '12px 16px', background: C.CARD, borderRadius: 8, fontSize: 12, color: C.MUTED, lineHeight: 1.7 }}>
        <strong style={{ color: C.TEXT }}>💡 Key insight:</strong> Enacting a law before the technical infrastructure exists creates a "law without teeth."
        Build the technical layers first, then enact laws to amplify their impact.
      </div>
    </div>
  );
}
