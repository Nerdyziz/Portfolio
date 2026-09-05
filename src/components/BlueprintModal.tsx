'use client';

import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { Project } from '../types';
import { soundEngine } from '../utils/audio';

interface BlueprintModalProps {
  project: Project | null;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({ project, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { scale: 0.92, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }
      );
    }
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md">
      <div
        ref={panelRef}
        className="glass-panel w-full max-w-3xl rounded-3xl bg-white/95 p-4 sm:p-6 md:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-border-gold/40"
      >
        {/* Top Header */}
        <div className="flex justify-between items-start pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-border-subtle">
          <div className="pr-2">
            <span className="font-label text-[10px] sm:text-xs text-sun-gold tracking-widest uppercase font-semibold">
              // ARCHITECTURAL BLUEPRINT // [{project.code}]
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-obsidian tracking-wide mt-0.5 sm:mt-1">
              {project.title}
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick(800);
              onClose();
            }}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-border-subtle hover:border-sun-gold text-titanium hover:text-obsidian transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deep Description */}
        <div className="mb-6">
          <h4 className="font-label text-xs text-titanium tracking-wider uppercase mb-2">
            [01. SYSTEM SPECIFICATION]
          </h4>
          <p className="font-sans text-sm text-obsidian/85 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Architecture Details */}
        <div className="mb-6">
          <h4 className="font-label text-xs text-titanium tracking-wider uppercase mb-3">
            [02. SUBSYSTEM TOPOLOGY &amp; PIPELINE]
          </h4>
          <div className="space-y-2.5">
            {project.architectureDetails.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 bg-alabaster border border-border-subtle rounded-xl"
              >
                <CheckCircle className="w-4 h-4 text-sun-gold shrink-0 mt-0.5" />
                <span className="font-sans text-xs sm:text-sm text-obsidian/90">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Metrics */}
        <div className="mb-8">
          <h4 className="font-label text-xs text-titanium tracking-wider uppercase mb-3">
            [03. BENCHMARK TELEMETRY]
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-alabaster border border-border-subtle rounded-xl"
              >
                <div className="text-[10px] font-label text-titanium uppercase">{m.label}</div>
                <div className="font-mono text-lg text-sun-gold font-bold mt-1">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack & Action Links */}
        <div className="pt-4 border-t border-border-subtle flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-white border border-border-subtle rounded-lg text-xs font-label text-titanium"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEngine.playClick(1000)}
                className="btn-gold px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>OPEN REPOSITORY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => {
                soundEngine.playClick(700);
                onClose();
              }}
              className="px-4 py-2 rounded-full border border-border-subtle font-sans text-xs text-titanium hover:text-obsidian uppercase cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
