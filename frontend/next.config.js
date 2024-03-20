// /** @type {import('next').NextConfig} */
require('dotenv').config();
const withReactSvg = require('next-react-svg')
const path = require('path')

module.exports = withReactSvg({
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  trailingSlash: true,
  include: path.resolve(__dirname, 'public'),
  webpack(config, options) {
    return config
  }
})
const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')

const nextConfig = {
  images: {
    domains: ['localhost']
  },
}

module.exports = withPlugins([[withImages]], nextConfig)
