import Link from "next/link";
import styles from './page.module.css'; 

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🐵</div>
          <h1 className={styles.title}>MonkeyMath</h1>
        </div>
        
        <p className={styles.subtitle}>Sharpen your skills with our fun typing and math speed tests.</p>
        
        <div className={styles.quoteContainer}>
          <div className={styles.movingBackground}></div>
          <div className={styles.quoteText}>
            Train to be Monke
          </div>
        </div>
        
        <div className={styles.buttonsContainer}>
          <Link href="/typing-test" className={styles.testButton}>
            ⌨️ Typing Test
          </Link>
          <Link href="/math-test" className={styles.testButton}>
            🧮 Math Test
          </Link>
        </div>
        
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <div className={styles.featureTitle}>Speed Training</div>
            <div className={styles.featureDesc}>Improve your typing speed with real-time feedback</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <div className={styles.featureTitle}>Accuracy Focus</div>
            <div className={styles.featureDesc}>Track your accuracy and reduce errors</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <div className={styles.featureTitle}>Progress Tracking</div>
            <div className={styles.featureDesc}>Monitor your improvement over time</div>
          </div>
        </div>
      </div>
    </main>
  );
}