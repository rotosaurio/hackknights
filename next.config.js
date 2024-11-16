/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          net: false,
          tls: false,
          fs: false,
          dns: false,
        };
      }
      return config;
    },
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
    },
  }
  
  module.exports = nextConfig