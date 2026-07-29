// Firebase Config Details (Corrected API Key with 'O')
const firebaseConfig = {
  apiKey: "AIzaSyB9rri8KqOjDWJmUBfkWDdfP73NhGONKlQ",
  authDomain: "campusconnect-1528f.firebaseapp.com",
  projectId: "campusconnect-1528f",
  storageBucket: "campusconnect-1528f.firebasestorage.app",
  messagingSenderId: "450559562594",
  appId: "1:450559562594:web:b73bef3ea8b00d1334123b"
};

// Initialize Firebase App
const app = firebase.initializeApp(firebaseConfig);

// Initialize Services
const auth = firebase.auth();
const db = firebase.firestore();