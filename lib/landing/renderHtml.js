/**
 * Rendering Engine: Transforms structured AI JSON into a premium, responsive HTML landing page.
 * Uses TailwindCSS + DaisyUI for rapid, beautiful UI.
 */
export function renderHtml(data, theme = "light") {
    if (!data) return "";

    const {
        title = "LaunchPage Site",
        hero = {},
        features = [],
        steps = [],
        testimonials = [],
        faq = [],
        style = {},
        cta_button = "התחל עכשיו"
    } = data;

    // Design Tokens
    const primaryColor = style.primaryColor || "#3b82f6";
    const secondaryColor = style.secondaryColor || "#8b5cf6";
    const backgroundColor = style.backgroundColor || "#ffffff";
    const isDark = backgroundColor.includes("#0"); // Simple dark mode detection

    // Helper: Generate Gradient Text Code
    const gradientText = `bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`;

    // 1. Build Features Section
    const featuresHtml = features.length > 0 ? `
        <section id="features" class="py-24 relative overflow-hidden">
            <div class="container mx-auto px-6 relative z-10">
                <div class="text-center mb-16">
                    <h2 class="text-4xl lg:text-5xl font-black mb-6 text-base-content">למה כדאי לבחור ב-${title}?</h2>
                    <div class="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${features.map(f => `
                        <div class="group p-8 rounded-3xl bg-base-100 border border-base-200 hover:border-primary/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                ${f.icon || "✨"}
                            </div>
                            <h3 class="text-xl font-bold mb-3 text-base-content">${f.title}</h3>
                            <p class="text-base-content/70 leading-relaxed">${f.desc}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>
    ` : "";

    // 2. Build Steps Section (How it Works)
    const stepsHtml = steps.length > 0 ? `
        <section class="py-24 bg-base-200 relative">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl lg:text-4xl font-black mb-4">איך זה עובד?</h2>
                    <p class="text-lg opacity-70">תהליך פשוט, תוצאות מהירות.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <!-- Connector Line (Desktop) -->
                    <div class="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-0 transform translate-y-4"></div>
                    
                    ${steps.map((step, i) => `
                        <div class="relative z-10 text-center">
                            <div class="w-16 h-16 mx-auto bg-base-100 border-4 border-base-200 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 relative">
                                <span class="bg-clip-text text-transparent bg-gradient-to-tr from-primary to-secondary">${i + 1}</span>
                            </div>
                            <h3 class="text-xl font-bold mb-2">${step.title}</h3>
                            <p class="text-sm opacity-70 px-4">${step.desc}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>
    ` : "";

    // 3. Build Testimonials Section
    const testimonialsHtml = testimonials.length > 0 ? `
        <section class="py-24 bg-base-100">
            <div class="container mx-auto px-6">
                 <h2 class="text-4xl font-black text-center mb-16">לקוחות מספרים</h2>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    ${testimonials.map(t => `
                        <div class="p-8 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors border border-base-200 md:flex gap-6 items-start">
                             <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                ${t.name.charAt(0)}
                             </div>
                             <div>
                                 <div class="flex text-yellow-400 mb-2">★★★★★</div>
                                 <p class="text-lg italic opacity-80 mb-4">"${t.text}"</p>
                                 <h4 class="font-bold">${t.name}</h4>
                                 <span class="text-sm opacity-60">${t.role}</span>
                             </div>
                        </div>
                    `).join("")}
                 </div>
            </div>
        </section>
    ` : "";

    // 4. Build FAQ Section
    const faqHtml = faq.length > 0 ? `
        <section class="py-20 bg-base-100">
            <div class="max-w-3xl mx-auto px-6">
                <h2 class="text-3xl font-black text-center mb-10">שאלות נפוצות</h2>
                <div class="join join-vertical w-full">
                    ${faq.map(item => `
                        <div class="collapse collapse-plus join-item border border-base-300">
                            <input type="radio" name="my-accordion-4" /> 
                            <div class="collapse-title text-xl font-medium">
                                ${item.q}
                            </div>
                            <div class="collapse-content"> 
                                <p class="opacity-80">${item.a}</p>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>
    ` : "";

    // Final Assembly with Premium Head
    return `
<!DOCTYPE html>
<html lang="he" dir="rtl" data-theme="${theme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Heebo', 'sans-serif'] },
            colors: {
              primary: '${primaryColor}',
              secondary: '${secondaryColor}',
            }
          }
        }
      }
    </script>
    <style>
        body { font-family: 'Heebo', sans-serif; background-color: ${backgroundColor}; }
        .hero-gradient { background: radial-gradient(circle at 70% 30%, ${secondaryColor}33, transparent 70%), radial-gradient(circle at 30% 70%, ${primaryColor}33, transparent 70%); }
    </style>
</head>
<body class="min-h-screen text-base-content overflow-x-hidden">

    <!-- Navbar -->
    <nav class="navbar bg-base-100/70 backdrop-blur-lg fixed top-0 w-full z-50 border-b border-base-200">
        <div class="container mx-auto px-4">
            <div class="flex-1">
                <a class="text-2xl font-black tracking-tighter ${gradientText}">${title}</a>
            </div>
            <div class="flex-none">
                <button class="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/30 hover:scale-105 transition-transform font-bold">
                    ${hero.cta || cta_button}
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="pt-40 pb-20 px-6 relative hero-gradient">
        <div class="max-w-4xl mx-auto text-center relative z-10">
            ${hero.trust_text ? `<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 border border-base-200 mb-8 backdrop-blur-sm text-sm font-bold animate-fade-in-up">
                <span class="text-yellow-500">★★★★★</span> ${hero.trust_text}
            </div>` : ""}
            
            <h1 class="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-base-content to-base-content/60">
                ${hero.title || "כותרת ראשית חזקה"}
            </h1>
            
            <p class="text-xl lg:text-2xl mb-12 text-base-content/80 max-w-2xl mx-auto leading-relaxed">
                ${hero.subtitle || hero.description || ""}
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button class="btn btn-primary btn-lg h-16 px-10 rounded-full text-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all">
                    ${hero.cta || cta_button}
                </button>
                <div class="text-sm opacity-60 mt-4 sm:mt-0 font-medium">✨ ללא התחייבות · 14 יום ניסיון</div>
            </div>
        </div>
    </header>

    ${featuresHtml}
    ${stepsHtml}
    ${testimonialsHtml}
    ${faqHtml}

    <!-- CTA Footer -->
    <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-primary opacity-90"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div class="container mx-auto px-6 relative z-10 text-center text-primary-content">
            <h2 class="text-4xl lg:text-6xl font-black mb-8">מוכנים לקחת את העסק לשלב הבא?</h2>
            <p class="text-2xl opacity-90 mb-12 max-w-2xl mx-auto">הצטרפו למאות בעלי עסקים שכבר בחרו ב-${title}.</p>
            <button class="btn btn-white text-primary btn-lg h-16 px-12 rounded-full text-xl font-black shadow-2xl hover:scale-105 transition-transform border-none">
                ${cta_button}
            </button>
        </div>
    </section>

    <footer class="footer footer-center p-10 bg-base-300 text-base-content/70">
        <aside>
            <p class="font-bold flex items-center gap-2">
                נוצר באמצעות <span class="text-primary">LaunchPage AI 🚀</span> © ${new Date().getFullYear()}
            </p>
        </aside>
    </footer>

</body>
</html>
    `.trim();
}

/**
 * Helper to convert HEX to HSL not strictly needed with Tailwind config injection,
 * staying efficient.
 */
function hexToHsl(hex) { return ""; } 
