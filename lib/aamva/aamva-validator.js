/**
 * AAMVA Data Validator
 * Ported from aam-project/src/lib/aamva/validator.ts
 * Vanilla JS — no TypeScript, no imports
 */

function validateAAMVAData(data) {
  const errors = [];

  if (!data.DCS || !data.DCS.trim())
    errors.push({ field: 'DCS', message: 'Last name is required' });

  if (!data.DAC || !data.DAC.trim())
    errors.push({ field: 'DAC', message: 'First name is required' });

  if (!data.DBB || !data.DBB.trim())
    errors.push({ field: 'DBB', message: 'Date of birth is required' });
  else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.DBB))
    errors.push({ field: 'DBB', message: 'Date of birth must be MM/DD/YYYY' });

  if (!data.DBA || !data.DBA.trim())
    errors.push({ field: 'DBA', message: 'Expiration date is required' });
  else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.DBA))
    errors.push({ field: 'DBA', message: 'Expiration date must be MM/DD/YYYY' });

  if (!data.DBD || !data.DBD.trim())
    errors.push({ field: 'DBD', message: 'Issue date is required' });
  else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.DBD))
    errors.push({ field: 'DBD', message: 'Issue date must be MM/DD/YYYY' });

  if (!data.DAG || !data.DAG.trim())
    errors.push({ field: 'DAG', message: 'Street address is required' });

  if (!data.DAI || !data.DAI.trim())
    errors.push({ field: 'DAI', message: 'City is required' });

  if (!data.DAK || !data.DAK.trim())
    errors.push({ field: 'DAK', message: 'ZIP code is required' });
  else if (!/^\d{5,9}$/.test(data.DAK.replace(/\D/g, '')))
    errors.push({ field: 'DAK', message: 'ZIP must be 5 or 9 digits' });

  if (!data.DAQ || !data.DAQ.trim())
    errors.push({ field: 'DAQ', message: 'License number is required' });

  if (!data.DAY)
    errors.push({ field: 'DAY', message: 'Eye color is required' });

  if (!data.DAU || !data.DAU.trim())
    errors.push({ field: 'DAU', message: 'Height is required' });

  return errors;
}

function getFieldError(errors, field) {
  const e = errors.find(e => e.field === field);
  return e ? e.message : null;
}
