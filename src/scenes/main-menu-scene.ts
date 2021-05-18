import { getGameWidth, getGameHeight } from '../functions/helpers';
import { BG, AAVEGOTCHI_LOGO, CLICK, FULLSCREEN, SEND, LEFT_CHEVRON, RIGHT_CHEVRON } from '../../assets';
import { AavegotchiObject } from '../types';
import { MenuButton } from '../ui/menu-button';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

export class MainMenuScene extends Phaser.Scene {
  private gotchis: AavegotchiObject[];
  private selectedGotchiIndex: number;
  private selectedGotchi: Phaser.GameObjects.Sprite;
  private selectedGotchiName: Phaser.GameObjects.Text;
  private selectedIndicator: Phaser.GameObjects.Text;

  // UI
  private error: string | undefined;

  // Sounds
  public click: Phaser.Sound.BaseSound;
  public submit: Phaser.Sound.BaseSound;

  constructor() {
    super(sceneConfig);
  }

  init = (data: { gotchis: AavegotchiObject[]; error?: string }): void => {
    this.error = data.error;
    this.gotchis = data.gotchis;
  };

  public create = async (): Promise<void> => {
    this.click = this.sound.add(CLICK, { loop: false });
    this.submit = this.sound.add(SEND, { loop: false });
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG);
    this.add.image(getGameWidth(this) / 2, 135, AAVEGOTCHI_LOGO).setScale(0.4);
    this.createFullScreenToggle();

    this.selectedGotchiIndex = 0;

    if (this.error) {
      this.add
        .text(getGameWidth(this) / 2, getGameHeight(this) / 2, `Error: ${this.error}`, {
          color: '#FFFFFF',
        })
        .setFontSize(44)
        .setOrigin(0.5);
    }
    this.createGotchiSelect();

    new MenuButton(this, getGameWidth(this) / 2, getGameHeight(this) - 200, 'START', () => {
      this.submit.play();
      this.scene.start('Game', { selectedGotchi: this.gotchis[this.selectedGotchiIndex] });
    });
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

  private createArrowRight = () => {
    this.add
      .image(getGameWidth(this) / 2 + 175, getGameHeight(this) / 2, RIGHT_CHEVRON)
      .setDisplaySize(54, 54)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.click.play();
        const index = this.selectedGotchiIndex + 1;
        this.selectedGotchiIndex = index >= this.gotchis.length ? 0 : index;
        this.updateSelectedGotchi(this.selectedGotchiIndex);
      });
  };

  private createArrowLeft = () => {
    this.add
      .image(getGameWidth(this) / 2 - 175, getGameHeight(this) / 2, LEFT_CHEVRON)
      .setDisplaySize(54, 54)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.click.play();
        const index = this.selectedGotchiIndex + 1;
        this.selectedGotchiIndex = index >= this.gotchis.length ? 0 : index;
        this.updateSelectedGotchi(this.selectedGotchiIndex);
      });
  };

  private updateSelectedGotchi = (index: number) => {
    this.selectedGotchi.setTexture(this.gotchis[index].spritesheetWithBGKey, 1);
    this.selectedGotchiName.text = this.gotchis[index].name;
    this.selectedIndicator.text = `${index + 1}/${this.gotchis.length}`;
    this.selectedGotchi.anims.create({
      key: `idle_${index}`,
      frames: this.anims.generateFrameNumbers(this.gotchis[index].spritesheetWithBGKey, {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });
    this.selectedGotchi.anims.play(`idle_${index}`);
  };

  private createSelectedGotchi = (index: number) => {
    this.selectedGotchi = this.add
      .sprite(getGameWidth(this) / 2, getGameHeight(this) / 2, this.gotchis[index].spritesheetWithBGKey, 1)
      .setScale(1.4);

    // Set animations
    this.selectedGotchi.anims.create({
      key: `idle_${index}`,
      frames: this.anims.generateFrameNumbers(this.gotchis[index].spritesheetWithBGKey, {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.selectedGotchi.anims.play(`idle_${index}`);

    // Add name
    this.selectedGotchiName = this.add
      .text(getGameWidth(this) / 2, getGameHeight(this) / 2 + 140, this.gotchis[index].name, {
        color: '#FFFFFF',
      })
      .setFontSize(32)
      .setOrigin(0.5);

    this.selectedIndicator = this.add
      .text(
        getGameWidth(this) / 2,
        getGameHeight(this) / 2 + 172,
        `${this.selectedGotchiIndex + 1}/${this.gotchis.length}`,
        {
          color: '#FFFFFF',
        },
      )
      .setFontSize(24)
      .setOrigin(0.5);
  };

  private createGotchiSelect = () => {
    this.createArrowLeft();
    this.createArrowRight();
    this.add
      .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - 150, `Select character:`, {
        color: '#FFFFFF',
      })
      .setFontSize(34)
      .setOrigin(0.5);
    this.createSelectedGotchi(this.selectedGotchiIndex);
  };
}
