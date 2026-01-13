// test-key.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("--- מתחיל בדיקה מקיפה ---");
    console.log("1. בודק מפתח:", apiKey ? "נמצא (אורך " + apiKey.length + ")" : "חסר!");

    if (!apiKey) {
        console.error("❌ שגיאה: המפתח לא נמצא");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-pro-latest",
        "gemini-pro",
        "gemini-1.0-pro",
        "gemini-2.0-flash-exp"
    ];

    console.log("2. מתחבר לגוגל ומנסה מודלים שונים...");

    for (const modelName of modelsToTry) {
        try {
            console.log(`\n⏳ בודק מודל: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`✅ הצלחה! המודל ${modelName} עובד.`);
            console.log(`   תשובה: ${response.text()}`);
            return; // מצאנו אחד עובד, אפשר לעצור
        } catch (error) {
            if (error.message.includes("404")) {
                console.log(`❌ מודל ${modelName} לא נמצא (404).`);
            } else {
                console.error(`❌ שגיאה ב-${modelName}:`, error.message.split('\n')[0]);
            }
        }
    }
    console.error("\n❌ אף מודל לא עבד. אנא בדוק את הרשאות המפתח או את ה-API ב-Google AI Studio.");
}

testGemini();
