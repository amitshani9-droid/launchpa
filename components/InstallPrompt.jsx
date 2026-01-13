"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if on mobile (simple check)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobile) return;

        // Check if dismissed or standalone
        const isDismissed = localStorage.getItem("installPromptDismissed");
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

        if (!isDismissed && !isStandalone) {
            const timer = setTimeout(() => setShowPrompt(true), 5000); // 5 seconds delay
            return () => clearTimeout(timer);
        }
    }, []);

    if (!showPrompt) return null;

    return (
        <div style={{
            position: 'fixed', bottom: '20px', left: '20px', right: '20px',
            background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(15px)',
            borderRadius: '20px', padding: '20px', zIndex: 9999,
            border: '1px solid rgba(255,255,255,0.1)', color: 'white',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Image src="/icon.png" alt="Icon" width={40} height={40} style={{ borderRadius: '10px' }} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>LaunchPage AI</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>התקן לגישה מהירה מהמסך בית</div>
                    </div>
                </div>
                <button onClick={() => {
                    setShowPrompt(false);
                    localStorage.setItem("installPromptDismissed", "true");
                }} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '5px' }}>
                <p style={{ marginBottom: '8px' }}><strong>באייפון:</strong> לחץ על <span style={{ fontSize: '1.2rem' }}>⎋</span> (שיתוף) ואז <strong>&apos;הוסף למסך הבית&apos;</strong>.</p>
                <p><strong>באנדרואיד:</strong> לחץ על 3 הנקודות ואז <strong>&apos;התקן אפליקציה&apos;</strong>.</p>
            </div>
        </div>
    );
}
