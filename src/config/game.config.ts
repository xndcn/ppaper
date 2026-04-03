/**
 * 游戏核心配置
 */

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 480,
  height: 854,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: { gravity: { x: 0, y: 0 }, debug: import.meta.env.DEV },
  },
  backgroundColor: '#000000',
};
