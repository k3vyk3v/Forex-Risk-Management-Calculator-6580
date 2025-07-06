import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import ForexCalculator from './components/ForexCalculator';
import PlatformSafetyCheck from './components/PlatformSafetyCheck';
import TradingQuiz from './components/TradingQuiz';
import GetStartedQuest from './components/GetStartedQuest';
import SafeIcon from './common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { questConfig } from './config/questConfig';
import './App.css';

const { FiShield, FiBook, FiAward, FiCalculator, FiPlay } = FiIcons;

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  const tabs = [
    { id: 'calculator', label: 'Risk Calculator', icon: FiCalculator },
    { id: 'getstarted', label: 'Get Started', icon: FiPlay },
    { id: 'safety', label: 'Platform Safety', icon: FiShield },
    { id: 'quiz', label: 'Knowledge Quiz', icon: FiAward },
  ];

  return (
    <QuestProvider 
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Forex Risk Management Calculator
            </h1>
            <p className="text-lg text-gray-600">
              Professional-grade position sizing and newbie protection system
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === 'calculator' && <ForexCalculator />}
            {activeTab === 'getstarted' && <GetStartedQuest />}
            {activeTab === 'safety' && <PlatformSafetyCheck />}
            {activeTab === 'quiz' && <TradingQuiz />}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center text-gray-600"
          >
            <p className="text-sm">
              Remember: The goal is not to get rich quick, but to stay in the game long enough to get rich slowly.
            </p>
          </motion.div>
        </div>
      </div>
    </QuestProvider>
  );
}

export default App;