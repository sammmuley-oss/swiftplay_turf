import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';

export function KioskLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
