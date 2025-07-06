export const calculateForexRisk = (inputs) => {
  const {
    accountBalance,
    riskPercentage,
    currencyPair,
    tradeDirection,
    entryPrice,
    stopLossPrice
  } = inputs;

  // Validation
  if (!accountBalance || !entryPrice || !stopLossPrice || entryPrice === stopLossPrice) {
    return {
      isValid: false,
      errors: ['Please fill in all required fields with valid values']
    };
  }

  // Validate stop loss direction
  const isValidDirection = tradeDirection === 'buy' 
    ? stopLossPrice < entryPrice 
    : stopLossPrice > entryPrice;

  if (!isValidDirection) {
    return {
      isValid: false,
      errors: [
        tradeDirection === 'buy' 
          ? 'For a Buy trade, stop loss must be below entry price'
          : 'For a Sell trade, stop loss must be above entry price'
      ]
    };
  }

  // Calculate basic values
  const riskDollars = (accountBalance * riskPercentage) / 100;
  const isJpyPair = currencyPair.includes('JPY');
  
  // Calculate stop distance in pips
  const pipMultiplier = isJpyPair ? 100 : 10000;
  const stopDistancePips = Math.abs(entryPrice - stopLossPrice) * pipMultiplier;
  
  // Determine stop loss direction for display
  const stopLossDirection = tradeDirection === 'buy' 
    ? (stopLossPrice < entryPrice ? 'negative' : 'positive')
    : (stopLossPrice > entryPrice ? 'positive' : 'negative');
  
  // Calculate pip value
  const pipValue = isJpyPair 
    ? accountBalance * 0.01 * 0.0001
    : accountBalance * 0.1 * 0.0001;
  
  // Calculate position size
  const positionSize = stopDistancePips > 0 ? riskDollars / (stopDistancePips * pipValue) : 0;
  
  // Calculate break-even price (assuming 1 pip spread)
  const spread = isJpyPair ? 0.01 : 0.0001;
  const breakEvenPrice = tradeDirection === 'buy' ? entryPrice + spread : entryPrice - spread;
  
  // Calculate profit targets
  const stopDistance = Math.abs(entryPrice - stopLossPrice);
  const profitTargets = {
    oneToOne: tradeDirection === 'buy' ? entryPrice + stopDistance : entryPrice - stopDistance,
    oneToTwo: tradeDirection === 'buy' ? entryPrice + (stopDistance * 2) : entryPrice - (stopDistance * 2),
    oneToThree: tradeDirection === 'buy' ? entryPrice + (stopDistance * 3) : entryPrice - (stopDistance * 3)
  };
  
  // Generate warnings
  const warnings = [];
  
  if (positionSize > 1) {
    warnings.push('Position size exceeds 1 lot - consider reducing risk');
  }
  
  if (stopDistancePips < 10) {
    warnings.push('Stop distance is very tight (< 10 pips) - may get stopped out by noise');
  }
  
  if (stopDistancePips > 200) {
    warnings.push('Stop distance is very wide (> 200 pips) - consider tighter stop loss');
  }
  
  if (riskPercentage > 2) {
    warnings.push('Risk percentage is high (> 2%) - consider reducing position size');
  }

  return {
    isValid: true,
    riskDollars,
    stopDistancePips,
    stopLossDirection,
    pipValue,
    positionSize: Math.max(0, positionSize),
    breakEvenPrice,
    profitTargets,
    warnings
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (percentage) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(percentage / 100);
};