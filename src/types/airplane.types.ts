/**
 * 纸飞机类型定义
 *
 * Phase 0 仅骨架，详细字段在 Phase 2 完善。
 */

/** 纸飞机类型 */
export type AirplaneType = 'dart' | 'glider' | 'acrobatic' | 'stunt';

/** 纸飞机稀有度 */
export type AirplaneRarity = 'common' | 'rare' | 'epic' | 'legendary';

/** 纸飞机数据 */
export interface AirplaneData {
  readonly id: string;
  readonly type: AirplaneType;
  readonly name: string;
  readonly rarity: AirplaneRarity;
}
