"use client";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { renderHtml } from '@/lib/landing/renderHtml';
import { downloadStandaloneSite } from '@/lib/landing/downloadSite';
import { VALID_PRO_CODES, SUPPORT_PHONE } from '@/lib/constants';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function SimulateContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [unlockCode, setUnlockCode] = useState("");
    const [user, setUser] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const siteId = searchParams.get('id');
    const { isPro, setProStatus } = useUser();

    // Persistent PRO check
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedPro = localStorage.getItem("isPro") === "true";
            if (savedPro) setProStatus(true);
        }
    }, [setProStatus]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
            if (currentUser) {
                const unsubSnap = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    if (doc.exists() && doc.data().isPro) {
                        setProStatus(true);
                        localStorage.setItem("isPro", "true");
                    }
                });
                return () => unsubSnap();
            }
        });
        return () => unsubscribe();
    }, [setProStatus]);

    useEffect(() => {
        const fetchSiteData = async () => {
            if (!siteId) { setLoading(false); return; }
            try {
                const docSnap = await getDoc(doc(db, "sites", siteId));
                if (docSnap.exists()) setSiteData(docSnap.data());
            } catch (error) { setErrorMessage("חיבור ה-Firestore נכשל."); }
            finally { setLoading(false); }
        };
        fetchSiteData();
    }, [siteId]);

    const desc = siteData?.prompt || searchParams.get('desc') || 'האתר שלך';
    const theme = siteData?.theme || searchParams.get('theme') || 'light';

    const handleUnlock = () => {
        const normalizedCode = unlockCode.trim().toUpperCase();
        if (VALID_PRO_CODES.includes(normalizedCode)) {
            setProStatus(true);
            localStorage.setItem("isPro", "true");
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            setShowUpgradeModal(false);
            setShowSuccessModal(true);
        } else {
            alert("קוד שגוי, נסה שוב.");
        }
    };

    const upgradeViaWhatsapp = () => {
        const email = user ? user.email : "לא ידוע";
        const businessType = siteData?.businessType || desc || "עסק כללי";
        const goal = siteData?.goal || "הגדלת המרות ויצירת דף נחיתה";

        const message = `היי עמית, אני רוצה לקבל קוד PRO עבור האתר שלי.
סוג עסק: ${businessType}
מטרה: ${goal}
אימייל: ${email}`;

        window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const generateSite = useCallback(async () => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: desc, theme })
            });
            const json = await response.json();
            if (json && !json.error) {
                const html = renderHtml(json);
                setGeneratedHtml(html);
            } else { setErrorMessage(json?.error || "אופס, משהו השתבש ביצירת האתר."); }
        } catch (error) { setErrorMessage("חיבור השרת נכשל. נסה שוב."); }
    }, [desc, theme]);

    useEffect(() => {
        if (progress < 100) {
            const timer = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 3;
                    return next > 100 ? 100 : next;
                });
            }, 250);
            return () => clearInterval(timer);
        } else if (!isFinished) {
            setIsFinished(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    }, [progress, isFinished]);

    useEffect(() => {
        if (!loading) generateSite();
    }, [loading, generateSite]);

    const downloadSourceCode = () => {
        if (!isPro) { setShowUpgradeModal(true); return; }
        downloadStandaloneSite(generatedHtml, desc || "My Landing Page");
    };

    const statuses = ["מנתח דרישות...", "מעצב UI...", "כותב תוכן שיווקי...", "מבצע אופטימיזציה...", "הקסם מוכן!"];
    useEffect(() => {
        if (!isFinished) {
            const statusTimer = setInterval(() => {
                setStatusIndex(prev => (prev < statuses.length - 1 ? prev + 1 : prev));
            }, 2000);
            return () => clearInterval(statusTimer);
        }
    }, [isFinished, statuses.length]);

    if (loading) return <div style={fullPageCenter}>🚀 טוען נתונים...</div>;

    return (
        <div style={containerStyle}>
            {!isFinished ? (
                <div style={loadingWrapperStyle}>
                    <h1 style={loadingTitleStyle}>ה-AI בונה עבורך קסם...</h1>
                    <AnimatePresence mode="wait">
                        <motion.p key={statusIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={statusTextStyle}>
                            {statuses[statusIndex]}
                        </motion.p>
                    </AnimatePresence>
                    <div style={progressBarStyle}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={progressFillStyle} />
                    </div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={resultWrapperStyle}>
                    <h2 style={resultTitleStyle}>🚀 האתר שלך מוכן!</h2>
                    <p style={resultSubtitleStyle}>הצצה ראשונה לתוצאה של {desc}</p>
                    <div style={browserFrameStyle}>
                        <div style={browserHeaderStyle}>
                            <div style={dotsStyle}><div style={redDot} /><div style={yellowDot} /><div style={greenDot} /></div>
                            <div style={urlBarStyle}>preview.launchpage.ai/{desc.replace(/\s+/g, '-')}</div>
                        </div>
                        <div style={{ ...sitePreviewContainer, filter: isPro ? 'none' : 'blur(8px)', pointerEvents: isPro ? 'auto' : 'none' }}>
                            {generatedHtml ? <div dangerouslySetInnerHTML={{ __html: generatedHtml }} style={{ textAlign: 'right', direction: 'rtl' }} /> : <div style={{ padding: 100, color: '#000' }}>מייצר...</div>}
                        </div>
                        {!isPro && (
                            <div style={modalOverlayInner}>
                                <div style={lockOverlayContent}>
                                    <h3 style={lockTitleStyle}>האתר הזה נעול 🔒</h3>
                                    <button onClick={() => setShowUpgradeModal(true)} style={unlockBtnStyle}>לפתיחת האתר והורדת הקוד</button>
                                </div>
                            </div>
                        )}
                    </div>
                    {isPro ? (
                        <div style={{ marginTop: '40px' }}>
                            <button onClick={downloadSourceCode} style={upgradeBtnBottom}>הורדת קוד מקור (ZIP) ✅</button>
                        </div>
                    ) : (
                        <div style={paywallBottomStyle}>
                            <button onClick={() => setShowUpgradeModal(true)} style={upgradeBtnBottom}>שדרג ל-PRO וקבל את הקוד 🚀</button>
                        </div>
                    )}
                </motion.div>
            )}

            <AnimatePresence>
                {showUpgradeModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalOverlay}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={modalContent}>
                            <h2 style={modalTitleStyle}>🚀 שדרוג לגרסת PRO</h2>

                            <div style={modalSectionStyle}>
                                <h3 style={sectionTitleStyle}>יש לי קוד</h3>
                                <input
                                    type="text"
                                    placeholder="הכנס קוד PRO (למשל LAUNCH49)"
                                    value={unlockCode}
                                    onChange={(e) => setUnlockCode(e.target.value)}
                                    style={modalInputStyle}
                                />
                                <button onClick={handleUnlock} style={modalPrimaryBtn}>הפעל קוד</button>
                            </div>

                            <div style={{ margin: '20px 0', color: '#94a3b8', fontSize: '1rem', fontWeight: 'bold' }}>או</div>

                            <div style={modalSectionStyle}>
                                <h3 style={sectionTitleStyle}>קבל קוד בוואטסאפ</h3>
                                <button onClick={upgradeViaWhatsapp} style={whatsappBtnStyle}>קבל קוד בוואטסאפ</button>
                            </div>

                            <button onClick={() => setShowUpgradeModal(false)} style={modalCloseBtn}>ביטול</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showSuccessModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '15px' }}>השדרוג הושלם בהצלחה!</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '1.2rem' }}>🎉 השדרוג הושלם! גרסת PRO הופעלה.</p>
                        <button onClick={() => setShowSuccessModal(false)} style={modalPrimaryBtn}>מדהים, תודה! ✨</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const containerStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '140px 20px 80px', direction: 'rtl', background: '#020617', color: '#fff' };
