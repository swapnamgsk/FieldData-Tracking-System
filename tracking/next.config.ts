/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-image-host.com", // Replace with actual hostname
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
