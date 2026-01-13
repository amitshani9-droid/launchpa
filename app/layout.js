import { Heebo, Geist_Mono } from "next/font/google";
import PremiumLayout from "@/components/PremiumLayout";
import Script from "next/script";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew"],
  variable: "--font-heebo",
  weight: ["300", "400", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'LaunchPage AI | אתרי נחיתה בבינה מלאכותית',
  description: 'צור אתר נחיתה מקצועי ב-60 שניות',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#05070a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css" rel="stylesheet" type="text/css" />
      </head>
      <body suppressHydrationWarning>
        <PremiumLayout>{children}</PremiumLayout>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
