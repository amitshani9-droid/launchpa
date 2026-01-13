"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew"] });

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // סימולציה של בדיקת שרת ומערכת משתמשים לוקאלית
        setTimeout(() => {
            // בדיקה פרטנית עבור המשתמש שלך (Admin)
            if (email.toLowerCase() === "amitshani9@gmail.com" && password === "agam") {
                localStorage.setItem("isAdmin", "true");
                localStorage.setItem("userName", "עמית שני");
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userPlan", "PRO");
                localStorage.setItem("proCoupon", "PRO2026");
                window.location.href = "/result"; // רענון מלא כדי שהסטטוס יתעדכן
            } else {
                // התחברות כמשתמש רגיל לצורך בדיקה
                localStorage.setItem("isAdmin", "false");
                localStorage.setItem("userName", email.split("@")[0]);
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userPlan", "FREE");
                router.push("/result");
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className={heebo.className} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", direction: "rtl", padding: "15px" }}>
            <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.06)", width: "100%", maxWidth: "420px", textAlign: "center" }}>

                <div style={{ fontSize: "3.5rem", marginBottom: "15px" }}>🚀</div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: "900", color: "#0f172a", marginBottom: "8px" }}>כניסת משתמשים</h1>
                <p style={{ color: "#64748b", marginBottom: "35px", fontSize: "1rem" }}>התחבר כדי לנהל את דפי הנחיתה שלך</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "20px", textAlign: "right" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", fontSize: "0.9rem", color: "#334155" }}>כתובת אימייל</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "16px", outline: "none", background: "#f8fafc" }}
                        />
                    </div>

                    <div style={{ marginBottom: "30px", textAlign: "right" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", fontSize: "0.9rem", color: "#334155" }}>סיסמה</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "16px", outline: "none", background: "#f8fafc" }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #2563EB 0%, #1e40af 100%)", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer", boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)", transition: "0.2s" }}
                        onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
                        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                    >
                        {loading ? "מאמת פרטים..." : "התחבר עכשיו"}
                    </button>
                </form>

                <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#94a3b8" }}>
                    אין לך חשבון עדיין? <a href="/" style={{ color: "#2563EB", fontWeight: "bold", textDecoration: "none" }}>חזור לדף הבית</a>
                </div>
            </div>
        </div>
    );
}
