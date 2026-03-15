import { Outlet } from 'react-router-dom';

export function KioskLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans">
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
