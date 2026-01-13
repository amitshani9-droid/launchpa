"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew"] });

const loadingMessages = [
    "מנתח את קהל היעד שלך... 🔍",
    "מזקק את התועלות המרכזיות... ✨",
    "מעצב ממשק יוקרתי בסטייל Rocket... 🚀",
    "כותב קופי שיווקי במודל AIDA... ✍️",
    "מתאים צבעים ופונטים לעסק שלך... 🎨",
    "מוסיף אנימציות ונגישות... ⚙️",
    "עוד רגע וזה מוכן... מבטיחים שזה שווה את זה! 💎"
];


export default function CreateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get('p') || "";

    const [loading, setLoading] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [mode, setMode] = useState("manual"); // 'manual' or 'url'
    const [isPro, setIsPro] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);

    const [formData, setFormData] = useState({
        title: initialPrompt,
        goal: "לידים",
        existingUrl: ""
    });

    useEffect(() => {
        // בדיקה אם המשתמש הוא PRO
        const admin = localStorage.getItem("isAdmin") === "true";
        const coupon = localStorage.getItem("proCoupon") === "PRO2026";
        setIsPro(admin || coupon);

        if (loading) {
            const interval = setInterval(() => {
                setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // חסימת פיצ'ר URL ללא תשלום - שימוש במודאל יוקרתי במקום alert
        if (mode === 'url' && !isPro) {
            setShowPaywall(true);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                // אם אנחנו במצב URL, שולחים אותו. אחרת, שולחים רק טקסט
                existingUrl: mode === 'url' ? formData.existingUrl : "",
                adminSecret: localStorage.getItem("isAdmin") === "true" ? "king" : "",
                couponCode: localStorage.getItem("proCoupon") || ""
            };

            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // שמירה לרשימת האתרים של המשתמש (v28 Multi-site support)
            const history = JSON.parse(localStorage.getItem('my_ai_sites') || '[]');
            const newSite = {
                id: Date.now(),
                title: data.title || "אתר חדש",
                createdAt: new Date().toISOString(),
                data: data
            };
            localStorage.setItem('my_ai_sites', JSON.stringify([newSite, ...history]));
            localStorage.setItem('lastSiteId', newSite.id.toString());
            localStorage.setItem('landingData', JSON.stringify(data));

            router.push("/result");

        } catch (err) {
            alert("שגיאה: " + err.message);
            setLoading(false);
        }
    };

    return (
        <div className={heebo.className} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "15px", direction: "rtl", position: "relative" }}>
            <div className="glow-blob" style={{ top: "-100px", right: "-100px" }}></div>
            <div className="glow-blob" style={{ bottom: "-100px", left: "-100px", background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)" }}></div>


            {loading ? (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: '#05070a', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    {/* אנימציית טיל מרחף */}
                    <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'float 2s infinite ease-in-out' }}>🚀</div>

                    <h2 style={{ color: 'white', fontWeight: '900', fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center', padding: '0 20px' }}>
                        {loadingMessages[messageIndex]}
                    </h2>

                    {/* פס טעינה מתקדם */}
                    <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${((messageIndex + 1) / loadingMessages.length) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                            transition: 'width 0.5s ease'
                        }}></div>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes float {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-20px); }
                        }
                        `
                    }} />
                </div>
            ) : (
                <div className="glass-card" style={{ width: "100%", maxWidth: "500px", padding: "35px", borderRadius: "24px", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <Link href="/" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.9rem' }}>🏠 דף הבית</Link>
                            <Link href="/dashboard" style={{ textDecoration: 'none', color: '#60a5fa', fontSize: '0.9rem', fontWeight: 'bold' }}>📁 האתרים שלי</Link>
                        </div>
                        <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "white", marginBottom: "8px" }}>בוא נבנה לך אתר 🏗️</h1>
                        <p style={{ color: "#94a3b8", fontSize: "1rem" }}>בחר איך להתחיל את הקסם:</p>
                    </div>


                    {/* טאבים לבחירה */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "25px", background: "#f1f5f9", padding: "5px", borderRadius: "12px" }}>
                        <button
                            type="button"
                            onClick={() => setMode("manual")}
                            style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: mode === "manual" ? "white" : "transparent", fontWeight: "bold", color: mode === "manual" ? "#2563EB" : "#64748b", cursor: "pointer", boxShadow: mode === "manual" ? "0 2px 5px rgba(0,0,0,0.05)" : "none", transition: "0.2s" }}>
                            ✍️ תיאור ידני
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("url")}
                            style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: mode === "url" ? "white" : "transparent", fontWeight: "bold", color: mode === "url" ? "#7C3AED" : "#64748b", cursor: "pointer", position: "relative", boxShadow: mode === "url" ? "0 2px 5px rgba(0,0,0,0.05)" : "none", transition: "0.2s" }}>
                            🔗 יבוא מאתר
                            {!isPro && <span style={{ position: "absolute", top: "-5px", left: "-5px", fontSize: "10px", background: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "10px" }}>PRO</span>}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {mode === "manual" ? (
                            <>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#94a3b8", fontSize: "0.9rem" }}>תיאור העסק</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="למשל: צלם אירועים במרכז"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "16px", outline: "none" }}
                                    />
                                </div>
                                <div style={{ marginBottom: "25px" }}>
                                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#94a3b8", fontSize: "0.9rem" }}>מה המטרה?</label>
                                    <select
                                        value={formData.goal}
                                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                        style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "16px", outline: "none" }}
                                    >
                                        <option value="לידים" style={{ color: "black" }}>📞 השארת פרטים (לידים)</option>
                                        <option value="מכירות" style={{ color: "black" }}>🛒 מכירת מוצר</option>
                                        <option value="תדמית" style={{ color: "black" }}>ℹ️ כרטיס ביקור דיגיטלי</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: "30px" }}>
                                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#334155", fontSize: "0.9rem" }}>כתובת האתר הקיים</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://www.example.co.il"
                                    value={formData.existingUrl}
                                    onChange={(e) => setFormData({ ...formData, existingUrl: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid #7C3AED", background: "rgba(124, 58, 237, 0.05)", color: "white", fontSize: "16px", outline: "none" }}
                                />
                                <p style={{ fontSize: "0.85rem", color: "#7C3AED", marginTop: "12px", lineHeight: "1.4" }}>
                                    🤖 ה-AI ייכנס לאתר, ילמד אותו, ויבנה גרסה משופרת וממירה יותר.
                                </p>
                            </div>
                        )}

                        <button type="submit" style={{ width: "100%", padding: "16px", background: mode === 'url' ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer", boxShadow: mode === 'url' ? "0 10px 25px -5px rgba(124, 58, 237, 0.4)" : "0 10px 25px -5px rgba(37, 99, 235, 0.4)", transition: "0.2s" }}>
                            {mode === 'url' ? "🚀 שדרג לי את האתר" : "✨ צור אתר עכשיו"}
                        </button>
                    </form>
                </div>
            )}

            {/* חלון שדרוג יוקרתי שקופץ בלחיצה על פיצ'ר נעול */}
            {showPaywall && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '20px' }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '28px', textAlign: 'center', maxWidth: '450px', width: '100%', boxShadow: '0 25px 70px -12px rgba(0,0,0,0.4)', position: 'relative' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>💎</div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1e293b', marginBottom: '12px', lineHeight: '1.1' }}>פיצ'ר PRO בלבד</h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
                            יבוא אתר קיים הוא כלי עוצמתי שחוסך שעות של עבודה. שדרג עכשיו כדי שה-AI שלנו ינתח את האתר שלך ויבנה עבורך גרסה משופרת, מהירה וממירה פי 3!
                        </p>

                        <Link href="/checkout" style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'block', width: '100%', padding: '18px', background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', color: 'white', borderRadius: '14px', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.5)', transition: '0.2s', textAlign: 'center', cursor: 'pointer' }}>
                                🚀 שדרג עכשיו ב-49₪ בלבד
                            </div>
                        </Link>

                        <button onClick={() => setShowPaywall(false)} style={{ marginTop: '25px', background: 'transparent', border: 'none', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>
                            אולי מאוחר יותר
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
