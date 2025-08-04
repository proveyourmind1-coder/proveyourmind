/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ NO export mode — Razorpay needs server runtime
  // output: "export", // ❌ Remove or comment this if present

  // ✅ Fixed: serverActions should be an object, not boolean
  experimental: {
    serverActions: {},
  },
}

export default nextConfig
