export const BEE_LEVEL_THRESHOLDS = [
  { level: 1, minPoints: 100, recognition: 135, label: 'Level 1' },
  { level: 2, minPoints: 95,  recognition: 125, label: 'Level 2' },
  { level: 3, minPoints: 90,  recognition: 110, label: 'Level 3' },
  { level: 4, minPoints: 80,  recognition: 100, label: 'Level 4' },
  { level: 5, minPoints: 75,  recognition: 80,  label: 'Level 5' },
  { level: 6, minPoints: 70,  recognition: 60,  label: 'Level 6' },
  { level: 7, minPoints: 55,  recognition: 50,  label: 'Level 7' },
  { level: 8, minPoints: 40,  recognition: 10,  label: 'Level 8' },
  { level: 9, minPoints: 0,   recognition: 0,   label: 'Non-Compliant' },
];

export const SUPPLIER_RECOGNITION: Record<number, number> = {
  1: 1.35, 2: 1.25, 3: 1.10, 4: 1.00,
  5: 0.80, 6: 0.60, 7: 0.50, 8: 0.10, 0: 0.00,
};

export const NET_VALUE_TIME_FACTORS = [
  0, 0.085, 0.17, 0.26, 0.34, 0.40, 0.52, 0.61, 0.70, 0.87, 1.0,
];

export const COMPANY_SIZE_THRESHOLDS = {
  EME: 10_000_000,
  QSE: 50_000_000,
};

export const CALCULATOR_STEPS = [
  'Company Info',
  'Ownership',
  'Management',
  'Skills',
  'ESD',
  'SED',
  'Results',
];
