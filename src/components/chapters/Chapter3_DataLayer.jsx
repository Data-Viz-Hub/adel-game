import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import Modal from '../shared/Modal';
import { calcDataProgress } from '../../gameReducer';
import { C } from '../../colors';

export default function Chapter3_DataLayer({ state, dispatch, locked }) {
  const [phase, setPhase] = useState('align');
  const [aligningField, setAliningField] = useState(null);
  const [catalogingField, setCatalogingField] = useState(null);
  const [catalogOwner, setCatalogOwner] = useState('');

  const progress = calcDataProgress(state);
  const popLaw = state.laws.find(l => l.id === 'law01');
  const pubLaw = state.laws.find(l => l.id === 'law04');

  function handleAlign(fieldId) {
    const field = state.dataFields.find(f => f.id === fieldId);
    if (!field || field.aligned) return;
    dispatch({ type: 'ALIGN_DATA_FIELD', fieldId, answer: field.standard });
    setAliningField(null);
  }

  function handleCatalog() {
    if (!catalogOwner) return;
    dispatch({ type: 'CATALOG_DATA_FIELD', fieldId: catalogingField.id, metadata: { owner: catalogOwner } });
    setCatalogingField(null);
    setCatalogOwner('');
  }

  const selStyle = (active) => ({
    padding: '5px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
    background: active ? C.BLUE_DIM : C.CARD,
    border: `1px solid ${active ? C.BLUE : C.BORDER}`,
    color: active ? C.TEXT : C.MUTED,
  });

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 3 — Data Layer</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Align 11 data fields to international standards, then register them in the National Data Catalog with their owner agency.
      </p>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={progress} label="Data Layer Progress" height={10} />
        <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: C.MUTED, flexWrap: 'wrap' }}>
          <span>🔓 Layer 4 (ADEL) unlocks at 20%</span>
          <span>🔓 Layer 5 (App Services) unlocks at 30%</span>
        </div>
      </div>

      {/* Law indicators */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { law: popLaw, label: 'Population Register Law' },
          { law: pubLaw, label: 'Public Information Law' },
        ].map(({ law, label }) => (
          <div key={label} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 11,
            background: law?.bonusApplied ? `${C.BLUE_DIM}88` : C.CARD,
            border: `1px solid ${law?.bonusApplied ? C.BLUE : C.BORDER}`,
            color: law?.bonusApplied ? C.BLUE : C.FAINT,
          }}>
            {law?.bonusApplied ? '✓' : '○'} {label}
            {law?.enacted && !law.bonusApplied ? ' (pending)' : ''}
          </div>
        ))}
      </div>

      {/* Phase toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <button onClick={() => setPhase('align')} style={selStyle(phase === 'align')}>
          Phase A — Semantic Alignment
        </button>
        <button onClick={() => setPhase('catalog')} style={selStyle(phase === 'catalog')}>
          Phase B — Catalog Registration
        </button>
      </div>

      <div className="grid-auto">
        {state.dataFields.map(field => {
          const status = field.cataloged ? 'cataloged' : field.aligned ? 'aligned' : 'raw';
          const statusColor = { cataloged: C.BLUE, aligned: C.ORANGE, raw: C.FAINT }[status];
          const statusLabel = { cataloged: '📁 Cataloged', aligned: '⚡ Aligned', raw: '⚠ Raw' }[status];

          // Find owner agency name for display
          const ownerAgency = state.agencies.find(a => a.id === field.ownerAgencyId);

          return (
            <div key={field.id} style={{
              background: C.CARD,
              border: `1px solid ${field.aligned ? C.BLUE + '66' : C.BORDER}`,
              borderRadius: 8, padding: '14px',
              opacity: phase === 'catalog' && !field.aligned ? 0.5 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{
                  fontSize: 10, background: C.RAISED, color: C.MUTED,
                  padding: '2px 7px', borderRadius: 10,
                }}>{field.category}</span>
                <span style={{ fontSize: 10, color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
              </div>
              <div style={{ fontWeight: 700, color: C.TEXT, marginBottom: 4, fontSize: 13 }}>{field.label}</div>
              <div style={{ fontSize: 11, color: C.FAINT, marginBottom: 8, lineHeight: 1.4 }}>{field.description}</div>

              {phase === 'align' ? (
                !field.aligned ? (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
                      {field.variants.map(v => (
                        <span key={v} style={{
                          fontSize: 10, background: C.RAISED, color: C.MUTED,
                          padding: '1px 5px', borderRadius: 3,
                          fontFamily: "'DM Mono', monospace",
                        }}>{v}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => !locked && setAliningField(field)}
                      style={{
                        width: '100%', padding: '8px',
                        background: locked ? C.RAISED : C.BLUE_DIM,
                        border: `1px solid ${locked ? C.BORDER : C.BLUE}`,
                        color: locked ? C.FAINT : C.TEXT, borderRadius: 6,
                        cursor: locked ? 'not-allowed' : 'pointer',
                        fontSize: 12, fontWeight: 600,
                      }}
                    >
                      {locked ? '🔒 Locked' : 'Align to Standard →'}
                    </button>
                  </>
                ) : (
                  <div style={{
                    fontSize: 11, fontFamily: "'DM Mono', monospace",
                    color: C.BLUE, padding: '6px 8px',
                    background: `${C.BLUE}11`, borderRadius: 4,
                  }}>
                    ✓ {field.standard}
                  </div>
                )
              ) : (
                !field.aligned ? (
                  <div style={{ fontSize: 11, color: C.FAINT }}>⚠ Align field first (Phase A)</div>
                ) : field.cataloged ? (
                  <div style={{ fontSize: 11, color: C.MUTED, lineHeight: 1.6 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", color: C.BLUE, marginBottom: 4 }}>{field.standard}</div>
                    📁 {field.catalogMetadata?.owner}
                  </div>
                ) : (
                  <button
                    onClick={() => !locked && setCatalogingField(field)}
                    style={{
                      width: '100%', padding: '8px',
                      background: locked ? C.RAISED : C.RAISED,
                      border: `1px solid ${locked ? C.BORDER : C.ORANGE}`,
                      color: locked ? C.FAINT : C.ORANGE, borderRadius: 6,
                      cursor: locked ? 'not-allowed' : 'pointer',
                      fontSize: 12, fontWeight: 600,
                    }}
                  >
                    {locked ? '🔒 Locked' : 'Register in Catalog →'}
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Alignment modal */}
      {aligningField && (
        <Modal title={`Align: ${aligningField.label}`} onClose={() => setAliningField(null)}>
          <p style={{ color: C.MUTED, fontSize: 13, marginBottom: 8 }}>
            Confirm the international standard name for this field:
          </p>
          <div style={{ fontSize: 11, color: C.FAINT, marginBottom: 14 }}>
            Current variants in use: {aligningField.variants.join(', ')}
          </div>
          <button
            onClick={() => handleAlign(aligningField.id)}
            style={{
              width: '100%', padding: '14px',
              background: C.BLUE_DIM,
              border: `1px solid ${C.BLUE}`,
              color: C.TEXT, borderRadius: 7, cursor: 'pointer', textAlign: 'left',
              fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700,
            }}
          >
            ✓ {aligningField.standard}
          </button>
          <p style={{ color: C.FAINT, fontSize: 11, marginTop: 14 }}>
            All variants will be mapped to this standard across all agencies.
          </p>
        </Modal>
      )}

      {/* Catalog registration modal */}
      {catalogingField && (
        <Modal title={`Register: ${catalogingField.label}`} onClose={() => { setCatalogingField(null); setCatalogOwner(''); }}>
          <div style={{ fontSize: 12, color: C.MUTED, marginBottom: 14, lineHeight: 1.5 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", color: C.BLUE }}>{catalogingField.standard}</span>
            <br />{catalogingField.description}
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.MUTED, display: 'block', marginBottom: 5 }}>Owner Agency</label>
            <select
              value={catalogOwner}
              onChange={e => setCatalogOwner(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                background: C.RAISED, border: `1px solid ${C.BORDER}`,
                color: C.TEXT, borderRadius: 6, fontSize: 13,
              }}
            >
              <option value="">Select the agency that owns this data…</option>
              {state.agencies.map(a => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCatalog}
            disabled={!catalogOwner}
            style={{
              marginTop: 18, width: '100%', padding: '12px',
              background: C.ORANGE, border: 'none', color: '#000',
              borderRadius: 8, cursor: catalogOwner ? 'pointer' : 'not-allowed',
              fontSize: 14, fontWeight: 700,
              opacity: catalogOwner ? 1 : 0.4,
            }}
          >
            Register in National Data Catalog
          </button>
        </Modal>
      )}
    </div>
  );
}
