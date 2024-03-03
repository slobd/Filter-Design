// /** @type {import('next').NextConfig} */
require('dotenv').config();
const withReactSvg = require('next-react-svg')
const path = require('path')

// const withImages = require('next-images')
// module.exports = withImages()

// module.exports = {
//   // reactStrictMode: true,
//   images: {
//     formats: ['image/avif', 'image/webp'],
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '8000',
//         pathname: '/uploads/**',
//       },
//     ],
//   },
//   // experimental: {
//   //   images: {
//   //       allowFutureImage: true
//   //   }
//   // },
//   // images: {
//   //   domains: ['localhost:8000'],
//   // },
// }

module.exports = withReactSvg({
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
  }
}

module.exports = withPlugins([[withImages]], nextConfig)
