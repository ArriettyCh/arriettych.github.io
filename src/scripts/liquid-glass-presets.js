import { roundedRectSDF, smoothStep, texture } from './liquid-glass.js';

export function createTransparentHeaderGlassFragment() {
  return (uv) => {
    const ix = uv.x - 0.5;
    const iy = uv.y - 0.5;
    const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
    const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
    const scaled = smoothStep(0, 1, displacement);
    return texture(ix * scaled + 0.5, iy * scaled + 0.5);
  };
}

export function getTransparentHeaderGlassOptions(overrides = {}) {
  return {
    frosted: false,
    fragment: createTransparentHeaderGlassFragment(),
    ...overrides,
  };
}
