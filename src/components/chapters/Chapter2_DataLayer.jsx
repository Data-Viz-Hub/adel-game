import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import Modal from '../shared/Modal';
import { calcDataProgress } from '../../gameReducer';

const CATEGORY_COLORS = {
  Identity: '#818cf8',
  Location: '#34d399',
  Finance: '#f59e0b',
  Social: '#ec4899',
  Contact: '#60a5fa',
  Business: '#a78bfa',
};

const CATALOG_OWNERS = [
  'Ministry of Justice', 'State Revenue Committee', 'Social Insurance Fund',
  'Ministry of Health', 'Ministry of Finance', 'E-Gov Infrastructure Center',
];
const LEGAL_BASES = ['Legal Obligation', 'Public Interest', 'Vital Interests', 'Consent', 'Contract'];
const UPDATE_FREQUENCIES = ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Annually'];

export default function Chapter2_DataLayer({ state, dispatch }) {
  const [phase, setPhase] = useState('align');
  const [aligningField, setAligningField] = useState(null);
  const [catalogingField, setCatalogingField] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ owner: '', legalBasis: '', frequency: '', classification: '' });
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const progress = calcDataProgress(state);
  const populationLaw = state.laws.find(l => l.id === 'law01');
  const publicInfoLaw = state.laws.find(l => l.id === 'law04');

  function getShuffledOptions(field) {
    const all = [field.standard, ...field.distractors];
    return all.sort(() => Math.random() - 0.5);
  }

  function handleAlign(fieldId, answer) {
    const field = state.dataFields.find(f => f.id === fieldId);
    if (answer !== field.standard) {
      setWrongAnswer(true);
      setTimeout(() => setWrongAnswer(false), 800);
    } else {
      setAligningField(null);
    }
    dispatch({ type: 'ALIGN_DATA_FIELD', fieldId, answer });
  }

  function handleCatalog() {
    if (!catalogForm.owner || !catalogForm.legalBasis || !catalogForm.frequency || !catalogForm.classification) return;
    dispatch({ type: 'CATALOG_DATA_FIELD', fieldId: catalogingField.id, metadata: { ...catalogForm } });
    setCatalogingField(null);
    setCatalogForm({ owner: '', legalBasis: '', frequency: '', classification: '' });
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: '#a78bfa', fontSize: 22 }}>Layer 2 — Data Layer</h2>
        <span style={{ color: '#64748b', fontSize: 14 }}>The Language of Data</span>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        Standardize 10 critical data fields used across government, then register them in the National Data Catalog.
        Fields become "authoritative" only when the Population Register Law is enacted.
      </p>

      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={progress} color="#a78bfa" label="Data Layer Progress" height={12} />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#64748b' }}>
          <span>🔓 Interoperability unlocks at 20%</span>
          <span>🔓 Application Services unlocks at 30%</span>
        </div>
      </div>

      {/* Law badges */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{
          padding: '6px 12px', borderRadius: 20, fontSize: 12,
          background: populationLaw?.bonusApplied ? '#14532d' : '#1e293b',
          border: `1px solid ${populationLaw?.bonusApplied ? '#4ade80' : '#334155'}`,
          color: populationLaw?.bonusApplied ? '#4ade80' : '#64748b',
        }}>
          {populationLaw?.bonusApplied ? '✓' : '○'} Population Register Law {populationLaw?.enacted && !populationLaw.bonusApplied ? '(pending 50%)' : ''}
        </div>
        <div style={{
          padding: '6px 12px', borderRadius: 20, fontSize: 12,
          background: publicInfoLaw?.bonusApplied ? '#14532d' : '#1e293b',
          border: `1px solid ${publicInfoLaw?.bonusApplied ? '#4ade80' : '#334155'}`,
          color: publicInfoLaw?.bonusApplied ? '#4ade80' : '#64748b',
        }}>
          {publicInfoLaw?.bonusApplied ? '✓' : '○'} Public Information Law
        </div>
      </div>

      {/* Phase toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderRadius: 8, overflow: 'hidden', border: '1px solid #334155' }}>
        {[['align', 'Phase A — Semantic Alignment'], ['catalog', 'Phase B — Catalog Registration']].map(([key, label]) => (
          <button key={key} onClick={() => setPhase(key)} style={{
            flex: 1, padding: '10px 16px', background: phase === key ? '#1e1b4b' : '#0f172a',
            border: 'none', color: phase === key ? '#a78bfa' : '#64748b',
            fontWeight: phase === key ? 700 : 400, cursor: 'pointer', fontSize: 13,
            borderRight: key === 'align' ? '1px solid #334155' : 'none',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Field cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {state.dataFields.map(field => {
          const catColor = CATEGORY_COLORS[field.category] || '#94a3b8';
          const status = field.authoritative ? 'authoritative' : field.cataloged ? 'cataloged' : field.aligned ? 'aligned' : 'raw';
          const statusColors = {
            authoritative: '#4ade80', cataloged: '#60a5fa',
            aligned: '#f59e0b', raw: '#475569',
          };
          const statusLabels = {
            authoritative: '✓ Authoritative', cataloged: '📁 Cataloged',
            aligned: '⚡ Aligned', raw: '⚠️ Raw',
          };

          if (phase === 'align') {
            return (
              <div key={field.id} style={{
                background: '#111827', border: `1px solid ${field.aligned ? catColor + '66' : '#1e293b'}`,
                borderRadius: 10, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, background: catColor + '22', color: catColor,
                    padding: '2px 8px', borderRadius: 12,
                  }}>{field.category}</span>
                  <span style={{ fontSize: 11, color: statusColors[status] }}>{statusLabels[status]}</span>
                </div>
                <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 8, fontSize: 14 }}>{field.label}</div>

                {!field.aligned ? (
                  <>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
                      Conflicting names in use:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                      {field.variants.map(v => (
                        <span key={v} style={{
                          fontSize: 11, background: '#1e293b', color: '#94a3b8',
                          padding: '2px 6px', borderRadius: 4, fontFamily: 'DM Mono, monospace',
                        }}>{v}</span>
                      ))}
                    </div>
                    <button onClick={() => setAligningField(field)} style={{
                      width: '100%', padding: '8px', background: '#1e1b4b',
                      border: '1px solid #4338ca', color: '#a78bfa',
                      borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    }}>
                      Align to Standard →
                    </button>
                  </>
                ) : (
                  <div style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: catColor, padding: '6px 10px', background: catColor + '11', borderRadius: 4 }}>
                    ✓ {field.standard}
                  </div>
                )}
              </div>
            );
          } else {
            // Catalog phase
            return (
              <div key={field.id} style={{
                background: '#111827',
                border: `1px solid ${field.cataloged ? '#60a5fa66' : '#1e293b'}`,
                borderRadius: 10, padding: '14px 16px',
                opacity: !field.aligned ? 0.5 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, background: catColor + '22', color: catColor,
                    padding: '2px 8px', borderRadius: 12,
                  }}>{field.category}</span>
                  <span style={{ fontSize: 11, color: statusColors[status] }}>{statusLabels[status]}</span>
                </div>
                <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 4, fontSize: 14 }}>{field.label}</div>
                <div style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#94a3b8', marginBottom: 10 }}>
                  {field.standard}
                </div>

                {!field.aligned ? (
                  <div style={{ fontSize: 12, color: '#475569' }}>⚠️ Align field first (Phase A)</div>
                ) : field.cataloged ? (
                  <div style={{ fontSize: 12, color: '#60a5fa' }}>
                    📁 Owner: {field.catalogMetadata?.owner}<br />
                    📋 {field.catalogMetadata?.legalBasis} · {field.catalogMetadata?.frequency}
                  </div>
                ) : (
                  <button onClick={() => setCatalogingField(field)} style={{
                    width: '100%', padding: '8px', background: '#0c2040',
                    border: '1px solid #1d4ed8', color: '#60a5fa',
                    borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}>
                    Register in Catalog →
                  </button>
                )}
              </div>
            );
          }
        })}
      </div>

      {/* Alignment modal */}
      {aligningField && (
        <Modal title={`Align: ${aligningField.label}`} onClose={() => setAligningField(null)}>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
            Select the correct EU/ISO standard name for this field:
          </p>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
            Conflicting variants: {aligningField.variants.join(', ')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {getShuffledOptions(aligningField).map(opt => (
              <button key={opt} onClick={() => handleAlign(aligningField.id, opt)} style={{
                padding: '12px 16px', background: wrongAnswer ? '#3b1818' : '#1e293b',
                border: `1px solid ${wrongAnswer ? '#ef4444' : '#334155'}`,
                color: '#f1f5f9', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'DM Mono, monospace', fontSize: 13,
                transition: 'all 0.2s',
              }}>
                {opt}
              </button>
            ))}
          </div>
          <p style={{ color: '#475569', fontSize: 12, marginTop: 16 }}>
            Wrong answer costs 1 budget (consultant fee). Think carefully.
          </p>
        </Modal>
      )}

      {/* Catalog modal */}
      {catalogingField && (
        <Modal title={`Register in Catalog: ${catalogingField.label}`} onClose={() => setCatalogingField(null)}>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
            Complete the metadata to register this field in the National Data Catalog.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { key: 'owner', label: 'Owner Agency', options: CATALOG_OWNERS },
              { key: 'legalBasis', label: 'Legal Basis', options: LEGAL_BASES },
              { key: 'frequency', label: 'Update Frequency', options: UPDATE_FREQUENCIES },
              { key: 'classification', label: 'Classification Level', options: ['public', 'internal', 'confidential', 'secret'] },
            ].map(({ key, label, options }) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>{label}</label>
                <select
                  value={catalogForm[key]}
                  onChange={e => setCatalogForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '8px 12px',
                    background: '#1e293b', border: '1px solid #334155',
                    color: '#f1f5f9', borderRadius: 6, fontSize: 13,
                  }}
                >
                  <option value="">Select...</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={handleCatalog}
            disabled={!catalogForm.owner || !catalogForm.legalBasis || !catalogForm.frequency || !catalogForm.classification}
            style={{
              marginTop: 20, width: '100%', padding: '12px',
              background: '#1d4ed8', border: 'none', color: '#fff',
              borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700,
              opacity: (!catalogForm.owner || !catalogForm.legalBasis || !catalogForm.frequency || !catalogForm.classification) ? 0.5 : 1,
            }}
          >
            Register in National Data Catalog
          </button>
        </Modal>
      )}
    </div>
  );
}
