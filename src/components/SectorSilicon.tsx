import React from 'react';
import { ArrowDown, ShieldCheck, Cpu, Network } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SectorSiliconProps {
  opacity: number;
  onEnterCorridor?: () => void;
}

export const SectorSilicon: React.FC<SectorSiliconProps> = ({
  opacity,
  onEnterCorridor
}) => {
  if (opacity <= 0.02) return null;

  return (
    <section
      style={{
        opacity,
        transform: `scale(${0.96 + opacity * 0.04}) translateY(${(1 - opacity) * 20}px)`,
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
      }}
      className="w-full max-w-4xl mx-auto px-6 pointer-events-auto flex flex-col items-center justify-center text-center select-none"
    >
      <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/95 shadow-2xl border border-white/80 backdrop-blur-xl max-w-2xl">
        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sun-gold/10 border border-sun-gold/30 text-obsidian text-xs font-label font-semibold tracking-wider mb-5">
          <ShieldCheck className="w-3.5 h-3.5 text-sun-gold" />
          <span>SECTOR 02 // BARE-METAL AIRLOCK ENTRANCE</span>
        </div>

        {/* Section 2 Headline */}
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-obsidian tracking-tight mb-3">
          BARE-METAL INFRASTRUCTURE
        </h2>
        <p className="font-sans text-sm sm:text-base text-titanium leading-relaxed mb-8 max-w-xl mx-auto">
          High-density compute clusters, sub-millisecond optical fabric interconnects, and fault-tolerant cleanroom architecture engineered for enterprise resiliency.
        </p>

        {/* 3 Facility Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="p-4 rounded-xl bg-alabaster/80 border border-border-subtle">
            <div className="flex items-center gap-2 text-xs font-label text-titanium mb-1">
              <Cpu className="w-3.5 h-3.5 text-sun-gold" />
              <span>AVAILABILITY</span>
            </div>
            <div className="font-mono text-xl font-bold text-obsidian">99.999%</div>
            <div className="font-sans text-[11px] text-titanium/80">Fault-Tolerant Uptime</div>
          </div>

          <div className="p-4 rounded-xl bg-alabaster/80 border border-border-subtle">
            <div className="flex items-center gap-2 text-xs font-label text-titanium mb-1">
              <Network className="w-3.5 h-3.5 text-sun-gold" />
              <span>FABRIC</span>
            </div>
            <div className="font-mono text-xl font-bold text-obsidian">400 Gbps</div>
            <div className="font-sans text-[11px] text-titanium/80">RoCEv2 Low-Latency</div>
          </div>

          <div className="p-4 rounded-xl bg-alabaster/80 border border-border-subtle">
            <div className="flex items-center gap-2 text-xs font-label text-titanium mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sun-gold" />
              <span>ACCESS</span>
            </div>
            <div className="font-mono text-xl font-bold text-emerald-600">SECURE</div>
            <div className="font-sans text-[11px] text-titanium/80">Biometric Interlock</div>
          </div>
        </div>

        {/* CTA to Breach Airlock Gate */}
        <button
          onClick={() => {
            soundEngine.playClick(1000);
            onEnterCorridor?.();
          }}
          className="btn-gold px-8 py-3 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-transform"
        >
          <span>BREACH AIRLOCK & ENTER CORRIDOR</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
