import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

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

// Safe initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firestore with settings to avoid "transport errored" (common in some corporate/educational networks or Vercel edge)
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Force long polling to bypass proxy/stream issues
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

export const googleProvider = new GoogleAuthProvider();

// Handle the Redirect flow returning to the page
// Only run this once on mount/load
if (isBrowser) {
    getRedirectResult(auth)
        .then((result) => {
            if (result) {
                console.log("Redirect login successful:", result.user);
                handleUserSignIn(result.user);
            }
        })
        .catch((error) => {
            console.error("Redirect login error:", error);
        });
}

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return handleUserSignIn(result.user);
    } catch (error) {
        // Silently handle popup closure/blocking by falling back to redirect
        // This cleaning up the console from "auth/cancelled-popup-request"
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
            try {
                // console.log("Popup blocked/closed. Falling back to redirect..."); // Optional debug
                await signInWithRedirect(auth, googleProvider);
                return null;
            } catch (redirectError) {
                console.error("Redirect logic failed:", redirectError);
                throw redirectError;
            }
        }

        // Log real errors
        console.error("Login failed:", error);
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
