import { removeBackground, constructSpritesheet, addIdleUp } from '../functions/spritesheets';
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
    this.loadInSounds();
    this.load.image(KEYS.BG, 'assets/images/bg.png');
    this.load.image(KEYS.AAVEGOTCHI_LOGO, 'assets/images/aavegotchiLogo.png');

    this.load.on(
      'filecomplete',
      (key: string) => {
        console.log(key);
        // Make sure each gotchi image asset is loaded in before starting game
        if (this.gotchis && key.includes('spritesheetBg_')) {
          const index = Number(key.replace(/\D/g, ''));

          if (index === this.gotchis.length - 1) {
            this.scene.start('MainMenu', { gotchis: this.gotchis });
          } else {
            this.loadInGotchiImages(index + 1);
          }
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

      if (!this.gotchis || this.gotchis.length === 0) {
        this.scene.start('MainMenu', { error: 'You have no gotchis in your wallet.' });
      }

      // Assign image keys
      this.gotchis = this.gotchis.map(
        (gotchi, i): AavegotchiObject => {
          return {
            ...gotchi,
            spritesheetKey: `spritesheet_${i}`,
            spritesheetWithBGKey: `spritesheetBg_${i}`,
          };
        },
      );

      await this.loadInGotchiImages(0);
    } else {
      this.scene.start('MainMenu', { error: 'Not connected to the Matic network.' });
    }
  };

  public connectToNetwork = async (): Promise<void> => {
    await window.ethereum.enable();
  };

  private loadInGotchiImages = async (i: number) => {
    const gotchi = this.gotchis[i];
    const spritesheet = await constructSpritesheet(gotchi.svg, addIdleUp(gotchi.svg));
    this.load.spritesheet(gotchi.spritesheetWithBGKey, spritesheet, {
      frameWidth: 300 / 2,
      frameHeight: 150 / 1,
    });
    const svgNoBg = removeBackground(gotchi.svg);
    const spritesheetNoBg = await constructSpritesheet(svgNoBg, addIdleUp(svgNoBg));
    this.load.spritesheet(gotchi.spritesheetKey, spritesheetNoBg, {
      frameWidth: 300 / 2,
      frameHeight: 150 / 1,
    });
    this.load.start();
  };

  private loadInSounds = () => {
    this.load.audio(KEYS.SUCCESS, ['assets/sounds/success.mp3']);
    this.load.audio(KEYS.BOOP, ['assets/sounds/boop.mp3']);
    this.load.audio(KEYS.CLICK, ['assets/sounds/click.mp3']);
    this.load.audio(KEYS.OOPS, ['assets/sounds/oops.mp3']);
    this.load.audio(KEYS.PORTAL_OPEN, ['assets/sounds/portalOpen.mp3']);
    this.load.audio(KEYS.PORTAL_OPENED, ['assets/sounds/portalOpened.mp3']);
    this.load.audio(KEYS.SEND, ['assets/sounds/send.mp3']);
    this.load.audio(KEYS.SENDING, ['assets/sounds/sending.mp3']);
  };
}
