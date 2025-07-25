import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">Personal Information:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Name and email address (via Google Sign-In)</li>
                    <li>Profile picture (if provided via Google)</li>
                    <li>Payment information (processed securely by Razorpay)</li>
                    <li>Phone number (if provided for account verification)</li>
                  </ul>

                  <h3 className="font-medium">Usage Information:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Quiz performance and scores</li>
                    <li>Time spent on quizzes</li>
                    <li>Login frequency and patterns</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>To provide and maintain our quiz platform services</li>
                  <li>To process payments and manage your account</li>
                  <li>To track your quiz performance and rankings</li>
                  <li>To send important updates about your account</li>
                  <li>To improve our platform and user experience</li>
                  <li>To prevent fraud and ensure platform security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
                <p className="text-gray-700 mb-3">
                  We do not sell, trade, or rent your personal information. We may share information only in these
                  circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With service providers (like Razorpay for payments) under strict confidentiality agreements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>We use industry-standard encryption to protect your data</li>
                  <li>Payment information is processed securely by Razorpay (PCI DSS compliant)</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Cookies and Tracking</h2>
                <p className="text-gray-700">
                  We use cookies and similar technologies to enhance your experience, remember your preferences, and
                  analyze platform usage. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Account information is retained while your account is active</li>
                  <li>Quiz performance data is kept for ranking and statistical purposes</li>
                  <li>Payment records are retained as required by law</li>
                  <li>You can request account deletion at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your account</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability (export your data)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Third-Party Services</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">Google Sign-In:</h3>
                  <p className="text-gray-700">
                    We use Google's authentication service. Please review Google's Privacy Policy for their data
                    practices.
                  </p>

                  <h3 className="font-medium">Razorpay:</h3>
                  <p className="text-gray-700">
                    Payment processing is handled by Razorpay. They have their own privacy policy governing payment
                    data.
                  </p>

                  <h3 className="font-medium">Firebase:</h3>
                  <p className="text-gray-700">
                    We use Google Firebase for data storage and analytics, subject to Google's privacy policies.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our platform is not intended for children under 13. We do not knowingly collect personal information
                  from children under 13. If you believe we have collected such information, please contact us
                  immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. International Users</h2>
                <p className="text-gray-700">
                  If you are accessing our platform from outside India, please note that your information may be
                  transferred to and processed in India, where our servers are located.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Changes to Privacy Policy</h2>
                <p className="text-gray-700">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the
                  new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at:
                  <br />
                  Email: privacy@proveyourmind.com
                  <br />
                  Phone: +91-XXXXXXXXXX
                  <br />
                  Address: [Your Business Address]
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
