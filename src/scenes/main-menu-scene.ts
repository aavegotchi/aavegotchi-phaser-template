import { MenuButton } from '../ui/menu-button';
import { getGameWidth, getGameHeight } from '../helpers';
import { BG, AAVEGOTCHI_LOGO } from '../../assets';
import { AavegotchiObject } from '../types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenuScene extends Phaser.Scene {
  private gotchis: AavegotchiObject[];
  private error: string | undefined;

  constructor() {
    super(sceneConfig);
  }

  init = (data: { gotchis: AavegotchiObject[]; error?: string }): void => {
    this.error = data.error;
    console.log('init', data);
    this.gotchis = data.gotchis;
  };

  public create = async (): Promise<void> => {
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG);
    this.add.image(getGameWidth(this) / 2, 135, AAVEGOTCHI_LOGO).setScale(0.4);

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

  private createGotchiSelect = () => {
    const panelWidth = 300;
    const containerSize = this.gotchis.length * panelWidth;

    this.add
      .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - 130, `Select your character:`, {
        color: '#FFFFFF',
      })
      .setFontSize(44)
      .setOrigin(0.5);

    this.gotchis.forEach((gotchi, i) => {
      const xPos = (getGameWidth(this) - containerSize + panelWidth) / 2 + i * panelWidth;
      this.add
        .image(xPos, getGameHeight(this) / 2 + 50, gotchi.imageKey)
        .setScale(1.4)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => this.scene.start('Game', { selectedGotchi: gotchi }));
      this.add
        .text(xPos, getGameHeight(this) / 2 + 190, gotchi.name, {
          color: '#FFFFFF',
        })
        .setFontSize(32)
        .setOrigin(0.5);
    });
  };
}
