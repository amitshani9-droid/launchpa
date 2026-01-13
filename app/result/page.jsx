"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heebo } from "next/font/google";
import RocketPreview from "@/components/RocketPreview";
import { useUser } from "@/context/UserContext";
import { auth, loginWithGoogle, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, doc, getDoc, onSnapshot } from "firebase/firestore";
import ReactConfetti from 'react-confetti';
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
    // --- לוגיקת בדיקת הגישה (Firebase VIP) ---
    const handleCheckAccess = async () => {
        if (!user) {
            alert("אנא התחבר עם גוגל קודם");
            handleSignIn();
            return;
        }

        try {
            // בודק ב-Firebase אם למשתמש הזה יש הרשאת PRO
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists() && userDoc.data().isPro) {
                setIsPro(true);
                setIsUpgradeModalOpen(false);
                setShowConfetti(true);
                handleDownload();
                alert("הגישה אושרה! האתר שלך פתוח.");
            } else {
                alert(`האימייל ${user.email} עדיין לא מאושר כ-PRO. שלח הודעה לעמית בוואטסאפ לאישור.`);
                // פותח וואטסאפ עם האימייל שלו כבר בפנים כדי שיהיה לך קל לאשר אותו
                const msg = encodeURIComponent(`היי עמית, שילמתי עבור PRO. האימייל שלי הוא: ${user.email}`);
                window.open(`https://wa.me/972533407255?text=${msg}`, "_blank");
            }
        } catch (e) {
            console.error(e);
            alert("שגיאה באימות הגישה.");
        }
    };

    const upgradeViaWhatsapp = () => {
        const email = user ? user.email : "אני רוצה לשדרג";
        const msg = encodeURIComponent(`היי עמית, אני רוצה לשדרג ל-PRO! האימייל שלי הוא: ${email}`);
        window.open(`https://wa.me/972533407255?text=${msg}`, "_blank");
    };

    // סינכרון עם Firebase (נשאר כפי שהיה)
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            const data = doc.data();
            if (data?.isPro) setIsPro(true);
        });
        return () => unsub();
    }, [user?.uid]);

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

    const checkCoupon = () => {
        if (coupon.toUpperCase() === "LAUNCH2026") {
            setDiscountApplied(true);
            alert("קופון הופעל! 50% הנחה!");
        } else {
            alert("קופון לא בתוקף");
        }
    };

    // טעינת נתונים (נשאר כפי שהיה)
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            if (params.get('local') === 'true') {
                const localData = localStorage.getItem('generatedSite');
                if (localData) {
                    setData(JSON.parse(localData));
                    setLoading(false);
                    return;
                }
            }
            if (prompt) {
                try {
                    const res = await fetch("/api/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt })
                    });
                    const json = await res.json();
                    setData(json);
                } catch (err) { setError("שגיאה ביצירת הדף"); }
                finally { setLoading(false); }
            }
        }
        loadData();
    }, [prompt, params]);


    // פונקציית ההורדה הידנית (למשתמשי PRO קיימים)
    const handleDownload = async () => {
        if (!data) return;
        const zip = new JSZip();
        zip.file("index.html", generateHTML(data));
        zip.file("style.css", generateCSS(data));
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "my-launchpage-site.zip");
    };


    if (loading) return <div style={fullPageCenter}>מייצר את הדף שלך... 🚀</div>;
    if (!data) return null;

    return (
        <div className={heebo.className} dir="rtl" style={containerStyle}>
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}

            <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px" }}>

                {/* אזור ה-PREVIEW עם חסימות */}
                <div
                    style={{ flex: 1, position: 'relative' }}
                    onContextMenu={(e) => !isPro && e.preventDefault()} // חוסם קליק ימני בחינמי
                >
                    <div style={{
                        filter: isPro ? 'none' : 'blur(10px)',
                        transition: 'filter 0.5s ease',
                        pointerEvents: isPro ? 'auto' : 'none'
                    }}>
                        <RocketPreview data={data} />
                    </div>

                    {/* אפקט טשטוש וסימן מים למשתמש חינמי */}
                    {!isPro && (
                        <div style={overlayStyle}>
                            <div style={blurStyle} />
                            <button onClick={() => setIsUpgradeModalOpen(true)} style={unlockBtnFloating}>
                                🔓 שחרר את נעילת האתר והורד קוד
                            </button>
                        </div>
                    )}
                </div>

                {/* סרגל צד */}
                <div style={sidebarStyle}>
                    <h3 style={{ marginBottom: "15px" }}>אפשרויות</h3>
                    <button onClick={() => isPro ? handleDownload() : setIsUpgradeModalOpen(true)} style={sideBtn}>
                        הורדת ZIP {isPro ? '✅' : '🔒'}
                    </button>
                    <button onClick={shareSite} style={sideBtn}>שתף בוואטסאפ 💬</button>

                    {!isPro && (
                        <button onClick={() => setIsUpgradeModalOpen(true)} style={upgradeBtnSide}>
                            שדרג ל-PRO 🚀
                        </button>
                    )}
                </div>
            </div>

            {/* מודאל השדרוג (בדיקת VIP) */}
            {isUpgradeModalOpen && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px' }}>🔐 גישת PRO בלבד</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                            {user ? `מחובר כ: ${user.email}` : "יש להתחבר כדי לקבל גישה"}
                        </p>

                        <button onClick={handleCheckAccess} style={checkAccessBtn}>
                            🚀 בדוק אם הגישה שלי אושרה
                        </button>

                        <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>טרם שילמת? שלח הודעה לאישור מיידי:</p>
                            <button onClick={upgradeViaWhatsapp} style={whatsappBtnSimple}>
                                💬 דבר עם עמית בוואטסאפ
                            </button>
                        </div>

                        <button onClick={() => setIsUpgradeModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', marginTop: '10px', cursor: 'pointer' }}>
                            סגור
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
const modalOverlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent = { background: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid #334155', width: '90%', maxWidth: '450px', textAlign: 'center' };
const whatsappBtnSimple = { background: 'transparent', border: '1px solid #22c55e', color: '#22c55e', width: '100%', padding: '10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' };
const checkAccessBtn = { background: '#3b82f6', color: 'white', width: '100%', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', border: 'none', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' };

// --- Helpers (גנרטורים של קוד) ---
function generateHTML(data) {
    const primary = data.style?.primaryColor || "#2563eb";
    const bg = data.style?.backgroundColor || "#ffffff";
    const title = data.hero ? data.hero.title : data.title;
    const description = data.hero ? data.hero.description : data.subtitle;

    return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap" rel="stylesheet">
        <style>
            :root {--primary: ${primary}; --bg: ${bg}; }
            body {background-color: var(--bg); color: #1e293b; font-family: 'Heebo', sans-serif; margin: 0; padding: 0; line-height: 1.6; }
            .hero {padding: 100px 20px; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
            h1 {color: var(--primary); font-size: 3rem; margin-bottom: 20px; font-weight: 900; }
            .features {display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; padding: 60px 20px; max-width: 1000px; margin: 0 auto; }
            .feature-card {background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: right; }
            .cta-btn {background: var(--primary); color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; }
            footer { text-align: center; padding: 40px; border-top: 1px solid #e2e8f0; margin-top: 40px; }
        </style>
    </head>
    <body>
        <header class="hero">
            <h1>${title}</h1>
            <p style="font-size: 1.3rem; color: #475569; max-width: 700px; margin: 0 auto 30px;">${description}</p>
            <a href="#" class="cta-btn">${data.hero ? data.hero.cta : (data.cta_button || "צור קשר")}</a>
        </header>

        <main class="features">
            ${data.features ? data.features.map(f => `
                <div class="feature-card">
                    <h3 style="color: var(--primary); margin-bottom: 10px; font-size: 1.25rem;">${f.title}</h3>
                    <p style="color: #64748b;">${f.desc}</p>
                </div>
            `).join('') : (data.sections?.map(s => `
                <div class="feature-card">
                    <h3 style="color: var(--primary); margin-bottom: 10px; font-size: 1.25rem;">${s.title}</h3>
                    <p style="color: #64748b;">${s.text}</p>
                </div>
            `).join('') || "")}
        </main>

        <footer>
            <p>Built with LaunchPage AI 🚀</p>
        </footer>
    </body>
</html>`.trim();
}

function generateCSS(data) {
    const primary = data.style?.primaryColor || "#2563eb";
    const bg = data.style?.backgroundColor || "#ffffff";
    const text = data.style?.backgroundColor === "#0f172a" ? "#ffffff" : "#0f172a";

    return `
:root {
    --primary: ${primary};
    --secondary: #7c3aed;
    --bg: ${bg};
    --text: ${text};
    --surface: ${data.style?.backgroundColor === "#0f172a" ? "rgba(255,255,255,0.05)" : "#f1f5f9"};
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Heebo', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.hero {
    text-align: center;
    padding: 80px 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-bottom: 1px solid #cbd5e1;
    margin-bottom: 40px;
}

h1 {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 20px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    font-size: 1.25rem;
    opacity: 0.8;
    margin-bottom: 30px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.content-section {
    margin-bottom: 40px;
    padding: 30px;
    background: var(--surface);
    border-radius: 20px;
}

h2 {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: var(--primary);
}

.cta-button {
    display: inline-block;
    padding: 15px 30px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    text-decoration: none;
    font-weight: bold;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    transition: transform 0.2s;
}

.cta-button:hover {
    transform: scale(1.05);
}

.footer {
    text-align: center;
    padding: 60px 20px;
    background: #0f172a;
    color: white;
    margin-top: 60px;
}

.footer p {
    margin-bottom: 20px;
    font-size: 1.2rem;
}

@media (max-width: 600px) {
    h1 { font-size: 2.5rem; }
    .hero { padding: 50px 20px; }
}`.trim();
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div style={fullPageCenter}>טוען... 🚀</div>}>
            <ResultContent />
        </Suspense>
    );
}
