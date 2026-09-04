import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompanyProfileView } from './CompanyProfileView';
import { ProductFormModal } from './ProductFormModal';
import { InvoiceModal } from './InvoiceModal';
import { ERPImportModal } from './ERPImportModal';
import { DouchetteScannerModal } from './DouchetteScannerModal';
import { CommercialManagementModule } from './CommercialManagementModule';
import {
  Truck,
  Package,
  Factory,
  Store,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  ShoppingBag,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Building2,
  ArrowRight,
  TrendingUp,
  Percent,
  Upload,
  Scan
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { formatDA } from '../utils/formatters';

export const GrossisteView: React.FC = () => {
  const {
    currentCompany,
    getProductsForRole,
    togglePublishProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    getFactories,
    products,
    addToCart
  } = useApp();

  const [activeTab, setActiveTab] = useState<'warehouse_stock' | 'factory_buy' | 'retailer_orders' | 'presentation' | 'gestion_commerciale'>('warehouse_stock');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isERPModalOpen, setIsERPModalOpen] = useState(false);
  const [isDouchetteModalOpen, setIsDouchetteModalOpen] = useState(false);
  const [initialBarcodeForNewProduct, setInitialBarcodeForNewProduct] = useState<string>('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [factoryFilter, setFactoryFilter] = useState<string>('all');

  const myWarehouseProducts = getProductsForRole() || []; // Products owned by this Grossiste
  const factories = getFactories() || [];

  const companyId = currentCompany?.id || '';

  // Products from Usines available for Grossistes to buy
  const usineProducts = (products || []).filter(p => p && p.ownerRole === 'usine');

  // Orders received by this Grossiste from Détaillants
  const retailerOrdersReceived = (orders || []).filter(o => o && o.sellerId === companyId);

  // Orders placed by this Grossiste to Usines
  const myUsineOrdersPlaced = (orders || []).filter(o => o && o.buyerId === companyId);

  const filteredUsineProducts = usineProducts.filter(p => {
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch = (p.name || '').toLowerCase().includes(searchLower) ||
                          (p.barcode || '').toLowerCase().includes(searchLower) ||
                          (p.ownerName || '').toLowerCase().includes(searchLower);
    const matchesFactory = factoryFilter === 'all' || p.ownerId === factoryFilter;
    return matchesSearch && matchesFactory;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner for Wholesaler */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-800/80 rounded-2xl p-6 text-slate-100 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                Abonnement Grossiste Hub
              </span>
              <span className="text-xs text-slate-400 font-mono">
                RC: {currentCompany?.rc || currentCompany?.rcNumber || '16/00-0198421B16'} • Wilaya: {currentCompany?.region || currentCompany?.wilaya || '16 - Alger'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">{currentCompany?.name || 'Espace Grossiste'}</h1>
            <p className="text-xs text-slate-300">
              Intermédiaire Logistique Agroalimentaire : Achat Direct Usines & Vente Réseau Détaillants.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsERPModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/40 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Importation automatique depuis votre logiciel de gestion (PC Stock, Sage DZ, DLG)"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Transfert ERP / CSV</span>
          </button>

          <button
            onClick={() => setIsDouchetteModalOpen(true)}
            className="bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-600/60 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Lecture automatique douchette code-barres"
          >
            <Scan className="w-4 h-4 text-blue-400" />
            <span>Douchette Code-barres</span>
          </button>

          <button
            onClick={() => setActiveTab('factory_buy')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
          >
            <Factory className="w-4 h-4" />
            <span>Acheter aux Usines</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('warehouse_stock')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'warehouse_stock'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stock Entrepôt & Revente ({myWarehouseProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('factory_buy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'factory_buy'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>Acheter aux Usines (Espace Usines)</span>
        </button>

        <button
          onClick={() => setActiveTab('retailer_orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'retailer_orders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Commandes Détaillants ({retailerOrdersReceived.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('presentation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'presentation'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Présentation du Grossiste</span>
        </button>

        <button
          onClick={() => setActiveTab('gestion_commerciale')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'gestion_commerciale'
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
              : 'bg-slate-900 text-amber-300 border-amber-500/40 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Gestion Commerce, Fiscalité & RH</span>
        </button>
      </div>

      {/* TAB 1: STOCK ENTREPÔT & CATALOGUE REVANTE */}
      {activeTab === 'warehouse_stock' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Stock Entrepôt & Catalogue Revente Détaillants</h3>
              <p className="text-xs text-slate-400">
                Gérez vos prix de revente en Dinars (DA), votre marge et la visibilité des produits pour les détaillants.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setInitialBarcodeForNewProduct('');
                setIsAddModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit Grossiste</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Produit Revente</th>
                    <th className="py-3 px-4">Conditionnement</th>
                    <th className="py-3 px-4">Lot / Traçabilité</th>
                    <th className="py-3 px-4 text-right">Prix HT Détaillant (DA)</th>
                    <th className="py-3 px-4 text-center">Stock Entrepôt</th>
                    <th className="py-3 px-4 text-center">Visibilité Détaillant</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {myWarehouseProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Aucun produit enregistré en stock grossiste.
                      </td>
                    </tr>
                  ) : (
                    myWarehouseProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{p.name}</div>
                              <div className="text-[10px] text-blue-400">{p.category} • SKU: {p.sku}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-300 font-medium">
                          {p.unitType}
                        </td>

                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {p.batchNumber} (DLC: {p.expiryDate})
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-blue-400 text-sm font-mono">
                          {formatDA(p.priceHT)}
                        </td>

                        <td className="py-3 px-4 text-center font-bold">
                          <span className="bg-slate-950 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-full text-[11px]">
                            {p.stockQuantity}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePublishProduct(p.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 mx-auto transition-colors cursor-pointer ${
                              p.isPublished
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {p.isPublished ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Visible Détaillants</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Masqué</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACHETER AUX USINES */}
      {activeTab === 'factory_buy' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Espace Approvisionnement Usines / Transformateurs</h3>
              <p className="text-xs text-slate-400">
                Commandez directement en gros volumes (palettes, fardeaux) auprès des usines agréées algériennes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={factoryFilter}
                onChange={e => setFactoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Toutes les Usines Partenaires</option>
                {factories.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Factories Catalog Products Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsineProducts.map(prod => {
              const factory = factories.find(f => f.id === prod.ownerId);

              return (
                <div key={prod.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between hover:border-blue-700/80 transition-all">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-slate-950/90 backdrop-blur-sm text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                        {factory?.name}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-slate-950/90 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded">
                        Min. Usine: {formatDA(factory?.minOrderAmountHT || 0)} HT
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                        {prod.category} • {prod.origin}
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-1 text-xs mt-3">
                        <div className="flex justify-between text-slate-400">
                          <span>Conditionnement :</span>
                          <span className="font-semibold text-slate-200">{prod.unitType}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Traçabilité Lot :</span>
                          <span className="font-mono text-amber-300">{prod.batchNumber}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Stock Usine :</span>
                          <span className="font-bold text-emerald-400">{prod.stockQuantity} unités</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Prix Usine HT</span>
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">{formatDA(prod.priceHT)}</span>
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ajouter au Panier</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: COMMANDES DÉTAILLANTS */}
      {activeTab === 'retailer_orders' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white">Commandes Reçues des Détaillants / Épiceries</h3>
            <p className="text-xs text-slate-400">
              Préparez les colis et planifiez les tournées de livraison pour les commerces de proximité.
            </p>
          </div>

          <div className="space-y-4">
            {retailerOrdersReceived.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                Aucune commande de détaillant reçue pour le moment.
              </div>
            ) : (
              retailerOrdersReceived.map(order => (
                <div key={order.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-blue-400">{order.orderNumber}</span>
                        <span className="text-xs text-slate-400">• Passée le {order.orderDate}</span>
                      </div>
                      <div className="text-xs text-white font-semibold mt-0.5">
                        Client Détaillant : <span className="text-amber-300">{order.buyerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-semibold"
                      >
                        <option value="en_attente">⏳ En attente validation</option>
                        <option value="validee">✓ Validée Grossiste</option>
                        <option value="en_preparation">📦 En préparation camion</option>
                        <option value="en_livraison">🚚 En cours de tournée</option>
                        <option value="livree">🏁 Livrée au Magasin</option>
                      </select>

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Bon & Facture (DA)</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-2">Produits Demandés :</span>
                      <ul className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-slate-300 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                            <span>{item.productName} ({item.quantity}x)</span>
                            <span className="font-bold text-blue-400 font-mono">{formatDA(item.totalHT)} HT</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-right font-mono">
                      <div className="text-slate-400">Total HT : <span className="font-bold text-white">{formatDA(order.totalHT)}</span></div>
                      <div className="text-slate-400">TVA (9%) : <span className="text-slate-300">{formatDA(order.totalTVA)}</span></div>
                      <div className="text-blue-400 font-bold text-sm pt-1 border-t border-slate-800">
                        Total TTC : {formatDA(order.totalTTC)}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 text-left font-sans">
                        Livraison magasin : {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PRÉSENTATION DU GROSSISTE */}
      {activeTab === 'presentation' && (
        <CompanyProfileView company={currentCompany} isEditable={true} />
      )}

      {/* TAB 5: GESTION COMMERCIALE, FISCALITÉ & RH */}
      {activeTab === 'gestion_commerciale' && (
        <CommercialManagementModule currentCompany={currentCompany} />
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        productToEdit={editingProduct}
        initialBarcode={initialBarcodeForNewProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
          setInitialBarcodeForNewProduct('');
        }}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* ERP Import Modal */}
      <ERPImportModal
        isOpen={isERPModalOpen}
        onClose={() => setIsERPModalOpen(false)}
      />

      {/* Douchette Scanner Modal */}
      <DouchetteScannerModal
        isOpen={isDouchetteModalOpen}
        onClose={() => setIsDouchetteModalOpen(false)}
        onOpenProductFormWithBarcode={(barcode) => {
          setEditingProduct(null);
          setInitialBarcodeForNewProduct(barcode);
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
};

