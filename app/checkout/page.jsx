"use client";

import { Heebo } from "next/font/google";
import { useRouter } from "next/navigation";
import Link from "next/link";

const heebo = Heebo({ subsets: ["hebrew"] });

export default function CheckoutPage() {
    const router = useRouter();

    const handlePayment = () => {
        // כאן אפשר לשים לינק לסליקה (משולם/Stripe) או פשוט לוואטסאפ שלך
        const whatsappLink = "https://wa.me/972533407255?text=היי עמית, אני רוצה לשדרג לגרסת ה-PRO של LaunchPage AI";
        window.open(whatsappLink, "_blank");
    };

    return (
        <div className={heebo.className} style={{ minHeight: "100vh", background: "#f8fafc", direction: "rtl", padding: "60px 20px" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>

                <div style={{ background: "white", padding: "50px 40px", borderRadius: "32px", boxShadow: "0 25px 70px rgba(0,0,0,0.06)", textAlign: "center", position: 'relative', overflow: 'hidden' }}>
                    {/* Decorative Background Element */}
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', filter: 'blur(60px)', opacity: 0.1 }}></div>

                    <div style={{ fontSize: "4.5rem", marginBottom: "25px" }}>💎</div>
                    <h1 style={{ fontSize: "2.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "12px" }}>שדרוג לגרסת ה-PRO</h1>
                    <p style={{ color: "#64748b", marginBottom: "40px", fontSize: '1.1rem', lineHeight: '1.6' }}>הצטרף למאות בעלי עסקים שבונים דפי נחיתה מקצועיים, ממירים ומוכנים לפרסום בתוך שניות.</p>

                    {/* Benefits Grid */}
                    <div style={{ textAlign: "right", marginBottom: "40px", background: "#f8fafc", padding: "20px", borderRadius: "24px", border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '15px', color: '#1e293b' }}>מה אתה מקבל בגרסת ה-PRO?</h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: '0.95rem', lineHeight: '1.4' }}>
                                <span style={{ color: '#10B981' }}>✦</span> <strong>הסרת קרדיט LaunchPage מהאתר</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: '0.95rem', lineHeight: '1.4' }}>
                                <span style={{ color: '#10B981' }}>✦</span> <strong>יבוא אתרים קיימים (URL Importer)</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: '0.95rem', lineHeight: '1.4' }}>
                                <span style={{ color: '#10B981' }}>✦</span> <strong>גישה לכל הפונטים והצבעים היוקרתיים</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: '0.95rem', lineHeight: '1.4' }}>
                                <span style={{ color: '#10B981' }}>✦</span> <strong>אחסון של עד 50 אתרים בדאשבורד האישי</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: '0.95rem', lineHeight: '1.4' }}>
                                <span style={{ color: '#10B981' }}>✦</span> <strong>תמיכה בוואטסאפ לכל שאלה</strong>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div style={{ marginBottom: "40px", padding: '20px', border: '2px solid #2563EB', borderRadius: '20px', background: '#eff6ff' }}>
                        <div style={{ fontSize: '0.9rem', color: '#2563EB', fontWeight: 'bold', marginBottom: '5px' }}>מחיר השקה מיוחד:</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <span style={{ fontSize: "3.5rem", fontWeight: "900", color: "#0f172a" }}>₪49</span>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1rem' }}>₪199</div>
                                <div style={{ color: "#64748b", fontSize: '0.9rem' }}>תשלום חד פעמי</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        style={{ width: "100%", padding: "22px", background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", color: "white", border: "none", borderRadius: "18px", fontWeight: "bold", fontSize: "1.3rem", cursor: "pointer", boxShadow: "0 15px 35px rgba(37, 99, 235, 0.3)", transition: '0.3s' }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        שדרג עכשיו וקבל גישה מיידית 🚀
                    </button>

                    <p style={{ marginTop: '25px', color: '#94a3b8', fontSize: '0.85rem' }}>
                        התשלום מאובטח • גישה מיידית לאחר אישור • 100% שביעות רצון
                    </p>

                    <button
                        onClick={() => router.back()}
                        style={{ marginTop: "30px", background: "none", border: "none", color: "#64748b", textDecoration: "none", cursor: "pointer", fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                        ← חזור לאתר
                    </button>
                </div>

                <footer style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                    LaunchPage AI • השותף שלך להצלחה בדיגיטל 🚀
                </footer>
            </div>
        </div>
    );
}
