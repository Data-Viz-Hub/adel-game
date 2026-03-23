import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import Modal from '../shared/Modal';
import { calcDataProgress } from '../../gameReducer';
import { C } from '../../colors';

const CATALOG_OWNERS = [
  'Ministry of Justice', 'State Revenue Committee', 'Social Insurance Fund',
  'Ministry of Health', 'Ministry of Finance', 'E-Gov Infrastructure Center',
];
const LEGAL_BASES = ['Legal Obligation', 'Public Interest', 'Vital Interests', 'Consent', 'Contract'];
const UPDATE_FREQUENCIES = ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Annually'];

export default function Chapter2_DataLayer({ state, dispatch, locked }) {
  const [phase, setPhase] = useState('align');
  const [aligningField, setAligningField] = useState(null);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [catalogingField, setCatalogingField] = useState(null);
  const [catalogForm, setCatalogForm] = useState({ owner: '', legalBasis: '', frequency: '', classification: '' });
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const progress = calcDataProgress(state);
  const popLaw = state.laws.find(l => l.id === 'law01');
  const pubLaw = state.laws.find(l => l.id === 'law04');

  function openAlign(field) {
    const opts = [field.standard, ...field.distractors].sort(() => Math.random() - 0.5);
    setShuffledOpts(opts);
    setAligningField(field);
  }

  function handleAlign(fieldId, answer) {
    const field = state.dataFields.find(f => f.id === fieldId);
    if (answer !== field.standard) {
      setWrongAnswer(true);
      setTimeout(() => setWrongAnswer(false), 700);
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

  const selStyle = (condition) => ({
    padding: '5px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
    background: condition ? C.BLUE_DIM : C.CARD,
    border: `1px solid ${condition ? C.BLUE : C.BORDER}`,
    color: condition ? C.TEXT : C.MUTED,
  });

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 2 — Data Layer</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Align 10 data fields to EU/ISO standards, then register them in the National Data Catalog.
        Wrong alignment answers cost 1 budget.
      </p>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={progress} label="Data Layer Progress" height={10} />
        <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: C.MUTED, flexWrap: 'wrap' }}>
          <span>🔓 ADEL Network unlocks at 20%</span>
          <span>🔓 App Services unlocks at 30%</span>
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
          const status = field.authoritative ? 'authoritative'
            : field.cataloged ? 'cataloged'
            : field.aligned ? 'aligned' : 'raw';
          const statusColor = {
            authoritative: C.BLUE, cataloged: C.BLUE,
            aligned: C.ORANGE, raw: C.FAINT,
          }[status];
          const statusLabel = {
            authoritative: '✓ Authoritative', cataloged: '📁 Cataloged',
            aligned: '⚡ Aligned', raw: '⚠ Raw',
          }[status];

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
              <div style={{ fontWeight: 700, color: C.TEXT, marginBottom: 6, fontSize: 13 }}>{field.label}</div>

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
                    <button onClick={() => !locked && openAlign(field)} disabled={locked} style={{
                      width: '100%', padding: '8px',
                      background: locked ? C.RAISED : C.BLUE_DIM,
                      border: `1px solid ${locked ? C.BORDER : C.BLUE}`,
                      color: locked ? C.FAINT : C.TEXT, borderRadius: 6,
                      cursor: locked ? 'not-allowed' : 'pointer',
                      fontSize: 12, fontWeight: 600,
                    }}>
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
                    📁 {field.catalogMetadata?.owner}<br />
                    {field.catalogMetadata?.legalBasis} · {field.catalogMetadata?.frequency}
                  </div>
                ) : (
                  <button onClick={() => !locked && setCatalogingField(field)} disabled={locked} style={{
                    width: '100%', padding: '8px',
                    background: locked ? C.RAISED : C.RAISED,
                    border: `1px solid ${locked ? C.BORDER : C.ORANGE}`,
                    color: locked ? C.FAINT : C.ORANGE, borderRadius: 6,
                    cursor: locked ? 'not-allowed' : 'pointer',
                    fontSize: 12, fontWeight: 600,
                  }}>
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
        <Modal title={`Align: ${aligningField.label}`} onClose={() => setAligningField(null)}>
          <p style={{ color: C.MUTED, fontSize: 13, marginBottom: 8 }}>
            Pick the correct EU/ISO standard name:
          </p>
          <div style={{ fontSize: 11, color: C.FAINT, marginBottom: 14 }}>
            Current variants: {aligningField.variants.join(', ')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shuffledOpts.map(opt => (
              <button key={opt} onClick={() => handleAlign(aligningField.id, opt)} style={{
                padding: '11px 14px',
                background: wrongAnswer ? '#2D0A0A' : C.RAISED,
                border: `1px solid ${wrongAnswer ? '#E53E3E' : C.BORDER}`,
                color: C.TEXT, borderRadius: 7, cursor: 'pointer', textAlign: 'left',
                fontFamily: "'DM Mono', monospace", fontSize: 12,
                transition: 'background 0.15s',
              }}>
                {opt}
              </button>
            ))}
          </div>
          <p style={{ color: C.FAINT, fontSize: 11, marginTop: 14 }}>Wrong answer costs 1 💰</p>
        </Modal>
      )}

      {/* Catalog modal */}
      {catalogingField && (
        <Modal title={`Register: ${catalogingField.label}`} onClose={() => setCatalogingField(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'owner',          label: 'Owner Agency',         options: CATALOG_OWNERS },
              { key: 'legalBasis',     label: 'Legal Basis',          options: LEGAL_BASES },
              { key: 'frequency',      label: 'Update Frequency',     options: UPDATE_FREQUENCIES },
              { key: 'classification', label: 'Classification Level', options: ['public','internal','confidential','secret'] },
            ].map(({ key, label, options }) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: C.MUTED, display: 'block', marginBottom: 5 }}>{label}</label>
                <select value={catalogForm[key]}
                  onChange={e => setCatalogForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '8px 10px',
                    background: C.RAISED, border: `1px solid ${C.BORDER}`,
                    color: C.TEXT, borderRadius: 6, fontSize: 13,
                  }}>
                  <option value="">Select…</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={handleCatalog}
            disabled={!catalogForm.owner || !catalogForm.legalBasis || !catalogForm.frequency || !catalogForm.classification}
            style={{
              marginTop: 18, width: '100%', padding: '12px',
              background: C.ORANGE, border: 'none', color: '#000',
              borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700,
              opacity: (!catalogForm.owner || !catalogForm.legalBasis || !catalogForm.frequency || !catalogForm.classification) ? 0.4 : 1,
            }}
          >
            Register in National Data Catalog
          </button>
        </Modal>
      )}
    </div>
  );
}
