import { AavegotchiObject, AavegotchiContractObject } from '../types';
import Ethers from '../web3/ethers';

export default class Aavegotchis {
  private ethers: Ethers;
  public gotchis: Array<AavegotchiObject>;

  constructor(ethers: Ethers) {
    this.ethers = ethers;
  }

  public getGotchis = async (): Promise<Array<AavegotchiObject>> => {
    if (this.gotchis?.length > 0) return this.gotchis;

    const gotchiRes = await this.ethers.getAavegotchisForUser();
    const gotchisWithSprites = await this.getAllAavegotchiSVGs(gotchiRes);
    this.gotchis = gotchisWithSprites;
    return gotchisWithSprites;
  };

  private getAllAavegotchiSVGs = async (gotchis: Array<AavegotchiContractObject>): Promise<Array<AavegotchiObject>> => {
    return Promise.all(
      gotchis.map(async (gotchi) => {
        const svg = await this.ethers.getAavegotchiSvg(gotchi.tokenId);
        return {
          ...gotchi,
          svg,
        };
      }),
    );
  };
}
