/**
 * AAMVA Document Control File (DCF) Generator
 * Ported from aam-project/src/lib/aamva/dcf-generator.ts
 * Vanilla JS — no TypeScript, no imports
 */

const DCF_FORMATS = {
  CA: { length: 20, description: 'CA: 20 alphanumeric chars' },
  NY: { length: 25, description: 'NY: 25 chars' },
  TX: { length: 20, description: 'TX: 20 chars' },
  FL: { length: 15, description: 'FL: 15 chars' },
  NC: { length: 22, description: 'NC: NCD1TL02XXXXXXXXXX' },
  VA: { length: 15, description: 'VA: 15 chars' },
  MD: { length: 25, description: 'MD: 25 chars' },
  DEFAULT: { length: 20, description: 'Default: 20 alphanumeric chars' },
};

function getDCFFormat(stateCode) {
  return DCF_FORMATS[stateCode] || DCF_FORMATS.DEFAULT;
}

function rndAlphaNumDCF(n) {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let r = '';
  for (let i = 0; i < n; i++) r += c[Math.floor(Math.random() * c.length)];
  return r;
}

function generateDCF(stateCode) {
  switch (stateCode) {
    case 'CA': return rndAlphaNumDCF(20);
    case 'NY': return rndAlphaNumDCF(25);
    case 'TX': return rndAlphaNumDCF(20);
    case 'FL': return rndAlphaNumDCF(15);
    case 'NC': return 'NCD1TL02' + rndAlphaNumDCF(14);
    case 'VA': return rndAlphaNumDCF(15);
    case 'MD': return rndAlphaNumDCF(25);
    default:   return rndAlphaNumDCF(20);
  }
}
