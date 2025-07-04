"use client";
import Link from "next/link";
import styles from './page.module.css';
import Auth from '../components/Auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [showAuth, setShowAuth] = useState(false);

  // Prevent body scrolling when overlay is active
  useEffect(() => {
    if (showAuth) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAuth]);

  const handleAuthClick = () => {
    if (user) {
      // If user is logged in, sign them out
      signOut(auth);
    } else {
      // If user is not logged in, show auth overlay
      setShowAuth(true);
    }
  };

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
      {showAuth && (
          <div 
            style={{
              position: 'fixed',
              top: '0px',
              left: '0px',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 99999,
              overflow: 'hidden',
              pointerEvents: 'auto'
            }}
            onClick={(e) => {
              // Close overlay when clicking on the background
              if (e.target === e.currentTarget) {
                setShowAuth(false);
              }
            }}
          >
            {/* X Icon at top right */}
            <button
              onClick={() => setShowAuth(false)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#fff',
                border: '2px solid #000',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                zIndex: 100000,
                pointerEvents: 'auto'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#fff';
                e.target.style.transform = 'scale(1)';
              }}
              title="Close"
            >
              ✕
            </button>
            
            <div style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              zIndex: 99999,
              pointerEvents: 'auto'
            }}>
              <Auth onClose={() => setShowAuth(false)} />
            </div>
          </div>
        )}
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🐵</div>
          <h1 className={styles.title}>MonkeyMath</h1>
        </div>
        
        <p className={styles.subtitle}>Sharpen your skills with our fun typing and math speed tests.</p>
        
        {/* Authentication Button */}
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={handleAuthClick}
            style={{
              background: 'rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              color: '#000',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.1)';
            }}
          >
            {user ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
        
        {/* Auth Overlay */}
        
        
        <div className={styles.quoteContainer}>
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
          <Link href="/leaderboard" className={styles.testButton}>
            🏆 Leaderboard
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
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <div className={styles.featureTitle}>Global Leaderboard</div>
            <div className={styles.featureDesc}>Compete with players worldwide and track your rankings</div>
          </div>
        </div>
        
        {/* Site Description */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '2rem', 
          borderRadius: '12px',
          marginTop: '2rem',
          textAlign: 'center',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#000', 
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            🎮 What is MonkeyMath?
          </h3>
          <p style={{ 
            margin: '0', 
            color: '#666', 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            MonkeyMath is your ultimate training ground for speed and accuracy! Master typing with our dynamic speed tests 
            featuring real-time feedback, or challenge your mental math skills across three difficulty levels. 
            Sign in to save your scores, compete on global leaderboards, and track your progress as you become faster and more accurate. 
            Whether you&apos;re a beginner or a speed demon, our platform helps you &ldquo;Train to be Monke&rdquo; - faster, smarter, and more precise!
          </p>
        </div>
        
        {/* Welcome message at bottom */}
        {user && (
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.1)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>Welcome back!</h2>
            <p style={{ margin: '0', color: '#666' }}>Signed in as: {user.email}</p>
          </div>
        )}
      </div>
    </main>
  );
}