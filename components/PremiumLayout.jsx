"use client";
import { auth, loginWithGoogle } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { UserProvider } from '@/context/UserContext';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './Navbar';

export default function PremiumLayout({ children }) {
    const [user] = useAuthState(auth);
    const router = useRouter();

    return (
        <body style={{ margin: 0, backgroundColor: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <UserProvider>
                <Navbar />

                <main style={{ paddingTop: '0' }}>{children}</main>

                {/* Premium Footer Section */}
                <footer style={{
                    width: '100%',
                    background: '#020617',
                    padding: '80px 20px 40px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    marginTop: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '1200px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '40px',
                        marginBottom: '60px',
                        direction: 'rtl'
                    }}>
                        {/* עמודה 1: מותג */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Image src="/logo.png" width={45} height={45} style={{ borderRadius: '10px' }} alt="Footer Logo" />
                                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff' }}>LaunchPage AI</span>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                הפלטפורמה המתקדמת ביותר ליצירת אתרי נחיתה באמצעות בינה מלאכותית. בונים את העתיד, היום.
                            </p>
                        </div>

                        {/* עמודה 2: קישורים מהירים */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>מוצר</h4>
                            <Link href="/how-it-works" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">איך זה עובד</Link>
                            <Link href="/pricing" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">מחירון PRO</Link>
                            <Link href="/templates" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">תבניות AI</Link>
                        </div>

                        {/* עמודה 3: תמיכה */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>תמיכה</h4>
                            <Link href="/help" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">מרכז עזרה</Link>
                            <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">תנאי שימוש</Link>
                            <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }} className="footer-link">פרטיות</Link>
                        </div>

                        {/* עמודה 4: סטטוס מערכת */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>סטטוס</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.9rem' }}>
                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                המערכת פועלת כסדרה
                            </div>
                        </div>
                    </div>

                    <div style={{
                        width: '100%',
                        maxWidth: '1200px',
                        paddingTop: '30px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'center',
                        color: '#475569',
                        fontSize: '0.85rem'
                    }}>
                        © 2026 LaunchPage AI. כל הזכויות שמורות. נבנה בגאווה בישראל.
                    </div>
                </footer>
            </UserProvider>
        </body>
    );
}
