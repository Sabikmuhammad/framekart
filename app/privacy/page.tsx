import { Lock, Eye, Database, UserCheck, Shield, Cookie } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-6">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your privacy is important to us
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last updated: December 11, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 lg:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Commitment</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              At FrameKart, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. This includes our premium wall frames, custom photo frames, and personalized artwork services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We collect information that you provide directly to us:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Name, email address, phone number, and shipping address</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Payment information (processed securely through Cashfree)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Account credentials and profile information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Images, photos, and digital artwork uploaded for custom-made frame orders.</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Automatically Collected Information</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Device information, IP address, and browser type</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Usage data and interaction with our website</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Cookies and similar tracking technologies</span>
              </li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Processing and fulfilling your orders</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Providing customer support and responding to inquiries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Improving our website and services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Sending promotional communications (with your consent)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Detecting and preventing fraud or security issues</span>
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information Sharing</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Service Providers:</strong> Third parties who help us operate our business (payment processors, shipping partners, cloud storage)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Legal Requirements:</strong> When required by law or to protect our rights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cookies and Tracking</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features.
            </p>
          </section>

          {/* Data Security */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Security</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Payment Security:</strong> We use Cashfree for secure payment processing. Your payment information is encrypted and never stored on our servers.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Access and review your personal information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Request correction of inaccurate information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Request deletion of your information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>Data portability</span>
              </li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at{" "}
              <a href="mailto:privacy@framekart.co.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                privacy@framekart.co.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
