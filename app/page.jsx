"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function HomeContent() {
    const [description, setDescription] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [logo, setLogo] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const themes = [
        { id: 'light', name: 'נקי ובהיר', icon: '☀️' },
        { id: 'dark', name: 'כהה ויוקרתי', icon: '🌙' },
        { id: 'corporate', name: 'עסקי ומקצועי', icon: '💼' },
        { id: 'cyberpunk', name: 'נועז וטכנולוגי', icon: '⚡' }
    ];

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogo(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async () => {
        if (!description.trim()) {
            alert("אנא תאר את העסק שלך קודם! ✨");
            return;
        }
        setIsGenerating(true);
        try {
            const docRef = await addDoc(collection(db, "sites"), {
                prompt: description,
                theme: selectedTheme,
                logoUrl: logo,
                createdAt: serverTimestamp(),
                isPaid: false
            });
            router.push(`/simulate?id=${docRef.id}`);
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("היתה שגיאה בשמירת הנתונים, נסה שוב.");
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const descFromUrl = searchParams.get('desc');
        if (descFromUrl) setDescription(descFromUrl);
    }, [searchParams]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={mainContainerStyle}
        >
            {/* HERO SECTION */}
            <section style={heroSectionStyle}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={badgeStyle}
                >
                    ✨ הבינה המלאכותית שבונָה עבורך
                </motion.div>

                <h1 style={headlineStyle}>
                    בנה אתר נחיתה<br />
                    <span style={{ color: '#3b82f6' }}>במהירות האור.</span>
                </h1>

                <p style={subtitleStyle}>
                    הפוך רעיון לאתר יוקרתי, מהיר ומוכן למכירות תוך פחות מ-60 שניות.
                </p>

                <div style={reassuranceStyle}>
                    בלי כרטיס אשראי · אפשר לערוך אחר כך
                </div>
            </section>

            {/* MAIN ACTION BLOCK */}
            <section style={actionWrapperStyle}>
                <div style={glassCardStyle}>
                    <label style={inputLabelStyle}>מה העסק שלך?</label>
                    <div style={inputGroupStyle}>
                        <input
                            type="text"
                            placeholder="תאר את העסק שלך (למשל: מאמן כושר בחיפה...)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={inputStyle}
                        />
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreate}
                            style={ctaButtonStyle}
                        >
                            <AnimatePresence>
                                {isGenerating && (
                                    <div style={sparkleContainerStyle}>
                                        {[...Array(10)].map((_, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 1, scale: 0 }}
                                                animate={{ opacity: 0, scale: 2, x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 }}
                                                transition={{ duration: 0.8 }}
                                                style={{ position: 'absolute' }}
                                            >✨</motion.span>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                            <span style={{ fontSize: '1.6rem' }}>{isGenerating ? "🪄" : "✨"}</span>
                            <span>{isGenerating ? "בונה קסם..." : "צור אתר עכשיו"}</span>
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* STYLE SELECTION */}
            <section style={sectionGapStyle}>
                <h2 style={sectionTitleStyle}>בחר סגנון עיצוב (אפשר לשנות אחר כך)</h2>
                <div style={themeGridStyle}>
                    {themes.map((theme) => (
                        <motion.button
                            key={theme.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedTheme(theme.id)}
                            style={{
                                ...themeCardStyle,
                                border: selectedTheme === theme.id ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedTheme === theme.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                                boxShadow: selectedTheme === theme.id ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
                            }}
                        >
                            {selectedTheme === theme.id && <div style={checkIndicatorStyle}>✓</div>}
                            <span style={{ fontSize: '2rem', marginBottom: '8px' }}>{theme.icon}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: selectedTheme === theme.id ? '#fff' : '#94a3b8' }}>{theme.name}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* LOGO UPLOAD (SECONDARY) */}
            <section style={sectionGapStyle}>
                <div style={logoWrapperStyle}>
                    <p style={logoLabelStyle}>יש לך לוגו? (אופציונלי)</p>
                    <input type="file" onChange={handleLogoUpload} accept="image/*" style={{ display: 'none' }} id="logo-upload" />
                    <label htmlFor="logo-upload" style={logoUploadBtnStyle}>
                        <span>{logo ? "✅ לוגו נבחר" : "📁 העלאת לוגו"}</span>
                        {logo && <Image src={logo} alt="logo preview" width={40} height={20} unoptimized style={logoImageStyle} />}
                    </label>
                </div>
            </section>

            {/* FEATURES FOOTER */}
            <footer style={footerGridStyle}>
                {[
                    { title: '1. מתארים את העסק', desc: 'כותבים מה אתם עושים, למי, ואיפה.' },
                    { title: '2. ה-AI בונה', desc: 'אנחנו מייצרים עיצוב מלא עם טקסטים שמוכרים.' },
                    { title: '3. מורידים ומשתמשים', desc: 'מקבלים קבצי ZIP מוכנים להעלאה לאוויר.' }
                ].map((f, i) => (
                    <div key={i} style={featureCardStyle}>
                        <h3 style={featureTitleStyle}>{f.title}</h3>
                        <p style={featureDescStyle}>{f.desc}</p>
                    </div>
                ))}
            </footer>
        </motion.div>
    );
}

// --- STYLES ---
const mainContainerStyle = { minHeight: '100vh', background: 'radial-gradient(circle at top, #1e293b 0%, #020617 100%)', color: 'white', padding: '120px 20px 100px', direction: 'rtl' };
const heroSectionStyle = { textAlign: 'center', maxWidth: '900px', margin: '0 auto 60px' };
const badgeStyle = { display: 'inline-block', padding: '6px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '100px', color: '#60a5fa', fontSize: '0.9rem', fontWeight: '600', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '24px' };
const headlineStyle = { fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: '950', lineHeight: '1.1', marginBottom: '20px', background: 'linear-gradient(to bottom, #fff 30%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
const subtitleStyle = { fontSize: '1.4rem', color: '#94a3b8', marginBottom: '20px', maxWidth: '650px', margin: '0 auto 20px' };
const reassuranceStyle = { color: '#64748b', fontSize: '0.95rem', fontWeight: '500' };
const actionWrapperStyle = { maxWidth: '800px', margin: '0 auto 80px' };
const glassCardStyle = { background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', textAlign: 'right' };
const inputLabelStyle = { display: 'block', color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '15px', marginRight: '5px' };
const inputGroupStyle = { display: 'flex', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' };
const inputStyle = { flex: 1, minWidth: '280px', background: 'transparent', border: 'none', color: 'white', padding: '12px 15px', fontSize: '1.1rem', outline: 'none', textAlign: 'right' };
const ctaButtonStyle = { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', padding: '14px 40px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: '900', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 auto', width: 'auto', margin: '0 0 0 auto' };
const sparkleContainerStyle = { position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sectionGapStyle = { maxWidth: '1000px', margin: '0 auto 80px', textAlign: 'center' };
const sectionTitleStyle = { color: '#94a3b8', fontSize: '1.1rem', marginBottom: '25px', fontWeight: '600' };
const themeGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' };
const themeCardStyle = { position: 'relative', padding: '24px', borderRadius: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' };
const checkIndicatorStyle = { position: 'absolute', top: '12px', right: '12px', background: '#3b82f6', color: 'white', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
const logoWrapperStyle = { textAlign: 'center' };
const logoLabelStyle = { color: '#64748b', fontSize: '0.95rem', marginBottom: '15px' };
const logoUploadBtnStyle = { display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '16px', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' };
const logoImageStyle = { height: '24px', width: 'auto', borderRadius: '4px' };
const footerGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' };
const featureCardStyle = { background: 'rgba(255, 255, 255, 0.02)', padding: '35px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' };
const featureTitleStyle = { color: '#fff', fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px' };
const featureDescStyle = { color: '#64748b', lineHeight: '1.6', fontSize: '1rem' };

export default function Home() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#020617' }} />}>
            <HomeContent />
        </Suspense>
    );
}
