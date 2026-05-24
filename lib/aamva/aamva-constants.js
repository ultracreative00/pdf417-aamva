/**
 * AAMVA Constants — IINs, Field Codes, Options
 * Ported from aam-project/src/lib/aamva/constants.ts
 * Vanilla JS — no TypeScript, no imports
 */

const STATE_CONFIGS = [
  { code: 'AL', name: 'Alabama',              iin: '636033', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'AK', name: 'Alaska',               iin: '636059', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'AZ', name: 'Arizona',              iin: '636026', aamvaVersion: '08', jurisdictionVersion: '01' },
  { code: 'AR', name: 'Arkansas',             iin: '636021', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'CA', name: 'California',           iin: '636014', aamvaVersion: '09', jurisdictionVersion: '01' },
  { code: 'CO', name: 'Colorado',             iin: '636020', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'CT', name: 'Connecticut',          iin: '636006', aamvaVersion: '09', jurisdictionVersion: '01' },
  { code: 'DE', name: 'Delaware',             iin: '636011', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'DC', name: 'District of Columbia', iin: '636043', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'FL', name: 'Florida',              iin: '636010', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'GA', name: 'Georgia',              iin: '636055', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'HI', name: 'Hawaii',               iin: '636047', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'ID', name: 'Idaho',                iin: '636050', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'IL', name: 'Illinois',             iin: '636035', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'IN', name: 'Indiana',              iin: '636037', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'IA', name: 'Iowa',                 iin: '636018', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'KS', name: 'Kansas',               iin: '636022', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'KY', name: 'Kentucky',             iin: '636046', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'LA', name: 'Louisiana',            iin: '636007', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'ME', name: 'Maine',                iin: '636041', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'MD', name: 'Maryland',             iin: '636003', aamvaVersion: '09', jurisdictionVersion: '01' },
  { code: 'MA', name: 'Massachusetts',        iin: '636002', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'MI', name: 'Michigan',             iin: '636032', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'MN', name: 'Minnesota',            iin: '636038', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'MS', name: 'Mississippi',          iin: '636051', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'MO', name: 'Missouri',             iin: '636030', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'MT', name: 'Montana',              iin: '636008', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'NE', name: 'Nebraska',             iin: '636054', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'NV', name: 'Nevada',               iin: '636049', aamvaVersion: '09', jurisdictionVersion: '01' },
  { code: 'NH', name: 'New Hampshire',        iin: '636039', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'NJ', name: 'New Jersey',           iin: '636036', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'NM', name: 'New Mexico',           iin: '636009', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'NY', name: 'New York',             iin: '636001', aamvaVersion: '09', jurisdictionVersion: '01' },
  { code: 'NC', name: 'North Carolina',       iin: '636004', aamvaVersion: '08', jurisdictionVersion: '00' },
  { code: 'ND', name: 'North Dakota',         iin: '636034', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'OH', name: 'Ohio',                 iin: '636023', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'OK', name: 'Oklahoma',             iin: '636058', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'OR', name: 'Oregon',               iin: '636029', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'PA', name: 'Pennsylvania',         iin: '636025', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'RI', name: 'Rhode Island',         iin: '636052', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'SC', name: 'South Carolina',       iin: '636005', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'SD', name: 'South Dakota',         iin: '636042', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'TN', name: 'Tennessee',            iin: '636053', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'TX', name: 'Texas',                iin: '636015', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'UT', name: 'Utah',                 iin: '636040', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'VT', name: 'Vermont',              iin: '636024', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'VA', name: 'Virginia',             iin: '636000', aamvaVersion: '09', jurisdictionVersion: '01' },
  { code: 'WA', name: 'Washington',           iin: '636045', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'WV', name: 'West Virginia',        iin: '636061', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'WI', name: 'Wisconsin',            iin: '636031', aamvaVersion: '10', jurisdictionVersion: '01' },
  { code: 'WY', name: 'Wyoming',              iin: '636060', aamvaVersion: '10', jurisdictionVersion: '01' },
];

function getStateConfig(code) {
  return STATE_CONFIGS.find(s => s.code === code) || null;
}

function getStateRevisions(code) {
  return STATE_REVISIONS[code] || [];
}

const POSTAL_PAD_OVERRIDE = { NC: 13 };

const ZN_STATES = ['NC', 'NY', 'NV'];

