const CONFIG = {
  color: '#ffffff',
  glyphs: ['.', ':', '-', '=', '+', '*', '#', '@'],
  grid: {
    baseStep: 6,
    mobileStep: 7,
    largeStep: 5,
    dprCap: 2,
    fontScale: 0.94,
  },
  motion: {
    reducedFactor: 0.52,
    scrollVelocityScale: 1500,
    pointerSmoothing: 0.18,
    pointerStrengthSmoothing: 0.14,
  },
  particles: {
    areaReference: 1440 * 900,
    back: 1400,
    front: 2400,
    ember: 650,
    ambient: 160,
    titleMin: 420,
    titleMax: 1500,
    titleRatio: 0.86,
  },
  mountain: {
    frontBaseLevel: 0.848,
    backBaseLevel: 0.73,
    frontRelief: 0.58,
    backRelief: 1,
    frontDepthRows: 27,
    backDepthRows: 24,
  },
  disturbance: {
    pointerRadius: 200,
    pointerRepel: 0.62,
    pointerSwirl: 0.18,
    pointerLift: 0.26,
    pointerWake: 0.24,
    scrollNormalForce: 0.3,
    scrollShear: 0.22,
    scrollLift: 0.24,
  },
  field: {
    curlEpsilon: 0.65,
  },
  raster: {
    frontGlowDecay: 0.9,
    backGlowDecay: 0.92,
    escapeGlowDecay: 0.95,
    ambientGlowDecay: 0.97,
    titleGlowDecay: 0.9,
    glowMix: 0.72,
    stochasticFloor: 0.008,
  },
  title: {
    centerY: 0.56,
    widthRatio: 0.84,
    maxWidth: 1080,
    minFontSize: 72,
    maxFontSize: 158,
    lineHeight: 0.84,
    maxTravelRows: 22,
    revealStart: 0.08,
    revealEnd: 0.84,
    glyphFloor: 5,
    bounceStrength: 0.072,
    bounceDamping: 9.8,
    bounceFrequency: 0.48,
    velocityLeadCap: 1.1,
    velocityActivityGain: 0.18,
  },
  blend: {
    titleReplaceByRank: true,
  },
  resolve: {
    frontThreshold: 0.078,
    titleThreshold: 0.078,
    backgroundThreshold: 0.02,
  },
  layers: {
    back: {
      key: 'back',
      seed: 37,
      scrollRange: -44,
      peaks: [
        { position: 0.16, width: 0.24, height: 0.13 },
        { position: 0.47, width: 0.3, height: 0.16 },
        { position: 0.81, width: 0.22, height: 0.12 },
      ],
      breatheAmp: 4.4,
      breatheSpeed: 0.28,
      breatheFreq: 6.6,
      detailScale: 4.8,
      detailAmp: 7.2,
      detailDrift: 0.018,
      waveAmp: 3.2,
      waveSpeed: 0.66,
      waveFrequency: 0.88,
      scrollWaveGain: 4.2,
      edgeRows: 5.2,
      escapeRows: 3.5,
      homePull: 0.0022,
      returnPull: 0.0105,
      innerLift: 0.0025,
      drag: 0.918,
      deposit: 0.62,
      flowScale: 0.22,
      flowStrength: 0.5,
      flowDriftX: -0.06,
      flowDriftY: 0.02,
      scrollWeight: 0.74,
      pointerWeight: 0.66,
      spawnJitter: 0.76,
      maxOutRows: 9,
      glyphFloor: 0,
      coreGlyphFloor: 2,
    },
    front: {
      key: 'front',
      seed: 61,
      scrollRange: 74,
      peaks: [
        { position: 0.15, width: 0.25, height: 0.08 },
        { position: 0.42, width: 0.28, height: 0.11 },
        { position: 0.73, width: 0.24, height: 0.09 },
      ],
      breatheAmp: 5.2,
      breatheSpeed: 0.34,
      breatheFreq: 7.2,
      detailScale: 5.8,
      detailAmp: 8.8,
      detailDrift: 0.026,
      waveAmp: 4.6,
      waveSpeed: 0.82,
      waveFrequency: 1.02,
      scrollWaveGain: 7.8,
      edgeRows: 6.6,
      escapeRows: 4.6,
      homePull: 0.0026,
      returnPull: 0.012,
      innerLift: 0.0044,
      drag: 0.91,
      deposit: 0.72,
      flowScale: 0.26,
      flowStrength: 0.66,
      flowDriftX: 0.082,
      flowDriftY: -0.024,
      scrollWeight: 1,
      pointerWeight: 1,
      spawnJitter: 0.98,
      maxOutRows: 12,
      glyphFloor: 0,
      coreGlyphFloor: 3,
    },
  },
};

const TAU = Math.PI * 2;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const fract = (value) => value - Math.floor(value);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
};

function hash2D(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed = 0) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const tx = smoothstep(0, 1, x - x0);
  const ty = smoothstep(0, 1, y - y0);
  const a = hash2D(x0, y0, seed);
  const b = hash2D(x1, y0, seed);
  const c = hash2D(x0, y1, seed);
  const d = hash2D(x1, y1, seed);
  const ab = lerp(a, b, tx);
  const cd = lerp(c, d, tx);
  return lerp(ab, cd, ty) * 2 - 1;
}

function fbm(x, y, seed = 0, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    total += amplitude * valueNoise(x * frequency, y * frequency, seed + index * 17);
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function getGridStep(width) {
  if (width >= 1540) {
    return CONFIG.grid.largeStep;
  }

  if (width < 720) {
    return CONFIG.grid.mobileStep;
  }

  return CONFIG.grid.baseStep;
}

function glyphIndexFromEnergy(energy, glyphCount, minIndex = 0) {
  const safeMin = clamp(minIndex, 0, glyphCount - 1);
  const range = glyphCount - safeMin - 1;
  return safeMin + Math.round(clamp(energy, 0, 1) * Math.max(range, 0));
}

function splitTitle(title, width) {
  const cleanTitle = title.trim().replace(/\s+/g, ' ');
  if (width > 860 || !cleanTitle.includes(' ')) {
    return [cleanTitle];
  }

  const words = cleanTitle.split(' ');
  if (words.length <= 1) {
    return [cleanTitle];
  }

  let best = [cleanTitle];
  let bestScore = Infinity;

  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(' ');
    const second = words.slice(index).join(' ');
    const score = Math.max(first.length, second.length);

    if (score < bestScore) {
      best = [first, second];
      bestScore = score;
    }
  }

  return best;
}

function getFontFromToken(token, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const font = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return font || fallback;
}

