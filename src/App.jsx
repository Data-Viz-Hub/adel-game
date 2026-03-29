import { useReducer, useState, useEffect } from 'react';
import { gameReducer, createInitialState, getLayerProgress, isChapterUnlocked, getChapterPrerequisites } from './gameReducer';
import { saveGame, loadGame, clearGame, hasSavedGame } from './storage';
import { C } from './colors';
import IntroScreen from './components/IntroScreen';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import NotificationBar from './components/NotificationBar';
import VictoryScreen from './components/VictoryScreen';
import GameOverScreen from './components/GameOverScreen';
import TransformationView from './components/TransformationView';
import LockModal from './components/LockModal';
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


function initState() {
  const saved = loadGame();
  const fresh = createInitialState();
  if (!saved) return fresh;
  // Always use fresh agency list — restoring only zone assignments from saved
  // (prevents stale agencies from old saves persisting after agency list changes)
  const savedAgencies = saved.agencies || [];
  const agencies = fresh.agencies.map(a => {
    const s = savedAgencies.find(s => s.id === a.id);
    return s ? { ...a, zone: s.zone } : a;
  });
  return { ...fresh, ...saved, agencies };
}

export default function App() {
  const [started, setStarted] = useState(() => hasSavedGame());
  const [state, dispatch] = useReducer(gameReducer, null, initState);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryShown, setVictoryShown] = useState(false);
  const [showTransformation, setShowTransformation] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  // Detect an existing save once on mount
  const [hasSave] = useState(() => hasSavedGame());

  // ── Auto-save: persist state whenever it changes (after game starts) ──
  useEffect(() => {
    if (started) saveGame(state);
  }, [state, started]);

  // ── Timer: MUST be before any early returns (Rules of Hooks) ──
  useEffect(() => {
    if (!started || state.gameLost || state.victoryUnlocked) return;
    const id = setInterval(() => dispatch({ type: 'TICK_TIME' }), 1000);
    return () => clearInterval(id);
  }, [started, state.gameLost, state.victoryUnlocked]);

  function handleNewGame() {
    clearGame();
    window.location.reload();
  }

  function handleContinue() {
    setStarted(true);
  }

  function handleStart() {
    if (hasSave) {
      // There's a saved game — clear it then reload so initState() gives a clean slate
      clearGame();
      window.location.reload();
    } else {
      setStarted(true);
    }
  }

  // Intro gate
  if (!started) return (
    <IntroScreen
      hasSave={hasSave}
      onContinue={handleContinue}
      onStart={handleStart}
    />
  );

  // Victory trigger
  if (state.victoryUnlocked && !victoryShown && !showVictory) {
    setShowVictory(true);
    setVictoryShown(true);
  }

  // Game over
  if (state.gameLost) {
    return <GameOverScreen state={state} onRestart={handleNewGame} />;
  }

  const progress = getLayerProgress(state);
  const locked = !isChapterUnlocked(state.activeChapter, state);
  const prerequisites = locked ? getChapterPrerequisites(state.activeChapter, state) : null;
  const info = CHAPTER_INFO[state.activeChapter];
  const keys = ['infrastructure','dataLayer','interoperability','appServices','channels','lifeEvents','legal'];

  function renderChapter() {
    const props = { state, dispatch, locked };
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
      <div style={{ background: C.CARD, borderBottom: `1px solid ${C.BORDER}`, padding: '10px 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: C.BLUE_DIM, border: `2px solid ${C.BLUE}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>
            {info?.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ORANGE }}>
              Layer {state.activeChapter} — {info?.name}
              {locked && <span style={{ marginLeft: 8, fontSize: 11, color: C.MUTED, fontWeight: 400 }}>🔒 locked</span>}
            </div>
            <div style={{ fontSize: 11, color: C.MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {info?.desc}
            </div>
          </div>

          {/* Progress pips */}
          <div className="nav-bar" style={{ display: 'flex', gap: 4, flexShrink: 0, maxWidth: 'min(280px, 40vw)' }}>
            {[1,2,3,4,5,6,7].map(n => {
              const pct = progress[keys[n-1]] || 0;
              const isAct = n === state.activeChapter;
              return (
                <div key={n} onClick={() => dispatch({ type: 'SET_CHAPTER', chapter: n })}
                  title={`Layer ${n}: ${pct}%`}
                  style={{
                    flexShrink: 0, width: 26, height: 26, borderRadius: 6,
                    background: `linear-gradient(to top, ${C.BLUE} ${pct}%, ${C.RAISED} ${pct}%)`,
                    border: `2px solid ${isAct ? C.ORANGE : C.BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: isAct ? C.ORANGE : C.MUTED,
                    fontWeight: 700, cursor: 'pointer', transition: 'border-color 0.2s',
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
        {/* Slim lock bar — chapter is still fully visible */}
        {locked && prerequisites && (
          <div style={{
            margin: '16px 0 0',
            padding: '10px 16px',
            background: `${C.ORANGE}0F`,
            border: `1px solid ${C.ORANGE}44`,
            borderLeft: `4px solid ${C.ORANGE}`,
            borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 15 }}>🔒</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: 700, color: C.ORANGE, fontSize: 13 }}>
                Actions disabled
              </span>
              <span style={{ color: C.MUTED, fontSize: 12, marginLeft: 8 }}>
                {prerequisites.items.filter(i => !i.met).length} prerequisite{prerequisites.items.filter(i => !i.met).length > 1 ? 's' : ''} not yet met
              </span>
            </div>
            <button
              onClick={() => setLockModalOpen(true)}
              style={{
                padding: '6px 14px', flexShrink: 0,
                background: C.CARD, border: `1px solid ${C.ORANGE}`,
                color: C.ORANGE, borderRadius: 6,
                cursor: 'pointer', fontSize: 12, fontWeight: 700,
              }}
            >
              What's needed? →
            </button>
          </div>
        )}
        {renderChapter()}
      </main>

      <NotificationBar notifications={state.notifications} dispatch={dispatch} />
      {showVictory && <VictoryScreen state={state} onClose={() => setShowVictory(false)} />}
      {showTransformation && <TransformationView state={state} onClose={() => setShowTransformation(false)} />}
      {lockModalOpen && locked && prerequisites && (
        <LockModal
          chapterId={state.activeChapter}
          prerequisites={prerequisites}
          onClose={() => setLockModalOpen(false)}
          onNavigate={chapter => dispatch({ type: 'SET_CHAPTER', chapter })}
        />
      )}

      {/* Floating buttons — bottom-left stack */}
      <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 900, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={() => setShowTransformation(true)}
          style={{
            padding: '10px 16px',
            background: C.CARD, border: `2px solid ${C.ORANGE}`,
            color: C.ORANGE, borderRadius: 10,
            cursor: 'pointer', fontSize: 12, fontWeight: 700,
            boxShadow: `0 4px 20px ${C.ORANGE}44`,
          }}
        >
          🔄 Transformation
        </button>
        <button
          onClick={() => { if (window.confirm('Start a new game? Current progress will be lost.')) handleNewGame(); }}
          style={{
            padding: '8px 16px',
            background: C.CARD, border: `1px solid ${C.BORDER}`,
            color: C.MUTED, borderRadius: 10,
            cursor: 'pointer', fontSize: 11,
          }}
        >
          ↺ New Game
        </button>
      </div>
    </div>
  );
}
