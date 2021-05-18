import * as Phaser from 'phaser';

export class MenuButton extends Phaser.GameObjects.Rectangle {
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick?: () => void) {
    super(scene, x, y);
    scene.add.existing(this);

    this.setStrokeStyle(5, 16775781);
    this.setSize(200, 50);
    this.setOrigin(0.5, 0.5);

    this.label = scene.add.text(x, y, text).setFontSize(24).setOrigin(0.5, 0.5).setAlign('center');

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', this.enterMenuButtonHoverState)
      .on('pointerout', this.enterMenuButtonRestState)
      .on('pointerdown', this.enterMenuButtonActiveState)
      .on('pointerup', this.enterMenuButtonHoverState);

    if (onClick) {
      this.on('pointerup', onClick);
    }

    this.enterMenuButtonRestState();
  }

  private enterMenuButtonHoverState() {
    this.label.setColor('#FFFFFF');
    this.setFillStyle(7479028);
  }

  private enterMenuButtonRestState() {
    this.label.setColor('#FFFFFF');
    this.setFillStyle(4988797);
  }

  private enterMenuButtonActiveState() {
    this.label.setColor('#FFFFFF');
    this.setFillStyle(7479028);
  }
}
