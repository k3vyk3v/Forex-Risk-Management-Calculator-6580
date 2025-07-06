import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiShield, FiAlertTriangle, FiTrendingDown, FiClock, FiTarget, 
  FiBook, FiHeart, FiZap, FiLock, FiUnlock, FiActivity,
  FiCalendar, FiTrendingUp, FiAlertCircle, FiCheck, FiX
} = FiIcons;

const NewbieProtectionSystem = ({ 
  inputs, 
  results, 
  dailyTrades, 
  accountHistory, 
  onRiskAdjustment,
  onTradeBlock 
}) => {
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [accountAge, setAccountAge] = useState(15); // days
  const [currentDrawdown, setCurrentDrawdown] = useState(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState(0);
  const [showPsychologyCoaching, setShowPsychologyCoaching] = useState(false);
  const [todayTradeCount, setTodayTradeCount] = useState(dailyTrades.length);
  const [weeklyTradeCount, setWeeklyTradeCount] = useState(8);
  const [showEducationalTip, setShowEducationalTip] = useState(true);

  // Beginner safety calculations
  const maxRiskForBeginners = 0.5;
  const isInBeginnerPeriod = accountAge < 90;
  const maxDrawdownLimit = 10;
  const dailyTradeLimit = 3;
  const weeklyTradeLimit = 15;

  // Account health metrics
  const accountHealth = {
    drawdown: currentDrawdown,
    consecutiveLosses,
    riskScore: calculateRiskScore(),
    healthStatus: getHealthStatus()
  };

  function calculateRiskScore() {
    let score = 100;
    score -= currentDrawdown * 5; // -5 points per 1% drawdown
    score -= consecutiveLosses * 10; // -10 points per consecutive loss
    score -= (inputs.riskPercentage > 1 ? (inputs.riskPercentage - 1) * 20 : 0);
    return Math.max(0, Math.min(100, score));
  }

  function getHealthStatus() {
    const score = accountHealth.riskScore;
    if (score >= 80) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { status: 'Caution', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Danger', color: 'text-red-600', bg: 'bg-red-100' };
  }

  // Protection checks
  const protectionChecks = {
    beginnerRiskLimit: isInBeginnerPeriod && inputs.riskPercentage > maxRiskForBeginners,
    drawdownLimit: currentDrawdown >= maxDrawdownLimit,
    dailyTradeLimit: todayTradeCount >= dailyTradeLimit,
    weeklyTradeLimit: weeklyTradeCount >= weeklyTradeLimit,
    lowLiquidityWarning: isLowLiquidityPeriod(),
    correlationWarning: hasCorrelatedPositions(),
    newsRiskWarning: isHighNewsRisk()
  };

  function isLowLiquidityPeriod() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Weekend or very late/early hours
    return day === 0 || day === 6 || hour < 6 || hour > 20;
  }

  function hasCorrelatedPositions() {
    const currentPair = inputs.currencyPair;
    const correlatedPairs = {
      'EUR/USD': ['GBP/USD', 'AUD/USD'],
      'GBP/USD': ['EUR/USD', 'AUD/USD'],
      'USD/JPY': ['EUR/JPY', 'GBP/JPY'],
      'AUD/USD': ['EUR/USD', 'GBP/USD', 'NZD/USD'],
      'NZD/USD': ['AUD/USD']
    };

    return dailyTrades.some(trade => 
      correlatedPairs[currentPair]?.includes(trade.pair)
    );
  }

  function isHighNewsRisk() {
    // Simulate high-impact news detection
    const now = new Date();
    const hour = now.getHours();
    
    // High-impact news typically around 8:30 AM, 10:00 AM, 2:00 PM EST
    return hour === 8 || hour === 10 || hour === 14;
  }

  // Educational content
  const educationalTips = [
    "💡 Most profitable traders took 1-2 years to become consistent",
    "🛡️ Protecting your account IS making money",
    "📊 Boring trades are usually the most profitable",
    "⚖️ Risk management is more important than being right",
    "🎯 Focus on process, not profits",
    "📈 Consistency beats big wins every time",
    "🧠 Your biggest enemy is your emotions",
    "⏰ The market rewards patience"
  ];

  const psychologyMessages = [
    {
      condition: consecutiveLosses >= 3,
      message: "Take a break! Consecutive losses can cloud judgment. Come back tomorrow with fresh eyes.",
      type: "warning"
    },
    {
      condition: currentDrawdown > 5,
      message: "Your account is in drawdown. Focus on capital preservation over profit generation.",
      type: "danger"
    },
    {
      condition: todayTradeCount >= 2,
      message: "You've already taken 2 trades today. Quality over quantity always wins.",
      type: "info"
    }
  ];

  const realityCheckMessages = [
    {
      loss: 5,
      message: `A 5% loss means you need a 5.3% gain to break even. That's ${((inputs.accountBalance * 0.05) / 50).toFixed(0)} days of average daily expenses.`
    },
    {
      loss: 10,
      message: `A 10% loss requires an 11.1% gain to recover. That's ${(inputs.accountBalance * 0.10).toFixed(0)} dollars - equivalent to a monthly utility bill.`
    },
    {
      loss: 20,
      message: `A 20% loss needs a 25% gain to recover. That's ${(inputs.accountBalance * 0.20).toFixed(0)} dollars - several months of groceries.`
    }
  ];

  const motivationalQuotes = [
    "The market will be here tomorrow - your account might not be",
    "If you're excited about this trade, double-check your risk",
    "Professional traders are paranoid about losses",
    "Your next trade could be your last if you're not careful",
    "Survival first, profits second"
  ];

  const getCurrentTip = () => {
    const tipIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % educationalTips.length;
    return educationalTips[tipIndex];
  };

  const getActivePsychologyMessage = () => {
    return psychologyMessages.find(msg => msg.condition);
  };

  // Circuit breaker check
  const shouldTriggerCircuitBreaker = currentDrawdown >= maxDrawdownLimit;

  if (shouldTriggerCircuitBreaker) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-4">
          <div className="text-center">
            <SafeIcon icon={FiAlertTriangle} className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">CIRCUIT BREAKER ACTIVATED</h2>
            <p className="text-gray-700 mb-6">
              Your account has reached a 10% drawdown. Trading is temporarily suspended to protect your capital.
            </p>
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-red-800">
                Take time to review your strategy, practice on a demo account, and consider additional education before resuming.
              </p>
            </div>
            <button
              onClick={() => setCurrentDrawdown(0)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              I Understand - Reset (Demo Only)
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Health Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <SafeIcon icon={FiShield} className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Account Health</h2>
          </div>
          {isInBeginnerPeriod && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Beginner Mode ({90 - accountAge} days left)
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${accountHealth.healthStatus.bg}`}>
            <h3 className="font-semibold text-sm text-gray-700">Health Score</h3>
            <p className={`text-2xl font-bold ${accountHealth.healthStatus.color}`}>
              {accountHealth.riskScore}/100
            </p>
            <p className={`text-sm ${accountHealth.healthStatus.color}`}>
              {accountHealth.healthStatus.status}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-100">
            <h3 className="font-semibold text-sm text-gray-700">Current Drawdown</h3>
            <p className="text-2xl font-bold text-gray-800">{currentDrawdown.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">
              ${(inputs.accountBalance * currentDrawdown / 100).toFixed(2)} loss
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-100">
            <h3 className="font-semibold text-sm text-gray-700">Consecutive Losses</h3>
            <p className="text-2xl font-bold text-gray-800">{consecutiveLosses}</p>
            <p className="text-sm text-gray-600">
              {consecutiveLosses === 0 ? 'On track' : 'Take a break'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-100">
            <h3 className="font-semibold text-sm text-gray-700">Today's Trades</h3>
            <p className="text-2xl font-bold text-gray-800">{todayTradeCount}/{dailyTradeLimit}</p>
            <p className="text-sm text-gray-600">
              {dailyTradeLimit - todayTradeCount} remaining
            </p>
          </div>
        </div>
      </motion.div>

      {/* Protection Alerts */}
      <AnimatePresence>
        {Object.entries(protectionChecks).some(([_, active]) => active) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <SafeIcon icon={FiAlertTriangle} className="text-2xl text-yellow-600 mr-3" />
              <h3 className="text-lg font-bold text-yellow-800">Protection Alerts</h3>
            </div>

            <div className="space-y-3">
              {protectionChecks.beginnerRiskLimit && (
                <div className="flex items-start p-3 bg-yellow-100 rounded-lg">
                  <SafeIcon icon={FiLock} className="text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800">Beginner Risk Limit</p>
                    <p className="text-sm text-yellow-700">
                      Risk limited to {maxRiskForBeginners}% for your first 90 days. 
                      Current: {inputs.riskPercentage}%
                    </p>
                    <button
                      onClick={() => onRiskAdjustment(maxRiskForBeginners)}
                      className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Auto-adjust to {maxRiskForBeginners}%
                    </button>
                  </div>
                </div>
              )}

              {protectionChecks.dailyTradeLimit && (
                <div className="flex items-start p-3 bg-red-100 rounded-lg">
                  <SafeIcon icon={FiClock} className="text-red-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">Daily Trade Limit Reached</p>
                    <p className="text-sm text-red-700">
                      You've reached your daily limit of {dailyTradeLimit} trades. Quality over quantity!
                    </p>
                  </div>
                </div>
              )}

              {protectionChecks.lowLiquidityWarning && (
                <div className="flex items-start p-3 bg-orange-100 rounded-lg">
                  <SafeIcon icon={FiClock} className="text-orange-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-800">Low Liquidity Period</p>
                    <p className="text-sm text-orange-700">
                      Trading during off-market hours increases spread costs and slippage risk.
                    </p>
                  </div>
                </div>
              )}

              {protectionChecks.correlationWarning && (
                <div className="flex items-start p-3 bg-purple-100 rounded-lg">
                  <SafeIcon icon={FiActivity} className="text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-800">Correlation Warning</p>
                    <p className="text-sm text-purple-700">
                      You have positions in correlated pairs. This increases your overall risk exposure.
                    </p>
                  </div>
                </div>
              )}

              {protectionChecks.newsRiskWarning && (
                <div className="flex items-start p-3 bg-red-100 rounded-lg">
                  <SafeIcon icon={FiZap} className="text-red-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">High-Impact News Risk</p>
                    <p className="text-sm text-red-700">
                      Major news events are expected. Consider reducing position size or waiting.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Psychology Coaching */}
      <AnimatePresence>
        {getActivePsychologyMessage() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <SafeIcon icon={FiHeart} className="text-2xl text-blue-600 mr-3" />
              <h3 className="text-lg font-bold text-blue-800">Psychology Check</h3>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">
                {getActivePsychologyMessage().message}
              </p>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700 italic">
                "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reality Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiTrendingDown} className="text-2xl text-red-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">Reality Check</h3>
        </div>

        <div className="space-y-3">
          {realityCheckMessages.map((check, index) => (
            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>{check.loss}% Loss:</strong> {check.message}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Your Current Risk:</strong> ${results?.riskDollars?.toFixed(2) || 0} 
            ({inputs.riskPercentage}% of account)
          </p>
        </div>
      </motion.div>

      {/* Daily Educational Tip */}
      <AnimatePresence>
        {showEducationalTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <SafeIcon icon={FiBook} className="text-2xl text-green-600 mr-3" />
                <h3 className="text-lg font-bold text-green-800">Daily Trading Tip</h3>
              </div>
              <button
                onClick={() => setShowEducationalTip(false)}
                className="text-green-600 hover:text-green-800"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>

            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                {getCurrentTip()}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-green-700">
                Tip {(Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % educationalTips.length) + 1} of {educationalTips.length}
              </p>
              <button
                onClick={() => setShowEducationalTip(false)}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realistic Growth Projections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiTrendingUp} className="text-2xl text-blue-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">Realistic Growth Expectations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Conservative (5% monthly)</h4>
            <p className="text-2xl font-bold text-blue-600">
              ${(inputs.accountBalance * 1.05 ** 12).toFixed(0)}
            </p>
            <p className="text-sm text-blue-700">After 1 year</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800">Moderate (10% monthly)</h4>
            <p className="text-2xl font-bold text-green-600">
              ${(inputs.accountBalance * 1.10 ** 12).toFixed(0)}
            </p>
            <p className="text-sm text-green-700">After 1 year</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800">Aggressive (15% monthly)</h4>
            <p className="text-2xl font-bold text-yellow-600">
              ${(inputs.accountBalance * 1.15 ** 12).toFixed(0)}
            </p>
            <p className="text-sm text-yellow-700">High risk!</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Remember:</strong> These projections assume no losing months, which is unrealistic. 
            Most professional traders aim for 10-20% annual returns with proper risk management.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NewbieProtectionSystem;