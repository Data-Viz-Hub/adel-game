import { useReducer, useState } from 'react';
import { gameReducer, createInitialState, getLayerProgress, isChapterUnlocked, getLockReason } from './gameReducer';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import NotificationBar from './components/NotificationBar';
import VictoryScreen from './components/VictoryScreen';
import Chapter1_Infrastructure from './components/chapters/Chapter1_Infrastructure';
import Chapter2_DataLayer from './components/chapters/Chapter2_DataLayer';
import Chapter3_Interoperability from './components/chapters/Chapter3_Interoperability';
import Chapter4_AppServices from './components/chapters/Chapter4_AppServices';
import Chapter5_Channels from './components/chapters/Chapter5_Channels';
import Chapter6_LifeEvents from './components/chapters/Chapter6_LifeEvents';
import Chapter7_Legal from './components/chapters/Chapter7_Legal';

const CHAPTER_COLORS = {
  1: '#4ade80', 2: '#a78bfa', 3: '#60a5fa', 4: '#f59e0b',
  5: '#fb923c', 6: '#2dd4bf', 7: '#f87171',
};

const CHAPTER_DESCRIPTIONS = {
  1: 'Migrate 42 government agencies to cloud infrastructure',
  2: 'Standardize data fields and build the National Data Catalog',
  3: 'Connect agencies via ADEL data exchange hub',
  4: 'Deploy and adopt shared digital service tools',
  5: 'Assign optimal delivery channels for 16 government services',
  6: 'Optimize 8 critical citizen life events end-to-end',
  7: 'Enact foundational laws to govern digital transformation',
};

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryShown, setVictoryShown] = useState(false);

  if (state.victoryUnlocked && !victoryShown && !showVictory) {
    setShowVictory(true);
    setVictoryShown(true);
  }

  const progress = getLayerProgress(state);
  const locked = !isChapterUnlocked(state.activeChapter, progress);
  const lockReasons = getLockReason(state.activeChapter, progress);

  function renderChapter() {
    if (locked) {
      return (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: '#334155' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
          <h3 style={{ fontSize: 20, color: '#475569', marginBottom: 12 }}>Chapter Locked</h3>
          <p style={{ fontSize: 14, color: '#334155', maxWidth: 400, margin: '0 auto 20px' }}>
            Complete the following requirements to unlock this chapter:
          </p>
          {lockReasons.map((r, i) => (
            <div key={i} style={{
              display: 'inline-block', padding: '8px 16px', margin: '4px',
              background: '#0f172a', border: '1px solid #334155',
              borderRadius: 20, fontSize: 13, color: '#64748b',
            }}>
              • {r}
            </div>
          ))}
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

  const chapterColor = CHAPTER_COLORS[state.activeChapter];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060c18',
      color: '#f1f5f9',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <TopBar state={state} />
      <Navigation state={state} dispatch={dispatch} />

      {/* Chapter header */}
      <div style={{
        borderBottom: `1px solid ${chapterColor}22`,
        background: `linear-gradient(180deg, ${chapterColor}08 0%, transparent 100%)`,
        padding: '20px 24px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: chapterColor + '22',
              border: `2px solid ${chapterColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: chapterColor,
            }}>
              {state.activeChapter}
            </div>
            <div>
              <div style={{ fontSize: 11, color: chapterColor, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                Layer {state.activeChapter} of 7
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                {CHAPTER_DESCRIPTIONS[state.activeChapter]}
              </div>
            </div>

            {/* Progress rings */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {[1,2,3,4,5,6,7].map(n => {
                const keys = ['infrastructure','dataLayer','interoperability','appServices','channels','lifeEvents','legal'];
                const pct = progress[keys[n-1]] || 0;
                const c = CHAPTER_COLORS[n];
                return (
                  <div key={n} title={`Layer ${n}: ${pct}%`} style={{ cursor: 'pointer' }}
                    onClick={() => dispatch({ type: 'SET_CHAPTER', chapter: n })}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: `conic-gradient(${c} ${pct * 3.6}deg, #1e293b 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: n === state.activeChapter ? '#0a1628' : '#060c18',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, color: n === state.activeChapter ? c : '#475569',
                        fontWeight: 700,
                      }}>
                        {n}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        {renderChapter()}
      </main>

      <NotificationBar notifications={state.notifications} dispatch={dispatch} />

      {showVictory && (
        <VictoryScreen state={state} onClose={() => setShowVictory(false)} />
      )}
    </div>
  );
}
