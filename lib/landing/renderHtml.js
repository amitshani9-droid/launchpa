/**
 * Rendering Engine: Transforms structured AI JSON into a premium, DaisyUI-powered HTML landing page.
 * Ensures 100% consistency and architectural stability.
 */
export function renderHtml(data, theme = "light") {
    if (!data) return "";

    const {
        title = "LaunchPage AI",
        hero = {},
        features = [],
        style = {},
        cta_button = "התחל עכשיו"
    } = data;

    const primaryColor = style.primaryColor || "#3b82f6";
    const backgroundColor = style.backgroundColor || "#ffffff";

    // Build Features Section
    const featuresHtml = features.map(f => `
        <div class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div class="card-body text-right">
                <h3 class="card-title text-primary justify-end font-bold text-xl">${f.title || ""}</h3>
                <p class="text-base-content/70">${f.desc || ""}</p>
            </div>
        </div>
    `).join("");

    return `
<div data-theme="${theme}" dir="rtl" class="min-h-screen bg-base-100 font-sans text-right">
    <style>
        :root {
            --p: ${hexToHsl(primaryColor)};
            --b1: ${hexToHsl(backgroundColor)};
        }
        .hero-pattern {
            background-image: radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0);
            background-size: 40px 40px;
        }
    </style>

    <!-- Navbar -->
    <div class="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4">
        <div class="flex-1">
            <a class="btn btn-ghost text-2xl font-black text-primary tracking-tighter">${title}</a>
        </div>
        <div class="flex-none hidden lg:block">
            <ul class="menu menu-horizontal px-1 font-bold">
                <li><a>ראשי</a></li>
                <li><a>יתרונות</a></li>
                <li><a>צור קשר</a></li>
            </ul>
        </div>
    </div>

    <!-- Hero Section -->
    <div class="hero min-h-[70vh] bg-base-200 hero-pattern relative overflow-hidden">
        <div class="hero-content text-center py-20">
            <div class="max-w-3xl">
                <h1 class="text-5xl lg:text-7xl font-black leading-tight mb-8">
                    ${hero.title || ""}
                </h1>
                <p class="text-xl lg:text-2xl mb-10 text-base-content/80 leading-relaxed">
                    ${hero.description || ""}
                </p>
                <button class="btn btn-primary btn-lg rounded-full px-12 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    ${hero.cta || cta_button}
                </button>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 container mx-auto px-4" id="features">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-black mb-4">למה כדאי לבחור בנו?</h2>
            <div class="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${featuresHtml}
        </div>
    </div>

    <!-- Final CTA Section -->
    <div class="bg-primary text-primary-content py-20 text-center">
        <div class="max-w-2xl mx-auto px-4">
            <h2 class="text-4xl font-black mb-6">מוכנים להתחיל בשינוי?</h2>
            <p class="text-xl mb-10 opacity-90">${hero.description || ""}</p>
            <button class="btn btn-secondary btn-lg rounded-full px-12 border-none">
                ${cta_button}
            </button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer p-10 bg-base-100 text-base-content border-t border-base-200">
        <nav>
            <h6 class="footer-title opacity-50">פתרונות</h6> 
            <a class="link link-hover">מיתוג לעסקים</a>
            <a class="link link-hover">דפי נחיתה</a>
        </nav> 
        <nav>
            <h6 class="footer-title opacity-50">החברה</h6> 
            <a class="link link-hover">אודותינו</a>
            <a class="link link-hover">משרות</a>
        </nav> 
        <nav>
            <h6 class="footer-title opacity-50">משפטי</h6> 
            <a class="link link-hover">תנאי שימוש</a>
            <a class="link link-hover">פרטיות</a>
        </nav>
    </footer>
    <div class="footer footer-center p-4 bg-base-200 text-base-content font-bold">
        <aside>
            <p>© 2026 ${title} - נוצר ע״י LaunchPage AI 🚀</p>
        </aside>
    </div>
</div>
    `.trim();
}

/**
 * Helper to convert HEX to HSL values for DaisyUI CSS variables.
 * Simple approximation for UI purposes.
 */
function hexToHsl(hex) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
