"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import UpgradeModal from '@/components/UpgradeModal';
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: "",
        isPro: false,
        loading: true
    });
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [businessData, setBusinessData] = useState(null);

    useEffect(() => {
        // 1. Initial load from LocalStorage for speed
        const savedName = localStorage.getItem("userName") || "";
        const savedPro = localStorage.getItem("isPro") === "true";
        setUser(prev => ({ ...prev, name: savedName, isPro: savedPro, loading: false }));

        // 2. Sync with Firestore (Source of Truth)
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        const isProDb = data.isPro === true;

                        // Only update if different to avoid loops/renders
                        if (isProDb !== savedPro) {
                            localStorage.setItem("isPro", isProDb ? "true" : "false");
                            setUser(prev => ({ ...prev, isPro: isProDb, name: data.name || prev.name }));
                        }
                    }
                } catch (e) {
                    console.error("Error syncing user data:", e);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const updateUserName = (name) => {
        localStorage.setItem("userName", name);
        setUser(prev => ({ ...prev, name }));
    };

    const setProStatus = (status) => {
        localStorage.setItem("isPro", status ? "true" : "false");
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
        setUser({ name: "", isPro: false, loading: false });
        window.location.href = "/";
    };

    return (
        <UserContext.Provider value={{
            ...user,
            updateUserName,
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
