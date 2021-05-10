import { MenuButton } from '../ui/menu-button';
import { AavegotchiObject } from '../types';
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
  private gotchis: Array<AavegotchiObject>;
  private ethers: Ethers;

  constructor() {
    super(sceneConfig);
  }

  public create = async (): Promise<void> => {
    await this.connectToNetwork();
    this.ethers = new Ethers();

    const network = await this.ethers.network;

    if (network.chainId === 137) {
      this.gotchis = await this.ethers.getAavegotchisForUser();

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
