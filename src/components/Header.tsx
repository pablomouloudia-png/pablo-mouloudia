import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Factory, Truck, Store, ShoppingBag, ShieldCheck, ChevronDown, Award, LogOut } from 'lucide-react';
import { UserRole } from '../types';
import zfAgriLogo from '../assets/images/zf_agri_logo_1785862141270.jpg';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenSubscriptionModal: () => void;
  onOpenCart: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSubscriptionModal, onOpenCart, onLogout }) => {
  const { currentRole, setCurrentRole, currentCompany, companies, selectCompany, cart } = useApp();
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const roleConfigs = {
    usine: {
      title: 'Usine / Fabricant',
      color: 'bg-emerald-600 text-white',
      badge: 'Abonnement Usine Pro',
      icon: Factory,
      description: 'Production, Gestion de stock & Vente aux Grossistes'
    },
    grossiste: {
      title: 'Grossiste / Distributeur',
      color: 'bg-blue-600 text-white',
      badge: 'Abonnement Grossiste Hub',
      icon: Truck,
      description: 'Achat aux Usines, Stockage & Vente aux Détaillants'
    },
    detaillant: {
      title: 'Détaillant / Épicerie',
      color: 'bg-amber-600 text-white',
      badge: 'Abonnement Détaillant Pro',
      icon: Store,
      description: 'Consultation Grossistes & Commande Directe'
    }
  };

  const currentRoleConfig = roleConfigs[currentRole];
  const sameRoleCompanies = companies.filter(c => c.role === currentRole);

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      {/* Top Banner - Architecture Indicator */}
      <div className="bg-slate-950 text-slate-400 text-xs py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Flux d'Approvisionnement Agroalimentaire B2B :</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
              <span className={currentRole === 'usine' ? 'text-emerald-400 font-bold underline underline-offset-2' : 'text-slate-400'}>
                🏭 Usine
              </span>
              <span className="text-slate-600">➔</span>
              <span className={currentRole === 'grossiste' ? 'text-blue-400 font-bold underline underline-offset-2' : 'text-slate-400'}>
                🚛 Grossiste
              </span>
              <span className="text-slate-600">➔</span>
              <span className={currentRole === 'detaillant' ? 'text-amber-400 font-bold underline underline-offset-2' : 'text-slate-400'}>
                🏪 Détaillant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubscriptionModal}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors text-xs font-medium cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Grille des 3 Abonnements (Tarifs B2B)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Current Entity Display */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden border border-emerald-500/50 shadow-xl shrink-0 bg-slate-950 flex items-center justify-center transition-transform hover:scale-105">
                <img
                  src={zfAgriLogo}
                  alt="Logo ZF Agri"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xs text-slate-300 font-semibold tracking-wide block">
                  Application B2B Agroalimentaire
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Distribution & Regroupement Algérie
                </span>
              </div>
            </div>

            {/* Entity Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg text-left transition-colors text-xs"
              >
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Compte Actif</div>
                  <div className="font-semibold text-slate-100 max-w-[160px] truncate">{currentCompany.name}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showCompanyDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Espaces {currentRoleConfig.title}s disponibles
                  </div>
                  {sameRoleCompanies.map(comp => (
                    <button
                      key={comp.id}
                      onClick={() => {
                        selectCompany(comp.id);
                        setShowCompanyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex flex-col gap-0.5 ${
                        comp.id === currentCompany.id ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{comp.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{comp.city} ({comp.region})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Role / Interface Switcher Controls */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto justify-center">
            <span className="text-[10px] text-slate-400 font-semibold px-2 uppercase hidden lg:inline">Changer d'interface :</span>
            
            {(['usine', 'grossiste', 'detaillant'] as UserRole[]).map((role) => {
              const cfg = roleConfigs[role];
              const Icon = cfg.icon;
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? cfg.color + ' shadow-md font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={cfg.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{role === 'usine' ? 'Usine' : role === 'grossiste' ? 'Grossiste' : 'Détaillant'}</span>
                </button>
              );
            })}
          </div>

          {/* Cart & Subscription Status Badge */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <PWAInstallButton />

            <button
              onClick={onOpenSubscriptionModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-medium">{currentRoleConfig.badge}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Panier</span>
              {cartItemsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full text-[10px] shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-slate-800 hover:bg-red-950/80 hover:text-red-300 text-slate-400 border border-slate-700 hover:border-red-800 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              title="Déconnexion (Retour à l'écran de connexion)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
