import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total === 0 ? 0 : (current / total) * 100;

  return (
    <div className="w-full max-w-md bg-indigo-50 rounded-full h-5 overflow-hidden shadow-inner border-2 border-indigo-100">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};
