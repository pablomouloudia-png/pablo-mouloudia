import React from 'react';
import { X, Printer, FileText, Building2, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { formatDA } from '../utils/formatters';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <FileText className="w-5 h-5" />
            <span>Document Commercial B2B Officiel - Réglementation Algérienne</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer Facture / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Box */}
        <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg font-sans text-xs sm:text-sm border border-slate-200 printable-area">
          {/* Header Document */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-6 h-6 text-emerald-700" />
                <span>{order.sellerName}</span>
              </div>
              <p className="text-slate-500 text-xs mt-1">Secteur Agroalimentaire Algérie</p>
              <p className="text-slate-500 text-xs">Plateforme AgriSupply B2B</p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-2">
                FACTURE B2B N° {order.orderNumber}
              </span>
              <p className="text-slate-600 text-xs">Date d'émission : <span className="font-semibold text-slate-900">{order.orderDate}</span></p>
              <p className="text-slate-600 text-xs">Livraison prévue : <span className="font-semibold text-slate-900">{order.expectedDeliveryDate}</span></p>
            </div>
          </div>

          {/* Legal Identifiers & Parties Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-1">
              <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider mb-2">Fournisseur / Émetteur :</h4>
              <p className="font-bold text-slate-900 text-sm">{order.sellerName}</p>
              <p className="text-slate-600 text-xs">Rôle : {order.sellerRole === 'usine' ? 'Usine / Transformateur' : 'Grossiste Distributeur'}</p>
              <div className="text-[11px] text-slate-700 font-mono pt-1 space-y-0.5 border-t border-slate-200 mt-2">
                <div>RC : <span className="font-bold">16/00-0198421B16</span></div>
                <div>NIF : <span className="font-bold">000206019842165</span></div>
                <div>NIS : <span className="font-bold">000206010042</span></div>
                <div>Article d'imposition : <span className="font-bold">06011892014</span></div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-1">
              <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">Acheteur / Destinataire :</h4>
              <p className="font-bold text-slate-900 text-sm">{order.buyerName}</p>
              <p className="text-slate-600 text-xs">Rôle : {order.buyerRole === 'grossiste' ? 'Grossiste Distributeur' : 'Détaillant / Épicerie'}</p>
              <p className="text-slate-600 text-xs mt-1">Adresse de livraison :</p>
              <p className="text-slate-800 font-medium text-xs">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Order Details Table */}
          <div className="py-6">
            <h4 className="font-bold text-slate-800 mb-3 text-sm">Détail des Produits Agroalimentaires (Montants en Dinars DA)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-y border-slate-200">
                    <th className="py-2.5 px-3">Désignation Produit</th>
                    <th className="py-2.5 px-3 text-center">Conditionnement</th>
                    <th className="py-2.5 px-3 text-center">Qté</th>
                    <th className="py-2.5 px-3 text-right">P.U. HT (DA)</th>
                    <th className="py-2.5 px-3 text-right">TVA</th>
                    <th className="py-2.5 px-3 text-right">Total HT (DA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-medium text-slate-900">{item.productName}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{item.unitType}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-slate-700 font-mono">{formatDA(item.unitPriceHT)}</td>
                      <td className="py-3 px-3 text-right text-slate-600 font-mono">{item.vatRate}%</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">{formatDA(item.totalHT)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & B2B Payment Conditions */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-600 max-w-xs">
              <p className="font-semibold text-slate-800 mb-1">Modalités de Règlement (Marché Algérien) :</p>
              <p>• Mode de règlement : Chèque certifié / Virement CICE ou Espèces à la livraison.</p>
              <p>• Conforme aux directives sanitaires et normes IANOR.</p>
              {order.notes && (
                <p className="mt-2 italic bg-amber-50 p-2 rounded border border-amber-200 text-amber-900">
                  Notes : {order.notes}
                </p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 w-full sm:w-72 space-y-2 text-right">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total HT :</span>
                <span className="font-semibold text-slate-900 font-mono">{formatDA(order.totalHT)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total TVA (9% / 19%) :</span>
                <span className="font-semibold text-slate-900 font-mono">{formatDA(order.totalTVA)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
                <span>Total TTC :</span>
                <span className="text-emerald-700 text-base font-mono font-extrabold">{formatDA(order.totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* Footer certification badge */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Document conforme à la législation commerciale algérienne • Généré par AgriSupply B2B</span>
          </div>

        </div>
      </div>
    </div>
  );
};

