import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Minus, 
  X, 
  Divide, 
  Hash, 
  Target, 
  PieChart,
  ChevronLeft,
  Play,
  FileText,
  Layers,
  Square,
  Box,
  BarChart,
  Ruler,
  Clock,
  Maximize,
  HelpCircle
} from 'lucide-react';
import { Operation, StudentProfile } from '../types';

interface TopicSelectorProps {
  profile: StudentProfile;
  onSelect: (topic?: Operation) => void;
  onBack: () => void;
  onMultiplicationTable: () => void;
}

const TOPIC_CONFIG: Record<Operation, { icon: any, color: string, label: string }> = {
  [Operation.ADDITION]: { icon: Plus, color: 'bg-green-500', label: 'Addition' },
  [Operation.SUBTRACTION]: { icon: Minus, color: 'bg-blue-500', label: 'Subtraction' },
  [Operation.MULTIPLICATION]: { icon: X, color: 'bg-purple-500', label: 'Multiplication' },
  [Operation.DIVISION]: { icon: Divide, color: 'bg-orange-500', label: 'Division' },
  [Operation.ROUNDING]: { icon: Target, color: 'bg-red-500', label: 'Rounding' },
  [Operation.PLACE_VALUE]: { icon: Hash, color: 'bg-indigo-500', label: 'Place Value' },
  [Operation.FRACTIONS]: { icon: PieChart, color: 'bg-pink-500', label: 'Fractions' },
  [Operation.NUMBER_SENTENCES]: { icon: FileText, color: 'bg-yellow-500', label: 'Number Sentences' },
  [Operation.PATTERNS]: { icon: Layers, color: 'bg-teal-500', label: 'Patterns' },
  [Operation.SHAPES_2D]: { icon: Square, color: 'bg-orange-600', label: '2D Shapes' },
  [Operation.OBJECTS_3D]: { icon: Box, color: 'bg-red-600', label: '3D Objects' },
  [Operation.DATA_HANDLING]: { icon: BarChart, color: 'bg-blue-600', label: 'Data Handling' },
  [Operation.MEASUREMENT]: { icon: Ruler, color: 'bg-green-600', label: 'Measurement' },
  [Operation.TIME]: { icon: Clock, color: 'bg-indigo-600', label: 'Time' },
  [Operation.PERIMETER_AREA]: { icon: Maximize, color: 'bg-purple-600', label: 'Perimeter & Area' },
  [Operation.PROBABILITY]: { icon: HelpCircle, color: 'bg-pink-600', label: 'Probability' },
};

export const TopicSelector: React.FC<TopicSelectorProps> = ({ profile, onSelect, onBack, onMultiplicationTable }) => {
  const enabledOps = profile.enabledOperations || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-2xl shadow-md border-2 border-indigo-50 hover:bg-indigo-50 transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6 text-indigo-600" />
        </button>
        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Pick a Topic</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onSelect()}
            className="p-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-[2.5rem] text-white shadow-2xl flex items-center justify-between group hover:scale-[1.02] transition-transform border-4 border-white/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div className="text-left">
                <p className="font-black text-xl">Mixed Practice</p>
                <p className="text-white/80 text-sm font-bold opacity-80">All enabled topics</p>
              </div>
            </div>
          </button>

          <button
            onClick={onMultiplicationTable}
            className="p-6 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-[2.5rem] text-white shadow-2xl flex items-center justify-between group hover:scale-[1.02] transition-transform border-4 border-white/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                <X className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-black text-xl">Multiplication Table</p>
                <p className="text-white/80 text-sm font-bold opacity-80">Learn and Quiz</p>
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {enabledOps.map((op) => {
            const config = TOPIC_CONFIG[op];
            const Icon = config.icon;
            return (
              <motion.button
                key={op}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(op)}
                className="p-6 bg-white rounded-[3rem] border-4 border-indigo-50 shadow-xl flex flex-col items-center gap-4 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-16 h-16 ${config.color} rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform border-4 border-white/30`}>
                  <Icon className="w-9 h-9 text-white drop-shadow-md" />
                </div>
                <span className="font-black text-gray-700 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{config.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
