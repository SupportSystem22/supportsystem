// Web Audio API based ambient sound generator for serene 1-to-1 session rooms

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentMode: 'rain' | 'drone' | 'ocean' | 'breathe' | 'off' = 'off';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMode(mode: 'rain' | 'drone' | 'ocean' | 'breathe' | 'off', volume: number = 0.4) {
    this.stop();
    if (mode === 'off') {
      this.currentMode = 'off';
      return;
    }

    try {
      this.initContext();
      if (!this.ctx) return;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      this.currentMode = mode;

      if (mode === 'rain') {
        this.playRain();
      } else if (mode === 'drone') {
        this.playCalmingDrone();
      } else if (mode === 'ocean') {
        this.playOceanWaves();
      } else if (mode === 'breathe') {
        this.playBreathingGuide();
      }
    } catch {
      // Graceful fallback if Web Audio is restricted
    }
  }

  private playRain() {
    if (!this.ctx || !this.gainNode) return;
    // Generate pink noise buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(900, this.ctx.currentTime);

    whiteNoise.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    whiteNoise.start(0);
    this.noiseNode = whiteNoise;
  }

  private playCalmingDrone() {
    if (!this.ctx || !this.gainNode) return;
    // Harmonic frequencies in warm meditative scale (C3, G3, C4, E4)
    const frequencies = [130.81, 196.00, 261.63, 329.63];

    frequencies.forEach((freq, index) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const individualVolume = 0.08 / (index + 1);
      oscGain.gain.setValueAtTime(individualVolume, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  private playOceanWaves() {
    if (!this.ctx || !this.gainNode) return;
    // Modulated pink noise to simulate wave ebbs and flows
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'bandpass';
    this.filterNode.frequency.setValueAtTime(350, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // LFO for wave swelling
    this.lfoNode = this.ctx.createOscillator();
    this.lfoNode.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    this.lfoNode.connect(lfoGain);
    lfoGain.connect(this.filterNode.frequency);
    this.lfoNode.start();

    noiseSource.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    noiseSource.start();
    this.noiseNode = noiseSource;
  }

  private playBreathingGuide() {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime); // 220Hz A3

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.125, this.ctx.currentTime); // 8-second 4-in 4-out breath
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    lfo.connect(mainGain.gain);
    osc.connect(mainGain);
    mainGain.connect(this.gainNode);

    osc.start();
    lfo.start();
    this.oscillators.push(osc, lfo);
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.oscillators = [];

    if (this.lfoNode) {
      try {
        this.lfoNode.stop();
        this.lfoNode.disconnect();
      } catch {
        // ignore
      }
      this.lfoNode = null;
    }

    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop?.();
        this.noiseNode.disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }

    if (this.filterNode) {
      this.filterNode.disconnect();
      this.filterNode = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    this.currentMode = 'off';
  }

  public getMode() {
    return this.currentMode;
  }
}

export const ambientSound = new AmbientSoundEngine();
