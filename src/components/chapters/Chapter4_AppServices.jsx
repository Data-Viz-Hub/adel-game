import ProgressBar from '../shared/ProgressBar';
import { calcAppServicesProgress, calcInteropProgress } from '../../gameReducer';

const CATEGORY_COLORS = {
  'Digital Profile': '#818cf8',
  'No-Code Platform': '#34d399',
  'Shared Service': '#f59e0b',
};

export default function Chapter4_AppServices({ state, dispatch }) {
  const progress = calcAppServicesProgress(state);
  const interopScore = calcInteropProgress(state);
  const digitalIdLaw = state.laws.find(l => l.id === 'law02');

  function canDeploy(tool) {
    if (tool.deployed) return { ok: false, reason: 'Already deployed' };
    if (tool.requiresEid) {
      const eid = state.serviceTools.find(t => t.id === 'st01');
      if (!eid?.deployed) return { ok: false, reason: 'Requires e-Identity Gateway deployed first' };
    }
    if (tool.requiresAdel) {
      const activeConns = Object.values(state.connections).filter(c => c.active).length;
      const minConns = tool.minAdelConnections || 1;
      if (activeConns < minConns) return { ok: false, reason: `Requires ${minConns} active ADEL connection(s) (Chapter 3)` };
    }
    if (tool.requiresHub) {
      const hasHub = state.serviceTools.some(t => t.category === 'Shared Service' && t.deployed && t.id !== tool.id);
      if (!hasHub) return { ok: false, reason: 'Requires at least 1 Shared Service deployed first' };
    }
    if (tool.requiresMyData) {
      const myData = state.serviceTools.find(t => t.id === 'st02');
      if (!myData?.deployed) return { ok: false, reason: 'Requires My Data Portal deployed first' };
    }
    if (state.budget < tool.cost) return { ok: false, reason: `Insufficient budget (need ${tool.cost})` };
    return { ok: true };
  }

  function getAdoptionMultiplier(tool) {
    let m = 1;
    if (tool.id === 'st01' && digitalIdLaw?.bonusApplied) m *= 2;
    if (interopScore >= 60) m *= 1.5;
    if (state.budget < 20) m *= 0.5;
    return m;
  }

  const grouped = {};
  state.serviceTools.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: '#f59e0b', fontSize: 22 }}>Layer 4 — Application Services</h2>
        <span style={{ color: '#64748b', fontSize: 14 }}>The Toolkit</span>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        Deploy 10 shared digital services that power government interactions. Each service needs to be deployed
        then adopted by agencies. Adoption speed is affected by laws, interoperability score, and budget.
      </p>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={progress} color="#f59e0b" label="Application Services Progress" height={12} />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#64748b' }}>
          <span>🔓 Channels unlocks at 50%</span>
          {digitalIdLaw?.bonusApplied && <span style={{ color: '#4ade80' }}>✓ Digital Identity Law active — e-ID adoption 2×</span>}
          {interopScore >= 60 && <span style={{ color: '#4ade80' }}>✓ High interop — all tools 1.5× adoption</span>}
          {state.budget < 20 && <span style={{ color: '#ef4444' }}>⚠️ Low budget — adoption at 0.5×</span>}
        </div>
      </div>

      {Object.entries(grouped).map(([category, tools]) => (
        <div key={category} style={{ marginBottom: 28 }}>
          <h3 style={{
            fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
            color: CATEGORY_COLORS[category], marginBottom: 12, paddingBottom: 6,
            borderBottom: `1px solid ${CATEGORY_COLORS[category]}33`,
          }}>
            {category}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {tools.map(tool => {
              const { ok, reason } = canDeploy(tool);
              const adoptionPct = Math.round(tool.adopters / tool.maxAdopters * 100);
              const catColor = CATEGORY_COLORS[tool.category];
              const multiplier = getAdoptionMultiplier(tool);
              const canAdopt = tool.deployed && tool.adopters < tool.maxAdopters && state.budget >= 1;

              return (
                <div key={tool.id} style={{
                  background: '#111827',
                  border: `1px solid ${tool.deployed ? catColor + '66' : '#1e293b'}`,
                  borderRadius: 10, padding: '16px',
                  opacity: (!tool.deployed && !ok) ? 0.6 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14, marginBottom: 3 }}>
                        {tool.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{tool.description}</div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 12, marginLeft: 8, flexShrink: 0,
                      background: tool.deployed ? catColor + '22' : '#1e293b',
                      color: tool.deployed ? catColor : '#475569',
                    }}>
                      {tool.deployed ? '✓ Live' : `${tool.cost} 💰`}
                    </span>
                  </div>

                  {tool.deployed ? (
                    <div style={{ marginTop: 10 }}>
                      <ProgressBar value={adoptionPct} color={catColor} label={`Adoption: ${tool.adopters}/${tool.maxAdopters} agencies`} height={8} />
                      {multiplier !== 1 && (
                        <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>
                          ⚡ {multiplier}× adoption speed active
                        </div>
                      )}
                      {canAdopt && (
                        <button
                          onClick={() => dispatch({ type: 'ONBOARD_AGENCY', toolId: tool.id })}
                          style={{
                            marginTop: 10, width: '100%', padding: '8px',
                            background: '#1a200a', border: `1px solid ${catColor}66`,
                            color: catColor, borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          }}
                        >
                          + Onboard Next Agency (−1 💰)
                        </button>
                      )}
                      {tool.adopters >= tool.maxAdopters && (
                        <div style={{ fontSize: 12, color: '#4ade80', marginTop: 8, textAlign: 'center' }}>
                          ✓ Fully adopted by all agencies
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ marginTop: 10 }}>
                      {reason && !ok && (
                        <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 8, padding: '6px 10px', background: '#1a1200', borderRadius: 6 }}>
                          ⚠️ {reason}
                        </div>
                      )}
                      <button
                        onClick={() => ok && dispatch({ type: 'DEPLOY_TOOL', toolId: tool.id })}
                        disabled={!ok}
                        style={{
                          width: '100%', padding: '10px',
                          background: ok ? '#1a200a' : '#111',
                          border: `1px solid ${ok ? catColor : '#334155'}`,
                          color: ok ? catColor : '#475569',
                          borderRadius: 6, cursor: ok ? 'pointer' : 'not-allowed',
                          fontSize: 13, fontWeight: 600,
                        }}
                      >
                        {ok ? `Deploy ${tool.name} (−${tool.cost} 💰)` : `Locked`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
