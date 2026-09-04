import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Zap, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanyProfile } from '../types';
import { formatDA } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, companies, currentCompany } = useApp();
  const [orderNotes, setOrderNotes] = useState<Record<string, string>>({});
  const [isSubmittingMap, setIsSubmittingMap] = useState<Record<string, boolean>>({});
  const [showMinNoticeMap, setShowMinNoticeMap] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Group cart items by seller / ownerId
  const itemsBySeller: Record<string, typeof cart> = {};
  cart.forEach(item => {
    const sellerId = item.product.ownerId;
    if (!itemsBySeller[sellerId]) {
      itemsBySeller[sellerId] = [];
    }
    itemsBySeller[sellerId].push(item);
  });

  const sellerIds = Object.keys(itemsBySeller);

  const handleCheckoutSeller = (sellerId: string, forceDerogation = false) => {
    setIsSubmittingMap(prev => ({ ...prev, [sellerId]: true }));
    setTimeout(() => {
      let notes = orderNotes[sellerId] || '';
      if (forceDerogation) {
        notes = (notes ? notes + ' | ' : '') + '[DEMANDE DE DÉROGATION - SOUS MINIMUM B2B]';
      }
      const newOrder = placeOrder(sellerId, notes);
      setIsSubmittingMap(prev => ({ ...prev, [sellerId]: false }));
      setShowMinNoticeMap(prev => ({ ...prev, [sellerId]: false }));
      if (newOrder) {
        onOrderSuccess(newOrder.orderNumber);
        onClose();
      }
    }, 400);
  };

  const handleAutoAdjustAndCheckout = (sellerId: string, targetMinHT: number) => {
    const sellerItems = itemsBySeller[sellerId];
    if (!sellerItems || sellerItems.length === 0) return;

    const currentTotalHT = sellerItems.reduce((sum, item) => sum + (item.product.priceHT * item.quantity), 0);
    if (currentTotalHT < targetMinHT && currentTotalHT > 0) {
      const ratio = Math.ceil(targetMinHT / currentTotalHT);
      sellerItems.forEach(item => {
        updateCartQuantity(item.product.id, item.quantity * ratio);
      });
    }

    // Now proceed to checkout
    handleCheckoutSeller(sellerId);
  };

  const handleValidateAll = () => {
    sellerIds.forEach(id => {
      const seller = companies.find(c => c.id === id);
      const items = itemsBySeller[id];
      const totalHT = items.reduce((sum, item) => sum + (item.product.priceHT * item.quantity), 0);
      const minHT = seller?.minOrderAmountHT || 0;
      
      if (totalHT < minHT) {
        handleCheckoutSeller(id, true);
      } else {
        handleCheckoutSeller(id, false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full p-6 text-slate-100 shadow-2xl flex flex-col justify-between overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <ShoppingBag className="w-5 h-5" />
              <span>Votre Panier de Commande B2B</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">Votre panier est vide</p>
              <p className="text-xs text-slate-500 mt-1">
                Explorez le catalogue des usines ou des grossistes pour passer commande.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sellerIds.map(sellerId => {
                const seller = companies.find(c => c.id === sellerId);
                const items = itemsBySeller[sellerId];
                const totalSellerHT = items.reduce((acc, i) => acc + (i.product.priceHT * i.quantity), 0);
                const minOrderHT = 0;
                const minOrderMet = true;
                const isSubmitting = isSubmittingMap[sellerId] || false;

                return (
                  <div key={sellerId} className="bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-lg space-y-4">
                    {/* Seller header info */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                          Fournisseur : {seller?.role === 'usine' ? 'Usine' : 'Grossiste'}
                        </span>
                        <h4 className="font-bold text-white text-sm">{seller?.name || 'Fournisseur'}</h4>
                        <p className="text-[11px] text-slate-400">Livraison sous {seller?.deliveryLeadDays || 2} jours</p>
                      </div>

                      <div className="text-right text-[11px] px-2.5 py-1 rounded-lg border bg-emerald-950/60 text-emerald-400 border-emerald-800 font-bold">
                        Achat Libre • Sans minimum
                      </div>
                    </div>

                    {/* Products list for this seller */}
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md border border-slate-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-semibold text-slate-200 truncate">{item.product.name}</h5>
                            <p className="text-[10px] text-slate-400">{item.product.unitType}</p>
                            <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                              {formatDA(item.product.priceHT)} HT
                            </div>
                          </div>

                          {/* Quantity control */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden text-xs">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 font-bold text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total & Order note input */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <input
                        type="text"
                        placeholder="Instructions de livraison (ex: Wilaya, quai de déchargement)..."
                        value={orderNotes[sellerId] || ''}
                        onChange={e => setOrderNotes({ ...orderNotes, [sellerId]: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />

                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span>Sous-total HT ({seller?.name}) :</span>
                        <span className="text-emerald-400 text-sm font-mono">{formatDA(totalSellerHT)} HT</span>
                      </div>

                      {/* Interactive Checkout Button */}
                      <button
                        onClick={() => handleCheckoutSeller(sellerId)}
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Validation de la commande en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Valider la Commande à {seller?.name || 'ce fournisseur'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={handleValidateAll}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 fill-slate-950" />
              <span>Tout Valider ({cart.length} article(s))</span>
            </button>

            <div className="flex items-center justify-between text-xs">
              <button
                onClick={clearCart}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vider le panier</span>
              </button>
              <span className="text-[11px] text-slate-400 font-medium">Paiement Chèque / Virement / Espèces B2B</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


