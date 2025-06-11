
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header'; // Admin Header
import GlobalHeader from './components/layout/GlobalHeader'; // Customer Header
import CustomerLayout from './components/layout/CustomerLayout'; // Customer Layout
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import UserManagementPage from './pages/UserManagementPage';
import StickerManagementPage from './pages/StickerManagementPage';
import ArtistManagementPage from './pages/ArtistManagementPage';
import OrderManagementPage from './pages/OrderManagementPage';
import GeminiContentAnalysisPage from './pages/GeminiContentAnalysisPage';
import SettingsPage from './pages/SettingsPage';
import CustomStickerBuilderPage from './pages/CustomStickerBuilderPage';
import StickerMarketplacePage from './pages/StickerMarketplacePage'; // New Marketplace Page

// AdminLayout component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-screen bg-gray-900 text-gray-100">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header /> {/* Admin specific header */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6">
        {children}
      </main>
    </div>
  </div>
);

const App: React.FC = () => {
  const location = useLocation();

  const customerPaths = ['/sticker-builder', '/marketplace'];
  const isCustomerPath = customerPaths.some(p => location.pathname.startsWith(p)) || location.pathname === '/';

  if (isCustomerPath) {
    return (
      <CustomerLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          <Route path="/sticker-builder" element={<CustomStickerBuilderPage />} />
          <Route path="/marketplace/*" element={<StickerMarketplacePage />} /> 
          {/* Add more customer-facing routes here, e.g. product details, cart, checkout */}
          {/* Catch-all for unknown customer paths could go to a 404 page or redirect to marketplace */}
           <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Routes>
      </CustomerLayout>
    );
  }

  // Admin View: For all other paths, use the AdminLayout.
  return (
    <AdminLayout>
      <Routes>
        {/* Default admin route (if somehow accessed without specific admin path, though unlikely with above logic) */}
        <Route path="/overview" element={<DashboardOverviewPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/stickers" element={<StickerManagementPage />} />
        <Route path="/artists" element={<ArtistManagementPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/ai-tools" element={<GeminiContentAnalysisPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Catch-all for unknown admin paths, redirect to overview */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default App;
