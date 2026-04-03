/**
 * 数学工具函数 — 纯函数，无副作用。
 *
 * 用于向量运算、插值、角度转换等物理计算基础操作。
 */

import type { Vector2 } from '@/types/physics.types';

/** 向量加法 */
export function vectorAdd(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

/** 向量减法 */
export function vectorSubtract(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

/** 向量缩放 */
export function vectorScale(v: Vector2, scalar: number): Vector2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

/** 向量归一化 — 零向量返回 {0, 0} */
export function vectorNormalize(v: Vector2): Vector2 {
  const magnitude = Math.hypot(v.x, v.y);
  if (magnitude === 0) return { x: 0, y: 0 };
  return { x: v.x / magnitude, y: v.y / magnitude };
}

/** 线性插值 — t 钳制在 [0, 1] 范围 */
export function lerp(a: number, b: number, t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return a + (b - a) * clamped;
}

/** 角度转弧度 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** 弧度转角度 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
