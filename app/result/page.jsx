"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heebo } from "next/font/google";
import Link from "next/link";
import RocketPreview from "@/components/RocketPreview";
import { useUser } from "@/context/UserContext";
import { auth, loginWithGoogle, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, doc, getDoc, onSnapshot } from "firebase/firestore";
import ReactConfetti from 'react-confetti';
import { saveAs } from "file-saver";
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

    // שליטה בסטטוס ה-PRO
    const [isPro, setIsPro] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);

    const [coupon, setCoupon] = useState("");
    const [discountApplied, setDiscountApplied] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSignIn = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error("שגיאה בהתחברות:", error);
        }
    };
    const handleCheckAccess = useCallback(async () => {
        console.log("Checking access for user:", user?.email);
        console.log("User UID:", user?.uid);

        if (!user) {
            console.error("No user found in state!");
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                console.log("Document data found:", userSnap.data());
                if (userSnap.data().isPro === true) {
                    console.log("User is PRO! Unlocking...");
                    setIsPro(true);
                    setIsUpgradeModalOpen(false);
                } else {
                    console.log("User is NOT PRO in Database.");
                }
            } else {
                console.error("No such document in Firestore for UID:", user.uid);
            }
        } catch (error) {
            console.error("Firestore Error:", error);
        }
    }, [user]);

    const upgradeViaWhatsapp = () => {
        const email = user ? user.email : "אני רוצה לשדרג";
        const msg = encodeURIComponent(`היי עמית, אני רוצה לשדרג ל-PRO! האימייל שלי הוא: ${email}`);
        window.open(`https://wa.me/${SUPPORT_PHONE}?text=${msg}`, "_blank");
    };

    // סינכרון עם Firebase (נשאר כפי שהיה)
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            const data = doc.data();
            if (data?.isPro) setIsPro(true);
        });
        return () => unsub();
    }, [user]);

    const saveSiteToHistory = useCallback(async (siteData) => {
        if (!user || !siteData) return;
        try {
            // Check if site already saved to avoid duplicates (optional, simplified for now)
            await addDoc(collection(db, "users", user.uid, "sites"), {
                content: siteData,
                createdAt: serverTimestamp(),
                preview: "rocket" // placeholder
            });
            console.log("Site saved to history!");
        } catch (e) {
            console.error("Error saving site:", e);
        }
    }, [user]);

    useEffect(() => {
        if (user && data && !params.get('id')) { // Only save if not viewing an existing saved site (by ID)
            saveSiteToHistory(data);
        }
    }, [user, data, params, saveSiteToHistory]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
        });
        return () => unsubscribe();
    }, []);

    const shareSite = () => {
        const title = data.hero ? data.hero.title : data.title;
        const url = window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent("תראו את האתר ש-AI בנה לי! " + url)}`, '_blank');
    };


    const checkCoupon = useCallback(async () => {
        const normalizedCoupon = coupon.trim().toUpperCase();
        if (VALID_PRO_CODES.includes(normalizedCoupon)) {
            setDiscountApplied(true);
            setIsPro(true);
            setShowConfetti(true);

            // Persist locally
            localStorage.setItem("isProUser", "true");
            localStorage.setItem("proCoupon", normalizedCoupon);

            // Persist to Firestore if logged in
            if (user) {
                try {
                    const { doc, updateDoc } = await import("firebase/firestore");
                    const userRef = doc(db, "users", user.uid);
                    await updateDoc(userRef, { isPro: true, activatedCoupon: normalizedCoupon });
                } catch (e) {
                    console.error("Error updating Firestore:", e);
                }
            }

            alert("קופון הופעל! גישת PRO פתוחה עבורך ✨");
        } else {
            alert("קופון לא בתוקף");
        }
    }, [coupon, user]);

    // טעינת נתונים (נשאר כפי שהיה)
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            if (params.get('local') === 'true') {
                try {
                    const localData = localStorage.getItem("generatedSite");
                    if (localData) {
                        setData(JSON.parse(localData));
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.warn("Failed to parse generatedSite from localStorage");
                }
            }
            if (siteId && user) {
                try {
                    const docRef = doc(db, "users", user.uid, "sites", siteId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setData(docSnap.data().content);
                    }
                } catch (e) {
                    console.error("Error loading site:", e);
                } finally {
                    setLoading(false);
                }
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

                    // Transform JSON to HTML using the rendering engine
                    if (json && !json.error) {
                        const html = renderHtml(json);
                        setData({ ...json, html });
                    } else {
                        setError(json.error || "שגיאה ביצירת הדף");
                    }
                } catch (err) { setError("שגיאה ביצירת הדף"); }
                finally { setLoading(false); }
            }
        }
        if (user || params.get('local')) {
            loadData();
        }
    }, [prompt, params, user, siteId]);


    useEffect(() => {
        if (data && data.html) {
            const { isValid, errors } = validateHtml(data.html);
            if (!isValid) {
                console.error("HTML Quality Gate Failed:", errors);
                setValidationErrors(errors);
            } else {
                setValidationErrors([]);
            }
        }
    }, [data]);


    // פונקציית ההורדה המאוחדת (Standalone)
    const handleDownload = async () => {
        if (!data || !data.html) return;
        const title = data.businessName || "My Landing Page";
        await downloadStandaloneSite(data.html, title);
    };


    if (loading) return <div style={fullPageCenter}>מייצר את הדף שלך... 🚀</div>;

    // Quality Gate Error Screen
    if (validationErrors.length > 0) {
        return (
            <div style={{
                minHeight: '100vh', background: '#05070a', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px', textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>התוצאה לא עברה בדיקת איכות</h1>
                <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    אנחנו מוודאים שכל דף נחיתה שיוצא מהמערכת עומד ברף איכות גבוה.<br />
                    מנסים לייצר את הדף מחדש.
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                    >
                        נסה שוב
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                    >
                        חזרה לעריכה
                    </button>
                </div>
                {/* Developer debug info (hidden in prod normally, but keeping for now) */}
                <div style={{ marginTop: '40px', fontSize: '0.8rem', color: '#334155', textAlign: 'left' }}>
                    {validationErrors.map((err, i) => <div key={i}>• {err}</div>)}
                </div>
            </div>
        );
    }

    if (!loading && !data) {
        return (
            <div style={{ padding: 32, textAlign: "center", minHeight: "100vh", background: "#05070a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h2>אין דף להצגה</h2>
                <p>נראה שעדיין לא נוצר דף נחיתה.</p>
                <Link href="/create">צור דף חדש</Link>
            </div>
        );
    }

    return (
        <div className={heebo.className} dir="rtl" style={containerStyle}>
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}

            <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px" }}>

                {/* אזור ה-PREVIEW עם חסימות */}
                <div
                    style={{ flex: 1, position: 'relative' }}
                    onContextMenu={(e) => !isPro && e.preventDefault()} // חוסם קליק ימני בחינמי
                >
                    {!isPro && (
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            color: '#fff'
                        }}>
                            <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>👀 זהו דף תצוגה בלבד</span>
                            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                כדי להשתמש בדף הזה בפועל ולהעלות אותו לאתר שלך – יש לשדרג לגרסת PRO.
                            </span>
                        </div>
                    )}

                    <div style={{
                        filter: (isPro && validationErrors.length === 0) ? 'none' : 'blur(10px)',
                        transition: 'filter 0.5s ease',
                        pointerEvents: (isPro && validationErrors.length === 0) ? 'auto' : 'none'
                    }}>
                        <RocketPreview data={data} />
                    </div>

                    {/* אפקט טשטוש וסימן מים למשתמש חינמי */}
                    {!isPro && (
                        <div style={overlayStyle}>
                            <div style={blurStyle} />
                            <button onClick={() => setIsUpgradeModalOpen(true)} style={unlockBtnFloating}>
                                🔒 קבל קובץ מוכן לשימוש
                            </button>
                        </div>
                    )}
                </div>

                {/* סרגל צד */}
                <div style={sidebarStyle} className="hidden md:block">
                    <h3 style={{ marginBottom: "15px" }}>אפשרויות</h3>
                    <button onClick={() => isPro ? handleDownload() : setIsUpgradeModalOpen(true)} style={sideBtn}>
                        {isPro ? 'הורדת ZIP ✅' : '🔒 קבל קובץ מוכן לשימוש'}
                    </button>
                    {!isPro && (
                        <button onClick={() => setIsUpgradeModalOpen(true)} style={sideBtn}>
                            🔒 שפר את הדף והגדל המרות
                        </button>
                    )}
                    <button onClick={shareSite} style={sideBtn}>שתף בוואטסאפ 💬</button>

                    {!isPro && (
                        <button onClick={() => setIsUpgradeModalOpen(true)} style={upgradeBtnSide}>
                            שדרג וקבל את הדף 🚀
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            {!isPro && (
                <div className="md:hidden" style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    padding: '20px', background: 'linear-gradient(to top, #05070a 80%, transparent)',
                    zIndex: 1000
                }}>
                    <button onClick={() => setIsUpgradeModalOpen(true)} style={checkAccessBtnStyle}>
                        🔒 קבל את הדף הזה
                    </button>
                </div>
            )}

            {/* מודאל השדרוג (בדיקת VIP) */}
            {isUpgradeModalOpen && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '15px' }}>🚀 הדף הזה מוכן לשימוש</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '1.1rem' }}>
                            בשדרוג לגרסת PRO תקבל דף נחיתה מוכן, כולל קוד מלא ושיפור טקסט חכם.
                        </p>

                        <div style={{ textAlign: 'right', display: 'inline-block', marginBottom: '30px' }}>
                            <div style={bulletStyle}>✔️ דף מותאם אישית לעסק שלך</div>
                            <div style={bulletStyle}>✔️ קובץ מוכן להעלאה</div>
                            <div style={bulletStyle}>✔️ שיפור טקסט עם AI</div>
                            <div style={bulletStyle}>✔️ שימוש מיידי, בלי הגבלות</div>
                        </div>

                        {user ? (
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={upgradeViaWhatsapp}
                                    style={checkAccessBtnStyle}
                                >
                                    שדרג וקבל את הדף
                                </button>

                                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button onClick={handleCheckAccess} style={secondaryBtnStyle}>
                                        כבר שילמתי? בדוק גישה ✅
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={handleSignIn} style={googleBtnStyle}>
                                    התחבר עם Google לשדרוג
                                </button>
                            </div>
                        )}

                        <button onClick={() => setIsUpgradeModalOpen(false)} style={closeBtnStyle}>
                            אולי אחר כך
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Styles ---
const containerStyle = { minHeight: "100vh", background: "#05070a", color: "white", display: "flex", flexDirection: "column" };
const fullPageCenter = { minHeight: "100vh", background: "#05070a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" };
const overlayStyle = { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '40px', zIndex: 10 };
const blurStyle = { position: 'absolute', inset: 0, background: 'linear-gradient(to top, #05070a 20%, transparent)', backdropFilter: 'blur(4px)' };
const unlockBtnFloating = { position: 'relative', zIndex: 20, padding: '15px 30px', background: '#22c55e', color: 'white', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(34,197,94,0.5)' };
const sidebarStyle = { width: "300px", background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(255,255,255,0.1)", height: "fit-content" };
const sideBtn = { width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", marginBottom: "12px", cursor: "pointer" };
const upgradeBtnSide = { width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none", borderRadius: "12px", color: "white", fontWeight: "bold", cursor: "pointer" };
const modalOverlay = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};

const modalContent = {
    background: '#1e293b',
    padding: '35px',
    borderRadius: '24px',
    textAlign: 'center',
    color: 'white',
    maxWidth: '450px',
    width: '100%',
    border: '2px solid #3b82f6',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
};

const checkAccessBtnStyle = {
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: 'white',
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
    transition: 'transform 0.2s'
};

const googleBtnStyle = {
    background: '#fff',
    color: '#1f2937',
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
};

const whatsappBtnSimple = {
    background: 'transparent',
    color: '#4ade80',
    border: '1px solid #4ade80',
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
};

const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    marginTop: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem'
};

const bulletStyle = {
    color: '#fff',
    marginBottom: '12px',
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const secondaryBtnStyle = {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#94a3b8',
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600'
};

// --- End of Page ---

export default function ResultPage() {
    return (
        <Suspense fallback={<div style={fullPageCenter}>טוען... 🚀</div>}>
            <ResultContent />
        </Suspense>
    );
}
