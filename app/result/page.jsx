"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heebo } from "next/font/google";
import Link from "next/link";
import RocketPreview from "@/components/RocketPreview";
import { useUser } from "@/context/UserContext";
import { auth, loginWithGoogle, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import ReactConfetti from 'react-confetti';
import { validateHtml } from '@/lib/landing/validateHtml';
import { renderHtml } from '@/lib/landing/renderHtml';
import { downloadStandaloneSite } from '@/lib/landing/downloadSite';
import { VALID_PRO_CODES, SUPPORT_PHONE } from '@/lib/constants';

const heebo = Heebo({ subsets: ["hebrew"] });

function ResultContent() {
    const params = useSearchParams();
    const router = useRouter();
    const prompt = params.get("p");
    const siteId = params.get("id");

    const { isPro, setProStatus } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);

    const [coupon, setCoupon] = useState("");
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [user, setUser] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Load initial state from localStorage for robustness
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedPro = localStorage.getItem("isPro") === "true";
            if (savedPro) setProStatus(true);
        }
    }, [setProStatus]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
        });
        return () => unsubscribe();
    }, []);

    const upgradeViaWhatsapp = () => {
        const email = user ? user.email : "לא ידוע";
        const businessType = data?.businessType || prompt || "עסק כללי";
        const goal = data?.goal || "הגדלת המרות ויצירת דף נחיתה";

        const message = `היי עמית, אני רוצה לקבל קוד PRO עבור האתר שלי.
סוג עסק: ${businessType}
מטרה: ${goal}
אימייל: ${email}`;

        window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const checkCoupon = useCallback(async () => {
        const normalizedCoupon = coupon.trim().toUpperCase();
        if (VALID_PRO_CODES.includes(normalizedCoupon)) {
            setProStatus(true);
            localStorage.setItem("isPro", "true");
            setShowConfetti(true);
            setIsUpgradeModalOpen(false);
            setShowSuccessModal(true);

            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    await updateDoc(userRef, { isPro: true, activatedCoupon: normalizedCoupon });
                } catch (e) {
                    console.error("Error updating Firestore:", e);
                }
            }
        } else {
            alert("קוד שגוי, נסה שוב.");
        }
    }, [coupon, user, setProStatus]);

    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.data()?.isPro) {
                setProStatus(true);
                localStorage.setItem("isPro", "true");
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

    if (loading) return <div style={fullPageCenter}>מייצר את הדף שלך... 🚀</div>;

    if (validationErrors.length > 0) {
        return (
            <div style={errorScreenStyle}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>התוצאה לא עברה בדיקת איכות</h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    אנחנו מוודאים שכל דף נחיתה שיוצא מהמערכת עומד ברף איכות גבוה. מנסים לייצר את הדף מחדש.
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
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
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}

            <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px" }}>
                <div style={{ flex: 1, position: 'relative' }} onContextMenu={(e) => !isPro && e.preventDefault()}>
                    {!isPro && (
                        <div style={freeBannerStyle}>
                            <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>👀 זהו דף תצוגה בלבד</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>כדי להשתמש בדף הזה בפועל ולהעלות אותו לאתר שלך – יש לשדרג לגרסת PRO.</span>
                        </div>
                    )}

                    <div style={{ filter: isPro ? 'none' : 'blur(10px)', transition: 'filter 0.5s ease', pointerEvents: isPro ? 'auto' : 'none' }}>
                        <RocketPreview data={data} />
                    </div>

                    {!isPro && (
                        <div style={overlayStyle}>
                            <div style={blurOverlayStyle} />
                            <button onClick={() => setIsUpgradeModalOpen(true)} style={unlockBtnFloating}>🔒 קבל קובץ מוכן לשימוש</button>
                        </div>
                    )}
                </div>

                <div style={sidebarStyle} className="hidden md:block">
                    <h3 style={{ marginBottom: "15px" }}>אפשרויות</h3>
                    <button onClick={() => isPro ? handleDownload() : setIsUpgradeModalOpen(true)} style={sideBtn}>
                        {isPro ? 'השתמש בדף הזה (ZIP) ✅' : '🔒 קבל קובץ מוכן לשימוש'}
                    </button>
                    {!isPro && (
                        <button onClick={() => setIsUpgradeModalOpen(true)} style={sideBtn}>🔒 שפר את הדף והגדל המרות</button>
                    )}
                    <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("תראו את האתר ש-AI בנה לי! " + window.location.href)}`, '_blank')} style={sideBtn}>שתף בוואטסאפ 💬</button>
                    {!isPro && <button onClick={() => setIsUpgradeModalOpen(true)} style={upgradeBtnSide}>שדרג ל-PRO 🚀</button>}
                </div>
            </div>

            {!isPro && (
                <div className="md:hidden" style={mobileStickyStyle}>
                    <button onClick={() => setIsUpgradeModalOpen(true)} style={checkAccessBtnStyle}>🔒 קבל את הדף הזה</button>
                </div>
            )}

            {isUpgradeModalOpen && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '25px' }}>🚀 שדרוג לגרסת PRO</h2>

                        <div style={upgradeSectionStyle}>
                            <h3 style={sectionTitleStyle}>יש לי קוד</h3>
                            <input
                                type="text"
                                placeholder="הכנס קוד PRO (למשל LAUNCH49)"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                style={modalInputStyle}
                            />
                            <button onClick={checkCoupon} style={checkAccessBtnStyle}>הפעל קוד</button>
                        </div>

                        <div style={{ margin: '20px 0', color: '#94a3b8', fontSize: '1rem', fontWeight: 'bold' }}>או</div>

                        <div style={upgradeSectionStyle}>
                            <h3 style={sectionTitleStyle}>קבל קוד בוואטסאפ</h3>
                            <button onClick={upgradeViaWhatsapp} style={whatsappBtnStyle}>קבל קוד בוואטסאפ</button>
                        </div>

                        <div style={{ marginTop: '25px' }}>
                            <button onClick={() => setIsUpgradeModalOpen(false)} style={closeBtnStyle}>ביטול</button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '15px' }}>השדרוג הושלם בהצלחה!</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '1.2rem' }}>🎉 השדרוג הושלם! גרסת PRO הופעלה.</p>
                        <button onClick={() => setShowSuccessModal(false)} style={checkAccessBtnStyle}>מדהים, תודה! ✨</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const containerStyle = { minHeight: "100vh", background: "#05070a", color: "white", display: "flex", flexDirection: "column" };
const fullPageCenter = { minHeight: "100vh", background: "#05070a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" };
const errorScreenStyle = { minHeight: '100vh', background: '#05070a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' };
const freeBannerStyle = { background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', color: '#fff' };
const overlayStyle = { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '40px', zIndex: 10 };
const blurOverlayStyle = { position: 'absolute', inset: 0, background: 'linear-gradient(to top, #05070a 20%, transparent)', backdropFilter: 'blur(4px)' };
const unlockBtnFloating = { position: 'relative', zIndex: 20, padding: '15px 30px', background: '#22c55e', color: 'white', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(34,197,94,0.5)' };
const sidebarStyle = { width: "300px", background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(255,255,255,0.1)", height: "fit-content" };
const sideBtn = { width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", marginBottom: "12px", cursor: "pointer" };
const upgradeBtnSide = { width: "100%", padding: "14px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", borderRadius: "12px", color: "white", fontWeight: "bold", cursor: "pointer" };
const mobileStickyStyle = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, #05070a 80%, transparent)', zIndex: 1000 };
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalContent = { background: '#1e293b', padding: '35px', borderRadius: '24px', textAlign: 'center', color: 'white', maxWidth: '450px', width: '100%', border: '2px solid #3b82f6', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' };
const checkAccessBtnStyle = { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', border: 'none', marginTop: '10px', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)' };
const closeBtnStyle = { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' };
const modalInputStyle = { width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '2px solid #3b82f6', color: 'white', textAlign: 'center', fontSize: '1.1rem', outline: 'none', marginBottom: '10px' };
const upgradeSectionStyle = { textAlign: 'center' };
const sectionTitleStyle = { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px', color: '#fff' };
const whatsappBtnStyle = { background: '#25d366', color: 'white', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', border: 'none' };
const primaryActionBtnStyle = { padding: '12px 24px', background: '#3b82f6', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
const secondaryActionBtnStyle = { padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' };

export default function ResultPage() {
    return (
        <Suspense fallback={<div style={fullPageCenter}>טוען... 🚀</div>}>
            <ResultContent />
        </Suspense>
    );
}
