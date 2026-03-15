import { useParams, Link } from 'react-router-dom';

export function ActiveRentalScreen() {
  const { sessionId } = useParams();

  return (
    <div className="min-h-screen p-8 bg-[#0a0a0c] flex flex-col items-center justify-center">
      <div className="glass-panel max-w-md w-full p-8 text-center">
        <h2 className="font-display text-xl text-cyan-400 mb-4">Active Rental</h2>
        <p className="text-slate-400 mb-2">Session: {sessionId}</p>
        <p className="text-slate-500 text-sm">Countdown and extension options will appear here when connected to backend.</p>
        <Link to="/return" className="inline-block mt-6 kiosk-button">Return equipment</Link>
      </div>
    </div>
  );
}
