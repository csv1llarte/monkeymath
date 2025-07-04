import Link from "next/link";
import styles from './page.module.css';

export default function MathTest() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.backButton}>
            <Link href="/" className={styles.backLink}>
              ← Back to Home
            </Link>
          </div>
          
          <div className={styles.titleSection}>
            <div className={styles.icon}>🧮</div>
            <h1 className={styles.title}>Math Speed Test</h1>
          </div>
          <p className={styles.subtitle}>Challenge yourself with quick math problems</p>
        </div>
        
        <div className={styles.progressBar}>
          <div className={styles.progress}>Progress: 0%</div>
        </div>
        
        <div className={styles.testArea}>
          <div className={styles.problemDisplay}>
            <div className={styles.problemText}>Select a difficulty level to begin</div>
          </div>
          
          <div className={styles.inputSection}>
            <div className={styles.buttonsContainer}>
              <Link href="/math-test/easy" className={`${styles.testButton} ${styles.easy}`}>
                Easy
              </Link>
              <Link href="/math-test/medium" className={`${styles.testButton} ${styles.medium}`}>
                Medium
              </Link>
              <Link href="/math-test/hard" className={`${styles.testButton} ${styles.hard}`}>
                Hard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}