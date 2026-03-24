import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  User, 
  LayoutDashboard, 
  Play, 
  LogOut, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Lock
} from 'lucide-react';
import { Difficulty, StudentProfile, Question, Operation, SessionState } from './types';
import { ProgressService } from './services/ProgressService';
import { MathService } from './services/MathService';
import { SoundService } from './services/SoundService';
import { QuestionCard } from './components/QuestionCard';
import { ScoreBoard } from './components/ScoreBoard';
import { RewardBadge } from './components/RewardBadge';
import { ProgressBar } from './components/ProgressBar';
import { Buddy } from './components/Buddy';
import { AvatarShop } from './components/AvatarShop';
import { ParentPortal } from './components/ParentPortal';
import { TopicSelector } from './components/TopicSelector';
import { MultiplicationTable } from './components/MultiplicationTable';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [view, setView] = useState<'welcome' | 'practice' | 'dashboard' | 'shop' | 'daily' | 'parent' | 'topics' | 'multiplication-table'>('welcome');
  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐱');
  const [session, setSession] = useState<SessionState>({ correctInARow: 0, wrongInARow: 0 });
  const [dailyCount, setDailyCount] = useState(0);
  const [practiceTopic, setPracticeTopic] = useState<Operation | 'all'>('all');

  useEffect(() => {
    const savedProfile = ProgressService.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleStartPractice = useCallback((specificTopic?: Operation) => {
    if (!profile) return;
    const topic = specificTopic || 'all';
    setPracticeTopic(topic);
    const ops = specificTopic ? [specificTopic] : profile.enabledOperations;
    const q = MathService.generateQuestion(profile.difficulty, ops);
    setCurrentQuestion(q);
    setView('practice');
  }, [profile]);

  const handleStartDaily = useCallback(() => {
    if (!profile) return;
    setPracticeTopic('all');
    const q = MathService.generateQuestion(profile.difficulty, profile.enabledOperations);
    setCurrentQuestion(q);
    setDailyCount(0);
    setView('daily');
  }, [profile]);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const newProfile = ProgressService.createProfile(nameInput.trim(), selectedAvatar);
    setProfile(newProfile);
    SoundService.playLevelUp();
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!profile || !currentQuestion) return;

    if (isCorrect) {
      SoundService.playCorrect();
      if (profile.streak > 0 && (profile.streak + 1) % 5 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#10B981', '#F59E0B']
        });
      }
    } else {
      SoundService.playIncorrect();
    }

    const updatedProfile = ProgressService.updateProgress(isCorrect, currentQuestion.operation);
    
    let newSession = { ...session };
    if (isCorrect) {
      newSession.correctInARow += 1;
      newSession.wrongInARow = 0;
    } else {
      newSession.wrongInARow += 1;
      newSession.correctInARow = 0;
    }

    let newDifficulty = updatedProfile.difficulty;
    if (newSession.correctInARow >= 3) {
      if (newDifficulty === Difficulty.EASY) newDifficulty = Difficulty.MEDIUM;
      else if (newDifficulty === Difficulty.MEDIUM) newDifficulty = Difficulty.HARD;
      newSession.correctInARow = 0;
      if (newDifficulty !== updatedProfile.difficulty) {
        SoundService.playLevelUp();
      }
    } else if (newSession.wrongInARow >= 2) {
      if (newDifficulty === Difficulty.HARD) newDifficulty = Difficulty.MEDIUM;
      else if (newDifficulty === Difficulty.MEDIUM) newDifficulty = Difficulty.EASY;
      newSession.wrongInARow = 0;
    }

    if (newDifficulty !== updatedProfile.difficulty) {
      ProgressService.updateDifficulty(newDifficulty);
      updatedProfile.difficulty = newDifficulty;
    }

    setProfile(updatedProfile);
    setSession(newSession);

    if (view === 'daily') {
      const nextCount = dailyCount + 1;
      if (nextCount >= 5) {
        const finalProfile = ProgressService.completeDailyChallenge();
        setProfile(finalProfile);
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#FFD700', '#FFA500', '#FF4500']
          });
          SoundService.playLevelUp();
          alert('Daily Challenge Complete! +50 Bonus Stars! 🌟');
          setView('welcome');
        }, 1000);
      } else {
        setDailyCount(nextCount);
        setTimeout(() => {
          setCurrentQuestion(MathService.generateQuestion(newDifficulty, profile.enabledOperations));
        }, 500);
      }
    } else {
      setTimeout(() => {
        const ops = practiceTopic === 'all' ? profile.enabledOperations : [practiceTopic as Operation];
        setCurrentQuestion(MathService.generateQuestion(newDifficulty, ops));
      }, 500);
    }
  };

  const handlePurchase = (avatar: string) => {
    const cost = 50; // Simplified cost
    if (ProgressService.unlockAvatar(avatar, cost)) {
      setProfile(ProgressService.getProfile());
      SoundService.playLevelUp();
      confetti({ particleCount: 50, spread: 40 });
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    ProgressService.updateAvatar(avatar);
    setProfile(ProgressService.getProfile());
  };

  const logout = () => {
    if (confirm('Are you sure you want to reset your progress?')) {
      localStorage.removeItem('mathbuddy_profile');
      setProfile(null);
      setView('welcome');
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg p-10 rounded-[3rem] shadow-2xl border-8 border-white/20 w-full max-w-md text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg rotate-3">
            <span className="text-5xl font-bold text-white">MB</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">MathBuddy</h1>
          
          <div className="mb-8">
            <p className="text-gray-500 mb-4 font-bold uppercase text-xs tracking-widest">Pick your Buddy</p>
            <div className="flex justify-center gap-4">
              {['🐱', '🐶', '🦊', '🐻'].map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedAvatar(a)}
                  className={`text-4xl p-3 rounded-2xl border-4 transition-all ${selectedAvatar === a ? 'border-indigo-500 bg-indigo-50 scale-110 shadow-lg' : 'border-gray-100 bg-white'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full p-5 bg-white border-4 border-indigo-100 rounded-2xl text-xl font-bold focus:outline-none focus:border-indigo-300 text-indigo-700 shadow-inner"
            />
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-2xl font-black rounded-2xl shadow-xl transform active:scale-95 transition-all"
            >
              Let's Go!
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const buddyMood = session.correctInARow >= 2 ? 'excited' : profile.streak > 0 ? 'happy' : session.wrongInARow > 0 ? 'sad' : 'neutral';

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto pb-24">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md text-2xl">
            {profile.avatar}
          </div>
          <div>
            <h2 className="font-black text-indigo-700 text-xl leading-none">{profile.name}</h2>
            <p className="text-purple-500 text-sm font-bold uppercase tracking-tighter">Grade 4 Explorer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('shop')}
            className="p-3 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
          <button 
            onClick={logout}
            className="p-3 bg-rose-100 text-rose-500 rounded-xl hover:bg-rose-200 transition-colors shadow-sm"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6">
        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 py-8"
            >
              <div className="flex justify-center mb-4">
                <Buddy avatar={profile.avatar} mood={buddyMood} />
              </div>

              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-2">Welcome back!</h3>
                  <p className="text-white/90 text-lg font-medium opacity-90">You've earned {profile.stars} stars so far. Keep it up!</p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <button
                      onClick={() => setView('topics')}
                      className="px-8 py-4 bg-white text-indigo-600 font-black text-xl rounded-2xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Play className="fill-current" />
                      Start Practice
                    </button>
                    {ProgressService.isDailyChallengeAvailable() && (
                      <button
                        onClick={handleStartDaily}
                        className="px-8 py-4 bg-amber-400 text-amber-900 font-black text-xl rounded-2xl shadow-lg flex items-center gap-2 hover:scale-105 transition-transform border-4 border-amber-200"
                      >
                        <Sparkles className="fill-current" />
                        Daily Challenge
                      </button>
                    )}
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setView('dashboard')}
                  className="bg-white p-6 rounded-3xl shadow-md border-2 border-purple-100 flex flex-col items-center text-center cursor-pointer hover:bg-purple-50 transition-colors"
                >
                  <LayoutDashboard className="w-10 h-10 text-purple-500 mb-2" />
                  <span className="font-black text-purple-700">Dashboard</span>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-orange-100 flex flex-col items-center text-center">
                  <TrendingUp className="w-10 h-10 text-orange-500 mb-2" />
                  <span className="font-black text-orange-700">Level {profile.difficulty === Difficulty.EASY ? '1' : profile.difficulty === Difficulty.MEDIUM ? '2' : '3'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'practice' && currentQuestion && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center py-8 gap-8"
            >
              <div className="flex items-center gap-4">
                <Buddy avatar={profile.avatar} mood={buddyMood} />
                <ScoreBoard 
                  stars={profile.stars} 
                  streak={profile.streak} 
                  difficulty={profile.difficulty} 
                />
              </div>
              <QuestionCard 
                question={currentQuestion} 
                onAnswer={handleAnswer} 
              />
              <button
                onClick={() => setView('welcome')}
                className="text-blue-500 font-bold flex items-center gap-1 hover:underline"
              >
                Back to Menu
              </button>
            </motion.div>
          )}

          {view === 'daily' && currentQuestion && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center py-8 gap-8"
            >
              <div className="text-center">
                <h3 className="text-3xl font-black text-yellow-600 flex items-center justify-center gap-2">
                  <Sparkles className="fill-current" />
                  Daily Challenge
                </h3>
                <p className="text-gray-500 font-bold">Question {dailyCount + 1} of 5</p>
              </div>
              
              <div className="w-full max-w-md bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(dailyCount / 5) * 100}%` }}
                  className="h-full bg-yellow-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <Buddy avatar={profile.avatar} mood={buddyMood} />
                <ScoreBoard 
                  stars={profile.stars} 
                  streak={profile.streak} 
                  difficulty={profile.difficulty} 
                />
              </div>
              
              <QuestionCard 
                question={currentQuestion} 
                onAnswer={handleAnswer} 
              />
              
              <button
                onClick={() => setView('welcome')}
                className="text-blue-500 font-bold flex items-center gap-1 hover:underline"
              >
                Cancel Challenge
              </button>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-2xl shadow-sm">
                    <LayoutDashboard className="text-indigo-600 w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tight">Your Progress</h3>
                </div>
                <button 
                  onClick={() => setView('welcome')}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 font-black rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-indigo-50">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-indigo-400 font-black uppercase text-xs tracking-widest mb-1">Total Accuracy</p>
                    <p className="text-5xl font-black text-indigo-600 drop-shadow-sm">
                      {profile.totalQuestions > 0 
                        ? Math.round((profile.correctAnswers / profile.totalQuestions) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <p className="text-gray-400 font-black text-sm bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {profile.correctAnswers} / {profile.totalQuestions} Correct
                  </p>
                </div>
                <ProgressBar current={profile.correctAnswers} total={profile.totalQuestions} />
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-black text-gray-700 flex items-center gap-2">
                  <AlertCircle className="text-orange-500" />
                  Focus Areas
                </h4>
                <div className="grid gap-3">
                  {(Object.entries(profile.weakAreas) as [Operation, number][]).map(([op, count]) => (
                    <div key={op} className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-50 flex justify-between items-center">
                      <span className="font-bold text-gray-700 capitalize">{op.toLowerCase()}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${count > 3 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                          {count > 3 ? 'Needs Work' : 'Doing Great'}
                        </span>
                        <span className="text-gray-400 font-bold">{count} errors</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-black text-gray-700">Badges Earned</h4>
                <div className="flex flex-wrap gap-4">
                  {profile.badges.length > 0 ? (
                    profile.badges.map(badge => (
                      <RewardBadge key={badge} name={badge} />
                    ))
                  ) : (
                    <p className="text-gray-400 font-medium italic">Start practicing to earn badges!</p>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t-2 border-gray-100">
                <button
                  onClick={() => setView('parent')}
                  className="w-full py-4 bg-purple-100 text-purple-600 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-200 transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  Parent & Teacher Portal
                </button>
              </div>
            </motion.div>
          )}

          {view === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-2xl shadow-sm">
                    <ShoppingBag className="text-amber-500 w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 tracking-tight">Buddy Shop</h3>
                </div>
                <button 
                  onClick={() => setView('welcome')}
                  className="px-4 py-2 bg-amber-50 text-amber-600 font-black rounded-xl hover:bg-amber-100 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 rounded-[3rem] shadow-2xl border-4 border-white/20 flex items-center justify-between text-white">
                <div>
                  <p className="text-white/80 font-black uppercase text-xs tracking-widest mb-1">Your Stars</p>
                  <p className="text-5xl font-black flex items-center gap-3 drop-shadow-md">
                    <Sparkles className="w-10 h-10 text-amber-200" />
                    {profile.stars}
                  </p>
                </div>
                <p className="text-white/90 text-sm font-black italic max-w-[120px] text-right leading-tight">
                  Answer questions to earn more!
                </p>
              </div>

              <AvatarShop 
                currentStars={profile.stars}
                unlockedAvatars={profile.unlockedAvatars}
                onPurchase={handlePurchase}
                onSelect={handleSelectAvatar}
                currentAvatar={profile.avatar}
              />
            </motion.div>
          )}

          {view === 'parent' && (
            <div className="py-8">
              <ParentPortal 
                profile={profile} 
                onUpdate={(p) => setProfile(p)} 
                onClose={() => setView('dashboard')} 
              />
            </div>
          )}

          {view === 'topics' && (
            <div className="py-8">
              <TopicSelector 
                profile={profile}
                onSelect={handleStartPractice}
                onBack={() => setView('welcome')}
                onMultiplicationTable={() => setView('multiplication-table')}
              />
            </div>
          )}

          {view === 'multiplication-table' && (
            <div className="py-8">
              <MultiplicationTable 
                onBack={() => setView('topics')}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t-2 border-gray-100 p-4 flex justify-around items-center max-w-2xl mx-auto rounded-t-[2rem] shadow-2xl z-50">
        <button 
          onClick={() => setView('welcome')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'welcome' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <Play className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Play</span>
        </button>
        <button 
          onClick={() => setView('shop')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'shop' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Shop</span>
        </button>
        <button 
          onClick={handleStartPractice}
          className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -translate-y-6 border-4 border-white active:scale-95 transition-all"
        >
          <ChevronRight className="text-white w-8 h-8" />
        </button>
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Stats</span>
        </button>
      </nav>
    </div>
  );
}
