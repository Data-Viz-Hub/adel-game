// ============================================================
// ADEL: Architect of Digital Armenia — Static Game Data
// ============================================================

export const AGENCIES = [
  // ── Core Base Registries (a01–a11) — hold authoritative data, are ADEL nodes ──
  { id: 'a01', name: 'State Population Registry',    sensitive: false, dataClassification: 'confidential', role: 'registry', description: 'Master registry of all persons: ID, name, DOB, address, civil status' },
  { id: 'a02', name: 'Cadastre Committee',            sensitive: false, dataClassification: 'confidential', role: 'registry', description: 'Two registries: address register and real estate (property) register' },
  { id: 'a03', name: 'Business Registry',             sensitive: false, dataClassification: 'internal',     role: 'registry', description: 'Authoritative registry of all legal entities and their directors/owners' },
  { id: 'a04', name: 'State Revenue Committee',       sensitive: false, dataClassification: 'confidential', role: 'registry', description: 'Tax administration: Tax ID assignment, declarations, tax debt registry' },
  { id: 'a05', name: 'Road Police',                   sensitive: true,  dataClassification: 'confidential', role: 'registry', description: 'Vehicle registry, driver licenses, road permits' },
  { id: 'a06', name: 'Social Protection Ministry',    sensitive: false, dataClassification: 'confidential', role: 'registry', description: 'Pensions, disability benefits, child benefits, social assistance registry' },
  { id: 'a07', name: 'Health Registry (e-Health)',    sensitive: false, dataClassification: 'confidential', role: 'registry', description: 'Medical records, birth/death certificates, vaccination registry' },
  { id: 'a08', name: 'Police of Armenia',             sensitive: true,  dataClassification: 'secret',       role: 'registry', description: 'Criminal records, ID card registry, detention records, wanted persons' },
  { id: 'a09', name: 'Ministry of Foreign Affairs',   sensitive: false, dataClassification: 'confidential', role: 'registry', description: 'Passport registry, consular services, visa records' },
  { id: 'a10', name: 'Ministry of Justice',           sensitive: false, dataClassification: 'internal',     role: 'registry', description: 'Legal entity oversight, court registry, notary registry, penitentiary' },
  { id: 'a11', name: 'Ministry of Economy',           sensitive: false, dataClassification: 'internal',     role: 'registry', description: 'Business permits, trade licenses, investment registry' },

]; // 11 core base registries — each is an authoritative data owner and an ADEL node

export const INFRASTRUCTURE_ZONES = [
  { id: 'cloud_a', name: 'Public Cloud A',     type: 'cloud',  capacity: 11, description: 'Modern cloud infrastructure — scalable, cost-effective' },
  { id: 'cloud_b', name: 'Public Cloud B',     type: 'cloud',  capacity: 11, description: 'Redundant cloud infrastructure — disaster recovery ready' },
  { id: 'hybrid',  name: 'Hybrid Secure Zone', type: 'hybrid', capacity: 4,  description: 'For sensitive agencies — private cloud + dedicated security (Road Police and Police require this)' },
  { id: 'legacy',  name: 'Legacy Server Room', type: 'legacy', capacity: 2,  description: 'Existing on-premise — no migration needed but limited capability' },
]; // Total capacity 28 — enough for all 11 agencies

