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
    const { isPro } = useUser();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Coupon State
    const [coupon, setCoupon] = useState("");
    const [discountApplied, setDiscountApplied] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Watch for PRO upgrades
    useEffect(() => {
        if (!user) return;

        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            const data = doc.data();
            // If user became PRO and hasn't been notified yet
            if (data?.isPro && !localStorage.getItem('notifiedPro')) {
                setShowConfetti(true);
                localStorage.setItem('notifiedPro', 'true');
                alert("מזל טוב! 🎉 החשבון שלך שודרג ל-PRO. כל האתרים פתוחים כעת להורדה!");

                // Stop confetti after 5 seconds
                setTimeout(() => setShowConfetti(false), 8000);
            }

            // Sync user state with Firestore updates (real-time credits/pro status)
            if (data) {
                setUser(prev => ({ ...prev, ...data }));
            }
        });

        return () => unsub();
    }, [user?.uid]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Using basic auth object for now to bypass build sync issues
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const upgradeViaWhatsapp = () => {
        window.open(`https://wa.me/972533407255?text=${encodeURIComponent("היי עמית, אני רוצה לשדרג ל-PRO באתר LaunchPage! 🚀")}`, "_blank");
    };

    const shareSite = () => {
        const title = data.hero ? data.hero.title : data.title;
        const text = `תראו את האתר ש-AI בנה לי בשניות עבור: ${title}!`;
        const url = window.location.href;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
    };

    function saveToHistory(prompt, data) {
        if (typeof window !== 'undefined') {
            try {
                const history = JSON.parse(localStorage.getItem('launchpage_history') || '[]');
                const newEntry = { prompt, data, date: new Date().toISOString() };
                localStorage.setItem('launchpage_history', JSON.stringify([newEntry, ...history]));
            } catch (e) {
                console.error("Failed to save history", e);
            }
        }
    }

    const checkCoupon = () => {
        if (coupon.toUpperCase() === "LAUNCH2026") {
            setDiscountApplied(true);
            alert("קופון הופעל! הנחה של 50% בחיוב מול עמית בוואטסאפ ✨");
        } else {
            alert("קופון לא בתוקף");
        }
    };

    const saveSiteToFirestore = async (currentData) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "users", user.uid, "sites"), {
                title: currentData.hero?.title || currentData.title,
                content: currentData,
                createdAt: serverTimestamp()
            });
            console.log("Site saved to Firestore!");
        } catch (e) {
            console.error("Error saving site: ", e);
        }
    };

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError("");

            // 0. Load from Local Storage (Simulate Handoff)
            if (params.get('local') === 'true') {
                try {
                    const localData = localStorage.getItem('generatedSite');
                    if (localData) {
                        const parsed = JSON.parse(localData);
                        setData(parsed);
                        saveToHistory(parsed.hero?.title || "אתר חדש", parsed);
                        saveSiteToFirestore(parsed);
                        setLoading(false);

                        // Clear param to avoid re-saving on refresh (optional, but cleaner)
                        // router.replace('/result?id=' + newId); // Logic for later
                        return;
                    }
                } catch (e) {
                    console.error("Local load failed", e);
                }
            }

            // 1. Load by ID (from My Sites)
            if (siteId && user) {
                try {
                    const docRef = doc(db, "users", user.uid, "sites", siteId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const siteData = docSnap.data();
                        setData(siteData.content);
                        setLoading(false);
                        return;
                    } else {
                        setError("האתר לא נמצא");
                    }
                } catch (e) {
                    console.error("Error loading site:", e);
                    setError("שגיאה בטעינת האתר");
                }
                setLoading(false);
                return;
            }

            // 2. Generate New (if prompt exists and NOT local)
            if (prompt && params.get('local') !== 'true') {
                generateNewSite();
            }
        }

        if (user || prompt || params.get('local')) loadData();
    }, [prompt, siteId, user, params]);

    async function generateNewSite() {
        // --- SIMULATION MODE ---
        if (prompt === "TEST_SIMULATION") {
            await new Promise(r => setTimeout(r, 800));

            const userInput = params.get('description') || params.get('prompt') || "העסק החדש שלי";

            const themes = [
                { primary: "#6366f1", bg: "#f8fafc" },
                { primary: "#059669", bg: "#f0fdf4" },
                { primary: "#2563eb", bg: "#eff6ff" },
                { primary: "#ef4444", bg: "#fef2f2" },
                { primary: "#f59e0b", bg: "#fffbeb" }
            ];
            const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

            const finalSite = {
                hero: {
                    title: userInput,
                    description: `הפתרון המקצועי ביותר עבור ${userInput}. אנחנו כאן כדי לעזור לך לצמוח.`,
                    cta: "צור קשר עכשיו"
                },
                features: [
                    { title: "שירות אישי", desc: "מותאם בדיוק לצרכים של העסק שלך." },
                    { title: "זמינות גבוהה", desc: "אנחנו כאן בשבילך 24/7 לכל שאלה." },
                    { title: "תוצאות מוכחות", desc: "עוזרים לעסקים להצליח כבר מעל עשור." }
                ],
                style: {
                    primaryColor: selectedTheme.primary,
                    backgroundColor: selectedTheme.bg
                },
                title: userInput,
                subtitle: `הפתרון המקצועי ביותר עבור ${userInput}. אנחנו כאן כדי לעזור לך לצמוח.`,
                sections: [
                    { title: "שירות אישי", text: "מותאם בדיוק לצרכים של העסק שלך." },
                    { title: "זמינות גבוהה", text: "אנחנו כאן בשבילך 24/7 לכל שאלה." }
                ],
                cta_button: "צור קשר עכשיו",
                cta_text: "רוצה לשמוע עוד?",
                color_theme: "custom"
            };

            setData(finalSite);
            saveToHistory(userInput !== "העסק החדש שלי" ? userInput : "סימולציה", finalSite);
            saveSiteToFirestore(finalSite);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.error || "שגיאה ביצירת הדף");
                return;
            }

            setData(json);
            saveToHistory(prompt, json);
            saveSiteToFirestore(json);
        } catch (err) {
            setError("שגיאה בשרת. נסה שוב.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (data) {
            const timer = setTimeout(() => {
                if (!isPro) setIsUpgradeModalOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [data, isPro]);

    const handleDownload = async () => {
        if (!isPro) {
            setIsUpgradeModalOpen(true);
            return;
        }

        if (!data) return;

        const zip = new JSZip();
        const html = generateHTML(data);
        const css = generateCSS(data);

        zip.file("index.html", html);
        zip.file("style.css", css);
        zip.file("README.txt", "תודה שרכשת את האתר שלך דרך LaunchPage AI! 🚀");

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "landing-page.zip");
    };

    if (loading) {
        return (
            <div className={heebo.className} dir="rtl" style={{
                minHeight: "100vh",
                background: "#05070a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem"
            }}>
                מייצר את הדף שלך... 🚀
            </div>
        );
    }

    if (error) {
        return (
            <div className={heebo.className} dir="rtl" style={{
                minHeight: "100vh",
                background: "#05070a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "10px"
            }}>
                <p>{error}</p>
                <p style={{ opacity: 0.7 }}>נסה לחזור אחורה ולמלא שוב את הפרטים.</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className={heebo.className} dir="rtl" style={{
            minHeight: "100vh",
            background: "#05070a",
            color: "white",
            display: "flex",
            flexDirection: "column"
        }}>
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}

            <div style={{ display: "flex", flex: 1, padding: "20px", gap: "20px" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <RocketPreview data={data} />

                    {!isPro && (
                        <div style={{ marginTop: '40px', textAlign: 'center' }}>
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                style={{
                                    padding: '15px 30px',
                                    fontSize: '1.2rem',
                                    backgroundColor: '#22c55e',
                                    color: 'white',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                                }}
                            >
                                💎 שדרג ל-PRO והורד את הקוד המלא
                            </button>
                        </div>
                    )}
                </div>

                <div style={{
                    width: "300px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "20px",
                    padding: "20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    height: "fit-content"
                }}>
                    <h3 style={{ marginBottom: "15px", fontSize: "1.3rem" }}>אפשרויות</h3>

                    <button onClick={handleDownload} style={sideBtn}>
                        הורדת ZIP (PRO)
                        {!isPro && <span style={{ fontSize: "0.8rem", marginRight: "5px" }}>🔒</span>}
                    </button>
                    <button onClick={shareSite} style={sideBtn}>שתף בוואטסאפ 💬</button>
                    <button style={sideBtn}>שמור לדשבורד</button>
                    <button style={sideBtn}>שכפל דף</button>

                    <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
                        <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>יש לך קופון?</p>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="text"
                                placeholder="קוד קופון"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    border: "none",
                                    fontSize: "0.9rem"
                                }}
                            />
                            <button
                                onClick={checkCoupon}
                                style={{
                                    background: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "0 10px",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                            >
                                ✓
                            </button>
                        </div>
                        {discountApplied && <p style={{ color: "#4ade80", fontSize: "0.8rem", marginTop: "5px" }}>קופון פעיל: 50% הנחה!</p>}
                    </div>

                    {!isPro && (
                        <button
                            onClick={upgradeViaWhatsapp}
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                padding: "14px",
                                background: "linear-gradient(135deg, #10b981, #059669)",
                                border: "none",
                                borderRadius: "12px",
                                color: "white",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "1rem",
                                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)"
                            }}
                        >
                            שדרג לחשבון PRO 🚀
                        </button>
                    )}
                </div>

                {isUpgradeModalOpen && (
                    <div style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
                    }} onClick={() => setIsUpgradeModalOpen(false)}>
                        <div style={{
                            background: '#1e293b', padding: '30px', borderRadius: '24px',
                            textAlign: 'right', color: 'white', maxWidth: '500px', width: '100%',
                            border: '2px solid #3b82f6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                        }} onClick={e => e.stopPropagation()}>
                            <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '20px' }}>🚀 שדרג ל-PRO וקבל את האתר שלך</h2>

                            <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                    ✅ <b>קוד מקור מלא:</b> הורדת קובץ ZIP מוכן להעלאה לכל שרת.
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                    ✅ <b>עיצוב רספונסיבי:</b> התאמה מושלמת למובייל, טאבלט ודסקטופ.
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                    ✅ <b>עריכה חופשית:</b> אפשרות לשנות טקסטים, צבעים ותמונות בקוד.
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                    ✅ <b>ללא פרסומות:</b> האתר נקי ממותג LaunchPage-AI.
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                    ✅ <b>תמיכה אישית:</b> ליווי בוואטסאפ עד שהאתר באוויר.
                                </p>
                            </div>

                            <div style={{
                                textAlign: 'center',
                                margin: '20px 0',
                                padding: '15px',
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '16px',
                                border: '1px dashed #22c55e'
                            }}>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through', margin: 0 }}>
                                    מחיר רגיל: ₪200
                                </p>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#22c55e' }}>₪49</span>
                                    <span style={{ fontSize: '1rem', color: '#22c55e' }}>בלבד</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '5px', fontWeight: 'bold' }}>
                                    🔥 מבצע השקה חד-פעמי: מעל 75% הנחה!
                                </p>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px' }}>יש לך קופון הנחה?</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="הזן קוד..."
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', color: 'black' }}
                                    />
                                    <button onClick={checkCoupon} style={{ background: '#3b82f6', color: 'white', padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: "pointer" }}>הפעל</button>
                                </div>
                                {discountApplied && <p style={{ color: "#4ade80", fontSize: "0.8rem", marginTop: "10px", fontWeight: "bold" }}>קופון פעיל: 50% הנחה!</p>}
                            </div>

                            <button onClick={upgradeViaWhatsapp} style={{
                                background: '#22c55e', width: '100%', padding: '15px', borderRadius: '12px',
                                border: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                            }}>
                                💬 שדרג עכשיו בוואטסאפ
                            </button>

                            <button onClick={() => setIsUpgradeModalOpen(false)} style={{ width: '100%', background: 'transparent', border: 'none', color: '#64748b', marginTop: '10px', cursor: 'pointer' }}>
                                אולי מאוחר יותר
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

const sideBtn = {
    width: "100%",
    padding: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "white",
    fontWeight: "bold",
    marginBottom: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px"
};

// --- Helper Functions ---

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
        <Suspense fallback={
            <div className={heebo.className} dir="rtl" style={{
                minHeight: "100vh",
                background: "#05070a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem"
            }}>
                טוען... 🚀
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}
