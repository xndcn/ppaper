import { describe, it, expect } from 'vitest';
import {
  vectorAdd,
  vectorSubtract,
  vectorScale,
  vectorNormalize,
  lerp,
  degreesToRadians,
  radiansToDegrees,
} from '@/utils/math';

describe('vectorAdd', () => {
  it('adds two vectors', () => {
    const result = vectorAdd({ x: 1, y: 2 }, { x: 3, y: 4 });
    expect(result).toEqual({ x: 4, y: 6 });
  });

  it('handles zero vectors', () => {
    const result = vectorAdd({ x: 0, y: 0 }, { x: 0, y: 0 });
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('returns new object (immutability)', () => {
    const a = { x: 1, y: 2 };
    const b = { x: 3, y: 4 };
    const result = vectorAdd(a, b);
    expect(result).not.toBe(a);
    expect(result).not.toBe(b);
  });
});

describe('vectorSubtract', () => {
  it('subtracts two vectors', () => {
    const result = vectorSubtract({ x: 5, y: 7 }, { x: 2, y: 3 });
    expect(result).toEqual({ x: 3, y: 4 });
  });

  it('handles negative results', () => {
    const result = vectorSubtract({ x: 1, y: 1 }, { x: 3, y: 5 });
    expect(result).toEqual({ x: -2, y: -4 });
  });

  it('returns new object (immutability)', () => {
    const a = { x: 1, y: 2 };
    const b = { x: 3, y: 4 };
    const result = vectorSubtract(a, b);
    expect(result).not.toBe(a);
    expect(result).not.toBe(b);
  });
});

describe('vectorScale', () => {
  it('scales a vector', () => {
    const result = vectorScale({ x: 2, y: 3 }, 2);
    expect(result).toEqual({ x: 4, y: 6 });
  });

  it('scales by zero', () => {
    const result = vectorScale({ x: 5, y: 10 }, 0);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('scales by negative', () => {
    const result = vectorScale({ x: 1, y: 1 }, -1);
    expect(result).toEqual({ x: -1, y: -1 });
  });

  it('returns new object (immutability)', () => {
    const v = { x: 2, y: 3 };
    const result = vectorScale(v, 2);
    expect(result).not.toBe(v);
  });
});

describe('vectorNormalize', () => {
  it('normalizes a vector', () => {
    const result = vectorNormalize({ x: 3, y: 4 });
    expect(result.x).toBeCloseTo(0.6);
    expect(result.y).toBeCloseTo(0.8);
  });

  it('returns zero vector for zero input', () => {
    const result = vectorNormalize({ x: 0, y: 0 });
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('unit vector remains unchanged', () => {
    const result = vectorNormalize({ x: 1, y: 0 });
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(0);
  });

  it('returns new object (immutability)', () => {
    const v = { x: 3, y: 4 };
    const result = vectorNormalize(v);
    expect(result).not.toBe(v);
  });
});

describe('lerp', () => {
  it('interpolates correctly', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  it('clamps t below 0', () => {
    expect(lerp(0, 10, -1)).toBe(0);
  });

  it('clamps t above 1', () => {
    expect(lerp(0, 10, 2)).toBe(10);
  });

  it('returns a for t=0', () => {
    expect(lerp(5, 15, 0)).toBe(5);
  });

  it('returns b for t=1', () => {
    expect(lerp(5, 15, 1)).toBe(15);
  });
});

describe('degreesToRadians', () => {
  it('converts 180 degrees to PI', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
  });

  it('converts 90 degrees to PI/2', () => {
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
  });

  it('converts 0 degrees to 0', () => {
    expect(degreesToRadians(0)).toBe(0);
  });

  it('converts 360 degrees to 2*PI', () => {
    expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
  });
});

describe('radiansToDegrees', () => {
  it('converts PI to 180 degrees', () => {
    expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
  });

  it('converts PI/2 to 90 degrees', () => {
    expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
  });

  it('converts 0 to 0 degrees', () => {
    expect(radiansToDegrees(0)).toBe(0);
  });

  it('converts 2*PI to 360 degrees', () => {
    expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360);
  });
});
