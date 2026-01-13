/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // מייצר תיקיית 'out' ש-Firebase צריך
  images: {
    unoptimized: true, // חובה כדי שתמונות יעבדו בייצוא סטטי
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
