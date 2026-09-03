import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { achievementsData, portfolioConfig, projectsData, skillCategories } from '../data/portfolioData';
import { soundEngine } from '../utils/audio';

interface TerminalLine {
  text: string;
  type?: 'input' | 'output' | 'success' | 'warning';
}

interface SectorNeuralCoreProps {
  opacity: number;
}

export const SectorNeuralCore: React.FC<SectorNeuralCoreProps> = ({ opacity }) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'terminal'>('milestones');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'guest@aether:~$ ./init_neural_link.sh', type: 'input' },
    { text: '[INITIALIZED] Core tensor weights converged. Systems online.', type: 'output' },
    { text: 'Type "help" for interactive command directives.', type: 'warning' }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    soundEngine.playClick(1000);
    const newHistory: TerminalLine[] = [...history, { text: `guest@aether:~$ ${cmd}`, type: 'input' }];
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      newHistory.push({
        text: 'COMMANDS:\n • help       - List available directives\n • projects   - Output distributed project specs\n • skills     - Display architectural stack\n • contact    - Show communication channels\n • hire       - Run recruitment verification protocol\n • clear      - Reset terminal buffer',
        type: 'output'
      });
    } else if (lower === 'projects') {
      const pList = projectsData.map((p) => ` [${p.code}] ${p.title}\n   └─ ${p.metrics.map((m) => `${m.label}: ${m.value}`).join(' | ')}`).join('\n\n');
      newHistory.push({ text: pList, type: 'output' });
    } else if (lower === 'skills') {
      const sList = skillCategories.map((s) => ` • ${s.title}: ${s.skills.join(', ')}`).join('\n');
      newHistory.push({ text: sList, type: 'output' });
    } else if (lower === 'contact') {
      newHistory.push({
        text: `COMMUNICATION CHANNELS:\n • Email: ${portfolioConfig.author.email}\n • GitHub: ${portfolioConfig.author.github}\n • LinkedIn: ${portfolioConfig.author.linkedin}`,
        type: 'success'
      });
    } else if (lower === 'hire' || lower === './init_neural_link.sh') {
      newHistory.push({
        text: '[SUCCESS] ✨ Target verification confirmed. Launching transmission protocol.',
        type: 'success'
      });
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.85 },
          colors: ['#F5A623', '#D4AF37', '#835500']
        });
      } catch {
        // Fallback
      }
    } else if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else {
      newHistory.push({
        text: `aether: command not found: "${cmd}". Type "help" for options.`,
        type: 'warning'
      });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (opacity <= 0.02) return null;

  return (
    <section
      style={{
        opacity,
        transform: `scale(${0.97 + opacity * 0.03}) translateY(${(1 - opacity) * 16}px)`,
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
      }}
      className="w-full h-full max-h-[88vh] sm:max-h-screen flex flex-col justify-start sm:justify-center items-center px-3 sm:px-6 md:px-8 max-w-[1240px] mx-auto pointer-events-auto select-none pt-20 sm:pt-28 pb-6 overflow-y-auto sm:overflow-hidden"
    >
      {/* Header with guaranteed clearance below floating Navbar */}
      <div className="mb-3 sm:mb-4 text-center max-w-2xl shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-label text-titanium mb-1.5 bg-white/90 shadow-sm border border-border-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-sun-gold animate-pulse"></span>
          <span>SECTOR 04 // NEURAL CONVERGENCE</span>
        </div>
        <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-bold text-obsidian tracking-tight mb-1">
          The Neural Core
        </h2>
        <p className="font-sans text-xs sm:text-sm text-titanium max-w-lg mx-auto leading-relaxed line-clamp-1 px-2">
          Published research, community milestones, and interactive bare-metal command terminal.
        </p>
      </div>

      {/* Mobile Tab Switcher (< 1024px) */}
      <div className="flex lg:hidden items-center justify-center gap-2 mb-3 shrink-0">
        <button
          onClick={() => {
            soundEngine.playClick(900);
            setActiveTab('milestones');
          }}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-label uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'milestones'
              ? 'bg-sun-gold text-white font-bold shadow-md'
              : 'bg-white/90 text-titanium hover:text-obsidian border border-border-subtle'
          }`}
        >
          Research &amp; Milestones
        </button>
        <button
          onClick={() => {
            soundEngine.playClick(900);
            setActiveTab('terminal');
          }}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-label uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'terminal'
              ? 'bg-sun-gold text-white font-bold shadow-md'
              : 'bg-white/90 text-titanium hover:text-obsidian border border-border-subtle'
          }`}
        >
          Terminal HUD
        </button>
      </div>

      {/* Grid: Milestones Timeline + Interactive Terminal (Balanced heights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full mb-4">
        {/* Left Column: Milestones (Span 6) */}
        <div className={`lg:col-span-6 flex flex-col justify-between ${activeTab === 'milestones' ? 'block' : 'hidden lg:flex'}`}>
          <h3 className="hidden lg:block font-display text-base sm:text-lg font-bold text-obsidian mb-2.5">
            Research &amp; Milestones
          </h3>
          <div className="border-l-2 border-sun-gold/40 pl-3 sm:pl-4 space-y-2 sm:space-y-2.5">
            {achievementsData.map((ach) => (
              <div key={ach.id} className="relative group">
                <div className="absolute -left-[19px] sm:-left-[23px] top-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white border-2 border-sun-gold shadow-xs"></div>
                <div className="glass-panel p-2.5 sm:p-3.5 rounded-xl bg-white/90 shadow-sm border border-white/80">
                  <div className="flex justify-between items-center text-[10px] font-label text-sun-gold mb-0.5">
                    <span className="font-bold">{ach.year}</span>
                    <span className="text-titanium/70">{ach.type}</span>
                  </div>
                  <h4 className="font-display text-xs sm:text-sm text-obsidian font-bold mb-0.5">
                    {ach.title}
                  </h4>
                  <p className="font-sans text-[11px] text-titanium leading-relaxed line-clamp-2">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Light-Mode Developer Terminal (Span 6) */}
        <div className={`lg:col-span-6 ${activeTab === 'terminal' ? 'block' : 'hidden lg:block'}`}>
          <h3 className="hidden lg:block font-display text-base sm:text-lg font-bold text-obsidian mb-2.5">
            Interactive Terminal HUD
          </h3>
          <div className="glass-panel p-3.5 sm:p-5 rounded-2xl border border-border-subtle bg-white/95 shadow-xl flex flex-col h-[260px] sm:h-[310px] justify-between">
            {/* Terminal Chrome */}
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-border-subtle text-xs font-label">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="ml-1.5 text-titanium font-medium text-[11px]">AETHER_TTY1 // LIGHT_SHELL</span>
              </div>
              <span className="text-emerald-600 text-[10px] font-bold">ONLINE</span>
            </div>

            {/* Terminal Output */}
            <div className="overflow-y-auto space-y-1.5 text-[11px] font-mono pr-1 flex-grow">
              {history.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    line.type === 'input'
                      ? 'text-obsidian font-bold'
                      : line.type === 'success'
                      ? 'text-emerald-600 font-semibold'
                      : line.type === 'warning'
                      ? 'text-sun-gold font-medium'
                      : 'text-titanium'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Line */}
            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2 border-t border-border-subtle">
              <span className="font-mono text-xs text-sun-gold font-bold shrink-0">
                guest@aether:~$
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type 'help' or 'hire'..."
                className="w-full bg-transparent border-none outline-none font-mono text-sm sm:text-xs text-obsidian placeholder-titanium/40"
              />
              <button
                type="submit"
                className="btn-gold px-3.5 sm:px-3 py-1.5 sm:py-1 min-h-[32px] rounded-md text-[10px] font-label font-semibold uppercase cursor-pointer"
              >
                EXEC
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Links (Compact, guaranteed to fit inside screen) */}
      <div className="flex flex-wrap justify-center sm:justify-between items-center w-full pt-2.5 sm:pt-3 border-t border-border-subtle/80 text-[10px] sm:text-[11px] font-label text-titanium gap-3 sm:gap-2 shrink-0">
        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href={portfolioConfig.author.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sun-gold transition-colors font-medium"
          >
            — GITHUB
          </a>
          <a
            href={portfolioConfig.author.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sun-gold transition-colors font-medium"
          >
            — LINKEDIN
          </a>
          <a
            href={portfolioConfig.author.huggingface}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sun-gold transition-colors font-medium"
          >
            — HUGGING_FACE
          </a>
        </div>

        <div className="text-center sm:text-right text-[10px] text-titanium/70">
          DESIGNED WITH ARCHITECTURAL CLARITY // 2026.
        </div>
      </div>
    </section>
  );
};
