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

    const model = aiInstance.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are an elite high-ticket web designer and direct-response copywriter.
      Your goal is to design a "$5000 Landing Page" for a user in structured JSON format.
      
      PRINCIPLES:
      1. LUXURY & TRUST: Use high-end, benefit-driven copy.
      2. CONVERSION PSYCHOLOGY: Use the PAS framework (Problem-Agitation-Solution).
      3. VISUAL HIERARCHY: Structure content for scanning.
      4. ISRAELI MARKET: Use natural, persuasive Hebrew (slang allowed but professional).
      5. COMPLETENESS: Fill ALL fields. No placeholders.
      `,
    });

    const fullPrompt = `
      GENERATE A PREMIUM LANDING PAGE FOR: "${prompt}".
      
      STRICT OUTPUT CONTRACT:
      - Return VALID JSON ONLY.
      - No markdown codes (\`\`\`json).
      - Language: Hebrew (RTL).
      
      REQUIRED JSON STRUCTURE (Must match exactly):
      {
        "hero": {
          "title": "Main Headline (Power promise, 6-10 words)",
          "description": "Subheadline clarifying the offer (15-20 words) - Focus on the outcome",
          "cta": "Action Button Text (e.g., Start Now)",
          "trust_text": "e.g. 'Join 500+ happy customers'"
        },
        "features": [
          { "title": "Benefit 1", "desc": "Short explanation focusing on value", "icon": "emoji" },
          { "title": "Benefit 2", "desc": "Short explanation focusing on value", "icon": "emoji" },
          { "title": "Benefit 3", "desc": "Short explanation focusing on value", "icon": "emoji" }
        ],
        "steps": [
          { "title": "Step 1", "desc": "Actionable step" },
          { "title": "Step 2", "desc": "Actionable step" },
          { "title": "Step 3", "desc": "Desired result" }
        ],
        "testimonials": [
          { "name": "Israeli Name", "role": "Job Title", "text": "Specific praise about the result (Hebrew)" },
          { "name": "Israeli Name", "role": "Job Title", "text": "Specific praise about the result (Hebrew)" }
        ],
        "faq": [
          { "q": "Real objection?", "a": "Soothing, confident answer" },
          { "q": "Real objection?", "a": "Soothing, confident answer" },
          { "q": "Real objection?", "a": "Soothing, confident answer" }
        ],
        "style": {
          "primaryColor": "A premium gradient start hex code",
          "secondaryColor": "A complementary hex code",
          "backgroundColor": "#ffffff" 
        },
        "cta_button": "Final Urgency Button",
        "cta_text": "Final call to action text"
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
