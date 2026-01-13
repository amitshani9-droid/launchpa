"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heebo } from "next/font/google";
import Link from "next/link";
import RocketPreview from "@/components/RocketPreview";
import { useUser } from "@/context/UserContext";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { validateHtml } from '@/lib/landing/validateHtml';
import { renderHtml } from '@/lib/landing/renderHtml';
import { downloadStandaloneSite } from '@/lib/landing/downloadSite';

const heebo = Heebo({ subsets: ["hebrew"] });

function ResultContent() {
    const params = useSearchParams();
    const router = useRouter();
    const prompt = params.get("p");
    const siteId = params.get("id");

    const { isPro, setProStatus, openUpgradeModal } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
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
            if (doc.data()?.isPro) {
                setProStatus(true);
            }
        });
        return () => unsub();
    }, [user, setProStatus]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            if (params.get('local') === 'true') {
                const localData = localStorage.getItem("generatedSite");
                if (localData) {
                    setData(JSON.parse(localData));
                    setLoading(false);
                    return;
                }
            }
            if (siteId && user) {
                try {
                    const docSnap = await getDoc(doc(db, "users", user.uid, "sites", siteId));
                    if (docSnap.exists()) setData(docSnap.data().content);
                } catch (e) { console.error("Error loading site:", e); }
                finally { setLoading(false); }
                return;
            }

            if (prompt) {
                try {
                    const res = await fetch("/api/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt })
                    });
                    const json = await res.json();
                    if (json && !json.error) {
                        const html = renderHtml(json);
                        setData({ ...json, html });
                    } else { setError(json.error || "שגיאה ביצירת הדף"); }
                } catch (err) { setError("שגיאה ביצירת הדף"); }
                finally { setLoading(false); }
            }
        }
        if (user || params.get('local') || prompt) loadData();
    }, [prompt, params, user, siteId]);

    useEffect(() => {
        if (data?.html) {
            const { isValid, errors } = validateHtml(data.html);
            setValidationErrors(isValid ? [] : errors);
        }
    }, [data]);

    const handleDownload = async () => {
        if (data?.html) {
            await downloadStandaloneSite(data.html, data.businessName || "My Landing Page");
        }
    };

    const handleUpgradeTrigger = () => {
        openUpgradeModal({
            businessType: data?.businessType || prompt || "עסק כללי",
            goal: data?.goal || "הגדלת המרות"
        });
    };

    if (loading) return <div style={fullPageCenter}>מייצר את הדף שלך... 🚀</div>;

    if (validationErrors.length > 0) {
        return (
            <div style={errorScreenStyle}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>התוצאה לא עברה בדיקת איכות</h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    אנחנו מוודאים שכל דף נחיתה שיוצא מהמערכת עומד ברף איכות גבוה. מנסים לייצר את הדף מחדש.
                </p>
                <div style={displayFlexGap15}>
                    <button onClick={() => window.location.reload()} style={primaryActionBtnStyle}>נסה שוב</button>
                    <button onClick={() => router.push('/')} style={secondaryActionBtnStyle}>חזרה לעריכה</button>
                </div>
            </div>
        );
    }

    if (!loading && !data) {
        return (
            <div style={errorScreenStyle}>
                <h2>אין דף להצגה</h2>
                <p>נראה שעדיין לא נוצר דף נחיתה.</p>
                <Link href="/" style={{ color: '#3b82f6' }}>צור דף חדש</Link>
            </div>
        );
    }

    return (
        <div className={heebo.className} dir="rtl" style={containerStyle}>
            {/* Freemium Banner */}
            {!isPro && (
                <div style={premiumBannerStyle}>
                    <div style={{ fontSize: '1.2rem' }}>👀</div>
                    <div>
                        <div style={{ fontWeight: '900' }}>מצב תצוגה בלבד</div>
                        <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>זהו דף נחיתה אמיתי שנוצר עבורך. כדי להשתמש בו בפועל (פרסום/העלאה/קוד) – נדרש שדרוג ל-PRO.</div>
                    </div>
                    <button onClick={handleUpgradeTrigger} style={bannerUpgradeBtn}>שדרג ל-PRO</button>
                </div>
            )}

            <div style={contentGrid}>
                {/* Main Preview Area */}
                <div style={previewArea} onContextMenu={(e) => !isPro && e.preventDefault()}>
                    <div style={{ filter: isPro ? 'none' : 'blur(0)', transition: 'filter 0.5s ease', height: '100%' }}>
                        <RocketPreview data={data} />
                    </div>

                    {!isPro && (
                        <div style={lockOverlay}>
                            <button onClick={handleUpgradeTrigger} style={floatingLockBtn}>🔒 שדרג ל-PRO כדי להסיר את המגבלות</button>
                        </div>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div style={sidebarStyle} className="hidden md:block">
                    <h3 style={{ marginBottom: "20px", fontSize: '1.2rem', fontWeight: '800' }}>פעולות אפשריות</h3>

                    {/* Primary Download Action */}
                    <div style={{ marginBottom: '15px' }}>
                        <button onClick={() => isPro ? handleDownload() : handleUpgradeTrigger()} style={isPro ? btnPrimary : btnLocked}>
                            {isPro ? 'הורדת קוד מלא (HTML/React) 📥' : '🔒 הורדת קוד (PRO)'}
                        </button>
                        {!isPro && <div style={helperText}>כדי לפרסם או להעלות לאתר שלך</div>}
                    </div>

                    {/* Improve Text Action */}
                    <div style={{ marginBottom: '15px' }}>
                        <button onClick={handleUpgradeTrigger} style={btnLocked}>
                            🔒 שפר טקסט עם AI (PRO)
                        </button>
                        {!isPro && <div style={helperText}>הופך את הטקסט ליותר משכנע ומוכר</div>}
                    </div>

                    <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("תראו את האתר ש-AI בנה לי! " + window.location.href)}`, '_blank')} style={btnSecondary}>
                        שתף בוואטסאפ 💬
                    </button>

                    {!isPro && (
                        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '10px', color: '#60a5fa' }}>למה כדאי לשדרג?</h4>
                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
                                <li style={{ marginBottom: '8px' }}>✅ בעלות מלאה על הקוד</li>
                                <li style={{ marginBottom: '8px' }}>✅ ללא סימן מים</li>
                                <li>✅ שימוש מסחרי מותר</li>
                            </ul>
                            <button onClick={handleUpgradeTrigger} style={{ ...btnPrimary, marginTop: '15px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>שדרג עכשיו 🚀</button>
                        </div>
                    )}
                </div>
            </div>

            {!isPro && (
                <div className="md:hidden" style={mobileStickyStyle}>
                    <button onClick={handleUpgradeTrigger} style={checkAccessBtnStyle}>🔒 קבל את הדף הזה</button>
                </div>
            )}
        </div>
    );
}

// --- Styles ---
const containerStyle = { minHeight: "100vh", background: "#05070a", color: "white", display: "flex", flexDirection: "column" };
const fullPageCenter = { minHeight: "100vh", background: "#05070a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" };
const errorScreenStyle = { minHeight: '100vh', background: '#05070a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' };
const displayFlexGap15 = { display: 'flex', gap: '15px' };
const premiumBannerStyle = { background: '#1e3a8a', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', borderBottom: '1px solid #3b82f6', textAlign: 'right' };
const bannerUpgradeBtn = { background: '#fff', color: '#1e3a8a', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' };
const contentGrid = { display: "flex", flex: 1, padding: "30px", gap: "30px", maxWidth: '1600px', margin: '0 auto', width: '100%' };
const previewArea = { flex: 1, position: 'relative', background: '#0f172a', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', minHeight: '600px' };
const lockOverlay = { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 };
const floatingLockBtn = { padding: '12px 30px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };
const sidebarStyle = { width: "320px", background: "rgba(30, 41, 59, 0.4)", borderRadius: "24px", padding: "25px", border: '1px solid rgba(255,255,255,0.1)', height: "fit-content" };
const btnPrimary = { width: '100%', padding: '14px', background: '#3b82f6', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' };
const btnLocked = { width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', textAlign: 'right', display: 'flex', justifyContent: 'space-between' };
const btnSecondary = { width: '100%', padding: '14px', background: 'transparent', color: '#94a3b8', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' };
const helperText = { fontSize: '0.85rem', color: '#64748b', marginTop: '6px', paddingRight: '10px' };
const mobileStickyStyle = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 1000 };
const checkAccessBtnStyle = { background: '#22c55e', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', border: 'none' };
const primaryActionBtnStyle = { padding: '12px 24px', background: '#3b82f6', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
const secondaryActionBtnStyle = { padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' };

export default function ResultPage() {
    return (
        <Suspense fallback={<div style={fullPageCenter}>טוען... 🚀</div>}>
            <ResultContent />
        </Suspense>
    );
}
