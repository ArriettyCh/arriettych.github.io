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
    this.filter.setAttribute('x', '0');
    this.filter.setAttribute('y', '0');
    this.filter.setAttribute('width', this.width.toString());
    this.filter.setAttribute('height', this.height.toString());

    this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
    this.feImage.setAttribute('id', `${this.id}_map`);
    this.feImage.setAttribute('width', this.width.toString());
    this.feImage.setAttribute('height', this.height.toString());

    this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
    this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

    this.filter.appendChild(this.feImage);
    this.filter.appendChild(this.feDisplacementMap);
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

    this.filter.setAttribute('width', this.width.toString());
    this.filter.setAttribute('height', this.height.toString());
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

    this.svg.remove();
    this.canvas.remove();
  }
}
