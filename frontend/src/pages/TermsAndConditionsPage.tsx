import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export function TermsAndConditionsPage() {
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
            <FileText size={24} className="text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Terms &amp; Conditions
          </h1>
        </div>

        <p className="text-slate-400 text-sm mb-10">
          Last updated: April 7, 2026
        </p>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the TurfGear platform ("Platform"), you accept and agree to be bound by these Terms and
              Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all users,
              visitors, and others who access the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">2. Services Offered</h2>
            <p>
              TurfGear provides an online platform for booking sports turfs and renting sports equipment. Our services include
              turf availability browsing, online booking, secure payment processing, and equipment rental management through IoT-enabled
              smart systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">3. User Registration</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Users must provide accurate and complete information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must be at least 18 years old or have parental consent to use our services.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">4. Booking &amp; Payment</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>All bookings are subject to availability and confirmation.</li>
              <li>Payments are processed securely through Razorpay payment gateway.</li>
              <li>Prices displayed on the Platform are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
              <li>A booking is confirmed only after successful payment processing.</li>
              <li>You agree to pay the full amount for all bookings made through your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">5. Cancellation &amp; Refunds</h2>
            <p>
              For detailed information on our cancellation and refund policies, please refer to our{' '}
              <Link to="/refund-policy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Refund &amp; Cancellation Policy
              </Link> page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">6. Equipment Rental Terms</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Rented equipment must be returned in the same condition as received.</li>
              <li>Users are responsible for any damage, loss, or theft of rented equipment during the rental period.</li>
              <li>Late returns may incur additional charges as specified at the time of rental.</li>
              <li>Equipment must be used only for its intended purpose and within the booked turf premises.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">7. User Conduct</h2>
            <p className="mb-3">Users agree to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Use the Platform only for lawful purposes.</li>
              <li>Not engage in any activity that disrupts or interferes with the Platform.</li>
              <li>Follow all turf facility rules and guidelines during their booked sessions.</li>
              <li>Maintain respectful behavior towards other users, staff, and property.</li>
              <li>Not attempt to gain unauthorized access to any part of the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">8. Intellectual Property</h2>
            <p>
              All content on the TurfGear platform, including but not limited to logos, text, graphics, images, and software,
              is the property of TurfGear and is protected by applicable intellectual property laws. You may not reproduce,
              distribute, or create derivative works without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">9. Limitation of Liability</h2>
            <p>
              TurfGear shall not be liable for any indirect, incidental, special, or consequential damages arising from
              the use of our Platform or services. Our total liability shall not exceed the amount paid by you for the specific
              booking or service in question. We are not responsible for injuries sustained during sports activities on booked turfs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">10. Disclaimer</h2>
            <p>
              The Platform and services are provided on an "as-is" and "as-available" basis. We make no warranties, express or implied,
              regarding the availability, reliability, or accuracy of our services. We do not guarantee uninterrupted access to the
              Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from
              these terms shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon
              posting on this page. Continued use of the Platform after changes constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">13. Contact Us</h2>
            <p>
              If you have any questions regarding these Terms and Conditions, please contact us:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
              <p><strong className="text-slate-200">TurfGear</strong></p>
              <p>Email: <a href="mailto:support@turfgear.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">support@turfgear.com</a></p>
              <p>Phone: <a href="tel:+919881925252" className="text-cyan-400 hover:text-cyan-300 transition-colors">+91 9881925252</a></p>
              <p>Location: Pune, Maharashtra, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
