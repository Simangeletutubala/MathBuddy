import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

interface RewardBadgeProps {
  name: string;
}

export const RewardBadge: React.FC<RewardBadgeProps> = ({ name }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="flex flex-col items-center p-4 bg-white rounded-[2rem] border-4 border-purple-50 shadow-lg"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
        <Award className="w-10 h-10 text-white drop-shadow-md" />
      </div>
      <span className="text-sm font-black text-purple-700 text-center uppercase tracking-tight">{name}</span>
    </motion.div>
  );
};