export const DATA_FIELDS = [
  {
    id: 'df01',
    ownerAgencyId: 'a01',
    category: 'Identity',
    label: 'Personal ID Number',
    description: 'The unique national identifier assigned to every citizen at birth by the Population Registry.',
    variants: ['PersonID', 'citizen_number', 'NationalID', 'ID_Number', 'nat_id'],
    standard: 'personal_identity_code',
  },
  {
    id: 'df02',
    ownerAgencyId: 'a02',
    category: 'Property',
    label: 'Cadastre Parcel Number',
    description: 'Unique identifier for a land parcel or real estate unit in the national cadastre register.',
    variants: ['CadastreNum', 'parcel_id', 'CadNum', 'land_code', 'cadastral_id'],
    standard: 'cadastral_parcel_identifier',
  },
  {
    id: 'df03',
    ownerAgencyId: 'a03',
    category: 'Business',
    label: 'Business Registration Number',
    description: 'Official identifier assigned to a legal entity upon registration in the State Business Registry.',
    variants: ['BizRegNum', 'company_id', 'OrgRegCode', 'HVHH', 'entity_reg_id'],
    standard: 'legal_entity_identifier',
  },
  {
    id: 'df04',
    ownerAgencyId: 'a04',
    category: 'Finance',
    label: 'Tax Identification Number',
    description: 'Unique tax account number issued by the Revenue Committee for individuals and entities.',
    variants: ['TaxID', 'TIN_am', 'HVHH_tax', 'taxpayer_code', 'fiscal_id'],
    standard: 'tax_identification_number',
  },
  {
    id: 'df05',
    ownerAgencyId: 'a05',
    category: 'Vehicle',
    label: 'Vehicle Registration Number',
    description: 'Official plate/registration identifier assigned to a motor vehicle by Road Police.',
    variants: ['PlateNum', 'vehicle_id', 'RegPlate', 'car_reg_num', 'veh_number'],
    standard: 'vehicle_registration_number',
  },
  {
    id: 'df06',
    ownerAgencyId: 'a06',
    category: 'Social',
    label: 'Social Insurance Number',
    description: 'Unique identifier for a citizen\'s social insurance account held by the Social Protection Ministry.',
    variants: ['SocInsNum', 'ssn_am', 'social_id', 'soc_acc_num', 'ins_number'],
    standard: 'social_insurance_number',
  },
  {
    id: 'df07',
    ownerAgencyId: 'a07',
    category: 'Health',
    label: 'Patient Identifier',
    description: 'Medical record identifier linking a citizen to their health history in e-Health systems.',
    variants: ['PatientID', 'med_rec_id', 'HealthID', 'pat_num', 'ehealth_id'],
    standard: 'patient_identifier_iso27799',
  },
  {
    id: 'df08',
    ownerAgencyId: 'a08',
    category: 'Identity',
    label: 'National ID Card Number',
    description: 'Document number on the national identity card issued and managed by the Police of Armenia.',
    variants: ['IDCardNum', 'id_doc_num', 'NatDocID', 'card_number', 'id_card_id'],
    standard: 'national_document_identifier',
  },
  {
    id: 'df09',
    ownerAgencyId: 'a09',
    category: 'Identity',
    label: 'Passport Number',
    description: 'Travel document identifier issued by the Ministry of Foreign Affairs per ICAO standards.',
    variants: ['PassportNum', 'pass_id', 'TravelDocNum', 'passport_no', 'intl_doc_id'],
    standard: 'travel_document_number_icao',
  },
  {
    id: 'df10',
    ownerAgencyId: 'a10',
    category: 'Legal',
    label: 'Court Case Number',
    description: 'Unique identifier for a legal proceeding registered in the Ministry of Justice court registry.',
    variants: ['CaseNum', 'court_case_id', 'LegalProcID', 'case_number', 'jud_ref'],
    standard: 'legal_proceeding_identifier',
  },
  {
    id: 'df11',
    ownerAgencyId: 'a11',
    category: 'Business',
    label: 'Business Permit Number',
    description: 'Regulatory permit identifier issued by the Ministry of Economy for licensed business activities.',
    variants: ['PermitNum', 'biz_permit_id', 'LicenseNum', 'reg_permit', 'econ_permit'],
    standard: 'regulatory_permit_identifier',
  },
];

