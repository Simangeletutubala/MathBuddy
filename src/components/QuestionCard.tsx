import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer || feedback) return;

    const isCorrect = parseInt(userAnswer) === question.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    setTimeout(() => {
      onAnswer(isCorrect);
      setUserAnswer('');
      setFeedback(null);
      setShowHelp(false);
    }, isCorrect ? 1500 : 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 fun-card border-indigo-100"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-gray-800 leading-relaxed">
          {question.text}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={!!feedback}
            placeholder="?"
            className="w-full text-5xl font-black text-center p-6 bg-indigo-50 border-4 border-indigo-200 rounded-3xl focus:outline-none focus:border-indigo-400 text-indigo-600 transition-all shadow-inner"
            autoFocus
          />
          
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div 
                initial={{ scale: 0, rotate: -20 }} 
                animate={{ scale: 1.2, rotate: 0 }} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 drop-shadow-lg"
              >
                <CheckCircle2 className="w-16 h-16" />
              </motion.div>
            )}
            {feedback === 'incorrect' && (
              <motion.div 
                initial={{ scale: 0, x: 20 }} 
                animate={{ scale: 1, x: 0 }} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 drop-shadow-lg"
              >
                <XCircle className="w-16 h-16" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={!userAnswer || !!feedback}
          className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white text-2xl font-black rounded-2xl shadow-xl transform active:scale-95 transition-all"
        >
          Check Answer
        </button>
      </form>

      <AnimatePresence>
        {feedback === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-orange-50 rounded-xl border-2 border-orange-200"
          >
            <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold">
              <HelpCircle className="w-5 h-5" />
              <span>Let's learn how to solve it:</span>
            </div>
            <ul className="space-y-2 text-orange-800">
              {question.explanation.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-bold">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
