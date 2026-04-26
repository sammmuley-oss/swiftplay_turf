import { useState, useRef, useEffect } from 'react';
import { API_URL } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [_verificationToken, setVerificationToken] = useState('');
  const navigate = useNavigate();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInitiate2fa = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.includes('@')) return toast.error('Enter a valid email address');

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/initiate-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setStep('otp');
        setResendTimer(60);
        
        // Store verification token for stateless OTP verification
        if (data.verificationToken) {
          setVerificationToken(data.verificationToken);
        }
        
        toast.success(data.message || 'Verification code sent!');
      } else {
        toast.error(data.error || 'Request failed');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return toast.error('Enter 6-digit code');

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier,
          otp: otpString,
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Successfully logged in!');
        navigate('/catalog');
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0c] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-panel max-w-md w-full p-10 relative z-10"
      >
        <AnimatePresence mode="wait">
          {step === 'credentials' ? (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">TurfGear</h1>
              <p className="text-slate-400 text-sm mb-8 text-center uppercase tracking-widest">Email OTP Login</p>



              <form onSubmit={handleInitiate2fa} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all"
                    required
                  />
                </div>
                
                  <button
                    type="submit"
                    disabled={loading}
                    className="kiosk-button w-full mt-6 flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-slate-900/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send OTP Code</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a13.916 13.916 0 003.61-3.612m-3.32 5.01A8.959 8.959 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8a8.959 8.959 0 01-2.247 5.97m-3.32-5.01a13.916 13.916 0 01-3.61 3.612m3.61-3.612L12 11" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">Enter Verification Code</h2>
                <p className="text-slate-400 text-sm mt-1">Sent to {identifier}</p>
              </div>

              <form onSubmit={handleVerify2fa} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-slate-900/50 border border-slate-700/50 text-cyan-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all"
                    />
                  ))}
                </div>
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="kiosk-button w-full shadow-cyan-500/30 font-bold uppercase tracking-wider"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
                  </button>
                  
                  <div className="text-center pt-2">
                    {resendTimer > 0 ? (
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Resend OTP in {resendTimer}s</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleInitiate2fa()}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest transition-colors"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); }}
                    className="w-full text-slate-500 hover:text-slate-300 text-xs uppercase tracking-widest transition-colors py-2 mt-4"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <Link to="/" className="block mt-8 text-center text-slate-500 hover:text-cyan-400 text-xs uppercase tracking-widest transition-colors">Back to Home</Link>
      </motion.div>
    </div>
  );
}
