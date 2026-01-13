"use client";
import Link from 'next/link';

export default function HowItWorks() {
    const steps = [
        {
            num: "01",
            title: "מתארים את החזון",
            desc: "כותבים משפט אחד על העסק שלכם. למשל: 'סטודיו לפילאטיס לנשים ברמת גן'. ה-AI שלנו יודע לנתח את קהל היעד והסגנון המתאים.",
            icon: "✍️"
        },
        {
            num: "02",
            title: "ה-AI נכנס לפעולה",
            desc: "המנוע שלנו מייצר קוד HTML/CSS מלא, כותב תוכן שיווקי משכנע ובוחר תמונות שמתאימות בדיוק למותג שלכם.",
            icon: "🤖"
        },
        {
            num: "03",
            title: "בדיקה וסימולציה",
            desc: "אתם מקבלים הצצה חיה לאתר שנוצר. תוכלו לראות איך הוא נראה במחשב ובנייד לפני שאתם מחליטים להתקדם.",
            icon: "✨"
        },
        {
            num: "04",
            title: "הורדה והפעלה",
            desc: "לאחר התשלום, אתם מקבלים קובץ ZIP מוכן. כל מה שנשאר זה להעלות אותו לשרת - והאתר שלכם באוויר!",
            icon: "🚀"
        }
    ];

    return (
        <div style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto', direction: 'rtl', minHeight: '80vh' }}>
            <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', marginBottom: '20px' }}>הדרך המהירה ביותר לאתר</h1>
                <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
                    החלפנו שבועות של עבודה עם מעצבים ומתכנתים בתהליך של 60 שניות.
                </p>
            </header>

            {/* ויזואליזציה של השלבים */}
            <div style={{ position: 'relative' }}>
                {/* קו מחבר ברקע (רק במסכים גדולים) */}
                <div style={{
                    position: 'absolute', top: '50px', bottom: '50px', left: '50%',
                    width: '2px', background: 'linear-gradient(to bottom, #3b82f6, transparent)',
                    zIndex: 0, opacity: 0.2
                }}></div>

                {steps.map((step, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', marginBottom: '60px',
                        flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                        position: 'relative', zIndex: 1
                    }}>
                        {/* תוכן השלב */}
                        <div style={{ width: '45%', textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                            <div style={{
                                background: 'rgba(30, 41, 59, 0.5)', padding: '30px', borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}>
                                <span style={{ fontSize: '3rem', marginBottom: '15px', display: 'block' }}>{step.icon}</span>
                                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '10px' }}>{step.title}</h3>
                                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1.05rem' }}>{step.desc}</p>
                            </div>
                        </div>

                        {/* מספר השלב באמצע */}
                        <div style={{
                            width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <div style={{
                                width: '50px', height: '50px', background: '#3b82f6', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', color: '#fff', fontSize: '1.2rem',
                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                            }}>
                                {step.num}
                            </div>
                        </div>

                        <div style={{ width: '45%' }}></div>
                    </div>
                ))}
            </div>

            {/* קריאה לפעולה (CTA) בתחתית */}
            <div style={{
                marginTop: '100px', textAlign: 'center', padding: '60px',
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                borderRadius: '32px', border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>מוכנים להתחיל?</h2>
                <p style={{ color: '#94a3b8', marginBottom: '40px', fontSize: '1.1rem' }}>הצטרפו למאות בעלי עסקים שכבר חסכו אלפי שקלים על פיתוח אתר.</p>
                <Link href="/" style={{
                    background: '#3b82f6', color: '#fff', padding: '18px 45px', borderRadius: '15px',
                    fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', display: 'inline-block',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                }}>
                    בנו את האתר שלכם עכשיו ✨
                </Link>
            </div>
        </div>
    );
}
