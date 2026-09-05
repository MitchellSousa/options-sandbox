import {
  callProfit,
  putProfit,
  breakEven,
  spreadCost,
  totalContractProfit,
  maximumLoss,
  intrinsicValue,
} from "./calculations.js";

const optionTypeInput = document.getElementById("option-type");
const stockInput = document.getElementById("stock-price");
const strikeInput = document.getElementById("strike-price");
const premiumInput = document.getElementById("premium");
const bidInput = document.getElementById("bid");
const askInput = document.getElementById("ask");
const calculateButton = document.getElementById("calculate-button");
const contractsInput = document.getElementById("contracts");
const contractProfitResult = document.getElementById("contract-profit-result");
const maxLossResult = document.getElementById("max-loss-result");
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
  const contracts = Number(contractsInput.value);

  if (stockPrice < 0 || strikePrice < 0 || premium < 0 || bid < 0 || ask < 0 || contracts < 1) {
    messageResult.textContent = "Prices must be zero or greater, and contracts must be at least 1.";
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
  const totalProfit = totalContractProfit(profit, contracts);
  const maxLoss = maximumLoss(premium, contracts);
  const intrinsic = intrinsicValue(optionType, stockPrice, strikePrice);

  profitResult.textContent = formatSignedMoney(profit);
  contractProfitResult.textContent = formatSignedMoney(totalProfit) + " for " + contracts + " contract(s)";
  maxLossResult.textContent = "-" + formatMoney(maxLoss);
  breakEvenResult.textContent = formatMoney(breakEvenPrice);
  spreadResult.textContent = formatMoney(spread) + " / share · " + formatMoney(spread * 100) + " / contract"; 

  messageResult.classList.remove(
    "in-the-money",
    "out-of-the-money",
    "warning",
    "break-even"
  );

  if (profit > 0) {
    messageResult.classList.add("in-the-money");
    messageResult.textContent = "This option is in the money by " + formatMoney(intrinsic) + " and is profitable at expiration.";
  } else if (profit < 0 && intrinsic > 0) {
    messageResult.classList.add("warning");
    messageResult.textContent = "This option is in the money by " + formatMoney(intrinsic) + ", but it still loses money because the premium paid was higher.";
  } else if (profit < 0) {
    messageResult.classList.add("out-of-the-money");
    messageResult.textContent = "This option expires out of the money and loses the premium paid.";
  } else {
    messageResult.classList.add("break-even");
    messageResult.textContent = "This option reaches break-even at expiration.";
  }
});