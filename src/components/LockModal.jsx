import Modal from './shared/Modal';
import { C } from '../colors';

const CHAPTER_CONTEXT = {
  3: {
    icon: '🗄️', name: 'Data Layer',
    why: 'The National Data Catalog can only register data from systems that are already digital. Without cloud-hosted agencies there are no authoritative data sources to standardize.',
  },
  4: {
    icon: '🔗', name: 'ADEL Network',
    why: 'The data exchange network requires two things: agencies must have cloud infrastructure to host Security Servers, and the Data Catalog must define what data flows — otherwise connections have no legal or semantic basis.',
  },
  5: {
    icon: '⚙️', name: 'Application Services',
    why: 'Shared platforms rely on the ADEL backbone to authenticate users and retrieve pre-filled data. The network must be partially operational and the catalog populated before tools can function.',
  },
  6: {
    icon: '📡', name: 'Service Channels',
    why: 'Assigning channels before digital tools are deployed results in empty declarations. The shared platforms must be live and agencies actively using them before channel routing matters.',
  },
  7: {
    icon: '🌟', name: 'Life Events',
    why: 'End-to-end life event automation depends on all prior layers: ADEL must carry automatic triggers across agencies, channels must route each sub-service correctly, and citizen-facing tools must be operational.',
  },
};

const TYPE_LABEL = {
  connection: 'ADEL Network',
  dataField: 'Data Catalog',
  tool: 'App Services',
  channel: 'Channels',
};

export default function LockModal({ chapterId, prerequisites, onClose, onNavigate }) {
  const ctx = CHAPTER_CONTEXT[chapterId];
  if (!ctx || !prerequisites) return null;

  const unmet = prerequisites.items.filter(i => !i.met);
  const urgentChapter = unmet[0]?.targetChapter;

  return (
    <Modal title={`Layer ${chapterId} — ${ctx.icon} ${ctx.name} is locked`} onClose={onClose} width={560}>

      {/* Why locked */}
      <div style={{
        padding: '12px 14px', marginBottom: 20,
        background: `${C.ORANGE}12`,
        border: `1px solid ${C.ORANGE}44`,
        borderLeft: `4px solid ${C.ORANGE}`,
        borderRadius: 8, fontSize: 13, color: C.MUTED, lineHeight: 1.7,
      }}>
        <strong style={{ color: C.TEXT }}>Why is this locked? </strong>{ctx.why}
      </div>

      {/* Checklist */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: C.FAINT,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 10,
      }}>
        Prerequisites — {prerequisites.items.filter(i => i.met).length} of {prerequisites.items.length} met
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {prerequisites.items.map(item => (
          <div key={item.id} style={{
            borderRadius: 8, overflow: 'hidden',
            border: `1px solid ${item.met ? C.BLUE + '44' : C.ERROR + '33'}`,
          }}>
            {/* Item header row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              background: item.met ? `${C.BLUE}08` : C.ERROR_BG,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>
                {item.met ? '✅' : '❌'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: item.met ? C.BLUE : C.ERROR, fontSize: 13 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 11, color: C.MUTED, marginTop: 1 }}>
                  {item.detail}
                  {item.count && (
                    <span style={{
                      marginLeft: 8, fontFamily: "'DM Mono', monospace",
                      fontWeight: 700, color: item.met ? C.BLUE : C.ERROR,
                    }}>
                      {item.count}
                    </span>
                  )}
                </div>
              </div>
              {!item.met && (
                <button
                  onClick={() => { onNavigate(item.targetChapter); onClose(); }}
                  style={{
                    flexShrink: 0, padding: '5px 12px',
                    background: C.BLUE, border: 'none',
                    color: '#fff', borderRadius: 6,
                    cursor: 'pointer', fontSize: 11, fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  → Layer {item.targetChapter}
                </button>
              )}
            </div>

            {/* Specific named items to fix */}
            {!item.met && item.fixes?.length > 0 && (
              <div style={{ padding: '8px 14px', background: C.RAISED }}>
                {item.fixesLabel && (
                  <div style={{ fontSize: 10, color: C.FAINT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {item.fixesLabel}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {item.fixes.map((fix, i) => (
                    <span key={i} style={{
                      padding: '3px 9px',
                      background: C.CARD,
                      border: `1px solid ${C.BORDER}`,
                      borderRadius: 4, fontSize: 11, color: C.MUTED,
                    }}>
                      {fix}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '9px 18px',
            background: 'none', border: `1px solid ${C.BORDER}`,
            color: C.MUTED, borderRadius: 7, cursor: 'pointer', fontSize: 13,
          }}
        >
          Close
        </button>
        {urgentChapter && (
          <button
            onClick={() => { onNavigate(urgentChapter); onClose(); }}
            style={{
              padding: '9px 20px',
              background: C.BLUE, border: 'none',
              color: '#fff', borderRadius: 7,
              cursor: 'pointer', fontSize: 13, fontWeight: 700,
            }}
          >
            → Go to Layer {urgentChapter}
          </button>
        )}
      </div>
    </Modal>
  );
}
