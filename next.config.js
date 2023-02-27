
const urlPrefix = process.env.GITHUB_ACTIONS ? "/convnet-shape-calculator" : "";
const fullUrl = process.env.GITHUB_ACTIONS ? "https://lemolatoon.github.io/convnet-shape-calculator" : "";
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: urlPrefix,
  assetPrefix: urlPrefix,
  reactStrictMode: true,
  publicRuntimeConfig: { urlPrefix, fullUrl }
}

module.exports = nextConfig
