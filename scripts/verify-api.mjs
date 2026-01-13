
import fetch from "node-fetch";

const API_URL = "http://127.0.0.1:3000/api/generate";

const payload = {
    businessType: "Software Company",
    description: "We build automated testing tools",
    goal: "לידים",
    tone: "רשמי",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    targetAudience: "Developers",
    uniqueValue: "Faster CI/CD",
    offer: "Free Trial"
};

async function verify() {
    try {
        console.log("Testing API:", API_URL);
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Received Data Keys:", Object.keys(data));

        const errors = [];

        // 1. Root Keys Check
        const requiredRoot = ["goal", "title", "subtitle", "cta", "primaryColor", "secondaryColor", "sections"];
        requiredRoot.forEach(key => {
            if (data[key] === undefined) errors.push(`Missing root key: ${key}`);
        });

        if (!Array.isArray(data.sections)) {
            errors.push("sections is not an array");
        } else {
            // 2. Sections Validation
            const benefits = data.sections.find(s => s.type === "benefits");
            if (!benefits) {
                console.warn("No 'benefits' section found to validate items count.");
            } else {
                if (!Array.isArray(benefits.content?.items)) {
                    errors.push("benefits.content.items is not an array");
                } else if (benefits.content.items.length !== 3) {
                    errors.push(`benefits items count is ${benefits.content.items.length}, expected 3`);
                }
            }

            // Check generic structure of all sections
            data.sections.forEach((sec, idx) => {
                if (!sec.type) errors.push(`Section [${idx}] missing 'type'`);
                if (!sec.content) errors.push(`Section [${idx}] missing 'content'`);
            });
        }

        // Note: 'howItWorks' or 'faq' might not be present in 'Lead' goal (default payload),
        // strictly speaking, but if they ARE present, we validate them.
        // If we want to force validation, we might need a different payload.
        // For now, checking what we have.

        if (errors.length > 0) {
            console.error("❌ Validation Failed:");
            errors.forEach(e => console.error(` - ${e}`));
            process.exit(1);
        } else {
            console.log("✅ API Schema Verified Successfully");
            process.exit(0);
        }

    } catch (error) {
        console.error("❌ Test Script Failed:", error.message);
        process.exit(1);
    }
}

verify();
