import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#070709] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
              TURFGEAR
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Smart IoT Sports Rental platform. Book turfs, rent equipment, and play your best game — all in one place.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield size={14} className="text-cyan-500/60" />
              <span>Secure payments powered by Razorpay</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  Browse Equipment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-cyan-500/60 shrink-0" />
                <a
                  href="mailto:support@turfgear.com"
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  support@turfgear.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-cyan-500/60 shrink-0" />
                <a
                  href="tel:+919881925252"
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  +91 9881925252
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-cyan-500/60 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400">
                  Pune, Maharashtra, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TurfGear. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <Shield size={12} />
            Secure bookings powered by trusted payment gateway
          </p>
        </div>
      </div>
    </footer>
  );
}
