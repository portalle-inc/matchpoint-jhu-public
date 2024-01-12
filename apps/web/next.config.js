/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],

  experimental: {
    typedRoutes: true,
  },
};
