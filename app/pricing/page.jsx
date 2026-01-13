"use client";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew"] });

export default function PricingPage() {
    const router = useRouter();
    const { isPro, openUpgradeModal } = useUser();

    const plans = [
        {
            name: "חינם (Explorer)",
            price: "0",
            description: "למי שרוצה לטעום את הקסם של ה-AI",
            features: [
                "3 קרדיטים ליצירת אתרים",
                "תצוגה מקדימה ב-Mockup",
                "גישה לתבניות בסיסיות",
                "ללא חיבור דומיין"
            ],
            button: "התחל בחינם",
            premium: false
        },
        {
            name: "Premium PRO",
            price: "49",
            description: "הפתרון המלא לבעלי עסקים וסטארטאפים",
            features: [
                "יצירת אתרים ללא הגבלה",
                "הורדת קוד מקור מלא (React/HTML)",
                "חיבור דומיין אישי",
                "הסרת סימן המים של LaunchPage",
                "תמיכה VIP בוואטסאפ"
            ],
            button: isPro ? "כבר רכשת PRO! ✅" : "שדרג עכשיו ל-PRO",
            premium: true
        }
    ];

    return (
        <div className={heebo.className} dir="rtl" style={mainWrapperStyle}>
            <header style={headerStyle}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={badgeStyle}
                >
                    💎 המחיר הטוב ביותר להשקת העסק שלך
                </motion.div>
                <h1 style={titleStyle}>תוכניות ומרכיבים</h1>
                <p style={subtitleStyle}>בחר את המסלול שמתאים לצמיחה של העסק שלך</p>
            </header>

            <div style={gridStyle}>
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                        style={{
                            ...cardStyle,
                            background: plan.premium ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.2)',
                            border: plan.premium ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: plan.premium ? '0 20px 50px rgba(59, 130, 246, 0.2)' : 'none'
                        }}
                    >
                        {plan.premium && (
                            <span style={frequentBadgeStyle}>הכי פופולרי ✨</span>
                        )}

                        <h3 style={{ ...planNameStyle, color: plan.premium ? '#3b82f6' : '#fff' }}>{plan.name}</h3>

                        <div style={priceContainerStyle}>
                            <span style={priceTagStyle}>₪{plan.price}</span>
                            <span style={pricePeriodStyle}>/ חד פעמי</span>
                        </div>

                        <p style={descriptionStyle}>{plan.description}</p>

                        <ul style={featureListStyle}>
                            {plan.features.map((feature, idx) => (
                                <li key={idx} style={featureItemStyle}>
                                    <span style={{ color: plan.premium ? '#3b82f6' : '#94a3b8' }}>✔</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (plan.premium) {
                                    if (!isPro) openUpgradeModal();
                                } else {
                                    router.push('/');
                                }
                            }}
                            disabled={plan.premium && isPro}
                            style={{
                                ...buttonStyle,
                                background: plan.premium
                                    ? (isPro ? 'rgba(16, 185, 129, 0.1)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)')
                                    : 'rgba(255,255,255,0.05)',
                                color: (plan.premium && isPro) ? '#10b981' : '#fff',
                                cursor: (plan.premium && isPro) ? 'default' : 'pointer',
                                border: (plan.premium && isPro) ? '1px solid #10b981' : 'none'
                            }}
                        >
                            {plan.button}
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            <footer style={footerStyle}>
                <p>🔒 תשלום מאובטח • תמיכה אישית בוואטסאפ • גישה מיידית</p>
            </footer>
        </div>
    );
}

// --- Styles ---
const mainWrapperStyle = {
    padding: '160px 20px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
    direction: 'rtl',
    minHeight: '100vh',
    background: '#020617',
    textAlign: 'center'
};
const headerStyle = { marginBottom: '80px' };
const badgeStyle = {
    display: 'inline-block',
    padding: '6px 16px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '100px',
    color: '#60a5fa',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    marginBottom: '24px'
};
const titleStyle = { fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '950', color: '#fff', marginBottom: '20px' };
const subtitleStyle = { color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' };
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    maxWidth: '1000px',
    margin: '0 auto'
};
const cardStyle = {
    backdropFilter: 'blur(10px)',
    borderRadius: '35px',
    padding: '50px 40px',
    position: 'relative',
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column'
};
const frequentBadgeStyle = {
    position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
    background: '#3b82f6', color: '#fff', padding: '6px 20px', borderRadius: '20px',
    fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)'
};
const planNameStyle = { fontSize: '1.6rem', fontWeight: '800', marginBottom: '10px' };
const priceContainerStyle = { margin: '25px 0', display: 'flex', alignItems: 'baseline', gap: '8px' };
const priceTagStyle = { fontSize: '3.5rem', fontWeight: '950', color: '#fff' };
const pricePeriodStyle = { color: '#64748b', fontSize: '1.1rem' };
const descriptionStyle = { color: '#94a3b8', marginBottom: '35px', fontSize: '1rem', lineHeight: '1.6' };
const featureListStyle = { listStyle: 'none', padding: 0, marginBottom: '45px', flex: 1 };
const featureItemStyle = { color: '#cbd5e1', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' };
const buttonStyle = {
    width: '100%', padding: '18px', borderRadius: '18px', border: 'none',
    fontWeight: '900', fontSize: '1.2rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
};
const footerStyle = { textAlign: 'center', marginTop: '80px', color: '#64748b', fontSize: '0.95rem' };
