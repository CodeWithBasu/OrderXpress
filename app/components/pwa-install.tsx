'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function PWAInstall({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const isMobile = useIsMobile()
  
  useEffect(() => {
    // Determine if running as installed
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone === true);
    setIsStandalone(isPWA);

    // Watch for mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);

    // Register service worker if supported
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registration successful: ', registration.scope);
          },
          (err) => {
            console.log('SW registration failed: ', err);
          }
        );
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('To install the app, tap Share in your browser menu and select "Add to Home Screen".');
    }
  };

  // Do not render anything until we know the environment to avoid hydration mismatch
  if (isStandalone === null) {
    return <div className="min-h-screen bg-gray-50 dark:bg-zinc-900" />
  }

  // Only show the install wall if it's a mobile device AND not running as a standalone app
  if (!isStandalone && isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 transition-colors">
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
          <div className="flex justify-center">
            <img src="/icon-512x512.png" alt="OrderXpress Logo" className="w-32 h-32 rounded-3xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">OrderXpress</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">The fast & reliable way to manage orders.</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 p-4 rounded-2xl text-sm font-semibold border border-orange-200 dark:border-orange-500/20">
            For the best experience, please install this app to your Home Screen.
          </div>

          <button 
            onClick={handleInstallClick}
            className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-[0_8px_20px_rgba(249,115,22,0.3)]"
          >
            {deferredPrompt ? 'Install App' : 'How to Install'}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
