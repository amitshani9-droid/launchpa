"use client";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();
    const plans = [
        {
            name: "חינם (Explorer)",
            price: "0",
            description: "למי שרוצה לטעום את הקסם של ה-AI",
            features: ["3 קרדיטים ליצירת אתרים", "תצוגה מקדימה ב-Mockup", "גישה לתבניות בסיסיות", "ללא חיבור דומיין"],
            button: "התחל בחינם",
            premium: false
        },
        {
            name: "Premium PRO",
            price: "49",
            description: "הפתרון המלא לבעלי עסקים וסטארטאפים",
            features: ["יצירת אתרים ללא הגבלה", "הורדת קוד מקור מלא (React/HTML)", "חיבור דומיין אישי", "הסרת סימן המים של LaunchPage", "תמיכה VIP בוואטסאפ"],
            button: "רכוש עכשיו והשק את האתר",
            premium: true
        }
    ];

    return (
        <div style={{ padding: '120px 20px 80px', maxWidth: '1000px', margin: '0 auto', direction: 'rtl', minHeight: '100vh', background: '#020617' }}>

            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginBottom: '15px' }}>תוכניות ומרכיבים</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>בחר את המסלול שמתאים לצמיחה של העסק שלך</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        style={{
                            background: plan.premium ? 'rgba(30, 41, 59, 0.5)' : 'rgba(30, 41, 59, 0.2)',
                            borderRadius: '30px',
                            padding: '40px',
                            border: plan.premium ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                            position: 'relative',
                            boxShadow: plan.premium ? '0 0 40px rgba(59, 130, 246, 0.2)' : 'none'
                        }}
                    >
                        {plan.premium && (
                            <span style={{
                                position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                                background: '#3b82f6', color: '#fff', padding: '5px 20px', borderRadius: '20px',
                                fontSize: '0.8rem', fontWeight: 'bold'
                            }}>הכי פופולרי ✨</span>
                        )}

                        <h3 style={{ color: plan.premium ? '#3b82f6' : '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{plan.name}</h3>
                        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>₪{plan.price}</span>
                            <span style={{ color: '#94a3b8' }}>/ חד פעמי</span>
                        </div>
                        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '0.95rem' }}>{plan.description}</p>

                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px' }}>
                            {plan.features.map((feature, idx) => (
                                <li key={idx} style={{ color: '#cbd5e1', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: plan.premium ? '#3b82f6' : '#94a3b8' }}>✔</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => {
                                if (plan.premium) {
                                    window.open(`https://wa.me/972533407255?text=${encodeURIComponent("היי עמית, אני רוצה לשדרג ל-PRO ב-49 שקל ולהוריד את האתר שלי!")}`);
                                } else {
                                    router.push('/');
                                }
                            }}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '15px', border: 'none',
                                background: plan.premium ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255,255,255,0.05)',
                                color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                                transition: 'transform 0.2s',
                                boxShadow: plan.premium ? '0 10px 20px rgba(37, 99, 235, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            {plan.button}
                        </button>
                    </motion.div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '60px', color: '#64748b' }}>
                <p>🔒 תשלום מאובטח • אין התחייבות • תמיכה אישית</p>
            </div>
        </div>
    );
}
