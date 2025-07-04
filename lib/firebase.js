import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCAwrZvf84BKi9C99-n8KvRbpU8ZcI_cuQ",
  authDomain: "monkeymath-a0308.firebaseapp.com",
  projectId: "monkeymath-a0308",
  storageBucket: "monkeymath-a0308.firebasestorage.app",
  messagingSenderId: "158501272008",
  appId: "1:158501272008:web:e37782714ca576b614a8fd",
  measurementId: "G-E86CLPKEW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
