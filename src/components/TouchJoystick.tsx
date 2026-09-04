import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Compass } from 'lucide-react';
import gsap from 'gsap';
import { soundEngine } from '../utils/audio';

interface TouchJoystickProps {
  onVelocityChange: (velocity: number) => void;
  currentStationName?: string;
}

export const TouchJoystick: React.FC<TouchJoystickProps> = ({
  onVelocityChange,
  currentStationName
}) => {
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState(0); // -1 (reverse) to +1 (forward)
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const centerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const MAX_RADIUS = 36; // Maximum thumbstick displacement in px

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    centerPos.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    setIsActive(true);
    soundEngine.playClick(900);

    // Track move on window so drag continues even outside the joystick base
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp, { passive: false });
    window.addEventListener('pointercancel', handlePointerUp, { passive: false });
  };

  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();
    const dx = e.clientX - centerPos.current.x;
    const dy = e.clientY - centerPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Clamp displacement inside circular radius
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, MAX_RADIUS);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    if (knobRef.current) {
      knobRef.current.style.transform = `translate3d(${knobX}px, ${knobY}px, 0)`;
    }

    // Forward is pushing UP (-dy), Reverse is pulling DOWN (+dy)
    // Non-linear cubic response curve: gentle near center, powerful at edges
    const rawY = -knobY / MAX_RADIUS; // -1 to 1
    const curvedIntensity = Math.sign(rawY) * Math.pow(Math.abs(rawY), 1.15);

    setIntensity(curvedIntensity);
    onVelocityChange(curvedIntensity);
  };

  const handlePointerUp = () => {
    setIsActive(false);
    setIntensity(0);
    onVelocityChange(0);

    // Spring knob back to center with luxury GSAP physics
    if (knobRef.current) {
      gsap.to(knobRef.current, {
        x: 0,
        y: 0,
        duration: 0.35,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto'
      });
    }

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-end gap-2.5 select-none pointer-events-auto">
      {/* Flight Gimbal / Virtual Joystick Base */}
      <div className="flex flex-col items-center">
        {/* Forward Throttle Arrow */}
        <div
          className={`flex items-center gap-1 text-[9px] font-mono tracking-widest mb-1 transition-colors ${
            intensity > 0.08 ? 'text-sun-gold font-bold scale-105' : 'text-titanium/60'
          }`}
        >
          <ChevronUp className={`w-3 h-3 ${intensity > 0.08 ? 'animate-bounce' : ''}`} />
          <span>FWD</span>
        </div>

        {/* Circular Gimbal Ring Base */}
        <div
          ref={baseRef}
          onPointerDown={handlePointerDown}
          className={`relative w-[92px] h-[92px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all touch-none select-none ${
            isActive
              ? 'bg-obsidian/90 border-sun-gold shadow-[0_0_30px_rgba(245,166,35,0.45)] scale-105'
              : 'bg-white/95 hover:bg-white border-border-subtle hover:border-sun-gold/50 shadow-xl'
          } border-2`}
        >
          {/* Subtle Outer Compass Markings */}
          <div className="absolute inset-1 rounded-full border border-dashed border-sun-gold/25 pointer-events-none" />

          {/* Directional Center Crosshair */}
          <div className="absolute w-full h-[1px] bg-border-subtle/50 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-border-subtle/50 pointer-events-none" />

          {/* Moveable Thumb Knob */}
          <div
            ref={knobRef}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-shadow pointer-events-none ${
              isActive
                ? 'bg-gradient-to-b from-white to-gray-200 border-2 border-sun-gold shadow-[0_4px_14px_rgba(245,166,35,0.55)]'
                : 'bg-gradient-to-b from-white to-alabaster border border-border-subtle shadow-md'
            }`}
          >
            {/* Center LED Beacon */}
            <span className="relative flex h-2.5 w-2.5">
              {isActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sun-gold opacity-80" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-colors ${
                  isActive ? 'bg-sun-gold' : 'bg-titanium/40'
                }`}
              />
            </span>
          </div>
        </div>

        {/* Reverse Throttle Arrow */}
        <div
          className={`flex items-center gap-1 text-[9px] font-mono tracking-widest mt-1 transition-colors ${
            intensity < -0.08 ? 'text-sun-gold font-bold scale-105' : 'text-titanium/60'
          }`}
        >
          <ChevronDown className={`w-3 h-3 ${intensity < -0.08 ? 'animate-bounce' : ''}`} />
          <span>REV</span>
        </div>
      </div>

      {/* Current Station Tag Badge */}
      {currentStationName && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-border-subtle shadow-md text-[10px] font-label text-titanium pointer-events-none mb-6">
          <Compass className="w-3 h-3 text-sun-gold animate-spin [animation-duration:12s]" />
          <span className="font-semibold text-obsidian">{currentStationName}</span>
        </div>
      )}
    </div>
  );
};