// Circle layout: center (350, 240), radius 175, 11 nodes, starting at top (-90°)
// Nodes = the 11 core base registries — every other agency connects to at least one
export const ADEL_NODES = [
  { id: 'n01', name: 'Population Registry',   x: 350, y: 65,  agencyId: 'a01' },  // SPR — top (12 o'clock)
  { id: 'n02', name: 'Cadastre Committee',     x: 443, y: 93,  agencyId: 'a02' },
  { id: 'n03', name: 'Business Registry',      x: 507, y: 167, agencyId: 'a03' },
  { id: 'n04', name: 'Revenue Committee',      x: 520, y: 262, agencyId: 'a04' },
  { id: 'n05', name: 'Road Police',            x: 478, y: 352, agencyId: 'a05' },
  { id: 'n06', name: 'Social Protection',      x: 396, y: 405, agencyId: 'a06' },
  { id: 'n07', name: 'Health Registry',        x: 304, y: 405, agencyId: 'a07' },
  { id: 'n08', name: 'Police',                  x: 222, y: 352, agencyId: 'a08' },
  { id: 'n09', name: 'Foreign Affairs',        x: 180, y: 262, agencyId: 'a09' },
  { id: 'n10', name: 'Justice',               x: 193, y: 167, agencyId: 'a10' },
  { id: 'n11', name: 'Economy',               x: 257, y: 93,  agencyId: 'a11' },
];

// Direct peer-to-peer connections between base registries
// SPR (n01) is the anchor: 8 of 15 connections involve it — any service with personal data needs SPR
export const USEFUL_CONNECTIONS = [
  ['n01', 'n02'],  // SPR ↔ Cadastre: person → registered address
  ['n01', 'n03'],  // SPR ↔ Business Registry: person ↔ entity ownership / directorship
  ['n01', 'n04'],  // SPR ↔ Revenue: person → Tax ID assignment
  ['n01', 'n06'],  // SPR ↔ Social Protection: person → benefit eligibility
  ['n01', 'n07'],  // SPR ↔ Health Registry: person → medical record linkage
  ['n01', 'n08'],  // SPR ↔ Police: person ↔ criminal record / ID card
  ['n01', 'n09'],  // SPR ↔ Foreign Affairs: person ↔ passport data
  ['n01', 'n10'],  // SPR ↔ Justice: person ↔ legal proceedings
  ['n02', 'n04'],  // Cadastre ↔ Revenue: property → property tax
  ['n02', 'n10'],  // Cadastre ↔ Justice: property ↔ land title registry
  ['n03', 'n04'],  // Business ↔ Revenue: entity → corporate / VAT tax
  ['n03', 'n10'],  // Business ↔ Justice: entity → legal compliance & court data
  ['n04', 'n05'],  // Revenue ↔ Road Police: vehicle → vehicle tax
  ['n06', 'n07'],  // Social ↔ Health: disability benefits ↔ medical status
  ['n11', 'n03'],  // Economy ↔ Business Registry: business permits ↔ registry
];

export const SERVICE_TOOLS = [
  { id: 'st01', name: 'e-Identity Gateway',            category: 'Shared Service',   maxAdopters: 30, requiresEid: false, requiresAdel: true,                      deployOrder: 1, description: 'Unified authentication for all digital services',      cost: 3 },
  { id: 'st02', name: 'Digital Profile (My Data)',      category: 'Digital Profile',  maxAdopters: 24, requiresEid: true,  requiresAdel: true, minAdelConnections: 5, deployOrder: 2, description: 'Citizens access their data held by government',         cost: 3 },
  { id: 'st03', name: 'No-Code Service Builder',        category: 'No-Code Platform', maxAdopters: 22, requiresEid: false, requiresAdel: false,                     deployOrder: 1, description: 'Drag-and-drop form builder for agency services',         cost: 3 },
  { id: 'st04', name: 'Notification Engine',            category: 'Shared Service',   maxAdopters: 28, requiresEid: false, requiresAdel: false, requiresHub: true,    deployOrder: 2, description: 'Push notifications: SMS, email, in-app',                cost: 3 },
  { id: 'st05', name: 'Payment Gateway',                category: 'Shared Service',   maxAdopters: 26, requiresEid: false, requiresAdel: false,                     deployOrder: 1, description: 'Unified government payment processing',                   cost: 3 },
  { id: 'st06', name: 'e-Signature Service',            category: 'Shared Service',   maxAdopters: 18, requiresEid: true,  requiresAdel: false,                     deployOrder: 2, description: 'Legally binding digital signatures',                     cost: 3 },
  { id: 'st07', name: 'Analytics & BI Platform',        category: 'Shared Service',   maxAdopters: 15, requiresEid: false, requiresAdel: false, requiresMyData: true, deployOrder: 3, description: 'Cross-agency data analytics dashboard',                  cost: 3 },
  { id: 'st08', name: 'Service Registry',               category: 'Shared Service',   maxAdopters: 30, requiresEid: false, requiresAdel: false,                     deployOrder: 1, description: 'Central catalog of all government services',             cost: 3 },
  { id: 'st09', name: 'Document Vault',                 category: 'Digital Profile',  maxAdopters: 22, requiresEid: true,  requiresAdel: false,                     deployOrder: 2, description: 'Secure digital storage for citizen documents',           cost: 3 },
  { id: 'st10', name: 'Interoperability Sandbox',       category: 'No-Code Platform', maxAdopters: 12, requiresEid: false, requiresAdel: true,                      deployOrder: 2, description: 'Testing environment for agency integrations',            cost: 3 },
];

