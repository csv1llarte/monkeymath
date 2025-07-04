"use client";
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function FirebaseTest() {
  const [user, loading, error] = useAuthState(auth);
  const [testResult, setTestResult] = useState('');

  const testFirebaseConnection = () => {
    setTestResult('Testing Firebase connection...');
    
    if (auth) {
      setTestResult('✅ Firebase Auth is initialized');
    } else {
      setTestResult('❌ Firebase Auth is not initialized');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ 
      background: 'rgba(0, 0, 0, 0.05)', 
      padding: '1rem', 
      borderRadius: '8px',
      margin: '1rem 0',
      fontSize: '0.9rem'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#000' }}>Firebase Test</h3>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Auth Status:</strong> {user ? '✅ Signed In' : '❌ Not Signed In'}
      </div>
      
      {user && (
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>User Email:</strong> {user.email}
        </div>
      )}
      
      {error && (
        <div style={{ marginBottom: '0.5rem', color: '#ff6b6b' }}>
          <strong>Auth Error:</strong> {error.message}
        </div>
      )}
      
      <button 
        onClick={testFirebaseConnection}
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}
      >
        Test Connection
      </button>
      
      {testResult && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
          {testResult}
        </div>
      )}
    </div>
  );
} 