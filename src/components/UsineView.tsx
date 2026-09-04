import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompanyProfileView } from './CompanyProfileView';
import { ProductFormModal } from './ProductFormModal';
import { InvoiceModal } from './InvoiceModal';
import { ERPImportModal } from './ERPImportModal';
import { DouchetteScannerModal } from './DouchetteScannerModal';
import { CommercialManagementModule } from './CommercialManagementModule';
import {
  Factory,
  Package,
  FileText,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Users,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Upload,
  Scan,
  TrendingUp
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { formatDA } from '../utils/formatters';

export const UsineView: React.FC = () => {
  const { currentCompany, getProductsForRole, deleteProduct, orders, updateOrderStatus, getWholesalers } = useApp();
  const [activeTab, setActiveTab] = useState<'stock' | 'presentation' | 'orders' | 'network' | 'gestion_commerciale'>('stock');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isERPModalOpen, setIsERPModalOpen] = useState(false);
  const [isDouchetteModalOpen, setIsDouchetteModalOpen] = useState(false);
  const [initialBarcodeForNewProduct, setInitialBarcodeForNewProduct] = useState<string>('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const products = getProductsForRole() || [];
  const wholesalers = getWholesalers() || [];

  const companyId = currentCompany?.id || '';

  // Orders received by this Usine from Wholesalers
  const usineOrders = (orders || []).filter(o => o && o.sellerId === companyId);

  // Filter products
  const filteredProducts = products.filter(p => {
    const s = (searchTerm || '').toLowerCase();
    const matchesSearch = (p.name || '').toLowerCase().includes(s) ||
                          (p.sku || '').toLowerCase().includes(s) ||
                          (p.barcode || '').toLowerCase().includes(s) ||
                          (p.batchNumber || '').toLowerCase().includes(s);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Low stock warning
  const lowStockProducts = products.filter(p => p.stockQuantity < 20);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner for Factory */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/80 rounded-2xl p-6 text-slate-100 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Factory className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                Abonnement Usine Pro
              </span>
              <span className="text-xs text-slate-400 font-mono">Agrément HACCP/Wilaya: {currentCompany?.haccpNumber || 'DZ 16.001.2024 CE'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">{currentCompany?.name || 'Espace Usine'}</h1>
            <p className="text-xs text-slate-300">
              Espace de gestion industrielle : Stock de production, fiches techniques et commandes Grossistes.
            </p>
          </div>
        </div>

        {/* Action Buttons for ERP Import & Douchette */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsERPModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Import automatique depuis PC Stock, Sage DZ, Odoo..."
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Transfert ERP / CSV</span>
          </button>

          <button
            onClick={() => setIsDouchetteModalOpen(true)}
            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/60 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Introduction / Recherche par douchette code-barres"
          >
            <Scan className="w-4 h-4 text-emerald-400" />
            <span>Douchette Code-barres</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setInitialBarcodeForNewProduct('');
              setIsAddModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Produit</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'stock'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestion de Stock ({products.length})</span>
          {lowStockProducts.length > 0 && (
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {lowStockProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Commandes Grossistes ({usineOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('presentation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'presentation'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>Présentation de l'Usine</span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'network'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Réseau Grossistes Agréés ({wholesalers.length})</span>
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

      {/* TAB 1: GESTION DE STOCK */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          {/* Quick ERP import banner callout */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">
                Vous utilisez un logiciel de gestion (PC Stock, Sage DZ, Odoo, DLG) ? Transférez tout votre catalogue en 1 clic.
              </span>
            </div>

            <button
              onClick={() => setIsERPModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline shrink-0 cursor-pointer"
            >
              Lancer l'Import ERP →
            </button>
          </div>

          {/* Filters & Search */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher par nom, SKU, code-barres..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Produit Agro</th>
                    <th className="py-3 px-4">Ref / EAN</th>
                    <th className="py-3 px-4">Conditionnement</th>
                    <th className="py-3 px-4">Traçabilité Lot / DLUO</th>
                    <th className="py-3 px-4 text-right">Prix HT (DA)</th>
                    <th className="py-3 px-4 text-center">Stock Usine</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Aucun produit trouvé dans votre stock usine.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => (
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
                              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span>{p.category}</span>
                                {p.sourceERP && (
                                  <span className="bg-slate-800 text-slate-300 font-mono text-[9px] px-1.5 py-0.2 rounded border border-slate-700">
                                    Import {p.sourceERP}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          <div>SKU: {p.sku}</div>
                          <div className="text-[10px] text-emerald-400 font-bold">EAN: {p.barcode}</div>
                        </td>

                        <td className="py-3 px-4 text-slate-300 font-medium">
                          {p.unitType}
                        </td>

                        <td className="py-3 px-4">
                          <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 inline-block">
                            <div className="text-[10px] text-amber-300 font-mono font-bold">{p.batchNumber}</div>
                            <div className="text-[10px] text-slate-400">DLC/DLUO: {p.expiryDate}</div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-emerald-400 text-sm font-mono">
                          {formatDA(p.priceHT)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            p.stockQuantity < 20
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}>
                            {p.stockQuantity} unités
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Éditer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300"
                              title="Supprimer"
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

      {/* TAB 2: COMMANDES GROSSISTES */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Commandes d'Approvisionnement Reçues des Grossistes</h3>
            <p className="text-xs text-slate-400">
              Validez les commandes reçues des centrales grossistes, préparez les palettes et éditez les factures B2B en Dinars Algériens.
            </p>
          </div>

          <div className="space-y-4">
            {usineOrders.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                Aucune commande grossiste enregistrée pour le moment.
              </div>
            ) : (
              usineOrders.map(order => (
                <div key={order.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-emerald-400">{order.orderNumber}</span>
                        <span className="text-xs text-slate-400">• Reçue le {order.orderDate}</span>
                      </div>
                      <div className="text-xs text-white font-semibold mt-0.5">
                        Client Grossiste : <span className="text-emerald-300">{order.buyerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status selector */}
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-semibold"
                      >
                        <option value="en_attente">⏳ En attente validation</option>
                        <option value="validee">✓ Validée Usine</option>
                        <option value="en_preparation">📦 En préparation chaîne</option>
                        <option value="en_livraison">🚚 Expédiée Camion Frigo</option>
                        <option value="livree">🏁 Livrée Grossiste</option>
                      </select>

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Facture B2B (DA)</span>
                      </button>
                    </div>
                  </div>

                  {/* Order items summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-2">Produits Commandés :</span>
                      <ul className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-slate-300 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
                            <span>{item.productName} ({item.quantity}x)</span>
                            <span className="font-bold text-emerald-400 font-mono">{formatDA(item.totalHT)} HT</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-right font-mono">
                      <div className="text-slate-400">Total HT : <span className="font-bold text-white">{formatDA(order.totalHT)}</span></div>
                      <div className="text-slate-400">TVA (9%) : <span className="text-slate-300">{formatDA(order.totalTVA)}</span></div>
                      <div className="text-emerald-400 font-bold text-sm pt-1 border-t border-slate-800">
                        Total TTC : {formatDA(order.totalTTC)}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 text-left font-sans">
                        Adresse expédition : {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PRÉSENTATION DE L'USINE */}
      {activeTab === 'presentation' && (
        <CompanyProfileView company={currentCompany} isEditable={true} />
      )}

      {/* TAB 4: RÉSEAU GROSSISTES */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white">Centrales Grossistes & Distributeurs Partenaires</h3>
            <p className="text-xs text-slate-400">
              Liste des grossistes habilités à distribuer vos produits sur leurs secteurs régionaux en Algérie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wholesalers.map(g => (
              <div key={g.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-bold">
                    Grossiste Partenaire
                  </span>
                  <span className="text-xs text-slate-400 font-mono">RC: {g.rcNumber || '16/00-0198421B16'}</span>
                </div>

                <h4 className="font-bold text-white text-base">{g.name}</h4>
                <p className="text-xs text-slate-300">{g.slogan}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{g.description}</p>

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-1">
                  <div>Wilayas desservies : <span className="text-slate-200 font-semibold">{g.deliveryZones.join(', ')}</span></div>
                  <div>Conditions : <span className="text-emerald-400 font-semibold">{g.paymentTerms}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

