import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiCheck, FiX, FiRefreshCw, FiAward } = FiIcons;

const TradingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      question: "What is the maximum risk percentage recommended for beginners?",
      options: ["0.5%", "1%", "2%", "5%"],
      correct: 0,
      explanation: "Beginners should risk no more than 0.5% to preserve capital while learning."
    },
    {
      question: "What should you do after 3 consecutive losing trades?",
      options: ["Increase position size", "Take a break", "Switch strategies", "Double down"],
      correct: 1,
      explanation: "Taking a break helps prevent emotional trading and allows for strategy review."
    },
    {
      question: "When is the best time to trade major currency pairs?",
      options: ["During market overlaps", "Late at night", "Weekends", "During holidays"],
      correct: 0,
      explanation: "Market overlaps provide the highest liquidity and tightest spreads."
    },
    {
      question: "What is the most important aspect of forex trading?",
      options: ["Making profits", "Risk management", "Technical analysis", "News trading"],
      correct: 1,
      explanation: "Risk management is crucial for long-term survival and success in forex trading."
    },
    {
      question: "How should you position your stop loss for a buy trade?",
      options: ["Above entry price", "Below entry price", "At entry price", "No stop loss needed"],
      correct: 1,
      explanation: "Stop loss should be below entry price for buy trades to limit downside risk."
    }
  ];

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  const getScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  const getScoreColor = () => {
    const score = getScore();
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const score = getScore();
    const percentage = (score / questions.length) * 100;
    
    if (percentage >= 80) return "Excellent! You have a solid understanding of forex basics.";
    if (percentage >= 60) return "Good job! Review the missed questions to improve.";
    return "Keep learning! Consider studying more before risking real money.";
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <SafeIcon icon={FiAward} className="text-2xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
        </div>

        <div className="text-center mb-6">
          <div className={`text-4xl font-bold ${getScoreColor()}`}>
            {getScore()}/{questions.length}
          </div>
          <p className="text-lg text-gray-600 mt-2">
            {((getScore() / questions.length) * 100).toFixed(0)}% Correct
          </p>
          <p className="text-gray-700 mt-2">{getScoreMessage()}</p>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                answers[index] === question.correct
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex items-start mb-2">
                <SafeIcon 
                  icon={answers[index] === question.correct ? FiCheck : FiX} 
                  className={`mr-2 mt-1 ${
                    answers[index] === question.correct ? 'text-green-600' : 'text-red-600'
                  }`}
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{question.question}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your answer: {question.options[answers[index]]}
                  </p>
                  {answers[index] !== question.correct && (
                    <p className="text-sm text-green-700 mt-1">
                      Correct answer: {question.options[question.correct]}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mt-2 italic">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={resetQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="mr-2" />
            Take Quiz Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SafeIcon icon={FiBook} className="text-2xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Trading Knowledge Quiz</h2>
        </div>
        <div className="text-sm text-gray-600">
          {currentQuestion + 1} / {questions.length}
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default TradingQuiz;