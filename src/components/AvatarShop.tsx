import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { ProgressService } from '../services/ProgressService';

interface AvatarShopProps {
  currentStars: number;
  unlockedAvatars: string[];
  onPurchase: (avatar: string) => void;
  onSelect: (avatar: string) => void;
  currentAvatar: string;
}

const AVATARS = [
  { emoji: '🐱', cost: 0 },
  { emoji: '🐶', cost: 0 },
  { emoji: '🦊', cost: 0 },
  { emoji: '🐻', cost: 0 },
  { emoji: '🦁', cost: 50 },
  { emoji: '🐯', cost: 50 },
  { emoji: '🐨', cost: 100 },
  { emoji: '🐼', cost: 100 },
  { emoji: '🦄', cost: 200 },
  { emoji: '🐲', cost: 500 },
];

export const AvatarShop: React.FC<AvatarShopProps> = ({ 
  currentStars, 
  unlockedAvatars, 
  onPurchase, 
  onSelect,
  currentAvatar 
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {AVATARS.map((item) => {
        const isUnlocked = (unlockedAvatars || []).includes(item.emoji);
        const isSelected = currentAvatar === item.emoji;
        
        return (
          <motion.button
            key={item.emoji}
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => isUnlocked ? onSelect(item.emoji) : onPurchase(item.emoji)}
            className={`relative p-4 rounded-3xl border-4 transition-all flex flex-col items-center gap-2 shadow-sm ${
              isSelected 
                ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                : isUnlocked 
                  ? 'border-indigo-100 bg-white hover:border-indigo-200' 
                  : 'border-gray-100 bg-gray-50/50 opacity-70 grayscale-[0.5]'
            }`}
          >
            <span className="text-4xl drop-shadow-sm">{item.emoji}</span>
            {!isUnlocked && (
              <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                <Star className="w-3 h-3 fill-current" />
                {item.cost}
              </div>
            )}
            {isUnlocked && isSelected && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                ACTIVE
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
