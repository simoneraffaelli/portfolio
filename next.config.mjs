import { execSync } from 'child_process'

const commitSha = execSync('git rev-parse --short HEAD').toString().trim()

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
