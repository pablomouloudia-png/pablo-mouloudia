import React, { useState, useEffect } from 'react';
import { X, Package, Scan, Plus, Save, RefreshCw, Upload, Image as ImageIcon, Check, Camera, Link as LinkIcon } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ALGERIAN_AGRO_CATEGORIES } from '../utils/formatters';

const PRESET_PRODUCT_IMAGES = [
  { name: 'Huiles & Olives', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Semoules & Pâtes', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Produits Laitiers', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { name: 'Jus & Boissons', url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Conserves & Tomate', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { name: 'Biscuits & Gaufrettes', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80' },
  { name: 'Café & Thé', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80' },
];

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  initialBarcode?: string;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  productToEdit,
  initialBarcode,
  onClose
}) => {
  const { addProduct, updateProduct, currentCompany, currentRole } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Huiles & Semoules',
    sku: '',
    barcode: '',
    unitType: 'Fardeau de 6 Bouteilles 1.5L',
    priceHT: 500,
    vatRate: 9,
    stockQuantity: 200,
    minOrderQty: 5,
    batchNumber: 'LOT-' + new Date().getFullYear() + '-001',
    expiryDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    origin: 'Algérie',
    isPublished: true
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        category: productToEdit.category,
        sku: productToEdit.sku,
        barcode: productToEdit.barcode,
        unitType: productToEdit.unitType,
        priceHT: productToEdit.priceHT,
        vatRate: productToEdit.vatRate,
        stockQuantity: productToEdit.stockQuantity,
        minOrderQty: productToEdit.minOrderQty,
        batchNumber: productToEdit.batchNumber,
        expiryDate: productToEdit.expiryDate,
        description: productToEdit.description,
        imageUrl: productToEdit.imageUrl,
        origin: productToEdit.origin,
        isPublished: productToEdit.isPublished
      });
    } else {
      setFormData({
        name: '',
        category: 'Huiles & Semoules',
        sku: `${currentRole === 'usine' ? 'US-DZ' : 'GO-DZ'}-${Math.floor(100 + Math.random() * 900)}`,
        barcode: initialBarcode || ('613' + Math.floor(1000000000 + Math.random() * 9000000000)),
        unitType: 'Fardeau de 6 Bouteilles',
        priceHT: 450.00,
        vatRate: 9,
        stockQuantity: 300,
        minOrderQty: 5,
        batchNumber: 'LOT-' + new Date().getFullYear() + '-DZ' + Math.floor(10 + Math.random() * 90),
        expiryDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        origin: 'Algérie',
        isPublished: true
      });
    }
  }, [productToEdit, initialBarcode, isOpen, currentRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productToEdit) {
      updateProduct(productToEdit.id, formData);
    } else {
      addProduct({
        ...formData,
        ownerId: currentCompany.id,
        ownerName: currentCompany.name,
        ownerRole: currentRole === 'usine' ? 'usine' : 'grossiste'
      });
    }
    onClose();
  };

  const handleGenerateBarcode = () => {
    setFormData(prev => ({
      ...prev,
      barcode: '613' + Math.floor(1000000000 + Math.random() * 9000000000)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <Package className="w-5 h-5" />
            <span>{productToEdit ? 'Modifier la Fiche Produit Agro' : 'Créer/Ajouter un Produit au Stock'}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Désignation Produit *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Huile Elio 5L (Fardeau de 4 Bouteilles)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Catégorie Agro *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {ALGERIAN_AGRO_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: SKU, Barcode, Unit Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Code SKU / Ref *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Code-barres EAN-13 *</label>
                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Générer
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.barcode}
                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Conditionnement / Colisage *</label>
              <input
                type="text"
                required
                value={formData.unitType}
                onChange={e => setFormData({ ...formData, unitType: e.target.value })}
                placeholder="ex: Fardeau de 4 Bouteilles"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Row 3: Price in DA, Stock, VAT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-emerald-400 font-bold mb-1">Prix Unitaire HT (Dinars DA) *</label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={formData.priceHT}
                onChange={e => setFormData({ ...formData, priceHT: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Quantité en Stock *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.stockQuantity}
                onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Taux TVA Algérie (%)</label>
              <select
                value={formData.vatRate}
                onChange={e => setFormData({ ...formData, vatRate: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
              >
                <option value={9}>9% (Taux Réduit Produits de Base)</option>
                <option value={19}>19% (Taux Normal)</option>
                <option value={0}>0% (Exonéré)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Traceability (Batch Number & DLUO Expiry Date) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">N° de Lot (Traçabilité) *</label>
              <input
                type="text"
                required
                value={formData.batchNumber}
                onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">DLC / DLUO *</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Origine / Wilaya</label>
              <input
                type="text"
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                placeholder="ex: Algérie - Béjaïa"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description & Image */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description Fiche Technique</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Spécifications techniques, normes IANOR, ingrédients..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Section Image Officielle du Produit */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold flex items-center gap-2 text-xs">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Image / Photo Officielle du Produit *</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Importation directe, URL ou Galerie
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Preview Thumbnail */}
              <div className="relative w-28 h-28 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shrink-0 flex items-center justify-center group shadow-md">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Aperçu du produit"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                ) : (
                  <div className="text-center p-2 text-slate-500">
                    <Camera className="w-7 h-7 mx-auto mb-1 text-slate-600" />
                    <span className="text-[9px]">Aperçu photo</span>
                  </div>
                )}
              </div>

              {/* Upload & Select Options */}
              <div className="flex-1 space-y-3 w-full">
                {/* File Upload Button */}
                <div>
                  <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-emerald-500/60 rounded-xl p-3 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Changer / Parcourir photo depuis mon PC / Téléphone</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Presets Gallery */}
                <div>
                  <p className="text-[11px] text-slate-400 font-medium mb-1.5">Ou choisir dans la banque d'images officielles agro :</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PRODUCT_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: preset.url }))}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
                          formData.imageUrl === preset.url
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {formData.imageUrl === preset.url && <Check className="w-3 h-3 text-emerald-400" />}
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct URL Input */}
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                    <LinkIcon className="w-3 h-3 text-slate-500" />
                    <span>Lien URL d'image web (optionnel) :</span>
                  </div>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {currentRole === 'grossiste' && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <label htmlFor="isPublished" className="text-slate-300 text-xs">
                Publier immédiatement dans le catalogue visible par les Détaillants
              </label>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Enregistrer Modifications' : 'Créer Produit'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

