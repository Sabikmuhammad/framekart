import { RotateCcw, Package, Clock, ShieldCheck } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 mb-6">
            <RotateCcw className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Return Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your satisfaction is our priority
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 lg:p-12 space-y-8">
          {/* Return Period */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Return Period</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We offer a <strong className="text-gray-900 dark:text-white">7-day return policy for standard products. Custom frame orders are not eligible for return unless damaged or incorrect.</strong>
            </p>
          </section>

          {/* Eligibility */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Return Eligibility</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              To be eligible for a return, the item must meet the following conditions:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Item must be unused and in the same condition as received</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Original packaging must be intact</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Tags and labels must be attached</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>Proof of purchase (receipt or order confirmation) must be provided</span>
              </li>
            </ul>
          </section>

          {/* Non-Returnable Items */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Non-Returnable Items</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Custom-made & personalized photo frames including uploaded-photo orders</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Sale items:</strong> Items purchased during clearance or special promotions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Damaged items:</strong> Items damaged due to customer mishandling</span>
              </li>
            </ul>
          </section>

          {/* Return Process */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Return Process</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Follow these steps to initiate a return:
            </p>
            <ol className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">1</span>
                <span>Contact our support team at support@framekart.co.in with your order number and issue details (photos required for damaged items).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">2</span>
                <span>Wait for return authorization and instructions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">3</span>
                <span>Pack the item securely in its original packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">4</span>
                <span>Ship the item to the provided address (return shipping costs may apply)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">5</span>
                <span>Once received and inspected, refund will be processed within 5-7 business days</span>
              </li>
            </ol>
          </section>

          {/* Refunds */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Refunds</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Refunds will be issued to the original payment method within 5-7 business days after we receive and inspect the returned item.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <p className="text-sm text-green-900 dark:text-green-100">
                <strong>Note:</strong> Shipping charges are non-refundable unless the mistake is from our side or the product arrives damaged.
              </p>
            </div>
          </section>

          {/* Exchanges */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Exchanges</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We accept exchanges for the same item in a different size or color, subject to availability. Exchanges are available only for standard frames, not custom-made photo frames. Exchange shipping costs are the responsibility of the customer unless the exchange is due to our error.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions?</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have any questions about returns, please contact us at{" "}
              <a href="mailto:support@framekart.co.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@framekart.co.in
              </a>{" "}
              or call{" "}
              <a href="tel:+918590025643" className="text-blue-600 dark:text-blue-400 hover:underline">
                +91 85900 25643
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
