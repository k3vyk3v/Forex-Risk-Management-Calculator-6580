import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMap, FiAlertTriangle, FiTrendingUp, FiActivity } = FiIcons;

const RiskHeatmap = ({ dailyTrades, inputs, results }) => {
  const [riskData, setRiskData] = useState([]);
  const [totalExposure, setTotalExposure] = useState(0);
  const [riskConcentration, setRiskConcentration] = useState({});

  useEffect(() => {
    calculateRiskMetrics();
  }, [dailyTrades, inputs, results]);

  const calculateRiskMetrics = () => {
    // Calculate risk exposure by currency
    const currencyExposure = {};
    let totalRisk = 0;

    dailyTrades.forEach(trade => {
      const [base, quote] = trade.pair.split('/');
      const risk = trade.riskDollars;
      
      // Add exposure to base currency
      if (trade.direction === 'buy') {
        currencyExposure[base] = (currencyExposure[base] || 0) + risk;
      } else {
        currencyExposure[base] = (currencyExposure[base] || 0) - risk;
      }

      // Add exposure to quote currency (opposite direction)
      if (trade.direction === 'buy') {
        currencyExposure[quote] = (currencyExposure[quote] || 0) - risk;
      } else {
        currencyExposure[quote] = (currencyExposure[quote] || 0) + risk;
      }

      totalRisk += risk;
    });

    // Add current potential trade
    if (results?.isValid) {
      const [base, quote] = inputs.currencyPair.split('/');
      const risk = results.riskDollars;
      
      if (inputs.tradeDirection === 'buy') {
        currencyExposure[base] = (currencyExposure[base] || 0) + risk;
        currencyExposure[quote] = (currencyExposure[quote] || 0) - risk;
      } else {
        currencyExposure[base] = (currencyExposure[base] || 0) - risk;
        currencyExposure[quote] = (currencyExposure[quote] || 0) + risk;
      }
      
      totalRisk += risk;
    }

    setTotalExposure(totalRisk);
    setRiskConcentration(currencyExposure);

    // Create heatmap data
    const heatmapData = Object.entries(currencyExposure).map(([currency, exposure]) => ({
      currency,
      exposure: Math.abs(exposure),
      direction: exposure > 0 ? 'long' : 'short',
      percentage: Math.abs(exposure) / inputs.accountBalance * 100,
      riskLevel: getRiskLevel(Math.abs(exposure) / inputs.accountBalance * 100)
    }));

    setRiskData(heatmapData.sort((a, b) => b.exposure - a.exposure));
  };

  const getRiskLevel = (percentage) => {
    if (percentage < 1) return 'low';
    if (percentage < 3) return 'medium';
    if (percentage < 5) return 'high';
    return 'critical';
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConcentrationWarnings = () => {
    const warnings = [];
    
    riskData.forEach(item => {
      if (item.percentage > 5) {
        warnings.push(`High concentration in ${item.currency}: ${item.percentage.toFixed(1)}%`);
      }
    });

    const totalRiskPercentage = (totalExposure / inputs.accountBalance) * 100;
    if (totalRiskPercentage > 10) {
      warnings.push(`Total portfolio risk is ${totalRiskPercentage.toFixed(1)}% - consider reducing exposure`);
    }

    return warnings;
  };

  const getCorrelationWarnings = () => {
    const warnings = [];
    const correlatedPairs = {
      'EUR': ['GBP', 'AUD', 'NZD'],
      'GBP': ['EUR', 'AUD', 'NZD'], 
      'AUD': ['EUR', 'GBP', 'NZD'],
      'NZD': ['EUR', 'GBP', 'AUD'],
      'USD': ['CAD'],
      'CAD': ['USD']
    };

    Object.entries(riskConcentration).forEach(([currency, exposure]) => {
      if (Math.abs(exposure) > inputs.accountBalance * 0.02) {
        const correlatedCurrencies = correlatedPairs[currency] || [];
        correlatedCurrencies.forEach(corrCurrency => {
          if (riskConcentration[corrCurrency] && 
              Math.sign(exposure) === Math.sign(riskConcentration[corrCurrency])) {
            warnings.push(`${currency} and ${corrCurrency} positions are correlated`);
          }
        });
      }
    });

    return [...new Set(warnings)]; // Remove duplicates
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiMap} className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Risk Heatmap</h2>
      </div>

      {/* Total Exposure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Exposure</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${totalExposure.toFixed(2)}
          </p>
          <p className="text-sm text-blue-700">
            {((totalExposure / inputs.accountBalance) * 100).toFixed(1)}% of account
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800">Active Positions</h3>
          <p className="text-2xl font-bold text-gray-600">
            {dailyTrades.length}
          </p>
          <p className="text-sm text-gray-600">
            {results?.isValid ? '+1 pending' : 'No pending trades'}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800">Currencies</h3>
          <p className="text-2xl font-bold text-purple-600">
            {Object.keys(riskConcentration).length}
          </p>
          <p className="text-sm text-purple-700">
            Exposure across {Object.keys(riskConcentration).length} currencies
          </p>
        </div>
      </div>

      {/* Currency Exposure Grid */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Currency Exposure</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {riskData.map((item, index) => (
            <motion.div
              key={item.currency}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border-2 ${getRiskColor(item.riskLevel)}`}
            >
              <div className="text-center">
                <h4 className="font-bold text-lg">{item.currency}</h4>
                <p className="text-sm font-medium">
                  {item.direction === 'long' ? '↗' : '↘'} ${item.exposure.toFixed(0)}
                </p>
                <p className="text-xs">
                  {item.percentage.toFixed(1)}% of account
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Concentration Chart */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Risk Distribution</h3>
        <div className="space-y-2">
          {riskData.map((item, index) => (
            <div key={item.currency} className="flex items-center">
              <div className="w-12 text-sm font-medium text-gray-600">
                {item.currency}
              </div>
              <div className="flex-1 mx-3">
                <div className="w-full bg-gray-200 rounded-full h-4 relative">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${
                      item.riskLevel === 'low' ? 'bg-green-500' :
                      item.riskLevel === 'medium' ? 'bg-yellow-500' :
                      item.riskLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, item.percentage * 10)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">
                ${item.exposure.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {(getConcentrationWarnings().length > 0 || getCorrelationWarnings().length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <SafeIcon icon={FiAlertTriangle} className="text-yellow-600 mr-2" />
            <h4 className="font-semibold text-yellow-800">Risk Warnings</h4>
          </div>
          
          <div className="space-y-2">
            {getConcentrationWarnings().map((warning, index) => (
              <div key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span className="text-yellow-800 text-sm">{warning}</span>
              </div>
            ))}
            
            {getCorrelationWarnings().map((warning, index) => (
              <div key={`corr-${index}`} className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                <span className="text-yellow-800 text-sm">{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Management Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Risk Management Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep total portfolio risk below 10% of account balance</li>
          <li>• Avoid overconcentration in any single currency (max 5%)</li>
          <li>• Be aware of correlated positions that increase overall risk</li>
          <li>• Consider hedging strategies for large exposures</li>
          <li>• Monitor market sessions for optimal entry/exit timing</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default RiskHeatmap;