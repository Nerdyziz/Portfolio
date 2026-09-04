import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { World3DCanvas } from './3d/World3DCanvas';
import { SectorHero } from './SectorHero';
import { SectorDatacenter } from './SectorDatacenter';
import { SectorNeuralCore } from './SectorNeuralCore';
import { TouchJoystick } from './TouchJoystick';
import { Project } from '../types';

import { soundEngine } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

export const SHOWCASE_STATIONS = [
  { id: 'strato', progress: 0.040, name: '01. STRATOSPHERE' },
  { id: 'gate', progress: 0.200, name: '02. AIRLOCK GATE [READ]' },
  { id: 'rack1', progress: 0.340, name: '03. RACK 01 [READ]' },
  { id: 'rack2', progress: 0.440, name: '04. RACK 02 [READ]' },
  { id: 'rack3', progress: 0.540, name: '05. RACK 03 [READ]' },
  { id: 'chip', progress: 0.660, name: '06. SILICON CORE [READ]' },
  { id: 'terminal', progress: 0.830, name: '07. ARCHITECT LOGBOOK [READ]' },
  { id: 'takeoff', progress: 0.920, name: '08. RUNWAY TAKEOFF' },
];

interface ScrollytellingContainerProps {
  onInspectProject: (project: Project) => void;
  onCvClick: () => void;
}

export const ScrollytellingContainer: React.FC<ScrollytellingContainerProps> = ({
  onInspectProject,
  onCvClick
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    // Reset scroll to top on mount
    window.scrollTo(0, 0);
    setScrollProgress(0);

    const st = ScrollTrigger.create({
      trigger: scrollTrackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    let unsubscribe: (() => void) | undefined;
    const connectLenis = () => {
      const lenis = (window as unknown as { lenis?: any }).lenis;
      if (lenis && !unsubscribe) {
        unsubscribe = lenis.on('scroll', () => {
          ScrollTrigger.update();
        });
        return true;
      }
      return false;
    };

    if (!connectLenis()) {
      const timer = setInterval(() => {
        if (connectLenis()) clearInterval(timer);
      }, 50);
      setTimeout(() => clearInterval(timer), 3000);
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      st.kill();
    };
  }, []);

  // Play audio chimes at key cinematic events
  useEffect(() => {
    // Glass doors parting
    if (scrollProgress >= 0.742 && scrollProgress <= 0.746) {
      soundEngine.playClick(1300);
    }
    // Laptop screen activation & terminal boot
    if (scrollProgress >= 0.800 && scrollProgress <= 0.804) {
      soundEngine.playBoot();
    }
    // Runway online chime
    if (scrollProgress >= 0.875 && scrollProgress <= 0.879) {
      soundEngine.playClick(1400);
    }
    // Airplane liftoff thrust
    if (scrollProgress >= 0.895 && scrollProgress <= 0.899) {
      soundEngine.playSuccess();
    }
  }, [scrollProgress]);

  const [portalOpacity, setPortalOpacity] = useState(0);
  const isResettingRef = useRef(false);

  // Seamless portal transition: When camera dives deep into the laptop screen sky (>= 0.990),
  // we envelope in luminous clouds, instant-wrap to Section 1 (top: 0), and softly part the clouds!
  // ZERO reverse camera flight, ZERO low view, 100% forward portal transit into Space/Stratosphere.
  useEffect(() => {
    if (scrollProgress >= 0.990 && !isResettingRef.current) {
      isResettingRef.current = true;
      setPortalOpacity(1);

      // Instantly reset scroll to top (Section 1)
      const lenis = (window as unknown as { lenis?: any }).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);

      // Fade out the portal veil smoothly after arriving in Section 1
      window.setTimeout(() => {
        setPortalOpacity(0);
        window.setTimeout(() => {
          isResettingRef.current = false;
        }, 850);
      }, 150);

      // Do NOT clear timer in cleanup so the fade-out always executes!
    } else if (!isResettingRef.current) {
      if (scrollProgress >= 0.965) {
        setPortalOpacity(Math.min(1, (scrollProgress - 0.965) / 0.025));
      } else {
        setPortalOpacity(0);
      }
    }
  }, [scrollProgress]);

  // Helper function to calculate smooth opacity fade-in and fade-out
  const getOpacity = (startIn: number, peakIn: number, peakOut: number, endOut: number): number => {
    if (scrollProgress < startIn) return 0;
    if (scrollProgress >= startIn && scrollProgress < peakIn) {
      return (scrollProgress - startIn) / (peakIn - startIn);
    }
    if (scrollProgress >= peakIn && scrollProgress <= peakOut) {
      return 1;
    }
    if (scrollProgress > peakOut && scrollProgress <= endOut) {
      return 1 - (scrollProgress - peakOut) / (endOut - peakOut);
    }
    return 0;
  };

  // 1. SECTION 1: HERO (Cloud Stratosphere): 0% to 14%
  const heroOpacity = getOpacity(0.0, 0.0, 0.100, 0.140);

  // Subtle Cloud Veil during Stratosphere to Airlock Descent (9.0% to 17.0%)
  const cloudDiveOpacity = (() => {
    if (scrollProgress < 0.090 || scrollProgress > 0.170) return 0;
    const mid = 0.130;
    const dist = Math.abs(scrollProgress - mid) / 0.040;
    return Math.max(0, (1 - dist * dist) * 0.35);
  })();

  // 2. SECTION 2: THE DATACENTER CATHEDRAL (In front of Sealed Gate ONLY): 15.5% to 26.5%
  const datacenterSectionOpacity = getOpacity(0.155, 0.175, 0.245, 0.265);

  // 3. SECTION 4: NEURAL CORE TERMINAL & MILESTONES (Inside Rack 4): 61.5% to 72%
  const neuralCoreOpacity = getOpacity(0.615, 0.630, 0.700, 0.720);

  // 4. SECTION 6: THE ARCHITECT TERMINAL LOGBOOK & TRANSMISSION: 80.0% to 88.5%
  const terminalSectionOpacity = getOpacity(0.800, 0.815, 0.865, 0.885);

  // 6. SECTION 7: FLIGHT RUNWAY TAKEOFF HUD: 88.0% to 97.0%
  const flightSectionOpacity = getOpacity(0.880, 0.895, 0.955, 0.970);

  const scrollToProgress = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = maxScroll * targetProgress;
    const lenis = (window as unknown as { lenis?: any }).lenis;
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  // Handle Joystick Velocity Driving with Magnetic Reading Detents
  const handleJoystickDrive = useCallback(
    (velocity: number) => {
      // Velocity: -1 (reverse) to +1 (forward)
      const baseSpeed = 0.0034;
      let effectiveVelocity = velocity * baseSpeed;

      // Magnetic station stop check
      for (const station of SHOWCASE_STATIONS) {
        const delta = scrollProgress - station.progress;
        // If near a station (+/- 0.009)
        if (Math.abs(delta) < 0.009) {
          // If user is lightly nudging (< 0.52), apply magnetic reading resistance
          if (Math.abs(velocity) < 0.52) {
            effectiveVelocity *= 0.15; // gentle stop to read
          }
        }
      }

      const nextProgress = Math.min(1, Math.max(0, scrollProgress + effectiveVelocity));
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetY = nextProgress * maxScroll;

      const lenis = (window as unknown as { lenis?: any }).lenis;
      if (lenis) {
        lenis.scrollTo(targetY, { immediate: true });
      } else {
        window.scrollTo(0, targetY);
      }
    },
    [scrollProgress]
  );

  const handleNextStation = () => {
    soundEngine.playClick(1100);
    const next = SHOWCASE_STATIONS.find((s) => s.progress > scrollProgress + 0.015);
    if (next) {
      scrollToProgress(next.progress);
    }
  };

  const handlePrevStation = () => {
    soundEngine.playClick(950);
    const prev = [...SHOWCASE_STATIONS].reverse().find((s) => s.progress < scrollProgress - 0.015);
    if (prev) {
      scrollToProgress(prev.progress);
    }
  };

  const currentStation = SHOWCASE_STATIONS.reduce((prev, curr) => {
    return Math.abs(curr.progress - scrollProgress) < Math.abs(prev.progress - scrollProgress)
      ? curr
      : prev;
  }, SHOWCASE_STATIONS[0]);

  return (
    <div className={`relative w-full ${isTouchDevice ? 'touch-none' : ''}`}>
      {/* 1. Full-Screen Pinned 3D WebGL Canvas Layer (Airlock Gate + Silicon Cards on Doors) */}
      <World3DCanvas
        scrollProgress={scrollProgress}
        onInspectProject={onInspectProject}
      />

      {/* 2. Full-Screen Sticky UI Overlays Layer */}
      <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-center overflow-hidden">
        {/* Section 1: Hero (Clouds) */}
        <div
          className="absolute inset-0 flex items-start justify-center overflow-y-auto transition-opacity duration-300"
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.05 ? 'auto' : 'none',
            visibility: heroOpacity > 0.001 ? 'visible' : 'hidden'
          }}
        >
          <SectorHero
            opacity={heroOpacity}
            scrollProgress={scrollProgress}
            onDescendClick={() => scrollToProgress(0.21)}
            onCvClick={onCvClick}
          />
        </div>

        {/* Section 2: The Datacenter Cathedral (Fades in ONLY AFTER Gate is landed & visible!) */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{
            opacity: datacenterSectionOpacity,
            pointerEvents: datacenterSectionOpacity > 0.05 ? 'auto' : 'none',
            visibility: datacenterSectionOpacity > 0.001 ? 'visible' : 'hidden'
          }}
        >
          <SectorDatacenter
            opacity={datacenterSectionOpacity}
            onInspectProject={onInspectProject}
            onEnterCorridor={() => scrollToProgress(0.30)}
          />
        </div>

        {/* Section 4: Neural Core Terminal & Milestones (Inside the Red Chip) */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{
            opacity: neuralCoreOpacity,
            pointerEvents: neuralCoreOpacity > 0.05 ? 'auto' : 'none',
            visibility: neuralCoreOpacity > 0.001 ? 'visible' : 'hidden'
          }}
        >
          <SectorNeuralCore opacity={neuralCoreOpacity} />
        </div>

        {/* Section 6: Architect Terminal Logbook HUD Badge */}
        {terminalSectionOpacity > 0.05 && (
          <div
            className="absolute top-18 sm:top-24 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 max-w-[92vw]"
            style={{ opacity: terminalSectionOpacity }}
          >
            <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-sun-gold/40 shadow-xl max-w-full truncate">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-mono text-[10px] sm:text-xs tracking-wider sm:tracking-widest text-obsidian font-bold uppercase truncate">
                TERMINAL // ARCHITECT LOGBOOK [TRANSMISSION ACTIVE]
              </span>
            </div>
          </div>
        )}

        {/* Section 7: Flight Takeoff Telemetry Badge */}
        {flightSectionOpacity > 0.05 && (
          <div
            className="absolute top-18 sm:top-24 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300 max-w-[92vw]"
            style={{ opacity: flightSectionOpacity }}
          >
            <div className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-sun-gold/40 shadow-xl max-w-full truncate">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-sun-gold animate-ping shrink-0" />
              <span className="font-mono text-[10px] sm:text-xs tracking-wider sm:tracking-widest text-obsidian font-bold uppercase truncate">
                AETHER-01 // AIRBORNE TAKEOFF VECTOR ACTIVE
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Atmospheric Cloud Mist Veil during Stratosphere to Airlock descent */}
      <div
        className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
        style={{
          opacity: cloudDiveOpacity,
          visibility: cloudDiveOpacity > 0.005 ? 'visible' : 'hidden',
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(240,249,255,0.4) 60%, rgba(255,255,255,0) 100%)',
          backdropFilter: cloudDiveOpacity > 0.05 ? `blur(${cloudDiveOpacity * 10}px)` : 'none',
        }}
      />

      {/* 5. Seamless Laptop Screen to Stratosphere Portal Veil: Dives into screen and emerges into Section 1 */}
      <div
        className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-700 ease-out"
        style={{
          opacity: portalOpacity,
          visibility: portalOpacity > 0.001 ? 'visible' : 'hidden',
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.98) 0%, rgba(224,242,254,0.95) 55%, rgba(186,230,253,0.90) 100%)',
          backdropFilter: 'blur(16px)',
        }}
      />

      {/* 3. Responsive Extended Scroll Track: h-2200vh on mobile, 2500vh on tablet, 2800vh on desktop */}
      <div ref={scrollTrackRef} className="w-full h-[2200vh] sm:h-[2500vh] md:h-[2800vh] pointer-events-none relative" />

      {/* 4. Pinned Vertical Stage Telemetry Rail on the right edge */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-3.5">
        {[
          { label: '01. STRATO', target: 0.04 },
          { label: '02. AIRLOCK', target: 0.14 },
          { label: '03. CATHEDRAL', target: 0.21 },
          { label: '04. SILICON 01', target: 0.34 },
          { label: '05. SILICON 02', target: 0.44 },
          { label: '06. SILICON 03', target: 0.54 },
          { label: '07. RED CORE', target: 0.66 },
          { label: '08. LOUNGE', target: 0.76 },
          { label: '09. TAKEOFF', target: 0.89 },
          { label: '10. LOOP', target: 0.995 }
        ].map((item, idx) => {
          const isActive =
            (idx === 0 && scrollProgress < 0.085) ||
            (idx === 1 && scrollProgress >= 0.085 && scrollProgress < 0.170) ||
            (idx === 2 && scrollProgress >= 0.170 && scrollProgress < 0.250) ||
            (idx === 3 && scrollProgress >= 0.250 && scrollProgress < 0.385) ||
            (idx === 4 && scrollProgress >= 0.385 && scrollProgress < 0.485) ||
            (idx === 5 && scrollProgress >= 0.485 && scrollProgress < 0.585) ||
            (idx === 6 && scrollProgress >= 0.585 && scrollProgress < 0.715) ||
            (idx === 7 && scrollProgress >= 0.715 && scrollProgress < 0.830) ||
            (idx === 8 && scrollProgress >= 0.830 && scrollProgress < 0.940) ||
            (idx === 9 && scrollProgress >= 0.940);

          return (
            <button
              key={idx}
              onClick={() => scrollToProgress(item.target)}
              title={item.label}
              className={`group flex items-center gap-2.5 cursor-pointer transition-all ${
                isActive ? 'scale-110' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <span
                className={`text-[10px] font-label tracking-widest hidden group-hover:inline-block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-border-subtle ${
                  isActive ? 'text-sun-gold font-bold' : 'text-titanium'
                }`}
              >
                {item.label}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-sun-gold shadow-[0_0_10px_rgba(245,166,35,0.7)] ring-2 ring-sun-gold/30'
                    : 'bg-border-subtle hover:bg-titanium'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* 5. Virtual Aerospace Flight Joystick for Touch & Mobile Devices */}
      {isTouchDevice && (
        <TouchJoystick
          onDrive={handleJoystickDrive}
          onNextStation={handleNextStation}
          onPrevStation={handlePrevStation}
          currentStationName={currentStation.name}
        />
      )}
    </div>
  );
};
