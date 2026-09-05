export function callProfit(stockPrice, strike, premium) {
  return Math.max(stockPrice - strike, 0) - premium;
}

export function putProfit(stockPrice, strike, premium) {
  return Math.max(strike - stockPrice, 0) - premium;
}

export function breakEven(type, strike, premium) {
  if (type === "call") {
    return strike + premium;
  }

  return strike - premium;
}

export function spreadCost(bid, ask) {
  return ask - bid;
}

const SHARES_PER_CONTRACT = 100;

export function totalContractProfit(profitPerShare, contracts) {
  return profitPerShare * SHARES_PER_CONTRACT * contracts;
}

export function maximumLoss(premium, contracts) {
  return premium * SHARES_PER_CONTRACT * contracts;
}

export function intrinsicValue(type, stockPrice, strike) {
  if (type === "call") {
    return Math.max(stockPrice - strike, 0);
  }

  return Math.max(strike - stockPrice, 0);
}