import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Clock, 
  Wallet, 
  X, 
  Plus, 
  Minus, 
  ChevronRight,
  CheckCircle2,
  QrCode,
  Timer,
  AlertTriangle,
  Home,
  XCircle,
  PlusCircle
} from 'lucide-react';

import toast from 'react-hot-toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Equipment {
  _id: string;
  name: string;
  sport: string;
  pricePerHour: number;
  image: string;
  stock: number;
  status: string;
  depositAmount: number;
  lockerId: string;
}

interface CartItem extends Equipment {
  quantity: number;
}

const DURATIONS = [
  { label: '30 Min', value: 0.5 },
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
  { label: '3 Hours', value: 3 },
];

const SPORTS = [
  { name: 'All', icon: '🎯' },
  { name: 'Cricket', icon: '🏏' },
  { name: 'Football', icon: '⚽' },
  { name: 'Badminton', icon: '🏸' },
];

export function CatalogScreen() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [duration, setDuration] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI'>('UPI');
  const [_loading, setLoading] = useState(true);
  const [_orderData, setOrderData] = useState<any>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extensionHours, setExtensionHours] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipment();
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (activeSession && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession]);

  // Redirect to home after timer expires
  useEffect(() => {
    if (timerExpired) {
      const redirectTimeout = setTimeout(() => {
        navigate('/');
      }, 6000);
      return () => clearTimeout(redirectTimeout);
    }
  }, [timerExpired, navigate]);

  const startSession = () => {
    setActiveSession({
      rentalId: successData.rentalId,
      equipmentList: successData.equipmentList,
      duration: successData.duration,
      totalAmount: successData.totalAmount,
    });
    setTimeLeft(successData.duration * 60 * 60); // convert hours to seconds
    setSuccessData(null);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerProgress = () => {
    if (!activeSession) return 0;
    const totalSeconds = activeSession.duration * 60 * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const fetchEquipment = async () => {
    try {
      console.log("API URL:", API_URL);
      const resp = await fetch(`${API_URL}/api/equipment`);
      
      const data = await resp.json();
      if (resp.ok) {
        setEquipment(data);
      } else {
        toast.error(data.error || 'Failed to load equipment');
      }
    } catch (err) {
      toast.error('Connection error: Failed to reach catalog API');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: Equipment) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          toast.error('Max availability reached');
          return prev;
        }
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        if (newQty > item.stock) {
          toast.error('Limit reached');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const calculateTotal = () => {
    const itemsTotal = cart.reduce((sum, item) => sum + (item.pricePerHour * item.quantity), 0);
    const depositTotal = cart.reduce((sum, item) => sum + (item.depositAmount * item.quantity), 0);
    return (itemsTotal * duration) + depositTotal;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    
    try {
      const resp = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentList: cart.map(i => ({ 
            equipmentId: i._id, 
            name: i.name, 
            quantity: i.quantity,
            pricePerHour: i.pricePerHour,
            depositAmount: i.depositAmount,
            lockerId: i.lockerId
          })),
          duration,
          paymentMethod
        })
      });

      const data = await resp.json();
      if (resp.ok) {
        if (paymentMethod === 'Cash') {
          setSuccessData({
            rentalId: data.rentalId,
            equipmentList: cart,
            duration,
            totalAmount: calculateTotal(),
            message: 'Please pay cash at the kiosk and collect your equipment.'
          });
          setShowPaymentModal(false);
          setCart([]);
        } else {
          setOrderData(data);
          openRazorpay(data);
        }
      } else {
        toast.error(data.error || 'Checkout failed');
      }
    } catch (err) {
      toast.error('Connection error: Checkout failed');
    }
  };

  const openRazorpay = (data: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_SQQIbXMMxbWjXh',
      amount: data.amount,
      currency: data.currency,
      name: 'SwiftPlay Sports Vending',
      description: 'Equipment Rental & Deposit',
      order_id: data.orderId,
      handler: async (response: any) => {
        try {
          const verifyResp = await fetch(`${API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              equipmentList: data.equipmentList,
              duration: data.duration,
              totalAmount: data.totalAmount
            })
          });

          const verifyData = await verifyResp.json();
          if (verifyResp.ok) {
            setSuccessData({
              rentalId: verifyData.rentalId,
              equipmentList: cart,
              duration,
              totalAmount: data.totalAmount,
              message: 'You can now collect your equipment from the SwiftPlay kiosk.'
            });
            setShowPaymentModal(false);
            setCart([]);
          } else {
            toast.error(verifyData.message || 'Payment verification failed');
          }
        } catch (err) {
          toast.error('Verification failed');
        }
      },
      prefill: {
        name: 'Player',
        email: 'player@swiftplay.com',
      },
      theme: {
        color: '#22d3ee',
      },
    };
    const rzp = new (window as any).Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      toast.error(response.error.description || 'Payment Failed');
      console.error('Razorpay Error:', response.error);
    });

    rzp.open();
  };

  const filteredItems = filter === 'All' 
    ? equipment 
    : equipment.filter(item => item.sport.toLowerCase() === filter.toLowerCase());

  // ─── ACTIVE SESSION TIMER SCREEN ────────────────────────────────
  if (activeSession) {
    const progress = getTimerProgress();
    const isLowTime = timeLeft <= 300; // last 5 minutes
    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    if (timerExpired) {
      return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-[#16161a] border border-amber-500/30 rounded-3xl p-10 text-center shadow-[0_0_60px_rgba(245,158,11,0.15)]"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <AlertTriangle className="w-12 h-12 text-amber-400" />
            </motion.div>
            <h1 className="text-4xl font-display font-bold text-white mb-3">Time's Up!</h1>
            <p className="text-amber-400 text-lg mb-6">Your turf time is over</p>
            <p className="text-slate-400 mb-4">Please return the equipment to the kiosk.</p>

            <div className="bg-[#1c1c21] rounded-2xl p-5 mb-8 text-left">
              <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-3">Session Summary</h3>
              <ul className="space-y-2 mb-4">
                {activeSession.equipmentList.map((item: any) => (
                  <li key={item._id} className="flex justify-between text-white text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="text-slate-500">₹{item.pricePerHour * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-white">
                <span>Total Paid</span>
                <span className="text-cyan-400 font-display">₹{activeSession.totalAmount}</span>
              </div>
            </div>

            <p className="text-slate-500 text-sm mb-6">Redirecting to home in a few seconds...</p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <Home className="w-5 h-5" /> Go Home Now
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-[#16161a] border border-cyan-500/20 rounded-3xl p-10 text-center shadow-[0_0_60px_rgba(34,211,238,0.08)]"
        >
          {/* Timer Circle */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
              {/* Background circle */}
              <circle
                cx="130" cy="130" r="120"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="130" cy="130" r="120"
                fill="none"
                stroke={isLowTime ? '#f59e0b' : '#22d3ee'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Timer className={`w-8 h-8 mb-2 ${isLowTime ? 'text-amber-400' : 'text-cyan-400'}`} />
              <span className={`text-5xl font-display font-bold tabular-nums ${isLowTime ? 'text-amber-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-slate-500 text-sm mt-2 uppercase tracking-widest">Remaining</span>
            </div>
          </div>

          {/* Pulsing indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-3 h-3 rounded-full ${isLowTime ? 'bg-amber-500' : 'bg-green-500'}`}
            />
            <span className={`text-sm font-bold uppercase tracking-widest ${isLowTime ? 'text-amber-400' : 'text-green-400'}`}>
              {isLowTime ? 'Ending Soon' : 'Session Active'}
            </span>
          </div>

          {/* Equipment Details */}
          <div className="bg-[#1c1c21] rounded-2xl p-5 mb-6 text-left">
            <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Your Equipment
            </h3>
            <ul className="space-y-3">
              {activeSession.equipmentList.map((item: any) => (
                <li key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <span className="text-white font-bold text-sm uppercase italic">{item.name}</span>
                      <span className="text-slate-500 text-xs block">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono text-sm">₹{item.pricePerHour * item.quantity}/hr</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Session Info */}
          <div className="bg-[#1c1c21] rounded-2xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Duration</span>
              <span className="text-white font-bold">{activeSession.duration} {activeSession.duration === 1 ? 'Hour' : activeSession.duration < 1 ? 'Minutes' : 'Hours'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Paid</span>
              <span className="text-cyan-400 font-display font-bold">₹{activeSession.totalAmount}</span>
            </div>
          </div>

          {/* Extend Booking Button */}
          <button
            onClick={() => { setExtensionHours(1); setShowExtendModal(true); }}
            className="w-full py-4 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 mb-3"
          >
            <PlusCircle className="w-5 h-5" /> Extend Booking Time
          </button>

          {/* Cancel Booking Button */}
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="w-full py-4 bg-transparent border border-red-500/30 hover:bg-red-500/10 text-red-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" /> Cancel Booking
          </button>
        </motion.div>

        {/* Cancel Confirmation Modal */}
        <AnimatePresence>
          {showCancelConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCancelConfirm(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-[#16161a] border border-red-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
              >
                <div className="w-16 h-16 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Cancel Booking?</h2>
                <p className="text-slate-400 text-sm mb-8">
                  Are you sure you want to cancel your current session? Please return the equipment to the kiosk.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => {
                      if (timerRef.current) clearInterval(timerRef.current);
                      setActiveSession(null);
                      setTimeLeft(0);
                      setTimerExpired(false);
                      setShowCancelConfirm(false);
                      navigate('/');
                    }}
                    className="flex-1 py-3.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Extend Booking Modal */}
        <AnimatePresence>
          {showExtendModal && (
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowExtendModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-[#16161a] border border-cyan-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(34,211,238,0.1)]"
              >
                <div className="w-16 h-16 bg-cyan-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlusCircle className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Extend Booking</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Add more time to your session at <span className="text-cyan-400 font-bold">₹100/hr</span>
                </p>

                {/* Hour Selection */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[1, 2, 3, 4].map(hr => (
                    <button
                      key={hr}
                      onClick={() => setExtensionHours(hr)}
                      className={cn(
                        "py-3 rounded-xl border text-sm font-bold transition-all",
                        extensionHours === hr
                          ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          : "border-slate-800 bg-[#1c1c21] text-slate-400 hover:border-slate-700"
                      )}
                    >
                      {hr} Hr{hr > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="bg-[#1c1c21] rounded-2xl p-4 mb-6 text-left">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Extension Duration</span>
                    <span className="text-white font-bold">{extensionHours} Hour{extensionHours > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Rate</span>
                    <span className="text-slate-400">₹100/hr</span>
                  </div>
                  <div className="border-t border-slate-800 pt-3 mt-2 flex justify-between">
                    <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">Extension Cost</span>
                    <span className="text-xl font-display font-bold text-white">₹{extensionHours * 100}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExtendModal(false)}
                    className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Add extension time to the countdown
                      const additionalSeconds = extensionHours * 60 * 60;
                      setTimeLeft(prev => prev + additionalSeconds);
                      // Reset expired state in case of edge timing
                      setTimerExpired(false);
                      // Update session duration and total amount
                      setActiveSession((prev: any) => ({
                        ...prev,
                        duration: prev.duration + extensionHours,
                        totalAmount: prev.totalAmount + (extensionHours * 100),
                      }));
                      setShowExtendModal(false);
                      toast.success(`Booking extended by ${extensionHours} hour${extensionHours > 1 ? 's' : ''}!`);
                    }}
                    className="flex-1 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  >
                    Confirm ₹{extensionHours * 100}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── PAYMENT SUCCESS SCREEN ────────────────────────────────────
  if (successData) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#16161a] border border-cyan-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(34,211,238,0.1)]"
        >
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-cyan-400 font-mono mb-6">Rental ID: {successData.rentalId}</p>
          
          <div className="bg-[#1c1c21] rounded-2xl p-4 mb-6 text-left">
            <h3 className="text-slate-400 text-sm mb-3 uppercase tracking-wider">Booking Details</h3>
            <ul className="space-y-2 mb-4">
              {successData.equipmentList.map((item: any) => (
                <li key={item._id} className="flex justify-between text-white">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="text-slate-500">₹{item.pricePerHour * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-white">
              <span>Total Amount</span>
              <span className="text-cyan-400 font-display">₹{successData.totalAmount}</span>
            </div>
          </div>

          <p className="text-slate-400 mb-8">{successData.message}</p>
          
          <button 
            onClick={startSession}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
          >
            <Timer className="w-5 h-5" /> Start Session
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Sports Gear
            </h1>
            <p className="text-slate-400 mt-2">Pick your equipment and start playing in minutes.</p>
          </div>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {SPORTS.map(sport => (
              <button
                key={sport.name}
                onClick={() => setFilter(sport.name)}
                className={cn(
                  "px-6 py-2.5 rounded-full border transition-all whitespace-nowrap flex items-center gap-2",
                  filter === sport.name 
                    ? "bg-cyan-500 border-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    : "border-slate-800 bg-[#16161a] text-slate-400 hover:border-slate-700"
                )}
              >
                <span>{sport.icon}</span> {sport.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-[#16161a] border border-slate-800/50 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)]"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-cyan-400 border border-cyan-500/20 uppercase">
                      {item.sport}
                    </span>
                  </div>
                  {(item.stock === 0 || item.status === 'unavailable') && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-red-400 font-bold uppercase tracking-widest text-sm">Currently unavailable</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic">{item.name}</h3>
                    <div className="text-right">
                      <span className="text-cyan-400 font-display font-medium block">₹{item.pricePerHour}<span className="text-xs text-slate-500 ml-1">/hr</span></span>
                      <span className="text-xs text-slate-500 inline-block bg-slate-800/50 px-2 py-0.5 rounded mt-1 border border-slate-700">Dep: ₹{item.depositAmount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        !(item.stock === 0 || item.status === 'unavailable') ? "bg-green-500" : "bg-red-500"
                      )} />
                      {!(item.stock === 0 || item.status === 'unavailable') ? `${item.stock} in stock` : 'Out of stock'}
                    </div>
                    {item.lockerId && <span className="text-xs font-mono bg-cyan-950/30 text-cyan-500 px-2 py-1 rounded border border-cyan-500/20">{item.lockerId}</span>}
                  </div>
                  
                  <button
                    onClick={() => addToCart(item)}
                    disabled={item.stock === 0 || item.status === 'unavailable'}
                    className="w-full py-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-cyan-500 hover:border-cyan-500 hover:text-black font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-tighter"
                  >
                    Add Equipment <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Cart FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 w-20 h-20 bg-cyan-500 text-black flex items-center justify-center rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.4)] z-40 transition-shadow"
      >
        <div className="relative">
          <ShoppingCart className="w-8 h-8" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-cyan-500">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>
      </motion.button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#111114] border-l border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold uppercase tracking-tight italic">Equipment Selection</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-800">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium text-slate-400">Cart is empty</p>
                    <p className="text-sm mt-1">Add items to proceed to checkout</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item._id} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-800 shrink-0">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                             <h4 className="font-bold uppercase italic text-sm text-cyan-400">{item.name}</h4>
                             <button onClick={() => removeFromCart(item._id)} className="text-slate-600 hover:text-red-400 transition-colors">
                               <X className="w-4 h-4" />
                             </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-[#1c1c21] p-1 rounded-xl border border-slate-800">
                              <button onClick={() => updateQuantity(item._id, -1)} className="p-1 hover:text-cyan-400"><Minus className="w-4 h-4" /></button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, 1)} className="p-1 hover:text-cyan-400"><Plus className="w-4 h-4" /></button>
                            </div>
                            <span className="font-display">₹{item.pricePerHour * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-[#16161a] border-t border-slate-800">
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Rental Duration
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {DURATIONS.map(d => (
                        <button
                          key={d.value}
                          onClick={() => setDuration(d.value)}
                          className={cn(
                            "py-2 rounded-xl border text-xs font-bold transition-all",
                            duration === d.value 
                              ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                              : "border-slate-800 bg-[#1c1c21] text-slate-400 hover:border-slate-700"
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-400">
                      <span>Rental ({duration} hr)</span>
                      <span>₹{cart.reduce((s, i) => s + (i.pricePerHour * i.quantity), 0) * duration}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Refundable Deposit</span>
                      <span>₹{cart.reduce((s, i) => s + (i.depositAmount * i.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/10">
                      <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs">Final Total</span>
                      <span className="text-3xl font-display font-bold text-white">₹{calculateTotal()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setShowPaymentModal(true); setIsCartOpen(false); }}
                    className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 uppercase italic tracking-tighter shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                  >
                    Proceed to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#16161a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                 <h2 className="text-2xl font-display font-bold text-white italic uppercase tracking-tight">Select Payment</h2>
                 <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-800 rounded-xl">
                   <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={cn(
                      "p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all",
                      paymentMethod === 'UPI' 
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                        : "border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700"
                    )}
                  >
                    <QrCode className="w-10 h-10" />
                    <span className="font-bold uppercase tracking-wider text-sm">UPI Payment</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('Cash')}
                    className={cn(
                      "p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all",
                      paymentMethod === 'Cash' 
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                        : "border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700"
                    )}
                  >
                    <Wallet className="w-10 h-10" />
                    <span className="font-bold uppercase tracking-wider text-sm">Cash Payment</span>
                  </button>
                </div>

                <div className="bg-[#1c1c21] rounded-2xl p-6 mb-8">
                  <div className="flex justify-between items-center text-slate-400 mb-2">
                    <span className="text-sm">Payable Amount</span>
                    <span className="font-display text-xl text-white font-bold">₹{calculateTotal()}</span>
                  </div>
                  <p className="text-xs text-slate-600">Secure transaction powered by SWIFTPLAY Core.</p>
                </div>



                <button
                  onClick={handleCheckout}
                  className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] uppercase italic italic tracking-tighter"
                >
                  Confirm & {paymentMethod === 'Cash' ? 'Reserve' : 'Pay Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
