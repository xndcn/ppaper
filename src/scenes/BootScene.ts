/**
 * 启动场景 — 加载共享资源，显示游戏标题。
 *
 * Phase 0 仅作为 Hello World 占位，后续会加载字体/UI 图集并切换到 MainMenuScene。
 */

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Phase 0：不加载任何资源
  }

  create(): void {
    const { width, height } = this.cameras.main;
    this.add.text(width / 2, height / 2, 'PPaper', {
      fontFamily: 'monospace',
      fontSize: '64px',
      color: '#ffffff',
    }).setOrigin(0.5);
  }
}
