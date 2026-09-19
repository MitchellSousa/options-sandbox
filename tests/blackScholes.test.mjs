import assert from "node:assert/strict";
import {
  normalCDF,
  blackScholesPrice
} from "../src/blackScholes.js";

function approximatelyEqual(actual, expected, tolerance = 0.001) {
  return Math.abs(actual - expected) < tolerance;
}

assert.ok(
  approximatelyEqual(normalCDF(0), 0.5),
  "N(0) should equal approximately 0.5"
);

const callPrice = blackScholesPrice(
  "call",
  100,
  100,
  365,
  20,
  5
);

const putPrice = blackScholesPrice(
  "put",
  100,
  100,
  365,
  20,
  5
);

assert.ok(
  approximatelyEqual(callPrice, 10.4506),
  `Expected call price near 10.4506, received ${callPrice}`
);

assert.ok(
  approximatelyEqual(putPrice, 5.5735),
  `Expected put price near 5.5735, received ${putPrice}`
);

assert.throws(
  () => blackScholesPrice("call", 100, 100, 0, 20, 5),
  /Days remaining/
);

assert.throws(
  () => blackScholesPrice("call", 100, 100, 365, 0, 5),
  /Volatility/
);

assert.throws(
  () => blackScholesPrice("invalid", 100, 100, 365, 20, 5),
  /Option type/
);

console.log("Black–Scholes checks passed.");
console.log("Call price:", callPrice.toFixed(4));
console.log("Put price:", putPrice.toFixed(4));