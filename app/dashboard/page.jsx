"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew"] });

export default function Dashboard() {
    const [sites, setSites] = useState([]);
    const [userName, setUserName] = useState("אורח");
    const [isPro, setIsPro] = useState(false);
    const router = useRouter();

    const LIMIT = 3;
    const remaining = Math.max(0, LIMIT - sites.length);
    const isLimitReached = sites.length >= LIMIT && !isPro;


    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedName = localStorage.getItem("userName") || "אורח";
            const proStatus = localStorage.getItem("isProUser") === "true" || localStorage.getItem("proCoupon") === "LP-99-PRO";
            const savedSites = JSON.parse(localStorage.getItem("my_ai_sites") || "[]");

            setUserName(savedName);
            setIsPro(proStatus);
            setSites(savedSites);
        }
    }, []);

    const deleteSite = (id) => {
        if (confirm("האם אתה בטוח שברצונך למחוק את האתר?")) {
            const updated = sites.filter(s => s.id !== id);
            setSites(updated);
            localStorage.setItem("my_ai_sites", JSON.stringify(updated));
        }
    };

    const editSite = (site) => {
        localStorage.setItem('landingData', JSON.stringify(site.data));
        router.push(`/result?id=${site.id}`);
    };

    const shareSite = (site) => {
        const text = `היי, רציתי לשתף איתך את דף הנחיתה החדש שלי: ${site.title || "אתר AI"}. אפשר לראות אותו כאן:`;
        const url = `${window.location.origin}/result?id=${site.id}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className={heebo.className} dir="rtl" style={{ minHeight: '100vh', background: '#05070a', color: 'white', padding: '40px 20px', position: 'relative', overflowX: 'hidden' }}>
            {/* Background Glows */}
            <div className="glow-blob" style={{ top: "-100px", right: "-100px", opacity: 0.1 }}></div>
            <div className="glow-blob" style={{ bottom: "-100px", left: "-100px", background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)", opacity: 0.1 }}></div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

                {/* באנר אישי וסטטוס תוכנית (v36) */}
                <div style={{
                    background: isPro ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #1e40af, #7c3aed)',
                    padding: '30px', borderRadius: '24px', marginBottom: '40px', position: 'relative', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>
                            שלום, {userName} {isPro ? "💎" : "🚀"}
                        </h1>

                        {isPro ? (
                            <p style={{ color: '#60a5fa', fontWeight: 'bold' }}>אתה בתוכנית PRO - כל האפשרויות פתוחות בפניך!</p>
                        ) : (
                            <div>
                                <p style={{ opacity: 0.9, marginBottom: '15px' }}>
                                    נשארו לך <strong>{remaining > 0 ? remaining : 0}</strong> אתרים בתוכנית החינמית.
                                </p>
                                <Link href="/result?id=demo"> {/* לינק שדרוג */}
                                    <button style={{
                                        padding: '10px 20px', background: 'white', color: '#2563eb',
                                        border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
                                    }}>
                                        שדרג עכשיו ל-PRO 💎
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* אלמנט עיצובי ברקע */}
                    <div style={{
                        position: 'absolute', top: '-20px', left: '-20px', fontSize: '10rem',
                        opacity: 0.05, transform: 'rotate(-15deg)'
                    }}>🚀</div>
                </div>

                {/* כותרת משנה ופעולות */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>הפרויקטים שלי</h2>
                    <button
                        onClick={() => sites.length >= LIMIT && !isPro ? alert("הגעת למכסה!") : router.push('/')}
                        style={{
                            padding: '10px 20px', background: 'rgba(255,255,255,0.05)', color: 'white',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer'
                        }}
                    >
                        + אתר חדש
                    </button>
                </div>

                {/* Grid האתרים */}
                {sites.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '120px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '25px' }}>🚀</div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>עדיין לא יצרת אתרים</h2>
                        <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '1.1rem' }}>הגיע הזמן להזניק את העסק שלך עם דף נחיתה ראשון.</p>
                        <Link href="/create" style={{ display: 'inline-block', marginTop: '30px', textDecoration: 'none' }}>
                            <span style={{ color: '#60a5fa', fontWeight: 'bold', borderBottom: '2px solid #60a5fa' }}>בוא נתחיל עכשיו ←</span>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '25px' }}>
                        {sites.map((site) => (
                            <div key={site.id} className="site-card-premium" style={{
                                background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px',
                                border: '1px solid rgba(255,255,255,0.08)', transition: '0.4s', cursor: 'default',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{ width: '45px', height: '45px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🌐</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
                                        {new Date(site.createdAt).toLocaleDateString('he-IL')}
                                    </div>
                                </div>

                                <h3 style={{ marginBottom: '10px', fontSize: '1.4rem', fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{site.title || (site.data?.title) || "אתר ללא שם"}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '25px', height: '40px', overflow: 'hidden' }}>{site.data?.subtitle?.substring(0, 70)}...</p>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => editSite(site)}
                                        style={{
                                            flex: 1.5, padding: '12px', background: 'rgba(255,255,255,0.05)',
                                            color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', fontSize: '0.9rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    >עריכה ✏️</button>

                                    <button
                                        onClick={() => shareSite(site)}
                                        style={{
                                            flex: 1, padding: '12px', background: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', fontSize: '0.9rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.2)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.1)'}
                                    >שיתוף 🔗</button>

                                    <button
                                        onClick={() => deleteSite(site.id)}
                                        style={{ width: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.05)'}
                                    >🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* כפתור הדרכה להצלחה (v31) */}
                <button
                    onClick={() => alert("🚀 3 טיפים להבאת לקוחות:\n\n1. טיפ הוואטסאפ: שלח את הלינק ל-20 לקוחות עבר שלך עם הצעה מיוחדת. זה הליד הכי זול שתקבל. 💬\n\n2. טיפ הסטורי: תעלה צילום מסך של דף הנחיתה החדש לסטורי עם כפתור 'פרטים נוספים'. אנשים אוהבים לראות דברים חדשים. 📸\n\n3. טיפ SEO המהיר: וודא שהכותרת הראשונה (H1) מכילה את שם העיר שלך. גוגל יסרוק אותך מהר יותר. 🔍")}
                    style={{
                        marginTop: '20px', padding: '10px 20px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', width: '100%', fontSize: '0.9rem', fontWeight: 'bold'
                    }}
                >
                    איך להביא לקוחות לדף שלי? 💡
                </button>
                Riverside, v31
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .site-card-premium:hover {
            transform: translateY(-8px);
            border-color: #2563eb !important;
            background: rgba(255,255,255,0.05) !important;
        }
      `}} />
        </div>
    );
}
