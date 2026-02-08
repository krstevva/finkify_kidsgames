import React, { useState, useEffect } from 'react';

export default function QuizModal({ isOpen, questions, onCorrect, usedQuestionIds }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const available = questions.filter(q => !usedQuestionIds.includes(q.id));
      
      if (available.length > 0) {
        const randomQ = available[Math.floor(Math.random() * available.length)];
        setCurrentQuestion(randomQ);
        setSelectedAnswer(null);
        setIsCorrect(false);
      } else {
        alert("Честитки! Ги научи сите лекции!");
        onCorrect(null); 
      }
    }
  }, [isOpen]);

  if (!isOpen || !currentQuestion) return null;

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    if (option === currentQuestion.correctAnswer) {
      setIsCorrect(true);
      setTimeout(() => {
        onCorrect(currentQuestion.id);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-yellow-400 transform transition-all">
        <h2 className="text-3xl font-black text-blue-600 mb-6 flex items-center gap-2">
          {isCorrect ? "Браво! 🎉" : "Cyber Квиз! 🔐"}
        </h2>
        
        <p className="text-xl font-medium mb-8 text-slate-700">
          {currentQuestion.question}
        </p>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !isCorrect && handleAnswer(option)}
              className={`p-4 text-left rounded-2xl font-bold text-lg border-b-4 transition-all ${
                selectedAnswer === option 
                  ? (option === currentQuestion.correctAnswer ? 'bg-green-400 border-green-600 text-white' : 'bg-red-400 border-red-600 text-white')
                  : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {isCorrect && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl animate-bounce">
            <p className="text-blue-700 font-bold text-center">
              🌟 Точно! Продолжуваме со играта...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}