/**
 * 入口文件 — 创建 Phaser 游戏实例。
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from '@/config/game.config';
import { BootScene } from '@/scenes/BootScene';

const game: Phaser.Game = new Phaser.Game({
  ...GAME_CONFIG,
  scene: [BootScene],
});

export default game;
