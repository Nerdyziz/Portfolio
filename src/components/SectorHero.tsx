'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowDown, FileText } from 'lucide-react';
import gsap from 'gsap';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const subPillRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );

  // GSAP Initial Mount Staggered Entrance (Luxury High-End Motion)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (pillRef.current) {
        tl.fromTo(pillRef.current, { y: -25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.2);
      }
      if (headlineRef.current) {
        tl.fromTo(headlineRef.current, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power4.out' }, 0.35);
      }
      if (bioRef.current) {
        tl.fromTo(bioRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.55);
      }
      if (buttonsRef.current) {
        tl.fromTo(buttonsRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }, 0.7);
      }
      if (subPillRef.current) {
        tl.fromTo(subPillRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.85);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Ensure the hero is always visible even at scroll 0 (opacity at least 0.85 when in the cloud zone)
  const effectiveOpacity = Math.max(opacity, 0.85);

  // User directive:
  // Clouds gently frame the edges at scroll 0; as user scrolls, clouds part and exit outward
  const revealProgress = Math.min(1, Math.max(0, scrollProgress / 0.048));
  const exitEase = gsap.parseEase('power2.inOut')(revealProgress);
  const cloudFade = Math.max(0, 1 - revealProgress * 1.25);
  const isCloudVisible = cloudFade > 0.005;

  return (
    <section className="w-full min-h-screen flex flex-col justify-start items-center text-center px-4 md:px-8 max-w-[1100px] mx-auto pointer-events-auto pt-28 sm:pt-36 md:pt-44 pb-16 relative select-none">
      <div
        ref={containerRef}
        style={{
          opacity: effectiveOpacity,
          transform: `translateY(${(1 - opacity) * 16}px)`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
        }}
        className="w-full flex flex-col items-center text-center relative"
      >
        {/* ========================================================================= */}
        {/* REALISTIC WHITE CLOUDS FRAMING THE PERIMETER (CLEAN OUTER SCREEN CORNERS) */}
        {/* Pinned strictly to outer margins; headline, bio, & buttons are 100% clear */}
        {/* ========================================================================= */}
        {isCloudVisible && (
          <div
            className="absolute inset-0 pointer-events-none z-0 overflow-visible"
            style={{ opacity: cloudFade }}
          >
            {/* Cloud 1: Fluffy upper-left cloud framing the upper-left corner */}
            <div
              className={`absolute -top-20 -left-20 sm:-left-28 sm:-top-24 w-[190px] sm:w-[380px] md:w-[480px] pointer-events-none ${
                isMobile ? '' : 'transition-transform duration-75 ease-out'
              }`}
              style={{
                transform: `translate3d(${-exitEase * 260}px, ${-exitEase * 80}px, 0) scale(${1 + exitEase * 0.15})`,
                willChange: 'transform',
                filter: isMobile ? 'none' : 'drop-shadow(0 15px 25px rgba(255, 255, 255, 0.4))',
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-95 select-none"
                style={{ filter: 'brightness(1.05) contrast(1.0)' }}
              />
            </div>

            {/* Cloud 2: Fluffy upper-right cloud framing the upper-right corner */}
            <div
              className={`absolute -top-16 -right-20 sm:-right-28 sm:-top-20 w-[200px] sm:w-[400px] md:w-[500px] pointer-events-none ${
                isMobile ? '' : 'transition-transform duration-75 ease-out'
              }`}
              style={{
                transform: `translate3d(${exitEase * 260}px, ${-exitEase * 80}px, 0) scale(${1 + exitEase * 0.15})`,
                willChange: 'transform',
                filter: isMobile ? 'none' : 'drop-shadow(0 15px 25px rgba(255, 255, 255, 0.4))',
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-95 select-none"
                style={{ filter: 'brightness(1.05) contrast(1.0)' }}
              />
            </div>

            {/* Cloud 3: Fluffy lower-left cloud framing the bottom-left corner */}
            <div
              className={`absolute -bottom-24 -left-20 sm:-left-28 sm:-bottom-28 w-[190px] sm:w-[380px] md:w-[460px] pointer-events-none ${
                isMobile ? '' : 'transition-transform duration-75 ease-out'
              }`}
              style={{
                transform: `translate3d(${-exitEase * 220}px, ${exitEase * 140}px, 0) scale(${1 + exitEase * 0.12})`,
                willChange: 'transform',
                filter: isMobile ? 'none' : 'drop-shadow(0 20px 30px rgba(255, 255, 255, 0.35))',
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-90 select-none"
                style={{ filter: 'brightness(1.06) contrast(1.0)' }}
              />
            </div>

            {/* Cloud 4: Fluffy lower-right cloud framing the bottom-right corner */}
            <div
              className={`absolute -bottom-24 -right-20 sm:-right-28 sm:-bottom-28 w-[200px] sm:w-[390px] md:w-[480px] pointer-events-none ${
                isMobile ? '' : 'transition-transform duration-75 ease-out'
              }`}
              style={{
                transform: `translate3d(${exitEase * 220}px, ${exitEase * 140}px, 0) scale(${1 + exitEase * 0.12})`,
                willChange: 'transform',
                filter: isMobile ? 'none' : 'drop-shadow(0 20px 30px rgba(255, 255, 255, 0.35))',
              }}
            >
              <img
                src="/textures/cloud.png"
                alt=""
                className="w-full h-auto opacity-90 select-none"
                style={{ filter: 'brightness(1.06) contrast(1.0)' }}
              />
            </div>
          </div>
        )}

        {/* Top Floating Altitude & Ping Pill - Positioned safely below navbar */}
        <div
          ref={pillRef}
          className="sun-rim-pill px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-label text-titanium mb-4 sm:mb-6 inline-flex items-center gap-2 sm:gap-2.5 shadow-md bg-white/95 max-w-[92vw] relative z-10"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sun-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sun-gold"></span>
          </span>
          <span className="tracking-widest uppercase font-semibold text-obsidian/90 truncate">
            ALTITUDE: {portfolioConfig.altitude} • PING: {portfolioConfig.globalPing}
          </span>
        </div>

        {/* Headline - Sized with fluid scales for mobile, tablet & desktop */}
        <h1
          ref={headlineRef}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-obsidian uppercase leading-[1.08] sm:leading-[1.05] mb-4 sm:mb-5 max-w-4xl drop-shadow-sm relative z-10"
        >
          ARCHITECTING SYSTEMS <br />
          <span className="italic font-normal text-sun-gold">FROM CLOUD</span> TO SILICON
        </h1>

        {/* Subtitle */}
        <p
          ref={bioRef}
          className="font-sans text-xs sm:text-base md:text-lg text-obsidian/80 max-w-2xl leading-relaxed mb-6 sm:mb-8 font-normal bg-white/40 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl border border-white/60 shadow-sm relative z-10"
        >
          {portfolioConfig.author.bio}
        </p>

        {/* Action Buttons - Touch-friendly 44px min-height */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full max-w-md sm:max-w-none relative z-10"
        >
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
        <div
          ref={subPillRef}
          className="text-[10px] sm:text-[11px] font-label text-titanium/90 flex items-center gap-2.5 sm:gap-3 bg-white/85 backdrop-blur-md px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border-subtle shadow-sm max-w-[92vw] truncate relative z-10"
        >
          <span className="truncate">GLOBAL_MESH // 100GbE</span>
          <span>•</span>
          <span className="truncate">CLUSTER: 128 ACTIVE</span>
        </div>
      </div>
    </section>
  );
};
