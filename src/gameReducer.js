import { AGENCIES, DATA_FIELDS, USEFUL_CONNECTIONS, SERVICE_TOOLS, GOVERNMENT_SERVICES, LIFE_EVENTS, LAWS, ADEL_NODES } from './gameData';

// ============================================================
// Initial State
// ============================================================
export function createInitialState() {
  return {
    agencies: AGENCIES.map(a => ({ ...a, zone: null, overheating: Math.random() < 0.12 })),
    dataFields: DATA_FIELDS.map(f => ({
      ...f,
      aligned: false,
      cataloged: false,
      authoritative: false,
      catalogMetadata: null,
    })),
    adelNodes: ADEL_NODES.map(n => ({
      ...n,
      securityServerDeployed: false,
      certificateIssued: false,
    })),
    connections: {},
    connectionInProgress: null,
    serviceTools: SERVICE_TOOLS.map(t => ({ ...t, deployed: false, adopters: 0 })),
    channelAssignments: Object.fromEntries(GOVERNMENT_SERVICES.map(s => [s.id, { channel: null, correct: false }])),
    lifeEvents: LIFE_EVENTS.map(e => ({ ...e, optimized: false })),
    laws: LAWS.map(l => ({ ...l, enacted: false, effectiveDate: null, bonusApplied: false })),
    turn: 0,
    budget: 100,
    citizenSatisfaction: 12,
    interoperabilityScore: 0,
    duplicatesRemaining: 340,
    trustIndex: 20,
    activeChapter: 1,
    rogueAlertPending: false,
    rogueAlertCount: 0,
    victoryUnlocked: false,
    gameLost: false,
    connectionModalOpen: null,
    connectionStep: 0,
    notifications: [],
    // Time system — 730 days = Jan 1 2025 → Jan 1 2027
    gameDay: 0,
  };
}

// ============================================================
// Progress Calculators
// ============================================================
export function calcInfraProgress(state) {
  const total = state.agencies.length;
  const score = state.agencies.reduce((sum, a) => {
    if (!a.zone) return sum;
    if (a.zone === 'legacy') return sum + 0.5;
    return sum + 1;
  }, 0);
  return Math.round((score / total) * 100);
}

export function calcDataProgress(state) {
  const aligned = state.dataFields.filter(f => f.aligned).length;
  const cataloged = state.dataFields.filter(f => f.cataloged).length;
  const total = state.dataFields.length;
  return Math.round((aligned / total * 0.4 + cataloged / total * 0.6) * 100);
}

export function calcInteropProgress(state) {
  const active = Object.values(state.connections).filter(c => c.active).length;
  const max = USEFUL_CONNECTIONS.length;
  return Math.round((active / max) * 100);
}

export function calcAppServicesProgress(state) {
  const deployed = state.serviceTools.filter(t => t.deployed).length;
  const totalAdoption = state.serviceTools.reduce((sum, t) => sum + (t.adopters / t.maxAdopters), 0);
  const total = state.serviceTools.length;
  return Math.round((deployed / total * 0.3 + totalAdoption / total * 0.7) * 100);
}

export function calcChannelsProgress(state) {
  const correct = Object.values(state.channelAssignments).filter(a => a.correct).length;
  return Math.round((correct / GOVERNMENT_SERVICES.length) * 100);
}

export function calcLifeEventsProgress(state) {
  const optimized = state.lifeEvents.filter(e => e.optimized).length;
  return Math.round((optimized / state.lifeEvents.length) * 100);
}

export function calcLegalProgress(state) {
  const enacted = state.laws.filter(l => l.enacted).length;
  const effective = state.laws.filter(l => l.enacted && l.bonusApplied).length;
  return Math.round((enacted / state.laws.length * 0.6 + effective / state.laws.length * 0.4) * 100);
}