const STATE_REVISIONS = {
  CA: [
    { date: '08/29/2017', label: 'Rev. 2017.08.29 — Current Design' },
    { date: '01/02/2014', label: 'Rev. 2014.01.02 — Previous Design' },
    { date: '09/22/2010', label: 'Rev. 2010.09.22 — Older Design' },
  ],
  NY: [
    { date: '10/20/2017', label: 'Rev. 2017.10.20 — V2.0 Current Design' },
    { date: '08/31/2014', label: 'Rev. 2014.08.31 — V1.0 Previous Design' },
    { date: '01/01/2010', label: 'Rev. 2010.01.01 — Legacy Design' },
  ],
  TX: [
    { date: '10/20/2016', label: 'Rev. 2016.10.20 — Current Design' },
    { date: '09/01/2014', label: 'Rev. 2014.09.01 — Previous Design' },
  ],
  FL: [
    { date: '01/01/2017', label: 'Rev. 2017.01.01 — Current Design' },
    { date: '07/01/2013', label: 'Rev. 2013.07.01 — Previous Design' },
  ],
  IL: [{ date: '01/01/2016', label: 'Rev. 2016.01.01 — Current Design' }],
  VA: [
    { date: '06/06/2018', label: 'Rev. 2018.06.06 — V2.0 Current Design' },
    { date: '01/01/2014', label: 'Rev. 2014.01.01 — V1.0 Previous Design' },
    { date: '03/01/2009', label: 'Rev. 2009.03.01 — Legacy Design' },
  ],
  PA: [{ date: '09/01/2017', label: 'Rev. 2017.09.01 — Current Design' }],
  OH: [{ date: '07/02/2018', label: 'Rev. 2018.07.02 — Current Design' }],
  GA: [{ date: '07/01/2012', label: 'Rev. 2012.07.01 — Current Design' }],
  NJ: [{ date: '06/01/2017', label: 'Rev. 2017.06.01 — Current Design' }],
  MI: [{ date: '10/01/2017', label: 'Rev. 2017.10.01 — Current Design' }],
  NC: [
    { date: '08/01/2017', label: 'Rev. 2017.08.01 — Current Design' },
    { date: '10/24/2014', label: 'Rev. 2014.10.24 — Previous Design' },
  ],
  WA: [
    { date: '02/18/2025', label: 'Rev. 02/18/2025 — Real ID Gold Star' },
    { date: '07/01/2018', label: 'Rev. 2018.07.01 — Previous Design' },
  ],
  AZ: [
    { date: '10/01/2016', label: 'Rev. 2016.10.01 — Current Design' },
    { date: '02/14/2014', label: 'Rev. 2014.02.14 — Previous Design' },
  ],
  MD: [
    { date: '06/01/2018', label: 'Rev. 2018.06.01 — Current Design' },
    { date: '01/01/2016', label: 'Rev. 2016.01.01 — Previous Design' },
  ],
  CO: [{ date: '11/01/2016', label: 'Rev. 2016.11.01 — Current Design' }],
  CT: [
    { date: '01/01/2017', label: 'Rev. 2017.01.01 — Current' },
    { date: '06/01/2014', label: 'Rev. 2014.06.01 — Standard' },
    { date: '01/01/2012', label: 'Rev. 2012.01.01 — Alt' },
  ],
  NV: [
    { date: '10/01/2020', label: 'Rev. 2020.10.01 — Current Design' },
    { date: '01/01/2014', label: 'Rev. 2014.01.01 — Previous Design' },
  ],
};

const EYE_COLORS = [
  { value: 'BLK', label: 'Black (BLK)' },
  { value: 'BLU', label: 'Blue (BLU)' },
  { value: 'BRO', label: 'Brown (BRO)' },
  { value: 'GRY', label: 'Gray (GRY)' },
  { value: 'GRN', label: 'Green (GRN)' },
  { value: 'HAZ', label: 'Hazel (HAZ)' },
  { value: 'MAR', label: 'Maroon (MAR)' },
  { value: 'PNK', label: 'Pink (PNK)' },
  { value: 'DIC', label: 'Dichromatic (DIC)' },
  { value: 'UNK', label: 'Unknown (UNK)' },
];

