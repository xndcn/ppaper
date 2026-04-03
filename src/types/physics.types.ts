/**
 * 物理系统类型定义
 *
 * 所有物理计算使用的纯数据类型，不依赖 Phaser。
 */

/** 二维向量 */
export interface Vector2 {
  readonly x: number;
  readonly y: number;
}

/** 物理状态快照 */
export interface PhysicsState {
  readonly position: Vector2;
  readonly velocity: Vector2;
  readonly pitchAngle: number; // 机身俯仰角（弧度）
  readonly attackAngle: number; // 攻角 = pitchAngle - velocityAngle
  readonly mass: number;
  readonly wingArea: number;
  readonly aspectRatio: number;
  readonly cd0: number; // 零升阻力系数
}

/** 阵风状态 */
export interface GustState {
  readonly direction: Vector2;
  readonly strength: number;
  readonly startTime: number;
  readonly duration: number;
}

/** 热气流区域 */
export interface ThermalZone {
  readonly position: Vector2;
  readonly radius: number;
  readonly liftStrength: number;
}

/** 赛道风力状态 */
export interface WindState {
  readonly base: Vector2;
  readonly gusts: readonly GustState[];
  readonly thermals: readonly ThermalZone[];
}
