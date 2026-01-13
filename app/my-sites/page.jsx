"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { downloadStandaloneSite } from '@/lib/landing/downloadSite';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function MySites() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sites, setSites] = useState([]);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push('/');
            return;
        }

        const fetchSites = async () => {
            try {
                const q = query(
                    collection(db, "users", user.uid, "sites"),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const sitesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSites(sitesData);
            } catch (error) {
                console.error("Error fetching sites:", error);
            } finally {
                setFetching(false);
            }
        };

        fetchSites();
    }, [user, loading, router]);

    const handleDownload = async (site) => {
        if (!site || !site.content?.html) return;
        const title = site.content.title || site.prompt || "My Landing Page";
        await downloadStandaloneSite(site.content.html, title);
    };

    if (loading || fetching) return (
        <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
            טוען אתרים...
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top, #1e293b 0%, #020617 100%)',
            padding: '120px 40px 80px',
            color: 'white',
            direction: 'rtl'
        }}>
            <header style={{
                maxWidth: '1200px',
                margin: '0 auto 60px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '950', marginBottom: '10px' }}>📂 האתרים שלי</h1>
                    <p style={{ color: '#94a3b8' }}>ניהול והורדה של דפי הנחיתה שיצרת</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    style={{
                        background: '#3b82f6', color: 'white', padding: '15px 30px',
                        borderRadius: '16px', border: 'none', cursor: 'pointer',
                        fontWeight: 'bold', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
                    }}
                >
                    + יצירת אתר חדש
                </button>
            </header>

            {sites.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '100px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📁</div>
                    <p style={{ fontSize: '1.2rem' }}>עדיין לא יצרת אתרים. זה הזמן להתחיל! 🚀</p>
                    <Link href="/" style={{ display: 'inline-block', marginTop: '30px', textDecoration: 'none' }}>
                        <span style={{ color: '#60a5fa', fontWeight: 'bold', borderBottom: '2px solid #60a5fa' }}>בוא נתחיל עכשיו ←</span>
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '30px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {sites.map(site => (
                        <div key={site.id} style={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            padding: '30px',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>{site.content?.title || "אתר ללא שם"}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                    {site.createdAt?.seconds ? new Date(site.createdAt.seconds * 1000).toLocaleDateString('he-IL') : "נוצר היום"}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => router.push(`/result?id=${site.id}`)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)', color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    צפייה
                                </button>
                                <button
                                    onClick={() => handleDownload(site)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '12px',
                                        background: '#3b82f6', color: 'white', border: 'none',
                                        cursor: 'pointer', fontWeight: 'bold'
                                    }}>
                                    הורדת ZIP
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
