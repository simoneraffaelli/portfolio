import { execSync } from 'child_process'

let commitSha = process.env.SOURCE_COMMIT || 'unknown'
try {
  commitSha = execSync('git rev-parse --short HEAD').toString().trim()
} catch {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
}

export default nextConfig