export function getLayerProgress(state) {
  return {
    infrastructure: calcInfraProgress(state),
    dataLayer: calcDataProgress(state),
    interoperability: calcInteropProgress(state),
    appServices: calcAppServicesProgress(state),
    channels: calcChannelsProgress(state),
    lifeEvents: calcLifeEventsProgress(state),
    legal: calcLegalProgress(state),
  };
}

export function getChapterPrerequisites(chapterId, state) {
  switch (chapterId) {
    case 1:
    case 7:
      return { allMet: true, items: [] };

    case 2: {
      const cloud = state.agencies.filter(a => a.zone && a.zone !== 'legacy');
      const i1 = {
        id: 'cloud-min', met: cloud.length >= 5,
        label: 'Core agencies on cloud infrastructure',
        detail: 'At least 5 agencies must be on cloud infrastructure before their data can be standardized and cataloged. Without digital systems, there are no authoritative data sources.',
        count: `${cloud.length} / 5`,
        fixes: state.agencies.filter(a => !a.zone || a.zone === 'legacy').slice(0, 4).map(a => a.name),
        fixesLabel: 'Still on legacy or unassigned:',
        targetChapter: 1,
      };
      return { allMet: i1.met, items: [i1] };
    }

    case 3: {
      const cloud = state.agencies.filter(a => a.zone && a.zone !== 'legacy');
      const cataloged = state.dataFields.filter(f => f.cataloged);
      const i1 = {
        id: 'cloud-adel', met: cloud.length >= 8,
        label: 'Agencies ready to host ADEL Security Servers',
        detail: 'Each ADEL participant must run a Security Server inside its own infrastructure. At least 8 agencies must be cloud-hosted before Security Servers can be deployed and certified.',
        count: `${cloud.length} / 8`,
        fixes: state.agencies.filter(a => !a.zone || a.zone === 'legacy').slice(0, 4).map(a => a.name),
        fixesLabel: 'Agencies to migrate:',
        targetChapter: 1,
      };
      const i2 = {
        id: 'catalog-min', met: cataloged.length >= 3,
        label: 'Data fields registered in National Data Catalog',
        detail: 'ADEL connections legally bind agencies to exchange specific, cataloged data. At least 3 authoritative data fields must be registered before connections have a semantic and legal basis.',
        count: `${cataloged.length} / 3`,
        fixes: state.dataFields.filter(f => !f.cataloged).slice(0, 3).map(f => f.label),
        fixesLabel: 'Data fields to catalog:',
        targetChapter: 2,
      };
      return { allMet: i1.met && i2.met, items: [i1, i2] };
    }

    case 4: {
      const activeConns = Object.values(state.connections).filter(c => c.active).length;
      const cataloged = state.dataFields.filter(f => f.cataloged);
      const i1 = {
        id: 'connections-min', met: activeConns >= 5,
        label: 'Active ADEL connections as service backbone',
        detail: 'Shared application services rely on ADEL to authenticate users and retrieve pre-filled data. At least 5 active data exchange connections are needed before platform tools can operate.',
        count: `${activeConns} / 5`,
        fixes: USEFUL_CONNECTIONS
          .filter(([a, b]) => !state.connections[[a, b].sort().join('--')]?.active)
          .slice(0, 3)
          .map(([a, b]) => `${ADEL_NODES.find(n => n.id === a)?.name} ↔ ${ADEL_NODES.find(n => n.id === b)?.name}`),
        fixesLabel: 'Connections to establish:',
        targetChapter: 3,
      };
      const i2 = {
        id: 'catalog-apps', met: cataloged.length >= 4,
        label: 'Data fields available for service pre-fill',
        detail: 'Shared applications read from the National Data Catalog to pre-fill forms and validate inputs. At least 4 cataloged fields are needed to cover identity, tax, and address data.',
        count: `${cataloged.length} / 4`,
        fixes: state.dataFields.filter(f => !f.cataloged).slice(0, 3).map(f => f.label),
        fixesLabel: 'Data fields to catalog:',
        targetChapter: 2,
      };
      return { allMet: i1.met && i2.met, items: [i1, i2] };
    }

    case 5: {
      const deployed = state.serviceTools.filter(t => t.deployed);
      const adopted = state.serviceTools.filter(t => t.deployed && (t.adopters / t.maxAdopters) >= 0.3);
      const i1 = {
        id: 'tools-deployed', met: deployed.length >= 3,
        label: 'Shared service tools deployed',
        detail: 'Service channels are only meaningful once digital tools exist to deliver through. Without deployed platforms, channel assignments are empty declarations.',
        count: `${deployed.length} / 3`,
        fixes: state.serviceTools.filter(t => !t.deployed).slice(0, 3).map(t => t.name),
        fixesLabel: 'Tools to deploy:',
        targetChapter: 4,
      };
      const i2 = {
        id: 'tools-adopted', met: adopted.length >= 2,
        label: 'Tools with active agency adoption (≥30%)',
        detail: 'Channels are effective only when agencies actually use the tools behind them. At least 2 tools must reach 30%+ adoption before channel routing decisions are meaningful.',
        count: `${adopted.length} / 2`,
        fixes: deployed.filter(t => (t.adopters / t.maxAdopters) < 0.3)
          .map(t => `${t.name} (${Math.round(t.adopters / t.maxAdopters * 100)}%)`).slice(0, 3),
        fixesLabel: 'Tools needing onboarding:',
        targetChapter: 4,
      };
      return { allMet: i1.met && i2.met, items: [i1, i2] };
    }

    case 6: {
      const activeConns = Object.values(state.connections).filter(c => c.active).length;
      const correct = Object.values(state.channelAssignments).filter(a => a.correct).length;
      const adopted = state.serviceTools.filter(t => t.deployed && (t.adopters / t.maxAdopters) >= 0.3);
      const i1 = {
        id: 'connections-life', met: activeConns >= 8,
        label: 'ADEL connections for automated event triggers',
        detail: 'Life event automation requires reliable data propagation across agencies. When a hospital registers a birth, ADEL must automatically notify Finance, Justice, and Social Insurance. 8 active connections are the minimum viable network.',
        count: `${activeConns} / 8`,
        fixes: USEFUL_CONNECTIONS
          .filter(([a, b]) => !state.connections[[a, b].sort().join('--')]?.active)
          .slice(0, 3)
          .map(([a, b]) => `${ADEL_NODES.find(n => n.id === a)?.name} ↔ ${ADEL_NODES.find(n => n.id === b)?.name}`),
        fixesLabel: 'Missing connections:',
        targetChapter: 3,
      };
      const i2 = {
        id: 'channels-life', met: correct >= 8,
        label: 'Correct service channel assignments',
        detail: 'Life events span multiple services. Each sub-service must use the optimal channel — mixing in-person steps into a digital journey breaks the automation chain.',
        count: `${correct} / 8`,
        fixes: [],
        fixesLabel: '',
        targetChapter: 5,
      };
      const i3 = {
        id: 'tools-life', met: adopted.length >= 2,
        label: 'Citizen-facing tools operational',
        detail: 'Life events require citizens to authenticate (e-Identity Gateway), sign documents (e-Signature), and receive notifications. Core tools must have sufficient agency adoption.',
        count: `${adopted.length} / 2`,
        fixes: state.serviceTools.filter(t => !t.deployed).slice(0, 2).map(t => t.name),
        fixesLabel: 'Tools to deploy first:',
        targetChapter: 4,
      };
      return { allMet: i1.met && i2.met && i3.met, items: [i1, i2, i3] };
    }

    default:
      return { allMet: true, items: [] };
  }
}

