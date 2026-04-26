import { Link } from 'react-router-dom';
import { Zap, Users, Shield, MapPin, Mail, Phone } from 'lucide-react';

export function HomeScreen() {
  return (
    <>
      {/* Hero Section — UNCHANGED */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0c]">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          PLAY HARDER. RENT SMARTER.
        </h1>
        <p className="text-slate-400 text-lg mb-10">TURFGEAR – Smart IoT Sports Rental</p>
        <div className="flex gap-4">
          <Link to="/catalog" className="kiosk-button">Get Started</Link>
          <Link to="/catalog" className="px-6 py-3 rounded-full border border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors">
            Browse Equipment
          </Link>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="bg-[#0a0a0c] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
            About TurfGear
          </h2>
          <p className="text-slate-400 text-center text-sm mb-10 max-w-xl mx-auto">
            A next-generation platform for booking sports turfs and renting equipment with ease, built in Pune, India.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
                <Zap size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Instant Booking</h3>
              <p className="text-xs text-slate-400">Book your favourite turf in seconds with real-time availability.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
                <Users size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">For Every Player</h3>
              <p className="text-xs text-slate-400">Casual or competitive — we have turfs and gear for everyone.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
                <Shield size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Secure Payments</h3>
              <p className="text-xs text-slate-400">All transactions powered by Razorpay — India's trusted gateway.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
                <MapPin size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Pune Based</h3>
              <p className="text-xs text-slate-400">Locally operated with deep roots in the Pune sports community.</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/about"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Learn more about us →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#08080a] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-center text-sm mb-10 max-w-md mx-auto">
            Questions about bookings, partnerships, or anything else? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <a
              href="mailto:support@turfgear.com"
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg flex flex-col items-center text-center hover:border-cyan-500/40 transition-colors"
            >
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-3">
                <Mail size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Email</h3>
              <p className="text-xs text-cyan-400">support@turfgear.com</p>
            </a>

            <a
              href="tel:+919881925252"
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg flex flex-col items-center text-center hover:border-cyan-500/40 transition-colors"
            >
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-3">
                <Phone size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Phone</h3>
              <p className="text-xs text-cyan-400">+91 9881925252</p>
            </a>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg flex flex-col items-center text-center hover:border-cyan-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-3">
                <MapPin size={20} className="text-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Location</h3>
              <p className="text-xs text-slate-400">Pune, Maharashtra, India</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Visit full contact page →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#0a0a0c] py-6 px-6 border-t border-slate-800/40">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield size={14} className="text-cyan-500/50" />
          <span>Secure bookings powered by trusted payment gateway · SSL encrypted · Razorpay verified</span>
        </div>
      </section>
    </>
  );
}
