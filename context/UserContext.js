"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: "",
        isPro: false,
        loading: true
    });

    useEffect(() => {
        const savedName = localStorage.getItem("userName") || "";
        const savedPro = localStorage.getItem("isProUser") === "true";
        setTimeout(() => {
            setUser({ name: savedName, isPro: savedPro, loading: false });
        }, 0);
    }, []);

    const updateUserName = (name) => {
        localStorage.setItem("userName", name);
        setUser(prev => ({ ...prev, name }));
    };

    const setProStatus = (status) => {
        localStorage.setItem("isProUser", status ? "true" : "false");
        setUser(prev => ({ ...prev, isPro: status }));
    };

    const logout = () => {
        localStorage.clear();
        setUser({ name: "", isPro: false, loading: false });
        window.location.href = "/";
    };

    return (
        <UserContext.Provider value={{ ...user, updateUserName, setProStatus, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
