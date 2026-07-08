/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: deploys directly to Vercel AND wraps cleanly in Capacitor
  // for iOS / Android without architectural changes.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
