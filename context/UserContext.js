"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import UpgradeModal from '@/components/UpgradeModal';
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: "",
        uid: null,
        isPro: false,
        loading: true // Global loading state including auth & PRO check
    });
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [businessData, setBusinessData] = useState(null);

    useEffect(() => {
        let unsubscribeFirestore = null;

        // 1. Auth Listener
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            // Cleanup previous Firestore listener if user context changes
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
                unsubscribeFirestore = null;
            }

            if (currentUser) {
                // User is authenticated, wait for Firestore PRO status
                const userRef = doc(db, "users", currentUser.uid);

                // 2. Real-time PRO Sync (Single Source of Truth)
                unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const isProDb = data.isPro === true;

                        // We can cache in localStorage for UI flicker prevention, but gating logic relies on state
                        localStorage.setItem("isPro", isProDb ? "true" : "false");

                        setUser({
                            uid: currentUser.uid,
                            name: data.name || currentUser.displayName,
                            isPro: isProDb,
                            loading: false // Fully loaded
                        });
                    } else {
                        // User valid in Auth but no DB record yet (e.g. creating)
                        setUser({
                            uid: currentUser.uid,
                            name: currentUser.displayName,
                            isPro: false,
                            loading: false
                        });
                    }
                }, (error) => {
                    console.error("Firestore sync error:", error);
                    // On error, stop loading and fallback to false/safest state
                    setUser(prev => ({ ...prev, loading: false }));
                });

            } else {
                // Logged out
                localStorage.removeItem("isPro");
                setUser({ name: "", uid: null, isPro: false, loading: false });
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeFirestore) unsubscribeFirestore();
        };
    }, []);

    // Helper for optimistic updates if needed, though mostly we rely on Firestore listener
    const setProStatus = (status) => {
        setUser(prev => ({ ...prev, isPro: status }));
    };

    const openUpgradeModal = (data = null) => {
        setBusinessData(data);
        setIsUpgradeModalOpen(true);
    };

    const closeUpgradeModal = () => {
        setIsUpgradeModalOpen(false);
    };

    const logout = () => {
        localStorage.clear();
        setUser({ name: "", uid: null, isPro: false, loading: false });
        window.location.href = "/";
    };

    return (
        <UserContext.Provider value={{
            ...user, // exposes name, uid, isPro, loading
            setProStatus,
            logout,
            openUpgradeModal,
            closeUpgradeModal,
            isUpgradeModalOpen
        }}>
            {children}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={closeUpgradeModal}
                businessData={businessData}
            />
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

// Shared hook alias as requested
export const useProStatus = () => {
    const { isPro, loading } = useUser();
    return { isPro, loadingPro: loading };
};
