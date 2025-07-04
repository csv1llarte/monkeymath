"use client";
import { useState, useRef, useEffect } from "react";
import styles from './page.module.css';

function getRandomString(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const sentenceList = [
  "The quick brown fox jumps over the lazy dog near the quiet stream.",
  "She carefully placed the glass vase on the wooden shelf beside the window.",
  "Every morning, he brewed a fresh cup of coffee and read the newspaper.",
  "Learning to type faster requires consistent practice and focused effort.",
  "A sudden storm rolled in, darkening the sky and shaking the trees with wind."
];

export default function TypingTest() {
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [sampleText, setSampleText] = useState(sentenceList[0]);
  const [isClient, setIsClient] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setIsClient(true);
    setSampleText(getRandomString(sentenceList));
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleChange = (e) => {
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(e.target.value);
    if (e.target.value === sampleText) {
      setEndTime(Date.now());
      setShowToast(true);
    }
  };

  const handleRestart = () => {
    setInput("");
    setStarted(false);
    setStartTime(null);
    setEndTime(null);
    setSampleText(getRandomString(sentenceList));
    setShowToast(false);
    inputRef.current.focus();
  };

  const handleBack = () => {
    window.history.back();
  };

  const getWPM = () => {
    if (!endTime || !startTime) return 0;
    const minutes = (endTime - startTime) / 60000;
    const words = sampleText.split(" ").length;
    return (words / minutes).toFixed(1);
  };

  const getAccuracy = () => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === sampleText[i]) correct++;
    }
    return ((correct / sampleText.length) * 100).toFixed(1);
  };

  const getProgress = () => {
    return (input.length / sampleText.length) * 100;
  };

  const getCurrentWPM = () => {
    if (!started || !startTime) return 0;
    const currentTime = endTime || Date.now();
    const minutes = (currentTime - startTime) / 60000;
    const words = input.split(" ").length;
    return minutes > 0 ? (words / minutes).toFixed(1) : 0;
  };

  const getCurrentTime = () => {
    if (!started || !startTime) return 0;
    return Math.round(((endTime || Date.now()) - startTime) / 1000);
  };

  const renderTextWithHighlight = () => {
    return sampleText.split("").map((char, index) => {
      let className = styles.defaultChar;
      
      if (index < input.length) {
        if (input[index] === char) {
          className = styles.correctChar;
        } else {
          className = styles.incorrectChar;
        }
      } else if (index === input.length) {
        className = styles.currentChar;
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={styles.main}>
      {/* Toast Notification */}
      <div className={`${styles.toast} ${showToast ? styles.toastVisible : ''}`}>
        <div className={styles.toastTitle}>Test Completed! 🎉</div>
        <div className={styles.toastMessage}>
          {getWPM()} WPM • {getAccuracy()}% Accuracy
        </div>
      </div>

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
            ⚡ Typing Speed Test
          </h1>
          <p className={styles.subtitle}>
            Test your typing speed and accuracy with random sentences
          </p>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <p className={styles.progressText}>
            Progress: {Math.round(getProgress())}%
          </p>
        </div>

        {/* Sample Text */}
        <div className={styles.sampleTextContainer}>
          <div className={styles.sampleText}>
            {renderTextWithHighlight()}
          </div>
        </div>

        {/* Input Area */}
        <div className={styles.inputSection}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleChange}
            placeholder="Click here and start typing..."
            disabled={!!endTime}
            className={styles.textInput}
          />
          
          <div className={styles.buttonContainer}>
            <button
              onClick={handleRestart}
              className={styles.newTestButton}
            >
              🔄 New Test
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>📈</span>
                <span className={styles.statLabel}>Words Per Minute</span>
              </div>
              <div className={styles.statValue}>
                {started ? getCurrentWPM() : "0"}
              </div>
              {endTime && (
                <div className={styles.statBadge}>
                  Final: {getWPM()} WPM
                </div>
              )}
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>🎯</span>
                <span className={styles.statLabel}>Accuracy</span>
              </div>
              <div className={styles.statValue}>
                {input.length > 0 ? getAccuracy() : "0"}%
              </div>
              {endTime && (
                <div className={`${styles.statBadge} ${styles.accuracyBadge}`}>
                  Completed!
                </div>
              )}
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>⏱️</span>
                <span className={styles.statLabel}>Time</span>
              </div>
              <div className={styles.statValue}>
                {getCurrentTime()}s
              </div>
              {endTime && (
                <div className={`${styles.statBadge} ${styles.timeBadge}`}>
                  Finished!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={styles.instructionsContainer}>
          <h3 className={styles.instructionsTitle}>
            How to use:
          </h3>
          <p className={styles.instructionsText}>
            Click in the text area and start typing the sentence shown above. 
            Your typing speed (WPM) and accuracy will be calculated in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}