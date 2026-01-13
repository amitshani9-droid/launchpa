"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew"] });

export default function GeneratorLogic() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [offer, setOffer] = useState("");        // מה העסק מציע
    const [audience, setAudience] = useState("");  // קהל יעד
    const [usp, setUsp] = useState("");            // מה מבדל
    const [goal, setGoal] = useState("לידים");     // מטרה
    const [style, setStyle] = useState("מודרני");  // סגנון עיצוב

    const handleSubmit = (e) => {
        e.preventDefault();

        const prompt = `
אתה בונה דף נחיתה מקצועי לעסק בישראל.
הנה פרטי העסק:

מה העסק מציע: ${offer}
קהל יעד: ${audience}
מה מבדל את העסק: ${usp}
מטרת הדף: ${goal}
סגנון עיצוב: ${style}

צור JSON מלא עם:
- title
- subtitle
- sections[] (כל סקשן עם title + text)
- cta_text
- cta_button
- color_theme
- tone_of_voice

הדף צריך להיות בעברית, ממיר, מקצועי וברמה של משווק דיגיטל.
        `;

        router.push(`/result?p=${encodeURIComponent(prompt)}`);
    };

    const inputStyle = {
        width: "100%",
        padding: "15px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.05)",
        color: "white",
        marginTop: "8px",
        fontSize: "1rem",
        outline: "none"
    };

    return (
        <div className={heebo.className} dir="rtl" style={{
            minHeight: "100vh",
            background: "#05070a",
            color: "white",
            padding: "40px 20px"
        }}>
            <h1 style={{
                fontSize: "2.5rem",
                fontWeight: "900",
                textAlign: "center",
                marginBottom: "40px",
                background: "linear-gradient(135deg, #60a5fa, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            }}>
                יצירת דף נחיתה חדש 🚀
            </h1>

            {/* Fast Track Skip Button (if description is present) */}
            {searchParams.get('p') || searchParams.get('description') ? (
                <button
                    onClick={() => router.push(`/result?p=${encodeURIComponent(searchParams.get('p') || searchParams.get('description'))}`)}
                    style={{
                        background: 'none', border: 'none', color: '#60a5fa',
                        textDecoration: 'underline', cursor: 'pointer',
                        fontSize: '1rem', margin: '0 auto', display: 'block', marginBottom: '20px'
                    }}
                >
                    🪄 יש לי כבר תיאור, דלג ישר ליצירה
                </button>
            ) : null}

            <form onSubmit={handleSubmit} style={{
                maxWidth: "700px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "25px"
            }}>

                {/* מה העסק מציע */}
                <div>
                    <label style={{ fontWeight: "600" }}>מה העסק מציע?</label>
                    <input
                        type="text"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        placeholder="לדוגמה: אימוני כושר לנשים / שירותי חשמלאות 24/7"
                        style={inputStyle}
                        required
                    />
                </div>

                {/* קהל יעד */}
                <div>
                    <label style={{ fontWeight: "600" }}>מי קהל היעד?</label>
                    <input
                        type="text"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="לדוגמה: נשים אחרי לידה / בעלי דירות / עסקים קטנים"
                        style={inputStyle}
                        required
                    />
                </div>

                {/* USP */}
                <div>
                    <label style={{ fontWeight: "600" }}>מה מבדל את העסק?</label>
                    <input
                        type="text"
                        value={usp}
                        onChange={(e) => setUsp(e.target.value)}
                        placeholder="לדוגמה: ניסיון של 10 שנים / שירות מהיר / תוצאות מוכחות"
                        style={inputStyle}
                        required
                    />
                </div>

                {/* מטרה */}
                <div>
                    <label style={{ fontWeight: "600" }}>מה המטרה של הדף?</label>
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        style={inputStyle}
                    >
                        <option>לידים</option>
                        <option>מכירה</option>
                        <option>קביעת שיחת ייעוץ</option>
                        <option>הצגת מידע</option>
                    </select>
                </div>

                {/* סגנון עיצוב */}
                <div>
                    <label style={{ fontWeight: "600" }}>סגנון עיצוב</label>
                    <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        style={inputStyle}
                    >
                        <option>מודרני</option>
                        <option>יוקרתי</option>
                        <option>צעיר</option>
                        <option>נקי</option>
                    </select>
                </div>

                <button type="submit" style={{
                    padding: "18px",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                }}>
                    צור דף נחיתה ✨
                </button>

                <button
                    type="button"
                    onClick={() => router.push('/result?p=TEST_SIMULATION')}
                    style={{
                        padding: "12px",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px dashed rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.9rem",
                        cursor: "pointer"
                    }}
                >
                    🧪 הרץ סימולציה (בדיקת מערכת)
                </button>
            </form>
        </div>
    );
}
