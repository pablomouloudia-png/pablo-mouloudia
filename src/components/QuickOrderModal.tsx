import React, { useState } from 'react';
import { X, Search, FileSpreadsheet, Plus, Check, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { formatDA } from '../utils/formatters';

interface QuickOrderModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  products,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'paste'>('search');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQtyMap, setSelectedQtyMap] = useState<Record<string, number>>({});
  const [addedSuccessMsg, setAddedSuccessMsg] = useState<string | null>(null);

  // Paste / File import state
  const [pastedContent, setPastedContent] = useState('');
  const [parsedLines, setParsedLines] = useState<{
    raw: string;
    product?: Product;
    qty: number;
    found: boolean;
  }[]>([]);

  if (!isOpen) return null;

  // Filter products for quick search
  const filteredProducts = searchQuery.trim() === ''
    ? products.slice(0, 8)
    : products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleQtyChange = (productId: string, qty: number) => {
    setSelectedQtyMap(prev => ({
      ...prev,
      [productId]: Math.max(1, qty)
    }));
  };

  const handleAddSingle = (product: Product) => {
    const qty = selectedQtyMap[product.id] || product.minOrderQty || 1;
    onAddToCart(product, qty);
    setAddedSuccessMsg(`Ajouté: ${qty}x ${product.name}`);
    setTimeout(() => setAddedSuccessMsg(null), 3000);
  };

  // Parse pasted text/Excel (Formats supported: "SKU, Qty" or "Barcode Qty" or "SKU")
  const handleParsePastedText = () => {
    const lines = pastedContent.split('\n').filter(l => l.trim().length > 0);
    const parsed = lines.map(line => {
      const parts = line.split(/[\t,;:]+/).map(p => p.trim());
      const codeCandidate = parts[0] || '';
      let qty = parts[1] ? parseInt(parts[1], 10) : 1;
      if (isNaN(qty) || qty <= 0) qty = 1;

      // Find product by SKU or Barcode or exact Name match
      const matched = products.find(p =>
        p.sku.toLowerCase() === codeCandidate.toLowerCase() ||
        p.barcode.toLowerCase() === codeCandidate.toLowerCase() ||
        p.name.toLowerCase().includes(codeCandidate.toLowerCase())
      );

      return {
        raw: line,
        product: matched,
        qty: matched ? Math.max(qty, matched.minOrderQty || 1) : qty,
        found: !!matched
      };
    });

    setParsedLines(parsed);
  };

  const handleAddAllParsed = () => {
    let count = 0;
    parsedLines.forEach(item => {
      if (item.product && item.found) {
        onAddToCart(item.product, item.qty);
        count++;
      }
    });

    if (count > 0) {
      setAddedSuccessMsg(`${count} référence(s) ajoutée(s) au panier en 1-clic !`);
      setTimeout(() => {
        setAddedSuccessMsg(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Commande Rapide par Référence / Fichier</h3>
              <p className="text-xs text-slate-400">Saisissez vos références (SKU, EAN) ou collez votre liste pour remplir le panier en 30 secondes.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Saisie Rapide Référence / Douchette</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Coller Liste / Fichier Excel</span>
          </button>
        </div>

        {/* Notification Toast */}
        {addedSuccessMsg && (
          <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 p-3 m-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{addedSuccessMsg}</span>
          </div>
        )}

        {/* Tab 1: Direct SKU / Barcode Quick Search */}
        {activeTab === 'search' && (
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tapez un SKU (ex: DIS-ELIO-5L-UN), Code-barres EAN (ex: 6130001001015) ou Nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold px-1">
                <span>Résultats rapides ({filteredProducts.length})</span>
                <span>Prix HT / Unité</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                  Aucun produit ne correspond à cette référence.
                </div>
              ) : (
                filteredProducts.map(prod => {
                  const qty = selectedQtyMap[prod.id] || prod.minOrderQty || 1;

                  return (
                    <div
                      key={prod.id}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 hover:border-amber-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-lg bg-slate-900 border border-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-slate-900 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-slate-800">
                              SKU: {prod.sku}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">EAN: {prod.barcode}</span>
                          </div>
                          <h4 className="font-extrabold text-white text-xs mt-1">{prod.name}</h4>
                          <span className="text-[10px] text-slate-400">{prod.unitType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-mono font-black text-amber-400 text-xs block">
                            {formatDA(prod.priceHT)}
                          </span>
                          <span className="text-[10px] text-slate-500">Min: {prod.minOrderQty}</span>
                        </div>

                        {/* Qty Selector */}
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleQtyChange(prod.id, qty - 1)}
                            className="px-2 py-1 text-slate-400 hover:text-white font-bold text-xs"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={qty}
                            onChange={(e) => handleQtyChange(prod.id, parseInt(e.target.value, 10) || 1)}
                            className="w-12 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleQtyChange(prod.id, qty + 1)}
                            className="px-2 py-1 text-slate-400 hover:text-white font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddSingle(prod)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shadow"
                          title="Ajouter au panier"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">Ajouter</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Paste List / Excel text */}
        {activeTab === 'paste' && (
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Collez vos données (Format: SKU ou Code-Barres, Quantité)
              </label>
              <p className="text-[11px] text-slate-400">
                Exemple:
                <br />
                <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">DIS-ELIO-5L-UN, 10</code>
                <br />
                <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">6130003001013, 5</code>
              </p>
              <textarea
                rows={5}
                placeholder="DIS-ELIO-5L-UN, 10&#10;6130003001013, 5&#10;DIS-FARINE-25K, 2"
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-amber-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleParsePastedText}
              disabled={!pastedContent.trim()}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Analyse & Identifier les Produits ({pastedContent.split('\n').filter(l => l.trim()).length} lignes)</span>
            </button>

            {/* Parsed List Results */}
            {parsedLines.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>Résultat du traitement ({parsedLines.filter(p => p.found).length} / {parsedLines.length} identifiés)</span>
                  {parsedLines.some(p => p.found) && (
                    <button
                      onClick={handleAddAllParsed}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Ajouter Tout au Panier</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {parsedLines.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        item.found
                          ? 'bg-emerald-950/20 border-emerald-800/80 text-slate-200'
                          : 'bg-rose-950/20 border-rose-900/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.found ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-mono text-[11px] font-bold text-amber-300">{item.raw}</div>
                          {item.product && (
                            <div className="font-extrabold text-white text-xs mt-0.5">
                              {item.product.name} ({item.product.unitType})
                            </div>
                          )}
                        </div>
                      </div>

                      {item.product && (
                        <div className="text-right font-mono font-bold text-amber-400">
                          {item.qty} x {formatDA(item.product.priceHT)} = {formatDA(item.qty * item.product.priceHT)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
