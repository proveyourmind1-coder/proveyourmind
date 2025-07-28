/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ NO export mode — Razorpay needs server runtime
  // output: "export", // ❌ Remove or comment this if present

  // ✅ Optional: Enable server actions (if needed)
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
