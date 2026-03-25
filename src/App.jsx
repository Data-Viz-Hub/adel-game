import { useReducer, useState, useEffect } from 'react';
import { gameReducer, createInitialState, getLayerProgress, isChapterUnlocked, getLockReason } from './gameReducer';
import { saveGame, loadGame, clearGame, hasSavedGame } from './storage';
import { C } from './colors';
import IntroScreen from './components/IntroScreen';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import NotificationBar from './components/NotificationBar';
import VictoryScreen from './components/VictoryScreen';
import GameOverScreen from './components/GameOverScreen';
import TransformationView from './components/TransformationView';
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

// Detailed lock explanations per chapter
const LOCK_DETAIL = {
  2: (p) => [
    p.infrastructure < 30 && `Migrate agencies to the cloud first — at least 9 of 30 agencies must be in Cloud A, Cloud B, or Hybrid zones (Infrastructure is at ${p.infrastructure}%, need 30%).`,
  ].filter(Boolean),
  3: (p) => [
    p.infrastructure < 50 && `Half the agencies must be cloud-migrated before the ADEL network can be wired — Infrastructure is at ${p.infrastructure}%, need 50%.`,
    p.dataLayer < 20 && `At least 2 data fields must be aligned to EU/ISO standards in the Data Layer before connections can be registered (Data Layer at ${p.dataLayer}%, need 20%).`,
  ].filter(Boolean),
  4: (p) => [
    p.interoperability < 40 && `Deploy connections in the ADEL Network first — at least 6 of 15 connections must be active (Interoperability at ${p.interoperability}%, need 40%).`,
    p.dataLayer < 30 && `Register more fields in the National Data Catalog — Data Layer must reach 30% (currently ${p.dataLayer}%).`,
  ].filter(Boolean),
  5: (p) => [
    p.appServices < 50 && `Deploy and onboard agencies on shared tools first — e-Identity Gateway and at least 1 more service must reach 50% adoption (App Services at ${p.appServices}%, need 50%).`,
  ].filter(Boolean),
  6: (p) => [
    p.channels < 60 && `Assign the correct channel to at least 10 of 16 government services in the Channels layer (currently ${p.channels}%, need 60%).`,
    p.interoperability < 50 && `At least 8 ADEL connections must be active to enable automated life event triggers (Interoperability at ${p.interoperability}%, need 50%).`,
    p.appServices < 40 && `More shared services must be adopted — App Services must reach 40% (currently ${p.appServices}%).`,
  ].filter(Boolean),
};

function LockBanner({ chapterId, progress }) {
  const reasons = LOCK_DETAIL[chapterId]?.(progress) || getLockReason(chapterId, progress);
  if (!reasons.length) return null;
  return (
    <div style={{
      margin: '16px 0',
      padding: '14px 16px',
      background: `${C.ORANGE}0F`,
      border: `1px solid ${C.ORANGE}55`,
      borderLeft: `4px solid ${C.ORANGE}`,
      borderRadius: 8,
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <span style={{ fontWeight: 700, color: C.ORANGE, fontSize: 13 }}>
          Prerequisites not yet met — actions in this layer are disabled
        </span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {reasons.map((r, i) => (
          <li key={i} style={{ color: C.MUTED, fontSize: 12, lineHeight: 1.7 }}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

function initState() {
  const saved = loadGame();
  const fresh = createInitialState();
  if (!saved) return fresh;
  // Overlay saved values onto fresh state so any new keys get defaults
  return { ...fresh, ...saved };
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, null, initState);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryShown, setVictoryShown] = useState(false);
  const [showTransformation, setShowTransformation] = useState(false);
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
  const locked = !isChapterUnlocked(state.activeChapter, progress);
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
        {/* Prerequisite banner — shown inline, chapter is still visible */}
        {locked && <LockBanner chapterId={state.activeChapter} progress={progress} />}
        {renderChapter()}
      </main>

      <NotificationBar notifications={state.notifications} dispatch={dispatch} />
      {showVictory && <VictoryScreen state={state} onClose={() => setShowVictory(false)} />}
      {showTransformation && <TransformationView state={state} onClose={() => setShowTransformation(false)} />}

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
