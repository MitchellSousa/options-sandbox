import {
  callProfit,
  putProfit,
  breakEven,
  spreadCost
} from "./calculations.js";

const optionTypeInput = document.getElementById("option-type");
const stockInput = document.getElementById("stock-price");
const strikeInput = document.getElementById("strike-price");
const premiumInput = document.getElementById("premium");
const bidInput = document.getElementById("bid");
const askInput = document.getElementById("ask");
const calculateButton = document.getElementById("calculate-button");

const profitResult = document.getElementById("profit-result");
const breakEvenResult = document.getElementById("break-even-result");
const spreadResult = document.getElementById("spread-result");
const messageResult = document.getElementById("message-result");

function formatMoney(amount) {
  return "$" + amount.toFixed(2);
}

function formatSignedMoney(amount) {
  const sign = amount >= 0 ? "+" : "-";
  return sign + "$" + Math.abs(amount).toFixed(2);
}

calculateButton.addEventListener("click", function () {
  const optionType = optionTypeInput.value;
  const stockPrice = Number(stockInput.value);
  const strikePrice = Number(strikeInput.value);
  const premium = Number(premiumInput.value);
  const bid = Number(bidInput.value);
  const ask = Number(askInput.value);

  if (stockPrice < 0 || strikePrice < 0 || premium < 0 || bid < 0 || ask < 0) {
    messageResult.textContent = "Please enter prices that are zero or greater.";
    return;
  }

  if (ask < bid) {
    messageResult.textContent = "The ask price cannot be lower than the bid price.";
    return;
  }

  let profit;

  if (optionType === "call") {
    profit = callProfit(stockPrice, strikePrice, premium);
  } else {
    profit = putProfit(stockPrice, strikePrice, premium);
  }

  const breakEvenPrice = breakEven(optionType, strikePrice, premium);
  const spread = spreadCost(bid, ask);

  profitResult.textContent =
    "Profit/loss at expiration: " + formatSignedMoney(profit) + " per share";

  breakEvenResult.textContent =
    "Break-even price: " + formatMoney(breakEvenPrice);

  spreadResult.textContent =
    "Bid/ask spread: " + formatMoney(spread) +
    " per share, or " + formatMoney(spread * 100) + " per contract";

  if (profit > 0) {
    messageResult.textContent = "This simulated position is profitable at expiration";
  } else if (profit < 0) {
    messageResult.textContent = "This simulated position loses money at expiration";
  } else {
    messageResult.textContent = "This simulated position breaks even at expiration";
  }
});