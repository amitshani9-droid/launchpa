"use client";
import { Suspense } from "react";
import GeneratorLogic from "@/components/GeneratorLogic";

export default function CreatePage() {
    return (
        <main style={{ minHeight: '100vh', background: '#05070a' }}>
            {/* זה החלק הקריטי שמונע את השגיאה באדום שראית */}
            <Suspense fallback={
                <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚀</div>
                    <h2>ה-AI של LaunchPage בונה לך אתר...</h2>
                </div>
            }>
                <GeneratorLogic />
            </Suspense>
        </main>
    );
}
