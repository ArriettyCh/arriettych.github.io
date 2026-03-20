// Adapted from https://github.com/shuding/liquid-glass
// Original implementation by Shu Ding.

export function smoothStep(a, b, t) {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function length(x, y) {
  return Math.sqrt(x * x + y * y);
}

export function roundedRectSDF(x, y, width, height, radius) {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

export function texture(x, y) {
  return { type: 't', x, y };
}

export function generateId() {
  return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
}

export class LiquidGlassEffect {
  constructor(element, options = {}) {
    if (!element) {
      return;
    }

    this.container = element;
    this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y));
    this.canvasDPI = options.canvasDPI || 1;
    this.filterStrength = options.filterStrength || 'blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)';
    this.chromaticAberration = options.chromaticAberration || false;
    // Optional frosted glass setting
    this.frosted = options.frosted || false;
    this.id = generateId();

    this.mouse = { x: 0.5, y: 0.5 };
    this.mouseUsed = false;

    this.measure();
    this.createElement();
    this.setupEventListeners();
    this.updateShader();
  }

  measure() {
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
  }

  updateFilterRegion() {
    // Determine the required filter padding based on effect
    // Frosted glass requires extra padding to prevent blur clipping at the edges
    const padding = this.frosted ? 50 : 0;

    // We adjust both x/y (offset) and width/height to center the filter over the element
    // Using pixels (not percentages) to maintain physical scale regardless of container shape
    this.filter.setAttribute('x', (-padding).toString());
    this.filter.setAttribute('y', (-padding).toString());
    this.filter.setAttribute('width', (this.width + padding * 2).toString());
    this.filter.setAttribute('height', (this.height + padding * 2).toString());
  }

  createElement() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9998;
    `;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    this.filter.setAttribute('id', `${this.id}_filter`);
    this.filter.setAttribute('filterUnits', 'userSpaceOnUse');
    this.filter.setAttribute('colorInterpolationFilters', 'sRGB');
    this.updateFilterRegion();

    this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
    this.feImage.setAttribute('id', `${this.id}_map`);
    this.feImage.setAttribute('width', this.width.toString());
    this.feImage.setAttribute('height', this.height.toString());

    this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
    this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G');
    this.feDisplacementMap.setAttribute('result', 'displaced');

    this.filter.appendChild(this.feImage);
    this.filter.appendChild(this.feDisplacementMap);

    if (this.frosted) {
      // 1. Noise generation for micro-surface (Grain & Refraction)
      this.feTurbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      this.feTurbulence.setAttribute('type', 'fractalNoise');
      this.feTurbulence.setAttribute('baseFrequency', '1.2'); // Higher frequency for tighter, finer grain
      this.feTurbulence.setAttribute('numOctaves', '2');
      this.feTurbulence.setAttribute('result', 'noise');

      // 2. Base scatter (Macro-level volume diffusion)
      // This spreads the incoming light over a wide area, causing the heavy blur.
      this.feGaussianBlurBase = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      this.feGaussianBlurBase.setAttribute('in', 'displaced');
      this.feGaussianBlurBase.setAttribute('stdDeviation', '6'); // Strong base blur
      this.feGaussianBlurBase.setAttribute('edgeMode', 'duplicate'); // Pull pixels from edges instead of black
      this.feGaussianBlurBase.setAttribute('result', 'macro_blur');

      // 3. Grain refraction (Micro-level structural displacement)
      // This uses the noise to slightly distort the blurred background, giving it volume/texture
      this.feDisplacementMapFrost = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      this.feDisplacementMapFrost.setAttribute('in', 'macro_blur');
      this.feDisplacementMapFrost.setAttribute('in2', 'noise');
      this.feDisplacementMapFrost.setAttribute('scale', '4'); // Mild refraction to maintain the shape
      this.feDisplacementMapFrost.setAttribute('xChannelSelector', 'R');
      this.feDisplacementMapFrost.setAttribute('yChannelSelector', 'G');
      this.feDisplacementMapFrost.setAttribute('result', 'micro_scatter');

      // 4. Subsurface softening (Smoothing the harsh refraction artifacts)
      // Real frosted glass isn't completely sharp at the microscopic level; light bleeds through the grain
      this.feGaussianBlurSoft = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      this.feGaussianBlurSoft.setAttribute('in', 'micro_scatter');
      this.feGaussianBlurSoft.setAttribute('stdDeviation', '0.6'); // Very light feathering to soften the noise
      this.feGaussianBlurSoft.setAttribute('edgeMode', 'duplicate');
      this.feGaussianBlurSoft.setAttribute('result', 'softened_volume');

      // 5. Surface Specular Grain
      // Instead of relying purely on refraction, we create actual tiny bright/dark spots from the noise
      this.feColorMatrixSparkle = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
      this.feColorMatrixSparkle.setAttribute('in', 'noise');
      this.feColorMatrixSparkle.setAttribute('type', 'matrix');
      // Convert RGB noise to monochrome and reduce alpha heavily so it's just a whisper of texture
      this.feColorMatrixSparkle.setAttribute('values', `
        0.33 0.33 0.33 0 0 
        0.33 0.33 0.33 0 0 
        0.33 0.33 0.33 0 0 
        0    0    0    0.08 0
      `);
      this.feColorMatrixSparkle.setAttribute('result', 'sparkle_layer');

      // 6. Final composite (Combine volume refraction + surface grain)
      // Over (alpha blending) the specular grain onto the blurred/refracted volume
      this.feCompositeGrain = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
      this.feCompositeGrain.setAttribute('in', 'sparkle_layer');
      this.feCompositeGrain.setAttribute('in2', 'softened_volume');
      this.feCompositeGrain.setAttribute('operator', 'over'); // Use alpha blending instead of arithmetic addition

      this.filter.appendChild(this.feTurbulence);
      this.filter.appendChild(this.feGaussianBlurBase);
      this.filter.appendChild(this.feDisplacementMapFrost);
      this.filter.appendChild(this.feGaussianBlurSoft);
      this.filter.appendChild(this.feColorMatrixSparkle);
      this.filter.appendChild(this.feCompositeGrain);
    }

    defs.appendChild(this.filter);
    this.svg.appendChild(defs);
    document.body.appendChild(this.svg);

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width * this.canvasDPI;
    this.canvas.height = this.height * this.canvasDPI;
    this.canvas.style.display = 'none';
    this.context = this.canvas.getContext('2d');

    this.container.style.backdropFilter = `url(#${this.id}_filter) ${this.filterStrength}`;
    this.container.style.webkitBackdropFilter = `url(#${this.id}_filter) ${this.filterStrength}`;

    // Add Edge Lighting
    const computedStyle = window.getComputedStyle(this.container);
    if (computedStyle.position === 'static') {
      this.container.style.position = 'relative';
    }

    this.lightingGroup = document.createElement('div');
    this.lightingGroup.className = 'liquid-glass-lighting';
    this.lightingGroup.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 0;
    `;

    // Base contour and soft inner grazing light
    this.ambientEdge = document.createElement('div');
    this.ambientEdge.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 
        inset 0 0 1px rgba(255, 255, 255, 0.3), 
        inset 1.5px 1.5px 6px rgba(255, 255, 255, 0.4), 
        inset -1.5px -1.5px 6px rgba(255, 255, 255, 0.2);
    `;

    // Sharp directional highlights on the corners/edges, now fading smoothly inward instead of a hard line
    this.directionalEdge = document.createElement('div');
    this.directionalEdge.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 
        inset 0 0 1px rgba(255, 255, 255, 0.9),
        inset 0 0 3px rgba(255, 255, 255, 0.7);
      -webkit-mask: 
        radial-gradient(120% 120% at 0% 0%, #000 0%, rgba(0,0,0,0.4) 40%, transparent 70%),
        radial-gradient(120% 120% at 100% 100%, rgba(0,0,0,0.6) 0%, transparent 50%);
    `;

    if (this.chromaticAberration) {
      // Subtle chromatic fringe to mimic real glass dispersion at grazing angles.
      this.chromaticEdge = document.createElement('div');
      this.chromaticEdge.style.cssText = `
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1.1px;
        background:
          radial-gradient(140% 130% at -6% 0%, rgba(255, 122, 122, 0.2) 0%, rgba(255, 122, 122, 0.08) 26%, transparent 54%),
          radial-gradient(140% 130% at 106% 100%, rgba(140, 186, 255, 0.22) 0%, rgba(140, 186, 255, 0.09) 28%, transparent 56%);
        mix-blend-mode: screen;
        opacity: 0.6;
        filter: saturate(1.08) blur(0.35px);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      `;
    }

    // Inner glow volume to give the glass physical depth
    this.innerGlow = document.createElement('div');
    this.innerGlow.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: radial-gradient(120% 120% at 0% 0%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 90%);
    `;

    this.lightingGroup.appendChild(this.ambientEdge);
    this.lightingGroup.appendChild(this.directionalEdge);
    if (this.chromaticEdge) {
      this.lightingGroup.appendChild(this.chromaticEdge);
    }
    this.lightingGroup.appendChild(this.innerGlow);
    this.container.appendChild(this.lightingGroup);
  }

  resize() {
    const previousWidth = this.width;
    const previousHeight = this.height;

    this.measure();

    if (previousWidth === this.width && previousHeight === this.height) {
      return;
    }

    this.canvas.width = this.width * this.canvasDPI;
    this.canvas.height = this.height * this.canvasDPI;

    this.updateFilterRegion();
    this.feImage.setAttribute('width', this.width.toString());
    this.feImage.setAttribute('height', this.height.toString());

    this.updateShader();
  }

  setupEventListeners() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.resize();
      });
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener('resize', () => {
        this.resize();
      });
    }

    this.handleMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();

      if (e.clientY > rect.bottom + 50) {
        return;
      }

      this.mouse.x = (e.clientX - rect.left) / rect.width;
      this.mouse.y = (e.clientY - rect.top) / rect.height;

      if (this.mouseUsed) {
        this.updateShader();
      }
    };

    document.addEventListener('mousemove', this.handleMouseMove);
  }

  updateShader() {
    const mouseProxy = new Proxy(this.mouse, {
      get: (target, prop) => {
        this.mouseUsed = true;
        return target[prop];
      }
    });

    this.mouseUsed = false;

    const w = this.width * this.canvasDPI;
    const h = this.height * this.canvasDPI;

    if (w <= 0 || h <= 0) {
      return;
    }

    const data = new Uint8ClampedArray(w * h * 4);
    let maxScale = 0;
    const rawValues = [];

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = this.fragment({ x: x / w, y: y / h }, mouseProxy);
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / maxScale + 0.5;
      const g = rawValues[index++] / maxScale + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    this.context.putImageData(new ImageData(data, w, h), 0, 0);
    this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
    this.feDisplacementMap.setAttribute('scale', (maxScale / this.canvasDPI).toString());
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.handleMouseMove) {
      document.removeEventListener('mousemove', this.handleMouseMove);
    }

    if (this.lightingGroup) {
      this.lightingGroup.remove();
    }

    this.svg.remove();
    this.canvas.remove();
  }
}
