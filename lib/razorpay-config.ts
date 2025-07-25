// Razorpay configuration utilities
export const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  return {
    keyId: keyId || "",
    keySecret: keySecret || "",
    isConfigured: !!(keyId && keySecret),
  }
}

export const isRazorpayConfigured = () => {
  const config = getRazorpayConfig()
  return config.isConfigured
}