"use client";
import { useState } from 'react';

export default function HelpPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            q: "איך עובד תהליך יצירת האתר?",
            a: "פשוט מאוד: אתה מתאר את העסק שלך במשפט אחד, ה-AI שלנו מנתח את הנתונים ומייצר עבורך קבצי HTML ו-CSS מוכנים תוך פחות מ-60 שניות."
        },
        {
            q: "מה אני מקבל בחבילת ה-PRO?",
            a: "בחבילת ה-PRO אתה מקבל קובץ ZIP מלא של האתר, כולל כל התמונות והעיצובים, ללא לוגו של LaunchPage, ועם אפשרות להעלות אותו לכל דומיין שתבחר."
        },
        {
            q: "האם אני צריך ידע בתכנות?",
            a: "ממש לא! המערכת בונה הכל עבורך. כל מה שאתה צריך לעשות זה להוריד את הקבצים ולהעלות אותם לשרת (ואנחנו מסבירים בדיוק איך)."
        },
        {
            q: "איך אני משלם ומקבל את הקבצים?",
            a: "כרגע התשלום מתבצע מול נציג בוואטסאפ. לאחר העברת התשלום (₪49), תקבל לינק ישיר להורדת תיקיית האתר שלך."
        }
    ];

    return (
        <div style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto', direction: 'rtl', minHeight: '80vh' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>מרכז העזרה 💡</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>כל מה שצריך לדעת כדי להרים את האתר שלך לאוויר</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {faqs.map((faq, i) => (
                    <div key={i} style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        cursor: 'pointer'
                    }} onClick={() => setOpenIndex(openIndex === i ? null : i)}>

                        <div style={{
                            padding: '20px 25px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: openIndex === i ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                        }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>{faq.q}</h3>
                            <span style={{ color: '#3b82f6', fontSize: '1.5rem', transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: '0.3s' }}>+</span>
                        </div>

                        {openIndex === i && (
                            <div style={{ padding: '20px 25px', color: '#94a3b8', lineHeight: '1.6', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '80px', textAlign: 'center', padding: '40px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(2, 6, 23, 1) 100%)', border: '1px solid #3b82f6' }}>
                <h3 style={{ color: '#fff', marginBottom: '10px' }}>לא מצאת תשובה?</h3>
                <p style={{ color: '#94a3b8', marginBottom: '25px' }}>הצוות שלנו זמין עבורך בוואטסאפ לכל שאלה טכנית.</p>
                <button
                    onClick={() => window.location.href = 'https://wa.me/972533407255'}
                    style={{ background: '#25D366', color: '#fff', padding: '12px 30px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    דבר איתנו עכשיו ✅
                </button>
            </div>
        </div>
    );
}
