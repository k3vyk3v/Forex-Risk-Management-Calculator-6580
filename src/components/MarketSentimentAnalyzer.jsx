import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiTrendingUp, FiTrendingDown, FiActivity, FiClock, 
  FiZap, FiGlobe, FiAlertTriangle, FiInfo
} = FiIcons;

const MarketSentimentAnalyzer = ({ inputs, onRiskAdjustment }) => {
  const [sentiment, setSentiment] = useState({
    overall: 'neutral',
    volatility: 'normal',
    newsImpact: 'low',
    sessionRisk: 'normal'
  });

  const [marketConditions, setMarketConditions] = useState({
    volatility: 50,
    liquidity: 70,
    spread: 1.2,
    newsRisk: 20
  });

  const [currentSession, setCurrentSession] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    analyzeSentiment();
    detectTradingSession();
    simulateUpcomingEvents();
  }, [inputs]);

  const analyzeSentiment = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    let overallSentiment = 'neutral';
    let volatilityLevel = 'normal';
    let newsImpact = 'low';
    let sessionRisk = 'normal';
    
    // Simulate market sentiment based on time and pair
    if (inputs.currencyPair.includes('JPY')) {
      // JPY pairs tend to be more volatile during Asian session
      if (hour >= 0 && hour <= 9) {
        volatilityLevel = 'high';
        sessionRisk = 'elevated';
      }
    }
    
    if (inputs.currencyPair.includes('GBP')) {
      // GBP pairs are volatile during London session
      if (hour >= 8 && hour <= 17) {
        volatilityLevel = 'high';
        overallSentiment = 'volatile';
      }
    }

    // Weekend risk
    if (day === 0 || day === 6) {
      sessionRisk = 'high';
      overallSentiment = 'risky';
    }

    // News impact simulation
    if (hour === 8 || hour === 10 || hour === 14) {
      newsImpact = 'high';
      volatilityLevel = 'high';
    }

    setSentiment({
      overall: overallSentiment,
      volatility: volatilityLevel,
      newsImpact,
      sessionRisk
    });

    // Update market conditions
    setMarketConditions({
      volatility: getVolatilityScore(volatilityLevel),
      liquidity: getLiquidityScore(sessionRisk),
      spread: getSpreadEstimate(inputs.currencyPair, sessionRisk),
      newsRisk: getNewsRiskScore(newsImpact)
    });
  };

  const getVolatilityScore = (level) => {
    switch (level) {
      case 'low': return 25;
      case 'normal': return 50;
      case 'high': return 75;
      case 'extreme': return 95;
      default: return 50;
    }
  };

  const getLiquidityScore = (risk) => {
    switch (risk) {
      case 'low': return 90;
      case 'normal': return 70;
      case 'elevated': return 50;
      case 'high': return 30;
      default: return 70;
    }
  };

  const getSpreadEstimate = (pair, risk) => {
    const baseSpreads = {
      'EUR/USD': 0.8,
      'GBP/USD': 1.2,
      'USD/JPY': 0.9,
      'AUD/USD': 1.1,
      'USD/CAD': 1.3,
      'NZD/USD': 1.5,
      'EUR/GBP': 1.8,
      'GBP/JPY': 2.1
    };

    const baseSpread = baseSpreads[pair] || 1.5;
    const riskMultiplier = risk === 'high' ? 2.5 : risk === 'elevated' ? 1.8 : 1.0;
    
    return baseSpread * riskMultiplier;
  };

  const getNewsRiskScore = (impact) => {
    switch (impact) {
      case 'low': return 20;
      case 'medium': return 50;
      case 'high': return 80;
      case 'extreme': return 95;
      default: return 20;
    }
  };

  const detectTradingSession = () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    
    if (utcHour >= 0 && utcHour < 9) {
      setCurrentSession('Asian Session');
    } else if (utcHour >= 8 && utcHour < 17) {
      setCurrentSession('London Session');
    } else if (utcHour >= 13 && utcHour < 22) {
      setCurrentSession('New York Session');
    } else {
      setCurrentSession('Off-Hours');
    }
  };

  const simulateUpcomingEvents = () => {
    const events = [
      { time: '08:30', event: 'US Employment Data', impact: 'High', currency: 'USD' },
      { time: '10:00', event: 'ECB Interest Rate Decision', impact: 'High', currency: 'EUR' },
      { time: '14:00', event: 'Fed Chair Speech', impact: 'Medium', currency: 'USD' },
      { time: '23:50', event: 'Japan GDP Data', impact: 'Medium', currency: 'JPY' }
    ];

    const relevantEvents = events.filter(event => 
      inputs.currencyPair.includes(event.currency)
    );

    setUpcomingEvents(relevantEvents);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600';
      case 'bearish': return 'text-red-600';
      case 'volatile': return 'text-orange-600';
      case 'risky': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return FiTrendingUp;
      case 'bearish': return FiTrendingDown;
      case 'volatile': return FiActivity;
      case 'risky': return FiAlertTriangle;
      default: return FiActivity;
    }
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (sentiment.volatility === 'high') {
      recommendations.push({
        type: 'warning',
        message: 'High volatility detected - consider reducing position size by 25-50%',
        action: () => onRiskAdjustment(Math.max(0.25, inputs.riskPercentage * 0.5))
      });
    }

    if (sentiment.newsImpact === 'high') {
      recommendations.push({
        type: 'danger',
        message: 'Major news events expected - avoid trading or use very tight stops',
        action: () => onRiskAdjustment(0.25)
      });
    }

    if (sentiment.sessionRisk === 'high') {
      recommendations.push({
        type: 'warning',
        message: 'Trading during off-hours increases spread costs and slippage risk',
        action: null
      });
    }

    if (marketConditions.liquidity < 50) {
      recommendations.push({
        type: 'info',
        message: 'Low liquidity conditions - expect wider spreads and potential slippage',
        action: null
      });
    }

    return recommendations;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiGlobe} className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Market Sentiment Analysis</h2>
      </div>

      {/* Overall Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <SafeIcon 
              icon={getSentimentIcon(sentiment.overall)} 
              className={`text-2xl mr-3 ${getSentimentColor(sentiment.overall)}`}
            />
            <div>
              <h3 className="font-semibold text-gray-800">Market Sentiment</h3>
              <p className={`font-medium ${getSentimentColor(sentiment.overall)}`}>
                {sentiment.overall.charAt(0).toUpperCase() + sentiment.overall.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <SafeIcon icon={FiClock} className="text-2xl text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-800">Trading Session</h3>
              <p className="font-medium text-blue-600">{currentSession}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Conditions */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Market Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {marketConditions.volatility}%
            </div>
            <div className="text-sm text-gray-600">Volatility</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {marketConditions.liquidity}%
            </div>
            <div className="text-sm text-gray-600">Liquidity</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {marketConditions.spread.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Est. Spread</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {marketConditions.newsRisk}%
            </div>
            <div className="text-sm text-gray-600">News Risk</div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Upcoming Events</h3>
          <div className="space-y-2">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <SafeIcon icon={FiZap} className="text-yellow-600 mr-3" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{event.event}</span>
                    <span className="text-sm text-gray-600">{event.time}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-600 mr-2">{event.currency}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.impact === 'High' ? 'bg-red-100 text-red-800' :
                      event.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Recommendations</h3>
        {getRecommendations().map((rec, index) => (
          <div key={index} className={`p-3 rounded-lg border-l-4 ${
            rec.type === 'danger' ? 'bg-red-50 border-red-500' :
            rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
            'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SafeIcon 
                  icon={rec.type === 'danger' ? FiAlertTriangle : FiInfo} 
                  className={`inline mr-2 ${
                    rec.type === 'danger' ? 'text-red-600' :
                    rec.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}
                />
                <span className="text-sm text-gray-700">{rec.message}</span>
              </div>
              {rec.action && (
                <button
                  onClick={rec.action}
                  className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Auto-Adjust
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Market Session Timeline */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Session Timeline (UTC)</h4>
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-600">Asian</div>
            <div className="text-gray-500">00:00-09:00</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600">London</div>
            <div className="text-gray-500">08:00-17:00</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600">New York</div>
            <div className="text-gray-500">13:00-22:00</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600">Overlap</div>
            <div className="text-gray-500">13:00-17:00</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketSentimentAnalyzer;