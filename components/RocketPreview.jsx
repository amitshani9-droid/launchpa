"use client";

import { useState } from "react";

export default function RocketPreview({ data }) {
    const [darkMode, setDarkMode] = useState(true);
    const [viewMode, setViewMode] = useState('desktop'); // desktop | mobile

    if (!data) return null;

    // Premium Typography Styles
    const titleStyle = {
        fontSize: viewMode === 'mobile' ? "2.5rem" : "3.5rem",
        fontWeight: "800",
        letterSpacing: "-0.03em",
        lineHeight: "1.1",
        marginBottom: "20px",
        background: "linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 4px 20px rgba(96, 165, 250, 0.2))"
    };

    const subtitleStyle = {
        fontSize: viewMode === 'mobile' ? "1.1rem" : "1.25rem",
        opacity: 0.9,
        marginBottom: "40px",
        lineHeight: "1.6",
        fontWeight: "400",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto"
    };

    const sectionTitleStyle = {
        fontSize: "1.8rem",
        fontWeight: "700",
        marginBottom: "15px",
        letterSpacing: "-0.02em",
        color: darkMode ? "#fff" : "#1e293b"
    };

    const textStyle = {
        fontSize: "1.125rem", // 18px
        lineHeight: "1.75",
        color: darkMode ? "rgba(255,255,255,0.85)" : "#334155",
        fontWeight: "400"
    };

    // If API returned HTML, render it directly
    if (data.html) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* Controls Bar */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "900px",
                    marginBottom: "20px"
                }}>
                    <div style={{ display: "flex", gap: "10px", background: "rgba(255,255,255,0.1)", padding: "5px", borderRadius: "10px", width: '100%', justifyContent: 'center' }}>
                        <button
                            onClick={() => setViewMode('desktop')}
                            style={{
                                background: viewMode === 'desktop' ? "rgba(255,255,255,0.2)" : "transparent",
                                border: "none",
                                padding: "8px 20px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                color: "white",
                                fontWeight: 'bold'
                            }}
                        >
                            🖥️ דסקטופ
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            style={{
                                background: viewMode === 'mobile' ? "rgba(255,255,255,0.2)" : "transparent",
                                border: "none",
                                padding: "8px 20px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                color: "white",
                                fontWeight: 'bold'
                            }}
                        >
                            📱 מובייל
                        </button>
                    </div>
                </div>

                {/* Preview Container */}
                <div
                    style={{
                        background: "#ffffff",
                        color: "#000000",
                        borderRadius: "24px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        width: viewMode === 'mobile' ? '375px' : '100%',
                        maxWidth: "1000px",
                        margin: "0 auto",
                        transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        height: "80vh",
                        overflow: "hidden", // Iframe handles scroll
                        position: 'relative'
                    }}
                >
                    <iframe
                        srcDoc={data.html}
                        title="Site Preview"
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            borderRadius: "24px",
                            background: "white"
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

            {/* Controls Bar */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "900px",
                marginBottom: "20px"
            }}>
                {/* Theme Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "10px",
                        background: darkMode ? "#2563eb" : "#7c3aed",
                        color: "white",
                        fontWeight: "bold",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    מצב {darkMode ? "בהיר ☀️" : "כהה 🌙"}
                </button>

                {/* View Mode Toggle */}
                <div style={{ display: "flex", gap: "10px", background: "rgba(255,255,255,0.1)", padding: "5px", borderRadius: "10px" }}>
                    <button
                        onClick={() => setViewMode('desktop')}
                        style={{
                            background: viewMode === 'desktop' ? "rgba(255,255,255,0.2)" : "transparent",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            color: "white"
                        }}
                    >
                        🖥️ דסקטופ
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        style={{
                            background: viewMode === 'mobile' ? "rgba(255,255,255,0.2)" : "transparent",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            color: "white"
                        }}
                    >
                        📱 מובייל
                    </button>
                </div>
            </div>

            {/* Preview Container */}
            <div style={{
                background: darkMode ? "#0f172a" : "#ffffff",
                color: darkMode ? "white" : "black",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: darkMode ? "0 0 50px rgba(0,0,0,0.5)" : "0 20px 40px rgba(0,0,0,0.1)",
                width: viewMode === 'mobile' ? '375px' : '100%',
                maxWidth: "1000px",
                margin: "0 auto",
                transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                textAlign: "center",
                overflow: "hidden"
            }}>
                {/* 
                   LOGIC SWITCH: 
                   Check if we have the new "Premium Data Structure" (has `hero` object) 
                   or fallback to the old structure for backward compatibility.
                */}
                {data.hero ? (
                    // --- PREMIUM LAYOUT (Simulation Mode) ---
                    <div style={{ backgroundColor: data.style?.backgroundColor || '#fff', minHeight: '100%', direction: 'rtl', borderRadius: '24px', overflow: 'hidden' }}>
                        {/* Navigation Bar */}
                        <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <div style={{ fontWeight: 'bold', color: data.style?.primaryColor || '#6366f1', fontSize: '1.4rem' }}>LaunchPage</div>
                            <button style={{ backgroundColor: data.style?.primaryColor || '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: "bold", cursor: "pointer" }}>
                                {data.hero.cta}
                            </button>
                        </nav>

                        {/* Hero Section */}
                        <header style={{ padding: '80px 20px', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px', lineHeight: 1.1 }}>
                                {data.hero.title}
                            </h1>
                            <p style={{ fontSize: '1.3rem', color: '#475569', maxWidth: '700px', margin: '0 auto 30px' }}>
                                {data.hero.description}
                            </p>
                        </header>

                        {/* Features Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', padding: '0 40px 100px', textAlign: 'right' }}>
                            {data.features?.map((f, i) => (
                                <div key={i} style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                                    <h3 style={{ color: data.style?.primaryColor || '#6366f1', marginBottom: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>{f.title}</h3>
                                    <p style={{ color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // --- LEGACY LAYOUT (Generated Results) ---
                    <div style={{ padding: viewMode === 'mobile' ? "40px 20px" : "60px" }}>
                        {/* HERO SECTION */}
                        <div style={{ marginBottom: "60px" }}>
                            <h1 style={titleStyle}>
                                {data.title}
                            </h1>
                            <p style={subtitleStyle}>
                                {data.subtitle}
                            </p>
                            <button style={{
                                padding: "18px 36px",
                                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                border: "none",
                                borderRadius: "50px",
                                color: "white",
                                fontWeight: "700",
                                fontSize: "1.1rem",
                                cursor: "pointer",
                                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)",
                                transition: "transform 0.2s"
                            }}>
                                {data.cta_button || "התחל עכשיו"}
                            </button>
                        </div>

                        {/* Content Sections Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: viewMode === 'mobile' ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "30px",
                            textAlign: "right"
                        }}>
                            {data.sections?.map((section, i) => (
                                <div key={i} style={{
                                    padding: "30px",
                                    background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                                    borderRadius: "20px",
                                    border: darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0"
                                }}>
                                    <h2 style={sectionTitleStyle}>
                                        {section.title}
                                    </h2>
                                    <p style={textStyle}>
                                        {section.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Footer / CTA */}
                        <div style={{ marginTop: "80px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "40px" }}>
                            <p style={{ opacity: 0.7, marginBottom: "15px", fontSize: "1.1rem" }}>{data.cta_text}</p>
                            <button style={{
                                padding: "14px 28px",
                                background: darkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                                color: darkMode ? "white" : "#0f172a",
                                border: "none",
                                borderRadius: "12px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}>
                                {data.cta_button || "צור קשר"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
