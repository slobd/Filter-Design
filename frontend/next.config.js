/** @type {import('next').NextConfig} */
const withReactSvg = require('next-react-svg')
const path = require('path')

const withImages = require('next-images')
module.exports = withImages()

module.exports = {
  reactStrictMode: true,
  env: {
    // SOCKET_URL: 'http://localhost:9000',
  },
  experimental: {
    images: {
        allowFutureImage: true
    }
  },
}

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'public'),
  webpack(config, options) {
    return config
  }
})