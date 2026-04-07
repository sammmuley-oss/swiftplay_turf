import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPolicyPage() {
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
            <Shield size={24} className="text-cyan-400" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Privacy Policy
          </h1>
        </div>

        <p className="text-slate-400 text-sm mb-10">
          Last updated: April 7, 2026
        </p>

        {/* Content */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">1. Introduction</h2>
            <p>
              SwiftPlay Turf ("we", "our", or "us") operates the SwiftPlay platform for booking sports turfs and rental equipment.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website
              and services. By accessing or using SwiftPlay, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-slate-200">Personal Information:</strong> Name, email address, phone number, and billing address provided during registration or booking.</li>
              <li><strong className="text-slate-200">Payment Information:</strong> Payment details processed securely through our payment gateway partner, Razorpay. We do not store your card or UPI details on our servers.</li>
              <li><strong className="text-slate-200">Usage Data:</strong> Browser type, IP address, device information, pages visited, and interaction data collected automatically.</li>
              <li><strong className="text-slate-200">Booking Data:</strong> Turf selection, booking date/time, session history, and equipment rental records.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>To process and manage your turf bookings and equipment rentals.</li>
              <li>To process payments securely via Razorpay payment gateway.</li>
              <li>To communicate booking confirmations, cancellations, and updates.</li>
              <li>To improve our platform, services, and user experience.</li>
              <li>To comply with legal obligations and resolve disputes.</li>
              <li>To send promotional offers and updates (only with your consent).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">4. Data Sharing & Disclosure</h2>
            <p className="mb-3">We do not sell your personal data. We may share your information with:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-slate-200">Payment Processors:</strong> Razorpay, for secure payment processing.</li>
              <li><strong className="text-slate-200">Service Providers:</strong> Third-party vendors who assist in operating our platform (hosting, analytics).</li>
              <li><strong className="text-slate-200">Legal Authorities:</strong> When required by law, regulation, or court order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures including SSL encryption, secure payment processing, and access controls
              to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">6. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content.
              You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Access, update, or delete your personal information.</li>
              <li>Opt out of marketing communications at any time.</li>
              <li>Request a copy of your data held by us.</li>
              <li>Withdraw consent for data processing where applicable.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:support@swiftplay.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                support@swiftplay.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of
              these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
              "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
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
