import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiCheck, FiX, FiAlertTriangle, FiExternalLink } = FiIcons;

const PlatformSafetyCheck = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const safetyChecklist = [
    {
      id: 'regulation',
      title: 'Broker Regulation',
      description: 'Verify your broker is regulated by FCA, CySEC, ASIC, or other major regulators',
      critical: true,
      link: 'https://www.fca.org.uk/firms/financial-services-register'
    },
    {
      id: 'segregation',
      title: 'Fund Segregation',
      description: 'Ensure client funds are segregated from broker operational funds',
      critical: true
    },
    {
      id: 'insurance',
      title: 'Deposit Insurance',
      description: 'Check if deposits are covered by investor compensation schemes',
      critical: true
    },
    {
      id: 'spreads',
      title: 'Competitive Spreads',
      description: 'Compare spreads with other brokers for your trading pairs',
      critical: false
    },
    {
      id: 'execution',
      title: 'Order Execution',
      description: 'Test order execution speed and slippage on demo account',
      critical: false
    },
    {
      id: 'withdrawal',
      title: 'Withdrawal Process',
      description: 'Test withdrawal process with small amount first',
      critical: true
    },
    {
      id: 'support',
      title: 'Customer Support',
      description: 'Test customer support responsiveness and quality',
      critical: false
    },
    {
      id: 'platform',
      title: 'Platform Stability',
      description: 'Ensure trading platform is stable during high volatility',
      critical: true
    }
  ];

  const handleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const criticalChecked = safetyChecklist
    .filter(item => item.critical)
    .filter(item => checkedItems[item.id]).length;

  const totalCritical = safetyChecklist.filter(item => item.critical).length;

  const getSafetyScore = () => {
    const totalChecked = Object.values(checkedItems).filter(Boolean).length;
    const criticalScore = (criticalChecked / totalCritical) * 70;
    const generalScore = ((totalChecked - criticalChecked) / (safetyChecklist.length - totalCritical)) * 30;
    return Math.round(criticalScore + generalScore);
  };

  const getSafetyStatus = () => {
    const score = getSafetyScore();
    if (score >= 80) return { status: 'Safe', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { status: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Risky', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiShield} className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Platform Safety Check</h2>
      </div>

      {/* Safety Score */}
      <div className={`p-4 rounded-lg mb-6 ${getSafetyStatus().bg}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Safety Score</h3>
            <p className={`text-2xl font-bold ${getSafetyStatus().color}`}>
              {getSafetyScore()}/100
            </p>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${getSafetyStatus().color}`}>
              {getSafetyStatus().status}
            </p>
            <p className="text-sm text-gray-600">
              {criticalChecked}/{totalCritical} critical items
            </p>
          </div>
        </div>
      </div>

      {/* Safety Checklist */}
      <div className="space-y-3">
        {safetyChecklist.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg transition-colors ${
              checkedItems[item.id] 
                ? 'border-green-300 bg-green-50' 
                : item.critical 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <button
                  onClick={() => handleCheck(item.id)}
                  className={`mt-1 mr-3 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    checkedItems[item.id]
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {checkedItems[item.id] && (
                    <SafeIcon icon={FiCheck} className="text-white text-sm" />
                  )}
                </button>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    {item.critical && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <SafeIcon icon={FiExternalLink} className="text-sm" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Warning for low safety score */}
      {getSafetyScore() < 60 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <SafeIcon icon={FiAlertTriangle} className="text-red-600 mr-3" />
            <div>
              <h4 className="font-semibold text-red-800">Safety Warning</h4>
              <p className="text-sm text-red-700">
                Your current broker setup may not be safe. Consider addressing critical items before trading with real money.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Recommended Actions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Start with a demo account to test platform stability</li>
          <li>• Only deposit what you can afford to lose</li>
          <li>• Keep records of all transactions</li>
          <li>• Never give anyone else access to your trading account</li>
          <li>• Regularly review your broker's regulatory status</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default PlatformSafetyCheck;