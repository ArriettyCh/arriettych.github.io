import { roundedRectSDF, smoothStep, texture } from './liquid-glass.js';

export const DEFAULT_GLASS_XYR = {
  x: 0.3,
  y: 0.2,
  r: 0.6,
};

export const TRANSPARENT_GLASS_FILTER_STRENGTH =
  'blur(0.25px) contrast(1.12) brightness(1.15) saturate(1.15)';

export function createTransparentHeaderGlassFragment(xyr = DEFAULT_GLASS_XYR) {
  const { x, y, r } = {
    ...DEFAULT_GLASS_XYR,
    ...(xyr || {}),
  };

  return (uv) => {
    const ix = uv.x - 0.5;
    const iy = uv.y - 0.5;
    const distanceToEdge = roundedRectSDF(ix, iy, x, y, r);
    const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
    const scaled = smoothStep(0, 1, displacement);
    return texture(ix * scaled + 0.5, iy * scaled + 0.5);
  };
}

export function getTransparentHeaderGlassOptions(overrides = {}) {
  const { xyr, ...rest } = overrides;

  return {
    frosted: false,
    chromaticAberration: true,
    filterStrength: TRANSPARENT_GLASS_FILTER_STRENGTH,
    fragment: createTransparentHeaderGlassFragment(xyr),
    ...rest,
  };
}
