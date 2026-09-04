import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PreloaderProps {
  isSceneWarmed?: boolean;
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ isSceneWarmed = false, onComplete }) => {
  const { active, progress: assetProgress, loaded, total } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('SYSTEM INITIALIZATION // PREPARING TAKEOFF...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Force scroll restoration to manual and scroll to top on mount
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Strict Synchronization: Assets are ready ONLY when Drei loader reports 100% AND GPU has warmed shaders
  const isAssetsReady =
    !active &&
    (assetProgress >= 100 || (total > 0 && loaded >= total)) &&
    Boolean(isSceneWarmed);

  // Progress Timer & Telemetry Sequencer
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        // If 3D models and gates are still loading in the background, hold at 92% max!
        const maxCap = isAssetsReady ? 100 : 92;
        const step = isAssetsReady ? (prev >= 92 ? 2 : 1) : 1;
        const next = Math.min(prev + step, maxCap);

        // Dynamic Telemetry Status Messages
        if (next < 25) {
          setStatusMessage('SYSTEM INITIALIZATION // PREPARING TAKEOFF...');
        } else if (next < 50) {
          setStatusMessage('TAKING OFF // ASCENDING TO 10,000M STRATOSPHERE...');
        } else if (next < 75) {
          setStatusMessage('PRE-FLIGHT // CACHING 3D DATA DECKS & SILICON SUBSTRATE...');
        } else if (next < 95) {
          setStatusMessage('APPROACHING FACILITY // SYNCHRONIZING 3D AIRLOCK & GATE...');
        } else if (next < 100) {
          setStatusMessage('FINAL VERIFICATION // COMPILING HARDWARE MATRICES...');
        } else {
          setStatusMessage('TOUCHDOWN CONFIRMED // ALL 3D SYSTEMS ONLINE');
        }

        // When 100% is reached AND 3D assets are completely ready
        if (next >= 100 && isAssetsReady) {
          clearInterval(interval);
          setTimeout(() => {
            soundEngine.playClick(1200);
            setIsFadingOut(true);
            setTimeout(() => {
              onComplete();
            }, 600);
          }, 450);
        }

        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isAssetsReady, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F8F6F8] pointer-events-auto select-none transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Centered Luxury Glass Telemetry Console */}
      <div className="w-full max-w-md px-8 flex flex-col items-center text-center">
        {/* Animated Gyro Ring / Compass Badge */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-sun-gold/40 animate-spin flex items-center justify-center [animation-duration:8s]">
            <div className="w-14 h-14 rounded-full border border-border-subtle bg-white shadow-sm flex items-center justify-center">
              <Compass className="w-6 h-6 text-sun-gold animate-pulse" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sun-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sun-gold"></span>
          </span>
        </div>

        {/* System Identifier Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white shadow-xs border border-border-subtle text-[11px] font-label text-titanium mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-sun-gold" />
          <span>AETHER // 01 // ORCHESTRATION PROTOCOL</span>
        </div>

        {/* High-Precision Typography Progress Counter */}
        <div className="font-display text-6xl sm:text-7xl font-bold text-obsidian tracking-tight mb-2 flex items-baseline justify-center">
          <span>{displayProgress}</span>
          <span className="text-3xl text-sun-gold ml-1 font-mono">%</span>
        </div>

        {/* Dynamic Flight Telemetry Status Message */}
        <div className="h-6 flex items-center justify-center mb-6">
          <p className="font-mono text-xs text-titanium tracking-wider flex items-center gap-2 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-sun-gold animate-ping"></span>
            <span>{statusMessage}</span>
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full h-1.5 bg-border-subtle/60 rounded-full overflow-hidden shadow-inner p-0.5 relative">
          <div
            className="h-full bg-gradient-to-r from-sun-gold via-amber-400 to-warm-bronze rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(245,166,35,0.7)]"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Micro Telemetry Meta */}
        <div className="w-full flex justify-between items-center text-[10px] font-mono text-titanium/70 mt-3 px-1">
          <span>ALT: 10,000M</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sun-gold" />
            <span>
              {isAssetsReady
                ? 'ALL 3D MODELS PRELOADED'
                : `STREAMING 3D ASSETS (${Math.round(assetProgress)}%)`}
            </span>
          </span>
          <span>LATENCY: &lt;800NS</span>
        </div>
      </div>
    </div>
  );
};
