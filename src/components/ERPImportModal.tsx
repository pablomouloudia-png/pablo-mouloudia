import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Database,
  RefreshCw,
  Server,
  Zap,
  Check,
  Code
} from 'lucide-react';
import { ERPSoftwarePreset, Product } from '../types';
import { formatDA } from '../utils/formatters';

interface ERPImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS: Record<ERPSoftwarePreset, { name: string; vendor: string; desc: string; ext: string }> = {
  pc_stock: {
    name: 'PC Stock (PC SOFT / Algérie)',
    vendor: 'Éditeur Local Algérie',
    desc: 'Export standard CSV/TXT depuis le logiciel PC Stock',
    ext: '.csv, .txt'
  },
  sage_dz: {
    name: 'Sage 100c / Sage DZ',
    vendor: 'Sage Commercial',
    desc: 'Export articles & prix de Sage Gestion Commerciale',
    ext: '.csv, .xlsx'
  },
  dlg_compta: {
    name: 'DLG Gestion & Compta',
    vendor: 'DLG Algérie',
    desc: 'Format d\'exportation de stock DLG NSI',
    ext: '.txt, .csv'
  },
  odoo_dz: {
    name: 'Odoo ERP (Module Stock DZ)',
    vendor: 'Odoo Open Source',
    desc: 'Export JSON / CSV du catalogue produits Odoo',
    ext: '.csv, .json'
  },
  excel_standard: {
    name: 'Fichier Excel / CSV Standard',
    vendor: 'Modèle Générique',
    desc: 'Modèle avec colonnes: Nom, SKU, CodeBarres, PrixHT, Stock',
    ext: '.csv, .xlsx'
  }
};