export function getLifeEventPrerequisites(event, state) {
  const items = [];
  for (const [a, b] of (event.requiredConnections || [])) {
    const key = [a, b].sort().join('--');
    const nA = ADEL_NODES.find(n => n.id === a);
    const nB = ADEL_NODES.find(n => n.id === b);
    items.push({
      id: `conn-${key}`, type: 'connection', icon: '🔗',
      met: !!state.connections[key]?.active,
      label: `${nA?.name} ↔ ${nB?.name}`,
      detail: state.connections[key]?.active ? 'Data exchange link active' : 'ADEL connection not established',
      targetChapter: 3,
    });
  }
  for (const fieldId of (event.requiredFields || [])) {
    const field = state.dataFields.find(f => f.id === fieldId);
    const met = !!field?.cataloged;
    items.push({
      id: `field-${fieldId}`, type: 'dataField', icon: '🗄️',
      met, label: field?.label || fieldId,
      detail: met ? 'Cataloged in National Data Catalog' : 'Not registered in National Data Catalog',
      targetChapter: 2,
    });
  }
  for (const toolId of (event.requiredTools || [])) {
    const tool = state.serviceTools.find(t => t.id === toolId);
    const adoption = tool ? Math.round((tool.adopters / tool.maxAdopters) * 100) : 0;
    const met = !!(tool?.deployed && tool.adopters > 0);
    items.push({
      id: `tool-${toolId}`, type: 'tool', icon: '⚙️',
      met, label: tool?.name || toolId,
      detail: !tool?.deployed ? 'Not yet deployed' : `${adoption}% agency adoption`,
      targetChapter: 4,
    });
  }
  if (event.requiredChannel) {
    const asgn = state.channelAssignments[event.requiredChannel];
    const svc = GOVERNMENT_SERVICES.find(s => s.id === event.requiredChannel);
    items.push({
      id: `ch-${event.requiredChannel}`, type: 'channel', icon: '📡',
      met: !!asgn?.correct, label: svc?.name || event.requiredChannel,
      detail: asgn?.correct ? 'Optimal delivery channel assigned' : 'Correct delivery channel not assigned',
      targetChapter: 5,
    });
  }
  return { allMet: items.every(i => i.met), items };
}

