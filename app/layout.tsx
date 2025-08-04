// app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { Chatbot } from "@/components/chatbot" // ✅ Import Chatbot

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProveYourMind - Reward Intelligence, Gamify Knowledge",
  description: "India's most addictive quiz platform. Play, learn, and earn real money!",
  keywords: "quiz, money, rewards, learning, competition, india",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Razorpay script for client-side checkout */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster />
            <Chatbot />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
