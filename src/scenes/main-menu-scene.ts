import { MenuButton } from '../ui/menu-button';
import { getGameWidth, getGameHeight } from '../helpers';
import { BG, AAVEGOTCHI_LOGO } from '../../assets';
import { AavegotchiObject } from '../types';
import Aavegotchis from '../interfaces/aavegotchi';
import Ethers from '../web3/ethers';

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
  private ethers: Ethers;

  constructor() {
    super(sceneConfig);
  }

  public create = async (): Promise<void> => {
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG);
    this.add.image(getGameWidth(this) / 2, 135, AAVEGOTCHI_LOGO).setScale(0.4);

    await this.connectToNetwork();
    this.ethers = new Ethers();
    const network = await this.ethers.network;

    if (network.chainId === 137) {
      const gotchiFactory = new Aavegotchis(this.ethers);
      this.gotchis = await gotchiFactory.getGotchis();
      console.log(this.gotchis[0].png);

      this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, 'gotchi_0');

      this.add
        .text(100, 50, 'Click the "Start" button below to run your game.', {
          color: '#FFFFFF',
        })
        .setFontSize(24);

      new MenuButton(this, 100, 150, 'Start Game', () => {
        this.scene.start('Game');
      });

      new MenuButton(this, 100, 350, 'Disconnect', () => console.log('help button clicked'));
    } else {
      this.add
        .text(100, 50, 'Please connect to the Matic Network and refresh', {
          color: '#FFFFFF',
        })
        .setFontSize(24);
    }
  };

  public connectToNetwork = async (): Promise<void> => {
    await window.ethereum.enable();
  };
}
