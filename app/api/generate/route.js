import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

let genAI = null;
const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error("Missing GOOGLE_GEMINI_API_KEY");
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  }
  return genAI;
};

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

    const aiInstance = getGenAI();
    const model = aiInstance.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are an elite high-ticket web designer and conversion copywriter.
      Your goal is to design a "$5000 Landing Page" in structured JSON format.
      
      PRINCIPLES:
      1. LUXURY & TRUST: Use high-end, benefit-driven copy.
      2. CONVERSION PSYCHOLOGY: address pain points, offer solutions, show social proof.
      3. VISUAL HIERARCHY: Structure content for scanning (bullets, short headers).
      4. ISRAELI MARKET: Use natural, persuasive Hebrew (slang allowed where appropriate, but mostly professional).
      `,
    });

    const fullPrompt = `
      GENERATE A LANDING PAGE FOR: "${prompt}".
      
      STRICT OUTPUT CONTRACT:
      - Return VALID JSON ONLY.
      - No markdown codes (\`\`\`json).
      - Language: Hebrew (RTL).
      
      REQUIRED JSON STRUCTURE:
      {
        "title": "Brand Name (2-3 words)",
        "hero": {
          "title": "Main Headline (Power promise, 6-10 words)",
          "subtitle": "Subheadline clarifying the offer (15-20 words)",
          "cta": "Action Button Text",
          "trust_text": "e.g. 'Join 500+ happy customers'"
        },
        "features": [
          { "title": "Benefit 1", "desc": "Short explanation", "icon": "emoji like 🚀" },
          { "title": "Benefit 2", "desc": "Short explanation", "icon": "emoji like 💎" },
          { "title": "Benefit 3", "desc": "Short explanation", "icon": "emoji like 🛡️" }
        ],
        "steps": [
          { "title": "Step 1", "desc": "What happens first" },
          { "title": "Step 2", "desc": "What happens next" },
          { "title": "Step 3", "desc": "The result" }
        ],
        "testimonials": [
          { "name": "Israeli Name", "role": "Customer Role", "text": "Short raving review (Hebrew)" },
          { "name": "Israeli Name", "role": "Customer Role", "text": "Short raving review (Hebrew)" }
        ],
        "faq": [
          { "q": "Common objection?", "a": "Soothing answer" },
          { "q": "Another objection?", "a": "Confident answer" }
        ],
        "style": {
          "primaryColor": "A premium gradient colors (start hex)",
          "secondaryColor": "A complementary hex",
          "backgroundColor": "#ffffff or #0f172a (dark)"
        },
        "cta_button": "Final Urgency Button"
      }

      TONE: ${theme === 'dark' ? 'Exclusive, High-Tech, Mysterious' : 'Clean, Professional, Trustworthy'}.
      BUSINESS NAME: ${businessName || "Create a premium Hebrew brand name"}.
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
