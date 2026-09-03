import React from 'react';
import { ArrowDown, FileText } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioData';
import { soundEngine } from '../utils/audio';

interface SectorHeroProps {
  opacity: number;
  scrollProgress: number;
  onDescendClick: () => void;
  onCvClick: () => void;
}

export const SectorHero: React.FC<SectorHeroProps> = ({
  opacity,
  scrollProgress,
  onDescendClick,
  onCvClick
}) => {
  // Ensure the hero is always visible even at scroll 0 (opacity at least 0.85 when in the cloud zone)
  const effectiveOpacity = Math.max(opacity, 0.85);

  // User directive:
  // "Some clouds should overlap the text means some clouds should be above the text so the crowd should be hiding some text Initially then when I scroll the cloud should Exit and the texture revealed and then I should go down"
  const revealProgress = Math.min(1, Math.max(0, scrollProgress / 0.048));
  const exitEase = Math.sin((revealProgress * Math.PI) / 2);
  const cloudFade = Math.max(0, 1 - revealProgress * 1.2);
  const isCloudVisible = cloudFade > 0.005;

  return (
    <section className="w-full min-h-screen flex flex-col justify-start items-center text-center px-4 md:px-8 max-w-[1100px] mx-auto pointer-events-auto pt-28 sm:pt-36 md:pt-44 pb-16 relative select-none">
      <div
        style={{
          opacity: effectiveOpacity,
          transform: `translateY(${(1 - opacity) * 16}px)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
        }}
        className="w-full flex flex-col items-center text-center relative"
      >
        {/* ========================================================================= */}
        {/* FOREGROUND CLOUDS OVERLAPPING THE TEXT (Z-INDEX 20: SITS ABOVE THE TEXT)  */}
        {/* Hides parts of the text initially; glides outward and exits on scroll     */}
        {/* ========================================================================= */}
        {isCloudVisible && (
          <div
            className="absolute inset-0 pointer-events-none z-20 overflow-visible"
            style={{ opacity: cloudFade }}
          >
            {/* Cloud 1: Fluffy upper-left cloud overlapping "ARCHITECTING" & "FROM CLOUD" */}
            <div
              className="absolute -top-10 -left-12 sm:-left-20 w-[300px] sm:w-[460px] md:w-[560px] pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${-exitEase * 260}px, ${-exitEase * 70}px) scale(${1 + exitEase * 0.2})`,
                filter: 'drop-shadow(0 15px 25px rgba(245, 166, 35, 0.12))',
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-95 select-none"
                style={{ filter: 'brightness(1.04) contrast(1.02)' }}
              />
            </div>

            {/* Cloud 2: Fluffy center-right cloud overlapping "TO SILICON" & Subtitle */}
            <div
              className="absolute top-12 sm:top-16 -right-10 sm:-right-24 w-[320px] sm:w-[480px] md:w-[600px] pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${exitEase * 280}px, ${-exitEase * 40}px) scale(${1 + exitEase * 0.2})`,
                filter: 'drop-shadow(0 15px 25px rgba(255, 255, 255, 0.3))',
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-95 select-none"
                style={{ filter: 'brightness(1.06)' }}
              />
            </div>

            {/* Cloud 3: Lower-center drifting cloud veil across subtitle & action buttons */}
            <div
              className="absolute top-48 sm:top-56 left-1/2 -translate-x-1/2 w-[380px] sm:w-[580px] md:w-[720px] pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(calc(-50% + ${exitEase * 40}px), ${exitEase * 140}px) scale(${1 + exitEase * 0.15})`,
                filter: 'drop-shadow(0 20px 30px rgba(245, 166, 35, 0.15))',
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-90 select-none"
                style={{ filter: 'brightness(1.08)' }}
              />
            </div>

            {/* Cloud 4: Subtle delicate wisp over the top altitude badge */}
            <div
              className="absolute -top-16 left-1/3 w-[220px] sm:w-[320px] pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${-exitEase * 140}px, ${-exitEase * 80}px) scale(${1 + exitEase * 0.25})`,
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-80 select-none"
                style={{ filter: 'brightness(1.1)' }}
              />
            </div>
          </div>
        )}

        {/* Top Floating Altitude & Ping Pill - Positioned safely below navbar */}
        <div className="sun-rim-pill px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-label text-titanium mb-4 sm:mb-6 inline-flex items-center gap-2 sm:gap-2.5 shadow-md bg-white/95 max-w-[92vw] relative z-10">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sun-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sun-gold"></span>
          </span>
          <span className="tracking-widest uppercase font-semibold text-obsidian/90 truncate">
            ALTITUDE: {portfolioConfig.altitude} • PING: {portfolioConfig.globalPing}
          </span>
        </div>

        {/* Headline - Sized with fluid scales for mobile, tablet & desktop */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-obsidian uppercase leading-[1.08] sm:leading-[1.05] mb-4 sm:mb-5 max-w-4xl drop-shadow-sm relative z-10">
          ARCHITECTING SYSTEMS <br />
          <span className="italic font-normal text-sun-gold">FROM CLOUD</span> TO SILICON
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-xs sm:text-base md:text-lg text-obsidian/80 max-w-2xl leading-relaxed mb-6 sm:mb-8 font-normal bg-white/40 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl border border-white/60 shadow-sm relative z-10">
          {portfolioConfig.author.bio}
        </p>

        {/* Action Buttons - Touch-friendly 44px min-height */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full max-w-md sm:max-w-none relative z-10">
          <button
            onClick={() => {
              soundEngine.playClick(800);
              onDescendClick();
            }}
            className="btn-gold w-full sm:w-auto px-6 sm:px-7 py-3 min-h-[44px] rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
          >
            <span>DESCEND INTO SYSTEMS</span>
            <ArrowDown className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(950);
              onCvClick();
            }}
            className="btn-white-glass w-full sm:w-auto px-6 sm:px-7 py-3 min-h-[44px] rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-sun-gold shrink-0" />
            <span>CURRICULUM VITAE [PDF]</span>
          </button>
        </div>

        {/* Sub-Telemetry Pill */}
        <div className="text-[10px] sm:text-[11px] font-label text-titanium/90 flex items-center gap-2.5 sm:gap-3 bg-white/85 backdrop-blur-md px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border-subtle shadow-sm max-w-[92vw] truncate relative z-10">
          <span className="truncate">GLOBAL_MESH // 100GbE</span>
          <span>•</span>
          <span className="truncate">CLUSTER: 128 ACTIVE</span>
        </div>
      </div>
    </section>
  );
};