function buildGrid(width, height, step) {
  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);
  const cells = new Array(cols * rows);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const x = Math.min(width - step * 0.5, col * step + step * 0.5);
      const y = Math.min(height - step * 0.5, row * step + step * 0.5);

      cells[index] = {
        index,
        row,
        col,
        x,
        y,
        nx: cols > 1 ? col / (cols - 1) : 0.5,
        ny: rows > 1 ? row / (rows - 1) : 0.5,
        phase: hash2D(col, row, 19) * TAU,
        bias: hash2D(col + 11, row + 7, 47),
      };
    }
  }

  return { cells, cols, rows };
}

function sampleArray(field, index) {
  return index >= 0 && index < field.length ? field[index] : 0;
}

class SignalMountainRenderer {
  constructor(root) {
    this.root = root;
    this.stage = root.querySelector('[data-signal-mountain-stage]');
    this.canvas = root.querySelector('[data-signal-mountain-canvas]');
    this.context = this.canvas.getContext('2d');
    this.title = root.dataset.title || 'MOUNTAIN OF SIGNALS';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motionFactor = this.prefersReducedMotion.matches ? CONFIG.motion.reducedFactor : 1;

    this.visible = true;
    this.frameId = 0;
    this.previousTime = 0;
    this.lastScrollY = window.scrollY;
    this.lastScrollTime = performance.now();
    this.scrollDirection = 1;
    this.scrollVelocity = 0;

    this.titleBounceOffset = 0;
    this.titleBounceVelocity = 0;

    this.size = {
      width: 0,
      height: 0,
      dpr: 1,
      step: CONFIG.grid.baseStep,
    };

    this.cells = [];
    this.cols = 0;
    this.rows = 0;
    this.titleTargets = [];

    this.backRidge = new Float32Array(0);
    this.frontRidge = new Float32Array(0);
    this.backSlope = new Float32Array(0);
    this.frontSlope = new Float32Array(0);

    this.frontDensity = new Float32Array(0);
    this.frontActivity = new Float32Array(0);
    this.backDensity = new Float32Array(0);
    this.backActivity = new Float32Array(0);
    this.escapeDensity = new Float32Array(0);
    this.escapeActivity = new Float32Array(0);
    this.ambientDensity = new Float32Array(0);
    this.ambientActivity = new Float32Array(0);
    this.titleDensity = new Float32Array(0);
    this.titleActivity = new Float32Array(0);

    this.frontGlow = new Float32Array(0);
    this.backGlow = new Float32Array(0);
    this.escapeGlow = new Float32Array(0);
    this.ambientGlow = new Float32Array(0);
    this.titleGlow = new Float32Array(0);

    this.backParticles = [];
    this.frontParticles = [];
    this.emberParticles = [];
    this.ambientParticles = [];
    this.titleParticles = [];

    this.tempFlow = { x: 0, y: 0 };
    this.tempDisturbance = { x: 0, y: 0, excite: 0 };

    this.pointer = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      speed: 0,
      targetX: 0,
      targetY: 0,
      strength: 0,
      targetStrength: 0,
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleViewportResize = this.handleViewportResize.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handleMotionChange = this.handleMotionChange.bind(this);
    this.tick = this.tick.bind(this);
  }

