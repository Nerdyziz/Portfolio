// WebAudio Atmospheric Drone & Sound Engine

class SoundEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isMuted: boolean = true;

  private init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Primary 432Hz Harmonic Sub-Bass Generator
    this.osc = this.ctx.createOscillator();
    this.subOsc = this.ctx.createOscillator();
    this.gainNode = this.ctx.createGain();
    this.filterNode = this.ctx.createBiquadFilter();

    // 432Hz / 4 = 108Hz fundamental sub-octave, perfectly tuned to 432Hz harmonic
    this.osc.type = 'sine';
    this.osc.frequency.setValueAtTime(108, this.ctx.currentTime); // 108 Hz (A2 in 432Hz tuning)

    this.subOsc.type = 'triangle';
    this.subOsc.frequency.setValueAtTime(54, this.ctx.currentTime); // 54 Hz warm deep undertone

    // Low-pass filter for smooth, non-fatiguing museum ambiance
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

    this.osc.connect(this.filterNode);
    this.subOsc.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.osc.start();
    this.subOsc.start();
  }

  public toggleAmbient(): boolean {
    this.init();
    if (!this.ctx || !this.gainNode) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isMuted) {
      // Fade in smoothly over 2 seconds
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2.0);
      this.isMuted = false;
    } else {
      // Fade out smoothly
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
      this.isMuted = true;
    }

    return !this.isMuted;
  }

  public playClick(freq = 800) {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();

      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);

      clickGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      clickOsc.start();
      clickOsc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignore audio failure
    }
  }

  public playBoot() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(864, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore audio failure
    }
  }

  public playSuccess() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const freqs = [540, 720, 1080];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0.035, this.ctx!.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.04 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.04);
        osc.stop(this.ctx!.currentTime + idx * 0.04 + 0.22);
      });
    } catch {
      // Ignore audio failure
    }
  }

  public getStatus(): boolean {
    return !this.isMuted;
  }
}

export const soundEngine = new SoundEngine();
