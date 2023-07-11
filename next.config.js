/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    domains: ["nft-cdn.alchemy.com", "ipfs.io"],
    dangerouslyAllowSVG: true,
  },
  // Remove pino-pretty warning
  externals: ["pino-pretty"],
};

module.exports = nextConfig;
