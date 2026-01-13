/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // מייצר תיקיית 'out' ש-Firebase צריך
  images: {
    unoptimized: true, // חובה כדי שתמונות יעבדו בייצוא סטטי
  },
};

export default nextConfig;
