import { useState } from 'react';
import { C } from '../colors';

const LAYERS = [
  { n: 1, icon: '🏗️', name: 'Infrastructure',    desc: 'Migrate agencies to cloud' },
  { n: 2, icon: '🗄️', name: 'Data Layer',        desc: 'Standardize & catalog data' },
  { n: 3, icon: '🔗', name: 'ADEL Network',      desc: 'Connect agencies via data exchange hub' },
  { n: 4, icon: '⚙️', name: 'App Services',      desc: 'Deploy shared digital tools' },
  { n: 5, icon: '📡', name: 'Channels',           desc: 'Route services to best delivery channel' },
  { n: 6, icon: '🌟', name: 'Life Events',        desc: 'Transform citizen journeys end-to-end' },
  { n: 7, icon: '⚖️', name: 'Legal',              desc: 'Enact laws to govern the transformation' },
];

export default function IntroScreen({ onStart }) {
  const [slide, setSlide] = useState(0); // 0=title, 1=mission, 2=layers, 3=rules

  const nextSlide = () => setSlide(s => Math.min(s + 1, 3));
  const prevSlide = () => setSlide(s => Math.max(s - 1, 0));

  return (
    <div style={{
      minHeight: '100vh', background: C.BG, color: C.TEXT,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.08,
        backgroundImage: `
          linear-gradient(${C.BLUE} 1px, transparent 1px),
          linear-gradient(90deg, ${C.BLUE} 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <div style={{ maxWidth: 680, width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Slide 0 — Title */}
        {slide === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🇦🇲</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(42px, 10vw, 72px)',
              fontWeight: 900, letterSpacing: '0.06em',
              color: C.ORANGE, lineHeight: 1,
              marginBottom: 6,
            }}>
              ADEL
            </div>
            <div style={{
              fontSize: 'clamp(13px, 3vw, 18px)',
              color: C.MUTED, letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              Architect of Digital Armenia
            </div>

            <div style={{
              padding: '16px 20px', background: C.CARD,
              border: `1px solid ${C.BORDER}`, borderRadius: 10,
              marginBottom: 32, lineHeight: 1.8, fontSize: 14, color: C.MUTED,
              textAlign: 'left',
            }}>
              <strong style={{ color: C.TEXT }}>Year 2024.</strong> You are Armenia's new
              Chief Digital Officer. The government runs on paper forms, siloed databases,
              and outdated server rooms. Citizens queue for hours to submit documents
              that 3 agencies already have.{' '}
              <strong style={{ color: C.ORANGE }}>
                Your mission: architect a fully digital government in 7 layers.
              </strong>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                ['30', 'agencies'],
                ['7', 'layers'],
                ['340', 'duplicates to eliminate'],
                ['100', 'budget tokens'],
              ].map(([val, lbl]) => (
                <div key={lbl} style={{
                  padding: '10px 16px', background: C.CARD,
                  border: `1px solid ${C.BORDER}`, borderRadius: 8, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.ORANGE, fontFamily: "'DM Mono', monospace" }}>
                    {val}
                  </div>
                  <div style={{ fontSize: 10, color: C.MUTED }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 1 — Mission */}
        {slide === 1 && (
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 24, color: C.ORANGE }}>
              🎯 Your Mission
            </h2>
            <p style={{ color: C.MUTED, marginBottom: 20, lineHeight: 1.7, fontSize: 14 }}>
              Armenia's digital transformation follows the{' '}
              <strong style={{ color: C.TEXT }}>ADEL Framework</strong> — a real-world
              architecture used by Estonia, Georgia, and Armenia itself.
              You will build each layer from the ground up.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: '✅', title: 'Unlock layers',       desc: 'Complete each layer to unlock the next. Layers are interdependent — the network needs the cloud, the apps need the network.' },
                { icon: '💰', title: 'Manage your budget',  desc: 'Every action costs budget tokens. Migrations: 2–3. Certificates: 1. Tools: 3. Wrong answers penalize you. Manage wisely.' },
                { icon: '🔒', title: 'Handle sensitive data', desc: 'Security agencies (Defense, Police, NSS) contain secret-classified data. Put them in the Hybrid Secure Zone or lose Trust.' },
                { icon: '🚀', title: 'Win the game',        desc: 'Reach 80% on Infrastructure, Data, and Interoperability. Optimize 75% of life events. Enact 3+ laws.' },
              ].map(item => (
                <div key={item.title} style={{
                  display: 'flex', gap: 12, padding: '12px 14px',
                  background: C.CARD, border: `1px solid ${C.BORDER}`, borderRadius: 8,
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.TEXT, fontSize: 13, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: C.MUTED, lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 2 — 7 Layers */}
        {slide === 2 && (
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 24, color: C.ORANGE }}>
              🏛️ The 7 Layers
            </h2>
            <p style={{ color: C.MUTED, marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
              Build from the ground up — each layer depends on the ones below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {LAYERS.map((l, i) => (
                <div key={l.n} style={{
                  display: 'flex', gap: 12, alignItems: 'center',
                  padding: '10px 14px',
                  background: C.CARD, border: `1px solid ${C.BORDER}`, borderRadius: 8,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: C.RAISED, border: `2px solid ${C.BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {l.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ color: C.MUTED, fontSize: 10, marginRight: 6 }}>Layer {l.n}</span>
                    <strong style={{ color: C.TEXT, fontSize: 13 }}>{l.name}</strong>
                    <div style={{ fontSize: 11, color: C.MUTED, marginTop: 1 }}>{l.desc}</div>
                  </div>
                  {i < LAYERS.length - 1 && (
                    <div style={{ fontSize: 10, color: C.FAINT, flexShrink: 0 }}>↓ unlocks</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 3 — ADEL concept */}
        {slide === 3 && (
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 24, color: C.ORANGE }}>
              🔗 What is ADEL?
            </h2>
            <p style={{ color: C.MUTED, marginBottom: 20, fontSize: 14, lineHeight: 1.7 }}>
              <strong style={{ color: C.TEXT }}>ADEL (Armenian Data Exchange Layer)</strong> is
              Armenia's national data exchange hub — similar to Estonia's X-Road or
              Georgia's Data Exchange Agency.
              It lets government agencies securely share data without duplicating it.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {[
                {
                  icon: '🔄', title: 'Once-only principle',
                  body: 'Citizens submit data once. All agencies retrieve it from the authoritative source via ADEL instead of asking again.'
                },
                {
                  icon: '🛡️', title: 'Security by design',
                  body: 'Every connection uses mTLS certificates and legal agreements. No data sharing without proper governance.'
                },
                {
                  icon: '📊', title: 'Data sovereignty',
                  body: 'The National Data Catalog tracks who owns each dataset and what legal basis governs its use. Transparency, not just efficiency.'
                },
                {
                  icon: '🌟', title: 'Life event approach',
                  body: 'Instead of 11 trips to 4 offices to register a baby, ADEL triggers all updates automatically from a single hospital event.'
                },
              ].map(item => (
                <div key={item.title} style={{
                  display: 'flex', gap: 12,
                  padding: '12px 14px', background: C.CARD,
                  border: `1px solid ${C.BORDER}`, borderRadius: 8,
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: C.TEXT, fontSize: 13, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: C.MUTED, lineHeight: 1.5 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Start button */}
            <button
              onClick={onStart}
              style={{
                width: '100%', padding: '16px',
                background: C.ORANGE, border: 'none', color: '#000',
                borderRadius: 10, cursor: 'pointer',
                fontSize: 16, fontWeight: 900, letterSpacing: '0.04em',
                boxShadow: `0 4px 24px ${C.ORANGE}55`,
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 8px 32px ${C.ORANGE}77`; }}
              onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = `0 4px 24px ${C.ORANGE}55`; }}
            >
              🚀 Begin Digital Transformation
            </button>
          </div>
        )}

        {/* Navigation dots + buttons */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 28,
        }}>
          <button
            onClick={prevSlide}
            disabled={slide === 0}
            style={{
              padding: '8px 18px', borderRadius: 7,
              background: 'none', border: `1px solid ${C.BORDER}`,
              color: slide === 0 ? C.FAINT : C.MUTED,
              cursor: slide === 0 ? 'default' : 'pointer', fontSize: 13,
            }}
          >
            ← Back
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                onClick={() => setSlide(i)}
                style={{
                  width: i === slide ? 22 : 8,
                  height: 8, borderRadius: 4,
                  background: i === slide ? C.ORANGE : C.BORDER,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          {slide < 3 ? (
            <button
              onClick={nextSlide}
              style={{
                padding: '8px 18px', borderRadius: 7,
                background: C.BLUE_DIM, border: `1px solid ${C.BLUE}`,
                color: C.TEXT, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}
            >
              Next →
            </button>
          ) : (
            <div style={{ width: 80 }} />
          )}
        </div>
      </div>
    </div>
  );
}
