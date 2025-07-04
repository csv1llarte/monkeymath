"use client";
import Link from "next/link";
import Leaderboard from "../../components/Leaderboard";
import styles from '../page.module.css';

export default function LeaderboardPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header with Back Button */}
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px',
          zIndex: 1000
        }}>
          <Link href="/" style={{
            background: 'rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            color: '#000',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}>
            ← Back to Home
          </Link>
        </div>

        {/* Leaderboard Component */}
        <div style={{ paddingTop: '2rem' }}>
          <Leaderboard />
        </div>
      </div>
    </main>
  );
} 