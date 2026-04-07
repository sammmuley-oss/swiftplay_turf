import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';

export function ContactPage() {
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
        <h1 className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
          Contact Us
        </h1>
        <p className="text-slate-400 mb-10">
          Have questions or need help with your booking? We're here to assist you.
        </p>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg flex items-start gap-4 hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0">
              <Mail size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Email</h3>
              <a
                href="mailto:support@swiftplay.com"
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                support@swiftplay.com
              </a>
              <p className="text-xs text-slate-500 mt-1">We respond within 24 hours</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg flex items-start gap-4 hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0">
              <Phone size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Phone</h3>
              <a
                href="tel:+919881925252"
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                +91 9881925252
              </a>
              <p className="text-xs text-slate-500 mt-1">Mon–Sat, 9 AM – 9 PM</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg flex items-start gap-4 hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0">
              <MapPin size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Location</h3>
              <p className="text-sm text-slate-300">Pune, Maharashtra, India</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg flex items-start gap-4 hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0">
              <Clock size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Business Hours</h3>
              <p className="text-sm text-slate-300">Mon – Sun: 6 AM – 11 PM</p>
              <p className="text-xs text-slate-500 mt-1">Turf availability varies</p>
            </div>
          </div>
        </div>

        {/* Additional */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Get in Touch</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Whether you need help with a booking, have feedback about our services, or want to partner with SwiftPlay Turf,
            feel free to reach out. Our support team is dedicated to ensuring you have the best experience on and off the turf.
          </p>
          <p className="text-slate-400 text-sm mt-4">
            For urgent booking issues, please call us directly at{' '}
            <a href="tel:+919881925252" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              +91 9881925252
            </a>. For general inquiries, drop us an email and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
