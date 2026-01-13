import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 1. אתחול האפליקציה (מונע אתחול כפול ב-Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. אתחול ה-Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 3. אתחול ה-Database (התיקון לאזהרה שקיבלת)
// במקום להשתמש ב-getFirestore רגיל, אנחנו משתמשים ב-initializeFirestore
// ומגדירים לו את ה-Cache בצורה החדשה.
const db = initializeFirestore(app, {
    localCache: persistentLocalCache()
});

// 4. פונקציית התחברות מרכזית (עם טיפול בשגיאות)
export const loginWithGoogle = async () => {
    try {
        // ננסה קודם עם Popup (יותר נוח במחשב)
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Popup login failed, trying redirect...", error);
        // אם ה-Popup נחסם (קורה הרבה במובייל), נעבור ל-Redirect
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            await signInWithRedirect(auth, googleProvider);
        }
        throw error;
    }
};

export { auth, db };
