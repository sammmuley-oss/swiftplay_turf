import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { KioskLayout } from './components/layout/KioskLayout';
import { HomeScreen } from './pages/HomeScreen';

import { CatalogScreen } from './pages/CatalogScreen';
import { ActiveRentalScreen } from './pages/ActiveRentalScreen';
import { ReturnScreen } from './pages/ReturnScreen';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboardScreen } from './pages/admin/AdminDashboardScreen';
import { AdminInventoryScreen } from './pages/admin/AdminInventoryScreen';
import { AdminSessionsScreen } from './pages/admin/AdminSessionsScreen';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<KioskLayout />}>
          <Route path="/" element={<HomeScreen />} />

          <Route path="/catalog" element={<CatalogScreen />} />
          <Route path="/rental/:sessionId" element={<ActiveRentalScreen />} />
          <Route path="/return" element={<ReturnScreen />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
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
