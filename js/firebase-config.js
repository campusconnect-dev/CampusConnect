// ==========================================
// CAMPUSCONNECT FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyB9rri8KqOjDWJmUBfkWDdfP73NhGONKlQ",
    authDomain: "campusconnect-1528f.firebaseapp.com",
    projectId: "campusconnect-1528f",
    storageBucket: "campusconnect-1528f.firebasestorage.app",
    messagingSenderId: "450559562594",
    appId: "1:450559562594:web:b73bef3ea8b00d1334123b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
