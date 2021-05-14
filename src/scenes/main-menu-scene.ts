import { getGameWidth, getGameHeight } from '../functions/helpers';
import { BG, AAVEGOTCHI_LOGO, CLICK, FULLSCREEN, SEND } from '../../assets';
import { AavegotchiObject } from '../types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {
  private gotchis: AavegotchiObject[];
  private error: string | undefined;

  // Sounds
  public click: Phaser.Sound.BaseSound;
  public submit: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  init = (data: { gotchis: AavegotchiObject[]; error?: string }): void => {
    this.error = data.error;
    console.log('init', data);
    this.gotchis = data.gotchis;
  };

  public create = async (): Promise<void> => {
    this.click = this.sound.add(CLICK, { loop: false });
    this.submit = this.sound.add(SEND, { loop: false });
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG);
    this.add.image(getGameWidth(this) / 2, 135, AAVEGOTCHI_LOGO).setScale(0.4);
    this.createFullScreenToggle();

    if (this.error) {
      this.add
        .text(getGameWidth(this) / 2, getGameHeight(this) / 2, `Error: ${this.error}`, {
          color: '#FFFFFF',
        })
        .setFontSize(44)
        .setOrigin(0.5);
    }
    this.createGotchiSelect();
  };

  private createFullScreenToggle = () => {
    this.add
      .image(getGameWidth(this) - 54, getGameHeight(this) - 54, FULLSCREEN)
      .setInteractive({ useHandCursor: true })
      .setScale(0.4)
      .on('pointerdown', () => {
        this.click.play();
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      });
  };

  private createGotchiSelect = () => {
    const panelWidth = 250;
    const containerSize = this.gotchis.length * panelWidth;

    this.add
      .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - 130, `Select your character:`, {
        color: '#FFFFFF',
      })
      .setFontSize(44)
      .setOrigin(0.5);

    this.gotchis.forEach((gotchi, i) => {
      const xPos = (getGameWidth(this) - containerSize + panelWidth) / 2 + i * panelWidth;
      const sprite = this.add
        .sprite(xPos, getGameHeight(this) / 2 + 50, gotchi.spritesheetWithBGKey, 1)
        .setScale(1.4)
        .setInteractive({ useHandCursor: true });

      // Set animations
      sprite.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers(gotchi.spritesheetWithBGKey, { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
      });

      // Set events
      sprite
        .on('pointerup', () => {
          this.submit.play();
          this.scene.start('Game', { selectedGotchi: gotchi });
        })
        .on('pointerover', () => {
          sprite.anims.play('idle', true);
        })
        .on('pointerout', () => {
          sprite.anims.stop();
        });

      // Add name
      this.add
        .text(xPos, getGameHeight(this) / 2 + 190, gotchi.name, {
          color: '#FFFFFF',
        })
        .setFontSize(32)
        .setOrigin(0.5);
    });
  };
}
