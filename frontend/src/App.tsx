import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { KioskLayout } from './components/layout/KioskLayout';
import { HomeScreen } from './pages/HomeScreen';
import { LoginScreen } from './pages/LoginScreen';
import { CatalogScreen } from './pages/CatalogScreen';
import { ActiveRentalScreen } from './pages/ActiveRentalScreen';
import { ReturnScreen } from './pages/ReturnScreen';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboardScreen } from './pages/admin/AdminDashboardScreen';
import { AdminInventoryScreen } from './pages/admin/AdminInventoryScreen';
import { AdminSessionsScreen } from './pages/admin/AdminSessionsScreen';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<KioskLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/catalog" element={<CatalogScreen />} />
          <Route path="/rental/:sessionId" element={<ActiveRentalScreen />} />
          <Route path="/return" element={<ReturnScreen />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardScreen />} />
          <Route path="inventory" element={<AdminInventoryScreen />} />
          <Route path="sessions" element={<AdminSessionsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
