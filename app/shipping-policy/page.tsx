import { Package, Truck, Clock, MapPin } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Shipping Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Premium wall frames, custom frames, delivered India-wide with care and speed
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 lg:p-12 space-y-8">
          {/* Shipping Methods */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Methods</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We offer multiple shipping options to ensure your premium frames reach you safely and promptly:
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Standard Delivery (4-6 business days):</strong> Free for orders above ₹1,499</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Express Delivery (2-3 business days):</strong> ₹99 flat rate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span><strong className="text-gray-900 dark:text-white">Priority Delivery:</strong> Same-day in select Kerala &amp; Karnataka cities for ₹199</span>
              </li>
            </ul>
          </section>

          {/* Processing Time */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Processing Time</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Custom frames and photo uploads require an additional 2-4 business days of processing due to personalization.
            </p>
          </section>

          {/* Delivery Areas */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Areas</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We offer PAN India delivery to all major cities and towns. Please note that a surcharge may apply for delivery to remote areas.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Delivery times are estimates and may vary based on your location and external factors.
              </p>
            </div>
          </section>

          {/* Tracking */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Tracking</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Once your order is shipped, you will receive a tracking number via email. You can track your order status in real-time through your account dashboard or the courier partner&apos;s website.
            </p>
          </section>

          {/* Packaging */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Packaging</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              All premium frames are carefully packed using triple-layer bubble wrap and a water-resistant outer layer, with reinforced cardboard corners to ensure they arrive in perfect condition. We take extra care with glass and delicate items.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions?</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have any questions about shipping, please contact us at{" "}
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
