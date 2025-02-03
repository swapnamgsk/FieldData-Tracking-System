// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import path from 'path';

const nextConfig = {
  webpack(config: any) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'), // Add alias for the 'src' directory
    };
    return config;
  },
};

export default nextConfig;