// Updated: takes full state instead of progress percentages
export function isChapterUnlocked(chapterId, state) {
  if (chapterId === 1 || chapterId === 7) return true;
  return getChapterPrerequisites(chapterId, state).allMet;
}

export function getLockReason(chapterId, progress) {
  // Legacy stub — use getChapterPrerequisites(chapterId, state) instead
  return [];
}


function computeDerivedMetrics(state) {
  const progress = getLayerProgress(state);
  const zeroChannelServices = Object.entries(state.channelAssignments).filter(([id, a]) => {
    const svc = GOVERNMENT_SERVICES.find(s => s.id === id);
    return a.correct && svc && svc.correctChannel === 'zero';
  }).length;
  const maxZero = GOVERNMENT_SERVICES.filter(s => s.correctChannel === 'zero').length;

  const citizenSatisfaction = Math.min(100, Math.round(
    12 +
    (progress.lifeEvents / 100 * 40) +
    (progress.channels / 100 * 20) +
    (zeroChannelServices / maxZero * 15) +
    (state.trustIndex * 0.13)
  ));

  const interoperabilityScore = Math.min(100, Math.round(
    progress.interoperability * 0.5 +
    progress.dataLayer * 0.3 +
    progress.appServices * 0.2
  ));

  const activeConnections = Object.values(state.connections).filter(c => c.active).length;
  const duplicatesRemaining = Math.max(0,
    340 -
    (state.dataFields.filter(f => f.aligned).length * 12) -
    (activeConnections * 8) -
    (state.lifeEvents.filter(e => e.optimized).length * 15)
  );

  let trustIndex = 20;
  trustIndex += state.laws.filter(l => l.enacted && l.bonusApplied).length * 8;
  trustIndex += state.serviceTools.find(t => t.id === 'st02')?.deployed ? 10 : 0;
  trustIndex += state.laws.find(l => l.id === 'law03')?.enacted ? 10 : 0;
  const sensitiveInWrongZone = state.agencies.filter(a =>
    a.sensitive && a.zone && a.zone !== 'hybrid'
  ).length;
  trustIndex -= sensitiveInWrongZone * 5;
  trustIndex = Math.max(0, Math.min(100, trustIndex));

  return { citizenSatisfaction, interoperabilityScore, duplicatesRemaining, trustIndex };
}

