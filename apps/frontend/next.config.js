const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["firebase", "@firebase/auth"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: path.resolve(__dirname, "src/utils/empty-module.js"),
    };
    return config;
  },
};

module.exports = nextConfig;
