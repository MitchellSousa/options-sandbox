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