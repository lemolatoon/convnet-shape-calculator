/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.GITHUB_ACTIONS ? "/convnet-shape-calculator" : "",
  reactStrictMode: true,
}

module.exports = nextConfig
