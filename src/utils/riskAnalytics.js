export const calculatePortfolioRisk = (trades, accountBalance) => {
  const analytics = {
    totalExposure: 0,
    currencyExposure: {},
    correlationRisk: 0,
    concentrationRisk: 0,
    diversificationScore: 0
  };

  // Calculate total exposure
  trades.forEach(trade => {
    analytics.totalExposure += trade.riskDollars;
    
    // Calculate currency exposure
    const [base, quote] = trade.pair.split('/');
    const exposure = trade.direction === 'buy' ? trade.riskDollars : -trade.riskDollars;
    
    analytics.currencyExposure[base] = (analytics.currencyExposure[base] || 0) + exposure;
    analytics.currencyExposure[quote] = (analytics.currencyExposure[quote] || 0) - exposure;
  });

  // Calculate concentration risk
  const maxExposure = Math.max(...Object.values(analytics.currencyExposure).map(Math.abs));
  analytics.concentrationRisk = (maxExposure / accountBalance) * 100;

  // Calculate correlation risk
  analytics.correlationRisk = calculateCorrelationRisk(trades);

  // Calculate diversification score
  const uniqueCurrencies = Object.keys(analytics.currencyExposure).length;
  analytics.diversificationScore = Math.min(100, uniqueCurrencies * 12.5);

  return analytics;
};

export const calculateCorrelationRisk = (trades) => {
  const correlationMatrix = {
    'EUR': { 'GBP': 0.7, 'AUD': 0.6, 'NZD': 0.5 },
    'GBP': { 'EUR': 0.7, 'AUD': 0.5, 'NZD': 0.4 },
    'AUD': { 'EUR': 0.6, 'GBP': 0.5, 'NZD': 0.8 },
    'NZD': { 'EUR': 0.5, 'GBP': 0.4, 'AUD': 0.8 },
    'USD': { 'CAD': 0.3 },
    'CAD': { 'USD': 0.3 }
  };

  let totalCorrelation = 0;
  let pairCount = 0;

  trades.forEach((trade1, i) => {
    trades.forEach((trade2, j) => {
      if (i < j) {
        const [base1] = trade1.pair.split('/');
        const [base2] = trade2.pair.split('/');
        
        const correlation = correlationMatrix[base1]?.[base2] || 0;
        if (correlation > 0) {
          totalCorrelation += correlation;
          pairCount++;
        }
      }
    });
  });

  return pairCount > 0 ? (totalCorrelation / pairCount) * 100 : 0;
};

export const generateRiskWarnings = (analytics, accountBalance) => {
  const warnings = [];

  // Total exposure warning
  const exposurePercentage = (analytics.totalExposure / accountBalance) * 100;
  if (exposurePercentage > 10) {
    warnings.push({
      type: 'high_exposure',
      severity: 'high',
      message: `Total portfolio exposure is ${exposurePercentage.toFixed(1)}% of account`,
      recommendation: 'Consider reducing overall position sizes'
    });
  }

  // Concentration risk warning
  if (analytics.concentrationRisk > 5) {
    warnings.push({
      type: 'concentration',
      severity: 'medium',
      message: `High concentration risk: ${analytics.concentrationRisk.toFixed(1)}% in single currency`,
      recommendation: 'Diversify across more currency pairs'
    });
  }

  // Correlation risk warning
  if (analytics.correlationRisk > 50) {
    warnings.push({
      type: 'correlation',
      severity: 'medium',
      message: `High correlation risk: ${analytics.correlationRisk.toFixed(1)}% average correlation`,
      recommendation: 'Reduce positions in correlated pairs'
    });
  }

  // Diversification warning
  if (analytics.diversificationScore < 50) {
    warnings.push({
      type: 'diversification',
      severity: 'low',
      message: `Low diversification score: ${analytics.diversificationScore.toFixed(0)}%`,
      recommendation: 'Consider trading more currency pairs'
    });
  }

  return warnings;
};

export const calculateOptimalPositionSize = (
  accountBalance,
  riskPercentage,
  stopLossPips,
  pipValue,
  marketConditions = {}
) => {
  let adjustedRisk = riskPercentage;

  // Adjust for market conditions
  if (marketConditions.volatility > 70) {
    adjustedRisk *= 0.7; // Reduce by 30% in high volatility
  }

  if (marketConditions.newsRisk > 60) {
    adjustedRisk *= 0.5; // Reduce by 50% during high news risk
  }

  if (marketConditions.liquidity < 50) {
    adjustedRisk *= 0.8; // Reduce by 20% in low liquidity
  }

  const riskDollars = (accountBalance * adjustedRisk) / 100;
  const positionSize = riskDollars / (stopLossPips * pipValue);

  return {
    originalRisk: riskPercentage,
    adjustedRisk,
    positionSize: Math.max(0, positionSize),
    adjustments: {
      volatility: marketConditions.volatility > 70,
      newsRisk: marketConditions.newsRisk > 60,
      liquidity: marketConditions.liquidity < 50
    }
  };
};

export const calculateDrawdownImpact = (currentDrawdown, accountBalance) => {
  const impacts = [];

  if (currentDrawdown > 0) {
    const lossAmount = (accountBalance * currentDrawdown) / 100;
    const requiredGain = (currentDrawdown / (100 - currentDrawdown)) * 100;

    impacts.push({
      type: 'recovery',
      message: `${requiredGain.toFixed(1)}% gain needed to recover from ${currentDrawdown.toFixed(1)}% drawdown`,
      severity: currentDrawdown > 10 ? 'high' : currentDrawdown > 5 ? 'medium' : 'low'
    });

    impacts.push({
      type: 'real_world',
      message: `$${lossAmount.toFixed(2)} loss equals approximately ${Math.round(lossAmount / 50)} days of average expenses`,
      severity: 'info'
    });
  }

  return impacts;
};

export const generatePerformanceMetrics = (tradeHistory) => {
  if (tradeHistory.length === 0) {
    return {
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      expectancy: 0
    };
  }

  const wins = tradeHistory.filter(trade => trade.outcome === 'win');
  const losses = tradeHistory.filter(trade => trade.outcome === 'loss');

  const winRate = (wins.length / tradeHistory.length) * 100;
  const averageWin = wins.reduce((sum, trade) => sum + trade.profit, 0) / wins.length || 0;
  const averageLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.profit, 0) / losses.length) || 0;
  
  const grossProfit = wins.reduce((sum, trade) => sum + trade.profit, 0);
  const grossLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.profit, 0));
  
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
  const expectancy = (winRate / 100) * averageWin - ((100 - winRate) / 100) * averageLoss;

  return {
    winRate,
    averageWin,
    averageLoss,
    profitFactor,
    expectancy,
    totalTrades: tradeHistory.length,
    grossProfit,
    grossLoss
  };
};