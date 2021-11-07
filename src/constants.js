// Source: https://www.iras.gov.sg/irashome/Individuals/Locals/Working-Out-Your-Taxes/Income-Tax-Rates/
export const TAX_RATES = [
  { first: 20000, tax: 0, rate: 0.02 },
  { first: 30000, tax: 200, rate: 0.035 },
  { first: 40000, tax: 550, rate: 0.07 },
  { first: 80000, tax: 3350, rate: 0.115 },
  { first: 120000, tax: 7950, rate: 0.15 },
  { first: 160000, tax: 13950, rate: 0.18 },
  { first: 200000, tax: 21150, rate: 0.19 },
  { first: 240000, tax: 28750, rate: 0.195 },
  { first: 280000, tax: 36550, rate: 0.2 },
  { first: 320000, tax: 44550, rate: 0.22 },
];

export const YEAR_MARKS = {
  1: '1 year',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
};

// This will likely change, its locked in based on initial first deposit
export const RETIREMENT_AGE = 62;

export const COLORS = {
  red: '#cf1322',
  green: '#3f8600',
  lightGrey: 'rgba(0, 0, 0, 0.15)',
  darkGrey: 'rgba(0, 0, 0, 0.5)',
};
