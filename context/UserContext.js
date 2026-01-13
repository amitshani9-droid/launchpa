"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import UpgradeModal from '@/components/UpgradeModal';

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
        const savedName = localStorage.getItem("userName") || "";
        const savedPro = localStorage.getItem("isPro") === "true";
        setTimeout(() => {
            setUser({ name: savedName, isPro: savedPro, loading: false });
        }, 0);
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
