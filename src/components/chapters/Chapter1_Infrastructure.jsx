import { useState } from 'react';
import ProgressBar from '../shared/ProgressBar';
import { INFRASTRUCTURE_ZONES } from '../../gameData';
import { calcInfraProgress } from '../../gameReducer';

const ZONE_COLORS = {
  cloud_a: '#4ade80',
  cloud_b: '#60a5fa',
  hybrid: '#f59e0b',
  legacy: '#94a3b8',
};

const CLASSIFICATION_COLORS = {
  public: '#4ade80',
  internal: '#60a5fa',
  confidential: '#f59e0b',
  secret: '#ef4444',
};

export default function Chapter1_Infrastructure({ state, dispatch }) {
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [filter, setFilter] = useState('all');

  const progress = calcInfraProgress(state);

  const zoneCounts = { cloud_a: 0, cloud_b: 0, hybrid: 0, legacy: 0 };
  state.agencies.forEach(a => { if (a.zone) zoneCounts[a.zone]++; });

  const unassigned = state.agencies.filter(a => !a.zone);
  const filtered = filter === 'all'
    ? state.agencies
    : filter === 'unassigned'
    ? unassigned
    : state.agencies.filter(a => a.zone === filter);

  function handleZoneClick(zoneId) {
    if (!selectedAgency) return;
    dispatch({ type: 'ASSIGN_AGENCY_TO_ZONE', agencyId: selectedAgency, zoneId });
    setSelectedAgency(null);
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <h2 style={{ margin: 0, color: '#4ade80', fontSize: 22 }}>Layer 1 — Infrastructure</h2>
        <span style={{ color: '#64748b', fontSize: 14 }}>The Foundations</span>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
        Migrate 42 government agencies to cloud infrastructure. Sensitive agencies (🔒) require the Hybrid Secure Zone.
        Legacy zone carries a 0.5× score penalty. Budget: Cloud = 2, Hybrid = 3, Legacy = free.
      </p>

      <div style={{ marginBottom: 24 }}>
        <ProgressBar value={progress} color="#4ade80" label={`Infrastructure Progress`} height={12} />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#64748b' }}>
          <span>🔓 Data Layer unlocks at 30%</span>
          <span>🔓 Interoperability unlocks at 50%</span>
        </div>
      </div>

      {/* Zone targets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {INFRASTRUCTURE_ZONES.map(zone => {
          const count = zoneCounts[zone.id] || 0;
          const pct = Math.round(count / zone.capacity * 100);
          const color = ZONE_COLORS[zone.id];
          const isTarget = selectedAgency !== null;
          return (
            <div
              key={zone.id}
              onClick={() => isTarget && handleZoneClick(zone.id)}
              style={{
                background: isTarget ? '#1e293b' : '#0f1929',
                border: `2px solid ${isTarget ? color : '#1e293b'}`,
                borderRadius: 10,
                padding: '14px 16px',
                cursor: isTarget ? 'pointer' : 'default',
                transition: 'all 0.2s',
                transform: isTarget ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isTarget ? `0 0 16px ${color}44` : 'none',
              }}
            >
              <div style={{ fontWeight: 700, color, marginBottom: 4, fontSize: 13 }}>
                {zone.type === 'cloud' ? '☁️' : zone.type === 'hybrid' ? '🔐' : '🖥️'} {zone.name}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{zone.description}</div>
              <ProgressBar value={pct} color={color} height={6} />
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                {count}/{zone.capacity} agencies
              </div>
            </div>
          );
        })}
      </div>

      {selectedAgency && (
        <div style={{
          background: '#1e3a2f', border: '1px solid #4ade80', borderRadius: 8,
          padding: '10px 16px', marginBottom: 16, color: '#4ade80', fontSize: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>📍 Selected: <strong>{state.agencies.find(a => a.id === selectedAgency)?.name}</strong> — click a zone above to assign</span>
          <button onClick={() => setSelectedAgency(null)} style={{
            background: 'none', border: '1px solid #4ade8066', color: '#4ade80',
            padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12,
          }}>Cancel</button>
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {['all', 'unassigned', 'cloud_a', 'cloud_b', 'hybrid', 'legacy'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 12,
            background: filter === f ? '#1e40af' : '#1e293b',
            border: `1px solid ${filter === f ? '#3b82f6' : '#334155'}`,
            color: '#f1f5f9', cursor: 'pointer',
          }}>
            {f === 'all' ? `All (${state.agencies.length})` :
             f === 'unassigned' ? `Unassigned (${unassigned.length})` :
             `${f.replace('_', ' ')} (${zoneCounts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Agency grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 10,
      }}>
        {filtered.map(agency => {
          const zoneColor = agency.zone ? ZONE_COLORS[agency.zone] : '#334155';
          const classColor = CLASSIFICATION_COLORS[agency.dataClassification];
          const isSelected = selectedAgency === agency.id;
          return (
            <div
              key={agency.id}
              onClick={() => setSelectedAgency(isSelected ? null : agency.id)}
              style={{
                background: isSelected ? '#1e2d4a' : '#111827',
                border: `1px solid ${isSelected ? '#60a5fa' : zoneColor + '66'}`,
                borderRadius: 8,
                padding: '10px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: isSelected ? '0 0 12px #60a5fa44' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600, lineHeight: 1.3 }}>
                  {agency.name}
                </span>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 6 }}>
                  {agency.sensitive && <span title="Sensitive agency — Hybrid only">🔒</span>}
                  {agency.overheating && <span title="Overheating — migration urgent">🔥</span>}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
                <span style={{
                  background: classColor + '22', color: classColor,
                  padding: '1px 6px', borderRadius: 4,
                }}>
                  {agency.dataClassification}
                </span>
                {agency.zone ? (
                  <span style={{ color: zoneColor, fontSize: 11 }}>
                    {agency.zone.replace('_', ' ')}
                  </span>
                ) : (
                  <span style={{ color: '#475569', fontSize: 11 }}>unmigrated</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, padding: '12px 16px', background: '#0f1929', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
        💡 <strong style={{ color: '#94a3b8' }}>Instructions:</strong> Click an agency card to select it, then click a zone above to migrate it.
        Sensitive agencies (🔒) should go to Hybrid Secure Zone. Overheating agencies (🔥) need urgent migration.
      </div>
    </div>
  );
}
