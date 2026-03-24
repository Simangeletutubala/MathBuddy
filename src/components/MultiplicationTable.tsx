import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trophy, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface MultiplicationTableProps {
  onBack: () => void;
}

export const MultiplicationTable: React.FC<MultiplicationTableProps> = ({ onBack }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState<{ active: boolean; targetNum: number | null }>({ active: false, targetNum: null });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean | null>>({});

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  const startQuiz = (num: number) => {
    setQuizMode({ active: true, targetNum: num });
    setQuizAnswers({});
    setQuizResults({});
  };

  const handleAnswerChange = (idx: number, val: string) => {
    const numVal = parseInt(val);
    setQuizAnswers(prev => ({ ...prev, [idx]: numVal }));
  };

  const checkQuiz = () => {
    if (!quizMode.targetNum) return;
    const results: Record<number, boolean> = {};
    numbers.forEach(n => {
      results[n] = quizAnswers[n] === quizMode.targetNum! * n;
    });
    setQuizResults(results);
  };

  const resetQuiz = () => {
    setQuizMode({ active: false, targetNum: null });
    setQuizAnswers({});
    setQuizResults({});
  };

  const isCorrect = useMemo(() => {
    return Object.values(quizResults).every(r => r === true) && Object.keys(quizResults).length === 12;
  }, [quizResults]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white rounded-2xl shadow-md border-2 border-indigo-50 hover:bg-indigo-50 transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-600" />
          </button>
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">Multiplication Table</h2>
        </div>
        {!quizMode.active && (
          <p className="text-indigo-400 font-black text-xs uppercase tracking-widest hidden sm:block bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
            Tap to highlight multiples!
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!quizMode.active ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-4 sm:p-8 rounded-[3rem] shadow-2xl border-4 border-indigo-50 overflow-x-auto"
          >
            <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 min-w-[600px]">
              {/* Header Corner */}
              <div className="h-10 flex items-center justify-center font-black text-indigo-500 bg-indigo-50 rounded-xl">×</div>
              
              {/* Top Header */}
              {numbers.map(n => (
                <button
                  key={`h-${n}`}
                  onClick={() => {
                    setSelectedCol(selectedCol === n ? null : n);
                    setSelectedRow(null);
                  }}
                  className={`h-10 flex items-center justify-center font-black rounded-xl transition-all ${selectedCol === n ? 'bg-indigo-500 text-white shadow-md scale-105' : 'bg-indigo-50/50 text-indigo-400 hover:bg-indigo-100'}`}
                >
                  {n}
                </button>
              ))}

              {/* Rows */}
              {numbers.map(row => (
                <React.Fragment key={`row-${row}`}>
                  {/* Left Header */}
                  <button
                    onClick={() => {
                      setSelectedRow(selectedRow === row ? null : row);
                      setSelectedCol(null);
                    }}
                    className={`w-10 h-10 flex items-center justify-center font-black rounded-xl transition-all ${selectedRow === row ? 'bg-indigo-500 text-white shadow-md scale-105' : 'bg-indigo-50/50 text-indigo-400 hover:bg-indigo-100'}`}
                  >
                    {row}
                  </button>
                  
                  {/* Cells */}
                  {numbers.map(col => {
                    const isHighlighted = selectedRow === row || selectedCol === col;
                    const isTarget = selectedRow === row && selectedCol === col;
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`h-10 flex items-center justify-center font-bold rounded-xl transition-all text-sm sm:text-base ${
                          isTarget ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 z-10 shadow-lg' :
                          isHighlighted ? 'bg-indigo-100/50 text-indigo-700' :
                          'bg-white text-gray-600 border border-indigo-50/50'
                        }`}
                      >
                        {row * col}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t-4 border-indigo-50">
              <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <Trophy className="text-amber-500 w-7 h-7" />
                Take a Quiz!
              </h3>
              <div className="flex flex-wrap gap-3">
                {numbers.map(n => (
                  <motion.button
                    key={`quiz-btn-${n}`}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startQuiz(n)}
                    className="px-5 py-3 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all border-4 border-indigo-50 hover:border-indigo-100 shadow-sm text-sm uppercase tracking-tight"
                  >
                    {n}× Table
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-gray-50"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-50 rounded-3xl border-2 border-indigo-100 shadow-inner">
                  <Trophy className="text-indigo-600 w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tight">The {quizMode.targetNum}× Table Quiz</h3>
                  <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">Fill in all the answers!</p>
                </div>
              </div>
              <button 
                onClick={resetQuiz}
                className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all active:scale-90"
              >
                <RefreshCw className="w-8 h-8" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {numbers.map(n => (
                <div key={`q-${n}`} className="flex items-center gap-4 p-5 bg-indigo-50/50 rounded-[2rem] border-4 border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all shadow-sm">
                  <span className="text-xl font-black text-indigo-300 w-16 text-right">
                    {quizMode.targetNum} × {n} =
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={quizAnswers[n] || ''}
                      onChange={(e) => handleAnswerChange(n, e.target.value)}
                      disabled={quizResults[n] !== undefined}
                      className="w-full bg-white border-4 border-indigo-50 rounded-2xl px-4 py-3 font-black text-2xl text-indigo-600 focus:outline-none focus:border-indigo-400 disabled:opacity-100 shadow-inner transition-all"
                    />
                    {quizResults[n] !== undefined && (
                      <div className="absolute -right-2 -top-2">
                        {quizResults[n] ? (
                          <div className="bg-emerald-100 p-1.5 rounded-full border-2 border-emerald-200 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="bg-rose-100 p-1.5 rounded-full border-2 border-rose-200 shadow-sm">
                            <XCircle className="w-5 h-5 text-rose-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between gap-6">
              {Object.keys(quizResults).length === 0 ? (
                <button
                  onClick={checkQuiz}
                  className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-2xl rounded-[2rem] shadow-2xl hover:brightness-110 transition-all active:scale-95"
                >
                  Check Answers
                </button>
              ) : (
                <div className="w-full flex flex-col sm:flex-row items-center gap-6">
                  <div className={`flex-1 flex items-center gap-4 px-8 py-5 rounded-[2rem] font-black text-xl shadow-xl border-4 ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                    {isCorrect ? (
                      <>
                        <Trophy className="w-8 h-8 text-amber-500 drop-shadow-sm" />
                        Perfect Score! You're a Math Star!
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-8 h-8 text-rose-500" />
                        Keep practicing! Try again?
                      </>
                    )}
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="w-full sm:w-auto px-10 py-5 bg-gray-100 text-gray-500 font-black text-2xl rounded-[2rem] hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Finish
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
