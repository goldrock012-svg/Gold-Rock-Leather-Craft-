import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  updatePassword
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  orderBy,
  limit,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  addDoc 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCQ2utpBgtsx4UEJH6jRLA1AfL3WHrb_1I",
  authDomain: "goldrock-dd689.firebaseapp.com",
  projectId: "goldrock-dd689",
  storageBucket: "goldrock-dd689.firebasestorage.app",
  messagingSenderId: "500237466663",
  appId: "1:500237466663:web:248dbea00f6055d9026202"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  app,
  db,
  auth,
  storage,
  // Firestore exports
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
  // Auth exports
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  // Storage exports
  ref,
  uploadBytes,
  getDownloadURL
};