const fullPageCenter = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#fff' };
const loadingWrapperStyle = { width: '100%', maxWidth: '600px' };
const loadingTitleStyle = { fontSize: '2.5rem', fontWeight: '900', marginBottom: '40px', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
const statusTextStyle = { color: '#94a3b8', fontSize: '1.2rem', marginBottom: '20px' };
const progressBarStyle = { width: '100%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' };
const progressFillStyle = { height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' };
const resultWrapperStyle = { width: '100%', maxWidth: '1000px' };
const resultTitleStyle = { fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' };
const resultSubtitleStyle = { color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' };
const browserFrameStyle = { background: '#fff', borderRadius: '20px', overflow: 'hidden', position: 'relative', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7)' };
const browserHeaderStyle = { background: '#1e293b', padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '15px' };
const dotsStyle = { display: 'flex', gap: '8px' };
const redDot = { width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' };
const yellowDot = { width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' };
const greenDot = { width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' };
const urlBarStyle = { flex: 1, background: 'rgba(255,255,255,0.05)', padding: '4px 20px', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'left', direction: 'ltr' };
const sitePreviewContainer = { height: '500px', overflowY: 'auto' };
const modalOverlayInner = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const lockOverlayContent = { background: '#1e293b', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' };
const lockTitleStyle = { color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' };
const unlockBtnStyle = { background: '#3b82f6', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const paywallBottomStyle = { marginTop: '40px' };
const upgradeBtnBottom = { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', padding: '18px 50px', borderRadius: '20px', fontWeight: '900', fontSize: '1.3rem', border: 'none', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContent = { background: '#1e293b', padding: '40px', borderRadius: '30px', maxWidth: '450px', width: '100%', border: '2px solid #3b82f6' };
const modalTitleStyle = { color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' };
const modalSubtitleStyle = { color: '#94a3b8', fontSize: '1rem', marginBottom: '25px' };
const modalSectionStyle = { textAlign: 'center' };
const sectionTitleStyle = { fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '15px', color: '#fff' };
const modalInputStyle = { width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '2px solid #3b82f6', color: 'white', textAlign: 'center', outline: 'none', marginBottom: '10px' };
const modalPrimaryBtn = { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
const whatsappBtnStyle = { background: '#25d366', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none' };
const modalCloseBtn = { background: 'transparent', border: 'none', color: '#94a3b8', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline' };

export default function SimulatePage() {
    return (
        <Suspense fallback={<div style={fullPageCenter}>מתכוננים לשיגור... 🚀</div>}>
            <SimulateContent />
        </Suspense>
    );
}