export const ERPImportModal: React.FC<ERPImportModalProps> = ({ isOpen, onClose }) => {
  const { currentCompany, addProduct } = useApp();
  const [selectedPreset, setSelectedPreset] = useState<ERPSoftwarePreset>('pc_stock');
  const [activeTab, setActiveTab] = useState<'file' | 'api' | 'template'>('file');
  
  const [importedRows, setImportedRows] = useState<Array<Partial<Product>>>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  // Simulated API Key State for direct Webhook sync
  const [apiKeyGenerated, setApiKeyGenerated] = useState(false);
  const [apiToken, setApiToken] = useState('agri_dz_live_' + Math.random().toString(36).substring(2, 10));
  const [isTestingSync, setIsTestingSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sample data simulating file parse result based on Algerian ERP inventory
  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    setTimeout(() => {
      // Simulate reading and parsing ERP file data
      const sampleParsedProducts: Array<Partial<Product>> = [
        {
          name: 'Lait Candia Silhouette UHT 1L (Carton de 12)',
          sku: 'CAND-SIL-1L-12',
          barcode: '6130005001012',
          category: 'Produits Laitiers & Fromages',
          unitType: 'Carton de 12 Briques',
          priceHT: 1560, // 130 DA / L
          vatRate: 9,
          stockQuantity: 450,
          minOrderQty: 5,
          batchNumber: 'LOT-2026-CAND-09',
          expiryDate: '2026-12-31',
          origin: 'Algérie (Akbou - Béjaïa)',
          description: 'Importé automatiquement depuis le logiciel de gestion de stock.',
          sourceERP: PRESETS[selectedPreset].name
        },
        {
          name: 'Conserve Harissa Aris 400g (Carton de 24)',
          sku: 'ARS-HAR-400-24',
          barcode: '6130006002015',
          category: 'Conserves & Sauces',
          unitType: 'Carton de 24 Boîtes 400g',
          priceHT: 3360, // 140 DA / boîte
          vatRate: 9,
          stockQuantity: 280,
          minOrderQty: 2,
          batchNumber: 'LOT-2026-HAR-12',
          expiryDate: '2028-05-15',
          origin: 'Algérie (Ngaous)',
          description: 'Pâte de piment fort traditionnel sous contrôle d\'hygiène strict.',
          sourceERP: PRESETS[selectedPreset].name
        },
        {
          name: 'Jus Ngaous Abricot 1L (Fardeau de 6 Bouteilles)',
          sku: 'NGA-ABR-1L-6',
          barcode: '6130007003018',
          category: 'Boissons, Gazouz & Eaux',
          unitType: 'Fardeau de 6 Bouteilles 1L',
          priceHT: 780, // 130 DA / bouteille
          vatRate: 19,
          stockQuantity: 600,
          minOrderQty: 10,
          batchNumber: 'LOT-2026-NGA-03',
          expiryDate: '2027-04-30',
          origin: 'Algérie (Batna)',
          description: 'Nectar de fruit d\'abricot pur.',
          sourceERP: PRESETS[selectedPreset].name
        },
        {
          name: 'Pâtes Alimentaires Couscous Safina 1kg (Sac de 10)',
          sku: 'SAF-COUS-1K-10',
          barcode: '6130008004021',
          category: 'Pâtes & Céréales',
          unitType: 'Sac de 10 Sachets 1kg',
          priceHT: 1100, // 110 DA / kg
          vatRate: 9,
          stockQuantity: 920,
          minOrderQty: 15,
          batchNumber: 'LOT-2026-SAF-88',
          expiryDate: '2027-10-31',
          origin: 'Algérie (Alger)',
          description: 'Couscous moyen traditionnel roulé à partir de semoule de blé dur.',
          sourceERP: PRESETS[selectedPreset].name
        }
      ];

      setImportedRows(sampleParsedProducts);
      setIsProcessing(false);
    }, 800);
  };

  const handleExecuteImport = () => {
    if (importedRows.length === 0) return;

    importedRows.forEach(row => {
      addProduct({
        ownerId: currentCompany.id,
        ownerName: currentCompany.name,
        ownerRole: currentCompany.role as 'usine' | 'grossiste',
        name: row.name || 'Produit sans nom',
        category: row.category || 'Épicerie',
        sku: row.sku || 'SKU-' + Math.floor(Math.random() * 100000),
        barcode: row.barcode || '613' + Math.floor(Math.random() * 1000000000),
        unitType: row.unitType || 'Colis',
        priceHT: row.priceHT || 100,
        vatRate: row.vatRate || 9,
        stockQuantity: row.stockQuantity || 100,
        minOrderQty: row.minOrderQty || 1,
        batchNumber: row.batchNumber || 'LOT-' + new Date().getFullYear(),
        expiryDate: row.expiryDate || '2027-12-31',
        description: row.description || 'Produit transféré depuis ERP ' + PRESETS[selectedPreset].name,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        origin: row.origin || 'Algérie',
        isPublished: true,
        sourceERP: PRESETS[selectedPreset].name
      });
    });

    setImportSuccessMessage(`${importedRows.length} produits ont été transférés avec succès dans votre catalogue !`);
    setTimeout(() => {
      setImportSuccessMessage(null);
      setImportedRows([]);
      setFileName(null);
      onClose();
    }, 2000);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = 
      "SKU;Nom_Produit;Code_Barres_EAN13;Categorie;Prix_HT_DA;Taux_TVA;Stock_Quantite;Unite;Numero_Lot;DLC_DLUO;Origine\n" +
      "CEV-ELIO-5L;Huile Elio 5L;6130001001015;Huiles & Semoules;650;9;500;Fardeau de 4;LOT-2026-01;2027-12-31;Algérie - Bejaia\n" +
      "ABM-TOM-800;Tomate Benamor 800g;6130002002021;Conserves & Sauces;240;9;300;Carton de 12;LOT-2026-88;2028-12-31;Algérie - Guelma\n" +
      "HAM-SEL-15L;Selecto Hamoud 1.5L;6130003001013;Boissons & Jus;95;19;1200;Fardeau de 6;LOT-2026-HB;2027-03-31;Algérie - Alger\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Modele_Import_Stock_ERP_AgriSupply_DZ.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestApiSync = () => {
    setIsTestingSync(true);
    setSyncStatus(null);
    setTimeout(() => {
      setIsTestingSync(false);
      setSyncStatus("Connecteur actif (200 OK) : Connexion établie avec le serveur de gestion local.");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-6 text-slate-100 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Importation Massique ERP & Logiciel de Stock</h2>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Marché Algérien
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transfert instantané de tous vos produits depuis PC Stock, Sage DZ, DLG, Odoo ou Excel vers la plateforme.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'file' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>1. Importer Fichier Fichier/CSV/Excel</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'api' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>2. Connecteur Webhook / API ERP Direct</span>
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'template' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Modèle Exemple gratuit (.CSV)</span>
          </button>
        </div>

        {/* Success Alert */}
        {importSuccessMessage && (
          <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-pulse">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{importSuccessMessage}</span>
          </div>
        )}

        {/* TAB 1: FILE UPLOAD */}
        {activeTab === 'file' && (
          <div className="space-y-5">
            {/* Logiciel ERP Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Sélectionnez votre logiciel de gestion de stock source :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(PRESETS) as ERPSoftwarePreset[]).map(key => {
                  const preset = PRESETS[key];
                  const isSelected = selectedPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPreset(key)}
                      className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white flex items-center justify-between">
                          <span>{preset.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{preset.vendor}</div>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{preset.desc}</p>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 mt-2 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 w-fit">
                        {preset.ext}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors relative cursor-pointer group">
              <input
                type="file"
                accept=".csv,.txt,.xlsx,.json"
                onChange={handleFileDrop}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">
                  Glissez-déposez le fichier d'export de votre logiciel ({PRESETS[selectedPreset].name})
                </div>
                <p className="text-[11px] text-slate-400">
                  Format supporté : CSV, Excel (.xlsx), TXT ou JSON • Détection automatique des colonnes
                </p>
                {fileName && (
                  <div className="mt-2 bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Fichier chargé : {fileName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Loader state */}
            {isProcessing && (
              <div className="py-6 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyse et structuration des articles du fichier ERP en cours...</span>
              </div>
            )}

            {/* Preview Parsed Items */}
            {importedRows.length > 0 && !isProcessing && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Aperçu des articles détectés ({importedRows.length} produits) :
                  </span>
                  <span className="text-slate-400">Prêts pour réplication dans le stock AgriSupply</span>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-400 sticky top-0 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Produit</th>
                        <th className="p-2.5">Code-barres / SKU</th>
                        <th className="p-2.5">Catégorie</th>
                        <th className="p-2.5 text-right">Prix HT (DA)</th>
                        <th className="p-2.5 text-center">TVA</th>
                        <th className="p-2.5 text-center">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {importedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-2.5 font-bold text-white">{row.name}</td>
                          <td className="p-2.5 font-mono text-slate-400 text-[11px]">{row.barcode}</td>
                          <td className="p-2.5 text-slate-300">{row.category}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-400">{formatDA(row.priceHT || 0)}</td>
                          <td className="p-2.5 text-center font-mono text-slate-300">{row.vatRate}%</td>
                          <td className="p-2.5 text-center font-bold text-amber-400">{row.stockQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setImportedRows([]);
                      setFileName(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Annuler
                  </button>

                  <button
                    onClick={handleExecuteImport}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Valider & Transférer {importedRows.length} Produits</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: API CONNECTOR */}
        {activeTab === 'api' && (
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Synchronisation Automatique Directe via Webhook / API ERP</h3>
                <p className="text-xs text-slate-400">
                  Connectez directement votre serveur PC Stock ou Sage DZ pour mettre à jour automatiquement les stocks sans manipuler de fichiers.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Endpoint Webhook de votre instance :</label>
                <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-300">
                  <span className="text-emerald-400 font-bold">POST</span>
                  <span>https://agrisupply.dz/api/v1/erp/sync/{currentCompany.id}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clé API d'accès sécurisé :</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiToken}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-amber-300 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setApiToken('agri_dz_live_' + Math.random().toString(36).substring(2, 10));
                      setApiKeyGenerated(true);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700"
                  >
                    Régénérer Clé
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Fréquence de sync conseillée : <span className="text-white font-semibold">Toutes les 15 minutes</span>
                </div>

                <button
                  onClick={handleTestApiSync}
                  disabled={isTestingSync}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  {isTestingSync ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                  <span>Tester la Connexion API ERP</span>
                </button>
              </div>

              {syncStatus && (
                <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{syncStatus}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SAMPLE TEMPLATE DOWNLOAD */}
        {activeTab === 'template' && (
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Télécharger le Modèle Excel / CSV Standardisé</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Si vous n'utilisez pas de logiciel ERP, complétez simplement ce fichier Excel et importez-le.
                </p>
              </div>

              <button
                onClick={handleDownloadSampleCSV}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger Modèle .CSV Exemple</span>
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-emerald-400 block">Structure des colonnes du fichier :</span>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• SKU (Référence)</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Nom_Produit</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Code_Barres_EAN13</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Categorie</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Prix_HT_DA</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Taux_TVA (9 ou 19)</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Stock_Quantite</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Unite (Fardeau/Colis)</li>
                <li className="bg-slate-950 p-1.5 rounded border border-slate-800">• Numero_Lot</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
