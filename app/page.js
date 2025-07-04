"use client";
import Link from "next/link";
import styles from './page.module.css';
import Auth from '../components/Auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🐵</div>
          <h1 className={styles.title}>MonkeyMath</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading...</p>
        </div>
      </div>
    </main>
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🐵</div>
          <h1 className={styles.title}>MonkeyMath</h1>
        </div>
        
        <p className={styles.subtitle}>Sharpen your skills with our fun typing and math speed tests.</p>
        
        {/* Authentication Component */}
        <div style={{ marginBottom: '2rem' }}>
          <Auth />
        </div>
        
        {user && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Welcome back!</h2>
            <p style={{ margin: '0', color: '#ccc' }}>Signed in as: {user.email}</p>
          </div>
        )}
        
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