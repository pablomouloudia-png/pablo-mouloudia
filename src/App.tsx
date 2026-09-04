import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SubscriptionModal } from './components/SubscriptionModal';
import { CartDrawer } from './components/CartDrawer';
import { UsineView } from './components/UsineView';
import { GrossisteView } from './components/GrossisteView';
import { DetaillantView } from './components/DetaillantView';
import { AuthScreen } from './components/AuthScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CheckCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRole } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('agri_auth_logged_in') === 'true';
  });

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    localStorage.setItem('agri_auth_logged_in', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('agri_auth_logged_in');
    setIsAuthenticated(false);
  };

  const handleOrderSuccess = (orderId: string) => {
    setToastMessage(`Commande B2B validée avec succès ! Référence : ${orderId}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <Header
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body View based on Active Role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          {currentRole === 'usine' && <UsineView />}
          {currentRole === 'grossiste' && <GrossisteView />}
          {currentRole === 'detaillant' && <DetaillantView />}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-300">AgriSupply B2B Algérie</span>
            <span>• Distribution Agroalimentaire Simplifiée</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Usine ➔ Grossiste ➔ Détaillant</span>
            <span>•</span>
            <span>HACCP & Conformité B2B Algérienne</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-emerald-100 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
