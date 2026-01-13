import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(req) {
  const startTime = Date.now(); // תזמון התחלה

  // יצירת בקר לביטול הבקשה אחרי 10 שניות
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const body = await req.json();
    let { prompt, theme = "light", logoUrl, businessName, siteId } = body;

    // משיכת נתונים מ-Firestore במידה והועבר siteId
    if (siteId) {
      console.log(`📡 [Gemini API] משיכת נתוני אתר מ-Firestore עבור ID: ${siteId}`);
      try {
        const siteRef = doc(db, "sites", siteId);
        const siteSnap = await getDoc(siteRef);
        if (siteSnap.exists()) {
          const siteData = siteSnap.data();
          prompt = siteData.prompt || prompt;
          theme = siteData.theme || theme;
          logoUrl = siteData.logoUrl || logoUrl;
          businessName = siteData.businessName || businessName;
        }
      } catch (dbError) {
        console.error("❌ [Gemini API] Firestore fetch error:", dbError);
        // ממשיכים עם הנתונים מה-body אם ה-fetch נכשל
      }
    }

    console.log("🚀 [Gemini API] התחלת יצירת אתר עבור:");
    console.log(`📝 פרומפט: "${prompt}" | סגנון: "${theme}" | עסקה: "${businessName || 'לא צוין'}" | לוגו: ${logoUrl ? "כן" : "לא"}`);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an Expert Web Designer, Conversion Copywriter, and Landing Page Specialist. Your goal is to generate structured marketing data for high-quality landing pages. You must think in terms of conversion optimization, marketing psychology, and modern structure."
    });

    const fullPrompt = `
      GENERATE A LANDING PAGE FOR: "${prompt}".
      
      STRICT OUTPUT CONTRACT:
      - Return VALID JSON ONLY.
      - No markdown, no explanations, no text before or after the JSON.
      - Default language: Hebrew (RTL).
      
      REQUIRED JSON STRUCTURE:
      {
        "title": "Short brand-style name (3-6 words, no emojis)",
        "hero": {
          "title": "Strong, benefit-driven headline (min 8 words)",
          "description": "1-2 short marketing sentences focused on outcomes",
          "cta": "Action-oriented button text (Hebrew)"
        },
        "features": [
          { "title": "Benefit title", "desc": "Concise benefit description" }
        ],
        "style": {
          "primaryColor": "HEX color (e.g. #6366F1)",
          "backgroundColor": "HEX color"
        },
        "cta_button": "Final call-to-action (Hebrew)"
      }

      RULES:
      - features must have at least 3 items.
      - style colors must be valid HEX and contrast well.
      - Tone: ${theme === 'dark' ? 'Professional and Sleek' : 'Friendly and Trustworthy'}.
      - Business Name: ${businessName || "Invent a catchy Hebrew brand name if not provided"}.
    `;

    console.log("⏳ פונה ל-Gemini AI בתצורת JSON... נא להמתין.");

    const result = await model.generateContent(fullPrompt, { signal: controller.signal });
    clearTimeout(timeoutId);

    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown formatting if AI slips up
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const jsonData = JSON.parse(text);
      const duration = (Date.now() - startTime) / 1000;
      console.log(`✅ [Gemini API] הצלחה! JSON נוצר תוך ${duration} שניות.`);

      return NextResponse.json(jsonData);
    } catch (parseError) {
      console.error("❌ [Gemini API] JSON Parse Error:", parseError, "Raw text:", text);
      return NextResponse.json({
        error: "ה-AI החזיר מבנה לא תקין, מנסים שוב...",
        details: "Invalid JSON response"
      }, { status: 500 });
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("⚠️ [Gemini API] Timeout: גוגל לא ענה תוך 10 שניות");
      return NextResponse.json({
        error: "השרת קצת עמוס, נסה שוב בעוד רגע ✨",
        details: "Request timed out after 10s"
      }, { status: 504 });
    }

    console.error("❌ [Gemini API] שגיאה ביצירת האתר:");
    console.error(error.message);

    return NextResponse.json(
      { error: "קרתה שגיאה קטנה בדרך...", details: error.message },
      { status: 500 }
    );
  }
}
