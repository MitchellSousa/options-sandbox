# Options Sandbox

An interactive educational simulator for learning basic option payoff behavior.

## Current features

- Long-call and long-put payoff calculations at expiration
- Profit/loss per share and per standard 100-share contract
- Maximum-loss calculation for long options
- Break-even and intrinsic-value calculations
- Bid/ask spread cost display
- Input validation
- Color-coded scenario feedback for profitable, losing, break-even, and in-the-money-but-still-losing positions
- Interactive browser interface
- Black–Scholes theoretical call and put pricing
- Per-share and per-contract theoretical values
- Automated benchmark tests for the pricing model
- Visible pricing-model assumptions and input validation

## How to run locally

Open `index.html` in a browser, or run a local server.

## Important assumptions

The current version calculates payoff at expiration. It does not provide
live market data or financial advice.
The Black–Scholes calculator assumes European-style exercise, no
dividends, constant volatility, and a constant risk-free interest rate.
Its output is a theoretical estimate rather than a prediction or trade
recommendation.

## Future plans

- Payoff graph
- Time-decay simulation
- Greek visualizations
- Guided experiments