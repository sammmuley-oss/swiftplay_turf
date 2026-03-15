import { Link } from 'react-router-dom';

export function HomeScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0c]">
      <h1 className="font-display text-4xl md:text-6xl font-bold text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
        PLAY HARDER. RENT SMARTER.
      </h1>
      <p className="text-slate-400 text-lg mb-10">SWIFTPLAY – Smart IoT Sports Rental</p>
      <div className="flex gap-4">
        <Link to="/login" className="kiosk-button">Get Started</Link>
        <Link to="/catalog" className="px-6 py-3 rounded-full border border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors">
          Browse Equipment
        </Link>
      </div>
    </div>
  );
}
