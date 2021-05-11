import { BigNumber, ethers } from 'ethers';
import diamondAbi from '../abi/diamond.json';
import { AavegotchiContractObject } from '../types';
const aavegotchiAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d';

declare global {
  interface Window {
    ethereum: any;
  }
}

export default class Ethers {
  provider: ethers.providers.Web3Provider;
  contract: ethers.Contract;
  signer: ethers.Signer;

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.contract = new ethers.Contract(aavegotchiAddress, diamondAbi, this.provider);
    this.signer = this.provider.getSigner();
  }

  get address(): Promise<string> {
    return this.signer.getAddress();
  }

  get network(): Promise<ethers.providers.Network> {
    return this.provider.getNetwork();
  }

  public getAavegotchisForUser = async (): Promise<AavegotchiContractObject[]> => {
    const account = await this.address;
    const gotchis = await this.contract.allAavegotchisOfOwner(account);
    return gotchis;
  };

  public getAavegotchiSvg = async (tokenId: BigNumber): Promise<string> => {
    const svg = await this.contract.getAavegotchiSvg(tokenId);
    return svg;
  };
}
