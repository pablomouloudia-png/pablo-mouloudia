import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CompanyProfileView } from './CompanyProfileView';
import { InvoiceModal } from './InvoiceModal';
import { DouchetteScannerModal } from './DouchetteScannerModal';
import { WholesalerSpaceView } from './WholesalerSpaceView';
import {
  Store,
  Truck,
  ShoppingBag,
  Search,
  FileText,
  Building2,
  CheckCircle,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Scan,
  ShieldCheck,
  Layers,
  Sparkles,
  Star,
  BookmarkCheck,
  TrendingUp,
  Tag,
  Award
} from 'lucide-react';
import { Order, CompanyProfile, Product } from '../types';
import { formatDA } from '../utils/formatters';

export const DetaillantView: React.FC = () => {
  const {
    currentCompany,
    getWholesalers,
    products,
    cart,
    addToCart,
    orders
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hubs' | 'my_orders' | 'my_store'>('hubs');
  
  // Navigation state within Wholesalers flow:
  // Step 1: null selectedZone -> Displays the 6 Squares (Carrés)
  // Step 2: selectedZone set -> Displays list of Grossistes in that zone
  // Step 3: selectedWholesalerId set -> Displays Wholesaler Space & Catalog
  const [selectedZone, setSelectedZone] = useState<'essemar' | 'belfort' | 'jolie_vue' | 'cheraga' | 'bab_ezzouar' | 'autres' | null>(null);
  const [selectedWholesalerId, setSelectedWholesalerId] = useState<string | null>(null);

  // Search Bar 1: Wholesaler Search
  const [searchWholesalerQuery, setSearchWholesalerQuery] = useState('');
  const [showOnlySavedSuppliers, setShowOnlySavedSuppliers] = useState(false);

  // Search Bar 2: Product Direct Search (Bourse des prix B2B)
  const [searchProductQuery, setSearchProductQuery] = useState('');

  // Saved / Favorite Wholesalers state
  const [savedSupplierIds, setSavedSupplierIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('agri_saved_suppliers');
      return saved ? JSON.parse(saved) : ['grossiste-1', 'grossiste-semmar-2'];
    } catch (e) {
      return ['grossiste-1', 'grossiste-semmar-2'];
    }
  });

  const toggleSavedSupplier = (wholesalerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedSupplierIds(prev => {
      const isSaved = prev.includes(wholesalerId);
      const updated = isSaved ? prev.filter(id => id !== wholesalerId) : [...prev, wholesalerId];
      try {
        localStorage.setItem('agri_saved_suppliers', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving suppliers:', err);
      }
      return updated;
    });
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isDouchetteModalOpen, setIsDouchetteModalOpen] = useState(false);

  const allWholesalers = getWholesalers();

  // Definition of the 6 Wholesale Zones (Les 6 Carrés)
  const WHOLESALE_HUBS = [
    {
      id: 'essemar',
      name: 'El Semmar',
      tagline: 'Marché de Gros Alimentaire Central',
      description: 'Le plus grand marché de gros d\'épicerie, huiles, semoules et conserves d\'Alger.',
      badgeColor: 'bg-amber-500 text-slate-950 border-amber-400',
      gradient: 'from-amber-950/80 to-slate-900 border-amber-600/60',
      iconColor: 'text-amber-400',
      badgeText: 'Hub N°1 Algérie'
    },
    {
      id: 'belfort',
      name: 'Belfort',
      tagline: 'Centrale de Distribution El Harrach',
      description: 'Zone grossiste de référence pour les boissons, jus, eaux minérales et confiserie.',
      badgeColor: 'bg-blue-600 text-white border-blue-400',
      gradient: 'from-blue-950/80 to-slate-900 border-blue-600/60',
      iconColor: 'text-blue-400',
      badgeText: 'Boissons & Jus'
    },
    {
      id: 'jolie_vue',
      name: 'Jolie Vue',
      tagline: 'Dépôts Grossistes Kouba',
      description: 'Centrale pour produits frais, fromages, margarines, laitages et produits en froid.',
      badgeColor: 'bg-emerald-600 text-white border-emerald-400',
      gradient: 'from-emerald-950/80 to-slate-900 border-emerald-600/60',
      iconColor: 'text-emerald-400',
      badgeText: 'Produits Frais'
    },
    {
      id: 'cheraga',
      name: 'Chéraga',
      tagline: 'Hub Agro-Supply Ouest Alger',
      description: 'Grossistes approvisionnant les superettes de Chéraga, Dely Ibrahim et Tipaza.',
      badgeColor: 'bg-purple-600 text-white border-purple-400',
      gradient: 'from-purple-950/80 to-slate-900 border-purple-600/60',
      iconColor: 'text-purple-400',
      badgeText: 'Alger Ouest'
    },
    {
      id: 'bab_ezzouar',
      name: 'Bab Ezzouar',
      tagline: 'Zone B2B Commerce & Gros',
      description: 'Plateforme logistique pour pâtes, couscous, conserves, huiles et produits nettoyants.',
      badgeColor: 'bg-orange-600 text-white border-orange-400',
      gradient: 'from-orange-950/80 to-slate-900 border-orange-600/60',
      iconColor: 'text-orange-400',
      badgeText: 'Alger Est'
    },
    {
      id: 'autres',
      name: 'Autres Zones',
      tagline: 'Oran, Sétif, Constantine & Wilayas',
      description: 'Grossistes agréés répartis sur l\'ensemble du territoire national (58 Wilayas).',
      badgeColor: 'bg-slate-700 text-white border-slate-500',
      gradient: 'from-slate-800 to-slate-900 border-slate-700',
      iconColor: 'text-slate-300',
      badgeText: 'National (58 Wilayas)'
    }
  ] as const;

  // Filter wholesalers based on selectedZone
  const zoneWholesalers = selectedZone
    ? allWholesalers.filter(w => w.wholesaleZone === selectedZone || (!w.wholesaleZone && selectedZone === 'autres'))
    : [];

  // Filter wholesalers for Search Bar 1
  const searchedWholesalers = allWholesalers.filter(w => {
    const q = searchWholesalerQuery.trim().toLowerCase();
    const matchesSearch = q === '' ||
      (w.name || '').toLowerCase().includes(q) ||
      (w.address || '').toLowerCase().includes(q) ||
      (w.city || '').toLowerCase().includes(q) ||
      ((w.slogan || '').toLowerCase().includes(q));

    const matchesSaved = !showOnlySavedSuppliers || savedSupplierIds.includes(w.id);

    return matchesSearch && matchesSaved;
  });

  // Filter products for Search Bar 2 (Bourse des Prix B2B)
  const matchedBourseProducts = searchProductQuery.trim() === ''
    ? []
    : products.filter(p => p.isPublished && (
        (p.name || '').toLowerCase().includes(searchProductQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchProductQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchProductQuery.toLowerCase()) ||
        (p.barcode || '').toLowerCase().includes(searchProductQuery.toLowerCase())
      )).sort((a, b) => (a.priceHT || 0) - (b.priceHT || 0)); // Sort ascending by price for price comparison!

  // Lowest price in bourse search
  const lowestPriceInBourse = matchedBourseProducts.length > 0 ? matchedBourseProducts[0].priceHT : 0;

  // Selected Wholesaler object
  const selectedWholesaler = allWholesalers.find(w => w.id === selectedWholesalerId);

  // Products belonging to selected wholesaler
  const selectedWholesalerProducts = selectedWholesaler
    ? products.filter(p => p.ownerId === selectedWholesaler.id && p.isPublished)
    : [];

  // Filtered products inside selected wholesaler space
  const filteredProducts = selectedWholesalerProducts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.barcode || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const myOrdersWithWholesalers = orders.filter(o => o.buyerId === (currentCompany?.id || ''));

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner for Retailer */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-800/80 rounded-2xl p-6 text-slate-100 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                Abonnement Détaillant Pro
              </span>
              <span className="text-xs text-slate-400 font-mono">
                RC: {currentCompany?.rcNumber || currentCompany?.rc || '16/00-0589124A16'} • Wilaya: {currentCompany?.region || currentCompany?.wilaya || '16 - Alger'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">{currentCompany?.name || 'Espace Détaillant'}</h1>
            <p className="text-xs text-slate-300">
              Interface Détaillant : Choisissez une zone de regroupement ou utilisez les 2 moteurs de recherche rapide.
            </p>
          </div>
        </div>

        {/* Header Quick Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDouchetteModalOpen(true)}
            className="bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-600/60 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Scan douchette pour vérifier stock grossiste ou ajouter au panier"
          >
            <Scan className="w-4 h-4 text-amber-400" />
            <span>Scan Douchette Code-barres</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveTab('hubs');
            setSelectedZone(null);
            setSelectedWholesalerId(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'hubs'
              ? 'bg-amber-600 text-slate-950 shadow-md font-extrabold'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Espaces Grossistes par Zone (Les 6 Carrés)</span>
        </button>

        <button
          onClick={() => setActiveTab('my_orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'my_orders'
              ? 'bg-amber-600 text-slate-950 shadow-md font-extrabold'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mes Commandes Grossistes ({myOrdersWithWholesalers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_store')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'my_store'
              ? 'bg-amber-600 text-slate-950 shadow-md font-extrabold'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Fiche Mon Commerce</span>
        </button>
      </div>

      {/* TAB 1: MAIN GROSSISTES ZONES FLOW */}
      {activeTab === 'hubs' && (
        <div className="space-y-6">

          {/* DUAL SEARCH BARS (NOUVEAUTÉ ALGERIE: RECHERCHE GROSSISTE + BOURSE DES PRIX PRODUITS) */}
          {!selectedZone && !selectedWholesalerId && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-extrabold text-white">
                    Double Moteur de Recherche B2B : Grossistes & Bourse des Prix
                  </h3>
                </div>

                <button
                  onClick={() => setShowOnlySavedSuppliers(!showOnlySavedSuppliers)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border cursor-pointer ${
                    showOnlySavedSuppliers
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950 text-amber-300 border-amber-800/80 hover:bg-slate-800'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${showOnlySavedSuppliers ? 'fill-slate-950' : 'fill-amber-400 text-amber-400'}`} />
                  <span>Mes Fournisseurs Enregistrés ({savedSupplierIds.length})</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* SEARCH BAR 1: FIND GROSSISTE + ADD TO SUPPLIERS */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-blue-300">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <span>1. Rechercher un Grossiste / Fournisseur</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Recherche par Nom / Zone</span>
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Tapez le nom d'un grossiste, Semmar, Belfort..."
                      value={searchWholesalerQuery}
                      onChange={(e) => setSearchWholesalerQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    {searchWholesalerQuery && (
                      <button
                        onClick={() => setSearchWholesalerQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* SEARCH BAR 2: DIRECT PRODUCT SEARCH (BOURSE DES PRIX) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>2. Chercher un Produit Directement (Bourse des Prix)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Comparateur en direct
                    </span>
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Ex: Sucre, Huile, Café, Thon, Pâtes, Candia..."
                      value={searchProductQuery}
                      onChange={(e) => setSearchProductQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    {searchProductQuery && (
                      <button
                        onClick={() => setSearchProductQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* DYNAMIC RESULTS DISPLAY FOR SEARCH BAR 1 (GROSSISTE SEARCH OR SAVED SUPPLIERS) */}
              {(searchWholesalerQuery.trim() !== '' || showOnlySavedSuppliers) && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-blue-300 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <span>
                        {showOnlySavedSuppliers
                          ? `Mes Fournisseurs Enregistrés (${searchedWholesalers.length})`
                          : `Grossistes trouvés pour "${searchWholesalerQuery}" (${searchedWholesalers.length})`}
                      </span>
                    </h4>
                    {showOnlySavedSuppliers && (
                      <button
                        onClick={() => setShowOnlySavedSuppliers(false)}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Afficher tous les grossistes
                      </button>
                    )}
                  </div>

                  {searchedWholesalers.length === 0 ? (
                    <div className="bg-slate-950 p-4 rounded-xl text-center text-slate-500 text-xs border border-slate-800">
                      Aucun grossiste ne correspond à votre recherche.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {searchedWholesalers.map(wholesaler => {
                        const isSaved = savedSupplierIds.includes(wholesaler.id);
                        const zoneHub = WHOLESALE_HUBS.find(h => h.id === wholesaler.wholesaleZone);

                        return (
                          <div
                            key={wholesaler.id}
                            className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-blue-500/60 transition-all"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                                  {zoneHub?.name || wholesaler.city}
                                </span>
                                <h5 className="font-extrabold text-white text-xs">{wholesaler.name}</h5>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">{wholesaler.address}</p>
                              <span className="text-[11px] font-mono font-bold text-amber-400 block mt-1">
                                Min commande: {formatDA(wholesaler.minOrderAmountHT)} HT
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Bookmark / Favorite supplier toggle button */}
                              <button
                                onClick={(e) => toggleSavedSupplier(wholesaler.id, e)}
                                className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  isSaved
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-amber-500 hover:text-amber-300'
                                }`}
                                title={isSaved ? "Retirer des mes fournisseurs" : "Ajouter à mes fournisseurs enregistrés"}
                              >
                                <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-slate-950' : ''}`} />
                                <span className="hidden sm:inline">{isSaved ? 'Enregistré' : 'Ajouter'}</span>
                              </button>

                              {/* Direct Access button */}
                              <button
                                onClick={() => {
                                  setSelectedZone((wholesaler.wholesaleZone as any) || 'autres');
                                  setSelectedWholesalerId(wholesaler.id);
                                }}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>Accéder</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* DYNAMIC RESULTS DISPLAY FOR SEARCH BAR 2 (BOURSE DES PRIX PRODUITS) */}
              {searchProductQuery.trim() !== '' && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-300 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>
                          Bourse des Prix B2B pour : "{searchProductQuery}" ({matchedBourseProducts.length} offres grossistes)
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Comparez immédiatement les tarifs HT pratiqués par tous les grossistes en Algérie pour ce produit.
                      </p>
                    </div>

                    <button
                      onClick={() => setSearchProductQuery('')}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Effacer la recherche
                    </button>
                  </div>

                  {matchedBourseProducts.length === 0 ? (
                    <div className="bg-slate-950 p-4 rounded-xl text-center text-slate-500 text-xs border border-slate-800">
                      Aucun produit trouvé pour "{searchProductQuery}". Essayez un autre mot-clé (ex: Sucre, Huile, Café, Thon, Pâtes...).
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {matchedBourseProducts.map(prod => {
                        const ownerWholesaler = allWholesalers.find(w => w.id === prod.ownerId);
                        const isCheapest = prod.priceHT === lowestPriceInBourse && matchedBourseProducts.length > 1;

                        return (
                          <div
                            key={prod.id}
                            className={`bg-slate-950 rounded-xl border p-4 flex flex-col justify-between space-y-3 relative overflow-hidden transition-all ${
                              isCheapest
                                ? 'border-emerald-500/80 shadow-lg shadow-emerald-950/40 bg-emerald-950/10'
                                : 'border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {/* Best Price Badge */}
                            {isCheapest && (
                              <div className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-emerald-300 self-start flex items-center gap-1 shadow">
                                <Award className="w-3 h-3" />
                                <span>🏆 Meilleur Prix B2B</span>
                              </div>
                            )}

                            <div className="flex gap-3">
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-slate-800 shrink-0"
                              />
                              <div>
                                <h5 className="font-bold text-white text-xs line-clamp-1">{prod.name}</h5>
                                <span className="text-[10px] text-slate-400 block mt-0.5">{prod.unitType}</span>
                                <span className="text-[10px] text-amber-400 font-mono block">EAN: {prod.barcode}</span>
                              </div>
                            </div>

                            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                              <div className="flex justify-between items-center text-slate-400">
                                <span>Grossiste Vendeur :</span>
                                <span className="font-bold text-blue-300 text-[11px]">
                                  {prod.ownerName}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Zone Grossiste :</span>
                                <span className="font-bold text-slate-200 text-[11px]">
                                  {ownerWholesaler?.city || 'Alger'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                                <span className="text-slate-300 font-bold">Prix Vente HT :</span>
                                <span className="font-mono text-base font-black text-amber-400">
                                  {formatDA(prod.priceHT)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                              <button
                                onClick={() => {
                                  if (ownerWholesaler) {
                                    setSelectedZone((ownerWholesaler.wholesaleZone as any) || 'autres');
                                    setSelectedWholesalerId(ownerWholesaler.id);
                                  }
                                }}
                                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                              >
                                Voir Boutique
                              </button>

                              <button
                                onClick={() => addToCart(prod, 1)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow cursor-pointer transition-colors"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Commander ({formatDA(prod.priceHT)})</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* LEVEL 1: THE 6 SQUARES (LES 6 CARRÉS DES ZONES GROSSISTES) */}
          {!selectedZone && !selectedWholesalerId && (
            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <span>Sélectionnez la Zone / Hub de votre Grossiste :</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Les grossistes sont regroupés par zone commerciale. Cliquez sur un carré pour voir les grossistes disponibles.
                  </p>
                </div>
                <span className="text-xs bg-amber-950 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-800 hidden sm:inline">
                  6 Zones Stratégiques
                </span>
              </div>

              {/* 6 Squares Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {WHOLESALE_HUBS.map((hub) => {
                  const grossistesInZone = allWholesalers.filter(
                    w => w.wholesaleZone === hub.id || (!w.wholesaleZone && hub.id === 'autres')
                  );

                  return (
                    <div
                      key={hub.id}
                      onClick={() => {
                        setSelectedZone(hub.id as any);
                        setSelectedWholesalerId(null);
                      }}
                      className={`bg-gradient-to-br ${hub.gradient} p-6 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] hover:shadow-2xl group flex flex-col justify-between min-h-[200px] relative overflow-hidden`}
                    >
                      {/* Top Row inside square */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md border ${hub.badgeColor}`}>
                            {hub.badgeText}
                          </span>
                          <span className="text-xs text-slate-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                            {grossistesInZone.length} Grossiste(s)
                          </span>
                        </div>

                        <h4 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                          {hub.name}
                        </h4>
                        <p className="text-xs font-bold text-slate-300 mt-0.5">
                          {hub.tagline}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                          {hub.description}
                        </p>
                      </div>

                      {/* Bottom action row inside square */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                        <span>Voir la liste des Grossistes</span>
                        <ChevronRight className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 2: LIST OF WHOLESALERS IN SELECTED ZONE */}
          {selectedZone && !selectedWholesalerId && (
            <div className="space-y-5">
              
              {/* Breadcrumb Header */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <button
                      onClick={() => setSelectedZone(null)}
                      className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Toutes les Zones</span>
                    </button>
                    <span>/</span>
                    <span className="text-slate-200 font-bold capitalize">Zone : {WHOLESALE_HUBS.find(h => h.id === selectedZone)?.name}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Grossistes basés à {WHOLESALE_HUBS.find(h => h.id === selectedZone)?.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cliquez sur un grossiste pour accéder directement à son espace et consulter ses tarifs.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedZone(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-amber-400" />
                  <span>Changer de Zone</span>
                </button>
              </div>

              {/* Wholesalers Cards list in this Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {zoneWholesalers.length === 0 ? (
                  <div className="col-span-full bg-slate-900 p-8 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
                    Aucun grossiste n'est actuellement répertorié dans cette zone.
                  </div>
                ) : (
                  zoneWholesalers.map(wholesaler => {
                    const isSaved = savedSupplierIds.includes(wholesaler.id);

                    return (
                      <div
                        key={wholesaler.id}
                        onClick={() => setSelectedWholesalerId(wholesaler.id)}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/80 hover:bg-amber-950/10 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl group"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800">
                                  Grossiste - {wholesaler.city}
                                </span>
                                {isSaved && (
                                  <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-slate-950" />
                                    <span>Fournisseur Enregistré</span>
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-white text-lg mt-1 group-hover:text-amber-300 transition-colors">
                                {wholesaler.name}
                              </h4>
                              <p className="text-xs text-slate-300 font-medium">{wholesaler.slogan}</p>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Min. Commande HT</span>
                              <span className="text-sm font-black text-amber-400 font-mono">
                                {formatDA(wholesaler.minOrderAmountHT)} HT
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                            {wholesaler.description}
                          </p>

                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs mt-3">
                            <div className="flex justify-between text-slate-400">
                              <span>Adresse Entrepôt :</span>
                              <span className="text-slate-200 font-semibold">{wholesaler.address}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>N° Registre de Commerce (RC) :</span>
                              <span className="font-mono text-amber-300">{wholesaler?.rc || wholesaler?.rcNumber || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Livraison Wilayas :</span>
                              <span className="text-emerald-400 font-semibold">{wholesaler?.deliveryZones ? wholesaler.deliveryZones.join(', ') : 'Toutes Wilayas'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                          <button
                            onClick={(e) => toggleSavedSupplier(wholesaler.id, e)}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                              isSaved
                                ? 'bg-amber-500 text-slate-950 border-amber-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-amber-300'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-slate-950' : ''}`} />
                            <span>{isSaved ? 'Fournisseur Enregistré' : 'Ajouter aux fournisseurs'}</span>
                          </button>

                          <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Accéder à son Espace</span>
                            <ChevronRight className="w-5 h-5 text-amber-400" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* LEVEL 3: WHOLESALER SPACE & CATALOGUE */}
          {selectedWholesaler && (
            <WholesalerSpaceView
              wholesaler={selectedWholesaler}
              products={products}
              onBack={() => setSelectedWholesalerId(null)}
              cart={cart}
              onAddToCart={addToCart}
              savedSupplierIds={savedSupplierIds}
              onToggleSaveSupplier={(id) => toggleSavedSupplier(id)}
            />
          )}

        </div>
      )}

      {/* TAB 2: MES COMMANDES GROSSISTES */}
      {activeTab === 'my_orders' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white">Suivi de mes Commandes passées aux Grossistes</h3>
            <p className="text-xs text-slate-400">
              Consultez l'état d'avancement de vos réapprovisionnements et téléchargez vos factures d'achat en Dinars.
            </p>
          </div>

          <div className="space-y-4">
            {myOrdersWithWholesalers.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                Vous n'avez pas encore passé de commande auprès d'un grossiste.
              </div>
            ) : (
              myOrdersWithWholesalers.map(order => (
                <div key={order.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-400">{order.orderNumber}</span>
                        <span className="text-xs text-slate-400">• Passée le {order.orderDate}</span>
                      </div>
                      <div className="text-xs text-white font-semibold mt-0.5">
                        Grossiste Vendeur : <span className="text-blue-300">{order.sellerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950 text-emerald-400 border border-slate-800 font-semibold">
                        {order.status === 'en_attente' && '⏳ En attente validation'}
                        {order.status === 'validee' && '✓ Validée Grossiste'}
                        {order.status === 'en_preparation' && '📦 En préparation'}
                        {order.status === 'en_livraison' && '🚚 En cours de livraison'}
                        {order.status === 'livree' && '🏁 Livrée en Magasin'}
                      </span>

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Facture B2B (DA)</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-2">Contenu du Colis :</span>
                      <ul className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-slate-300 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                            <span>{item.productName} ({item.quantity}x)</span>
                            <span className="font-bold text-amber-400 font-mono">{formatDA(item.totalHT)} HT</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-right font-mono">
                      <div className="text-slate-400">Total HT : <span className="font-bold text-white">{formatDA(order.totalHT)}</span></div>
                      <div className="text-slate-400">TVA (9%) : <span className="text-slate-300">{formatDA(order.totalTVA)}</span></div>
                      <div className="text-amber-400 font-bold text-sm pt-1 border-t border-slate-800">
                        Total TTC : {formatDA(order.totalTTC)}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 text-left font-sans">
                        Livré à : {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MON COMMERCE */}
      {activeTab === 'my_store' && (
        <CompanyProfileView company={currentCompany} isEditable={true} />
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* Douchette Scanner Modal */}
      <DouchetteScannerModal
        isOpen={isDouchetteModalOpen}
        onClose={() => setIsDouchetteModalOpen(false)}
      />
    </div>
  );
};
