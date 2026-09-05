'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { portfolioConfig } from '../data/portfolioData';

interface NavbarProps {
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const toggleAudio = () => {
    const active = soundEngine.toggleAmbient();
    setIsAudioActive(active);
    soundEngine.playClick(900);
  };

  const scrollToSector = (percentage: number) => {
    soundEngine.playClick(600);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * percentage,
      behavior: 'smooth'
    });
  };

  return (
    <header className="fixed top-3 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[94%] max-w-[1150px] pointer-events-auto">
      <nav className="sun-rim-pill rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 shadow-md flex items-center justify-between">
        {/* Brand & Perfectly Centered Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          <button
            onClick={() => scrollToSector(0)}
            className="font-display text-lg sm:text-2xl text-obsidian tracking-wide hover:text-sun-gold transition-colors font-bold cursor-pointer leading-none"
          >
            {portfolioConfig.systemCode}
          </button>

          {/* Status Badge - Protected from clipping */}
          <div className="hidden xl:inline-flex items-center gap-2 font-label text-[11px] text-titanium border border-border-subtle bg-white/80 px-3 py-1 rounded-full shadow-sm leading-none">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-obsidian/85">STATUS: NOMINAL</span>
          </div>
        </div>

        {/* Section Navigation Anchors */}
        <div className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs font-sans font-medium text-titanium">
          <button
            onClick={() => scrollToSector(0.18)}
            className="hover:text-sun-gold transition-colors cursor-pointer leading-none"
          >
            01. STRATOSPHERE
          </button>
          <button
            onClick={() => scrollToSector(0.42)}
            className="hover:text-sun-gold transition-colors cursor-pointer leading-none"
          >
            02. DATACENTER
          </button>
          <button
            onClick={() => scrollToSector(0.68)}
            className="hover:text-sun-gold transition-colors cursor-pointer leading-none"
          >
            03. SILICON
          </button>
          <button
            onClick={() => scrollToSector(0.95)}
            className="hover:text-sun-gold transition-colors cursor-pointer leading-none"
          >
            04. NEURAL CORE
          </button>
        </div>

        {/* Controls & CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Spatial Audio Toggle */}
          <button
            onClick={toggleAudio}
            title="Toggle 432Hz Ambient Synthesizer"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/90 border border-border-subtle rounded-full text-xs font-label text-titanium hover:border-sun-gold transition-all shadow-sm cursor-pointer leading-none"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-sun-gold animate-pulse shrink-0" />
                <span className="hidden sm:inline font-sans">432Hz</span>
                <span className="text-sun-gold font-bold text-[11px] sm:text-xs">[ON]</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-titanium shrink-0" />
                <span className="hidden sm:inline font-sans">432Hz</span>
                <span className="text-titanium text-[11px] sm:text-xs">[OFF]</span>
              </>
            )}
          </button>

          {/* Contact CTA */}
          <button
            onClick={() => {
              soundEngine.playClick(1000);
              onContactClick();
            }}
            className="btn-gold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-sans font-semibold tracking-wide cursor-pointer shadow-sm hover:scale-105 transition-all leading-none shrink-0"
          >
            <span className="hidden sm:inline">INITIALIZE </span>CONTACT
          </button>
        </div>
      </nav>
    </header>
  );
};
