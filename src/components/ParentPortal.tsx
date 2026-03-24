import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Settings, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Save,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile, Difficulty, Operation } from '../types';
import { ProgressService } from '../services/ProgressService';

interface ParentPortalProps {
  profile: StudentProfile;
  onUpdate: (profile: StudentProfile) => void;
  onClose: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ profile, onUpdate, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  // Settings state
  const [newPassword, setNewPassword] = useState(profile.parentPassword || '1234');
  const [enabledOps, setEnabledOps] = useState<Operation[]>(profile.enabledOperations || []);
  const [difficulty, setDifficulty] = useState<Difficulty>(profile.difficulty);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (profile.parentPassword || '1234')) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleSaveSettings = () => {
    ProgressService.updateParentSettings(newPassword, enabledOps, difficulty);
    const updatedProfile = ProgressService.getProfile();
    if (updatedProfile) {
      onUpdate(updatedProfile);
      alert('Settings saved successfully!');
    }
  };

  const toggleOperation = (op: Operation) => {
    if (enabledOps.includes(op)) {
      if (enabledOps.length > 1) {
        setEnabledOps(enabledOps.filter(o => o !== op));
      } else {
        alert('At least one operation must be enabled.');
      }
    } else {
      setEnabledOps([...enabledOps, op]);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-[3rem] shadow-2xl border-8 border-indigo-50 max-w-md mx-auto"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center shadow-inner border-2 border-indigo-100">
            <Lock className="text-indigo-600 w-10 h-10 drop-shadow-sm" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-center text-gray-800 mb-2 tracking-tight">Parent Portal</h2>
        <p className="text-gray-400 text-center text-sm font-bold mb-8 uppercase tracking-widest">Enter password to unlock</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="••••"
            className="w-full p-5 bg-indigo-50 border-4 border-indigo-100 rounded-2xl text-center text-3xl font-black focus:outline-none focus:border-indigo-300 text-indigo-600 shadow-inner transition-all"
            autoFocus
          />
          {error && <p className="text-rose-500 text-xs text-center font-black uppercase tracking-tighter">{error}</p>}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black rounded-2xl shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              Unlock
            </button>
          </div>
        </form>
        <p className="mt-8 text-[10px] text-gray-300 text-center font-black uppercase tracking-[0.2em]">Default: 1234</p>
      </motion.div>
    );
  }

  const accuracy = profile.totalQuestions > 0 
    ? Math.round((profile.correctAnswers / profile.totalQuestions) * 100) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[3rem] shadow-2xl border-4 border-indigo-50 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Parent Portal</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-90"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Progress Overview */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <BarChart3 className="text-indigo-500 w-7 h-7" />
            Learning Report
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 shadow-sm">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Accuracy</p>
              <p className="text-4xl font-black text-indigo-700">{accuracy}%</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 shadow-sm">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Questions</p>
              <p className="text-4xl font-black text-emerald-700">{profile.totalQuestions}</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border-4 border-gray-50 space-y-6 shadow-sm">
            <h4 className="font-black text-gray-400 text-xs uppercase tracking-widest">Performance by Topic</h4>
            <div className="space-y-4">
              {(Object.entries(profile.weakAreas) as [Operation, number][]).map(([op, errors]) => {
                const opName = op.toLowerCase().replace('_', ' ');
                return (
                  <div key={op} className="flex items-center justify-between gap-6">
                    <span className="capitalize text-gray-700 font-black text-sm min-w-[100px]">{opName}</span>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (errors / 10) * 100)}%` }}
                          className={`h-full rounded-full ${errors > 5 ? 'bg-rose-400' : errors > 2 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase whitespace-nowrap">{errors} errors</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Customization */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Settings className="text-amber-500 w-7 h-7" />
            Customize Practice
          </h3>
          
          <div className="space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Enabled Operations</p>
            <div className="flex flex-wrap gap-3">
              {Object.values(Operation).map(op => (
                <button
                  key={op}
                  onClick={() => toggleOperation(op)}
                  className={`px-5 py-3 rounded-2xl font-black text-sm border-4 transition-all active:scale-95 ${
                    enabledOps.includes(op)
                      ? 'bg-indigo-500 border-indigo-600 text-white shadow-lg'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {op.charAt(0) + op.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Difficulty Level</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(Difficulty).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-2xl font-black text-sm border-4 transition-all active:scale-95 ${
                    difficulty === d
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Unlock className="text-rose-500 w-7 h-7" />
            Portal Security
          </h3>
          <div className="space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Change Password</p>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border-4 border-gray-100 rounded-2xl font-black focus:outline-none focus:border-indigo-300 text-indigo-600 shadow-inner transition-all"
            />
          </div>
        </section>

        <button
          onClick={handleSaveSettings}
          className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xl rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95"
        >
          <Save className="w-7 h-7" />
          Save All Changes
        </button>
      </div>
    </motion.div>
  );
};
