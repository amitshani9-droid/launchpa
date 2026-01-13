import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Generates a standalone ZIP for the landing page.
 * @param {string} html - The raw body HTML.
 * @param {string} title - The site title.
 */
export async function downloadStandaloneSite(html, title = "My LaunchPage AI") {
    const zip = new JSZip();

    // 1. Fetch DaisyUI CSS (We use a version that is available on CDN but we bundle it)
    let daisyCss = "";
    try {
        const res = await fetch("https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css");
        daisyCss = await res.text();
    } catch (e) {
        console.warn("Could not fetch DaisyUI for ZIP, using fallback");
    }

    // 2. We need a Tailwind replacement or base. Since we can't bundle ALL of Tailwind,
    // we use a "Reset + Base" and rely on the AI's tendency to use standard classes.
    // In a real production environment, we'd have a pre-compiled "all-in-one" utility CSS.
    const baseCss = `
        /* Tailwind Base + Basic Utilities Fallback */
        *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
        html { line-height: 1.5; -webkit-text-size-adjust: 100%; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
        body { margin: 0; line-height: inherit; }
        img { max-width: 100%; height: auto; }
        .container { width: 100%; margin-right: auto; margin-left: auto; padding-right: 1rem; padding-left: 1rem; }
        @media (min-width: 640px) { .container { max-width: 640px; } }
        @media (min-width: 768px) { .container { max-width: 768px; } }
        @media (min-width: 1024px) { .container { max-width: 1024px; } }
        @media (min-width: 1280px) { .container { max-width: 1280px; } }
        /* Add basic spacing/flex utilities commonly used by AI */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .grid { display: grid; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .w-full { width: 100%; }
    `;

    // 3. Clean the HTML (Remove any script tags or absolute paths if needed)
    // The Quality Gate already ensures no script tags, but we'll be extra safe.
    const cleanHtml = (html || "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    // 4. Construct the Full HTML
    const fullHtml = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!-- Standalone CSS - No CDN dependencies -->
    <link rel="stylesheet" href="styles/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Heebo', sans-serif; overflow-x: hidden; }
    </style>
</head>
<body>
    ${cleanHtml}
</body>
</html>`.trim();

    // 5. Structure the ZIP
    zip.file("index.html", fullHtml);
    zip.folder("styles").file("main.css", baseCss + "\n\n" + daisyCss);

    // 6. Generate and Save
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${title.replace(/\s+/g, '_')}_site.zip`);
}
