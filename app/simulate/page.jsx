"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RocketPreview from "@/components/RocketPreview";
import { useUser } from "@/context/UserContext";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

function SimulateContent() {
    const params = useSearchParams();
    const router = useRouter();
    const siteId = params.get("id");

    const { isPro, setProStatus, openUpgradeModal } = useUser();
    const [progress, setProgress] = useState(0);
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.data()?.isPro) setProStatus(true);
        });
        return () => unsub();
    }, [user, setProStatus]);

    useEffect(() => {
        let interval;
        if (progress < 100) {
            interval = setInterval(() => {
                setProgress(prev => Math.min(prev + Math.random() * 15, 100));
            }, 600);
        } else {
            setLoading(false);
        }
        return () => clearInterval(interval);
    }, [progress]);

    useEffect(() => {
        async function fetchSite() {
            if (siteId) {
                try {
                    const docSnap = await getDoc(doc(db, "sites", siteId));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setSiteData(data);
                    }
                } catch (e) {
                    console.error("Error fetching site:", e);
                }
            }
        }
        fetchSite();
    }, [siteId]);

    const handleUpgradeTrigger = () => {
        openUpgradeModal({
            businessType: siteData?.prompt || "עסק כללי",
            goal: "הורדת קוד מקור מלא"
        });
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={progressBoxStyle}>
                    <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>ה-AI בונה את האתר שלך... 🪄</h2>
                    <div style={progressBarBg}>
                        <div style={{ ...progressBarFill, width: `${progress}%` }} />
                    </div>
                    <p style={{ marginTop: "15px", color: "#94a3b8" }}>{Math.floor(progress)}% הושלמו</p>
                    <div style={tipsStyle}>
                        {progress < 30 && "⚡ מנתח את העסק שלך..."}
                        {progress >= 30 && progress < 60 && "🎨 מעצב ממשק משתמש יוקרתי..."}
                        {progress >= 60 && progress < 90 && "✍️ כותב טקסטים שיווקיים..."}
                        {progress >= 90 && "🚀 כמעט מוכן להשקה!"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={statusBadge}>
                    <span style={pulseDot}></span>
                    מצב תצוגה מקדימה (Mockup)
                </div>
                <h1 style={titleStyle}>האתר שלך מוכן! 🎉</h1>
                <p style={subtitleStyle}>ככה יראה דף הנחיתה החדש שלך.</p>

                <div style={actionRow}>
                    <button onClick={() => router.push(`/result?id=${siteId}&local=true`)} style={secondaryBtn}>
                        ערוך טקסטים ועיצוב ✏️
                    </button>
                    <button onClick={handleUpgradeTrigger} style={primaryBtn}>
                        פתיחת האתר והורדת הקוד 🔒
                    </button>
                </div>
            </div>

            <div style={previewWrapper}>
                <div style={browserFrame}>
                    <div style={browserHeader}>
                        <div style={dots}><span style={red}></span><span style={yellow}></span><span style={green}></span></div>
                        <div style={addressBar}>launchpage.ai/preview</div>
                    </div>
                    <div style={previewScroll}>
                        <RocketPreview data={siteData} />
                    </div>
                </div>

                {!isPro && (
                    <div style={paywallOverlay}>
                        <div style={paywallContent}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>האתר נעול זמנית 🔒</h3>
                            <p style={{ marginBottom: '20px', color: '#cbd5e1' }}>כדי לקבל את קבצי האתר המלאים (ZIP), להסיר את סימן המים ולחבר דומיין אישי - יש לשדרג ל-PRO.</p>
                            <button onClick={handleUpgradeTrigger} style={unlockBtnLarge}>שדרג עכשיו וקבל גישה מלאה</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Styles ---
const containerStyle = { minHeight: "100vh", background: "#020617", color: "white", padding: "120px 20px 60px", direction: "rtl", display: 'flex', flexDirection: 'column', alignItems: 'center' };
const progressBoxStyle = { maxWidth: "600px", width: "100%", textAlign: "center", background: "rgba(30, 41, 59, 0.4)", padding: "50px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)" };
const progressBarBg = { width: "100%", height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden", marginTop: "20px" };
const progressBarFill = { height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", transition: "width 0.4s ease-out" };
const tipsStyle = { marginTop: "30px", fontSize: "1.1rem", color: "#60a5fa", fontWeight: "bold" };
const headerStyle = { textAlign: 'center', marginBottom: '50px', maxWidth: '800px' };
const statusBadge = { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.9rem', color: '#60a5fa', marginBottom: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' };
const pulseDot = { width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6' };
const titleStyle = { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '15px' };
const subtitleStyle = { fontSize: '1.2rem', color: '#94a3b8', marginBottom: '35px' };
const actionRow = { display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' };
const primaryBtn = { padding: '16px 32px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '16px', color: 'white', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)' };
const secondaryBtn = { padding: '16px 32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' };
const previewWrapper = { width: '100%', maxWidth: '1200px', position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' };
const browserFrame = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' };
const browserHeader = { background: '#0f172a', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '40px' };
const dots = { display: 'flex', gap: '8px' };
const red = { width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' };
const yellow = { width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' };
const green = { width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' };
const addressBar = { flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' };
const previewScroll = { height: '70vh', overflowY: 'auto' };
const paywallOverlay = { position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
const paywallContent = { textAlign: 'center', maxWidth: '450px', padding: '40px', background: '#1e293b', borderRadius: '24px', border: '1px solid #3b82f6', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' };
const unlockBtnLarge = { width: '100%', padding: '18px', background: '#22c55e', color: 'white', borderRadius: '14px', border: 'none', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(34,197,94,0.4)' };

export default function SimulatePage() {
    return (
        <Suspense fallback={<div style={containerStyle}>טוען סימולציה... 🚀</div>}>
            <SimulateContent />
        </Suspense>
    );
}
