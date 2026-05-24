/**
 * AAMVA PDF417 String Encoder
 * Ported from aam-project/src/lib/aamva/encoder.ts
 * Vanilla JS — no TypeScript, no imports
 *
 * Binary encoding: raw control chars via \x escape sequences
 *   LF = 0x0A, RS = 0x1E, CR = 0x0D
 * NOT tilde-escaped — pdf417.js handles these as byte compaction natively.
 */

// Binary control characters — raw bytes, NOT tilde-escaped
const LF = '\x0A';  // Line Feed   0x0A
const RS = '\x1E';  // Record Sep  0x1E
const CR = '\x0D';  // Carriage Rt 0x0D

function formatDateToAAMVA(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr.replace(/\//g, '');
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    return m + d + y;
  }
  return dateStr;
}

function formatHeight(height) {
  const num = String(height).replace(/[^0-9]/g, '');
  return num.padStart(3, '0') + ' in';
}

function formatPostalCode(zip, stateCode) {
  let clean = String(zip).replace(/[^0-9]/g, '');
  if (clean.length === 5) clean = clean + '0000';
  const padLength = (POSTAL_PAD_OVERRIDE[stateCode]) || 11;
  return clean.padEnd(padLength, ' ');
}

const V09_HAIR_MAP = { 'AUB': 'RED' };
const V09_EYE_MAP  = { 'BRN': 'BRO' };

const STATE_JURISDICTION_PREFIX = {
  CA: 'ZC', NY: 'ZN', TX: 'ZT', FL: 'ZF', IL: 'ZI',
  PA: 'ZP', VA: 'ZV', CO: 'ZO', AZ: 'ZA', MD: 'ZM',
  NC: 'ZN', GA: 'ZG', MI: 'ZM', SC: 'ZS', NV: 'ZN',
  WA: 'ZW', OR: 'ZO', OH: 'ZO', NJ: 'ZJ', IN: 'ZI',
  MO: 'ZM', TN: 'ZT', WI: 'ZW', CT: 'ZC',
};

function getJurisdictionType(stateCode) {
  return STATE_JURISDICTION_PREFIX[stateCode] || ('Z' + stateCode.charAt(0));
}

function buildCaliforniaSubfile(data) {
  return ['ZCA' + (data.DAY || ''), 'ZCB' + (data.DAZ || ''), 'ZCC', 'ZCD'].join(LF) + CR;
}

function buildZNSubfile(data) {
  const zna = data.ZNA !== undefined ? data.ZNA : '';
  const znb = data.ZNB !== undefined ? data.ZNB : '';
  const znc = data.ZNC !== undefined ? data.ZNC : '0';
  const znd = data.ZND !== undefined ? data.ZND : 'N';
  return ['ZNA' + zna, 'ZNB' + znb, 'ZNC' + znc, 'ZND' + znd].join(LF) + CR;
}

function buildGenericJurisdictionSubfile(data, zPrefix) {
  const jData = data.jurisdictionData;
  if (!jData) return null;
  const fields = Object.entries(jData)
    .filter(([code]) => code.startsWith(zPrefix))
    .sort(([a], [b]) => a.localeCompare(b));
  if (fields.length === 0) return null;
  return fields.map(([code, value]) => code + value).join(LF) + CR;
}

const JURISDICTION_BUILDERS = {
  CA: buildCaliforniaSubfile,
  NC: buildZNSubfile,
  NY: buildZNSubfile,
  NV: buildZNSubfile,
};

function buildJurisdictionSubfile(data, stateCode) {
  const jType = getJurisdictionType(stateCode);
  if (JURISDICTION_BUILDERS[stateCode]) {
    return { type: jType, content: JURISDICTION_BUILDERS[stateCode](data) };
  }
  const content = buildGenericJurisdictionSubfile(data, jType);
  if (!content) return null;
  return { type: jType, content };
}

