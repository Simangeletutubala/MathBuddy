import React from 'react';
import { motion } from 'motion/react';

interface BuddyProps {
  avatar: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited';
}

export const Buddy: React.FC<BuddyProps> = ({ avatar, mood }) => {
  const animations = {
    happy: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } },
    neutral: { x: [0, 5, 0, -5, 0], transition: { repeat: Infinity, duration: 4 } },
    sad: { rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 3 } },
    excited: { scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.5 } },
  };

  return (
    <motion.div
      animate={animations[mood]}
      className="relative w-24 h-24 flex items-center justify-center bg-white rounded-[2rem] shadow-xl border-4 border-indigo-100 text-5xl"
    >
      <span className="drop-shadow-md">{avatar}</span>
      <motion.div 
        className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md text-sm border-2 border-indigo-50"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {mood === 'happy' && '✨'}
        {mood === 'excited' && '🔥'}
        {mood === 'sad' && '💡'}
        {mood === 'neutral' && '👋'}
      </motion.div>
    </motion.div>
  );
};
