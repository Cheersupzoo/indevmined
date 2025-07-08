import { execSync } from 'child_process'
import path from 'path'

function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch (error) {
    console.warn('Could not get git commit hash, using fallback revision')
    return 'dev-build-' + Date.now()
  }
}

const gitCommitHash = getGitCommitHash()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  generateBuildId: () => gitCommitHash,
  webpack: (config, { webpack, isServer, buildId }) => {
    // Ignore node-specific modules when bundling for the browser
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node$': false,
    }

    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve('node_modules/yjs')

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_BUILD_ID': JSON.stringify(buildId), // Need to stringtify because webpack inject env as exact value with out double quote causing Error Identifier directly after number
        })
      )
    }

    return config
  },
}

export default nextConfig
