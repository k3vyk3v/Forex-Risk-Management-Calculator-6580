import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiPercent, FiTrendingUp, FiTarget, FiShield, FiArrowUp, FiArrowDown } = FiIcons;

const InputSection = ({ inputs, onInputChange, onAddTrade, results }) => {
  const currencyPairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 
    'USD/CAD', 'NZD/USD', 'EUR/GBP', 'GBP/JPY'
  ];

  const riskPercentages = [0.25, 0.5, 1, 1.5, 2];
  const tradeDirections = [
    { value: 'buy', label: 'Buy (Long)', icon: FiArrowUp, color: 'text-green-600' },
    { value: 'sell', label: 'Sell (Short)', icon: FiArrowDown, color: 'text-red-600' }
  ];

  const getStopLossGuidance = () => {
    if (inputs.tradeDirection === 'buy') {
      return 'Stop loss should be below entry price';
    } else {
      return 'Stop loss should be above entry price';
    }
  };

  const getStopLossColor = () => {
    if (!inputs.entryPrice || !inputs.stopLossPrice) return '';
    
    const isValidStopLoss = inputs.tradeDirection === 'buy' 
      ? inputs.stopLossPrice < inputs.entryPrice
      : inputs.stopLossPrice > inputs.entryPrice;
    
    return isValidStopLoss ? 'border-green-300 focus:ring-green-500' : 'border-red-300 focus:ring-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiShield} className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Trade Setup</h2>
      </div>

      <div className="space-y-6">
        {/* Account Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiDollarSign} className="inline mr-2" />
            Account Balance
          </label>
          <input
            type="number"
            value={inputs.accountBalance}
            onChange={(e) => onInputChange('accountBalance', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="10000"
          />
        </div>

        {/* Risk Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiPercent} className="inline mr-2" />
            Risk Percentage
          </label>
          <select
            value={inputs.riskPercentage}
            onChange={(e) => onInputChange('riskPercentage', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          >
            {riskPercentages.map(percent => (
              <option key={percent} value={percent}>
                {percent}%
              </option>
            ))}
          </select>
        </div>

        {/* Currency Pair */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiTrendingUp} className="inline mr-2" />
            Currency Pair
          </label>
          <select
            value={inputs.currencyPair}
            onChange={(e) => onInputChange('currencyPair', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          >
            {currencyPairs.map(pair => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        {/* Trade Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trade Direction
          </label>
          <div className="grid grid-cols-2 gap-2">
            {tradeDirections.map(direction => (
              <button
                key={direction.value}
                onClick={() => onInputChange('tradeDirection', direction.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  inputs.tradeDirection === direction.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center">
                  <SafeIcon icon={direction.icon} className={`mr-2 ${direction.color}`} />
                  <span className="font-medium">{direction.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Entry Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entry Price
          </label>
          <input
            type="number"
            step="0.00001"
            value={inputs.entryPrice}
            onChange={(e) => onInputChange('entryPrice', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="1.0850"
          />
        </div>

        {/* Stop Loss Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiTarget} className="inline mr-2" />
            Stop Loss Price
            <span className="text-xs text-gray-500 ml-2">({getStopLossGuidance()})</span>
          </label>
          <input
            type="number"
            step="0.00001"
            value={inputs.stopLossPrice}
            onChange={(e) => onInputChange('stopLossPrice', Number(e.target.value))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg ${getStopLossColor()}`}
            placeholder="1.0800"
          />
        </div>

        {/* Add Trade Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddTrade}
          disabled={!results?.isValid}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            results?.isValid
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Add to Daily Tracker
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InputSection;