const HAIR_COLORS = [
  { value: 'BAL', label: 'Bald (BAL)' },
  { value: 'BLK', label: 'Black (BLK)' },
  { value: 'BLN', label: 'Blond (BLN)' },
  { value: 'BRO', label: 'Brown (BRO)' },
  { value: 'GRY', label: 'Gray (GRY)' },
  { value: 'RED', label: 'Red (RED)' },
  { value: 'AUB', label: 'Auburn (AUB)' },
  { value: 'SDY', label: 'Sandy (SDY)' },
  { value: 'WHI', label: 'White (WHI)' },
  { value: 'UNK', label: 'Unknown (UNK)' },
];

const GENDER_OPTIONS = [
  { value: '1', label: 'Male' },
  { value: '2', label: 'Female' },
  { value: '9', label: 'Not Specified' },
];

const SUFFIX_OPTIONS = [
  { value: '',    label: 'None' },
  { value: 'JR',  label: 'Junior (JR)' },
  { value: 'SR',  label: 'Senior (SR)' },
  { value: 'I',   label: 'First (I)' },
  { value: 'II',  label: 'Second (II)' },
  { value: 'III', label: 'Third (III)' },
  { value: 'IV',  label: 'Fourth (IV)' },
  { value: 'V',   label: 'Fifth (V)' },
];

const COUNTRY_OPTIONS = [
  { value: 'USA', label: 'United States (USA)' },
  { value: 'CAN', label: 'Canada (CAN)' },
  { value: 'MEX', label: 'Mexico (MEX)' },
];

function rndDigit(n) { let r=''; for(let i=0;i<n;i++) r+=Math.floor(Math.random()*10); return r; }
function rndAlpha(n) { const c='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; let r=''; for(let i=0;i<n;i++) r+=c[Math.floor(Math.random()*c.length)]; return r; }
function rndAlphaNum(n) { const c='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let r=''; for(let i=0;i<n;i++) r+=c[Math.floor(Math.random()*c.length)]; return r; }

const DL_NUMBER_PATTERNS = {
  WA: { generate: () => 'WDL' + rndAlphaNum(5) + rndDigit(2) + rndAlpha(1) + rndDigit(1) },
  CA: { generate: () => rndAlpha(1) + rndDigit(7) },
  TX: { generate: () => rndDigit(8) },
  FL: { generate: () => rndAlpha(1) + rndDigit(12) },
  NY: { generate: () => rndDigit(9) },
  IL: { generate: () => rndAlpha(1) + rndDigit(11) },
  PA: { generate: () => rndDigit(8) },
  OH: { generate: () => rndAlpha(2) + rndDigit(6) },
  GA: { generate: () => rndDigit(9) },
  NC: { generate: () => rndDigit(12) },
  NJ: { generate: () => rndAlpha(1) + rndDigit(14) },
  VA: { generate: () => rndAlpha(1) + rndDigit(8) },
  MI: { generate: () => rndAlpha(1) + rndDigit(12) },
  AZ: { generate: () => rndAlpha(1) + rndDigit(8) },
  CO: { generate: () => rndDigit(9) },
  MD: { generate: () => rndDigit(10) },
  CT: { generate: () => rndDigit(11) },
  NV: { generate: () => rndDigit(10) },
};

function generateDLNumber(stateCode) {
  const p = DL_NUMBER_PATTERNS[stateCode];
  return p ? p.generate() : rndDigit(9);
}

const FORM_FIELDS = [
  { key: 'DCS', label: 'Last Name', type: 'text', required: true, placeholder: 'SMITH', maxLength: 40 },
  { key: 'DAC', label: 'First Name', type: 'text', required: true, placeholder: 'JOHN', maxLength: 40 },
  { key: 'DAD', label: 'Middle Name', type: 'text', required: false, placeholder: 'MICHAEL', maxLength: 40 },
  { key: 'DDE', label: 'Last Name Truncated', type: 'select', required: false, options: [
    { value: 'N', label: 'N — Not truncated' }, { value: 'T', label: 'T — Truncated' }, { value: 'U', label: 'U — Unknown' }
  ]},
  { key: 'DDF', label: 'First Name Truncated', type: 'select', required: false, options: [
    { value: 'N', label: 'N — Not truncated' }, { value: 'T', label: 'T — Truncated' }, { value: 'U', label: 'U — Unknown' }
  ]},
  { key: 'DDG', label: 'Middle Name Truncated', type: 'select', required: false, options: [
    { value: 'N', label: 'N — Not truncated' }, { value: 'T', label: 'T — Truncated' }, { value: 'U', label: 'U — Unknown' }
  ]},
  { key: 'DBB', label: 'Date of Birth', type: 'text', required: true, placeholder: '01/15/1990', helpText: 'MM/DD/YYYY', maxLength: 10 },
  { key: 'DBC', label: 'Sex', type: 'select', required: true, options: GENDER_OPTIONS },
  { key: 'DAY', label: 'Eye Color', type: 'select', required: true, options: EYE_COLORS },
  { key: 'DAZ', label: 'Hair Color', type: 'select', required: false, options: HAIR_COLORS },
  { key: 'DAU', label: 'Height (inches)', type: 'text', required: true, placeholder: '068', helpText: "Total inches, e.g. 068 = 5'08\"", maxLength: 3 },
  { key: 'DAW', label: 'Weight (lbs)', type: 'text', required: false, placeholder: '165', maxLength: 3 },
  { key: 'DCL', label: 'Race / Ethnicity', type: 'select', required: false, options: [
    { value: 'AI', label: 'AI — American Indian' }, { value: 'AP', label: 'AP — Asian/Pacific Islander' },
    { value: 'BK', label: 'BK — Black' }, { value: 'H', label: 'H — Hispanic' },
    { value: 'O', label: 'O — Non-Hispanic' }, { value: 'U', label: 'U — Unknown' }, { value: 'W', label: 'W — White' },
  ]},
  { key: 'DBN', label: 'Name Suffix', type: 'select', required: false, options: SUFFIX_OPTIONS },
  { key: 'DAG', label: 'Street Address', type: 'text', required: true, placeholder: '123 MAIN ST', maxLength: 50, fullWidth: true },
  { key: 'DAH', label: 'Address Line 2', type: 'text', required: false, placeholder: 'APT 4B', maxLength: 40, fullWidth: true },
  { key: 'DAI', label: 'City', type: 'text', required: true, placeholder: 'ANYTOWN', maxLength: 30 },
  { key: 'DAK', label: 'ZIP Code', type: 'text', required: true, placeholder: '123450000', helpText: '5 or 9 digits', maxLength: 9 },
  { key: 'DAQ', label: 'License Number', type: 'text', required: true, placeholder: 'A1234567', maxLength: 25 },
  { key: 'DBA', label: 'Expiration Date', type: 'text', required: true, placeholder: '01/15/2029', helpText: 'MM/DD/YYYY', maxLength: 10 },
  { key: 'DBD', label: 'Issue Date', type: 'text', required: true, placeholder: '01/15/2025', helpText: 'MM/DD/YYYY', maxLength: 10 },
  { key: 'DCA', label: 'Vehicle Class', type: 'text', required: false, placeholder: 'C', maxLength: 6 },
  { key: 'DCB', label: 'Restrictions', type: 'text', required: false, placeholder: 'NONE', maxLength: 12 },
  { key: 'DCD', label: 'Endorsements', type: 'text', required: false, placeholder: 'NONE', maxLength: 5 },
  { key: 'DCF', label: 'Document Discriminator', type: 'text', required: false, placeholder: 'Auto-generated', maxLength: 25, fullWidth: true },
  { key: 'DCG', label: 'Country', type: 'select', required: false, options: COUNTRY_OPTIONS },
  { key: 'DCK', label: 'Inventory Control Number', type: 'text', required: false, placeholder: 'Auto-generated', maxLength: 25, fullWidth: true },
  { key: 'DDA', label: 'Compliance Type', type: 'select', required: false, options: [
    { value: 'F', label: 'F — Compliant' }, { value: 'N', label: 'N — Non-compliant' }
  ]},
  { key: 'DDB', label: 'Card Revision Date', type: 'text', required: false, placeholder: 'Auto-filled from state', helpText: 'MM/DD/YYYY', maxLength: 10 },
  { key: 'DDK', label: 'Organ Donor', type: 'select', required: false, options: [
    { value: '', label: 'No' }, { value: '1', label: 'Yes' }
  ]},
  { key: 'DDL', label: 'Veteran', type: 'select', required: false, options: [
    { value: '', label: 'No' }, { value: '1', label: 'Yes' }
  ]},
  { key: 'DDD', label: 'Limited Duration Document', type: 'select', required: false, options: [
    { value: '', label: 'No' }, { value: '1', label: 'Yes' }
  ]},
  { key: 'DDO', label: 'Enhanced Credential', type: 'select', required: false, options: [
    { value: '', label: 'No' }, { value: '1', label: 'Yes' }
  ]},
];
