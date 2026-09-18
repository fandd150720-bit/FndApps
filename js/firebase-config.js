import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCeh7eSepWzzw39aO9YFjrceH-suyiJpC4",
    authDomain: "fndapps-c7623.firebaseapp.com",
    projectId: "fndapps-c7623",
    storageBucket: "fndapps-c7623.firebasestorage.app",
    messagingSenderId: "609494676416",
    appId: "1:609494676416:web:c7973c6658a3293eaa8e25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Expose to global scope so other standard script tags can use them
window.auth = auth;
window.db = db;
window.provider = provider;
window.signInWithPopup = signInWithPopup;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;

window.dispatchEvent(new Event('firebaseReady'));
