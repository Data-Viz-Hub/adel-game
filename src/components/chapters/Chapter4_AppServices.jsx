import ProgressBar from '../shared/ProgressBar';
import { calcAppServicesProgress, calcInteropProgress } from '../../gameReducer';
import { C } from '../../colors';

export default function Chapter4_AppServices({ state, dispatch }) {
  const progress = calcAppServicesProgress(state);
  const interopPct = calcInteropProgress(state);
  const digitalIdLaw = state.laws.find(l => l.id === 'law02');

  function canDeploy(tool) {
    if (tool.deployed) return { ok: false };
    if (tool.requiresEid) {
      const eid = state.serviceTools.find(t => t.id === 'st01');
      if (!eid?.deployed) return { ok: false, reason: 'Requires e-Identity Gateway deployed first' };
    }
    if (tool.requiresAdel) {
      const active = Object.values(state.connections).filter(c => c.active).length;
      const min = tool.minAdelConnections || 1;
      if (active < min) return { ok: false, reason: `Requires ${min} ADEL connection(s) (Chapter 3)` };
    }
    if (tool.requiresHub) {
      const hasHub = state.serviceTools.some(t => t.category === 'Shared Service' && t.deployed && t.id !== tool.id);
      if (!hasHub) return { ok: false, reason: 'Requires 1 other Shared Service deployed first' };
    }
    if (tool.requiresMyData) {
      const md = state.serviceTools.find(t => t.id === 'st02');
      if (!md?.deployed) return { ok: false, reason: 'Requires My Data Portal deployed first' };
    }
    if (state.budget < tool.cost) return { ok: false, reason: `Need ${tool.cost} 💰 (have ${state.budget})` };
    return { ok: true };
  }

  function getMultiplier(tool) {
    let m = 1;
    if (tool.id === 'st01' && digitalIdLaw?.bonusApplied) m *= 2;
    if (interopPct >= 60) m *= 1.5;
    if (state.budget < 20) m *= 0.5;
    return m;
  }

  const grouped = {};
  state.serviceTools.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 4 — Application Services</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Deploy 10 shared digital services and onboard agencies. Adoption speed varies by laws, interoperability, and budget.
      </p>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={progress} label="Application Services Progress" height={10} />
        <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: C.MUTED, flexWrap: 'wrap' }}>
          <span>🔓 Channels unlocks at 50%</span>
          {digitalIdLaw?.bonusApplied && <span style={{ color: C.BLUE }}>✓ Digital ID Law — e-ID 2×</span>}
          {interopPct >= 60 && <span style={{ color: C.BLUE }}>✓ High interop — all 1.5×</span>}
          {state.budget < 20 && <span style={{ color: C.ORANGE }}>⚠ Low budget — 0.5×</span>}
        </div>
      </div>

      {Object.entries(grouped).map(([category, tools]) => (
        <div key={category} style={{ marginBottom: 24 }}>
          <h3 style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: C.MUTED, marginBottom: 10,
            paddingBottom: 6, borderBottom: `1px solid ${C.BORDER}`,
          }}>
            {category}
          </h3>
          <div className="grid-auto">
            {tools.map(tool => {
              const { ok, reason } = canDeploy(tool);
              const pct = Math.round(tool.adopters / tool.maxAdopters * 100);
              const m = getMultiplier(tool);
              const canAdopt = tool.deployed && tool.adopters < tool.maxAdopters && state.budget >= 1;

              return (
                <div key={tool.id} style={{
                  background: C.CARD,
                  border: `1px solid ${tool.deployed ? C.BLUE + '66' : C.BORDER}`,
                  borderRadius: 8, padding: '14px',
                  opacity: (!tool.deployed && !ok) ? 0.55 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: C.TEXT, fontSize: 13, marginBottom: 2 }}>{tool.name}</div>
                      <div style={{ fontSize: 11, color: C.MUTED }}>{tool.description}</div>
                    </div>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 10, flexShrink: 0,
                      background: tool.deployed ? `${C.BLUE_DIM}88` : C.RAISED,
                      color: tool.deployed ? C.BLUE : C.FAINT,
                    }}>
                      {tool.deployed ? '✓ Live' : `${tool.cost}💰`}
                    </span>
                  </div>

                  {tool.deployed ? (
                    <>
                      <ProgressBar value={pct} label={`${tool.adopters}/${tool.maxAdopters} agencies`} height={7} />
                      {m !== 1 && (
                        <div style={{ fontSize: 10, color: C.BLUE, marginTop: 4 }}>⚡ {m}× speed</div>
                      )}
                      {canAdopt ? (
                        <button onClick={() => dispatch({ type: 'ONBOARD_AGENCY', toolId: tool.id })} style={{
                          marginTop: 10, width: '100%', padding: '8px',
                          background: C.RAISED, border: `1px solid ${C.ORANGE}`,
                          color: C.ORANGE, borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        }}>
                          + Onboard Agency (−1💰)
                        </button>
                      ) : tool.adopters >= tool.maxAdopters ? (
                        <div style={{ fontSize: 11, color: C.BLUE, marginTop: 8, textAlign: 'center' }}>
                          ✓ Fully adopted
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {reason && <div style={{
                        fontSize: 10, color: C.ORANGE, marginBottom: 8,
                        padding: '5px 8px', background: `${C.ORANGE}11`, borderRadius: 5,
                      }}>⚠ {reason}</div>}
                      <button onClick={() => ok && dispatch({ type: 'DEPLOY_TOOL', toolId: tool.id })} disabled={!ok}
                        style={{
                          width: '100%', padding: '9px',
                          background: ok ? C.BLUE_DIM : C.RAISED,
                          border: `1px solid ${ok ? C.BLUE : C.BORDER}`,
                          color: ok ? C.TEXT : C.FAINT,
                          borderRadius: 6, cursor: ok ? 'pointer' : 'not-allowed',
                          fontSize: 12, fontWeight: 600,
                        }}>
                        {ok ? `Deploy (−${tool.cost}💰)` : 'Locked'}
                      </button>
                    </>
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
