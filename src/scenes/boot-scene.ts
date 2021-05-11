import { getGameWidth, getGameHeight } from '../helpers';
import Aavegotchis from '../interfaces/aavegotchi';
import Ethers from '../web3/ethers';
import * as KEYS from '../../assets';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload = async (): Promise<void> => {
    const halfWidth = getGameWidth(this) * 0.5;
    const halfHeight = getGameHeight(this) * 0.5;

    const progressBarHeight = 100;
    const progressBarWidth = 400;

    const progressBarContainer = this.add.rectangle(
      halfWidth,
      halfHeight,
      progressBarWidth,
      progressBarHeight,
      0x000000,
    );
    const progressBar = this.add.rectangle(
      halfWidth + 20 - progressBarContainer.width * 0.5,
      halfHeight,
      10,
      progressBarHeight - 20,
      0x888888,
    );

    const loadingText = this.add.text(halfWidth - 75, halfHeight - 100, 'Loading...').setFontSize(24);
    const percentText = this.add.text(halfWidth - 25, halfHeight, '0%').setFontSize(24);
    const assetText = this.add.text(halfWidth - 25, halfHeight + 100, '').setFontSize(24);

    this.load.on('progress', (value) => {
      progressBar.width = (progressBarWidth - 30) * value;

      const percent = value * 100;
      percentText.setText(`${percent}%`);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText(file.key);
    });

    this.load.on('complete', () => {
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      progressBar.destroy();
      progressBarContainer.destroy();
    });

    await this.loadAssets();
  };

  /**
   * All assets that need to be loaded by the game (sprites, images, animations, tiles, music, etc)
   * should be added to this method. Once loaded in, the loader will keep track of them, indepedent of which scene
   * is currently active, so they can be accessed anywhere.
   */
  private loadAssets = async () => {
    // Load local assets
    this.load.image(KEYS.MAN, 'assets/sprites/character.png');
    this.load.image(KEYS.BG, 'assets/images/bg.png');
    this.load.image(KEYS.AAVEGOTCHI_LOGO, 'assets/images/aavegotchiLogo.png');

    // Load assets from chain
    await this.connectToNetwork();
    const ethers = new Ethers();
    const network = await ethers.network;

    if (network.chainId === 137) {
      const gotchiFactory = new Aavegotchis(ethers);
      const gotchis = await gotchiFactory.getGotchis();
      console.log('Loaded gotchis:', gotchis);
      gotchis.forEach((gotchi, i) => {
        this.load.image(`gotchi_${i}`, gotchi.png);
      });
    }

    this.scene.start('MainMenu');
  };

  public connectToNetwork = async (): Promise<void> => {
    await window.ethereum.enable();
  };
}
