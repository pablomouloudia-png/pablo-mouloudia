import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Pour installer l'application sur votre téléphone Android : Ouvrez le menu de Chrome (3 petits points en haut à droite) et cliquez sur 'Installer l'application' ou 'Ajouter à l'écran d'accueil'.");
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      title="Installer ZF Agri sur votre écran d'accueil / smartphone"
      className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
    >
      <Download className="w-3.5 h-3.5 text-emerald-400" />
      <span className="hidden sm:inline">Installer l'App</span>
    </button>
  );
};
