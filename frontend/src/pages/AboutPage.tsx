import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Users, MapPin, Shield } from 'lucide-react';

export function AboutPage() {
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
          About SwiftPlay
        </h1>
        <p className="text-slate-400 mb-10">
          Redefining the way you book and play sports.
        </p>

        {/* Mission */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            SwiftPlay Turf is a next-generation platform for booking sports turfs and renting equipment with ease.
            Built in Pune, India, we combine smart IoT technology with a seamless booking experience so you can focus
            on what matters most — playing your best game.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
              <Zap size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Instant Booking</h3>
            <p className="text-xs text-slate-400">Book your favourite turf in seconds with real-time availability and instant confirmation.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
              <Users size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">For Every Player</h3>
            <p className="text-xs text-slate-400">Whether you're a casual player or a serious athlete, we have turfs and gear for everyone.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
              <MapPin size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Pune Based</h3>
            <p className="text-xs text-slate-400">Locally operated with deep knowledge of the sports community in Pune, Maharashtra.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg hover:border-cyan-500/40 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-3">
              <Shield size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Secure Payments</h3>
            <p className="text-xs text-slate-400">All transactions are powered by Razorpay — India's most trusted payment gateway.</p>
          </div>
        </div>

        {/* Story */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-lg">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Why SwiftPlay?</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Finding and booking a sports turf shouldn't be complicated. We built SwiftPlay to eliminate the hassle of
            phone calls, waiting, and uncertainty. With our platform, you get transparent pricing, real-time slot availability,
            IoT-powered smart equipment rentals, and secure online payments — all in one place.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Our goal is to make sports more accessible to everyone in Pune and beyond. Whether it's cricket, football,
            badminton, or any other sport — SwiftPlay has you covered.
          </p>
        </div>
      </div>
    </div>
  );
}
