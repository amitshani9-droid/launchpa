"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heebo } from "next/font/google";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { VALID_PRO_CODES, SITE_LIMIT } from "@/lib/constants";

const heebo = Heebo({ subsets: ["hebrew"] });

export default function Dashboard() {
    const [sites, setSites] = useState([]);
    const [userName, setUserName] = useState("אורח");
    const [isPro, setIsPro] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    const LIMIT = SITE_LIMIT;
    const remaining = Math.max(0, LIMIT - sites.length);
    const isLimitReached = sites.length >= LIMIT && !isPro;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Sync with Firestore
                const unsubSnap = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    if (doc.exists() && doc.data().isPro) {
                        setIsPro(true);
                        localStorage.setItem("isProUser", "true");
                    }
                });
                return () => unsubSnap();
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedName = localStorage.getItem("userName") || "אורח";
            const proStatus = localStorage.getItem("isProUser") === "true" ||
                VALID_PRO_CODES.includes(localStorage.getItem("proCoupon"));
            const savedSites = JSON.parse(localStorage.getItem("my_ai_sites") || "[]");

            setTimeout(() => {
                setUserName(savedName);
                if (proStatus) setIsPro(true);
                setSites(savedSites);
            }, 0);
        }
    }, [isPro]); // Added isPro to satisfy lint and logic

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
                        {user && user.photoURL && (
                            <Image
                                src={user.photoURL}
                                width={45}
                                height={45}
                                style={{ borderRadius: '50%', border: '2px solid #3b82f6' }}
                                alt="Profile"
                            />
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

                {sites.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '100px 20px', background: 'rgba(30, 41, 59, 0.3)',
                        borderRadius: '30px', border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '25px' }}>🚀</div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>עדיין לא יצרת אתרים</h2>
                        <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '1.1rem' }}>הגיע הזמן להזניק את העסק שלך עם דף נחיתה ראשון.</p>
                        <Link href="/" style={{ display: 'inline-block', marginTop: '30px', textDecoration: 'none' }}>
                            <span style={{ color: '#60a5fa', fontWeight: 'bold', borderBottom: '2px solid #60a5fa' }}>בוא נתחיל עכשיו ←</span>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        {sites.map(site => (
                            <div key={site.id} style={{
                                background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', padding: '25px',
                                border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{site.title || "אתר AI"}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(site.id).toLocaleDateString('he-IL')}</div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <button onClick={() => editSite(site)} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>צפה/ערוך</button>
                                    <button onClick={() => shareSite(site)} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>שתף 🔗</button>
                                    <button onClick={() => deleteSite(site.id)} style={{ gridColumn: 'span 2', padding: '10px', background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>מחק אתר 🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
