import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Auth({ onClose }) {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError(''); // Clear previous errors
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Close the overlay after successful authentication
      if (onClose) onClose();
    } catch (error) {
      console.error('Auth error:', error.message);
      
      // Convert Firebase error codes to user-friendly messages
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please sign in instead.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up instead.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password sign-in is not enabled. Please contact support.';
          break;
        default:
          errorMessage = `Authentication error: ${error.message}`;
      }
      
      setAuthError(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(''); // Clear previous errors
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Close the overlay after successful authentication
      if (onClose) onClose();
    } catch (error) {
      console.error('Google sign in error:', error.message);
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email using a different sign-in method.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google sign-in is not enabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = `Google sign-in error: ${error.message}`;
      }
      
      setAuthError(errorMessage);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: '#ff6b6b', textAlign: 'center' }}>Error: {error.message}</div>;

  // If user is already signed in, show a success message
  if (user) {
    return (
      <div style={{ 
        background: 'rgba(0, 0, 0, 0.05)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          color: '#000', 
          fontSize: '1.5rem'
        }}>
          Welcome back!
        </h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          You are now signed in as: {user.email}
        </p>
        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      padding: '2rem', 
      borderRadius: '16px',
      border: '2px solid rgba(0, 0, 0, 0.1)',
      maxWidth: '450px',
      margin: '0 auto',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <h2 style={{ 
        margin: '0 0 1.5rem 0', 
        color: '#000', 
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      
      {/* Error Message Display */}
      {authError && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          border: '1px solid #ffcdd2',
          fontWeight: '500'
        }}>
          {authError}
        </div>
      )}
      
      <form onSubmit={handleEmailAuth} style={{ marginBottom: '1.5rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '1rem',
            marginBottom: '1rem',
            border: '2px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            background: '#fff',
            color: '#000',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.border = '2px solid #667eea';
            e.target.style.background = '#fff';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(0, 0, 0, 0.2)';
            e.target.style.background = '#fff';
            e.target.style.boxShadow = 'none';
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
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '2px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            background: '#fff',
            color: '#000',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.border = '2px solid #667eea';
            e.target.style.background = '#fff';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(0, 0, 0, 0.2)';
            e.target.style.background = '#fff';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      
      <button 
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          padding: '1rem',
          background: '#fff',
          border: '2px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          color: '#000',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          transition: 'all 0.2s ease',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#f8f9fa';
          e.target.style.border = '2px solid rgba(0, 0, 0, 0.3)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = '#fff';
          e.target.style.border = '2px solid rgba(0, 0, 0, 0.2)';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🔍</span>
        Sign in with Google
      </button>
      
      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          color: '#667eea',
          fontSize: '0.9rem',
          cursor: 'pointer',
          textDecoration: 'underline',
          fontWeight: '500',
          transition: 'color 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.color = '#5a67d8';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#667eea';
        }}
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
}
