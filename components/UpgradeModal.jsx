"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from 'react-confetti';
import { useUser } from "@/context/UserContext";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { VALID_PRO_CODES, SUPPORT_PHONE } from "@/lib/constants";

export default function UpgradeModal({ isOpen, onClose, businessData }) {
    const { user, isPro, setProStatus } = useUser();
    const [coupon, setCoupon] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);

    const handleUpgradeViaWhatsapp = () => {
        const email = user ? user.email : "לא מחובר";
        const businessType = businessData?.businessType || "עסק כללי";
        const goal = businessData?.goal || "הגדלת המרות";

        const message = `היי עמית, אני רוצה לקבל קוד PRO עבור האתר שלי.
סוג עסק: ${businessType}
מטרה: ${goal}
אימייל: ${email}`;

        window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const handleCheckCoupon = useCallback(async () => {
        const normalized = coupon.trim().toUpperCase();
        if (VALID_PRO_CODES.includes(normalized)) {
            setProStatus(true);
            localStorage.setItem("isPro", "true");
            setShowConfetti(true);
            setShowSuccess(true);

            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    await updateDoc(userRef, { isPro: true, activatedCoupon: normalized });
                } catch (e) {
                    console.error("Error updating Firestore:", e);
                }
            }
        } else {
            alert("קוד שגוי, נסה שוב.");
        }
    }, [coupon, user, setProStatus]);

    if (!isOpen && !showSuccess) return null;

    return (
        <AnimatePresence>
            {(isOpen || showSuccess) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={modalOverlayStyle}
                >
                    {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}

                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        style={modalContentStyle}
                    >
                        {!showSuccess ? (
                            <>
                                <h2 style={modalTitleStyle}>הדף מוכן. עכשיו תן לו לעבוד בשבילך. 🚀</h2>
                                <p style={modalSubtitleStyle}>כדי להשתמש בדף הזה בפועל – צריך גרסת PRO</p>

                                <ul style={benefitsListStyle}>
                                    <li style={benefitItemStyle}>📦 הורדת קוד מלא (HTML/React)</li>
                                    <li style={benefitItemStyle}>✨ שיפור טקסטים עם AI מתקדם</li>
                                    <li style={benefitItemStyle}>💼 שימוש מסחרי מלא (פרסום ולקוחות)</li>
                                    <li style={benefitItemStyle}>⚡ שינויים מהירים בלי ליצור מחדש</li>
                                </ul>

                                <div style={sectionStyle}>
                                    <button onClick={handleUpgradeViaWhatsapp} style={primaryBtnStyle}>
                                        <span style={{ fontSize: '1.2rem' }}>💎</span> קבל קוד PRO והפעל עכשיו
                                    </button>
                                    <p style={priceSubtextStyle}>₪49 · תשלום חד־פעמי · קוד אישי</p>
                                </div>

                                <div style={dividerStyle}>
                                    <button onClick={() => setShowCodeInput(!showCodeInput)} style={toggleCodeLinkStyle}>
                                        {showCodeInput ? "הסתר שדה קוד" : "כבר יש לי קוד"}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showCodeInput && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={inputContainerStyle}>
                                                <input
                                                    type="text"
                                                    placeholder="הכנס קוד PRO שקיבלת"
                                                    value={coupon}
                                                    onChange={(e) => setCoupon(e.target.value)}
                                                    style={inputStyle}
                                                />
                                                <button onClick={handleCheckCoupon} style={activateBtnStyle}>הפעל</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button onClick={onClose} style={closeBtnStyle}>סגור</button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                                <h2 style={modalTitleStyle}>השדרוג הושלם בהצלחה!</h2>
                                <p style={modalSubtitleStyle}>גרסת PRO הופעלה. אתה יכול להשתמש באתר באופן מלא.</p>
                                <button onClick={() => { setShowSuccess(false); onClose(); }} style={successBtnStyle}>מדהים, תודה! ✨</button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Styles
const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' };
const modalContentStyle = { background: '#1e293b', padding: '40px', borderRadius: '32px', textAlign: 'center', color: 'white', maxWidth: '500px', width: '100%', border: '2px solid #3b82f6', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)' };
const modalTitleStyle = { fontSize: '1.8rem', color: '#fff', marginBottom: '10px', fontWeight: '900', lineHeight: '1.2' };
const modalSubtitleStyle = { color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem' };
const benefitsListStyle = { listStyle: 'none', padding: 0, textAlign: 'right', marginBottom: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px' };
const benefitItemStyle = { marginBottom: '12px', color: '#cbd5e1', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '10px' };
const sectionStyle = { textAlign: 'center', marginBottom: '15px' };
const primaryBtnStyle = { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: 'none', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'transform 0.2s' };
const priceSubtextStyle = { color: '#64748b', fontSize: '0.9rem', marginTop: '12px', fontWeight: '500' };
const dividerStyle = { margin: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' };
const toggleCodeLinkStyle = { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' };
const inputContainerStyle = { display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '10px' };
const inputStyle = { flex: 1, padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'center', fontSize: '1.1rem', outline: 'none' };
const activateBtnStyle = { background: '#22c55e', color: 'white', padding: '0 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none' };
const closeBtnStyle = { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.95rem', marginTop: '10px' };
const successBtnStyle = { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', padding: '15px 40px', borderRadius: '16px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', marginTop: '20px' };
