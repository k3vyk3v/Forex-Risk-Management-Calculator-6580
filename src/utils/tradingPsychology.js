export const analyzeTradingPsychology = (tradeHistory, currentInputs) => {
  const analysis = {
    emotionalState: 'neutral',
    riskTolerance: 'normal',
    tradingPattern: 'disciplined',
    recommendations: []
  };

  // Analyze recent trading behavior
  const recentTrades = tradeHistory.slice(-10);
  const consecutiveLosses = getConsecutiveLosses(recentTrades);
  const averageRisk = calculateAverageRisk(recentTrades);
  const tradingFrequency = calculateTradingFrequency(tradeHistory);

  // Emotional state analysis
  if (consecutiveLosses >= 3) {
    analysis.emotionalState = 'frustrated';
    analysis.recommendations.push({
      type: 'break',
      message: 'Take a break after 3+ consecutive losses',
      priority: 'high'
    });
  }

  // Risk tolerance analysis
  if (currentInputs.riskPercentage > averageRisk * 1.5) {
    analysis.riskTolerance = 'revenge_trading';
    analysis.recommendations.push({
      type: 'risk_reduction',
      message: 'Risk increased significantly - possible revenge trading',
      priority: 'critical'
    });
  }

  // Trading pattern analysis
  if (tradingFrequency.daily > 5) {
    analysis.tradingPattern = 'overtrading';
    analysis.recommendations.push({
      type: 'frequency_limit',
      message: 'Reduce trading frequency for better results',
      priority: 'medium'
    });
  }

  return analysis;
};

export const getConsecutiveLosses = (trades) => {
  let consecutive = 0;
  for (let i = trades.length - 1; i >= 0; i--) {
    if (trades[i].outcome === 'loss') {
      consecutive++;
    } else {
      break;
    }
  }
  return consecutive;
};

export const calculateAverageRisk = (trades) => {
  if (trades.length === 0) return 1;
  const totalRisk = trades.reduce((sum, trade) => sum + trade.riskPercentage, 0);
  return totalRisk / trades.length;
};

export const calculateTradingFrequency = (trades) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  return {
    daily: trades.filter(trade => new Date(trade.timestamp) >= today).length,
    weekly: trades.filter(trade => new Date(trade.timestamp) >= thisWeek).length
  };
};

export const generateMotivationalMessage = (emotionalState, performance) => {
  const messages = {
    frustrated: [
      "Every professional trader has losing streaks. What matters is how you respond.",
      "The market is testing your discipline. Stay strong and stick to your plan.",
      "Losses are tuition fees for market education. Learn and move forward."
    ],
    confident: [
      "Confidence is good, but overconfidence is dangerous. Stay humble.",
      "Winning streaks end. Prepare for the inevitable drawdown.",
      "Success in trading comes from consistency, not big wins."
    ],
    neutral: [
      "Maintain your emotional balance. This is your competitive advantage.",
      "Focus on the process, not the outcome of individual trades.",
      "Patience and discipline separate professionals from gamblers."
    ]
  };

  const stateMessages = messages[emotionalState] || messages.neutral;
  return stateMessages[Math.floor(Math.random() * stateMessages.length)];
};

export const calculateStressLevel = (factors) => {
  let stress = 0;
  
  // Factor weights
  const weights = {
    consecutiveLosses: 15,
    highRisk: 20,
    overtrading: 10,
    longSession: 5,
    marketVolatility: 10,
    newsEvents: 15,
    drawdown: 25
  };

  Object.entries(factors).forEach(([factor, value]) => {
    if (weights[factor] && value) {
      stress += weights[factor] * (value / 100);
    }
  });

  return Math.min(100, Math.max(0, stress));
};

export const getBreakRecommendation = (stressLevel, tradingDuration) => {
  if (stressLevel > 70) {
    return {
      type: 'mandatory',
      duration: 60, // minutes
      message: 'High stress detected. Mandatory 1-hour break required.'
    };
  }
  
  if (stressLevel > 50 || tradingDuration > 4) {
    return {
      type: 'recommended',
      duration: 30,
      message: 'Consider taking a 30-minute break to refresh your mind.'
    };
  }
  
  return null;
};