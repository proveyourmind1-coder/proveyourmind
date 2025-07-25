"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Trophy, Zap, Users, ArrowRight, Play, Gift, DollarSign, Lightbulb } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { GuestQuizModal } from "@/components/guest-quiz-modal"
import { LoginModal } from "@/components/login-modal"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter

export default function HomePage() {
  const { user, loginWithGoogle } = useAuth()
  const [showGuestQuiz, setShowGuestQuiz] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter() // Initialize useRouter

  const features = [
    {
      icon: Brain,
      title: "Smart Quizzes",
      description: "AI-powered questions that adapt to your knowledge level",
    },
    {
      icon: Trophy,
      title: "Real Rewards",
      description: "Win actual money for your intelligence and knowledge",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate feedback and climb the leaderboard",
    },
    {
      icon: Users,
      title: "Compete Live",
      description: "Challenge friends and players across India",
    },
  ]

  const stats = [
    { label: "Active Players", value: "50K+" },
    { label: "Quizzes Played", value: "2M+" },
    { label: "Rewards Paid", value: "₹10L+" },
    { label: "Success Rate", value: "98%" },
  ]

  const handleStartEarningClick = () => {
    if (user) {
      router.push("/dashboard") // Redirect to dashboard if logged in
    } else {
      setShowLogin(true) // Show login modal if not logged in
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-yellow-400" />
          <span className="text-2xl font-bold text-white">ProveYourMind</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-purple-900 bg-transparent"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setShowLogin(true)}>
                Login
              </Button>
              <Button className="bg-yellow-400 text-purple-900 hover:bg-yellow-300" onClick={() => setShowLogin(true)}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Badge className="mb-4 bg-yellow-400 text-purple-900 hover:bg-yellow-300">🔥 India's #1 Quiz Platform</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Reward Your
            <span className="text-yellow-400"> Intelligence</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Play quizzes, compete with millions, and earn real money. The smarter you are, the more you earn!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 text-lg px-8 py-4"
              onClick={() => setShowGuestQuiz(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Try Free Quiz
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-900 text-lg px-8 py-4 bg-transparent"
              onClick={handleStartEarningClick} // Use the new handler
            >
              <Gift className="mr-2 h-5 w-5" />
              Start Earning
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How to Play Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How to Play & Earn</h2>
          <p className="text-gray-300 text-lg">Simple steps to challenge your mind and get rewarded</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <Play className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <CardTitle>1. Choose Your Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Select from various difficulty levels (Easy, Medium, Hard, Expert). Free quizzes are available for
                  practice, while paid quizzes offer real cash rewards.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <Lightbulb className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <CardTitle>2. Answer Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Test your knowledge with our AI-powered questions. Answer correctly within the time limit to earn
                  points.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <CardTitle>3. Earn Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Your performance earns you points. These points determine your leaderboard rank and can be converted
                  into real money for withdrawal!
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose ProveYourMind?</h2>
          <p className="text-gray-300 text-lg">The perfect blend of learning and earning</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 rounded-3xl p-12 backdrop-blur-sm"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Prove Your Mind?</h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of players earning real money through knowledge</p>
          <Button
            size="lg"
            className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 text-lg px-12 py-4"
            onClick={handleStartEarningClick} // Use the new handler
          >
            Start Playing Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-yellow-400" />
                <span className="text-xl font-bold text-white">ProveYourMind</span>
              </div>
              <p className="text-gray-400 text-sm">
                India's most addictive quiz platform. Play, learn, and earn real money!
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-white">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/quiz/easy" className="hover:text-white">
                    Free Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="mailto:support@proveyourmind.com" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="tel:+91XXXXXXXXXX" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 ProveYourMind. All rights reserved. | Made with ❤️ in India</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GuestQuizModal open={showGuestQuiz} onOpenChange={setShowGuestQuiz} />
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  )
}
