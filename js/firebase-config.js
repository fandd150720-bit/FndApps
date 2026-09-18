// Firebase Compat SDK - works with regular script tags (no race condition)
const firebaseConfig = {
    apiKey: "AIzaSyCeh7eSepWzzw39aO9YFjrceH-suyiJpC4",
    authDomain: "fndapps-c7623.firebaseapp.com",
    projectId: "fndapps-c7623",
    storageBucket: "fndapps-c7623.firebasestorage.app",
    messagingSenderId: "609494676416",
    appId: "1:609494676416:web:c7973c6658a3293eaa8e25"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// Expose to global scope for other scripts
window.auth = auth;
window.db = db;
window.provider = provider;

// Compat API functions mapped to window
window.signInWithPopup = (auth, provider) => auth.signInWithPopup(provider);
window.signOut = () => auth.signOut();
window.onAuthStateChanged = (auth, callback) => auth.onAuthStateChanged(callback);
window.doc = (db, col, id) => db.collection(col).doc(id);
window.setDoc = (ref, data) => ref.set(data);
window.getDoc = async (ref) => {
    const snap = await ref.get();
    return { exists: () => snap.exists, data: () => snap.data() };
};
