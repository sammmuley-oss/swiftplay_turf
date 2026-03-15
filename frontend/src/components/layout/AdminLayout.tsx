import { Outlet, Link } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100">
      <nav className="border-b border-slate-700 px-4 py-3 flex gap-4">
        <Link to="/admin" className="text-cyan-400 hover:text-cyan-300">Dashboard</Link>
        <Link to="/admin/inventory" className="text-slate-300 hover:text-white">Inventory</Link>
        <Link to="/admin/sessions" className="text-slate-300 hover:text-white">Sessions</Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
