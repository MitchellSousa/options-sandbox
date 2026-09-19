import {
  callProfit,
  putProfit,
  breakEven,
  spreadCost,
  totalContractProfit,
  maximumLoss,
  intrinsicValue,
} from "./calculations.js";

import { blackScholesPrice } from "./blackScholes.js";

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
const stockSlider = document.getElementById("stock-slider");
const stockSliderValue = document.getElementById("stock-slider-value");
const saveOriginalButton = document.getElementById("save-original-button");
const comparisonResult = document.getElementById("comparison-result");
const modelOptionTypeInput = document.getElementById("model-option-type");
const currentStockPriceInput = document.getElementById("current-stock-price");
const modelStrikeInput = document.getElementById("model-strike");
const daysRemainingInput = document.getElementById("days-remaining");
const volatilityInput = document.getElementById("volatility");
const interestRateInput = document.getElementById("interest-rate");
const modelCalculateButton = document.getElementById("model-calculate-button");
const modelPriceResult = document.getElementById("model-price-result");
const modelContractResult = document.getElementById("model-contract-result");
const modelMessage = document.getElementById("model-message");

let currentScenario = null;
let originalScenario = null;

function showModelMessage(message, type) {
  modelMessage.textContent = message;

  modelMessage.classList.remove("success", "error");
  modelMessage.classList.add(type);
}

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

  currentScenario = {
    stockPrice: stockPrice,
    totalProfit: totalProfit
  };
  updateComparison();

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

function syncSliderWithPriceInput() {
  const stockPrice = Number(stockInput.value);
  if (Number.isFinite(stockPrice)) {
    stockSlider.max = Math.max(200, stockPrice * 1.5);
    stockSlider.value = stockPrice;
    stockSliderValue.textContent = formatMoney(stockPrice);
  }
}

stockSlider.addEventListener("input", function () {
  stockInput.value = stockSlider.value;
  stockSliderValue.textContent = formatMoney(Number(stockSlider.value));

  calculateButton.click();
});

stockInput.addEventListener("input", syncSliderWithPriceInput);

syncSliderWithPriceInput();

function updateComparison() {
  if (originalScenario === null || currentScenario === null) {
    return;
  }

  const stockPriceChange = currentScenario.stockPrice - originalScenario.stockPrice;
  const totalProfitChange = currentScenario.totalProfit - originalScenario.totalProfit;

  comparisonResult.textContent =
    "Stock price changed " + formatSignedMoney(stockPriceChange) +
    ". Total profit/loss changed " + formatSignedMoney(totalProfitChange) +
    " from the original scenario.";
}

saveOriginalButton.addEventListener("click", function () {
  calculateButton.click();

  if (currentScenario === null) {
    return;
  }

  originalScenario = {
    stockPrice: currentScenario.stockPrice,
    totalProfit: currentScenario.totalProfit
  };

  comparisonResult.textContent =
    "Original scenario saved at stock price " + formatMoney(originalScenario.stockPrice) +
    " with total profit/loss of " + formatSignedMoney(originalScenario.totalProfit) + ".";
});

modelCalculateButton.addEventListener("click", function () {
  const requiredInputs = [
    currentStockPriceInput,
    modelStrikeInput,
    daysRemainingInput,
    volatilityInput,
    interestRateInput
  ];

  const hasEmptyInput = requiredInputs.some(function (input) {
    return input.value.trim() === "";
  });

  if (hasEmptyInput) {
    showModelMessage("Please complete every model input.", "error");
    return;
  }

  const optionType = modelOptionTypeInput.value;
  const currentStockPrice = Number(currentStockPriceInput.value);
  const strike = Number(modelStrikeInput.value);
  const daysRemaining = Number(daysRemainingInput.value);
  const volatilityPercent = Number(volatilityInput.value);
  const interestRatePercent = Number(interestRateInput.value);

  try {
    const modelPrice = blackScholesPrice(
      optionType,
      currentStockPrice,
      strike,
      daysRemaining,
      volatilityPercent,
      interestRatePercent
    );

    const contractValue = modelPrice * 100;

    modelPriceResult.textContent = formatMoney(modelPrice);
    modelContractResult.textContent = formatMoney(contractValue);

    showModelMessage(
      "The model estimates a theoretical premium of " +
      formatMoney(modelPrice) +
      " per share under these assumptions.",
      "success"
    );
  } catch (error) {
    modelPriceResult.textContent = "-";
    modelContractResult.textContent = "-";

    showModelMessage(error.message, "error");
  }
});