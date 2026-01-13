"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import { useUser } from '@/context/UserContext';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function SimulateContent() {
    const searchParams = useSearchParams();
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [credits, setCredits] = useState(1);
    const [siteImageUrl, setSiteImageUrl] = useState('');
    const [isLoadingImage, setIsLoadingImage] = useState(true);
    const [unlockCode, setUnlockCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSessionPro, setIsSessionPro] = useState(false);
    const [isDbPro, setIsDbPro] = useState(false);
    const router = useRouter();

    const siteId = searchParams.get('id');

    // משיכת נתוני האתר מ-Firestore
    useEffect(() => {
        const fetchSiteData = async () => {
            if (!siteId) {
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, "sites", siteId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSiteData(data);
                    // אם יש לנו לוגו ב-DB, נשתמש בו
                    if (data.logoUrl) {
                        localStorage.setItem('userLogo', data.logoUrl);
                    }
                } else {
                    console.log("לא נמצאו נתונים לאתר זה");
                    setErrorMessage("לא הצלחנו למצוא את הגדרות האתר שלך.");
                }
            } catch (error) {
                console.error("שגיאה במשיכת הנתונים:", error);
                setErrorMessage("חיבור ה-Firestore נכשל.");
            } finally {
                setLoading(false);
            }
        };

        fetchSiteData();
    }, [siteId]);

    // משתני עזר שמקבלים עדיפות מה-DB
    const desc = siteData?.prompt || searchParams.get('desc') || 'האתר שלך';
    const theme = siteData?.theme || searchParams.get('theme') || 'light';
    const businessName = siteData?.businessName || desc;
    const { isPro: contextIsPro } = useUser();

    const isPro = contextIsPro || isDbPro;

    // קוד פתיחה ידני (למשל עבור מי שקנה בווטסאפ)
    const SECRET_PRO_CODE = "LAUNCH49";

    const handleUnlock = () => {
        if (unlockCode === SECRET_PRO_CODE) {
            setIsSessionPro(true);
            // הפעלת קונפטי!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#ffffff']
            });
        } else {
            alert("קוד שגוי, נסה שוב.");
        }
    };

    const checkUserStatus = async (user) => {
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setCredits(userData.credits || 0);
                    setIsDbPro(userData.isPro || false); // כאן אנחנו מושכים את האמת מה-DB
                }
            } catch (error) {
                console.error("Error fetching user status:", error);
            }
        }
    };

    // האזנה למצב התחברות
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                checkUserStatus(user);
            }
        });
        return () => unsubscribe();
    }, []);

    const hasFullAccess = isPro || isSessionPro;

    const statuses = [
        "מנתח את תיאור העסק שלך...",
        "מגדיר פלטת צבעים מנצחת...",
        "בוצר תוכן שיווקי מבוסס AI...",
        "מתאים את הסגנון ה-Component Master...",
        "מעצב רכיבי DaisyUI יוקרתיים...",
        "מבצע אופטימיזציה לנייד...",
        "הקסם כמעט מוכן!"
    ];

    const downloadSourceCode = () => {
        if (!hasFullAccess) {
            setShowUpgradeModal(true);
            return;
        }

        // יצירת קובץ HTML מלא כולל Tailwind ו-DaisyUI
        const fullHtml = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${desc} - LaunchPage AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Heebo', sans-serif; }
    </style>
</head>
<body class="min-h-screen bg-base-100">
    ${generatedHtml}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
        saveAs(blob, "index.html");
    };

    const handleRefresh = async () => {
        if (credits <= 0) {
            setShowUpgradeModal(true); // במקום alert, נפתח מודאל יפה
            return;
        }

        // אתחול מחדש של הסימולציה
        setGeneratedHtml("");
        setProgress(0);
        setIsFinished(false);
        setCredits(prev => prev - 1);
        generateSite();
    };

    const codeLines = [
        "import React from 'react';",
        "const Layout = ({ children }) => {",
        "  return <div className='max-w-7xl mx-auto'>",
        "    <header className='flex justify-between'>",
        "    <Navbar theme='dark' />",
        "    <section id='hero' style={{ background: 'linear-gradient' }}>",
        "    <h1 className='text-6xl font-black'>Next-Gen AI Solution</h1>",
        "    <Button variant='primary'>Get Started</Button>",
        "    <img src='/assets/hero.png' alt='dashboard' />",
        "    <footer className='border-t border-slate-800'>",
        "  </div>",
        "}",
        "export default App;"
    ];

    // פונקציה לשליפת תמונה מ-Unsplash בהתאם לתיאור
    const fetchImage = async (query) => {
        setIsLoadingImage(true);
        try {
            const formattedQuery = encodeURIComponent(query.split(' ')[0] + ' website');
            const response = await fetch(`https://api.unsplash.com/photos/random?query=${formattedQuery}&client_id=6wtA5Ls-FRdpJ9tfy8-a9CB30cb3jziVw2PBvxakev4`);
            const data = await response.json();
            if (data && data.urls && data.urls.regular) {
                setSiteImageUrl(data.urls.regular);
            } else {
                setSiteImageUrl('https://images.unsplash.com/photo-1510915228340-e2d091722e1f?w=800&q=80');
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            setSiteImageUrl('https://images.unsplash.com/photo-1510915228340-e2d091722e1f?w=800&q=80');
        } finally {
            setIsLoadingImage(false);
        }
    };

    // פונקציה ליצירת האתר באמת מה-API
    const generateSite = async () => {
        try {
            const logoUrl = siteData?.logoUrl || localStorage.getItem('userLogo');
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteId: siteId,
                    prompt: desc,
                    theme: theme,
                    logoUrl: logoUrl,
                    businessName: businessName
                })
            });

            const data = await response.json();

            if (response.ok && data.html) {
                setGeneratedHtml(data.html);
            } else {
                setErrorMessage(data.error || "אופס, משהו השתבש ביצירת האתר.");
            }
        } catch (error) {
            console.error("Generation error:", error);
            setErrorMessage("חיבור השרת נכשל. נסה שוב.");
        }
    };

    // אפקט התקדמות
    useEffect(() => {
        if (progress < 100) {
            const timer = setInterval(() => {
                setProgress(prev => {
                    const next = prev + (100 / (statuses.length * 4)); // קצב קצת יותר איטי לטובת הדרמה
                    return next > 100 ? 100 : next;
                });
            }, 250);
            return () => clearInterval(timer);
        } else {
            if (!isFinished) {
                setIsFinished(true);
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                fetchImage(desc);
            }
        }
    }, [progress, desc, isFinished]);

    // הפעלת היצירה בתחילת הטעינה - רק אחרי שהנתונים מה-DB נטענו
    useEffect(() => {
        if (!loading) {
            generateSite();
        }
    }, [loading]);

    // אפקט החלפת טקסטים
    useEffect(() => {
        if (!isFinished) {
            const statusTimer = setInterval(() => {
                setStatusIndex(prev => (prev < statuses.length - 1 ? prev + 1 : prev));
            }, 2000);
            return () => clearInterval(statusTimer);
        }
    }, [isFinished]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#fff'
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ fontSize: '3rem', marginBottom: '20px' }}
                >
                    🚀
                </motion.div>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>טוען את הגדרות האתר שלך... ✨</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            padding: '140px 20px 80px', direction: 'rtl', background: '#020617', color: '#fff'
        }}>

            {!isFinished ? (
                /* פס הטעינה היוקרתי */
                <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

                    {errorMessage ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '30px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                        >
                            <p style={{ color: '#ef4444', fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>{errorMessage}</p>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    background: '#3b82f6', color: '#fff', padding: '12px 30px',
                                    borderRadius: '12px', border: 'none', cursor: 'pointer',
                                    fontWeight: 'bold', fontSize: '1rem',
                                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                                }}
                            >
                                נסה שוב 🔄
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            {/* אפקט ה"קוד הרץ" ברקע */}
                            <div style={{
                                position: 'fixed',
                                inset: 0,
                                overflow: 'hidden',
                                opacity: 0.07,
                                pointerEvents: 'none',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                color: '#3b82f6',
                                zIndex: -1
                            }}>
                                <motion.div
                                    initial={{ y: 0 }}
                                    animate={{ y: -1000 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '40px', textAlign: 'left' }}
                                >
                                    {[...Array(6)].map((_, section) => (
                                        <div key={section}>
                                            {codeLines.map((line, i) => (
                                                <div key={`${section}-${i}`} style={{ whiteSpace: 'nowrap', direction: 'ltr' }}>
                                                    <span style={{ color: '#64748b', marginRight: '15px', display: 'inline-block', width: '30px' }}>{section * codeLines.length + i + 1}</span>
                                                    {line}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '40px', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                ה-AI בונה עבורך קסם...
                            </h1>

                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={statusIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{ color: '#94a3b8', marginBottom: '20px', fontSize: '1.2rem', fontWeight: '500', minHeight: '1.5em' }}
                                >
                                    {statuses[statusIndex]}
                                </motion.p>
                            </AnimatePresence>

                            <div style={{
                                width: '100%', height: '14px', background: 'rgba(255,255,255,0.05)',
                                borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                                    }}
                                />
                            </div>

                            <p style={{ marginTop: '15px', color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {Math.round(progress)}%
                            </p>
                        </>
                    )}
                </div>
            ) : (
                /* הצגת האתר המוכן */
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ width: '100%', maxWidth: '1000px', position: 'relative' }}
                >
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>
                        🚀 הושלם! האתר שלך מוכן.
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>
                        הנה הצצה ראשונה לתוצאה של {desc}
                    </p>

                    {/* Browser Mockup */}
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '20px 20px 0 0',
                        padding: '12px 25px',
                        display: 'flex',
                        gap: '15px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: 'none',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                            <button
                                onClick={handleRefresh}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                🔄 נסה שוב
                            </button>

                            <button
                                onClick={downloadSourceCode}
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // ירוק אמרלד יוקרתי
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '14px',
                                    fontSize: '1rem',
                                    fontWeight: '900',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(16, 185, 129, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.3)';
                                }}
                            >
                                {/* איקון הורדה מנצנץ */}
                                <span style={{ fontSize: '1.2rem' }}>📥</span>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{ lineHeight: '1' }}>הורד קוד מקור מלא</span>
                                    <span style={{ fontSize: '0.65rem', opacity: '0.8', fontWeight: 'normal' }}>כולל רישיון מסחרי (HTML/CSS)</span>
                                </div>

                                {/* אפקט ברק שעובר על הכפתור */}
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '50%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                        skewX: '-20deg'
                                    }}
                                />
                            </button>
                        </div>

                        <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', padding: '4px 20px', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                            launchpage.ai/preview/{desc.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                    </div>

                    <div style={{
                        width: '100%',
                        height: '500px',
                        background: '#fff',
                        borderRadius: '0 0 20px 20px',
                        overflowY: 'auto',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7)',
                        position: 'relative',
                        userSelect: hasFullAccess ? 'text' : 'none'
                    }}>
                        <div style={{
                            filter: hasFullAccess ? 'none' : 'blur(8px)',
                            pointerEvents: hasFullAccess ? 'auto' : 'none',
                            transition: 'all 0.5s ease'
                        }}>
                            {generatedHtml ? (
                                <div className={`relative ${!hasFullAccess ? 'select-none' : ''}`} onContextMenu={(e) => !hasFullAccess && e.preventDefault()}>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: generatedHtml }}
                                        style={{ textAlign: 'right', direction: 'rtl' }}
                                    />
                                    {!hasFullAccess && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold z-50">
                                                נוצר באמצעות LaunchPage.ai 🚀
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div style={{ padding: '60px 40px', color: '#0f172a', textAlign: 'right' }}>
                                    <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>Logo</div>
                                        <div style={{ display: 'flex', gap: '20px', fontWeight: '600', color: '#64748b' }}>
                                            <span>Home</span><span>Services</span><span>Contact</span>
                                        </div>
                                    </nav>

                                    <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '20px', color: '#020617', lineHeight: '1.1' }}>
                                        {desc}
                                    </h1>
                                    <p style={{ fontSize: '1.3rem', color: '#475569', marginBottom: '40px', lineHeight: '1.6', maxWidth: '600px' }}>
                                        הפתרון המושלם לעסק שלך. נבנה, עוצב והותאם אישית ב-60 שניות ע״י LaunchPage AI.
                                    </p>

                                    {isLoadingImage ? (
                                        <div style={{ width: '100%', height: '300px', background: '#f8fafc', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                            מייצר ויזואלים...
                                        </div>
                                    ) : (
                                        <img src={siteImageUrl} alt="Preview" style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* אם המשתמש לא שילם, נציג לו את כפתור הפתיחה */}
                        {!hasFullAccess && (
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                background: 'rgba(30, 41, 59, 0.95)', padding: '40px', borderRadius: '30px', textAlign: 'center',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.6)', zIndex: 100, width: '90%', maxWidth: '400px',
                                border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'
                            }}>
                                <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>האתר הזה נעול 🔒</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input
                                        type="text"
                                        placeholder="הכנס קוד פתיחה (LAUNCH49)"
                                        value={unlockCode}
                                        onChange={(e) => setUnlockCode(e.target.value)}
                                        style={{
                                            padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(59, 130, 246, 0.5)', color: '#fff', textAlign: 'center', fontSize: '1.1rem'
                                        }}
                                    />
                                    <button
                                        onClick={handleUnlock}
                                        style={{
                                            background: '#3b82f6', color: '#fff', border: 'none', padding: '15px',
                                            borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem'
                                        }}
                                    >
                                        פתח את האתר עכשיו
                                    </button>
                                </div>
                                <p style={{ marginTop: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    אין לך קוד? <a href="/pricing" style={{ color: '#3b82f6', fontWeight: 'bold' }}>לחץ כאן לרכישה מהירה</a>
                                </p>
                            </div>
                        )}

                        {/* שכבת סימן מים (Watermark) - רק אם לא PRO */}

                        {/* כפתור הורדה צף למשתמשי PRO */}
                        {hasFullAccess && (
                            <button
                                onClick={downloadSourceCode}
                                className="fixed bottom-10 right-10 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl animate-bounce z-50 flex items-center gap-3 text-xl"
                            >
                                📥 הורד קוד מקור עכשיו
                            </button>
                        )}
                    </div>

                    {/* Paywall Overlay - רק אם לא PRO */}
                    {!hasFullAccess && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, transparent 30%, #020617 90%)',
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '60px'
                        }}>
                            <div style={{ textAlign: 'center', padding: '0 40px' }}>
                                <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>
                                    נראה מדהים? הקוד המלא מוכן בשבילך.
                                </h3>
                                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                    <button
                                        onClick={handleRefresh}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            color: '#fff', padding: '18px 40px', borderRadius: '20px',
                                            fontWeight: 'bold', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    >
                                        נסה עיצוב אחר 🔄
                                    </button>
                                    <button
                                        onClick={() => {
                                            // 1. פתיחת וואטסאפ בחלון חדש
                                            const phoneNumber = "972533407255";
                                            const message = encodeURIComponent(`היי עמית, האתר של ${desc} נראה פשוט מטורף! אני רוצה להוריד את הקוד המלא.`);
                                            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');

                                            // 2. הפעלת מצב "טעינה" באתר
                                            setIsProcessing(true);

                                            // 3. טיימר של 5 שניות ואז פתיחת האתר
                                            setTimeout(() => {
                                                setIsProcessing(false);
                                                setIsSessionPro(true);
                                                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                                            }, 5000);
                                        }}
                                        disabled={isProcessing}
                                        style={{
                                            background: isProcessing ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            color: '#fff', padding: '18px 50px', borderRadius: '20px',
                                            fontWeight: '900', fontSize: '1.3rem', border: 'none', cursor: isProcessing ? 'default' : 'pointer',
                                            boxShadow: isProcessing ? 'none' : '0 20px 40px rgba(37, 99, 235, 0.4)',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {isProcessing ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                                מאמת תשלום...
                                            </div>
                                        ) : (
                                            'הורד קוד מקור מלא (₪49) 🚀'
                                        )}
                                    </button>

                                    {isProcessing && (
                                        <p style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '0.9rem' }}>
                                            אנחנו בודקים את העברה שלך, האתר ייפתח בעוד רגע...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* פופ-אפ שדרוג PRO יוקרתי */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.9)',
                            zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: '#1e293b', padding: '40px', borderRadius: '30px',
                                maxWidth: '500px', width: '100%', textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
                            <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}>
                                הגעת לקצה גבול היכולת החינמית!
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
                                ה-AI שלנו יצר עבורך דוגמאות מדהימות. כדי להמשיך לייצר ללא הגבלה, לקבל את קוד המקור המלא ולהשיק את האתר שלך בחיבור לדומיין אישי - הצטרף ל-PRO.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <button
                                    onClick={() => window.location.href = '/pricing'}
                                    style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: '#fff', padding: '16px', borderRadius: '15px',
                                        fontSize: '1.2rem', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                                        boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)'
                                    }}
                                >
                                    שדרג עכשיו ב-₪49 בלבד ✨
                                </button>

                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    style={{
                                        background: 'transparent', color: '#64748b', border: 'none',
                                        fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline'
                                    }}
                                >
                                    אולי מאוחר יותר
                                </button>
                            </div>

                            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', gap: '20px', color: '#94a3b8', fontSize: '0.8rem' }}>
                                <span>✅ יצירה ללא הגבלה</span>
                                <span>✅ קוד מקור מלא</span>
                                <span>✅ תמיכה ב-24/7</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SimulatePage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#fff'
            }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>מתכוננים לשיגור... 🚀</p>
            </div>
        }>
            <SimulateContent />
        </Suspense>
    );
}
