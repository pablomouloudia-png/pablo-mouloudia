import React from 'react';
import { X, Check, Factory, Truck, Store, ShieldCheck, Zap } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setCurrentRole } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Offres d'Abonnement Agroalimentaire B2B</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Trois Interfaces Dediées selon Votre Rôle
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Chaque acteur de la chaîne de distribution bénéficie de fonctionnalités ciblées et sécurisées pour optimiser ses opérations d'approvisionnement.
          </p>
        </div>

        {/* 3 Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* USINE SUBSCRIPTION */}
          <div className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
            currentRole === 'usine'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Factory className="w-6 h-6" />
                </div>
                {currentRole === 'usine' && (
                  <span className="bg-emerald-500 text-slate-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase">
                    Espace Actif
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white">1. Abonnement Usine</h3>
              <p className="text-slate-400 text-xs mt-1">Pour transformateurs et industriels agroalimentaires.</p>

              <div className="mt-4 mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">45 000 DA</span>
                  <span className="text-slate-400 text-xs">/ mois HT</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">Gestion de stock ERP & Importation Douchette</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                {SUBSCRIPTION_PLANS.usine_pro.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setCurrentRole('usine');
                onClose();
              }}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'usine'
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {currentRole === 'usine' ? 'Interface Actuelle' : 'Accéder à l\'Espace Usine'}
            </button>
          </div>

          {/* GROSSISTE SUBSCRIPTION */}
          <div className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
            currentRole === 'grossiste'
              ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Truck className="w-6 h-6" />
                </div>
                {currentRole === 'grossiste' && (
                  <span className="bg-blue-500 text-slate-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase">
                    Espace Actif
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white">2. Abonnement Grossiste</h3>
              <p className="text-slate-400 text-xs mt-1">Pour centrales d'achat et distributeurs régionaux.</p>

              <div className="mt-4 mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">25 000 DA</span>
                  <span className="text-slate-400 text-xs">/ mois HT</span>
                </div>
                <span className="text-[10px] text-blue-400 font-medium">Double Interface Achat Usine / Vente Détaillant</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                {SUBSCRIPTION_PLANS.grossiste_pro.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setCurrentRole('grossiste');
                onClose();
              }}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'grossiste'
                  ? 'bg-blue-500 text-slate-950 hover:bg-blue-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {currentRole === 'grossiste' ? 'Interface Actuelle' : 'Accéder à l\'Espace Grossiste'}
            </button>
          </div>

          {/* DÉTAILLANT SUBSCRIPTION */}
          <div className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
            currentRole === 'detaillant'
              ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Store className="w-6 h-6" />
                </div>
                {currentRole === 'detaillant' && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase">
                    Espace Actif
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white">3. Abonnement Détaillant</h3>
              <p className="text-slate-400 text-xs mt-1">Pour superettes, épiceries et magasins de détail.</p>

              <div className="mt-4 mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">8 500 DA</span>
                  <span className="text-slate-400 text-xs">/ mois HT</span>
                </div>
                <span className="text-[10px] text-amber-400 font-medium">Consultation & Commandes Grossistes Directes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                {SUBSCRIPTION_PLANS.detaillant_starter.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setCurrentRole('detaillant');
                onClose();
              }}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'detaillant'
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {currentRole === 'detaillant' ? 'Interface Actuelle' : 'Accéder à l\'Espace Détaillant'}
            </button>
          </div>

        </div>

        {/* Note on Supply Chain Flow Rules */}
        <div className="mt-8 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Règle de l'Architecture Tripartite : </span>
            Les usines vendent exclusivement aux grossistes agréés. Les grossistes assurent la logistique intermédiaire et revendent aux détaillants. L'interface Détaillant est strictement limitée à la consultation et commande auprès des grossistes.
          </div>
        </div>

      </div>
    </div>
  );
};
