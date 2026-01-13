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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `
  You are a branding expert and UI/UX designer using Tailwind CSS and DaisyUI.
  Build a high-end, conversion-optimized landing page for: "${prompt}".

  BRANDING RULES:
  1. Business Name: 
     ${businessName ?
        `Use the EXACT business name provided: "${businessName}".` :
        `Check if the user provided a business name in the prompt. If NOT, your first task is to INVENT a creative, catchy, and professional business name in HEBREW that fits the industry.`
      }
     Place this name prominently in the Navbar and the Hero section.

  2. LOGO:
     ${logoUrl ?
        `Use this exact URL for the logo image in the Navbar and Footer: "${logoUrl}". Make sure it has a max-height of 50px.` :
        `If no logo, create a stylish text-logo using the (invented or provided) business name.`
      }

  STRICT DESIGN RULES:
  1. Use DaisyUI components: 'navbar', 'hero', 'card', 'stat', 'footer', 'accordion'.
  2. Theme: Apply the DaisyUI theme: "${theme}" (set data-theme="${theme}" on the main div).
  3. Spacing: Use 'py-20' for sections to ensure a spacious, premium feel.
  4. Buttons: Use 'btn btn-primary' or 'btn-secondary' with 'btn-lg'.
  5. Borders: Use 'rounded-box' for all containers.

  STRUCTURE:
  - Sticky Navbar with glass effect.
  - Hero with a split layout and a clear CTA.
  - Features section using the 'card' component with icons.
  - Social Proof using the 'stat' component (e.g., 2000+ happy customers).
  - FAQ using 'join' and 'collapse' components.
  - Professional Footer.

  LANGUAGE:
  - Hebrew only (RTL). Add dir="rtl" to the main wrapper.

  OUTPUT:
  - Return ONLY the HTML code inside a single <div>. 
  - Do not use markdown backticks (\`\`\`).
`;

    console.log("⏳ פונה ל-Gemini AI... נא להמתין.");

    // שליחת הבקשה עם ה-Signal לביטול
    const result = await model.generateContent(fullPrompt, { signal: controller.signal });

    clearTimeout(timeoutId); // אם זה הצליח בזמן, מבטלים את ה-Timeout

    const response = await result.response;
    const text = response.text();

    const duration = (Date.now() - startTime) / 1000; // חישוב זמן בשניות

    console.log(`✅ [Gemini API] הצלחה! האתר נוצר תוך ${duration} שניות.`);
    console.log(`📏 אורך הקוד שהתקבל: ${text.length} תווים.`);

    return NextResponse.json({ html: text });

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
