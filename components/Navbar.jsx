"use client";
import { auth, loginWithGoogle } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { useUser } from '@/context/UserContext';

export default function Navbar() {
    const [userAuth] = useAuthState(auth);
    const router = useRouter();
    const { isPro, openUpgradeModal, logout } = useUser();

    return (
        <nav style={{
            width: '100%', height: '110px', background: 'rgba(2, 6, 23, 0.9)',
            backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'fixed', top: 0, left: 0, zIndex: 1000, display: 'flex', justifyContent: 'center',
            direction: 'rtl'
        }}>
            <div style={{
                width: '100%', maxWidth: '1400px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', flexDirection: 'row-reverse'
            }}>

                {/* LOGO */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <Image src="/logo.png" style={{
                            width: '140%',
                            height: '140%',
                            objectFit: 'cover',
                            display: 'block'
                        }} width={112} height={112} alt="Logo" />
                    </div>

                    <div style={{ marginRight: '15px', display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            fontSize: '1.8rem',
                            fontWeight: '900',
                            color: '#fff',
                            lineHeight: '1',
                            letterSpacing: '-1px'
                        }}>LaunchPage</span>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            color: '#3b82f6',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            marginTop: '4px'
                        }}>AI PRO EDITION</span>
                    </div>
                </Link>

                {/* MENU */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: '20px' }}>
                        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>בית</Link>
                        <Link href="/pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>מחירון</Link>
                        <Link href="/templates" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>תבניות</Link>
                    </div>

                    {userAuth ? (
                        <>
                            <button onClick={() => router.push('/dashboard')} style={{
                                background: 'transparent',
                                color: '#94a3b8',
                                fontSize: '0.95rem',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer'
                            }}>
                                📂 האתרים שלי
                            </button>
                            {!isPro && (
                                <button
                                    onClick={() => openUpgradeModal()}
                                    style={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                        color: 'white', padding: '12px 25px', borderRadius: '12px',
                                        fontWeight: '900', fontSize: '1rem', border: 'none', cursor: 'pointer',
                                        boxShadow: '0 8px 20px rgba(217, 119, 6, 0.3)'
                                    }}>
                                    שדרג ל-PRO 💎
                                </button>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '15px' }}>
                                {userAuth.photoURL && (
                                    <div style={{ position: 'relative' }}>
                                        <Image
                                            src={userAuth.photoURL}
                                            width={45}
                                            height={45}
                                            style={{ borderRadius: '50%', border: '2px solid #3b82f6' }}
                                            alt="Profile"
                                        />
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid #000' }}></div>
                                    </div>
                                )}
                                <button onClick={() => { signOut(auth); logout(); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>התנתק</button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button onClick={loginWithGoogle} style={{
                                background: 'transparent', color: '#94a3b8', padding: '10px 15px',
                                fontWeight: '700', fontSize: '0.95rem', border: 'none', cursor: 'pointer'
                            }}>התחברות</button>

                            <Link href="/" style={{
                                background: '#3b82f6',
                                color: '#fff',
                                padding: '12px 25px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                                transition: '0.3s'
                            }} className="nav-cta">
                                צור אתר חינם ✨
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
