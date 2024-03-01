/** @type {import('next').NextConfig} */
require('dotenv').config();
const withReactSvg = require('next-react-svg')
const path = require('path')

const withImages = require('next-images')
module.exports = withImages()

module.exports = {
  reactStrictMode: true,
  experimental: {
    images: {
        allowFutureImage: true
    }
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'public'),
  webpack(config, options) {
    return config
  }
})