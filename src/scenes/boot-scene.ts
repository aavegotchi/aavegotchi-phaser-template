import { convertInlineSVGToBlob } from '../helpers';
import Aavegotchis from '../interfaces/aavegotchi';
import Ethers from '../web3/ethers';
import * as KEYS from '../../assets';
import { AavegotchiObject } from '../types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

/**
 * The initial scene that loads all necessary assets to the game.
 */
export class BootScene extends Phaser.Scene {
  gotchis: Array<AavegotchiObject>;

  constructor() {
    super(sceneConfig);
  }

  public preload = (): void => {
    this.load.image(KEYS.MAN, 'assets/sprites/character.png');
    this.load.image(KEYS.BG, 'assets/images/bg.png');
    this.load.image(KEYS.AAVEGOTCHI_LOGO, 'assets/images/aavegotchiLogo.png');

    this.load.on(
      'filecomplete',
      (key: string) => {
        if (key === this.gotchis[this.gotchis.length - 1].imageKey) {
          this.scene.start('MainMenu', { gotchis: this.gotchis });
        }
      },
      this,
    );
    this.loadAssetsFromChain();
  };

  private loadAssetsFromChain = async () => {
    // Load assets from chain
    await this.connectToNetwork();
    const ethers = new Ethers();
    const network = await ethers.network;

    if (network.chainId === 137) {
      const gotchiFactory = new Aavegotchis(ethers);
      this.gotchis = await gotchiFactory.getGotchis();

      this.gotchis.forEach((gotchi, i) => {
        const key = `gotchi_${i}`;
        this.gotchis[i].imageKey = key;
        this.load.image(key, convertInlineSVGToBlob(gotchi.svg));
        this.load.start();
      });
    } else {
      this.scene.start('MainMenu', { error: 'Not connected to the Matic network' });
    }
  };

  public connectToNetwork = async (): Promise<void> => {
    await window.ethereum.enable();
  };
}
