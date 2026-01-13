"use client";
import Link from 'next/link';

export default function PrivacyPage() {
    const sections = [
        {
            icon: "🛡️",
            title: "אבטחת מידע",
            content: "אנו משתמשים בשירותי Google Firebase המאובטחים ביותר כדי להבטיח שהמידע שלכם מוגן ברמת הצפנה מתקדמת."
        },
        {
            icon: "📋",
            title: "איסוף מידע",
            content: "אנו אוספים רק את מה שצריך: תיאור האתר ל-AI, פרטי קשר ונתונים טכניים בסיסיים לשיפור חוויית המשתמש."
        },
        {
            icon: "🤖",
            title: "שימוש ב-AI",
            content: "המידע נשלח לספקי AI (כמו OpenAI) אך ורק לצורך יצירת האתר שלכם. המידע אינו נמכר או משותף למטרות אחרות."
        },
        {
            icon: "🍪",
            title: "עוגיות וטכנולוגיה",
            content: "אנו משתמשים ב-Local Storage כדי לשמור את הטיוטות שלכם מקומית, כך שתוכלו לחזור לעבודתכם מכל מקום."
        }
    ];

    return (
        <div style={{ padding: '120px 20px 80px', maxWidth: '1000px', margin: '0 auto', direction: 'rtl', lineHeight: '1.8' }}>

            <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6',
                textDecoration: 'none', marginBottom: '40px', fontWeight: 'bold'
            }}>
                <span style={{ fontSize: '1.2rem' }}>←</span> חזרה לדף הבית
            </Link>

            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '950', color: '#fff', marginBottom: '15px' }}>מדיניות פרטיות</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>המחויבות שלנו להגנה על המידע שלכם ב-LaunchPage AI</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '25px'
            }}>
                {sections.map((section, i) => (
                    <div key={i} style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        padding: '35px',
                        borderRadius: '28px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'transform 0.3s, border-color 0.3s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{section.icon}</div>
                        <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold' }}>{section.title}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>{section.content}</p>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '60px', padding: '40px', borderRadius: '32px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center'
            }}>
                <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.5rem', fontWeight: '700' }}>צור קשר</h3>
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>לכל שאלה בנושא פרטיות ואבטחה, ניתן לפנות אלינו:</p>
                <a href="mailto:support@launchpage.ai" style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none' }}>
                    support@launchpage.ai
                </a>
            </div>
        </div>
    );
}
