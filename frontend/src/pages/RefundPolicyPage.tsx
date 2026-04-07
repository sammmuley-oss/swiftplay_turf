import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <RotateCcw size={24} className="text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Refund &amp; Cancellation Policy
          </h1>
        </div>

        <p className="text-slate-400 text-sm mb-10">
          Last updated: April 7, 2026
        </p>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">1. Overview</h2>
            <p>
              At SwiftPlay Turf, we strive to provide you with the best sports turf booking experience. We understand that plans
              can change, and this policy outlines the terms for cancellations and refunds for bookings made through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">2. Cancellation Policy</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <h3 className="text-sm font-semibold text-cyan-400 mb-2">More than 24 hours before booking</h3>
                <p className="text-sm">Full refund will be processed. No cancellation charges apply.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">12 to 24 hours before booking</h3>
                <p className="text-sm">50% refund of the booking amount. 50% cancellation fee will apply.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Less than 12 hours before booking</h3>
                <p className="text-sm">No refund will be provided. The full booking amount is non-refundable.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <h3 className="text-sm font-semibold text-red-400 mb-2">No-show</h3>
                <p className="text-sm">If you do not show up for your booking, no refund will be provided.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">3. Equipment Rental Cancellation</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Equipment rental cancellations follow the same timeline as turf bookings.</li>
              <li>If equipment is rented as part of a turf booking, the entire booking cancellation policy applies.</li>
              <li>Standalone equipment rentals can be cancelled with a full refund if cancelled before the rental period begins.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">4. Refund Process</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Approved refunds will be processed within <strong className="text-slate-200">5–7 business days</strong> from the date of cancellation.</li>
              <li>Refunds will be credited to the original payment method used during booking.</li>
              <li>For UPI payments, refunds will be credited to the linked bank account.</li>
              <li>For card payments, refunds may take an additional 2-3 business days to reflect in your statement.</li>
              <li>All refunds are processed securely through Razorpay payment gateway.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">5. Cancellation by SwiftPlay</h2>
            <p className="mb-3">
              In rare circumstances, SwiftPlay Turf may need to cancel a booking due to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Unforeseen maintenance or facility issues.</li>
              <li>Adverse weather conditions (for outdoor turfs).</li>
              <li>Force majeure events (natural disasters, government restrictions, etc.).</li>
            </ul>
            <p className="mt-3">
              In such cases, a <strong className="text-slate-200">full refund</strong> will be provided, or you may choose to reschedule your booking at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">6. How to Cancel a Booking</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Log in to your SwiftPlay account.</li>
              <li>Navigate to your active bookings/rentals.</li>
              <li>Select the booking you wish to cancel and click "Cancel Booking".</li>
              <li>Alternatively, contact us directly at <a href="mailto:support@swiftplay.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">support@swiftplay.com</a> or call <a href="tel:+919881925252" className="text-cyan-400 hover:text-cyan-300 transition-colors">+91 9881925252</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">7. Non-Refundable Situations</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Bookings cancelled less than 12 hours before the scheduled time.</li>
              <li>No-shows without prior cancellation.</li>
              <li>Damage to or loss of rented equipment.</li>
              <li>Partial utilization of a booking (leaving early does not qualify for a partial refund).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">8. Disputes</h2>
            <p>
              If you believe a refund has been incorrectly processed or have a dispute regarding cancellation charges,
              please contact our support team. We will review your case and respond within 48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">9. Contact Us</h2>
            <p>
              For any questions or concerns regarding refunds and cancellations:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
              <p><strong className="text-slate-200">SwiftPlay Turf</strong></p>
              <p>Email: <a href="mailto:support@swiftplay.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">support@swiftplay.com</a></p>
              <p>Phone: <a href="tel:+919881925252" className="text-cyan-400 hover:text-cyan-300 transition-colors">+91 9881925252</a></p>
              <p>Location: Pune, Maharashtra, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