  mount() {
    this.handleResize();
    this.pointer.x = this.size.width * 0.5;
    this.pointer.y = this.size.height * 0.72;
    this.pointer.targetX = this.pointer.x;
    this.pointer.targetY = this.pointer.y;

    this.observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        this.visible = isVisible;

        if (isVisible && !this.frameId) {
          this.previousTime = 0;
          this.frameId = window.requestAnimationFrame(this.tick);
        }

        if (!isVisible && this.frameId) {
          window.cancelAnimationFrame(this.frameId);
          this.frameId = 0;
        }
      },
      { threshold: 0.001 },
    );

    this.observer.observe(this.root);

    window.addEventListener('resize', this.handleResize);
    window.visualViewport?.addEventListener('resize', this.handleViewportResize);
    this.stage.addEventListener('pointermove', this.handlePointerMove);
    this.stage.addEventListener('pointerleave', this.handlePointerLeave);

    if ('addEventListener' in this.prefersReducedMotion) {
      this.prefersReducedMotion.addEventListener('change', this.handleMotionChange);
    } else if ('addListener' in this.prefersReducedMotion) {
      this.prefersReducedMotion.addListener(this.handleMotionChange);
    }

    document.fonts?.ready?.then(() => {
      this.handleResize();
    });

    this.frameId = window.requestAnimationFrame(this.tick);
  }

  handleViewportResize() {
    this.handleResize();
  }

  handleMotionChange() {
    this.motionFactor = this.prefersReducedMotion.matches ? CONFIG.motion.reducedFactor : 1;
    this.rebuildParticles();
  }

  handleResize() {
    const width = this.stage.clientWidth || this.root.clientWidth || window.innerWidth;
    const height = this.stage.clientHeight || this.root.clientHeight || window.innerHeight;

    if (!width || !height) {
      return;
    }

    this.size.width = width;
    this.size.height = height;
    this.size.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.grid.dprCap);
    this.size.step = getGridStep(width);
    this.motionFactor = this.prefersReducedMotion.matches ? CONFIG.motion.reducedFactor : 1;

    this.canvas.width = Math.round(width * this.size.dpr);
    this.canvas.height = Math.round(height * this.size.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.context.setTransform(this.size.dpr, 0, 0, this.size.dpr, 0, 0);
    this.context.imageSmoothingEnabled = false;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = `${Math.round(this.size.step * CONFIG.grid.fontScale)}px ${getFontFromToken('--font-mono', 'monospace')}`;

    const grid = buildGrid(width, height, this.size.step);
    this.cells = grid.cells;
    this.cols = grid.cols;
    this.rows = grid.rows;

    const count = this.cells.length;
    this.frontDensity = new Float32Array(count);
    this.frontActivity = new Float32Array(count);
    this.backDensity = new Float32Array(count);
    this.backActivity = new Float32Array(count);
    this.escapeDensity = new Float32Array(count);
    this.escapeActivity = new Float32Array(count);
    this.ambientDensity = new Float32Array(count);
    this.ambientActivity = new Float32Array(count);
    this.titleDensity = new Float32Array(count);
    this.titleActivity = new Float32Array(count);
    this.frontGlow = new Float32Array(count);
    this.backGlow = new Float32Array(count);
    this.escapeGlow = new Float32Array(count);
    this.ambientGlow = new Float32Array(count);
    this.titleGlow = new Float32Array(count);

    this.frontRidge = new Float32Array(this.cols);
    this.backRidge = new Float32Array(this.cols);
    this.frontSlope = new Float32Array(this.cols);
    this.backSlope = new Float32Array(this.cols);

    this.rebuildTitleTargets();
    this.rebuildParticles();
  }

  getStaticProgress() {
    const rect = this.root.getBoundingClientRect();
    const distance = Math.max(this.root.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / distance, 0, 1);
  }

  buildState(now, deltaSeconds = 1 / 60, frame = 1) {
    const progress = this.getStaticProgress();
    const titleLift = clamp(
      (progress - CONFIG.title.revealStart) / Math.max(CONFIG.title.revealEnd - CONFIG.title.revealStart, 0.001),
      0,
      1,
    );
    const titleReveal = easeOutCubic(smoothstep(CONFIG.title.revealStart, CONFIG.title.revealEnd, progress));

    return {
      time: now * 0.001,
      progress,
      scrollDrive: clamp(Math.abs(this.scrollVelocity) / CONFIG.motion.scrollVelocityScale, 0, 1),
      scrollDirection: this.scrollDirection,
      scrollVelocity: this.scrollVelocity,
      pointerX: this.pointer.x,
      pointerY: this.pointer.y,
      pointerStrength: this.pointer.strength,
      pointerSpeed: this.pointer.speed,
      titleLift,
      titleReveal,
      deltaSeconds,
      frame,
    };
  }

  rebuildTitleTargets() {
    if (!this.cells.length) {
      this.titleTargets = [];
      return;
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = this.size.width;
    offscreen.height = this.size.height;
    const context = offscreen.getContext('2d');

    const lines = splitTitle(this.title, this.size.width);
    const fontFamily = getFontFromToken('--font-main', 'sans-serif');
    const longestLine = lines.reduce(
      (longest, line) => (line.length > longest.length ? line : longest),
      lines[0] || this.title,
    );
    const boxWidth = Math.min(this.size.width * CONFIG.title.widthRatio, CONFIG.title.maxWidth);
    const fontSize = clamp(
      boxWidth / Math.max(longestLine.length * 0.62, 1),
      CONFIG.title.minFontSize,
      CONFIG.title.maxFontSize,
    );

    const lineHeight = fontSize * CONFIG.title.lineHeight;
    const totalHeight = lines.length * lineHeight;
    const centerY = this.size.height * CONFIG.title.centerY;

    context.clearRect(0, 0, this.size.width, this.size.height);
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `700 ${fontSize}px ${fontFamily}`;

    lines.forEach((line, index) => {
      const y = centerY - totalHeight * 0.5 + lineHeight * 0.5 + index * lineHeight;
      context.fillText(line, this.size.width * 0.5, y, boxWidth);
    });

    const data = context.getImageData(0, 0, this.size.width, this.size.height).data;
    const targets = [];

    for (const cell of this.cells) {
      const px = clamp(Math.round(cell.x), 0, this.size.width - 1);
      const py = clamp(Math.round(cell.y), 0, this.size.height - 1);
      const alpha = data[(py * this.size.width + px) * 4 + 3] / 255;

      if (alpha <= 0.08) {
        continue;
      }

      const keepChance = 0.58 + alpha * 0.42;
      if (hash2D(cell.col * 1.11, cell.row * 1.07, 93) > keepChance) {
        continue;
      }

      targets.push({
        index: cell.index,
        strength: alpha,
      });
    }

    this.titleTargets = targets;
  }

  rebuildParticles() {
    if (!this.cells.length) {
      return;
    }

    const now = performance.now();
    const state = this.buildState(now);
    this.computeRidges(state);

    const areaScale = clamp((this.size.width * this.size.height) / CONFIG.particles.areaReference, 0.72, 1.34);
    const mobileScale = this.size.width < 720 ? 0.82 : 1;
    const motionScale = lerp(0.78, 1, this.motionFactor);
    const scale = areaScale * mobileScale * motionScale;
    const makeCount = (base) => Math.max(1, Math.round(base * scale));

    const backCount = makeCount(CONFIG.particles.back);
    const frontCount = makeCount(CONFIG.particles.front);
    const emberCount = makeCount(CONFIG.particles.ember);
    const ambientCount = makeCount(CONFIG.particles.ambient);
    const titleCount = this.titleTargets.length
      ? clamp(
        Math.round(this.titleTargets.length * CONFIG.particles.titleRatio * scale),
        CONFIG.particles.titleMin,
        CONFIG.particles.titleMax,
      )
      : 0;

    this.backParticles = new Array(backCount);
    this.frontParticles = new Array(frontCount);
    this.emberParticles = new Array(emberCount);
    this.ambientParticles = new Array(ambientCount);
    this.titleParticles = new Array(titleCount);

    for (let index = 0; index < backCount; index += 1) {
      const particle = this.createParticle('back');
      this.respawnBoundParticle(particle, 'back', state, true);
      this.backParticles[index] = particle;
    }

    for (let index = 0; index < frontCount; index += 1) {
      const particle = this.createParticle('front');
      this.respawnBoundParticle(particle, 'front', state, true);
      this.frontParticles[index] = particle;
    }

    for (let index = 0; index < emberCount; index += 1) {
      const particle = this.createParticle('ember');
      this.respawnEmberParticle(particle, state, true);
      this.emberParticles[index] = particle;
    }

    for (let index = 0; index < ambientCount; index += 1) {
      const particle = this.createParticle('ambient');
      this.respawnAmbientParticle(particle, true);
      this.ambientParticles[index] = particle;
    }

    for (let index = 0; index < titleCount; index += 1) {
      const particle = this.createParticle('title');
      particle.targetSlot = this.titleTargets.length ? index % this.titleTargets.length : -1;
      this.resetTitleParticle(particle, state, true);
      this.titleParticles[index] = particle;
    }
  }

  createParticle(kind) {
    return {
      kind,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      homeX: 0,
      homeDepth: 0,
      heat: 1,
      life: 0,
      maxLife: 0,
      targetSlot: -1,
      phase: Math.random() * TAU,
      bias: Math.random(),
    };
  }

  handlePointerMove(event) {
    const rect = this.stage.getBoundingClientRect();
    this.pointer.targetX = event.clientX - rect.left;
    this.pointer.targetY = event.clientY - rect.top;
    this.pointer.targetStrength = 1;
  }

  handlePointerLeave() {
    this.pointer.targetStrength = 0;
  }

  updateProgress(now) {
    const rect = this.root.getBoundingClientRect();
    const distance = Math.max(this.root.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-rect.top / distance, 0, 1);

    const scrollY = window.scrollY;
    const deltaTime = Math.max((now - this.lastScrollTime) / 1000, 1 / 120);
    const velocity = (scrollY - this.lastScrollY) / deltaTime;

    if (Math.abs(velocity) > 2) {
      this.scrollDirection = Math.sign(velocity);
    }

    this.scrollVelocity = velocity;
    this.lastScrollY = scrollY;
    this.lastScrollTime = now;

    return progress;
  }

  getLayerBaseLevel(layerKey) {
    return layerKey === 'front' ? CONFIG.mountain.frontBaseLevel : CONFIG.mountain.backBaseLevel;
  }

  getLayerRelief(layerKey) {
    return layerKey === 'front' ? CONFIG.mountain.frontRelief : CONFIG.mountain.backRelief;
  }

  getLayerDepthRows(layerKey) {
    return layerKey === 'front' ? CONFIG.mountain.frontDepthRows : CONFIG.mountain.backDepthRows;
  }

  getRidgeY(layer, nx, state) {
    const baseLevel = this.getLayerBaseLevel(layer.key);
    const relief = this.getLayerRelief(layer.key);
    let ridge = this.size.height * baseLevel + state.progress * layer.scrollRange;

    for (const peak of layer.peaks) {
      const delta = (nx - peak.position) / peak.width;
      ridge -= Math.exp(-(delta * delta)) * this.size.height * peak.height * relief;
    }

    ridge += Math.sin(nx * layer.breatheFreq + state.time * layer.breatheSpeed + layer.seed)
      * layer.breatheAmp
      * this.motionFactor;

    ridge += fbm(
      nx * layer.detailScale + state.time * layer.detailDrift * Math.sign(layer.flowDriftX || 1),
      state.progress * 0.8 + layer.seed * 0.013,
      layer.seed + 41,
      3,
    ) * layer.detailAmp * this.motionFactor * relief;

    ridge += Math.sin(nx * layer.waveFrequency * TAU + state.time * layer.waveSpeed)
      * (layer.waveAmp + state.scrollDrive * layer.scrollWaveGain)
      * this.motionFactor;

    return ridge;
  }

  computeRidges(state) {
    for (let col = 0; col < this.cols; col += 1) {
      const nx = this.cols > 1 ? col / (this.cols - 1) : 0.5;
      this.backRidge[col] = this.getRidgeY(CONFIG.layers.back, nx, state);
      this.frontRidge[col] = this.getRidgeY(CONFIG.layers.front, nx, state);
    }

    for (let col = 0; col < this.cols; col += 1) {
      const left = Math.max(0, col - 1);
      const right = Math.min(this.cols - 1, col + 1);
      const dx = Math.max((right - left) * this.size.step, 1);
      this.backSlope[col] = (this.backRidge[right] - this.backRidge[left]) / dx;
      this.frontSlope[col] = (this.frontRidge[right] - this.frontRidge[left]) / dx;
    }
  }

  sampleFlowPotential(x, y, time, layer) {
    const u = x / this.size.step;
    const v = y / this.size.step;
    return fbm(
      u * layer.flowScale + time * layer.flowDriftX,
      v * layer.flowScale + time * layer.flowDriftY,
      layer.seed + 157,
      4,
    );
  }

  sampleCurl(out, x, y, time, layer) {
    const epsilon = CONFIG.field.curlEpsilon * this.size.step;
    const a = this.sampleFlowPotential(x + epsilon, y, time, layer);
    const b = this.sampleFlowPotential(x - epsilon, y, time, layer);
    const c = this.sampleFlowPotential(x, y + epsilon, time, layer);
    const d = this.sampleFlowPotential(x, y - epsilon, time, layer);
    const divisor = Math.max(CONFIG.field.curlEpsilon * 2, 1e-4);

    out.x = (c - d) / divisor;
    out.y = -(a - b) / divisor;
  }

  sampleDisturbance(out, x, y, state, layer, signedRows, normalX, normalY) {
    const depthRows = this.getLayerDepthRows(layer.key);
    const edgeBand = Math.exp(-Math.pow(Math.abs(signedRows) / (layer.edgeRows * 2.2), 2));
    const bodyBand =
      smoothstep(0.02, depthRows * 0.2, signedRows)
      * (1 - smoothstep(depthRows * 0.94, depthRows + 2, signedRows));
    const scrollBand = (edgeBand + bodyBand * 0.46) * state.scrollDrive * layer.scrollWeight * this.motionFactor;

    let forceX =
      normalX * scrollBand * (CONFIG.disturbance.scrollNormalForce * (0.84 + bodyBand * 0.14))
      + state.scrollDirection * scrollBand * (CONFIG.disturbance.scrollShear + bodyBand * 0.08);
    let forceY =
      normalY * scrollBand * CONFIG.disturbance.scrollNormalForce
      - scrollBand * (CONFIG.disturbance.scrollLift * (0.84 + bodyBand * 0.14));
    let excite = edgeBand * state.scrollDrive + bodyBand * state.scrollDrive * 0.38;

    if (state.pointerStrength > 0) {
      const dx = x - state.pointerX;
      const dy = y - state.pointerY;
      const distance = Math.hypot(dx, dy) || 1;
      const radius = CONFIG.disturbance.pointerRadius * (0.86 + layer.pointerWeight * 0.18);
      const normalized = distance / radius;

      if (normalized < 2.6) {
        const radial = Math.exp(-(normalized * normalized) * 1.7);
        const ring = Math.exp(-Math.pow((normalized - 0.72) / 0.22, 2));
        const wake = ring * clamp(state.pointerSpeed / (this.size.step * 2.8), 0, 1.35);
        const radialX = dx / distance;
        const radialY = dy / distance;
        const tangentX = -radialY;
        const tangentY = radialX;

        forceX += radialX * radial * CONFIG.disturbance.pointerRepel * state.pointerStrength * layer.pointerWeight;
        forceY += radialY * radial * CONFIG.disturbance.pointerRepel * state.pointerStrength * layer.pointerWeight;
        forceX +=
          tangentX * (ring * CONFIG.disturbance.pointerSwirl + wake * CONFIG.disturbance.pointerWake)
            * state.pointerStrength
            * layer.pointerWeight;
        forceY +=
          tangentY * (ring * CONFIG.disturbance.pointerSwirl + wake * CONFIG.disturbance.pointerWake)
            * state.pointerStrength
            * layer.pointerWeight;
        forceY -= ring * CONFIG.disturbance.pointerLift * state.pointerStrength * layer.pointerWeight;
        excite += (radial * 0.34 + ring * 0.5 + wake * 0.3) * layer.pointerWeight;
      }
    }

    out.x = forceX;
    out.y = forceY;
    out.excite = excite;
  }

  getColumnFromX(x) {
    return clamp(Math.round(x / this.size.step - 0.5), 0, this.cols - 1);
  }

  respawnBoundParticle(particle, layerKey, state, initial = false) {
    const layer = CONFIG.layers[layerKey];
    const x = Math.random() * this.size.width;
    const col = this.getColumnFromX(x);
    const ridge = layerKey === 'front' ? this.frontRidge[col] : this.backRidge[col];
    const depthRows = this.getLayerDepthRows(layerKey);
    const depth = (0.22 + Math.pow(Math.random(), 0.86) * depthRows) * this.size.step;

    particle.x = x;
    particle.y = ridge + depth;
    particle.vx = (Math.random() - 0.5) * layer.spawnJitter;
    particle.vy = (Math.random() - 0.5) * layer.spawnJitter;
    particle.homeX = x;
    particle.homeDepth = depth;
    particle.heat = 0.58 + Math.random() * 0.42;

    if (initial) {
      particle.x += (Math.random() - 0.5) * this.size.step * 0.8;
      particle.y += (Math.random() - 0.5) * this.size.step * 1.2;
    }

    particle.life = Infinity;
    particle.maxLife = Infinity;
  }

  chooseEmitterX(state) {
    if (state.pointerStrength > 0 && Math.random() < 0.46) {
      return clamp(
        state.pointerX + (Math.random() - 0.5) * CONFIG.disturbance.pointerRadius * 0.85,
        0,
        this.size.width,
      );
    }

    if (state.scrollDrive > 0.12 && Math.random() < 0.42) {
      const focus = clamp(0.5 + state.scrollDirection * 0.12 * state.scrollDrive, 0.08, 0.92);
      const span = this.size.width * (0.3 + state.scrollDrive * 0.18);
      return clamp(focus * this.size.width + (Math.random() - 0.5) * span, 0, this.size.width);
    }

    return Math.random() * this.size.width;
  }

  respawnEmberParticle(particle, state, initial = false) {
    const x = this.chooseEmitterX(state);
    const col = this.getColumnFromX(x);
    const ridge = this.frontRidge[col];
    const slope = this.frontSlope[col];
    const normalLength = Math.hypot(-slope, -1) || 1;
    const normalX = -slope / normalLength;
    const normalY = -1 / normalLength;
    const lift = 0.45 + Math.random() * 0.85 + state.scrollDrive * 0.9;

    particle.x = x + (Math.random() - 0.5) * this.size.step * 1.5;
    particle.y = ridge - Math.random() * this.size.step * 1.6;
    particle.vx = normalX * lift + (Math.random() - 0.5) * 0.9 + state.scrollDirection * state.scrollDrive * 0.6;
    particle.vy = normalY * lift - Math.random() * 0.6;
    particle.homeX = x;
    particle.homeDepth = ridge;
    particle.heat = 0.72 + Math.random() * 0.48;
    particle.maxLife = 1.8 + Math.random() * 2.7 + state.scrollDrive * 1.1 + state.pointerStrength * 0.8;
    particle.life = initial ? particle.maxLife * Math.random() : particle.maxLife;
  }

  respawnAmbientParticle(particle, initial = false) {
    particle.x = Math.random() * this.size.width;
    particle.y = Math.random() * this.size.height;
    particle.vx = (Math.random() - 0.5) * 0.25;
    particle.vy = (Math.random() - 0.5) * 0.25;
    particle.heat = 0.24 + Math.random() * 0.36;
    particle.maxLife = 4 + Math.random() * 8;
    particle.life = initial ? particle.maxLife * Math.random() : particle.maxLife;
    particle.homeX = particle.x;
    particle.homeDepth = particle.y;
  }

  resetTitleParticle(particle, state, initial = false) {
    if (!this.titleTargets.length || particle.targetSlot < 0) {
      particle.x = this.size.width * 0.5;
      particle.y = this.size.height * 0.8;
      particle.vx = 0;
      particle.vy = 0;
      particle.life = Infinity;
      particle.maxLife = Infinity;
      particle.heat = 1;
      return;
    }

    const target = this.titleTargets[particle.targetSlot % this.titleTargets.length];
    const cell = this.cells[target.index];
    const travel = CONFIG.title.maxTravelRows * this.size.step;
    const hiddenY = Math.min(this.size.height - this.size.step * 1.5, cell.y + travel);

    particle.x = cell.x + (Math.random() - 0.5) * this.size.step * 2.2;
    particle.y = hiddenY + (Math.random() - 0.5) * this.size.step * 1.6;
    particle.vx = initial ? (Math.random() - 0.5) * 0.4 : particle.vx * 0.35;
    particle.vy = initial ? (Math.random() - 0.5) * 0.4 : particle.vy * 0.35;
    particle.heat = 0.92 + Math.random() * 0.18;
    particle.life = Infinity;
    particle.maxLife = Infinity;
  }

  clearFields() {
    this.frontDensity.fill(0);
    this.frontActivity.fill(0);
    this.backDensity.fill(0);
    this.backActivity.fill(0);
    this.escapeDensity.fill(0);
    this.escapeActivity.fill(0);
    this.ambientDensity.fill(0);
    this.ambientActivity.fill(0);
    this.titleDensity.fill(0);
    this.titleActivity.fill(0);
  }

  splat(field, activityField, x, y, weight, activity) {
    if (
      x < -this.size.step
      || y < -this.size.step
      || x > this.size.width + this.size.step
      || y > this.size.height + this.size.step
    ) {
      return;
    }

    const gx = x / this.size.step - 0.5;
    const gy = y / this.size.step - 0.5;
    const col0 = Math.floor(gx);
    const row0 = Math.floor(gy);
    const tx = gx - col0;
    const ty = gy - row0;

    for (let rowOffset = 0; rowOffset <= 1; rowOffset += 1) {
      const row = row0 + rowOffset;
      if (row < 0 || row >= this.rows) {
        continue;
      }

      const wy = rowOffset === 0 ? 1 - ty : ty;
      for (let colOffset = 0; colOffset <= 1; colOffset += 1) {
        const col = col0 + colOffset;
        if (col < 0 || col >= this.cols) {
          continue;
        }

        const wx = colOffset === 0 ? 1 - tx : tx;
        const influence = weight * wx * wy;
        const index = row * this.cols + col;
        field[index] += influence;
        activityField[index] += influence * activity;
      }
    }
  }

  updateBoundParticle(particle, layerKey, state, field, activityField) {
    const layer = CONFIG.layers[layerKey];
    const ridgeArray = layerKey === 'front' ? this.frontRidge : this.backRidge;
    const slopeArray = layerKey === 'front' ? this.frontSlope : this.backSlope;
    const depthRows = this.getLayerDepthRows(layerKey);

    let col = this.getColumnFromX(particle.x);
    let ridge = ridgeArray[col];
    let slope = slopeArray[col];
    let normalLength = Math.hypot(-slope, -1) || 1;
    let normalX = -slope / normalLength;
    let normalY = -1 / normalLength;
    let signedRows = (particle.y - ridge) / this.size.step;

    this.sampleCurl(this.tempFlow, particle.x, particle.y, state.time, layer);
    this.sampleDisturbance(this.tempDisturbance, particle.x, particle.y, state, layer, signedRows, normalX, normalY);

    let edgeFactor = Math.exp(-Math.abs(signedRows) / layer.edgeRows);
    let bodyFactor = smoothstep(-0.8, depthRows, signedRows);
    let interiorFactor =
      smoothstep(0.12, depthRows * 0.3, signedRows)
      * (1 - smoothstep(depthRows * 0.92, depthRows + 2.2, signedRows));

    const targetY =
      ridge
      + particle.homeDepth
      + Math.sin(state.time * (0.32 + particle.bias * 0.14) + particle.phase)
        * this.size.step
        * (0.24 + interiorFactor * 0.24);
    const targetX =
      particle.homeX
      + Math.sin(state.time * (0.18 + particle.bias * 0.08) + particle.phase * 0.6)
        * this.size.step
        * (0.8 + interiorFactor * 0.76);

    let ax =
      (targetX - particle.x) * layer.homePull
      + this.tempFlow.x * layer.flowStrength
      + this.tempDisturbance.x;
    let ay =
      (targetY - particle.y) * layer.returnPull
      + this.tempFlow.y * layer.flowStrength
      + this.tempDisturbance.y
      - layer.innerLift * edgeFactor;

    if (signedRows < -layer.escapeRows) {
      ax -= normalX * 0.16 * (-signedRows - layer.escapeRows);
      ay -= normalY * 0.2 * (-signedRows - layer.escapeRows);
    }

    if (signedRows > depthRows + 2) {
      ay -= (signedRows - depthRows - 2) * 0.034;
    }

    particle.vx = (particle.vx + ax * state.frame) * layer.drag;
    particle.vy = (particle.vy + ay * state.frame) * layer.drag;
    particle.x += particle.vx * state.frame;
    particle.y += particle.vy * state.frame;

    if (
      particle.x < -this.size.step * 8
      || particle.x > this.size.width + this.size.step * 8
      || particle.y > this.size.height + this.size.step * 10
    ) {
      this.respawnBoundParticle(particle, layerKey, state);
      return;
    }

    col = this.getColumnFromX(particle.x);
    ridge = ridgeArray[col];
    slope = slopeArray[col];
    normalLength = Math.hypot(-slope, -1) || 1;
    normalX = -slope / normalLength;
    normalY = -1 / normalLength;
    signedRows = (particle.y - ridge) / this.size.step;

    edgeFactor = Math.exp(-Math.abs(signedRows) / layer.edgeRows);
    bodyFactor = smoothstep(-0.8, depthRows, signedRows);
    interiorFactor =
      smoothstep(0.12, depthRows * 0.3, signedRows)
      * (1 - smoothstep(depthRows * 0.92, depthRows + 2.2, signedRows));

    if (signedRows < -layer.maxOutRows) {
      this.respawnBoundParticle(particle, layerKey, state);
      return;
    }

    const deposit =
      layer.deposit
      * (0.24 + bodyFactor * 0.48 + edgeFactor * 0.18 + interiorFactor * 0.22)
      * (
        0.72
        + particle.heat * 0.22
        + this.tempDisturbance.excite * 0.22
        + (Math.abs(this.tempFlow.x) + Math.abs(this.tempFlow.y)) * 0.05
      );
    const speed = Math.hypot(particle.vx, particle.vy);
    const activity = clamp(
      speed / (this.size.step * 2.3)
        + edgeFactor * 0.24
        + interiorFactor * 0.22
        + this.tempDisturbance.excite * 0.48,
      0,
      1.55,
    );

    this.splat(field, activityField, particle.x, particle.y, deposit, activity);
  }

  updateEmberParticle(particle, state) {
    particle.life -= state.deltaSeconds;
    if (
      particle.life <= 0
      || particle.x < -this.size.step * 10
      || particle.x > this.size.width + this.size.step * 10
      || particle.y < -this.size.step * 10
      || particle.y > this.size.height + this.size.step * 12
    ) {
      this.respawnEmberParticle(particle, state);
      return;
    }

    const col = this.getColumnFromX(particle.x);
    const ridge = this.frontRidge[col];
    const slope = this.frontSlope[col];
    const normalLength = Math.hypot(-slope, -1) || 1;
    const normalX = -slope / normalLength;
    const normalY = -1 / normalLength;
    const signedRows = (particle.y - ridge) / this.size.step;

    this.sampleCurl(this.tempFlow, particle.x, particle.y, state.time, CONFIG.layers.front);
    this.sampleDisturbance(
      this.tempDisturbance,
      particle.x,
      particle.y,
      state,
      CONFIG.layers.front,
      signedRows,
      normalX,
      normalY,
    );

    const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
    const returnForce = smoothstep(4, 16, -signedRows) * 0.03;
    const sway = Math.sin(state.time * (0.9 + particle.bias * 0.6) + particle.phase) * 0.04;

    particle.vx =
      (particle.vx + (this.tempFlow.x * 0.82 + this.tempDisturbance.x * 1.12 + sway) * state.frame) * 0.986;
    particle.vy =
      (
        particle.vy
        + (
          this.tempFlow.y * 0.82
          + this.tempDisturbance.y * 1.18
          - lifeRatio * 0.022
          - returnForce
          - normalY * this.tempDisturbance.excite * 0.06
        ) * state.frame
      ) * 0.986;
    particle.x += particle.vx * state.frame;
    particle.y += particle.vy * state.frame;

    const deposit = (0.42 + particle.heat * 0.34) * (0.4 + (1 - lifeRatio) * 0.8 + this.tempDisturbance.excite * 0.2);
    const activity = clamp(
      Math.hypot(particle.vx, particle.vy) / (this.size.step * 2.1) + (1 - lifeRatio) * 0.45,
      0,
      1.7,
    );

    this.splat(this.escapeDensity, this.escapeActivity, particle.x, particle.y, deposit, activity);
  }

  updateAmbientParticle(particle, state) {
    particle.life -= state.deltaSeconds;
    if (
      particle.life <= 0
      || particle.x < -this.size.step * 6
      || particle.x > this.size.width + this.size.step * 6
      || particle.y < -this.size.step * 6
      || particle.y > this.size.height + this.size.step * 6
    ) {
      this.respawnAmbientParticle(particle);
      return;
    }

    this.sampleCurl(this.tempFlow, particle.x, particle.y, state.time * 0.65, CONFIG.layers.back);
    const dx = particle.x - state.pointerX;
    const dy = particle.y - state.pointerY;
    const distance = Math.hypot(dx, dy) || 1;
    const pointerBand =
      state.pointerStrength > 0
        ? Math.exp(-Math.pow(distance / (CONFIG.disturbance.pointerRadius * 1.7), 2))
        : 0;
    const wake = pointerBand * clamp(state.pointerSpeed / (this.size.step * 3.4), 0, 1.2);

    particle.vx = (particle.vx + (this.tempFlow.x * 0.18 + wake * 0.06) * state.frame) * 0.987;
    particle.vy = (particle.vy + (this.tempFlow.y * 0.18 - pointerBand * 0.03) * state.frame) * 0.987;
    particle.x += particle.vx * state.frame;
    particle.y += particle.vy * state.frame;

    const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
    const deposit = 0.12 + particle.heat * 0.18 + wake * 0.12 + (1 - lifeRatio) * 0.08;
    const activity = clamp(
      Math.hypot(particle.vx, particle.vy) / (this.size.step * 1.8) + pointerBand * 0.24,
      0,
      0.85,
    );

    this.splat(this.ambientDensity, this.ambientActivity, particle.x, particle.y, deposit, activity);
  }

  updateTitleBounce(state) {
    const drive = clamp(state.scrollVelocity / CONFIG.motion.scrollVelocityScale, -1, 1);
    this.titleBounceVelocity += drive * CONFIG.title.bounceStrength * state.frame * this.motionFactor;
    this.titleBounceVelocity += -this.titleBounceOffset * CONFIG.title.bounceFrequency * state.frame;

    const damping = Math.exp(-CONFIG.title.bounceDamping * state.deltaSeconds);
    this.titleBounceVelocity *= damping;
    this.titleBounceOffset += this.titleBounceVelocity * state.frame;

    const maxOffset = CONFIG.title.velocityLeadCap * this.size.step;
    this.titleBounceOffset = clamp(this.titleBounceOffset, -maxOffset, maxOffset);

    if (Math.abs(this.titleBounceOffset) < 0.001 && Math.abs(this.titleBounceVelocity) < 0.001) {
      this.titleBounceOffset = 0;
      this.titleBounceVelocity = 0;
    }
  }

  updateTitleParticle(particle, state) {
    if (!this.titleTargets.length || particle.targetSlot < 0) {
      return;
    }

    const target = this.titleTargets[particle.targetSlot % this.titleTargets.length];
    const cell = this.cells[target.index];
    const reveal = state.titleReveal;

    const travel = lerp(CONFIG.title.maxTravelRows * this.size.step, 0, state.titleLift);
    const baseY = cell.y + travel;
    const bounce = this.titleBounceOffset * smoothstep(0.08, 0.96, state.titleLift);

    particle.x = cell.x;
    particle.y = baseY - bounce;
    particle.vx = 0;
    particle.vy = -this.titleBounceVelocity;

    const deposit = target.strength * (0.72 + reveal * 0.5);
    const activity = clamp(
      Math.abs(this.titleBounceVelocity) / (this.size.step * 1.1) * CONFIG.title.velocityActivityGain
        + (1 - reveal) * 0.05,
      0,
      0.3,
    );

    this.splat(this.titleDensity, this.titleActivity, particle.x, particle.y, deposit, activity);
  }

  accumulateFields(state) {
    this.clearFields();

    for (const particle of this.ambientParticles) {
      this.updateAmbientParticle(particle, state);
    }

    for (const particle of this.backParticles) {
      this.updateBoundParticle(particle, 'back', state, this.backDensity, this.backActivity);
    }

    for (const particle of this.frontParticles) {
      this.updateBoundParticle(particle, 'front', state, this.frontDensity, this.frontActivity);
    }

    for (const particle of this.emberParticles) {
      this.updateEmberParticle(particle, state);
    }

    this.updateTitleBounce(state);

    for (const particle of this.titleParticles) {
      this.updateTitleParticle(particle, state);
    }
  }

  updateGlow(target, source, decay) {
    for (let index = 0; index < target.length; index += 1) {
      target[index] = Math.max(source[index], target[index] * decay);
    }
  }

  render(state) {
    if (!this.cells.length) {
      return;
    }

    this.computeRidges(state);
    this.accumulateFields(state);

    this.updateGlow(this.frontGlow, this.frontDensity, CONFIG.raster.frontGlowDecay);
    this.updateGlow(this.backGlow, this.backDensity, CONFIG.raster.backGlowDecay);
    this.updateGlow(this.escapeGlow, this.escapeDensity, CONFIG.raster.escapeGlowDecay);
    this.updateGlow(this.ambientGlow, this.ambientDensity, CONFIG.raster.ambientGlowDecay);
    this.updateGlow(this.titleGlow, this.titleDensity, CONFIG.raster.titleGlowDecay);

    const context = this.context;
    const frameSeed = Math.floor(state.time * 14);
    const glyphCount = CONFIG.glyphs.length;

    context.clearRect(0, 0, this.size.width, this.size.height);
    context.fillStyle = CONFIG.color;

    for (const cell of this.cells) {
      const twinkle = 0.5 + 0.5 * Math.sin(cell.phase + state.time * (0.72 + cell.bias * 0.52));

      const frontBase = lerp(this.frontDensity[cell.index], this.frontGlow[cell.index], CONFIG.raster.glowMix);
      const frontMotion = sampleArray(this.frontActivity, cell.index);
      const frontEnergy = clamp(frontBase * 0.84 + frontMotion * 0.2 + twinkle * 0.014, 0, 1);

      const backBase = lerp(this.backDensity[cell.index], this.backGlow[cell.index], CONFIG.raster.glowMix);
      const backMotion = sampleArray(this.backActivity, cell.index);
      const escapeBase = lerp(this.escapeDensity[cell.index], this.escapeGlow[cell.index], 0.82);
      const escapeMotion = sampleArray(this.escapeActivity, cell.index);
      const ambientBase = lerp(this.ambientDensity[cell.index], this.ambientGlow[cell.index], 0.9);
      const ambientMotion = sampleArray(this.ambientActivity, cell.index);
      const backgroundEnergy = clamp(
        backBase * 0.66
          + backMotion * 0.14
          + escapeBase * 0.72
          + escapeMotion * 0.12
          + ambientBase * 0.48
          + ambientMotion * 0.08
          + twinkle * 0.01,
        0,
        1,
      );

      const titleBase = lerp(this.titleDensity[cell.index], this.titleGlow[cell.index], 0.72);
      const titleMotion = sampleArray(this.titleActivity, cell.index);
      let titleEnergy = clamp(
        titleBase * (0.9 + state.titleReveal * 0.34)
          + titleMotion * 0.14
          + twinkle * 0.02,
        0,
        1,
      );

      const ridgeDepthRows = (cell.y - this.frontRidge[cell.col]) / this.size.step;
      if (ridgeDepthRows > 0) {
        // Soft suppression below the front ridge keeps a behind-the-mountain feel without hard masking.
        const ridgeAttenuation = 1 - smoothstep(0.2, 6.2, ridgeDepthRows);
        titleEnergy *= clamp(0.14 + ridgeAttenuation * 0.86, 0, 1);
      }

      let mountainRank = -1;
      let mountainMetric = 0;
      let mountainAlpha = 0;

      if (frontEnergy > CONFIG.resolve.frontThreshold) {
        const metric = clamp(frontEnergy + frontMotion * 0.1, 0, 1);
        const rank = glyphIndexFromEnergy(metric, glyphCount, CONFIG.layers.front.glyphFloor);
        mountainRank = rank;
        mountainMetric = metric;
        mountainAlpha = clamp(0.16 + frontEnergy * 0.82, 0, 1);

        if (metric > 0.74) {
          mountainRank = Math.max(mountainRank, CONFIG.layers.front.coreGlyphFloor);
        }
      }

      if (backgroundEnergy > CONFIG.resolve.backgroundThreshold) {
        const metric = clamp(backgroundEnergy + escapeBase * 0.18 + ambientBase * 0.14, 0, 1);
        const rank = glyphIndexFromEnergy(metric, glyphCount, CONFIG.layers.back.glyphFloor);
        const alpha = clamp(0.08 + backgroundEnergy * 0.92, 0, 0.94);

        if (mountainRank < 0 || metric > mountainMetric) {
          mountainRank = rank;
          mountainMetric = metric;
          mountainAlpha = alpha;
        }

        if (metric > 0.74) {
          mountainRank = Math.max(mountainRank, CONFIG.layers.back.coreGlyphFloor);
        }
      }

      let finalRank = mountainRank;
      let finalAlpha = mountainAlpha;
      let finalMetric = mountainMetric;

      if (titleEnergy > CONFIG.resolve.titleThreshold) {
        const metric = clamp(titleEnergy + titleMotion * 0.08, 0, 1);
        const rank = glyphIndexFromEnergy(metric, glyphCount, CONFIG.title.glyphFloor);
        const alpha = clamp(0.56 + titleEnergy * 0.42, 0, 1);

        if (!CONFIG.blend.titleReplaceByRank || rank >= finalRank) {
          finalRank = rank;
          finalMetric = metric;
          finalAlpha = alpha;
        }
      }

      if (finalRank < 0) {
        if (backgroundEnergy > CONFIG.raster.stochasticFloor) {
          const chance =
            backgroundEnergy * 3.4
            + escapeBase * 0.92
            + ambientBase * 1.16
            + state.scrollDrive * 0.04;
          const flicker = hash2D(
            cell.col + frameSeed * 0.73,
            cell.row + frameSeed * 0.31,
            401 + Math.floor(state.progress * 17),
          );

          if (flicker < chance) {
            finalMetric = clamp(backgroundEnergy * 4.4 + escapeBase * 0.62 + ambientBase * 0.82, 0, 0.24);
            finalRank = glyphIndexFromEnergy(finalMetric, glyphCount, 0);
            finalAlpha = clamp(0.045 + chance * 0.22, 0, 0.28);
          }
        }
      }

      if (finalRank < 0) {
        continue;
      }

      context.globalAlpha = finalAlpha;
      context.fillText(CONFIG.glyphs[clamp(finalRank, 0, glyphCount - 1)], Math.round(cell.x), Math.round(cell.y));
    }

    context.globalAlpha = 1;
  }

  tick(now) {
    if (!this.visible) {
      this.frameId = 0;
      return;
    }

    if (!this.cells.length) {
      this.frameId = window.requestAnimationFrame(this.tick);
      return;
    }

    const currentDpr = Math.min(window.devicePixelRatio || 1, CONFIG.grid.dprCap);
    if (Math.abs(currentDpr - this.size.dpr) > 0.01) {
      this.handleResize();
    }

    const deltaMilliseconds = this.previousTime ? now - this.previousTime : 16.666;
    const deltaSeconds = clamp(deltaMilliseconds / 1000, 1 / 120, 1 / 20);
    const frame = clamp(deltaMilliseconds / 16.666, 0.7, 1.6);
    this.previousTime = now;

    const progress = this.updateProgress(now);

    const previousPointerX = this.pointer.x;
    const previousPointerY = this.pointer.y;
    this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, CONFIG.motion.pointerSmoothing);
    this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, CONFIG.motion.pointerSmoothing);
    this.pointer.strength = lerp(
      this.pointer.strength,
      this.pointer.targetStrength,
      CONFIG.motion.pointerStrengthSmoothing,
    ) * this.motionFactor;

    this.pointer.dx = this.pointer.x - previousPointerX;
    this.pointer.dy = this.pointer.y - previousPointerY;
    this.pointer.speed = Math.hypot(this.pointer.dx, this.pointer.dy);

    const state = {
      time: now * 0.001,
      progress,
      scrollDrive: clamp(Math.abs(this.scrollVelocity) / CONFIG.motion.scrollVelocityScale, 0, 1),
      scrollDirection: this.scrollDirection,
      scrollVelocity: this.scrollVelocity,
      pointerX: this.pointer.x,
      pointerY: this.pointer.y,
      pointerStrength: this.pointer.strength,
      pointerSpeed: this.pointer.speed,
      titleLift: clamp(
        (progress - CONFIG.title.revealStart) / Math.max(CONFIG.title.revealEnd - CONFIG.title.revealStart, 0.001),
        0,
        1,
      ),
      titleReveal: easeOutCubic(
        smoothstep(CONFIG.title.revealStart, CONFIG.title.revealEnd, progress),
      ),
      deltaSeconds,
      frame,
    };

    this.render(state);
    this.frameId = window.requestAnimationFrame(this.tick);
  }
}

export default function initSignalMountainDemo() {
  const demos = document.querySelectorAll('[data-signal-mountain-demo]');

  demos.forEach((demo) => {
    if (demo.dataset.signalMountainReady === 'true') {
      return;
    }

    const renderer = new SignalMountainRenderer(demo);
    renderer.mount();
    demo.dataset.signalMountainReady = 'true';
  });
}
