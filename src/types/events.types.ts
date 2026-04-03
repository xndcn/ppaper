/**
 * 游戏事件类型
 */

export const GameEvents = {
  ROUND_COMPLETE: 'round_complete',
  AIRPLANE_CRASHED: 'airplane_crashed',
  SKILL_ACTIVATED: 'skill_activated',
  REWARD_SELECTED: 'reward_selected',
} as const;

export type GameEvents = typeof GameEvents[keyof typeof GameEvents];
