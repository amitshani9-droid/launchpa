"use client";
import { Heebo } from "next/font/google";
import Link from "next/link";
import Confetti from 'react-confetti';
import { useEffect, useState } from "react";

const heebo = Heebo({ subsets: ["hebrew"] });

export default function ThankYouPage() {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            setTimeout(() => {
                setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            }, 0);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div className={heebo.className} style={{
            minHeight: "100vh",
            background: "radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px"
        }}>
            {windowSize.width > 0 && (
                <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} gravity={0.1} />
            )}

            <div style={{ maxWidth: "600px", width: '100%', background: "white", padding: "50px 30px", borderRadius: "30px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🎊</div>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "15px", lineHeight: '1.2' }}>איזה יופי, האתר בדרך אליך!</h1>
                <p style={{ fontSize: "1.2rem", color: "#64748b", marginBottom: "40px" }}>
                    יצרת הרגע דף נחיתה מקצועי עם AI. עכשיו הגיע הזמן להביא לקוחות.
                </p>

                {/* הצעות ערך נוספות (Up-sell) */}
                <div style={{ display: "grid", gap: "15px", marginBottom: "40px" }}>
                    <div style={{ padding: "20px", background: "#f1f5f9", borderRadius: "15px", textAlign: "right", border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontWeight: "bold", marginBottom: "5px", fontSize: '1.1rem' }}>🚀 רוצה שנעזור לך להביא תנועה?</h4>
                        <p style={{ fontSize: "0.95rem", color: "#475569" }}>שאל אותנו על שירותי קידום ממומן בפייסבוק וגוגל.</p>
                    </div>
                    <div style={{ padding: "20px", background: "#f1f5f9", borderRadius: "15px", textAlign: "right", border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontWeight: "bold", marginBottom: "5px", fontSize: '1.1rem' }}>✍️ צריך כתיבת תוכן מעמיקה יותר?</h4>
                        <p style={{ fontSize: "0.95rem", color: "#475569" }}>הקופירייטרים שלנו זמינים עבורך לפרויקטים מורכבים.</p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: 'wrap' }}>
                    <Link href="/" style={{ flex: 1, minWidth: '160px' }}>
                        <button style={{ width: '100%', padding: "18px 30px", background: "#2563eb", color: "white", borderRadius: "15px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: '1rem', transition: '0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                            חזרה לדף הבית
                        </button>
                    </Link>
                    <a href="https://wa.me/972533407255" target="_blank" style={{ flex: 1, minWidth: '160px' }}>
                        <button style={{ width: '100%', padding: "18px 30px", background: "#10b981", color: "white", borderRadius: "15px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: '1rem', transition: '0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                            דבר איתנו בוואטסאפ
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
