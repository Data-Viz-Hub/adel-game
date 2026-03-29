import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import { INFRASTRUCTURE_ZONES } from '../../gameData';
import { calcInfraProgress } from '../../gameReducer';
import { C } from '../../colors';

const ZONE_ICONS = { cloud_a: '☁️', cloud_b: '☁️', hybrid: '🔐', legacy: '🖥️' };

const CLASS_COLORS = {
  public: C.BLUE,
  internal: C.BLUE,
  confidential: C.ORANGE,
  secret: C.ERROR,
};

export default function Chapter1_Infrastructure({ state, dispatch }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('unassigned');

  const progress = calcInfraProgress(state);

  const zoneCounts = { cloud_a: 0, cloud_b: 0, hybrid: 0, legacy: 0 };
  state.agencies.forEach(a => { if (a.zone) zoneCounts[a.zone]++; });

  const unassigned = state.agencies.filter(a => !a.zone);

  const filtered = filter === 'all' ? state.agencies
    : filter === 'unassigned' ? unassigned
    : state.agencies.filter(a => a.zone === filter);

  function handleZoneClick(zoneId) {
    if (!selected) return;
    dispatch({ type: 'ASSIGN_AGENCY_TO_ZONE', agencyId: selected, zoneId });
    setSelected(null);
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ margin: '0 0 4px', color: C.ORANGE, fontSize: 20 }}>Layer 2 — Infrastructure</h2>
      <p style={{ color: C.MUTED, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
        Migrate 11 core base registries to cloud zones. Sensitive agencies (🔒) require Hybrid. Budget: Cloud=2, Hybrid=3, Legacy=free.
      </p>

      <div style={{ marginBottom: 20 }}>
        <ProgressBar value={progress} label="Infrastructure Progress" height={10} />
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: C.MUTED, flexWrap: 'wrap' }}>
          <span>🔓 Layer 3 (Data) unlocks at 30%</span>
          <span>🔓 Layer 4 (ADEL) unlocks at 50%</span>
        </div>
      </div>

      {/* Zone cards */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {INFRASTRUCTURE_ZONES.map(zone => {
          const count = zoneCounts[zone.id] || 0;
          const pct = Math.round(count / zone.capacity * 100);
          const isTarget = selected !== null;
          return (
            <div
              key={zone.id}
              onClick={() => isTarget && handleZoneClick(zone.id)}
              style={{
                background: C.CARD,
                border: `2px solid ${isTarget ? C.ORANGE : C.BORDER}`,
                borderRadius: 8, padding: '12px',
                cursor: isTarget ? 'pointer' : 'default',
                transition: 'border-color 0.15s',
                boxShadow: isTarget ? `0 0 12px ${C.ORANGE}33` : 'none',
              }}
            >
              <div style={{ fontWeight: 700, color: isTarget ? C.ORANGE : C.TEXT, marginBottom: 4, fontSize: 13 }}>
                {ZONE_ICONS[zone.id]} {zone.name}
              </div>
              <ProgressBar value={pct} height={5} />
              <div style={{ fontSize: 11, color: C.MUTED, marginTop: 4 }}>
                {count}/{zone.capacity} agencies
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected banner */}
      {selected && (
        <div style={{
          background: `${C.BLUE_DIM}44`,
          border: `1px solid ${C.BLUE}`,
          borderRadius: 8, padding: '10px 14px', marginBottom: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: 13, color: C.BLUE }}>
            Selected: <strong style={{ color: C.TEXT }}>{state.agencies.find(a => a.id === selected)?.name}</strong> — tap a zone above
          </span>
          <button onClick={() => setSelected(null)} style={{
            background: 'none', border: `1px solid ${C.BORDER}`,
            color: C.MUTED, padding: '3px 10px', borderRadius: 4,
            cursor: 'pointer', fontSize: 12,
          }}>Cancel</button>
        </div>
      )}

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {[
          ['unassigned', `Unassigned (${unassigned.length})`],
          ['all', `All (${state.agencies.length})`],
          ['cloud_a', `Cloud A (${zoneCounts.cloud_a})`],
          ['cloud_b', `Cloud B (${zoneCounts.cloud_b})`],
          ['hybrid', `Hybrid (${zoneCounts.hybrid})`],
          ['legacy', `Legacy (${zoneCounts.legacy})`],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: '5px 10px', borderRadius: 20, fontSize: 11,
            background: filter === key ? C.BLUE_DIM : C.CARD,
            border: `1px solid ${filter === key ? C.BLUE : C.BORDER}`,
            color: filter === key ? C.TEXT : C.MUTED,
            cursor: 'pointer',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Agency grid */}
      <div className="grid-auto">
        {filtered.map(agency => {
          const isSelected = selected === agency.id;
          const classColor = CLASS_COLORS[agency.dataClassification] || C.MUTED;
          return (
            <div
              key={agency.id}
              onClick={() => setSelected(isSelected ? null : agency.id)}
              style={{
                background: isSelected ? C.RAISED : C.CARD,
                border: `1px solid ${isSelected ? C.ORANGE : agency.zone ? C.BLUE + '55' : C.BORDER}`,
                borderRadius: 8, padding: '10px 12px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 12, color: C.TEXT, fontWeight: 600, lineHeight: 1.3, flex: 1 }}>
                  {agency.name}
                </span>
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {agency.sensitive && <span title="Sensitive — Hybrid only">🔒</span>}
                  {agency.overheating && <span title="Overheating">🔥</span>}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10 }}>
                <span style={{
                  background: classColor + '22', color: classColor,
                  padding: '1px 6px', borderRadius: 4,
                }}>
                  {agency.dataClassification}
                </span>
                <span style={{ color: agency.zone ? C.BLUE : C.FAINT }}>
                  {agency.zone ? agency.zone.replace('_', ' ') : 'unmigrated'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, padding: '10px 14px', background: C.CARD, borderRadius: 8, fontSize: 12, color: C.MUTED }}>
        💡 Tap an agency to select it, then tap a zone to migrate it. Sensitive agencies (🔒) must go to Hybrid Secure Zone.
      </div>
    </div>
  );
}
