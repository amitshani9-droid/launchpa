import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const userPrompt = body.prompt || "Startu landing page";

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ השינוי המנצח: שימוש במודל היחיד שענה לנו
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const systemInstruction = `
    You are an expert Web Designer AI.
    Output: VALID JSON ONLY. No markdown. No text before/after.
    Language: Hebrew.
    
    Structure:
    {
      "title": "Site Title",
      "hero": { "title": "Headline", "description": "Subtext", "cta": "Button" },
      "features": [
        { "title": "F1", "desc": "D1", "icon": "Rocket" },
        { "title": "F2", "desc": "D2", "icon": "Zap" },
        { "title": "F3", "desc": "D3", "icon": "Star" }
      ],
      "style": { "primaryColor": "#2563eb", "backgroundColor": "#ffffff" }
    }
    `;

    console.log("Generating with model: gemini-2.0-flash-exp...");

    const result = await model.generateContent(`${systemInstruction}\n\nUser Request: ${userPrompt}`);
    const response = await result.response;
    let text = response.text();

    // ניקוי
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("Gemini Error:", error);

    // טיפול ספציפי בשגיאת עומס (429)
    if (error.message.includes("429")) {
      return NextResponse.json({
        error: "המערכת עמוסה כרגע (Rate Limit). אנא נסה שוב בעוד דקה."
      }, { status: 429 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
