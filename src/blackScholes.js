const DAYS_PER_YEAR = 365;

/*
 * Approximates N(x), the standard normal cumulative distribution.
 *
 * N(x) returns a value between 0 and 1. Black–Scholes uses it to
 * convert d1 and d2 into weights used in the option-price formula.
 */
export function normalCDF(x) {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.sqrt(2);

  const t = 1 / (1 + 0.3275911 * z);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const polynomial =
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t);

  const errorFunction =
    sign * (1 - polynomial * Math.exp(-(z * z)));

  return 0.5 * (1 + errorFunction);
}

export function calculateD1(
  stockPrice,
  strike,
  timeYears,
  interestRate,
  volatility
) {
  const numerator =
    Math.log(stockPrice / strike) +
    (interestRate + volatility * volatility / 2) * timeYears;

  const denominator = volatility * Math.sqrt(timeYears);

  return numerator / denominator;
}

export function calculateD2(d1, timeYears, volatility) {
  return d1 - volatility * Math.sqrt(timeYears);
}

export function blackScholesPrice(
  type,
  stockPrice,
  strike,
  daysRemaining,
  volatilityPercent,
  interestRatePercent
) {
  const values = [
    stockPrice,
    strike,
    daysRemaining,
    volatilityPercent,
    interestRatePercent
  ];

  if (!values.every(Number.isFinite)) {
    throw new Error("Every Black–Scholes input must be a valid number.");
  }

  if (type !== "call" && type !== "put") {
    throw new Error("Option type must be call or put.");
  }

  if (stockPrice <= 0 || strike <= 0) {
    throw new Error("Stock price and strike must be greater than zero.");
  }

  if (daysRemaining <= 0) {
    throw new Error("Days remaining must be greater than zero.");
  }

  if (volatilityPercent <= 0) {
    throw new Error("Volatility must be greater than zero.");
  }

  /*
   * The formula expects time in years and percentages as decimals.
   *
   * 365 days becomes 1 year.
   * 20% volatility becomes 0.20.
   * 5% interest becomes 0.05.
   */
  const timeYears = daysRemaining / DAYS_PER_YEAR;
  const volatility = volatilityPercent / 100;
  const interestRate = interestRatePercent / 100;

  const d1 = calculateD1(
    stockPrice,
    strike,
    timeYears,
    interestRate,
    volatility
  );

  const d2 = calculateD2(d1, timeYears, volatility);

  const discountedStrike =
    strike * Math.exp(-interestRate * timeYears);

  if (type === "call") {
    return (
      stockPrice * normalCDF(d1) -
      discountedStrike * normalCDF(d2)
    );
  }

  return (
    discountedStrike * normalCDF(-d2) -
    stockPrice * normalCDF(-d1)
  );
}