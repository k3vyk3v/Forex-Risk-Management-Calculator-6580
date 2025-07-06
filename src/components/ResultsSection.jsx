import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalculator, FiAlertTriangle, FiCheckCircle, FiXCircle, FiTrash2, FiArrowUp, FiArrowDown } = FiIcons;

const ResultsSection = ({ results, inputs, dailyTrades, onClearTrades }) => {
  if (!results) return null;

  const getRiskColor = (percentage) => {
    if (percentage <= 1) return 'text-green-600 bg-green-100';
    if (percentage <= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const totalDailyRisk = dailyTrades.reduce((sum, trade) => sum + trade.riskDollars, 0);
  const dailyRiskPercentage = (totalDailyRisk / inputs.accountBalance) * 100;

  const getDirectionIcon = (direction) => {
    return direction === 'buy' ? FiArrowUp : FiArrowDown;
  };

  const getDirectionColor = (direction) => {
    return direction === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Main Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <SafeIcon icon={FiCalculator} className="text-2xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Calculation Results</h2>
        </div>

        {results.isValid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Amount */}
            <div className={`p-4 rounded-lg ${getRiskColor(inputs.riskPercentage)}`}>
              <h3 className="font-semibold mb-2">Risk Amount</h3>
              <p className="text-3xl font-bold">${results.riskDollars.toFixed(2)}</p>
            </div>

            {/* Position Size */}
            <div className="p-4 rounded-lg bg-blue-100 text-blue-800">
              <h3 className="font-semibold mb-2">Position Size</h3>
              <p className="text-3xl font-bold">{results.positionSize.toFixed(2)} lots</p>
            </div>

            {/* Stop Distance */}
            <div className="p-4 rounded-lg bg-gray-100 text-gray-800">
              <h3 className="font-semibold mb-2">Stop Distance</h3>
              <p className="text-2xl font-bold">{results.stopDistancePips.toFixed(1)} pips</p>
              <p className="text-sm text-gray-600 mt-1">
                {results.stopLossDirection === 'positive' ? '+' : '-'}{results.stopDistancePips.toFixed(1)} pips
              </p>
            </div>

            {/* Pip Value */}
            <div className="p-4 rounded-lg bg-gray-100 text-gray-800">
              <h3 className="font-semibold mb-2">Pip Value</h3>
              <p className="text-2xl font-bold">${results.pipValue.toFixed(2)}</p>
            </div>

            {/* Trade Direction */}
            <div className={`p-4 rounded-lg ${inputs.tradeDirection === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <h3 className="font-semibold mb-2">Trade Direction</h3>
              <div className="flex items-center text-2xl font-bold">
                <SafeIcon icon={getDirectionIcon(inputs.tradeDirection)} className="mr-2" />
                {inputs.tradeDirection === 'buy' ? 'Long' : 'Short'}
              </div>
            </div>

            {/* Break-even Price */}
            <div className="p-4 rounded-lg bg-purple-100 text-purple-800">
              <h3 className="font-semibold mb-2">Break-even Price</h3>
              <p className="text-2xl font-bold">{results.breakEvenPrice.toFixed(5)}</p>
            </div>

            {/* Profit Targets */}
            <div className="p-4 rounded-lg bg-green-100 text-green-800 md:col-span-2">
              <h3 className="font-semibold mb-2">Profit Targets</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">1:1 Target</p>
                  <p className="text-lg font-bold">{results.profitTargets.oneToOne.toFixed(5)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">1:2 Target</p>
                  <p className="text-lg font-bold">{results.profitTargets.oneToTwo.toFixed(5)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">1:3 Target</p>
                  <p className="text-lg font-bold">{results.profitTargets.oneToThree.toFixed(5)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiXCircle} className="text-6xl text-red-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Invalid trade parameters</p>
            {results.errors && (
              <div className="mt-4 text-sm text-red-600">
                {results.errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Warnings */}
        {results.warnings && results.warnings.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiAlertTriangle} className="text-yellow-600 mr-2" />
              <h3 className="font-semibold text-yellow-800">Warnings</h3>
            </div>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              {results.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Daily Exposure Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Daily Exposure Tracker</h2>
          {dailyTrades.length > 0 && (
            <button
              onClick={onClearTrades}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="mr-2" />
              Clear All
            </button>
          )}
        </div>

        {dailyTrades.length > 0 ? (
          <>
            <div className={`p-4 rounded-lg mb-4 ${getRiskColor(dailyRiskPercentage)}`}>
              <h3 className="font-semibold mb-2">Total Daily Risk</h3>
              <p className="text-2xl font-bold">
                ${totalDailyRisk.toFixed(2)} ({dailyRiskPercentage.toFixed(2)}%)
              </p>
            </div>

            <div className="space-y-2">
              {dailyTrades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <SafeIcon 
                      icon={getDirectionIcon(trade.direction)} 
                      className={`mr-2 ${getDirectionColor(trade.direction)}`} 
                    />
                    <div>
                      <span className="font-medium">{trade.pair}</span>
                      <span className="text-sm text-gray-500 ml-2">{trade.timestamp}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${trade.riskDollars.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{trade.positionSize.toFixed(2)} lots</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiCheckCircle} className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No trades added today</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResultsSection;