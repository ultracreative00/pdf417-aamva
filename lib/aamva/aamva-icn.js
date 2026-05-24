/**
 * AAMVA Inventory Control Number (ICN / DCK) Generator
 * Ported from aam-project/src/lib/aamva/icn-generator.ts
 * Vanilla JS — no TypeScript, no imports
 */

function rndDigitICN(n) { let r=''; for(let i=0;i<n;i++) r+=Math.floor(Math.random()*10); return r; }
function rndAlphaICN(n) { const c='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; let r=''; for(let i=0;i<n;i++) r+=c[Math.floor(Math.random()*c.length)]; return r; }
function rndAlphaNumICN(n) { const c='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let r=''; for(let i=0;i<n;i++) r+=c[Math.floor(Math.random()*c.length)]; return r; }

function getICNFormat(stateCode) {
  const formats = {
    CA: 'IIN(6) + DLNumber + random(7)',
    NC: 'IIN(6) + DLNumber + random(6)',
    NY: 'IIN(6) + random(14)',
    TX: 'IIN(6) + DLNumber + random(6)',
    VA: 'IIN(6) + DLNumber + random(7)',
    DEFAULT: 'IIN(6) + random(14)',
  };
  return formats[stateCode] || formats.DEFAULT;
}

function generateICN(stateCode, dlNumber, iin) {
  const safeIIN = iin || '636000';
  const safeDL  = (dlNumber || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();

  switch (stateCode) {
    case 'CA': return safeIIN + safeDL + rndDigitICN(7);
    case 'NC': return safeIIN + safeDL.padEnd(12, '0').slice(0, 12) + rndDigitICN(6);
    case 'NY': return safeIIN + rndAlphaNumICN(14);
    case 'TX': return safeIIN + safeDL + rndDigitICN(6);
    case 'VA': return safeIIN + safeDL + rndDigitICN(7);
    case 'FL': return safeIIN + safeDL + rndDigitICN(6);
    case 'MD': return safeIIN + safeDL + rndDigitICN(8);
    case 'AZ': return safeIIN + safeDL + rndDigitICN(7);
    case 'CO': return safeIIN + safeDL + rndDigitICN(7);
    case 'CT': return safeIIN + safeDL + rndDigitICN(7);
    case 'NV': return safeIIN + safeDL + rndDigitICN(7);
    case 'GA': return safeIIN + safeDL + rndDigitICN(6);
    default:   return safeIIN + rndAlphaNumICN(14);
  }
}
