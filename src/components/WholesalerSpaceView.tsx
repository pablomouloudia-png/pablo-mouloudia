import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Star,
  Sparkles,
  ChevronRight,
  Truck,
  Filter,
  Check,
  Tag,
  Package,
  Layers,
  Award,
  Zap,
  FileSpreadsheet,
  Building2,
  ChevronDown,
  Info
} from 'lucide-react';
import { CompanyProfile, Product } from '../types';
import { formatDA } from '../utils/formatters';
import {
  MAIN_CATALOG_TREE,
  TRADE_SHORTCUTS,
  VOLUME_SHORTCUTS,
  getProductMetadata,
  TradeShortcut,
  VolumeShortcut
} from '../utils/b2bCatalogHelpers';
import { QuickOrderModal } from './QuickOrderModal';

interface WholesalerSpaceViewProps {
  wholesaler: CompanyProfile;
  products: Product[];
  onBack: () => void;
  cart: { product: Product; quantity: number }[];
  onAddToCart: (product: Product, quantity: number) => void;
  savedSupplierIds: string[];
  onToggleSaveSupplier: (wholesalerId: string) => void;
}

export const WholesalerSpaceView: React.FC<WholesalerSpaceViewProps> = ({
  wholesaler,
  products,
  onBack,
  cart,
  onAddToCart,
  savedSupplierIds,
  onToggleSaveSupplier,
}) => {
  if (!wholesaler) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-300 my-6">
        <p className="font-bold text-sm">Fiche Grossiste Indisponible</p>
        <button
          onClick={onBack}
          className="mt-4 bg-amber-500 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs hover:bg-amber-400 cursor-pointer"
        >
          Retour aux Zones Grossistes
        </button>
      </div>
    );
  }

  // Navigation & Category Tree State
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all'); // 'all' or category key
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  // Strategic Shortcuts State
  const [activeTradeFilter, setActiveTradeFilter] = useState<'all' | 'pizzeria' | 'epicerie' | 'restaurant' | 'boulangerie'>('all');
  const [activeVolumeFilter, setActiveVolumeFilter] = useState<'all' | 'unite' | 'carton' | 'palette'>('all');
  const [showOnlyPromos, setShowOnlyPromos] = useState(false);

  // Search & Modals
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  // Quantity selection state per product ID
  const [qtySelectionMap, setQtySelectionMap] = useState<Record<string, number>>({});

  const isSaved = (savedSupplierIds || []).includes(wholesaler.id);

  // Filter products owned by this wholesaler (or matching general catalog for this wholesaler)
  const wholesalerProducts = useMemo(() => {
    const safeProducts = products || [];
    const list = safeProducts.filter(p => p && (p.ownerId === wholesaler.id || p.isPublished));
    return list;
  }, [products, wholesaler.id]);

  // Enrich products with metadata for filtering
  const enrichedProducts = useMemo(() => {
    return wholesalerProducts.map(p => {
      const meta = getProductMetadata(p);
      return {
        ...p,
        meta
      };
    });
  }, [wholesalerProducts]);

  // Apply all filters: Category, Subcategory, Trade, Volume, Promo, Search
  const filteredProducts = useMemo(() => {
    return enrichedProducts.filter(p => {
      if (!p) return false;
      // 1. Search Query
      if (catalogSearch.trim()) {
        const query = catalogSearch.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(query);
        const matchesSku = (p.sku || '').toLowerCase().includes(query);
        const matchesBarcode = (p.barcode || '').toLowerCase().includes(query);
        const matchesDesc = (p.description || '').toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesBarcode && !matchesDesc) {
          return false;
        }
      }

      // 2. Main Category Filter
      if (selectedCategoryKey !== 'all') {
        if (p.meta?.mainCategoryKey !== selectedCategoryKey) return false;
      }

      // 3. SubCategory Filter
      if (selectedSubCategory !== 'all') {
        if (p.meta?.subCategory !== selectedSubCategory) return false;
      }

      // 4. Strategic Trade Shortcut Filter
      if (activeTradeFilter !== 'all') {
        const tradeDef = TRADE_SHORTCUTS.find(t => t.id === activeTradeFilter);
        if (tradeDef) {
          const matchesKeyword = tradeDef.featuredKeywords.some(kw =>
            ((p.name || '') + ' ' + (p.description || '') + ' ' + (p.unitType || '')).toLowerCase().includes(kw)
          );
          const matchesTradeArray = p.meta?.suitableTrades?.includes(activeTradeFilter);
          if (!matchesKeyword && !matchesTradeArray) return false;
        }
      }

      // 5. Volume Filter
      if (activeVolumeFilter !== 'all') {
        if (p.meta?.packagingVolume !== activeVolumeFilter) return false;
      }

      // 6. Promos Filter
      if (showOnlyPromos) {
        if (!p.meta?.isPromo) return false;
      }

      return true;
    });
  }, [enrichedProducts, catalogSearch, selectedCategoryKey, selectedSubCategory, activeTradeFilter, activeVolumeFilter, showOnlyPromos]);

  // Calculate Cart Total for this Wholesaler
  const wholesalerCartItems = (cart || []).filter(item => item?.product?.ownerId === wholesaler.id);
  const cartTotalHT = wholesalerCartItems.reduce((sum, item) => sum + ((item?.product?.priceHT || 0) * (item?.quantity || 1)), 0);
  const minOrderHT = 0;
  const isMinOrderMet = true;
  const minOrderProgress = 100;

  const handleQtyChange = (productId: string, val: number) => {
    setQtySelectionMap(prev => ({
      ...prev,
      [productId]: Math.max(1, val)
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* 1. TOP BAR & WHOLESALER PROFILE BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <button
              onClick={onBack}
              className="bg-slate-950 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Retour aux Zones Grossistes</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSaveSupplier(wholesaler.id)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500 hover:text-amber-300'
                }`}
              >
                <Star className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
                <span>{isSaved ? 'Fournisseur Enregistré' : 'Ajouter à mes Fournisseurs'}</span>
              </button>

              <button
                onClick={() => setIsQuickOrderOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Commande Rapide (SKU / Excel)</span>
              </button>
            </div>
          </div>

          {/* Info Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-950 text-blue-300 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border border-blue-800">
                  Grossiste Agréé - {wholesaler?.city || 'Algérie'}
                </span>
                {(wholesaler?.rc || wholesaler?.rcNumber) && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    RC: {wholesaler.rc || wholesaler.rcNumber}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white">{wholesaler?.name}</h1>
              <p className="text-xs text-amber-300 font-medium">{wholesaler?.slogan}</p>
              <p className="text-xs text-slate-400">{wholesaler?.description}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{wholesaler?.address}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Livraison: {wholesaler?.deliveryZones ? wholesaler.deliveryZones.join(', ') : 'Toutes Wilayas'}</span>
                </span>
              </div>
            </div>

            {/* Minimum Order Gauge Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Conditions Commande :</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                    0 DA HT (Achat Libre)
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">Mon Panier En Cours:</span>
                    <span className="text-emerald-400 font-mono">
                      {formatDA(cartTotalHT)} HT
                    </span>
                  </div>

                  <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 text-center text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5 shadow">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Aucun minimum imposé — Validez dès 1 article !</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Paiement : {wholesaler.paymentTerms}</span>
                <span className="font-bold text-slate-200">{wholesalerCartItems.length} article(s)</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. RACCOURCIS DE RECHERCHE STRATÉGIQUES (ACCUEIL CATALOGUE GROSSISTE) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">
              Raccourcis de Recherche Stratégiques B2B
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {(activeTradeFilter !== 'all' || activeVolumeFilter !== 'all' || showOnlyPromos) && (
              <button
                onClick={() => {
                  setActiveTradeFilter('all');
                  setActiveVolumeFilter('all');
                  setShowOnlyPromos(false);
                }}
                className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
              >
                Réinitialiser les filtres rapides
              </button>
            )}
          </div>
        </div>

        {/* RACCOURCI 1: PAR MÉTIER / ACTIVITÉ */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>1. Filtre par Métier / Activité Professional</span>
            </span>
            <span className="text-[10px] text-slate-400">Cliquez sur votre métier pour isoler vos produits phares</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TRADE_SHORTCUTS.map(trade => {
              const isActive = activeTradeFilter === trade.id;

              return (
                <button
                  key={trade.id}
                  onClick={() => {
                    setActiveTradeFilter(isActive ? 'all' : trade.id);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/60 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{trade.emoji}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                        isActive
                          ? 'bg-slate-950 text-amber-400 border-amber-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {trade.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-xs font-extrabold ${isActive ? 'text-slate-950' : 'text-white'}`}>
                      {trade.title}
                    </h4>
                    <p className={`text-[10px] mt-0.5 line-clamp-2 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                      {trade.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RACCOURCIS 2 & 3: CONDITIONNEMENT VOLUME + PROMOS & COMMANDE RAPIDE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          
          {/* RACCOURCI 2: PAR CONDITIONNEMENT / VOLUME */}
          <div className="md:col-span-2 space-y-2">
            <span className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-400" />
              <span>2. Filtre par Conditionnement / Volume</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {VOLUME_SHORTCUTS.map(vol => {
                const isActive = activeVolumeFilter === vol.id;

                return (
                  <button
                    key={vol.id}
                    onClick={() => setActiveVolumeFilter(vol.id)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-400 shadow'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{vol.label}</span>
                    <span className="text-[10px] font-mono opacity-80">({vol.badge})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RACCOURCI 3: PROMOS & DÉSTOCKAGE & COMMANDE RAPIDE */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>3. Offres Spéciales & Saisie Directe</span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setShowOnlyPromos(!showOnlyPromos)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  showOnlyPromos
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow'
                    : 'bg-slate-950 text-emerald-300 border-emerald-900/60 hover:bg-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Espace Promos ({enrichedProducts.filter(p => p.meta?.isPromo).length})</span>
              </button>

              <button
                onClick={() => setIsQuickOrderOpen(true)}
                className="py-2 px-3 bg-slate-950 text-amber-300 border border-amber-800 hover:border-amber-500 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Saisie rapide par référence"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Réf / Excel</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 3. ARBORESCENCE PRINCIPALE (MENU NAVIGATION CATEGORIES) + CATALOG GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR: ARBORESCENCE DE NAVIGATION CATEGORIES (LES 6 CATEGORIES MAJEURES) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 sticky top-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Menu Navigation Catalogue
                </h4>
              </div>
              
              {selectedCategoryKey !== 'all' && (
                <button
                  onClick={() => {
                    setSelectedCategoryKey('all');
                    setSelectedSubCategory('all');
                  }}
                  className="text-[10px] text-amber-400 hover:underline font-bold"
                >
                  Tout Voir
                </button>
              )}
            </div>

            {/* Search Input for catalog */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Chercher dans le catalogue..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Tree Navigation List */}
            <div className="space-y-1 pt-1">
              {/* All Category Button */}
              <button
                onClick={() => {
                  setSelectedCategoryKey('all');
                  setSelectedSubCategory('all');
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                  selectedCategoryKey === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:bg-slate-950 hover:text-white'
                }`}
              >
                <span>📦 Tous les Produits</span>
                <span className="font-mono text-[10px] bg-slate-950/20 px-2 py-0.5 rounded font-bold">
                  {enrichedProducts.length}
                </span>
              </button>

              {/* The 6 Main Categories */}
              {MAIN_CATALOG_TREE.map(cat => {
                const isSelected = selectedCategoryKey === cat.key;
                const catProductsCount = enrichedProducts.filter(p => p.meta?.mainCategoryKey === cat.key).length;

                return (
                  <div key={cat.key} className="space-y-1">
                    <button
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCategoryKey('all');
                          setSelectedSubCategory('all');
                        } else {
                          setSelectedCategoryKey(cat.key);
                          setSelectedSubCategory('all');
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 text-amber-300 border border-amber-500/50'
                          : 'text-slate-300 hover:bg-slate-950 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span className="line-clamp-1">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                          {catProductsCount}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-amber-400' : 'text-slate-500'}`} />
                      </div>
                    </button>

                    {/* SubCategories Tree under selected Main Category */}
                    {isSelected && (
                      <div className="pl-4 space-y-1 border-l-2 border-amber-500/40 my-1 animate-fadeIn">
                        <button
                          onClick={() => setSelectedSubCategory('all')}
                          className={`w-full p-1.5 rounded-lg text-left text-[11px] font-bold transition-all cursor-pointer ${
                            selectedSubCategory === 'all'
                              ? 'text-amber-300 bg-slate-950'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          • Tout {cat.name}
                        </button>

                        {cat.subCategories.map(sub => {
                          const isSubSelected = selectedSubCategory === sub.name;
                          const subCount = enrichedProducts.filter(p => p.meta?.mainCategoryKey === cat.key && p.meta?.subCategory === sub.name).length;

                          return (
                            <button
                              key={sub.name}
                              onClick={() => setSelectedSubCategory(sub.name)}
                              className={`w-full p-1.5 rounded-lg text-left text-[11px] font-medium flex justify-between items-center transition-all cursor-pointer ${
                                isSubSelected
                                  ? 'text-amber-400 font-bold bg-slate-950 border border-amber-500/30'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <span className="line-clamp-1">• {sub.name}</span>
                              <span className="text-[9px] font-mono text-slate-500">{subCount}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* MAIN AREA: PRODUCTS CATALOG GRID */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Active Filter Summary Bar */}
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white">
                Catalogue : {filteredProducts.length} produit(s) disponible(s)
              </span>

              {selectedCategoryKey !== 'all' && (
                <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded text-[11px] font-bold">
                  Catégorie : {MAIN_CATALOG_TREE.find(c => c.key === selectedCategoryKey)?.name}
                </span>
              )}

              {selectedSubCategory !== 'all' && (
                <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[11px] font-bold">
                  {selectedSubCategory}
                </span>
              )}

              {activeTradeFilter !== 'all' && (
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                  Métier: {TRADE_SHORTCUTS.find(t => t.id === activeTradeFilter)?.title}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              Tarifs HT Directs Grossiste
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-300">Aucun produit ne correspond à ces critères.</h4>
              <p className="text-xs text-slate-500">
                Essayez d'effacer les filtres par métier ou changez de catégorie.
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryKey('all');
                  setSelectedSubCategory('all');
                  setActiveTradeFilter('all');
                  setActiveVolumeFilter('all');
                  setShowOnlyPromos(false);
                  setCatalogSearch('');
                }}
                className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Réinitialiser le catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const selectedQty = qtySelectionMap[product.id] || product.minOrderQty || 1;
                const inCartItem = wholesalerCartItems.find(item => item.product.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden hover:border-amber-500/60 transition-all shadow-lg group"
                  >
                    {/* Top Promo Badge */}
                    {product.meta?.isPromo && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <Tag className="w-3 h-3 fill-slate-950" />
                          <span>{product.meta?.promoTag || 'Offre Spéciale'}</span>
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Image & Main Info */}
                      <div className="relative mb-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 right-2 bg-slate-950/90 backdrop-blur-sm text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
                          {product.unitType}
                        </span>
                      </div>

                      {/* Barcode & SKU */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded border border-slate-800">
                          SKU: {product.sku}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          EAN: {product.barcode}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-white text-sm line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      
                      {/* Price & Min Qty */}
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Prix Unitaire HT</span>
                          <span className="font-mono text-lg font-black text-amber-400">
                            {formatDA(product.priceHT)}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Commande Min.</span>
                          <span className="text-xs font-bold text-slate-200">
                            {product.minOrderQty} unité(s)
                          </span>
                        </div>
                      </div>

                      {/* In Cart Status */}
                      {inCartItem && (
                        <div className="bg-emerald-950/40 border border-emerald-800/60 p-2 rounded-xl text-[11px] text-emerald-300 font-bold flex justify-between items-center">
                          <span>Déjà dans votre panier:</span>
                          <span className="font-mono">{inCartItem.quantity} x {formatDA(product.priceHT)}</span>
                        </div>
                      )}

                      {/* Quantity Stepper & Add Button */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shrink-0">
                          <button
                            onClick={() => handleQtyChange(product.id, selectedQty - 1)}
                            className="px-2.5 py-1.5 text-slate-400 hover:text-white font-bold text-xs"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={selectedQty}
                            onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value, 10) || 1)}
                            className="w-10 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleQtyChange(product.id, selectedQty + 1)}
                            className="px-2.5 py-1.5 text-slate-400 hover:text-white font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onAddToCart(product, selectedQty)}
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Commander</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* QUICK ORDER MODAL */}
      <QuickOrderModal
        products={wholesalerProducts}
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        onAddToCart={onAddToCart}
      />

    </div>
  );
};
