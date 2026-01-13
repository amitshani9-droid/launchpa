import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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

/**
 * Handle user sign-in/registration in Firestore
 */
export const handleUserSignIn = async (user) => {
    if (!user) return null;

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            // New user registration logic
            const userData = {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                createdAt: serverTimestamp(),
                credits: 3, // Welcome gift
                isPro: false
            };
            await setDoc(userRef, userData);
            return userData;
        }
    } catch (error) {
        console.error("שגיאה ברישום משתמש ב-Firestore:", error);
        return null;
    }
};