export const GOVERNMENT_SERVICES = [
  { id: 'gs01', name: 'Birth Registration', correctChannel: 'zero', hint: 'Hospital data feeds directly to Civil Registry via ADEL — no citizen action needed', requiresNotification: true, requiresEid: false },
  { id: 'gs02', name: 'Child Birth Benefit', correctChannel: 'zero', hint: 'Triggered automatically from birth registration — benefit deposited without application', requiresNotification: true, requiresEid: false },
  { id: 'gs03', name: 'Passport Renewal', correctChannel: 'portal', hint: 'Requires identity verification and physical document — portal with e-ID optimal', requiresNotification: false, requiresEid: true },
  { id: 'gs04', name: 'Tax Declaration', correctChannel: 'portal', hint: 'Complex form with document upload — web portal with e-signature is ideal', requiresNotification: false, requiresEid: true },
  { id: 'gs05', name: 'Driver License Renewal', correctChannel: 'mobile', hint: 'Frequent, routine action — mobile app with photo upload is optimal', requiresNotification: true, requiresEid: true },
  { id: 'gs06', name: 'Health Insurance Enrollment', correctChannel: 'portal', hint: 'Annual enrollment with document submission — portal workflow is most appropriate', requiresNotification: false, requiresEid: true },
  { id: 'gs07', name: 'Death Certificate', correctChannel: 'physical', hint: 'Legal requirement for in-person verification at this stage — cannot be automated yet', requiresNotification: false, requiresEid: false },
  { id: 'gs08', name: 'Business Registration', correctChannel: 'portal', hint: 'Multi-step process with legal documents — portal with e-signature is optimal', requiresNotification: false, requiresEid: true },
  { id: 'gs09', name: 'Utility Bill Payment', correctChannel: 'mobile', hint: 'Frequent small payments — mobile app is the preferred channel', requiresNotification: true, requiresEid: false },
  { id: 'gs10', name: 'Social Benefit Claim', correctChannel: 'zero', hint: 'Eligibility is computable from existing data — proactive benefit push is possible', requiresNotification: true, requiresEid: false },
  { id: 'gs11', name: 'Property Transfer', correctChannel: 'portal', hint: 'High-value transaction requiring identity verification — portal is optimal', requiresNotification: false, requiresEid: true },
  { id: 'gs12', name: 'Marriage Registration', correctChannel: 'physical', hint: 'Ceremony-based legal process — physical presence required by law', requiresNotification: false, requiresEid: false },
  { id: 'gs13', name: 'Pension Registration', correctChannel: 'zero', hint: 'Age and contribution data exists — automatic enrollment is possible', requiresNotification: true, requiresEid: false },
  { id: 'gs14', name: 'Building Permit', correctChannel: 'portal', hint: 'Complex multi-agency review — digital portal streamlines the process', requiresNotification: false, requiresEid: true },
  { id: 'gs15', name: 'Vehicle Registration', correctChannel: 'portal', hint: 'Document-heavy process — digital portal with payment integration is optimal', requiresNotification: false, requiresEid: true },
  { id: 'gs16', name: 'Education Enrollment', correctChannel: 'mobile', hint: 'Recurring annual action — mobile app is convenient for parents', requiresNotification: true, requiresEid: true },
];

