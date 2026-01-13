"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import JSZip from "jszip";
import { saveAs } from "file-saver";

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

    // Helpers for Download
    function generateHTML(data) {
        const primary = data.style?.primaryColor || "#3b82f6";
        const bg = data.style?.backgroundColor || "#ffffff";
        const title = data.hero?.title || data.title || "My LaunchPage";
        const description = data.hero?.description || data.subtitle || "";

        return `
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <link rel="stylesheet" href="style.css">
                <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap" rel="stylesheet">
                <style>
                    :root {--primary: ${primary}; --bg: ${bg}; }
                    body {background-color: var(--bg); color: #1e293b; font-family: 'Heebo', sans-serif; }
                    .hero {padding: 100px 20px; text-align: center; }
                    h1 {color: var(--primary); font-size: 3rem; margin-bottom: 20px; font-weight: 900; }
                    .features {display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; padding: 60px 20px; max-width: 1000px; margin: 0 auto; }
                    .feature-card {background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: right; }
                    .cta-btn {background: var(--primary); color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; }
                </style>
            </head>
            <body>
                <header class="hero">
                    <h1>${title}</h1>
                    <p style="font-size: 1.3rem; color: #475569; max-width: 700px; margin: 0 auto 30px;">${description}</p>
                    <a href="#" class="cta-btn">${data.hero?.cta || "צור קשר"}</a>
                </header>
                <main class="features">
                    ${data.features ? data.features.map(f => `
                        <div class="feature-card">
                            <h3 style="color: var(--primary); margin-bottom: 10px; font-size: 1.25rem;">${f.title}</h3>
                            <p style="color: #64748b;">${f.desc}</p>
                        </div>
                    `).join('') : ""}
                </main>
                <footer style="text-align: center; padding: 40px; border-top: 1px solid #e2e8f0; margin-top: 40px;">
                    <p>Built with LaunchPage AI 🚀</p>
                </footer>
            </body>
        </html>
        `.trim();
    }

    function generateCSS(data) {
        const primary = data.style?.primaryColor || "#3b82f6";
        const bg = data.style?.backgroundColor || "#ffffff";
        const text = data.style?.backgroundColor === "#0f172a" ? "#ffffff" : "#0f172a";

        return `
        :root {
            --primary: ${primary};
            --bg: ${bg};
            --text: ${text};
        }
        * {box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Heebo', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        .hero { text-align: center; padding: 80px 20px; }
        h1 { font-size: 3rem; font-weight: 900; margin-bottom: 20px; color: var(--primary); }
        .cta-button { display: inline-block; padding: 15px 30px; background: var(--primary); color: white; text-decoration: none; border-radius: 12px; font-weight: bold; }
        `.trim();
    }

    const handleDownload = async (site) => {
        const zip = new JSZip();
        const html = generateHTML(site.content);
        const css = generateCSS(site.content);

        zip.file("index.html", html);
        zip.file("style.css", css);
        zip.file("README.txt", "תודה שרכשת את האתר שלך דרך LaunchPage AI! 🚀");

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${site.content?.title || "landing-page"}.zip`);
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
