import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHeart, FiAlertCircle, FiTrendingDown, FiClock, 
  FiZap, FiPause, FiPlay, FiMoon, FiSun
} = FiIcons;

const EmotionalStateMonitor = ({ 
  dailyTrades, 
  results, 
  inputs, 
  onForceBreak,
  onRecommendation 
}) => {
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(0);
  const [tradingSession, setTradingSession] = useState({
    startTime: null,
    duration: 0,
    tradesThisSession: 0
  });
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [mandatoryBreak, setMandatoryBreak] = useState(false);

  useEffect(() => {
    analyzeEmotionalState();
    updateTradingSession();
  }, [dailyTrades, results]);

  const analyzeEmotionalState = () => {
    let newStressLevel = 0;
    let newState = 'neutral';

    // Recent losses increase stress
    const recentLosses = getRecentLosses();
    if (recentLosses >= 3) {
      newStressLevel += 40;
      newState = 'frustrated';
    }

    // Large position sizes increase stress
    if (results?.positionSize > 0.5) {
      newStressLevel += 20;
    }

    // High risk percentage increases stress
    if (inputs.riskPercentage > 1.5) {
      newStressLevel += 25;
    }

    // Rapid trading increases stress
    if (dailyTrades.length > 5) {
      newStressLevel += 30;
      newState = 'overactive';
    }

    // Long trading sessions increase stress
    if (tradingSession.duration > 4) {
      newStressLevel += 15;
    }

    setStressLevel(Math.min(100, newStressLevel));
    setEmotionalState(newState);

    // Trigger mandatory break if stress is too high
    if (newStressLevel > 70 && !mandatoryBreak) {
      setMandatoryBreak(true);
      setShowBreakModal(true);
    }
  };

  const getRecentLosses = () => {
    // Simulate recent losses (in real app, this would track actual P&L)
    return Math.floor(Math.random() * 4);
  };

  const updateTradingSession = () => {
    if (!tradingSession.startTime && dailyTrades.length > 0) {
      setTradingSession({
        startTime: Date.now(),
        duration: 0,
        tradesThisSession: dailyTrades.length
      });
    }

    if (tradingSession.startTime) {
      const duration = (Date.now() - tradingSession.startTime) / (1000 * 60 * 60);
      setTradingSession(prev => ({
        ...prev,
        duration,
        tradesThisSession: dailyTrades.length
      }));
    }
  };

  const getStressColor = () => {
    if (stressLevel < 30) return 'text-green-600';
    if (stressLevel < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressBackground = () => {
    if (stressLevel < 30) return 'bg-green-100';
    if (stressLevel < 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getEmotionalStateMessage = () => {
    switch (emotionalState) {
      case 'frustrated':
        return {
          message: "You seem frustrated. Losses are part of trading - don't let them cloud your judgment.",
          recommendation: "Take a 30-minute break and review your strategy.",
          color: 'text-red-600'
        };
      case 'overactive':
        return {
          message: "High trading frequency detected. Quality over quantity leads to better results.",
          recommendation: "Slow down and focus on high-probability setups only.",
          color: 'text-orange-600'
        };
      case 'neutral':
        return {
          message: "You're in a good emotional state for trading. Stay focused and stick to your plan.",
          recommendation: "Continue with disciplined trading.",
          color: 'text-green-600'
        };
      default:
        return {
          message: "Monitor your emotional state to maintain peak performance.",
          recommendation: "Stay aware of your mental state while trading.",
          color: 'text-blue-600'
        };
    }
  };

  const forceBreak = () => {
    setMandatoryBreak(true);
    setShowBreakModal(true);
    onForceBreak("High stress level detected - mandatory break initiated");
  };

  const acknowledgeBreak = () => {
    setShowBreakModal(false);
    setMandatoryBreak(false);
    setStressLevel(0);
    onRecommendation("Break acknowledged - stress level reset");
  };

  const breathingExercise = () => {
    // Simple breathing exercise timer
    let count = 0;
    const breatheInterval = setInterval(() => {
      count++;
      if (count >= 10) {
        clearInterval(breatheInterval);
        setStressLevel(Math.max(0, stressLevel - 20));
        onRecommendation("Breathing exercise completed - stress reduced");
      }
    }, 4000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <SafeIcon icon={FiHeart} className="text-2xl text-red-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Emotional State Monitor</h2>
        </div>

        {/* Stress Level Indicator */}
        <div className={`p-4 rounded-lg mb-6 ${getStressBackground()}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Stress Level</h3>
            <span className={`text-2xl font-bold ${getStressColor()}`}>
              {stressLevel}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                stressLevel < 30 ? 'bg-green-500' : 
                stressLevel < 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${stressLevel}%` }}
            />
          </div>
        </div>

        {/* Emotional State Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Current State</h4>
            <p className={`font-medium ${getEmotionalStateMessage().color}`}>
              {emotionalState.charAt(0).toUpperCase() + emotionalState.slice(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {getEmotionalStateMessage().message}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Trading Session</h4>
            <p className="text-sm text-gray-600">
              Duration: {tradingSession.duration.toFixed(1)} hours
            </p>
            <p className="text-sm text-gray-600">
              Trades: {tradingSession.tradesThisSession}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-800 mb-2">Recommendation</h4>
          <p className="text-blue-700">
            {getEmotionalStateMessage().recommendation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={breathingExercise}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiSun} className="mr-2" />
            Breathing Exercise
          </button>

          <button
            onClick={forceBreak}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <SafeIcon icon={FiPause} className="mr-2" />
            Take Break
          </button>

          {stressLevel > 50 && (
            <button
              onClick={() => setShowBreakModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <SafeIcon icon={FiAlertCircle} className="mr-2" />
              Emergency Stop
            </button>
          )}
        </div>

        {/* Stress Factors */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Stress Factors</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Recent Losses:</span>
              <span className="ml-2 font-medium">{getRecentLosses()}</span>
            </div>
            <div>
              <span className="text-gray-600">Position Size:</span>
              <span className="ml-2 font-medium">{results?.positionSize?.toFixed(2) || 0} lots</span>
            </div>
            <div>
              <span className="text-gray-600">Risk Level:</span>
              <span className="ml-2 font-medium">{inputs.riskPercentage}%</span>
            </div>
            <div>
              <span className="text-gray-600">Daily Trades:</span>
              <span className="ml-2 font-medium">{dailyTrades.length}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mandatory Break Modal */}
      <AnimatePresence>
        {showBreakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-4"
            >
              <div className="text-center">
                <SafeIcon icon={FiMoon} className="text-6xl text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Time for a Break
                </h3>
                <p className="text-gray-600 mb-6">
                  Your stress level is high. Taking a break will help you return with a clearer mind and better decision-making.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-blue-800 mb-2">During your break:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Step away from the charts</li>
                    <li>• Take deep breaths or meditate</li>
                    <li>• Review your trading plan</li>
                    <li>• Hydrate and stretch</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={acknowledgeBreak}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    I'll Take a Break
                  </button>
                  {!mandatoryBreak && (
                    <button
                      onClick={() => setShowBreakModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Continue Trading
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmotionalStateMonitor;