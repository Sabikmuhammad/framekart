import { FileText, Scale, Shield, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Last updated: December 11, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 lg:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agreement to Terms</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              By accessing or using FrameKart’s official website (framekart.co.in) and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          {/* Use of Service */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Use of Service</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>Use the service in any way that violates applicable laws or regulations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>Attempt to gain unauthorized access to any part of the service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>Upload content that infringes on intellectual property rights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>Transmit any viruses, malware, or harmful code</span>
              </li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Account Registration</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              To access certain features, you may need to create an account. You are responsible for:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>Maintaining the confidentiality of your account credentials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>All activities that occur under your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <span>Notifying us immediately of any unauthorized access</span>
              </li>
            </ul>
          </section>

          {/* Orders and Payments */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Orders and Payments</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              All orders are subject to acceptance and availability. We reserve the right to refuse any order. Prices are subject to change without notice. Payment must be received in full before order processing. This includes custom-made frames, personalized photo frames, and digital uploads.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Intellectual Property</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of FrameKart and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          {/* Custom Frame Content */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User-Uploaded Content</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              For custom frame orders, you grant FrameKart a license to use, reproduce, and print the images you upload solely for the purpose of fulfilling your order. You represent that you own or have permission to use all content you upload. Uploaded files are deleted automatically after order completion for customer privacy.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  <strong>Important:</strong> You are solely responsible for ensuring you have the legal right to use any images uploaded for custom frames.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              FrameKart shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid for the product or service in question.
            </p>
          </section>

          {/* Warranty Disclaimer */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Warranty Disclaimer</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Products are provided &quot;as is&quot; without warranty of any kind. We make reasonable efforts to ensure product quality but cannot guarantee perfection in all cases.
            </p>
          </section>

          {/* Governing Law */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Governing Law</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Kerala, India.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@framekart.co.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                legal@framekart.co.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
