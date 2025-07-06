import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiBarChart3, FiTrendingDown, FiInfo } = FiIcons;

const EducationalSection = ({ results, inputs }) => {
  const [activeTab, setActiveTab] = useState('scenarios');

  const whatIfScenarios = [0.25, 0.5, 1, 1.5, 2].map(risk => {
    const riskDollars = (inputs.accountBalance * risk) / 100;
    const positionSize = results?.stopDistancePips && results?.pipValue 
      ? riskDollars / (results.stopDistancePips * results.pipValue)
      : 0;
    
    return {
      risk,
      riskDollars,
      positionSize: Math.max(0, positionSize)
    };
  });

  const recoveryData = [
    { loss: 5, tradesNeeded: 1.05 },
    { loss: 10, tradesNeeded: 1.11 },
    { loss: 20, tradesNeeded: 1.25 },
    { loss: 30, tradesNeeded: 1.43 },
    { loss: 50, tradesNeeded: 2.0 }
  ];

  const tabs = [
    { id: 'scenarios', label: 'What-If Scenarios', icon: FiBarChart3 },
    { id: 'recovery', label: 'Recovery Calculator', icon: FiTrendingDown },
    { id: 'education', label: 'Key Concepts', icon: FiInfo }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiBook} className="text-2xl text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Educational Resources</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <SafeIcon icon={tab.icon} className="mr-2" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'scenarios' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Risk Percentage Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">Risk %</th>
                    <th className="border p-3 text-left">Risk Amount</th>
                    <th className="border p-3 text-left">Position Size</th>
                    <th className="border p-3 text-left">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {whatIfScenarios.map((scenario) => (
                    <tr key={scenario.risk} className={
                      scenario.risk === inputs.riskPercentage ? 'bg-blue-50' : ''
                    }>
                      <td className="border p-3 font-medium">{scenario.risk}%</td>
                      <td className="border p-3">${scenario.riskDollars.toFixed(2)}</td>
                      <td className="border p-3">{scenario.positionSize.toFixed(2)} lots</td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          scenario.risk <= 1 ? 'bg-green-100 text-green-800' :
                          scenario.risk <= 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {scenario.risk <= 1 ? 'Conservative' :
                           scenario.risk <= 2 ? 'Moderate' : 'Aggressive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'recovery' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recovery from Losses</h3>
            <p className="text-gray-600 mb-4">
              This table shows how many winning trades you need to recover from losses:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">Account Loss</th>
                    <th className="border p-3 text-left">Winning Trades Needed</th>
                    <th className="border p-3 text-left">Recovery Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {recoveryData.map((data) => (
                    <tr key={data.loss}>
                      <td className="border p-3 font-medium">{data.loss}%</td>
                      <td className="border p-3">{data.tradesNeeded.toFixed(1)}x</td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          data.loss <= 10 ? 'bg-green-100 text-green-800' :
                          data.loss <= 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {data.loss <= 10 ? 'Easy' :
                           data.loss <= 30 ? 'Moderate' : 'Very Hard'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Position Sizing Formula</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-sm">
                  Position Size = Risk Amount ÷ (Stop Distance × Pip Value)
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Pip Value Calculation</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <strong>JPY Pairs:</strong> Account Balance × 0.01 × 0.0001
                </p>
                <p className="text-sm">
                  <strong>Other Pairs:</strong> Account Balance × 0.1 × 0.0001
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Risk Management Rules</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>Never risk more than 1-2% of your account on a single trade</li>
                <li>Keep stop losses between 10-200 pips for optimal risk/reward</li>
                <li>Position sizes above 1 lot require extra caution</li>
                <li>Always use proper position sizing to protect your capital</li>
                <li>Track your daily exposure to avoid overexposure</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EducationalSection;