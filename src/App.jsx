import { useReducer, useState, useEffect, useCallback } from 'react';
import { gameReducer, createInitialState, getLayerProgress, isChapterUnlocked, getLockReason } from './gameReducer';
import { C } from './colors';
import IntroScreen from './components/IntroScreen';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import NotificationBar from './components/NotificationBar';
import VictoryScreen from './components/VictoryScreen';
import GameOverScreen from './components/GameOverScreen';
import Chapter1_Infrastructure from './components/chapters/Chapter1_Infrastructure';
import Chapter2_DataLayer from './components/chapters/Chapter2_DataLayer';
import Chapter3_Interoperability from './components/chapters/Chapter3_Interoperability';
import Chapter4_AppServices from './components/chapters/Chapter4_AppServices';
import Chapter5_Channels from './components/chapters/Chapter5_Channels';
import Chapter6_LifeEvents from './components/chapters/Chapter6_LifeEvents';
import Chapter7_Legal from './components/chapters/Chapter7_Legal';

const CHAPTER_INFO = [
  null,
  { name: 'Infrastructure',       icon: '🏗️', desc: 'Migrate 30 government agencies to cloud infrastructure' },
  { name: 'Data Layer',           icon: '🗄️', desc: 'Standardize data fields and register in the National Data Catalog' },
  { name: 'ADEL Network',         icon: '🔗', desc: 'Connect agencies via the ADEL data exchange hub' },
  { name: 'Application Services', icon: '⚙️', desc: 'Deploy and adopt shared digital service tools' },
  { name: 'Channels',             icon: '📡', desc: 'Assign optimal delivery channels for 16 government services' },
  { name: 'Life Events',          icon: '🌟', desc: 'Optimize 8 critical citizen life events end-to-end' },
  { name: 'Legal & Governance',   icon: '⚖️', desc: 'Enact foundational laws to govern digital transformation' },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryShown, setVictoryShown] = useState(false);

  // Show intro until player clicks Start
  if (!started) return <IntroScreen onStart={() => setStarted(true)} />;

  // 1 real second = 1 game day tick
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (state.gameLost || state.victoryUnlocked) return;
    const id = setInterval(() => dispatch({ type: 'TICK_TIME' }), 1000);
    return () => clearInterval(id);
  }, [state.gameLost, state.victoryUnlocked]);

  // Trigger victory screen once
  if (state.victoryUnlocked && !victoryShown && !showVictory) {
    setShowVictory(true);
    setVictoryShown(true);
  }

  // Game over — show screen
  if (state.gameLost) {
    return (
      <GameOverScreen
        state={state}
        onRestart={() => window.location.reload()}
      />
    );
  }

  const progress = getLayerProgress(state);
  const locked = !isChapterUnlocked(state.activeChapter, progress);
  const lockReasons = getLockReason(state.activeChapter, progress);
  const info = CHAPTER_INFO[state.activeChapter];
  const keys = ['infrastructure','dataLayer','interoperability','appServices','channels','lifeEvents','legal'];

  function renderChapter() {
    if (locked) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 16px' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🔒</div>
          <h3 style={{ fontSize: 18, color: C.TEXT, marginBottom: 8 }}>Chapter Locked</h3>
          <p style={{ fontSize: 13, color: C.MUTED, maxWidth: 360, margin: '0 auto 16px', lineHeight: 1.6 }}>
            Complete the following to unlock:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {lockReasons.map((r, i) => (
              <div key={i} style={{
                padding: '7px 14px',
                background: C.CARD, border: `1px solid ${C.BORDER}`,
                borderRadius: 20, fontSize: 13, color: C.MUTED,
              }}>
                • {r}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const props = { state, dispatch };
    switch (state.activeChapter) {
      case 1: return <Chapter1_Infrastructure {...props} />;
      case 2: return <Chapter2_DataLayer {...props} />;
      case 3: return <Chapter3_Interoperability {...props} />;
      case 4: return <Chapter4_AppServices {...props} />;
      case 5: return <Chapter5_Channels {...props} />;
      case 6: return <Chapter6_LifeEvents {...props} />;
      case 7: return <Chapter7_Legal {...props} />;
      default: return null;
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.BG, color: C.TEXT }}>
      <TopBar state={state} />
      <Navigation state={state} dispatch={dispatch} />

      {/* Chapter header */}
      <div style={{
        background: C.CARD,
        borderBottom: `1px solid ${C.BORDER}`,
        padding: '10px 16px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: C.BLUE_DIM,
            border: `2px solid ${C.BLUE}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>
            {info?.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ORANGE }}>
              Layer {state.activeChapter} — {info?.name}
            </div>
            <div style={{ fontSize: 11, color: C.MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {info?.desc}
            </div>
          </div>

          {/* Compact progress pips */}
          <div className="nav-bar" style={{ display: 'flex', gap: 4, flexShrink: 0, maxWidth: 'min(280px, 40vw)' }}>
            {[1,2,3,4,5,6,7].map(n => {
              const pct = progress[keys[n-1]] || 0;
              const isAct = n === state.activeChapter;
              return (
                <div
                  key={n}
                  onClick={() => dispatch({ type: 'SET_CHAPTER', chapter: n })}
                  title={`Layer ${n}: ${pct}%`}
                  style={{
                    flexShrink: 0,
                    width: 26, height: 26, borderRadius: 6,
                    background: `linear-gradient(to top, ${C.BLUE} ${pct}%, ${C.RAISED} ${pct}%)`,
                    border: `2px solid ${isAct ? C.ORANGE : C.BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: isAct ? C.ORANGE : C.MUTED,
                    fontWeight: 700, cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {n}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 60px' }}>
        {renderChapter()}
      </main>

      <NotificationBar notifications={state.notifications} dispatch={dispatch} />

      {showVictory && (
        <VictoryScreen state={state} onClose={() => setShowVictory(false)} />
      )}
    </div>
  );
}
