"use client";
import { useState, useEffect } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../lib/firebase';
import { useFirestore } from '../../../hooks/useFirestore';
import styles from './page.module.css';

function getQuestion() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const op = Math.random() > 0.5 ? "+" : "-";
  const answer = op === "+" ? a + b : a - b;
  return { a, b, op, answer };
}

export default function EasyMathTest() {
  const [user, loading] = useAuthState(auth);
  const { saveTestResult, loading: saveLoading } = useFirestore();
  const [question, setQuestion] = useState(getQuestion());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [end, setEnd] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('EasyMathTest component mounted');
    console.log('Auth loading:', loading);
    console.log('User:', user);
    console.log('Save loading:', saveLoading);
  }, [loading, user, saveLoading]);

  // Real-time timer
  useEffect(() => {
    if (!end && !loading) {
      const interval = setInterval(() => {
        setCurrentTime((Date.now() - startTime) / 1000);
      }, 100); // Update every 100ms for smoother display

      return () => clearInterval(interval);
    }
  }, [end, loading, startTime]);

  const saveScore = async () => {
    if (!user || scoreSaved) return;
    
    try {
      const time = currentTime.toFixed(1);
      
      await saveTestResult(user.uid, {
        userEmail: user.email,
        testType: 'math-easy',
        time: parseFloat(time),
        mistakesCount: mistakes.length
      });
      
      setScoreSaved(true);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = parseInt(input) === question.answer;
    
    if (isCorrect) {
      setScore(score + 1);
      setShowCorrect(true);
      setTimeout(() => setShowCorrect(false), 500);
      
      if (isReviewMode) {
        // In review mode, remove the mistake from the list
        const newMistakes = mistakes.filter((_, index) => index !== reviewIndex);
        setMistakes(newMistakes);
        
        if (newMistakes.length === 0) {
          // All mistakes corrected, test is complete
          setEnd(true);
          if (user) {
            saveScore();
          }
        } else {
          // Move to next mistake
          setReviewIndex((reviewIndex + 1) % newMistakes.length);
          setQuestion(newMistakes[(reviewIndex + 1) % newMistakes.length]);
        }
      } else {
        // Normal mode
        if (count >= 9) {
          // Initial 10 questions done, check if there are mistakes to review
          if (mistakes.length > 0) {
            setIsReviewMode(true);
            setReviewIndex(0);
            setQuestion(mistakes[0]);
          } else {
            // No mistakes, test complete
            setEnd(true);
            if (user) {
              saveScore();
            }
          }
        } else {
          setQuestion(getQuestion());
          setCount(count + 1);
        }
      }
    } else {
      // Wrong answer
      if (!isReviewMode) {
        // In normal mode, add to mistakes list
        setMistakes([...mistakes, question]);
      }
      // In review mode, stay on the same question
    }
    
    setInput("");
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleRestart = () => {
    setQuestion(getQuestion());
    setInput("");
    setScore(0);
    setCount(0);
    setEnd(false);
    setShowCorrect(false);
    setMistakes([]);
    setIsReviewMode(false);
    setReviewIndex(0);
    setScoreSaved(false);
    setCurrentTime(0);
  };

  const getTime = () => {
    return currentTime.toFixed(1);
  };

  const getProgress = () => {
    if (isReviewMode) {
      const totalQuestions = 10 + mistakes.length;
      const completedQuestions = 10 + reviewIndex;
      return (completedQuestions / totalQuestions) * 100;
    } else {
      return ((count + 1) / 10) * 100;
    }
  };

  const getCurrentQuestionNumber = () => {
    if (isReviewMode) {
      return `Review ${reviewIndex + 1} of ${mistakes.length}`;
    } else {
      return `Question ${count + 1} of 10`;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading Math Test...
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {/* Success Animation */}
      {showCorrect && (
        <div className={styles.successAnimation}>
          <div className={styles.successIcon}>✓</div>
        </div>
      )}

      <div className={styles.container}>
        {/* Header with Back Button */}
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.backButton}>
            ← Back
          </button>
          <h1 className={styles.title}>🧮 Easy Math Test</h1>
          <p className={styles.subtitle}>
            Solve 10 simple math problems as quickly as possible
          </p>
          {!user && (
            <div style={{ 
              background: 'rgba(255, 193, 7, 0.1)', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: '#f57c00'
            }}>
              🔐 Sign in to save your scores to the leaderboard!
            </div>
          )}
        </div>

        {end ? (
          /* Results Section */
          <div className={styles.resultsContainer}>
            <div className={styles.completionBadge}>
              <div className={styles.completionIcon}>🎉</div>
              <h2 className={styles.completionTitle}>Test Completed!</h2>
              <p style={{ 
                fontSize: '1rem', 
                marginTop: '0.5rem', 
                color: '#4caf50',
                fontWeight: '500'
              }}>
                Perfect Score: 10/10! 🎯
              </p>
              {user && scoreSaved && (
                <div style={{ 
                  fontSize: '0.9rem', 
                  marginTop: '0.5rem', 
                  color: '#4caf50',
                  fontWeight: '500'
                }}>
                  ✓ Score saved to leaderboard!
                </div>
              )}
              {user && !scoreSaved && saveLoading && (
                <div style={{ 
                  fontSize: '0.9rem', 
                  marginTop: '0.5rem', 
                  color: '#ff9800',
                  fontWeight: '500'
                }}>
                  Saving score...
                </div>
              )}
            </div>

            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}>
                <div className={styles.resultIcon}>⏱️</div>
                <div className={styles.resultLabel}>Time</div>
                <div className={styles.resultValue}>{getTime()}s</div>
                <div className={styles.resultSubtext}>
                  {parseFloat(getTime()) < 30 ? 'Lightning fast!' : parseFloat(getTime()) < 60 ? 'Great speed!' : 'Good pace!'}
                </div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultIcon}>🎯</div>
                <div className={styles.resultLabel}>Score</div>
                <div className={styles.resultValue}>10 / 10</div>
                <div className={styles.resultSubtext}>
                  Perfect! Everyone gets 10/10
                </div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultIcon}>🔄</div>
                <div className={styles.resultLabel}>Mistakes</div>
                <div className={styles.resultValue}>{mistakes.length}</div>
                <div className={styles.resultSubtext}>
                  {mistakes.length === 0 ? 'Perfect first try!' : 'Corrected all mistakes!'}
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button onClick={handleRestart} className={styles.newTestButton}>
                🔄 Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Test Section */
          <>
            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <p className={styles.progressText}>
                {getCurrentQuestionNumber()} • Progress: {Math.round(getProgress())}%
                {isReviewMode && (
                  <span style={{ color: '#ff9800', marginLeft: '0.5rem' }}>
                    🔄 Review Mode
                  </span>
                )}
              </p>
            </div>

            {/* Question Section */}
            <div className={styles.questionContainer}>
              <div className={styles.questionCard}>
                <div className={styles.questionText}>
                  <span className={styles.number}>{question.a}</span>
                  <span className={styles.operator}>{question.op}</span>
                  <span className={styles.number}>{question.b}</span>
                  <span className={styles.equals}>=</span>
                  <span className={styles.questionMark}>?</span>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className={styles.mathInput}
                  placeholder="Your answer"
                  required
                  autoFocus
                />
                <button type="submit" className={styles.submitButton}>
                  Next →
                </button>
              </div>
            </form>

            {/* Live Stats */}
            <div className={styles.liveStatsContainer}>
              <div className={styles.liveStatsGrid}>
                <div className={styles.liveStat}>
                  <div className={styles.liveStatIcon}>⚡</div>
                  <div className={styles.liveStatValue}>{getTime()}s</div>
                  <div className={styles.liveStatLabel}>Time</div>
                </div>

                <div className={styles.liveStat}>
                  <div className={styles.liveStatIcon}>🎯</div>
                  <div className={styles.liveStatValue}>{score}</div>
                  <div className={styles.liveStatLabel}>Correct</div>
                </div>

                <div className={styles.liveStat}>
                  <div className={styles.liveStatIcon}>🔄</div>
                  <div className={styles.liveStatValue}>{mistakes.length}</div>
                  <div className={styles.liveStatLabel}>Mistakes</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}