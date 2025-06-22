import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

export interface SessionStats {
  completedSessions: number;
  averageScore: number;
  topicsMastered: number;
  totalSpeakingTime: number;
  bestScore: number;
  improvementPercentage: number;
}

export interface RecentSession {
  id: string;
  topicId: string;
  topicTitle: string;
  date: any;
  performance: number;
  duration: number;
  difficulty: string;
  participants: number;
}

export interface SessionMetrics {
  participation: number;
  clarity: number;
  relevance: number;
  leadership: number;
  criticalThinking: number;
  activeListening: number;
  confidence: number;
}

export interface SessionHistory {
  id: string;
  topicId: string;
  topicTitle: string;
  date: any;
  metrics: SessionMetrics;
  overallScore: number;
  duration: number;
  difficulty: string;
  participants: number;
}

export interface UserData {
  userId: string;
  sessionStats: SessionStats;
  recentSessions: RecentSession[];
  sessionHistory: SessionHistory[];
  progressData: Array<{
    week: string;
    score: number;
    sessions: number;
  }>;
  skillBreakdown: Array<{
    skill: string;
    score: number;
  }>;
}

// Initialize user data structure
export const initializeUserData = async (user: User): Promise<void> => {
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const initialData: UserData = {
      userId: user.uid,
      sessionStats: {
        completedSessions: 0,
        averageScore: 0,
        topicsMastered: 0,
        totalSpeakingTime: 0,
        bestScore: 0,
        improvementPercentage: 0
      },
      recentSessions: [],
      sessionHistory: [],
      progressData: [
        { week: 'Week 1', score: 0, sessions: 0 },
        { week: 'Week 2', score: 0, sessions: 0 },
        { week: 'Week 3', score: 0, sessions: 0 },
        { week: 'Week 4', score: 0, sessions: 0 },
        { week: 'Week 5', score: 0, sessions: 0 },
        { week: 'Week 6', score: 0, sessions: 0 },
      ],
      skillBreakdown: [
        { skill: 'Communication', score: 0 },
        { skill: 'Critical Thinking', score: 0 },
        { skill: 'Leadership', score: 0 },
        { skill: 'Active Listening', score: 0 },
        { skill: 'Confidence', score: 0 }
      ]
    };

    await setDoc(userDocRef, initialData);
  }
};

// Get user data
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Listen to real-time user data updates
export const subscribeToUserData = (
  userId: string, 
  callback: (userData: UserData | null) => void
): (() => void) => {
  const userDocRef = doc(db, 'users', userId);
  
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error listening to user data:', error);
    callback(null);
  });
};

// Add a new session
export const addSession = async (
  userId: string,
  sessionData: {
    topicId: string;
    topicTitle: string;
    metrics: SessionMetrics;
    overallScore: number;
    duration: number;
    difficulty: string;
    participants: number;
    timestamp: Date;
  }
): Promise<void> => {
  try {
    console.log('Adding session for user:', userId);
    console.log('Session data:', sessionData);

    // Add to sessions collection with proper timestamp
    const sessionRef = await addDoc(collection(db, 'sessions'), {
      userId,
      topicId: sessionData.topicId,
      topicTitle: sessionData.topicTitle,
      metrics: sessionData.metrics,
      overallScore: sessionData.overallScore,
      duration: sessionData.duration,
      difficulty: sessionData.difficulty,
      participants: sessionData.participants,
      date: serverTimestamp() // Use server timestamp for consistency
    });

    console.log('Session added with ID:', sessionRef.id);

    // Update user data
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      
      // Create new session objects with proper date handling
      const newRecentSession: RecentSession = {
        id: sessionRef.id,
        topicId: sessionData.topicId,
        topicTitle: sessionData.topicTitle,
        date: serverTimestamp(),
        performance: sessionData.overallScore,
        duration: sessionData.duration,
        difficulty: sessionData.difficulty,
        participants: sessionData.participants
      };

      const newHistorySession: SessionHistory = {
        id: sessionRef.id,
        topicId: sessionData.topicId,
        topicTitle: sessionData.topicTitle,
        date: serverTimestamp(),
        metrics: sessionData.metrics,
        overallScore: sessionData.overallScore,
        duration: sessionData.duration,
        difficulty: sessionData.difficulty,
        participants: sessionData.participants
      };

      // Update recent sessions (keep last 5)
      const updatedRecentSessions = [newRecentSession, ...userData.recentSessions].slice(0, 5);
      
      // Update session history
      const updatedSessionHistory = [newHistorySession, ...userData.sessionHistory];

      // Calculate new stats
      const completedSessions = userData.sessionStats.completedSessions + 1;
      const totalScore = userData.sessionStats.averageScore * userData.sessionStats.completedSessions + sessionData.overallScore;
      const averageScore = Math.round(totalScore / completedSessions);
      const bestScore = Math.max(userData.sessionStats.bestScore, sessionData.overallScore);
      const totalSpeakingTime = userData.sessionStats.totalSpeakingTime + sessionData.duration;
      
      // Calculate improvement percentage
      const oldAverage = userData.sessionStats.averageScore;
      const improvementPercentage = oldAverage > 0 ? Math.round(((averageScore - oldAverage) / oldAverage) * 100) : 0;

      // Update skill breakdown
      const updatedSkillBreakdown = userData.skillBreakdown.map(skill => {
        let metricValue = 0;
        switch (skill.skill.toLowerCase()) {
          case 'communication':
            metricValue = sessionData.metrics.clarity;
            break;
          case 'critical thinking':
            metricValue = sessionData.metrics.criticalThinking;
            break;
          case 'leadership':
            metricValue = sessionData.metrics.leadership;
            break;
          case 'active listening':
            metricValue = sessionData.metrics.activeListening;
            break;
          case 'confidence':
            metricValue = sessionData.metrics.confidence;
            break;
          default:
            metricValue = skill.score;
        }
        
        return {
          ...skill,
          score: skill.score === 0 ? metricValue : Math.round((skill.score + metricValue) / 2)
        };
      });

      // Update progress data (current week)
      const currentWeekIndex = Math.min(completedSessions - 1, 5);
      const updatedProgressData = userData.progressData.map((week, index) => {
        if (index === currentWeekIndex) {
          return {
            ...week,
            score: averageScore,
            sessions: completedSessions
          };
        }
        return week;
      });

      // Update user document
      await updateDoc(userDocRef, {
        sessionStats: {
          completedSessions,
          averageScore,
          topicsMastered: userData.sessionStats.topicsMastered + (sessionData.overallScore >= 80 ? 1 : 0),
          totalSpeakingTime,
          bestScore,
          improvementPercentage
        },
        recentSessions: updatedRecentSessions,
        sessionHistory: updatedSessionHistory,
        skillBreakdown: updatedSkillBreakdown,
        progressData: updatedProgressData
      });

      console.log('User data updated successfully');
    } else {
      console.error('User document not found');
      throw new Error('User document not found');
    }
  } catch (error) {
    console.error('Error adding session:', error);
    throw error;
  }
};

// Get session history with pagination
export const getSessionHistory = async (
  userId: string, 
  limitCount: number = 10
): Promise<SessionHistory[]> => {
  try {
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(sessionsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SessionHistory[];
  } catch (error) {
    console.error('Error fetching session history:', error);
    return [];
  }
};

// Update user preferences
export const updateUserPreferences = async (
  userId: string, 
  preferences: any
): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      preferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};