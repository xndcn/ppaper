/**
 * 游戏核心类型
 *
 * Phase 0 仅骨架。
 */

/** 游戏模式 */
export type GameMode = 'menu' | 'overworld' | 'competition' | 'results';

/** 比赛场景传递数据 */
export interface CompetitionSceneData {
  readonly airplane: AirplaneDataSnapshot;
  readonly runState: RunStateSnapshot;
  readonly tournamentId: string;
}

export interface AirplaneDataSnapshot {
  readonly id: string;
  readonly type: string;
}

export interface RunStateSnapshot {
  readonly currentRound: number;
  readonly paperCoins: number;
}
