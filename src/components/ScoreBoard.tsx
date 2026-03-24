import React from 'react';
import { motion } from 'motion/react';
import { Star, Flame, Trophy } from 'lucide-react';

interface ScoreBoardProps {
  stars: number;
  streak: number;
  difficulty: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ stars, streak, difficulty }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 bg-white/90 backdrop-blur-md rounded-[2rem] shadow-xl border-4 border-indigo-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border-2 border-amber-100 shadow-sm">
        <Star className="w-6 h-6 text-amber-500 fill-amber-500 drop-shadow-sm" />
        <span className="text-xl font-black text-amber-700">{stars}</span>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-2xl border-2 border-rose-100 shadow-sm">
        <Flame className="w-6 h-6 text-rose-500 fill-rose-500 drop-shadow-sm" />
        <span className="text-xl font-black text-rose-700">{streak}</span>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl border-2 border-indigo-100 shadow-sm">
        <Trophy className="w-6 h-6 text-indigo-500 drop-shadow-sm" />
        <span className="text-xl font-black text-indigo-700 uppercase tracking-tighter">{difficulty}</span>
      </div>
    </div>
  );
};
