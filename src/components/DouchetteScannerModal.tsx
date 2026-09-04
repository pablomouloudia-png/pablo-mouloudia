import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scan,
  Volume2,
  VolumeX,
  X,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Package,
  Zap,
  Camera,
  Keyboard,
  RotateCcw
} from 'lucide-react';
import { Product, DouchetteScanLog } from '../types';
import { formatDA } from '../utils/formatters';

interface DouchetteScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductFormWithBarcode?: (barcode: string) => void;
}

export const DouchetteScannerModal: React.FC<DouchetteScannerModalProps> = ({
  isOpen,
  onClose,
  onOpenProductFormWithBarcode
}) => {
  const { products, updateProduct, addToCart, currentRole } = useApp();
  const [scanMode, setScanMode] = useState<'stock' | 'cart'>('stock');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualBarcode, setManualBarcode] = useState('');
  
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scanLogs, setScanLogs] = useState<DouchetteScanLog[]>([]);
  const [lastMessage, setLastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Buffer for hardware douchette listener
  const keyBufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Play scanner beep sound using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // High pitch scanner beep
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Hardware Douchette Listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in a text input field directly
      if (document.activeElement?.tagName === 'INPUT' && document.activeElement !== inputRef.current) {
        return;
      }

      const now = Date.now();
      // Reset buffer if time between keystrokes is too long (douchette inputs rapidly < 50ms)
      if (now - lastKeyTimeRef.current > 200 && keyBufferRef.current.length > 0) {
        keyBufferRef.current = '';
      }
      lastKeyTimeRef.current = now;

      if (e.key === 'Enter') {
        if (keyBufferRef.current.length >= 3) {
          processScannedBarcode(keyBufferRef.current);
          keyBufferRef.current = '';
        }
      } else if (e.key.length === 1) {
        keyBufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, products, scanMode]);

  if (!isOpen) return null;

  const processScannedBarcode = (barcode: string) => {
    const cleanCode = barcode.trim();
    if (!cleanCode) return;

    playBeep();

    const found = products.find(p => p.barcode === cleanCode || p.sku.toLowerCase() === cleanCode.toLowerCase());

    if (found) {
      setScannedProduct(found);

      if (scanMode === 'cart') {
        addToCart(found, 1);
        setLastMessage({
          text: `[Scanné] ${found.name} ajouté au panier avec succès (+1)`,
          type: 'success'
        });
      } else {
        setLastMessage({
          text: `[Scanné] Produit trouvé : ${found.name} (Stock actuel: ${found.stockQuantity})`,
          type: 'info'
        });
      }

      setScanLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          barcode: cleanCode,
          status: scanMode === 'cart' ? 'added_to_cart' : 'found',
          productName: found.name,
          quantityAdded: 1
        },
        ...prev.slice(0, 9)
      ]);
    } else {
      setScannedProduct(null);
      setLastMessage({
        text: `Code-barres ${cleanCode} non répertorié dans le catalogue.`,
        type: 'warning'
      });

      setScanLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          barcode: cleanCode,
          status: 'not_found'
        },
        ...prev.slice(0, 9)
      ]);
    }

    setManualBarcode('');
  };

  const handleAdjustStock = (delta: number) => {
    if (!scannedProduct) return;
    const newQty = Math.max(0, scannedProduct.stockQuantity + delta);
    updateProduct(scannedProduct.id, { stockQuantity: newQty });
    setScannedProduct({ ...scannedProduct, stockQuantity: newQty });
    setLastMessage({
      text: `Stock de "${scannedProduct.name}" mis à jour : ${newQty} unités`,
      type: 'success'
    });
  };

  // Preset sample barcodes for quick testing in preview without hardware douchette
  const sampleBarcodes = [
    { label: 'Huile Elio 5L', code: '6130001001015' },
    { label: 'Semoule Benamor 10kg', code: '6130002001014' },
    { label: 'Selecto Hamoud 1.5L', code: '6130003001013' },
    { label: 'Sucre Cevital 1kg', code: '6130001002029' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 animate-pulse">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Mode Saisie Rapide par Douchette Code-Barres</h2>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  EAN-13 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Branchez votre douchette USB/Bluetooth ou utilisez la saisie rapide pour scanner les produits instantanément.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={soundEnabled ? 'Désactiver le Bip Sonore' : 'Activer le Bip Sonore'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Mode Toggle */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setScanMode('stock')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              scanMode === 'stock'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mode Inventaire / Ajustement de Stock</span>
          </button>

          <button
            onClick={() => setScanMode('cart')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              scanMode === 'cart'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mode Scanner-vers-Panier B2B</span>
          </button>
        </div>

        {/* Input Barcode Section */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              Lecteur USB/Bluetooth à l'écoute... (Scannez votre code-barres)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              Bip Sonore: {soundEnabled ? 'ACTIF' : 'MUET'}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              processScannedBarcode(manualBarcode);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Entrez ou scannez un code-barres (ex: 6130001001015)..."
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
              <Keyboard className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg cursor-pointer shrink-0"
            >
              Simuler Bip Scanner
            </button>
          </form>

          {/* Quick Simulation Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Tester avec un code-barres algérien :</span>
            {sampleBarcodes.map((b) => (
              <button
                key={b.code}
                onClick={() => processScannedBarcode(b.code)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-mono hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Banner */}
        {lastMessage && (
          <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-3 ${
            lastMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
              : lastMessage.type === 'warning'
              ? 'bg-amber-950/80 border-amber-600 text-amber-200'
              : 'bg-blue-950/80 border-blue-600 text-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              {lastMessage.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{lastMessage.text}</span>
            </div>

            {lastMessage.type === 'warning' && onOpenProductFormWithBarcode && (
              <button
                onClick={() => {
                  onClose();
                  onOpenProductFormWithBarcode(manualBarcode || '613' + Math.floor(Math.random() * 1000000000));
                }}
                className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-[11px] hover:bg-amber-400 shrink-0"
              >
                Créer ce Produit (+ EAN-13)
              </button>
            )}
          </div>
        )}

        {/* Scanned Product Active Card */}
        {scannedProduct && (
          <div className="bg-slate-950 rounded-xl border border-emerald-500/50 p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={scannedProduct.imageUrl}
                  alt={scannedProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-700"
                />
                <div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                    {scannedProduct.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{scannedProduct.name}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    SKU: {scannedProduct.sku} • EAN: <span className="text-emerald-400 font-bold">{scannedProduct.barcode}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">{formatDA(scannedProduct.priceHT)} <span className="text-xs text-slate-400">HT</span></div>
                <div className="text-[11px] text-slate-400">Conditionnement: {scannedProduct.unitType}</div>
              </div>
            </div>

            {/* Quick Stock Controls (Mode Stock) */}
            {scanMode === 'stock' && (
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Stock physique en magasin / usine :</div>
                  <div className="text-xl font-bold text-amber-400">{scannedProduct.stockQuantity} unités</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustStock(-10)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleAdjustStock(-1)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAdjustStock(1)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAdjustStock(10)}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
                  >
                    +10
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan Log History */}
        {scanLogs.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400">Historique des derniers scans douchette :</span>
            <div className="max-h-36 overflow-y-auto bg-slate-950 rounded-xl border border-slate-800 p-2 space-y-1">
              {scanLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs px-3 py-1.5 rounded bg-slate-900/60 font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    <span className="text-slate-300 font-bold">{log.barcode}</span>
                    {log.productName && <span className="text-emerald-400 font-sans font-medium">• {log.productName}</span>}
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    log.status === 'not_found'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {log.status === 'not_found' ? 'Inconnu' : log.status === 'added_to_cart' ? 'Panier (+1)' : 'Trouvé'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