export const LIFE_EVENTS = [
  {
    id: 'le01',
    name: 'Having a Baby',
    icon: '👶',
    agencies: ['a07', 'a01', 'a06', 'a10'],
    agencyNames: ['Health Registry → Population Registry → Social Protection Ministry → Ministry of Justice'],
    currentSteps: 11,
    targetSteps: 1,
    currentDays: 45,
    targetDays: 0,
    description: 'Birth notification, civil registration, child benefit, health card',
    // Hospital notifies SPR; SPR updates Social; SPR notifies Justice for civil registry
    requiredConnections: [['n01', 'n07'], ['n01', 'n06'], ['n01', 'n10']],
    requiredFields: ['df01', 'df07', 'df06'],
    requiredTools: ['st01', 'st04'],
    requiredChannel: 'gs01',
  },
  {
    id: 'le02',
    name: 'Getting Married',
    icon: '💍',
    agencies: ['a01', 'a10', 'a04', 'a06'],
    agencyNames: ['Population Registry → Ministry of Justice → Revenue Committee → Social Protection Ministry'],
    currentSteps: 8,
    targetSteps: 1,
    currentDays: 20,
    targetDays: 1,
    description: 'Civil registration, tax status update, benefit recalculation',
    // SPR registers civil status; Justice confirms; Revenue updates tax status; Social recalculates benefits
    requiredConnections: [['n01', 'n10'], ['n01', 'n04'], ['n01', 'n06']],
    requiredFields: ['df01', 'df10'],
    requiredTools: ['st01'],
    requiredChannel: 'gs12',
  },
  {
    id: 'le03',
    name: 'Starting a Business',
    icon: '🏢',
    agencies: ['a03', 'a04', 'a10', 'a11'],
    agencyNames: ['Business Registry → Revenue Committee → Ministry of Justice → Ministry of Economy'],
    currentSteps: 14,
    targetSteps: 2,
    currentDays: 30,
    targetDays: 1,
    description: 'Entity registration, tax registration, legal compliance check, permit',
    // Business Registry creates entity; Revenue assigns Tax ID; Justice confirms legal status; Economy issues permit
    requiredConnections: [['n03', 'n04'], ['n03', 'n10'], ['n11', 'n03']],
    requiredFields: ['df03', 'df04', 'df11'],
    requiredTools: ['st01', 'st05', 'st06'],
    requiredChannel: 'gs08',
  },
  {
    id: 'le04',
    name: 'Losing a Job',
    icon: '💼',
    agencies: ['a01', 'a06', 'a04'],
    agencyNames: ['Population Registry → Social Protection Ministry → Revenue Committee'],
    currentSteps: 9,
    targetSteps: 1,
    currentDays: 21,
    targetDays: 0,
    description: 'Unemployment benefit trigger, job seeker registration, tax status update',
    // SPR confirms identity; Social processes unemployment; Revenue updates tax; Employment registers as job seeker
    requiredConnections: [['n01', 'n06'], ['n01', 'n04'], ['n06', 'n07']],
    requiredFields: ['df01', 'df06'],
    requiredTools: ['st01', 'st04'],
    requiredChannel: 'gs10',
  },
  {
    id: 'le05',
    name: 'Moving to a New Address',
    icon: '🏠',
    agencies: ['a01', 'a02', 'a04', 'a08'],
    agencyNames: ['Population Registry → Cadastre Committee → Revenue Committee → Police of Armenia'],
    currentSteps: 7,
    targetSteps: 1,
    currentDays: 14,
    targetDays: 1,
    description: 'Address update propagated across all base registries',
    // Citizen updates SPR; Cadastre confirms address; Revenue updates tax address; Police updates ID
    requiredConnections: [['n01', 'n02'], ['n02', 'n04'], ['n01', 'n08']],
    requiredFields: ['df01', 'df02'],
    requiredTools: ['st01'],
    requiredChannel: 'gs03',
  },
  {
    id: 'le06',
    name: 'Retiring',
    icon: '🎯',
    agencies: ['a06', 'a04', 'a01', 'a07'],
    agencyNames: ['Social Protection Ministry → Revenue Committee → Population Registry → Health Registry'],
    currentSteps: 10,
    targetSteps: 1,
    currentDays: 60,
    targetDays: 0,
    description: 'Pension enrollment, contribution verification, tax status change',
    // Social reads contribution history from Revenue; SPR confirms identity; Health confirms no disability conflict
    requiredConnections: [['n01', 'n06'], ['n01', 'n04'], ['n06', 'n07']],
    requiredFields: ['df01', 'df06', 'df04'],
    requiredTools: ['st01', 'st04'],
    requiredChannel: 'gs13',
  },
  {
    id: 'le07',
    name: 'Death in the Family',
    icon: '🕯️',
    agencies: ['a07', 'a01', 'a02', 'a04'],
    agencyNames: ['Health Registry → Population Registry → Cadastre Committee → Revenue Committee'],
    currentSteps: 12,
    targetSteps: 2,
    currentDays: 90,
    targetDays: 7,
    description: 'Death certificate, deregistration, property transfer, estate tax',
    // Health issues death cert; SPR deregisters person; Cadastre transfers property; Revenue closes tax account
    requiredConnections: [['n01', 'n07'], ['n01', 'n02'], ['n02', 'n10'], ['n01', 'n04']],
    requiredFields: ['df01', 'df02', 'df04'],
    requiredTools: ['st01', 'st06'],
    requiredChannel: 'gs07',
  },
  {
    id: 'le08',
    name: 'Applying for a Building Permit',
    icon: '🏗️',
    agencies: ['a02', 'a11', 'a04', 'a01'],
    agencyNames: ['Cadastre Committee → Ministry of Economy → Revenue Committee → Population Registry'],
    currentSteps: 16,
    targetSteps: 3,
    currentDays: 120,
    targetDays: 14,
    description: 'Property ownership check, permit issuance, fee payment, SPR owner verification',
    // Cadastre confirms property ownership; Economy issues permit; Revenue collects fee; SPR verifies owner identity
    requiredConnections: [['n02', 'n10'], ['n01', 'n04'], ['n11', 'n03']],
    requiredFields: ['df02', 'df04', 'df11'],
    requiredTools: ['st05', 'st06'],
    requiredChannel: 'gs14',
  },
];

