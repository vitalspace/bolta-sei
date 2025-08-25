import { writable, derived, get } from "svelte/store";
import { useWallet } from "#hooks/useWallet";
import clanAbi from "../abi/clanAbi.json";
import { ethers } from "ethers";

const CLAN_CONTRACT_ABI = clanAbi;

const { address, isConnected, signer, provider } = useWallet();

class UseClan {
  private contract: ethers.Contract | null = null;

  private async waitForProvider(): Promise<ethers.BrowserProvider> {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      const prov = get(provider);
      if (prov) {
        return prov;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error("Provider no disponible después de múltiples intentos");
  }

  private async initContract() {
    const prov = await this.waitForProvider();
    this.contract = new ethers.Contract(
      "0x8EfCD4A1C39F4B17d811659282fFF76Fe964Ac50",
      CLAN_CONTRACT_ABI,
      prov
    );
  }

  async getContract() {
    if (!this.contract) {
      await this.initContract(); // 👈 inicializa aquí si no existe
    }
    return this.contract!;
  }

  // Métodos de lectura (view functions)
  async getAllClans() {
    // Retry logic para manejar problemas de inicialización
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const contract = await this.getContract();
        const result = await contract.getAllClans();
        return result;
      } catch (error) {
        if (attempt === 2) throw error; // Re-throw on last attempt
        
        // Reset contract and wait before retry
        this.contract = null;
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }

  async getClan(clanName: string) {
    const contract = await this.getContract();
    return await contract.getClan(clanName);
  }

  async getClanJoinPrice(clanName: string) {
    const contract = await this.getContract();
    return await contract.getClanJoinPrice(clanName);
  }

  async getMemberCount(clanName: string) {
    const contract = await this.getContract();
    return await contract.getMemberCount(clanName);
  }

  async getPlayerClan(playerAddress: string) {
    const contract = await this.getContract();
    return await contract.getPlayerClan(playerAddress);
  }

  async getClansInfo(clanName: string) {
    const contract = await this.getContract();
    return await contract.clans(clanName);
  }

  async getClanByIndex(index: number) {
    const contract = await this.getContract();
    return await contract.clansList(index);
  }

  async getClanLogo(clanName: string) {
    const contract = await this.getContract();
    return await contract.getClanLogo(clanName);
  }

  // Métodos de escritura (requieren signer)
  private async getContractWithSigner() {
    const sign = get(signer);
    if (!sign) {
      throw new Error("Signer no disponible. Conecta tu wallet primero.");
    }
    const contract = await this.getContract();
    return contract.connect(sign);
  }

  async createClan(name: string, acronym: string, logoUrl: string) {
    const contract = await this.getContractWithSigner();
    // Cast contract to any to bypass TypeScript type checking since we know the method exists
    //@ts-ignore
    return await contract.createClan(name, acronym, logoUrl);
  }

  async joinClan(clanName: string, value?: string) {
    const contract = await this.getContractWithSigner();
    const options = value ? { value: ethers.parseEther(value) } : {};
    //@ts-ignore
    return await contract.joinClan(clanName, options);
  }

  async leaveClan() {
    const contract = await this.getContractWithSigner();
    //@ts-ignore
    return await contract.leaveClan();
  }

  async addMember(clanName: string, memberAddress: string) {
    const contract = await this.getContractWithSigner();
    //@ts-ignore
    return await contract.addMember(clanName, memberAddress);
  }

  async removeMember(clanName: string, memberAddress: string) {
    const contract = await this.getContractWithSigner();
    //@ts-ignore
    return await contract.removeMember(clanName, memberAddress);
  }

  async setJoinPrice(clanName: string, price: string) {
    const contract = await this.getContractWithSigner();
    //@ts-ignore
    return await contract.setJoinPrice(clanName, ethers.parseEther(price));
  }

  async dissolveClan(clanName: string) {
    const contract = await this.getContractWithSigner();
    //@ts-ignore
    return await contract.dissolveClan(clanName);
  }

  async updateClanLogo(clanName: string, newLogoUrl: string) {
    const contract = await this.getContractWithSigner();
    //@ts-ignore
    return await contract.updateClanLogo(clanName, newLogoUrl);
  }
}

export const useClan = new UseClan();
