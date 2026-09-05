'use client';

import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { ScrollytellingContainer } from './components/ScrollytellingContainer';
import { BlueprintModal } from './components/BlueprintModal';
import { Preloader } from './components/Preloader';
import { Project } from './types';
import { portfolioConfig } from './data/portfolioData';
import { Mail, Github, Linkedin, Copy, Check, X } from 'lucide-react';
import { soundEngine } from './utils/audio';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSceneWarmed, setIsSceneWarmed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const contactModalRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scrolling synchronized with GSAP ScrollTrigger
  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: !isTouch,
      touchMultiplier: isTouch ? 0 : 1.1,
      wheelMultiplier: 0.9,
      infinite: false,
    });

    (window as unknown as { lenis: Lenis }).lenis = lenis;

    // Connect Lenis scroll updates to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis directly via GSAP ticker for rock-solid frame synchronization
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  // Completely disable native touch-swipe scrolling on touch devices so only the joystick navigates
  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024);

    if (isTouch) {
      const preventTouchScroll = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        // Allow tap and internal scrolling ONLY inside modal popups (glass-panel), inputs, links, or buttons
        if (
          target &&
          (target.closest('.glass-panel') ||
            target.closest('button') ||
            target.closest('input') ||
            target.closest('a') ||
            target.closest('.select-text'))
        ) {
          return;
        }
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      document.body.style.overscrollBehavior = 'none';
      window.addEventListener('touchmove', preventTouchScroll, { passive: false });
      return () => {
        document.body.style.overscrollBehavior = 'auto';
        window.removeEventListener('touchmove', preventTouchScroll);
      };
    }
  }, []);

  // Control Lenis based on preloader state
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) {
      if (isLoading) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [isLoading]);

  // Always reset scroll to top on page load / reload and enforce on beforeunload
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isContactOpen && contactModalRef.current) {
      gsap.fromTo(
        contactModalRef.current,
        { scale: 0.92, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [isContactOpen]);

  const copyEmailToClipboard = () => {
    soundEngine.playClick(1000);
    navigator.clipboard.writeText(portfolioConfig.author.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="min-h-screen bg-alabaster text-obsidian selection:bg-sun-gold selection:text-white font-sans antialiased relative">
      {/* Flight Preloader Overlay (Blocks all interactions until 100% loaded & warmed) */}
      {isLoading && (
        <Preloader
          isSceneWarmed={isSceneWarmed}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Fixed Floating Navigation Pill */}
      <Navbar onContactClick={() => setIsContactOpen(true)} />

      {/* Main Scrollytelling 3D & UI Container */}
      <ScrollytellingContainer
        onInspectProject={(proj) => setSelectedProject(proj)}
        onCvClick={() => setIsContactOpen(true)}
        onWarmed={() => setIsSceneWarmed(true)}
      />

      {/* Blueprint Deep Inspection Drawer Modal */}
      <BlueprintModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Contact & Transmission Modal (Light Luxury Glass) */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md">
          <div
            ref={contactModalRef}
            className="glass-panel w-full max-w-lg rounded-3xl bg-white/95 p-5 sm:p-8 shadow-2xl relative border border-border-gold/40 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-border-subtle">
              <div className="pr-2">
                <span className="font-label text-[10px] sm:text-xs text-sun-gold tracking-widest uppercase font-semibold">
                  // SECURE TRANSMISSION CHANNEL
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-obsidian mt-0.5 sm:mt-1">
                  Initialize Comm Link
                </h3>
              </div>
              <button
                onClick={() => {
                  soundEngine.playClick(800);
                  setIsContactOpen(false);
                }}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-border-subtle hover:border-sun-gold text-titanium hover:text-obsidian cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-sans text-xs sm:text-sm text-titanium leading-relaxed mb-5 sm:mb-6">
              Connect directly for high-throughput distributed systems, autonomous AI/ML architectures, or technical leadership inquiries.
            </p>

            {/* Email Copy Box */}
            <div className="p-3.5 sm:p-4 bg-alabaster border border-border-subtle rounded-2xl mb-5 sm:mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <Mail className="w-4 h-4 text-sun-gold shrink-0" />
                <span className="font-mono text-xs sm:text-sm text-obsidian font-semibold truncate">
                  {portfolioConfig.author.email}
                </span>
              </div>
              <button
                onClick={copyEmailToClipboard}
                className="px-3 py-2 sm:py-1.5 min-h-[36px] bg-white border border-border-subtle hover:border-sun-gold rounded-lg text-xs font-label text-sun-gold font-medium flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-3 mb-5 sm:mb-6">
              <a
                href={portfolioConfig.author.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEngine.playClick(900)}
                className="btn-gold p-3 min-h-[44px] rounded-xl text-xs font-sans font-semibold uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>GITHUB</span>
              </a>
              <a
                href={portfolioConfig.author.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEngine.playClick(900)}
                className="btn-white-glass p-3 min-h-[44px] rounded-xl text-xs font-sans font-semibold uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Linkedin className="w-4 h-4 text-sun-gold" />
                <span>LINKEDIN</span>
              </a>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  soundEngine.playClick(700);
                  setIsContactOpen(false);
                }}
                className="font-label text-xs text-titanium hover:text-obsidian uppercase tracking-wider cursor-pointer py-2 min-h-[40px]"
              >
                [CLOSE_TRANSMISSION]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
