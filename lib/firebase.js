import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBV7WFd_c9gtd1i7otvNj2brclYHU0COPo",
    authDomain: "launchpage-ai.firebaseapp.com",
    projectId: "launchpage-ai",
    storageBucket: "launchpage-ai.firebasestorage.app",
    messagingSenderId: "1083607031285",
    appId: "1:1083607031285:web:47a8d652286e07478e54bc",
    measurementId: "G-H6ZPG88NJF"
};

// אתחול בטוח ל-Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("שגיאת התחברות:", error.code, error.message);
        throw error;
    }
};