function encodeAAMVA(data, stateCode, versionOverride) {
  const stateConfig = getStateConfig(stateCode);
  if (!stateConfig) throw new Error('Unknown state: ' + stateCode);

  const version = versionOverride || stateConfig.aamvaVersion;
  const isV09 = version <= '09';

  let dlEyeColor = data.DAY || 'BRO';
  if (isV09 && V09_EYE_MAP[dlEyeColor]) dlEyeColor = V09_EYE_MAP[dlEyeColor];

  let dlHairColor = data.DAZ || '';
  if (isV09 && dlHairColor && V09_HAIR_MAP[dlHairColor]) dlHairColor = V09_HAIR_MAP[dlHairColor];

  const jurisdictionCode = (data.DAJ && data.DAJ.trim()) ? data.DAJ.trim().toUpperCase() : stateCode;
  const country = (data.DCG && data.DCG.trim()) ? data.DCG.trim().toUpperCase() : 'USA';

  const elements = [];
  elements.push('DAQ' + data.DAQ.toUpperCase());
  elements.push('DCS' + data.DCS.toUpperCase().replace(/\s+/g, ''));
  elements.push('DDE' + (data.DDE || 'N'));
  elements.push('DAC' + data.DAC.toUpperCase().replace(/\s+/g, ''));
  elements.push('DDF' + (data.DDF || 'N'));
  elements.push('DAD' + (data.DAD || '').toUpperCase().replace(/\s+/g, ''));
  elements.push('DDG' + (data.DDG || 'N'));
  if (data.DCA) elements.push('DCA' + data.DCA.toUpperCase());
  if (data.DCB) elements.push('DCB' + data.DCB.toUpperCase());
  if (data.DCD) elements.push('DCD' + data.DCD.toUpperCase());
  elements.push('DBD' + formatDateToAAMVA(data.DBD));
  elements.push('DBB' + formatDateToAAMVA(data.DBB));
  elements.push('DBA' + formatDateToAAMVA(data.DBA));
  elements.push('DBC' + data.DBC);
  elements.push('DAU' + formatHeight(data.DAU));
  elements.push('DAY' + dlEyeColor);
  elements.push('DAG' + data.DAG.toUpperCase());
  if (data.DAH) elements.push('DAH' + data.DAH.toUpperCase());
  elements.push('DAI' + data.DAI.toUpperCase());
  elements.push('DAJ' + jurisdictionCode);
  elements.push('DAK' + formatPostalCode(data.DAK, stateCode));
  elements.push('DCF' + (data.DCF || ''));
  elements.push('DCG' + country);
  if (data.DAW) elements.push('DAW' + String(data.DAW).padStart(3, '0'));
  if (dlHairColor) elements.push('DAZ' + dlHairColor);
  if (data.DCL) elements.push('DCL' + data.DCL);
  if (data.DCK) elements.push('DCK' + data.DCK);
  elements.push('DDA' + (data.DDA || 'F'));
  if (data.DDB) elements.push('DDB' + formatDateToAAMVA(data.DDB));
  if (data.DDJ) elements.push('DDJ' + formatDateToAAMVA(data.DDJ));
  if (data.DDD === '1') elements.push('DDD' + data.DDD);
  if (data.DDK === '1') elements.push('DDK' + data.DDK);
  if (data.DDL === '1') elements.push('DDL' + data.DDL);
  if (data.DDM === '1') elements.push('DDM' + data.DDM);
  if (data.DDN === '1') elements.push('DDN' + data.DDN);
  if (data.DDO === '1') elements.push('DDO' + data.DDO);
  if (data.DDP === '1') elements.push('DDP' + data.DDP);
  if (data.DBN) elements.push('DBN' + data.DBN.toUpperCase());

  const dlData = elements.join(LF) + CR;

  const jurisdictionResult = buildJurisdictionSubfile(data, stateCode);
  const hasJurisdiction = !!jurisdictionResult;
  const numEntries = hasJurisdiction ? 2 : 1;

  const headerSize = 21 + (10 * numEntries);

  const dlSubfile = 'DL' + dlData;
  const dlOffset  = headerSize;
  const dlLength  = dlSubfile.length;

  let jSubfile = '', jOffset = 0, jLength = 0;
  if (hasJurisdiction) {
    jSubfile = jurisdictionResult.type + jurisdictionResult.content;
    jOffset  = dlOffset + dlLength;
    jLength  = jSubfile.length;
  }

  const header = '@' + LF + RS + CR
    + 'ANSI '
    + stateConfig.iin
    + String(version).padStart(2, '0')
    + String(stateConfig.jurisdictionVersion).padStart(2, '0')
    + String(numEntries).padStart(2, '0')
    + 'DL'
    + String(dlOffset).padStart(4, '0')
    + String(dlLength).padStart(4, '0')
    + (hasJurisdiction
        ? jurisdictionResult.type
          + String(jOffset).padStart(4, '0')
          + String(jLength).padStart(4, '0')
        : '');

  let result = header + dlSubfile;
  if (hasJurisdiction) result += jSubfile;
  return result;
}

function createEmptyAAMVAData(stateCode) {
  return {
    DCS: '', DAC: '', DAD: '',
    DBB: '', DBC: '1',
    DAY: 'BRO', DAU: '',
    DAG: '', DAI: '',
    DAJ: stateCode, DAK: '',
    DAQ: '', DBA: '', DBD: '',
    DCF: '', DCG: 'USA',
    DDE: 'N', DDF: 'N', DDG: 'N',
    DDA: 'F',
  };
}
