import React, { useState } from 'react';
import { ArrowUpRight, ArrowDown, Server } from 'lucide-react';
import { Project } from '../types';
import { projectsData } from '../data/portfolioData';
import { soundEngine } from '../utils/audio';

interface SectorDatacenterProps {
  opacity: number;
  onInspectProject: (project: Project) => void;
  onEnterCorridor?: () => void;
}

export const SectorDatacenter: React.FC<SectorDatacenterProps> = ({
  opacity,
  onInspectProject,
  onEnterCorridor
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (opacity <= 0.02) return null;

  const renderProjectCard = (project: Project) => (
    <div
      key={project.id}
      onMouseEnter={() => soundEngine.playClick(900)}
      className="glass-panel glass-panel-hover p-3.5 sm:p-5 rounded-2xl flex flex-col justify-between relative group bg-white/95 shadow-xl border border-white/80 w-full"
    >
      <div>
        {/* Card Top Metadata */}
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <span className="font-label text-[10px] sm:text-[11px] text-titanium/80 font-medium">
            [{project.code}]
          </span>
          <span className="font-label text-[9px] sm:text-[10px] text-sun-gold border border-sun-gold/30 bg-sun-gold/10 px-2 py-0.5 rounded-full font-bold">
            ACTIVE_FABRIC
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-display text-sm sm:text-base lg:text-lg text-obsidian mb-1 sm:mb-1.5 font-bold group-hover:text-warm-bronze transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="font-sans text-[11px] sm:text-xs text-titanium leading-relaxed mb-2 sm:mb-2.5 line-clamp-2">
          {project.tagline}
        </p>

        {/* High-Impact Benchmark Metrics */}
        <div className="space-y-1 mb-2 sm:mb-2.5 pt-1.5 sm:pt-2 border-t border-border-subtle">
          {project.metrics.map((m, idx) => (
            <div key={idx} className="flex justify-between items-center text-[10px] sm:text-[11px]">
              <span className="font-label text-titanium/80">{m.label}</span>
              <span className="font-mono font-bold text-sun-gold text-[11px] sm:text-xs">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* Stack Chips & CTA Button */}
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-2.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-1.5 sm:px-2 py-0.5 bg-alabaster border border-border-subtle rounded text-[9px] sm:text-[10px] font-label text-titanium"
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            soundEngine.playClick(1100);
            onInspectProject(project);
          }}
          className="w-full btn-gold py-2 sm:py-2 min-h-[38px] rounded-xl font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] transition-transform"
        >
          <span>INSPECT BLUEPRINT</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <section
      style={{
        opacity,
        transform: `scale(${0.97 + opacity * 0.03}) translateY(${(1 - opacity) * 16}px)`,
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
      }}
      className="w-full h-full max-h-screen flex flex-col justify-start items-center px-3 sm:px-6 md:px-8 max-w-[1240px] mx-auto pointer-events-auto select-none pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 overflow-y-auto"
    >
      {/* Header with frosted glass background preventing interference from dark gate bars */}
      <div className="mb-2 sm:mb-3 text-center max-w-xl shrink-0 bg-white/95 backdrop-blur-md px-3.5 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/80 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-label text-titanium mb-1 bg-alabaster shadow-xs border border-border-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-sun-gold animate-pulse"></span>
          <span>SECTOR 02 // DISTRIBUTED REPOSITORY</span>
        </div>
        <h2 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-obsidian tracking-tight mb-0.5 sm:mb-1">
          The Datacenter Cathedral
        </h2>
        <p className="font-sans text-[11px] sm:text-xs md:text-sm text-titanium max-w-lg mx-auto leading-relaxed line-clamp-2 px-2">
          High-throughput distributed systems, consensus engines, and streaming inference fabrics engineered for low-latency scale.
        </p>
      </div>

      {/* Mobile / Tablet Tab Switcher (< lg) */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 shrink-0 max-w-full overflow-x-auto px-1 py-0.5">
        {projectsData.map((project, idx) => {
          const shortName = project.title.split('//')[0].trim();
          return (
            <button
              key={project.id}
              onClick={() => {
                soundEngine.playClick(900);
                setActiveTab(idx);
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-label uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === idx
                  ? 'bg-sun-gold text-white font-bold shadow-md scale-[1.02]'
                  : 'bg-white/90 text-titanium hover:text-obsidian border border-border-subtle'
              }`}
            >
              {shortName}
            </button>
          );
        })}
      </div>

      {/* Mobile / Tablet View (< lg): Single Active Card */}
      <div className="block lg:hidden w-full max-w-md mx-auto mb-3 shrink-0">
        {renderProjectCard(projectsData[activeTab])}
      </div>

      {/* Desktop 3-Column Grid (>= lg) */}
      <div className="hidden lg:grid grid-cols-3 gap-5 w-full mb-4">
        {projectsData.map((project) => renderProjectCard(project))}
      </div>

      {/* Action Button to Breach Airlock & Enter Silicon Corridor */}
      <div className="flex justify-center shrink-0">
        <button
          onClick={() => {
            soundEngine.playClick(1000);
            onEnterCorridor?.();
          }}
          className="btn-gold px-5 sm:px-7 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[42px] rounded-full font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.03] transition-transform max-w-[92vw] text-center"
        >
          <Server className="w-3.5 h-3.5 shrink-0" />
          <span>BREACH AIRLOCK<span className="hidden sm:inline"> & ENTER SILICON CORRIDOR</span></span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce shrink-0" />
        </button>
      </div>
    </section>
  );
};
