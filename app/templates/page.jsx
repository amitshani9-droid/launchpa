"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SUPPORT_PHONE } from '@/lib/constants';

export default function TemplatesPage() {
    const [selectedPreview, setSelectedPreview] = useState(null);
    const [isMagic, setIsMagic] = useState(false);

    const templates = [
        {
            id: 'chef',
            title: "קולינריה",
            subtitle: "מסעדת שף יוקרתית",
            heroTitle: "חוויה קולינרית שמתחילה במבט ראשון",
            heroSub: "מנות גורמה, אווירה מכשפת ושירות ללא פשרות. הזמינו שולחן לערב בלתי נשכח.",
            features: ["🍽️ תפריט עונתי", "🍷 יינות בוטיק", "🕯️ אווירה רומנטית"],
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
            tag: "Premium",
            primaryColor: "#0f172a"
        },
        {
            id: 'saas',
            title: "טכנולוגיה",
            subtitle: "מערכת ניהול עסק חכמה",
            heroTitle: "תפסיקו לעבוד קשה, תתחילו לעבוד חכם",
            heroSub: "כל הכלים שאתם צריכים לניהול העסק במקום אחד. אוטומיזציה, דאטה וצמיחה מהירה.",
            features: ["📊 דאשבורד חכם", "☁️ סנכרון בענן", "🔒 אבטחה מקסימלית"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            tag: "SaaS",
            primaryColor: "#3b82f6"
        },
        {
            id: 'fitness',
            title: "בריאות",
            subtitle: "סטודיו יוגה ופילאטיס",
            heroTitle: "מצאו את האיזון הפנימי שלכם",
            heroSub: "שיעורים לכל הרמות באווירה רגועה ומקצועית. הצטרפו לקהילה שדואגת לגוף ולנפש.",
            features: ["🧘 מדריכים מוסמכים", "✨ קבוצות קטנות", "🍏 ייעוץ תזונתי"],
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
            tag: "Active",
            primaryColor: "#10b981"
        }
    ];

    return (
        <div style={{ padding: '140px 20px 80px', maxWidth: '1200px', margin: '0 auto', direction: 'rtl', minHeight: '100vh', background: '#020617' }}>

            {/* כותרת עם אנימציית כניסה */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '80px' }}
            >
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginBottom: '20px', letterSpacing: '-1px' }}>
                    התבניות שלנו <span style={{ color: '#3b82f6' }}>.</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    צפו בתצוגה מקדימה של אתרים שעוצבו על ידי ה-AI שלנו ומותאמים אישית לעסק שלכם.
                </p>
            </motion.header>

            {/* גריד הכרטיסיות המונפש */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ y: -12, transition: { duration: 0.2 } }}
                        style={{
                            background: 'rgba(30, 41, 59, 0.3)', borderRadius: '28px', overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ position: 'relative', height: '230px' }}>
                            <Image src={template.image} alt={template.title} fill style={{ objectFit: 'cover' }} unoptimized />
                            <div style={{
                                position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.9), transparent)',
                                display: 'flex', alignItems: 'flex-end', padding: '25px'
                            }}>
                                <button
                                    onClick={() => setSelectedPreview(template)}
                                    style={{
                                        background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px',
                                        borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                        boxShadow: '0 8px 15px rgba(59, 130, 246, 0.3)'
                                    }}
                                >
                                    👁️ תצוגה מקדימה
                                </button>
                            </div>
                            <span style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(2, 6, 23, 0.6)', backdropFilter: 'blur(5px)', color: '#fff', padding: '6px 14px',
                                borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {template.tag}
                            </span>
                        </div>

                        <div style={{ padding: '30px' }}>
                            <h4 style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '700' }}>{template.title}</h4>
                            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '12px', fontWeight: '800' }}>{template.subtitle}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '25px', height: '50px', lineHeight: '1.6' }}>{template.description}</p>
                            <button
                                onClick={() => window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent("היי עמית, אהבתי את תבנית ה-" + template.title + " לעסק שלי!")}`)}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '15px', border: '1px solid rgba(59, 130, 246, 0.3)',
                                    background: 'transparent', color: '#3b82f6', fontWeight: '700', cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.target.style.background = 'rgba(59, 130, 246, 0.1)'; e.target.style.borderColor = '#3b82f6'; }}
                                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'; }}
                            >
                                אני רוצה אתר כזה ✅
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ה-Modal המונפש והיוקרתי */}
            <AnimatePresence>
                {selectedPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.97)', zIndex: 2000,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px'
                        }}
                        onClick={() => setSelectedPreview(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '100%', maxWidth: '1100px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                                <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800' }}>תצוגה מקדימה: {selectedPreview.subtitle}</h2>
                                <button
                                    onClick={() => setSelectedPreview(null)}
                                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2.5rem', cursor: 'pointer', opacity: '0.6' }}
                                    onMouseEnter={(e) => e.target.style.opacity = '1'}
                                    onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                                >✕</button>
                            </div>

                            {/* ה-Mockup המונפש */}
                            <div style={{
                                background: '#1e293b', borderRadius: '32px', border: '10px solid #334155',
                                overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.9)',
                                position: 'relative'
                            }}>
                                <div style={{ height: '40px', background: '#334155', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '10px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                                    <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', padding: '4px 20px', borderRadius: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                                        launchpage.ai/preview/{selectedPreview.id}
                                    </div>
                                </div>
                                <div style={{ height: '70vh', overflowY: 'auto', background: '#fff', textAlign: 'right', direction: 'rtl' }}>

                                    {/* Navbar של ה-Preview */}
                                    <nav style={{ padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                                        <div style={{ fontWeight: 'bold', color: selectedPreview.primaryColor, fontSize: '1.2rem' }}>Logo</div>
                                        <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.8rem' }}>
                                            <span>צור קשר</span><span>אודות</span><span>ראשי</span>
                                        </div>
                                    </nav>

                                    {/* Hero Section ב-Preview */}
                                    <section style={{ padding: '50px 30px', background: '#f8fafc' }}>
                                        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0f172a', marginBottom: '15px', lineHeight: '1.2' }}>
                                            {selectedPreview.heroTitle}
                                        </h1>
                                        <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '25px', lineHeight: '1.6' }}>
                                            {selectedPreview.heroSub}
                                        </p>
                                        <button style={{
                                            background: selectedPreview.primaryColor, color: '#fff', border: 'none',
                                            padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                                        }}>
                                            התחל עכשיו
                                        </button>
                                    </section>

                                    {/* תמונה גדולה ב-Preview */}
                                    <div style={{ position: 'relative', width: '100%', height: '350px' }}>
                                        <Image src={selectedPreview.image} fill style={{ objectFit: 'cover' }} alt="Preview" unoptimized />
                                    </div>

                                    {/* Features ב-Preview */}
                                    <section style={{ padding: '40px 30px', display: 'flex', justifyContent: 'space-around', gap: '10px', background: '#fff' }}>
                                        {selectedPreview.features.map((feature, i) => (
                                            <div key={i} style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', color: '#334155' }}>
                                                {feature}
                                            </div>
                                        ))}
                                    </section>

                                    {/* Footer של ה-Preview */}
                                    <footer style={{ padding: '25px', textAlign: 'center', background: '#020617', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        © 2026 כל הזכויות שמורות ל-{selectedPreview.subtitle} | נוצר ע״י LaunchPage AI
                                    </footer>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setIsMagic(true);
                                        setTimeout(() => {
                                            window.location.href = `/?desc=${encodeURIComponent("בנה לי אתר בסגנון " + selectedPreview.subtitle + ": " + selectedPreview.heroTitle)}`;
                                        }, 800);
                                    }}
                                    style={{
                                        position: 'relative',
                                        background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                                        color: '#fff',
                                        padding: '18px 45px',
                                        borderRadius: '20px',
                                        fontSize: '1.25rem',
                                        fontWeight: '900',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 15px 30px rgba(34, 197, 94, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        overflow: 'visible'
                                    }}
                                >
                                    <AnimatePresence>
                                        {isMagic && (
                                            <>
                                                {[...Array(12)].map((_, i) => (
                                                    <motion.span
                                                        key={i}
                                                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                                        animate={{
                                                            opacity: 0,
                                                            scale: [0, 1.5, 0],
                                                            x: (i % 2 === 0 ? 1 : -1) * (i * 20),
                                                            y: (i % 3 === 0 ? 1 : -1) * (i * 15),
                                                            rotate: i * 24
                                                        }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        style={{
                                                            position: 'absolute',
                                                            fontSize: '1.5rem',
                                                            pointerEvents: 'none'
                                                        }}
                                                    >
                                                        ✨
                                                    </motion.span>
                                                ))}
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <span style={{ fontSize: '1.5rem' }}>🪄</span>
                                    {isMagic ? "מכין את הקסם..." : "ערוך תבנית זו והתחל לבנות"}
                                </motion.button>
                                <button
                                    onClick={() => window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent("היי עמית, אני בתוך ה-Preview של תבנית ה-" + selectedPreview.title + " וזה נראה פשוט מדהים! אני רוצה לרכוש.")}`)}
                                    style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: '#fff', padding: '18px 40px', borderRadius: '20px',
                                        fontWeight: '900', fontSize: '1.2rem', border: 'none', cursor: 'pointer',
                                        boxShadow: '0 15px 35px rgba(37, 99, 235, 0.4)',
                                        transition: 'transform 0.2s',
                                        display: 'flex', alignItems: 'center'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    רכוש את האתר הזה עכשיו 🚀
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
