import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ReturnScreen() {
  const [rfid, setRfid] = useState('');

  return (
    <div className="min-h-screen p-8 bg-[#0a0a0c] flex flex-col items-center justify-center">
      <div className="glass-panel max-w-md w-full p-8">
        <h2 className="font-display text-xl text-cyan-400 mb-4">Return equipment</h2>
        <p className="text-slate-400 text-sm mb-4">Scan or enter RFID tag to complete return.</p>
        <input
          type="text"
          value={rfid}
          onChange={(e) => setRfid(e.target.value)}
          placeholder="RFID tag"
          className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none mb-4"
        />
        <button type="button" className="kiosk-button w-full">Verify & return</button>
        <Link to="/" className="block mt-4 text-center text-slate-400 hover:text-cyan-400 text-sm">Cancel</Link>
      </div>
    </div>
  );
}
