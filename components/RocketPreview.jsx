import React from 'react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, color, className }) => {
    // תיקון: הופך "rocket" ל-"Rocket" כדי ש-Lucide יזהה את האייקון
    const iconName = name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : 'Zap';
    const IconComponent = LucideIcons[iconName] || LucideIcons.Zap;
    return <IconComponent color={color} className={className} />;
};

const RocketPreview = ({ data, isPro }) => {
    // הגנה: אם אין דאטה, לא מרנדרים כלום (מונע מסך לבן)
    if (!data) return <div className="text-center text-white p-10">טוען תצוגה...</div>;

    // חילוץ בטוח של משתנים (Fallback לערכי ברירת מחדל)
    const styles = data.style || {};
    const hero = data.hero || {};
    const features = data.features || [];

    const bgColor = styles.backgroundColor || '#ffffff';
    const primaryColor = styles.primaryColor || '#2563eb';
    const textColor = '#1e293b'; // צבע טקסט כהה כברירת מחדל

    // לוגיקת Paywall
    const handleContextMenu = (e) => {
        if (!isPro) e.preventDefault();
    };

    const containerStyle = {
        backgroundColor: bgColor,
        color: textColor,
        userSelect: isPro ? 'auto' : 'none',
        filter: isPro ? 'none' : 'blur(6px)', // טשטוש עדין יותר שנראה טוב
        transition: 'filter 0.5s ease-in-out',
        pointerEvents: isPro ? 'auto' : 'none',
    };

    return (
        <div
            className="w-full min-h-[600px] shadow-2xl overflow-hidden rounded-xl border border-white/10 relative bg-white"
            onContextMenu={handleContextMenu}
        >
            <div style={containerStyle} className="w-full h-full p-0 font-sans">

                {/* Navigation */}
                <nav className="p-6 flex justify-between items-center border-b border-black/5">
                    <div className="font-bold text-2xl" style={{ color: primaryColor }}>{data.title}</div>
                    <div className="hidden md:flex gap-6 text-sm font-medium opacity-70">
                        <span>ראשי</span>
                        <span>תכונות</span>
                        <span>אודות</span>
                    </div>
                    <button
                        className="px-5 py-2 rounded-full text-white text-sm font-bold shadow-md"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {hero.cta || "התחל עכשיו"}
                    </button>
                </nav>

                {/* Hero Section */}
                <section className="py-24 px-8 text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-gray-900">
                        {hero.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {hero.description || hero.subtitle} {/* תמיכה בשני הפורמטים */}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="px-10 py-4 rounded-xl text-white font-bold text-lg shadow-xl hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {hero.cta || "בוא נתחיל"}
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                {features.length > 0 && (
                    <section className="py-20 px-8 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {features.map((feature, idx) => (
                                <div key={idx} className="p-8 rounded-2xl bg-white shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                        style={{ backgroundColor: `${primaryColor}15` }} // 15% opacity hex
                                    >
                                        <DynamicIcon name={feature.icon} color={primaryColor} className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc || feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="py-10 border-t border-gray-200 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} {data.title}. כל הזכויות שמורות.</p>
                    <p className="mt-2 text-xs">נבנה באמצעות LaunchPage AI 🚀</p>
                </footer>
            </div>

            {/* שכבת הגנה ויזואלית לחינמיים */}
            {!isPro && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    {/* הכפתור האמיתי נמצא ב-Page.jsx, כאן זה רק כדי לתפוס מקום */}
                </div>
            )}
        </div>
    );
};

export default RocketPreview;
