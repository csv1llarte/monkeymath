"use client";
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../lib/firebase';
import { useFirestore } from '../../../hooks/useFirestore';
import styles from './page.module.css';

function getQuestion() {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const op = Math.random() > 0.5 ? "×" : "÷";
  const answer = op === "×" ? a * b : b;
  return { a, b, op, answer, display: op === "×" ? `${a} × ${b}` : `${a * b} ÷ ${a}` };
}

export default function MediumMathTest() {
  const [user, loading] = useAuthState(auth);
  const { saveTestResult, loading: saveLoading } = useFirestore();
  const [question, setQuestion] = useState(getQuestion());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [end, setEnd] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const saveScore = async () => {
    if (!user || scoreSaved) return;
    
    try {
      const time = getTime();
      const accuracy = getAccuracy();
      
      await saveTestResult(user.uid, {
        userEmail: user.email,
        testType: 'math-medium',
        score: score,
        accuracy: parseFloat(accuracy),
        time: parseFloat(time),
        wpm: null,
        totalQuestions: 10,
        correctAnswers: score
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
    }
    
    setInput("");
    if (count >= 9) {
      setEnd(true);
      if (user) {
        saveScore();
      }
    } else {
      setQuestion(getQuestion());
      setCount(count + 1);
    }
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
    setScoreSaved(false);
  };

  const getTime = () => {
    return ((Date.now() - startTime) / 1000).toFixed(1);
  };

  const getProgress = () => {
    return ((count + 1) / 10) * 100;
  };

  const getAccuracy = () => {
    if (count === 0) return 100;
    return ((score / (count + 1)) * 100).toFixed(1);
  };

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
          <button
            onClick={handleBack}
            className={styles.backButton}
          >
            ← Back
          </button>
          <h1 className={styles.title}>
            🧮 Medium Math Test
          </h1>
          <p className={styles.subtitle}>
            Solve 10 multiplication and division problems as quickly as possible
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
                <div className={styles.resultIcon}>🎯</div>
                <div className={styles.resultLabel}>Score</div>
                <div className={styles.resultValue}>{score} / 10</div>
                <div className={styles.resultSubtext}>
                  {score >= 8 ? 'Excellent!' : score >= 6 ? 'Good job!' : 'Keep practicing!'}
                </div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultIcon}>⏱️</div>
                <div className={styles.resultLabel}>Time</div>
                <div className={styles.resultValue}>{getTime()}s</div>
                <div className={styles.resultSubtext}>
                  {parseFloat(getTime()) < 45 ? 'Lightning fast!' : 'Nice pace!'}
                </div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultIcon}>📊</div>
                <div className={styles.resultLabel}>Accuracy</div>
                <div className={styles.resultValue}>{getAccuracy()}%</div>
                <div className={styles.resultSubtext}>
                  {parseFloat(getAccuracy()) >= 90 ? 'Perfect!' : 'Room to improve!'}
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                onClick={handleRestart}
                className={styles.newTestButton}
              >
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
                Question {count + 1} of 10 • Progress: {Math.round(getProgress())}%
              </p>
            </div>

            {/* Question Section */}
            <div className={styles.questionContainer}>
              <div className={styles.questionCard}>
                <div className={styles.questionText}>
                  <span className={styles.mathExpression}>{question.display}</span>
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
                  <div className={styles.liveStatIcon}>📈</div>
                  <div className={styles.liveStatValue}>{getAccuracy()}%</div>
                  <div className={styles.liveStatLabel}>Accuracy</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Instructions */}
        <div className={styles.instructionsContainer}>
          <h3 className={styles.instructionsTitle}>
            How to use:
          </h3>
          <p className={styles.instructionsText}>
            Solve each multiplication (×) or division (÷) problem by entering your answer and pressing Next. 
            Complete all 10 questions as quickly and accurately as possible.
          </p>
        </div>
      </div>
    </div>
  );
}