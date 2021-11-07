import { TAX_RATES } from './constants';

export const getTax = (salary) => {
  // find nearest
  const {
    first = 0,
    tax = 0,
    rate = 0,
  } = TAX_RATES.find((txRate, index) => {
    // When reached the end just return true
    const bellowNext =
      index + 1 === TAX_RATES.length
        ? true
        : salary < TAX_RATES[index + 1]?.first;
    const aboveOrEven = salary >= txRate.first;
    // FIXME: does not support higher millions
    return bellowNext && aboveOrEven;
  }) || {};

  const remaining = (salary - first) * rate;
  console.log('[GET-TAX]', {
    salary,
    first,
    rate,
  });
  return {
    payable: tax + remaining,
    rate,
    first,
  };
};

export const compundInterest = (
  principal,
  time,
  interestRate,
  interestPeriod = 1
) => {
  let futureValue = 0;
  for (let year = 1; year <= time; year++) {
    const interest = (futureValue + principal) * interestRate;
    futureValue += principal + interest;
  }

  return Number(futureValue).toFixed(2);
};

export const numericFormatter = (value, symbol = 'S$') =>
  `${symbol}\xa0${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const formatter = (value, precision = 2, symbol = 'S$') =>
  `${symbol}\xa0${Number(value).toFixed(precision)}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );
