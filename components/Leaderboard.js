"use client";
import { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function Leaderboard() {
  const [user, loading] = useAuthState(auth);
  const { getLeaderboard, getUserBestScores, getGlobalStats, loading: firestoreLoading, error } = useFirestore();
  const [selectedTest, setSelectedTest] = useState('typing');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userBestScores, setUserBestScores] = useState({});
  const [globalStats, setGlobalStats] = useState({});

  const testTypes = [
    { id: 'typing', name: 'Typing Test', icon: '⌨️' },
    { id: 'math-easy', name: 'Math Easy', icon: '🧮' },
    { id: 'math-medium', name: 'Math Medium', icon: '🧮' },
    { id: 'math-hard', name: 'Math Hard', icon: '🧮' }
  ];

  useEffect(() => {
    loadLeaderboardData();
    if (user) {
      loadUserBestScores();
    }
    loadGlobalStats();
  }, [selectedTest, user]);

  const loadLeaderboardData = async () => {
    try {
      const data = await getLeaderboard(selectedTest, 20);
      setLeaderboardData(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  };

  const loadUserBestScores = async () => {
    try {
      const scores = await getUserBestScores(user.uid);
      setUserBestScores(scores);
    } catch (err) {
      console.error('Error loading user scores:', err);
    }
  };

  const loadGlobalStats = async () => {
    try {
      const stats = await getGlobalStats();
      setGlobalStats(stats);
    } catch (err) {
      console.error('Error loading global stats:', err);
    }
  };

  const formatScore = (testType, score, accuracy, time, wpm) => {
    if (testType === 'typing') {
      return `${wpm} WPM • ${accuracy}% • ${time}s`;
    } else {
      return `${score}/10 • ${accuracy}% • ${time}s`;
    }
  };

  const getTestTypeDisplayName = (testType) => {
    const test = testTypes.find(t => t.id === testType);
    return test ? test.name : testType;
  };

  const getTestIcon = (testType) => {
    const test = testTypes.find(t => t.id === testType);
    return test ? test.icon : '📊';
  };

  const getUserRank = (userEmail) => {
    const rank = leaderboardData.findIndex(entry => entry.userEmail === userEmail);
    return rank >= 0 ? rank + 1 : null;
  };

  if (loading || firestoreLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Error loading leaderboard</div>
        <div style={{ fontSize: '0.9rem' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'rgba(0, 0, 0, 0.05)', 
      padding: '1.5rem', 
      borderRadius: '12px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          margin: '0 0 0.5rem 0', 
          color: '#000', 
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          🏆 Leaderboard
        </h2>
        <p style={{ margin: '0', color: '#666', fontSize: '1rem' }}>
          See how you rank against other players
        </p>
      </div>

      {/* Test Type Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {testTypes.map((test) => (
          <button
            key={test.id}
            onClick={() => setSelectedTest(test.id)}
            style={{
              padding: '0.75rem 1.5rem',
              background: selectedTest === test.id 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              color: selectedTest === test.id ? '#fff' : '#000',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: selectedTest === test.id ? '600' : '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (selectedTest !== test.id) {
                e.target.style.background = 'rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedTest !== test.id) {
                e.target.style.background = 'rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {test.icon} {test.name}
          </button>
        ))}
      </div>

      {/* Global Stats */}
      {globalStats[selectedTest] && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.8)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              🌟 World Record
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
              {selectedTest === 'typing' 
                ? `${globalStats[selectedTest].bestScore} WPM`
                : `${globalStats[selectedTest].bestScore}/10`
              }
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
              by {globalStats[selectedTest].bestUser}
            </div>
          </div>
        </div>
      )}

      {/* User's Best Score */}
      {user && userBestScores[selectedTest] && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          border: '2px solid #667eea'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              🎯 Your Best Score
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea' }}>
              {selectedTest === 'typing' 
                ? `${userBestScores[selectedTest].wpm} WPM`
                : `${userBestScores[selectedTest].score}/10`
              }
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
              {formatScore(
                selectedTest,
                userBestScores[selectedTest].score,
                userBestScores[selectedTest].accuracy,
                userBestScores[selectedTest].time,
                userBestScores[selectedTest].wpm
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '8px', 
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.05)', 
          padding: '1rem', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          fontWeight: '600',
          fontSize: '1.1rem'
        }}>
          Top 20 - {getTestTypeDisplayName(selectedTest)}
        </div>
        
        {leaderboardData.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#666',
            fontSize: '1rem'
          }}>
            No scores yet for this test type. Be the first to set a record!
          </div>
        ) : (
          <div>
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.id}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: user && entry.userEmail === user.email 
                    ? 'rgba(102, 126, 234, 0.1)' 
                    : 'transparent'
                }}
              >
                {/* Rank */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  background: index === 0 ? '#ffd700' : 
                             index === 1 ? '#c0c0c0' : 
                             index === 2 ? '#cd7f32' : 
                             'rgba(0, 0, 0, 0.1)',
                  color: index < 3 ? '#000' : '#666'
                }}>
                  {index + 1}
                </div>

                {/* User Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '1rem',
                    color: user && entry.userEmail === user.email ? '#667eea' : '#000'
                  }}>
                    {entry.userEmail}
                    {user && entry.userEmail === user.email && (
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.8rem', 
                        color: '#667eea',
                        fontWeight: 'normal'
                      }}>
                        (You)
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#666',
                    marginTop: '0.25rem'
                  }}>
                    {formatScore(
                      entry.testType,
                      entry.score,
                      entry.accuracy,
                      entry.time,
                      entry.wpm
                    )}
                  </div>
                </div>

                {/* Score */}
                <div style={{ 
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  color: '#667eea'
                }}>
                  {selectedTest === 'typing' ? entry.wpm : entry.score}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign In Prompt */}
      {!user && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            🔐 Sign in to track your scores and compete on the leaderboard!
          </div>
        </div>
      )}
    </div>
  );
} 