export const LAWS = [
  {
    id: 'law01',
    name: 'Population Register Law',
    shortName: 'Pop. Register',
    icon: '📋',
    description: 'Establishes the Population Register as the authoritative source for identity data. All agencies must use the Register as the single source of truth.',
    effect: 'Makes all aligned data fields "authoritative." Reduces duplicate records by 80. Data Layer aligned fields now show green (authoritative) instead of yellow.',
    dependentLayer: 'dataLayer',
    dependentThreshold: 50,
    impactArea: 'Data Layer',
  },
  {
    id: 'law02',
    name: 'Digital Identity Law',
    shortName: 'Digital ID',
    icon: '🪪',
    description: 'Makes e-ID legally binding for all government services. Private sector may use government e-ID for their services. Establishes liability framework for identity verification.',
    effect: 'e-ID adoption gets 2x multiplier. Unlocks private sector e-ID usage. Application Services adoption speeds up.',
    dependentLayer: 'appServices',
    dependentThreshold: 40,
    impactArea: 'Application Services',
  },
  {
    id: 'law03',
    name: 'Cybersecurity Law',
    shortName: 'Cybersecurity',
    icon: '🛡️',
    description: 'Establishes CSIRT/CERT Armenia. Mandates security standards for all government digital systems. Creates incident response protocols.',
    effect: 'Activates CSIRT/CERT (blocks threat events). Increases Trust Index by 10 points. ADEL connections get security certification.',
    dependentLayer: 'infrastructure',
    dependentThreshold: 60,
    impactArea: 'Infrastructure',
  },
  {
    id: 'law04',
    name: 'Public Information Law',
    shortName: 'Public Info',
    icon: '📢',
    description: 'Makes Data Catalog registration mandatory for all government data. Enables open data publication. Citizens have the right to know what data the government holds about them.',
    effect: 'Data Catalog registration becomes mandatory. Open data portal activated. My Data Portal citizen access enabled.',
    dependentLayer: 'dataLayer',
    dependentThreshold: 50,
    impactArea: 'Data Layer',
  },
];
