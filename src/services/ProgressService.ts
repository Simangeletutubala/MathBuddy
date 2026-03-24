import { Difficulty, StudentProfile, Operation } from '../types';

const STORAGE_KEY = 'mathbuddy_profile';

export class ProgressService {
  static getProfile(): StudentProfile | null {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    try {
      const profile = JSON.parse(data);
      
      // Migration / Defensive checks for evolving profile schema
      if (!profile.unlockedAvatars) profile.unlockedAvatars = ['🐱', '🐶', '🦊', '🐻'];
      if (!profile.avatar) profile.avatar = '🐱';
      if (profile.dailyChallengeStreak === undefined) profile.dailyChallengeStreak = 0;
      if (profile.lastDailyChallengeDate === undefined) profile.lastDailyChallengeDate = '';
      if (!profile.badges) profile.badges = [];
      if (!profile.weakAreas) {
        profile.weakAreas = {
          [Operation.ADDITION]: 0,
          [Operation.SUBTRACTION]: 0,
          [Operation.MULTIPLICATION]: 0,
          [Operation.DIVISION]: 0,
          [Operation.ROUNDING]: 0,
          [Operation.PLACE_VALUE]: 0,
          [Operation.FRACTIONS]: 0,
          [Operation.NUMBER_SENTENCES]: 0,
          [Operation.PATTERNS]: 0,
          [Operation.SHAPES_2D]: 0,
          [Operation.OBJECTS_3D]: 0,
          [Operation.DATA_HANDLING]: 0,
          [Operation.MEASUREMENT]: 0,
          [Operation.TIME]: 0,
          [Operation.PERIMETER_AREA]: 0,
          [Operation.PROBABILITY]: 0,
          [Operation.MULTIPLICATION_TABLE]: 0,
        };
      } else {
        // Ensure all operations exist in weakAreas
        Object.values(Operation).forEach(op => {
          if (profile.weakAreas[op] === undefined) {
            profile.weakAreas[op] = 0;
          }
        });
      }
      if (profile.stars === undefined) profile.stars = 0;
      if (profile.streak === undefined) profile.streak = 0;
      if (profile.bestStreak === undefined) profile.bestStreak = 0;
      if (profile.totalQuestions === undefined) profile.totalQuestions = 0;
      if (profile.correctAnswers === undefined) profile.correctAnswers = 0;
      if (!profile.difficulty) profile.difficulty = Difficulty.EASY;
      if (!profile.enabledOperations) {
        profile.enabledOperations = Object.values(Operation);
      }
      if (profile.parentPassword === undefined) profile.parentPassword = '1234'; // Default password

      return profile as StudentProfile;
    } catch (e) {
      console.error('Failed to parse profile', e);
      return null;
    }
  }

  static saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  static createProfile(name: string, avatar: string = '🐱'): StudentProfile {
    const newProfile: StudentProfile = {
      name,
      avatar,
      stars: 0,
      streak: 0,
      bestStreak: 0,
      difficulty: Difficulty.EASY,
      totalQuestions: 0,
      correctAnswers: 0,
      badges: [],
      weakAreas: {
        [Operation.ADDITION]: 0,
        [Operation.SUBTRACTION]: 0,
        [Operation.MULTIPLICATION]: 0,
        [Operation.DIVISION]: 0,
        [Operation.ROUNDING]: 0,
        [Operation.PLACE_VALUE]: 0,
        [Operation.FRACTIONS]: 0,
        [Operation.NUMBER_SENTENCES]: 0,
        [Operation.PATTERNS]: 0,
        [Operation.SHAPES_2D]: 0,
        [Operation.OBJECTS_3D]: 0,
        [Operation.DATA_HANDLING]: 0,
        [Operation.MEASUREMENT]: 0,
        [Operation.TIME]: 0,
        [Operation.PERIMETER_AREA]: 0,
        [Operation.PROBABILITY]: 0,
        [Operation.MULTIPLICATION_TABLE]: 0,
      },
      unlockedAvatars: ['🐱', '🐶', '🦊', '🐻'],
      lastPlayedDate: new Date().toISOString().split('T')[0],
      lastDailyChallengeDate: '',
      dailyChallengeStreak: 0,
      enabledOperations: Object.values(Operation),
      parentPassword: '1234',
    };
    this.saveProfile(newProfile);
    return newProfile;
  }

  static updateAvatar(avatar: string): void {
    const profile = this.getProfile();
    if (profile) {
      profile.avatar = avatar;
      this.saveProfile(profile);
    }
  }

  static unlockAvatar(avatar: string, cost: number): boolean {
    const profile = this.getProfile();
    if (profile && profile.stars >= cost && !profile.unlockedAvatars.includes(avatar)) {
      profile.stars -= cost;
      profile.unlockedAvatars.push(avatar);
      this.saveProfile(profile);
      return true;
    }
    return false;
  }

  static updateProgress(isCorrect: boolean, operation: Operation): StudentProfile {
    const profile = this.getProfile();
    if (!profile) throw new Error('No profile found');

    profile.totalQuestions += 1;
    if (isCorrect) {
      profile.correctAnswers += 1;
      profile.stars += 5;
      profile.streak += 1;
      if (profile.streak > profile.bestStreak) {
        profile.bestStreak = profile.streak;
      }
      
      // Award badges
      if (profile.stars >= 50 && !profile.badges.includes('Star Collector')) {
        profile.badges.push('Star Collector');
      }
      if (profile.streak >= 5 && !profile.badges.includes('On Fire')) {
        profile.badges.push('On Fire');
      }
      if (profile.totalQuestions >= 20 && !profile.badges.includes('Math Explorer')) {
        profile.badges.push('Math Explorer');
      }
    } else {
      profile.streak = 0;
      profile.weakAreas[operation] += 1;
    }

    this.saveProfile(profile);
    return profile;
  }

  static updateDifficulty(difficulty: Difficulty): void {
    const profile = this.getProfile();
    if (profile) {
      profile.difficulty = difficulty;
      this.saveProfile(profile);
    }
  }

  static isDailyChallengeAvailable(): boolean {
    const profile = this.getProfile();
    if (!profile) return false;
    const today = new Date().toISOString().split('T')[0];
    return profile.lastDailyChallengeDate !== today;
  }

  static completeDailyChallenge(): StudentProfile {
    const profile = this.getProfile();
    if (!profile) throw new Error('No profile found');
    
    const today = new Date().toISOString().split('T')[0];
    profile.lastDailyChallengeDate = today;
    profile.stars += 50; // Bonus stars
    profile.dailyChallengeStreak += 1;
    
    if (profile.dailyChallengeStreak >= 7 && !profile.badges.includes('Weekly Warrior')) {
      profile.badges.push('Weekly Warrior');
    }
    
    this.saveProfile(profile);
    return profile;
  }

  static updateParentSettings(password: string, enabledOperations: Operation[], difficulty: Difficulty): void {
    const profile = this.getProfile();
    if (profile) {
      profile.parentPassword = password;
      profile.enabledOperations = enabledOperations;
      profile.difficulty = difficulty;
      this.saveProfile(profile);
    }
  }
}
