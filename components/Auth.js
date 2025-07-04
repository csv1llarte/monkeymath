import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Auth() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Auth error:', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign in error:', error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: '#ff6b6b', textAlign: 'center' }}>Error: {error.message}</div>;

  if (user) {
    return (
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleSignOut}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'rgba(0, 0, 0, 0.05)', 
      padding: '1.5rem', 
      borderRadius: '12px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h2 style={{ 
        margin: '0 0 1rem 0', 
        color: '#000', 
        textAlign: 'center',
        fontSize: '1.5rem'
      }}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      
      <form onSubmit={handleEmailAuth} style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            border: '1px solid rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            background: '#fff',
            color: '#000',
            fontSize: '0.9rem',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.border = '1px solid rgba(0, 0, 0, 0.6)';
            e.target.style.background = '#fff';
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid rgba(0, 0, 0, 0.3)';
            e.target.style.background = '#fff';
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            border: '1px solid rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            background: '#fff',
            color: '#000',
            fontSize: '0.9rem',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.border = '1px solid rgba(0, 0, 0, 0.6)';
            e.target.style.background = '#fff';
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid rgba(0, 0, 0, 0.3)';
            e.target.style.background = '#fff';
          }}
        />
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      
      <button 
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '6px',
          color: '#000',
          fontSize: '0.9rem',
          cursor: 'pointer',
          marginBottom: '1rem',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.1)';
        }}
      >
        Sign in with Google
      </button>
      
      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          color: '#666',
          fontSize: '0.8rem',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
}
