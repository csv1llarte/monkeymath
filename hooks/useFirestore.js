import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  where,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save a test result to Firestore
  const saveTestResult = async (userId, testData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Base test result with required fields
      const testResult = {
        userId,
        userEmail: testData.userEmail,
        testType: testData.testType, // 'typing', 'math-easy', 'math-medium', 'math-hard'
        time: testData.time,
        timestamp: new Date(),
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };

      // Add typing-specific fields if they exist
      if (testData.wpm !== undefined) {
        testResult.wpm = testData.wpm;
      }
      if (testData.score !== undefined) {
        testResult.score = testData.score;
      }
      if (testData.accuracy !== undefined) {
        testResult.accuracy = testData.accuracy;
      }
      if (testData.totalQuestions !== undefined) {
        testResult.totalQuestions = testData.totalQuestions;
      }
      if (testData.correctAnswers !== undefined) {
        testResult.correctAnswers = testData.correctAnswers;
      }
      if (testData.mistakesCount !== undefined) {
        testResult.mistakesCount = testData.mistakesCount;
      }

      const docRef = await addDoc(collection(db, 'testResults'), testResult);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get leaderboard data for a specific test type
  const getLeaderboard = async (testType, limitCount = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // For math tests, order by time (ascending - fastest first)
      // For typing tests, order by score (descending - highest first)
      const orderField = testType.startsWith('math') ? 'time' : 'score';
      const orderDirection = testType.startsWith('math') ? 'asc' : 'desc';
      
      const q = query(
        collection(db, 'testResults'),
        where('testType', '==', testType),
        orderBy(orderField, orderDirection),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const leaderboard = [];
      
      querySnapshot.forEach((doc) => {
        leaderboard.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return leaderboard;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's best scores for all test types
  const getUserBestScores = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const testTypes = ['typing', 'math-easy', 'math-medium', 'math-hard'];
      const bestScores = {};
      
      for (const testType of testTypes) {
        // For math tests, order by time (ascending - fastest first)
        // For typing tests, order by score (descending - highest first)
        const orderField = testType.startsWith('math') ? 'time' : 'score';
        const orderDirection = testType.startsWith('math') ? 'asc' : 'desc';
        
        const q = query(
          collection(db, 'testResults'),
          where('userId', '==', userId),
          where('testType', '==', testType),
          orderBy(orderField, orderDirection),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          bestScores[testType] = querySnapshot.docs[0].data();
        }
      }
      
      return bestScores;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's recent test history
  const getUserTestHistory = async (userId, limitCount = 20) => {
    setLoading(true);
    setError(null);
    
    try {
      const q = query(
        collection(db, 'testResults'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return history;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get global statistics
  const getGlobalStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const testTypes = ['typing', 'math-easy', 'math-medium', 'math-hard'];
      const stats = {};
      
      for (const testType of testTypes) {
        // For math tests, order by time (ascending - fastest first)
        // For typing tests, order by score (descending - highest first)
        const orderField = testType.startsWith('math') ? 'time' : 'score';
        const orderDirection = testType.startsWith('math') ? 'asc' : 'desc';
        
        const q = query(
          collection(db, 'testResults'),
          where('testType', '==', testType),
          orderBy(orderField, orderDirection),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const bestScore = querySnapshot.docs[0].data();
          stats[testType] = {
            bestScore: testType.startsWith('math') ? bestScore.time : bestScore.score,
            bestUser: bestScore.userEmail,
            bestTime: bestScore.time,
            bestAccuracy: bestScore.accuracy || null
          };
        }
      }
      
      return stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveTestResult,
    getLeaderboard,
    getUserBestScores,
    getUserTestHistory,
    getGlobalStats
  };
};