import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InputSection from './InputSection';
import ResultsSection from './ResultsSection';
import EducationalSection from './EducationalSection';
import NewbieProtectionSystem from './NewbieProtectionSystem';
import EmotionalStateMonitor from './EmotionalStateMonitor';
import RiskHeatmap from './RiskHeatmap';
import MarketSentimentAnalyzer from './MarketSentimentAnalyzer';
import { calculateForexRisk } from '../utils/forexCalculations';

const ForexCalculator = () => {
  const [inputs, setInputs] = useState({
    accountBalance: 10000,
    riskPercentage: 1,
    currencyPair: 'EUR/USD',
    tradeDirection: 'buy',
    entryPrice: 1.0850,
    stopLossPrice: 1.0800
  });

  const [results, setResults] = useState(null);
  const [dailyTrades, setDailyTrades] = useState([]);
  const [accountHistory, setAccountHistory] = useState([]);
  const [showProtectionSystem, setShowProtectionSystem] = useState(true);
  const [activeAdvancedTab, setActiveAdvancedTab] = useState('protection');

  useEffect(() => {
    const calculatedResults = calculateForexRisk(inputs);
    setResults(calculatedResults);
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRiskAdjustment = (newRisk) => {
    setInputs(prev => ({
      ...prev,
      riskPercentage: newRisk
    }));
  };

  const handleTradeBlock = (reason) => {
    alert(`Trade blocked: ${reason}`);
  };

  const handleForceBreak = (reason) => {
    alert(`Mandatory break initiated: ${reason}`);
  };

  const handleRecommendation = (message) => {
    console.log('Recommendation:', message);
  };

  const addTrade = () => {
    if (results && results.isValid) {
      const newTrade = {
        id: Date.now(),
        pair: inputs.currencyPair,
        direction: inputs.tradeDirection,
        riskDollars: results.riskDollars,
        positionSize: results.positionSize,
        timestamp: new Date().toLocaleTimeString()
      };
      setDailyTrades(prev => [...prev, newTrade]);
    }
  };

  const clearTrades = () => {
    setDailyTrades([]);
  };

  const advancedTabs = [
    { id: 'protection', label: 'Protection System', component: NewbieProtectionSystem },
    { id: 'emotional', label: 'Emotional Monitor', component: EmotionalStateMonitor },
    { id: 'heatmap', label: 'Risk Heatmap', component: RiskHeatmap },
    { id: 'sentiment', label: 'Market Sentiment', component: MarketSentimentAnalyzer }
  ];

  const renderAdvancedComponent = () => {
    const activeTab = advancedTabs.find(tab => tab.id === activeAdvancedTab);
    if (!activeTab) return null;

    const Component = activeTab.component;
    const commonProps = {
      inputs,
      results,
      dailyTrades,
      accountHistory,
      onRiskAdjustment: handleRiskAdjustment,
      onTradeBlock: handleTradeBlock
    };

    switch (activeAdvancedTab) {
      case 'emotional':
        return (
          <Component
            {...commonProps}
            onForceBreak={handleForceBreak}
            onRecommendation={handleRecommendation}
          />
        );
      case 'heatmap':
        return <Component {...commonProps} />;
      case 'sentiment':
        return <Component {...commonProps} />;
      default:
        return <Component {...commonProps} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <InputSection
            inputs={inputs}
            onInputChange={handleInputChange}
            onAddTrade={addTrade}
            results={results}
          />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <ResultsSection
            results={results}
            inputs={inputs}
            dailyTrades={dailyTrades}
            onClearTrades={clearTrades}
          />
        </div>
      </div>

      {/* Advanced Features Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {advancedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdvancedTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeAdvancedTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Advanced Component */}
        <div className="min-h-[400px]">
          {renderAdvancedComponent()}
        </div>
      </div>

      {/* Educational Section */}
      <div className="mt-8">
        <EducationalSection results={results} inputs={inputs} />
      </div>
    </div>
  );
};

export default ForexCalculator;