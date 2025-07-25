import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="mb-4 bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Terms and Conditions</h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing and using ProveYourMind ("the Platform"), you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Platform Description</h2>
                <p className="text-gray-700">
                  ProveYourMind is an online quiz platform that allows users to participate in knowledge-based quizzes
                  and competitions. Users can earn real money rewards based on their performance in paid quizzes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Eligibility</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Users must be at least 18 years old to participate in paid quizzes</li>
                  <li>Users must provide accurate and complete registration information</li>
                  <li>Users are responsible for maintaining the confidentiality of their account</li>
                  <li>One account per person is allowed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Payment Terms</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Entry fees for paid quizzes are clearly displayed before participation</li>
                  <li>All payments are processed securely through Razorpay</li>
                  <li>Refunds are not available once a quiz has been started</li>
                  <li>Winnings will be credited to your account within 24-48 hours</li>
                  <li>Minimum withdrawal amount is ₹100</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Quiz Rules</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Each quiz has a specified time limit that must be adhered to</li>
                  <li>Questions must be answered individually without external assistance</li>
                  <li>Use of unfair means or cheating will result in immediate disqualification</li>
                  <li>Quiz results are final and cannot be disputed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Prohibited Activities</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Creating multiple accounts</li>
                  <li>Using automated tools or bots</li>
                  <li>Sharing account credentials</li>
                  <li>Attempting to manipulate quiz results</li>
                  <li>Engaging in fraudulent activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
                <p className="text-gray-700">
                  All content on ProveYourMind, including questions, answers, explanations, and platform design, is
                  protected by intellectual property rights. Users may not reproduce, distribute, or create derivative
                  works without explicit permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
                <p className="text-gray-700">
                  ProveYourMind shall not be liable for any indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
                  losses.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Account Termination</h2>
                <p className="text-gray-700">
                  We reserve the right to terminate or suspend accounts that violate these terms and conditions. Users
                  may also delete their accounts at any time through the platform settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
                <p className="text-gray-700">
                  ProveYourMind reserves the right to modify these terms at any time. Users will be notified of
                  significant changes via email or platform notifications.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms and Conditions, please contact us at:
                  <br />
                  Email: support@proveyourmind.com
                  <br />
                  Phone: +91-XXXXXXXXXX
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
