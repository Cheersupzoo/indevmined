/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: (config) => {
    // Ignore node-specific modules when bundling for the browser
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node$': false
    }

    return config
  }
}

export default nextConfig
