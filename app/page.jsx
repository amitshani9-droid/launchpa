"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function HomeContent() {
    const [description, setDescription] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [logo, setLogo] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result); // Base64
            };
            reader.readAsDataURL(file);
        }
    };

    const themes = [
        { id: 'light', name: 'נקי ובהיר', icon: '☀️' },
        { id: 'dark', name: 'כהה ויוקרתי', icon: '🌙' },
        { id: 'corporate', name: 'עסקי ומקצועי', icon: '💼' },
        { id: 'cyberpunk', name: 'נועז וטכנולוגי', icon: '⚡' }
    ];

    const handleCreate = async () => {
        if (!description.trim()) {
            alert("אנא תאר את העסק שלך קודם! ✨");
            return;
        }

        setIsGenerating(true);
        setLoading(true);

        try {
            // 1. שמירת הנתונים ב-Firestore
            const docRef = await addDoc(collection(db, "sites"), {
                prompt: description,
                theme: selectedTheme,
                logoUrl: logo, // Base64
                createdAt: serverTimestamp(),
                isPaid: false
            });

            // 2. העברה לדף הסימולציה עם ה-ID החדש
            router.push(`/simulate?id=${docRef.id}`);

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("היתה שגיאה בשמירת הנתונים, נסה שוב.");
            setIsGenerating(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        const descFromUrl = searchParams.get('desc');
        if (descFromUrl) {
            setDescription(descFromUrl);
            // גלילה לשדה הקלט אם יש פרמטר
            const timer = setTimeout(() => {
                window.scrollTo({ top: 300, behavior: 'smooth' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top, #1e293b 0%, #020617 100%)',
            color: 'white',
            padding: '120px 20px 60px',
            direction: 'rtl'
        }}>

            <section style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 80px' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '100px',
                    color: '#60a5fa',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    marginBottom: '24px'
                }}>
                    ✨ הבינה המלאכותית שבונָה עבורך
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    fontWeight: '950',
                    lineHeight: '1.1',
                    marginBottom: '20px',
                    background: 'linear-gradient(to bottom, #fff 30%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    בנה אתר נחיתה<br />
                    <span style={{ color: '#3b82f6' }}>במהירות האור.</span>
                </h1>

                <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                    הבינה המלאכותית שלנו תהפוך את הרעיון שלך לאתר יוקרתי, מהיר ומוכן למכירות תוך פחות מ-60 שניות.
                </p>

                {/* בחירת סגנון עיצובי */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                    {themes.map((theme) => (
                        <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTheme(theme.id)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '16px',
                                border: selectedTheme === theme.id ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedTheme === theme.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                                color: selectedTheme === theme.id ? '#fff' : '#94a3b8',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                minWidth: '120px'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{theme.icon}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{theme.name}</span>
                        </motion.button>
                    ))}
                </div>

                {/* העלאת לוגו */}
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <label style={{ color: '#94a3b8', display: 'block', marginBottom: '12px', fontSize: '0.95rem' }}>יש לך לוגו? (אופציונלי)</label>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <input
                            type="file"
                            onChange={handleLogoUpload}
                            accept="image/*"
                            style={{
                                display: 'none'
                            }}
                            id="logo-upload"
                        />
                        <label
                            htmlFor="logo-upload"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px dashed rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                color: logo ? '#3b82f6' : '#94a3b8',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.2s ease',
                                fontSize: '0.9rem'
                            }}
                        >
                            <span>{logo ? "✅ לוגו נבחר" : "📁 העלאת לוגו"}</span>
                            {logo && <img src={logo} alt="logo preview" style={{ height: '24px', borderRadius: '4px' }} />}
                        </label>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    padding: '8px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    maxWidth: '600px',
                    margin: '0 auto',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <input
                        type="text"
                        placeholder="תאר את העסק שלך (למשל: מאמן כושר בחיפה...)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            flex: 1, background: 'transparent', border: 'none', color: 'white',
                            padding: '15px 20px', fontSize: '1.1rem', outline: 'none',
                            textAlign: 'right'
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreate}
                        style={{
                            position: 'relative',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: '#fff',
                            padding: '12px 35px',
                            borderRadius: '14px',
                            fontSize: '1.2rem',
                            fontWeight: '900',
                            border: 'none',
                            cursor: 'pointer',
                            overflow: 'visible',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <AnimatePresence>
                            {isGenerating && (
                                <>
                                    {[...Array(15)].map((_, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                            animate={{
                                                opacity: 0,
                                                scale: [0, 2, 0],
                                                x: (Math.random() - 0.5) * 300,
                                                y: (Math.random() - 0.5) * 300,
                                                rotate: Math.random() * 360
                                            }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            style={{ position: 'absolute', fontSize: '1.8rem', pointerEvents: 'none' }}
                                        >
                                            ✨
                                        </motion.span>
                                    ))}
                                </>
                            )}
                        </AnimatePresence>

                        <span style={{ fontSize: '1.8rem' }}>{isGenerating ? "🪄" : "✨"}</span>
                        {isGenerating ? "בונה קסם..." : "צור אתר ✨"}
                    </motion.button>
                </div>
            </section>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {[
                    { title: '1. מתארים את העסק', desc: 'כותבים מה אתם עושים, למי, ואיפה.' },
                    { title: '2. ה-AI בונה', desc: 'אנחנו מייצרים עיצוב מלא עם טקסטים שמוכרים.' },
                    { title: '3. מורידים ומשתמשים', desc: 'מקבלים קבצי ZIP מוכנים להעלאה לאוויר.' }
                ].map((f, i) => (
                    <div key={i} style={{
                        background: 'rgba(30, 41, 59, 0.3)',
                        padding: '40px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '1.5rem' }}>{f.title}</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomeContent />
        </Suspense>
    );
}