function checkVictory(state) {
  const progress = getLayerProgress(state);
  return (
    progress.infrastructure >= 80 &&
    progress.dataLayer >= 80 &&
    progress.interoperability >= 80 &&
    progress.appServices >= 70 &&
    progress.channels >= 75 &&
    progress.lifeEvents >= 75 &&
    state.laws.filter(l => l.enacted).length >= 3
  );
}

function checkAndApplyLawBonuses(state) {
  const progress = getLayerProgress(state);
  return state.laws.map(law => {
    if (!law.enacted || law.bonusApplied) return law;
    const layerProgress = progress[law.dependentLayer] || 0;
    if (layerProgress >= law.dependentThreshold) {
      return { ...law, bonusApplied: true };
    }
    return law;
  });
}

function addNotification(state, message, type = 'info') {
  const note = { id: Date.now(), message, type };
  return [...state.notifications.slice(-4), note];
}

// ============================================================
// Time helpers
// ============================================================
export const GAME_START_DAY = 0;       // = Jan 1, 2025 in game
export const GAME_DEADLINE_DAY = 730;  // = Jan 1, 2027 (2 years)

export function gameDayToDate(day) {
  const d = new Date(2025, 0, 1);
  d.setDate(d.getDate() + day);
  return d;
}

export function formatGameDate(day) {
  return gameDayToDate(day).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// Day cost per action type
const ACTION_DAYS = {
  ASSIGN_AGENCY_TO_ZONE:   14,  // 2 weeks per migration
  ALIGN_DATA_FIELD:         7,  // 1 week for alignment work
  CATALOG_DATA_FIELD:       7,  // 1 week for catalog registration
  ADVANCE_CONNECTION_STEP: 10,  // ~10 days per connection step
  DEPLOY_TOOL:             21,  // 3 weeks to deploy a platform
  ONBOARD_AGENCY:           7,  // 1 week per onboarding batch
  ASSIGN_CHANNEL:           3,  // 3 days for channel decision
  OPTIMIZE_LIFE_EVENT:     21,  // 3 weeks for end-to-end journey redesign
  ENACT_LAW:               14,  // 2 weeks for parliamentary process
};

function advanceDay(state, actionType) {
  const days = ACTION_DAYS[actionType] || 0;
  const newDay = state.gameDay + days;
  const gameLost = !state.victoryUnlocked && newDay >= GAME_DEADLINE_DAY;
  return { gameDay: newDay, gameLost: gameLost || state.gameLost };
}

// ============================================================
// Reducer
// ============================================================
export function gameReducer(state, action) {
  let newState;

  // Stop all actions if game is over
  if ((state.gameLost || state.victoryUnlocked) &&
      action.type !== 'SET_CHAPTER' &&
      action.type !== 'DISMISS_NOTIFICATION' &&
      action.type !== 'TICK_TIME') {
    return state;
  }

  switch (action.type) {
    // --- Time tick (1 real second = 1 game day) ---
    case 'TICK_TIME': {
      if (state.gameLost || state.victoryUnlocked) return state;
      const newDay = state.gameDay + 1;
      const gameLost = newDay >= GAME_DEADLINE_DAY;
      return { ...state, gameDay: newDay, gameLost };
    }

    // --- Chapter navigation ---
    case 'SET_CHAPTER':
      return { ...state, activeChapter: action.chapter };

    // --- Chapter 1: Infrastructure ---
    case 'ASSIGN_AGENCY_TO_ZONE': {
      const { agencyId, zoneId } = action;
      const agency = state.agencies.find(a => a.id === agencyId);
      if (!agency) return state;

      // Count current zone occupancy
      const zoneCounts = { cloud_a: 0, cloud_b: 0, hybrid: 0, legacy: 0 };
      state.agencies.forEach(a => { if (a.zone) zoneCounts[a.zone]++; });
      const capacities = { cloud_a: 11, cloud_b: 11, hybrid: 6, legacy: 4 };

      if (zoneCounts[zoneId] >= capacities[zoneId] && agency.zone !== zoneId) {
        return { ...state, notifications: addNotification(state, `Zone ${zoneId} is at full capacity!`, 'error') };
      }

      const migrationCost = zoneId === 'legacy' ? 0 : zoneId === 'hybrid' ? 3 : 2;
      const prevZone = agency.zone;
      const refund = prevZone && prevZone !== 'legacy' ? (prevZone === 'hybrid' ? 3 : 2) : 0;
      const netCost = prevZone === zoneId ? 0 : migrationCost - refund;

      if (state.budget + refund - migrationCost < 0 && prevZone !== zoneId) {
        return { ...state, notifications: addNotification(state, 'Insufficient budget!', 'error') };
      }

      let trust = state.trustIndex;
      let msg = null;
      if (agency.sensitive && zoneId !== 'hybrid') {
        trust = Math.max(0, trust - 5);
        msg = `⚠️ ${agency.name} handles sensitive data — Hybrid Secure Zone recommended!`;
      }

      newState = {
        ...state,
        budget: Math.max(0, state.budget - netCost),
        agencies: state.agencies.map(a =>
          a.id === agencyId ? { ...a, zone: zoneId } : a
        ),
        trustIndex: trust,
        turn: state.turn + 1,
        ...advanceDay(state, 'ASSIGN_AGENCY_TO_ZONE'),
      };
      if (msg) newState.notifications = addNotification(newState, msg, 'warning');
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.laws = checkAndApplyLawBonuses(newState);
      newState.victoryUnlocked = checkVictory(newState);
      return newState;
    }

    // --- Chapter 2: Data Layer ---
    case 'ALIGN_DATA_FIELD': {
      const { fieldId, answer } = action;
      const field = state.dataFields.find(f => f.id === fieldId);
      if (!field || field.aligned) return state;

      if (answer === field.standard) {
        newState = {
          ...state,
          dataFields: state.dataFields.map(f =>
            f.id === fieldId ? { ...f, aligned: true } : f
          ),
          turn: state.turn + 1,
          ...advanceDay(state, 'ALIGN_DATA_FIELD'),
          notifications: addNotification(state, `✓ "${field.label}" aligned to standard: ${answer}`, 'success'),
        };
      } else {
        newState = {
          ...state,
          budget: Math.max(0, state.budget - 1),
          ...advanceDay(state, 'ALIGN_DATA_FIELD'),
          notifications: addNotification(state, `✗ Incorrect — consultant called in to fix the mistake (-1 budget)`, 'error'),
        };
      }
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.laws = checkAndApplyLawBonuses(newState);
      return newState;
    }

    case 'CATALOG_DATA_FIELD': {
      const { fieldId, metadata } = action;
      newState = {
        ...state,
        dataFields: state.dataFields.map(f =>
          f.id === fieldId ? { ...f, cataloged: true, catalogMetadata: metadata } : f
        ),
        turn: state.turn + 1,
        ...advanceDay(state, 'CATALOG_DATA_FIELD'),
        notifications: addNotification(state, `Data field cataloged in National Data Catalog`, 'success'),
      };
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.laws = checkAndApplyLawBonuses(newState);
      newState.victoryUnlocked = checkVictory(newState);
      return newState;
    }

    // --- Chapter 3: Interoperability ---
    case 'OPEN_CONNECTION_MODAL':
      return { ...state, connectionModalOpen: action.connectionKey, connectionStep: 0 };

    case 'CLOSE_CONNECTION_MODAL':
      return { ...state, connectionModalOpen: null, connectionStep: 0 };

    case 'ADVANCE_CONNECTION_STEP': {
      const { connectionKey } = action;
      const step = state.connectionStep;

      if (step === 1) {
        if (state.budget < 1) {
          return { ...state, notifications: addNotification(state, 'Insufficient budget for certificate!', 'error') };
        }
        newState = {
          ...state,
          budget: state.budget - 1,
          connectionStep: 2,
          ...advanceDay(state, 'ADVANCE_CONNECTION_STEP'),
        };
        return newState;
      }

      if (step === 2) {
        const [from, to] = connectionKey.split('--');
        const activeConnections = Object.values(state.connections).filter(c => c.active).length;
        const shouldTriggerRogue = (activeConnections + 1) % 5 === 0;

        newState = {
          ...state,
          connectionStep: 3,
          connections: {
            ...state.connections,
            [connectionKey]: {
              from, to, certified: true, legalAgreement: true,
              metadataRegistered: true, active: true, dataFlowVolume: Math.floor(Math.random() * 100) + 50,
            },
          },
          connectionModalOpen: null,
          rogueAlertPending: shouldTriggerRogue,
          rogueAlertCount: shouldTriggerRogue ? state.rogueAlertCount + 1 : state.rogueAlertCount,
          turn: state.turn + 1,
          ...advanceDay(state, 'ADVANCE_CONNECTION_STEP'),
          notifications: addNotification(state, `Connection activated!`, 'success'),
        };
        const derived = computeDerivedMetrics(newState);
        newState = { ...newState, ...derived };
        newState.laws = checkAndApplyLawBonuses(newState);
        newState.victoryUnlocked = checkVictory(newState);
        return newState;
      }

      return { ...state, connectionStep: step + 1 };
    }

    case 'DISMISS_ROGUE_ALERT':
      return {
        ...state,
        rogueAlertPending: false,
        notifications: addNotification(state, '✓ Rogue service blocked — governance maintained', 'success'),
      };

    case 'MISS_ROGUE_ALERT': {
      newState = {
        ...state,
        rogueAlertPending: false,
        duplicatesRemaining: state.duplicatesRemaining + 10,
        notifications: addNotification(state, '⚠️ Rogue service slipped through — +10 duplicates!', 'warning'),
      };
      const derived = computeDerivedMetrics(newState);
      return { ...newState, ...derived };
    }

    // --- Chapter 4: Application Services ---
    case 'DEPLOY_TOOL': {
      const { toolId } = action;
      const tool = state.serviceTools.find(t => t.id === toolId);
      if (!tool || tool.deployed) return state;

      if (state.budget < tool.cost) {
        return { ...state, notifications: addNotification(state, 'Insufficient budget to deploy!', 'error') };
      }

      newState = {
        ...state,
        budget: state.budget - tool.cost,
        serviceTools: state.serviceTools.map(t =>
          t.id === toolId ? { ...t, deployed: true } : t
        ),
        turn: state.turn + 1,
        ...advanceDay(state, 'DEPLOY_TOOL'),
        notifications: addNotification(state, `${tool.name} deployed!`, 'success'),
      };
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.laws = checkAndApplyLawBonuses(newState);
      newState.victoryUnlocked = checkVictory(newState);
      return newState;
    }

    case 'ONBOARD_AGENCY': {
      const { toolId } = action;
      const tool = state.serviceTools.find(t => t.id === toolId);
      if (!tool || !tool.deployed || tool.adopters >= tool.maxAdopters) return state;

      if (state.budget < 1) {
        return { ...state, notifications: addNotification(state, 'Insufficient budget for onboarding!', 'error') };
      }

      let multiplier = 1;
      const digitalIdLaw = state.laws.find(l => l.id === 'law02');
      if (toolId === 'st01' && digitalIdLaw?.bonusApplied) multiplier *= 2;
      const interopScore = calcInteropProgress(state);
      if (interopScore >= 60) multiplier *= 1.5;
      if (state.budget < 20) multiplier *= 0.5;

      const baseGain = Math.ceil(tool.maxAdopters * 0.15 * multiplier);
      const newAdopters = Math.min(tool.maxAdopters, tool.adopters + baseGain);

      newState = {
        ...state,
        budget: state.budget - 1,
        serviceTools: state.serviceTools.map(t =>
          t.id === toolId ? { ...t, adopters: newAdopters } : t
        ),
        turn: state.turn + 1,
        ...advanceDay(state, 'ONBOARD_AGENCY'),
      };
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.laws = checkAndApplyLawBonuses(newState);
      newState.victoryUnlocked = checkVictory(newState);
      return newState;
    }

    // --- Chapter 5: Channels ---
    case 'ASSIGN_CHANNEL': {
      const { serviceId, channel } = action;
      const svc = GOVERNMENT_SERVICES.find(s => s.id === serviceId);
      if (!svc) return state;

      const correct = channel === svc.correctChannel;

      newState = {
        ...state,
        channelAssignments: {
          ...state.channelAssignments,
          [serviceId]: { channel, correct },
        },
        turn: state.turn + 1,
        ...advanceDay(state, 'ASSIGN_CHANNEL'),
        notifications: correct
          ? addNotification(state, `✓ Correct channel for ${svc.name}!`, 'success')
          : addNotification(state, `✗ "${svc.hint}"`, 'warning'),
      };
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.victoryUnlocked = checkVictory(newState);
      return newState;
    }

    // --- Chapter 6: Life Events ---
    case 'OPTIMIZE_LIFE_EVENT': {
      const { eventId } = action;
      newState = {
        ...state,
        lifeEvents: state.lifeEvents.map(e =>
          e.id === eventId ? { ...e, optimized: true } : e
        ),
        turn: state.turn + 1,
        ...advanceDay(state, 'OPTIMIZE_LIFE_EVENT'),
        notifications: addNotification(state, '🎉 Life event optimized — citizen journey transformed!', 'success'),
      };
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.victoryUnlocked = checkVictory(newState);
      return newState;
    }

    // --- Chapter 7: Legal ---
    case 'ENACT_LAW': {
      const { lawId } = action;
      const law = state.laws.find(l => l.id === lawId);
      if (!law || law.enacted) return state;

      const progress = getLayerProgress(state);
      const layerProgress = progress[law.dependentLayer] || 0;
      const bonusApplied = layerProgress >= law.dependentThreshold;

      let updatedDataFields = state.dataFields;
      if (lawId === 'law01' && bonusApplied) {
        updatedDataFields = state.dataFields.map(f => f.aligned ? { ...f, authoritative: true } : f);
      }

      const msg = bonusApplied
        ? `⚖️ ${law.name} enacted and immediately effective!`
        : `⚖️ ${law.name} enacted — awaiting ${law.impactArea} to reach ${law.dependentThreshold}%`;

      newState = {
        ...state,
        laws: state.laws.map(l =>
          l.id === lawId ? { ...l, enacted: true, effectiveDate: state.turn, bonusApplied } : l
        ),
        dataFields: updatedDataFields,
        turn: state.turn + 1,
        ...advanceDay(state, 'ENACT_LAW'),
        notifications: addNotification(state, msg, bonusApplied ? 'success' : 'warning'),
      };
      const derived = computeDerivedMetrics(newState);
      newState = { ...newState, ...derived };
      newState.victoryUnlocked = checkVictory(newState);
      return newState;
    }

    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };
    }

    case 'REGENERATE_BUDGET':
      return { ...state, budget: Math.min(100, state.budget + 2) };

    default:
      return state;
  }
}
