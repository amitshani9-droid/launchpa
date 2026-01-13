"use client";
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function GlobalNav() {
    const [user] = useAuthState(auth);

    return (
        <nav style={{
            width: '100%', height: '80px', background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', justifyContent: 'center', position: 'fixed', top: 0, zIndex: 1000
        }}>
            <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>

                {/* ימין: לוגו וטקסט */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/logo.png" style={{ width: '45px', height: '45px', borderRadius: '10px' }} alt="Logo" />
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>LaunchPage AI</span>
                </div>

                {/* שמאל: כפתורי PRO ושדרוג */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {user && (
                        <>
                            <button style={{ background: 'linear-gradient(45deg, #f59e0b, #fbbf24)', color: '#000', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                                💎 שדרג ל-PRO ב-₪49
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#fff', fontSize: '0.9rem' }}>{user.displayName}</span>
                                <img src={user.photoURL} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #3b82f6' }} alt="Profile" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
