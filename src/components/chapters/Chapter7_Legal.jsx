import ProgressBar from '../shared/ProgressBar';
import { getLayerProgress, calcLegalProgress } from '../../gameReducer';

export default function Chapter7_Legal({ state, dispatch }) {
  const progress = calcLegalProgress(state);
  const layerProgress = getLayerProgress(state);
  const allLawsEnacted = state.laws.every(l => l.enacted);
  const allEffective = state.laws.every(l => l.enacted && l.bonusApplied);
  const boardActivated = allLawsEnacted && allEffective;

  function getLawStatus(law) {
    if (!law.enacted) return { label: 'Draft', color: '#475569' };
    if (!law.bonusApplied) return { label: 'Enacted — Awaiting Tech Layer', color: '#f59e0b' };
    return { label: 'Enacted & Effective', color: '#4ade80' };
  }

  const LAW_ICONS = { law01: '📋', law02: '🪪', law03: '🛡️', law04: '📢' };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: '#f87171', fontSize: 22 }}>Layer 7 — Legal & Governance</h2>
        <span style={{ color: '#64748b', fontSize: 14 }}>The Laws That Bind</span>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
        Draft and enact 4 foundational laws. Laws can be enacted at any time, but their full impact only activates
        once the corresponding technical layer is ready. Legislation without infrastructure is ineffective.
      </p>

      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={progress} color="#f87171" label="Legal & Governance Progress" height={12} />
      </div>

      {boardActivated && (
        <div style={{
          background: 'linear-gradient(135deg, #1a0a00, #2a1a00)',
          border: '2px solid #fbbf24', borderRadius: 12,
          padding: '20px 24px', marginBottom: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏛️</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fbbf24', marginBottom: 8 }}>
            Information Systems Management Board — ACTIVATED
          </div>
          <div style={{ fontSize: 13, color: '#fde68a' }}>
            All 4 laws enacted and effective. Board provides 1.2× global multiplier on all progress.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {state.laws.map(law => {
          const status = getLawStatus(law);
          const layerPct = layerProgress[law.dependentLayer] || 0;
          const techReady = layerPct >= law.dependentThreshold;

          return (
            <div key={law.id} style={{
              background: '#111827',
              border: `2px solid ${law.bonusApplied ? '#4ade8055' : law.enacted ? '#f59e0b55' : '#1e293b'}`,
              borderRadius: 12, padding: '20px',
              position: 'relative', overflow: 'hidden',
            }}>
              {law.bonusApplied && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  background: '#4ade8022', padding: '4px 12px',
                  fontSize: 10, color: '#4ade80', fontWeight: 700,
                  borderBottomLeftRadius: 8,
                }}>EFFECTIVE</div>
              )}

              <div style={{ fontSize: 32, marginBottom: 12 }}>{LAW_ICONS[law.id]}</div>
              <h3 style={{ margin: '0 0 6px', color: '#f1f5f9', fontSize: 16 }}>{law.name}</h3>
              <div style={{ fontSize: 11, color: status.color, marginBottom: 14, fontWeight: 600 }}>
                {status.label}
              </div>

              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.6 }}>
                {law.description}
              </p>

              <div style={{
                padding: '10px 14px', background: '#0f172a', borderRadius: 8,
                marginBottom: 16, fontSize: 12,
              }}>
                <div style={{ color: '#60a5fa', fontWeight: 700, marginBottom: 4 }}>Effect when effective:</div>
                <div style={{ color: '#94a3b8' }}>{law.effect}</div>
              </div>

              {/* Tech layer progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                  <span>Required: {law.impactArea} ≥ {law.dependentThreshold}%</span>
                  <span style={{ color: techReady ? '#4ade80' : '#f59e0b' }}>
                    {layerPct}% {techReady ? '✓' : ''}
                  </span>
                </div>
                <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, layerPct)}%`,
                    height: '100%',
                    background: techReady ? '#4ade80' : '#f59e0b',
                    borderRadius: 3, transition: 'width 0.5s',
                  }} />
                </div>
              </div>

              {law.enacted && !law.bonusApplied && (
                <div style={{
                  padding: '8px 12px', background: '#1a1200',
                  border: '1px solid #f59e0b44', borderRadius: 6,
                  fontSize: 12, color: '#fbbf24', marginBottom: 12,
                }}>
                  ⚖️ Enacted but not yet effective — requires {law.impactArea} to reach {law.dependentThreshold}%
                </div>
              )}

              {!law.enacted ? (
                <button
                  onClick={() => dispatch({ type: 'ENACT_LAW', lawId: law.id })}
                  style={{
                    width: '100%', padding: '12px',
                    background: '#2a0a0a', border: '2px solid #f87171',
                    color: '#f87171', borderRadius: 8, cursor: 'pointer',
                    fontSize: 14, fontWeight: 700,
                  }}
                >
                  ⚖️ Enact {law.name}
                </button>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '10px',
                  color: law.bonusApplied ? '#4ade80' : '#f59e0b',
                  fontSize: 13, fontWeight: 600,
                }}>
                  {law.bonusApplied ? '✅ Law enacted & fully effective' : '⏳ Law enacted — awaiting technical readiness'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: '#0f172a', borderRadius: 10, fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
        <strong style={{ color: '#94a3b8' }}>💡 Key Insight:</strong> Enacting a law before the technical infrastructure exists creates
        a "law without teeth" — the legal framework is in place but cannot be enforced or realized.
        The optimal strategy is to build the technical layers first, then enact laws to amplify their impact.
      </div>
    </div>
  );
}
