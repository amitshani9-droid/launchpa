import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        console.warn("⚠️ Firebase API Key missing in browser! Check your .env.local");
    }
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (isBrowser ? "" : "dummy-key"),
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (isBrowser ? "" : "dummy-domain"),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (isBrowser ? "" : "launchpage-dummy"),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (isBrowser ? "" : "dummy-bucket"),
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (isBrowser ? "" : "00000000"),
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (isBrowser ? "" : "1:00000000:web:0000"),
    measurementId: "G-H6ZPG88NJF"
};

console.log("🔥 Initializing Firebase for project:", firebaseConfig.projectId);

// אתחול בטוח ל-Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // הגדרת הפניה למסמך המשתמש לפי ה-UID הייחודי שלו
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        // אם המשתמש לא קיים ב-Database, ניצור אותו
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                isPro: false, // כברירת מחדל הוא משתמש רגיל
                createdAt: serverTimestamp(), // זמן יצירה
            });
            console.log("משתמש חדש נרשם במערכת!");
        } else {
            console.log("משתמש קיים התחבר.");
        }

        return user;
    } catch (error) {
        console.error("שגיאה בהתחברות:", error);
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
