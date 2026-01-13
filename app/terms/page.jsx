"use client";
import Link from 'next/link';

export default function TermsPage() {
    const sections = [
        {
            icon: "🤖",
            title: "1. טכנולוגיית AI ואחריות תוכן",
            content: "המערכת של LaunchPage AI רותמת בינה מלאכותית ליצירת תשתית לאתרים. התוכן המופק (טקסטים, מבנה ועיצוב) הוא בגדר המלצה יצירתית. האחריות הסופית על דיוק המידע והשימוש בתוצר חלה על המשתמש בלבד."
        },
        {
            icon: "💎",
            title: "2. בעלות וזכויות יוצרים",
            content: "עם רכישת חבילת ה-PRO, המשתמש מקבל בעלות מלאה על הקוד והעיצוב הייחודי שנוצר עבורו. פלטפורמת LaunchPage, אלגוריתם הליבה וסימני המסחר נותרים קניינה הרוחני של החברה."
        },
        {
            icon: "💳",
            title: "3. מדיניות רכישות והחזרים",
            content: "הרכישה מתבצעת בייעוץ ישיר מול נציג. מאחר שמדובר במוצר דיגיטלי להורדה מיידית, לא ניתן לבצע ביטול עסקה או לקבל החזר כספי לאחר העברת קבצי המקור של האתר."
        },
        {
            icon: "🛡️",
            title: "4. הגבלת אחריות טכנית",
            content: "LaunchPage מספקת את כלי הבנייה בלבד. איננו צד לאחסון האתר (Hosting) או לניהול הדומיין, ולא נישא באחריות לשיבושים טכניים או נזקים הנובעים מניהול האתר לאחר מסירתו."
        }
    ];

    return (
        <div style={{
            padding: '140px 20px 80px',
            maxWidth: '1000px',
            margin: '0 auto',
            direction: 'rtl',
            background: '#020617',
            minHeight: '100vh'
        }}>

            <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6',
                textDecoration: 'none', marginBottom: '40px', fontWeight: '600'
            }}>
                ← חזרה למסך הראשי
            </Link>

            <header style={{ marginBottom: '60px', textAlign: 'right' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginBottom: '20px', letterSpacing: '-1px' }}>
                    תנאי שימוש <span style={{ color: '#3b82f6' }}>.</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px' }}>
                    אנחנו מאמינים בשקיפות. להלן התנאים המשפטיים לשימוש בפלטפורמת LaunchPage AI.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '25px'
            }}>
                {sections.map((section, i) => (
                    <div key={i} style={{
                        background: 'rgba(30, 41, 59, 0.3)',
                        padding: '40px',
                        borderRadius: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'transform 0.3s ease',
                        cursor: 'default'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '20px' }}>{section.icon}</div>
                        <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px', fontWeight: '800' }}>{section.title}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7' }}>{section.content}</p>
                    </div>
                ))}
            </div>

            <footer style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#475569' }}>
                © 2026 LaunchPage AI | כל הזכויות שמורות
            </footer>
        </div>
    );
}
