import { writable } from "svelte/store";
import { ethers } from "ethers";

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  provider: null,
  signer: null,
  chainId: null,
  isConnecting: false,
  error: null,
};

export const walletStore = writable<WalletState>(initialState);

class WalletService {
  private updateStore(updates: Partial<WalletState>) {
    walletStore.update((state) => ({ ...state, ...updates }));
  }

  async connectWallet(): Promise<boolean> {
    try {
      this.updateStore({ isConnecting: true, error: null });

      // Check if MetaMask is installed
      //@ts-ignore
      if (!window.ethereum) {
        throw new Error(
         "MetaMask is not installed. Please install MetaMask"
        );
      }

      // Request account access
      //@ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("Could not access any MetaMask");
      }

      // Create provider and signer
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      this.updateStore({
        isConnected: true,
        address,
        provider,
        signer,
        chainId: Number(network.chainId),
        isConnecting: false,
        error: null,
      });

      // Listen for account changes

      //@ts-ignore
      window.ethereum.on(
        "accountsChanged",
        this.handleAccountsChanged.bind(this)
      );
      //@ts-ignore
      window.ethereum.on("chainChanged", this.handleChainChanged.bind(this));

      // Solo mostrar información de la red actual, no cambiar automáticamente
      // El usuario puede cambiar manualmente usando el botón en la UI

      return true;
    } catch (error: any) {
      this.updateStore({
        isConnecting: false,
        error: error.message || "Error connecting to MetaMask",
      });
      return false;
    }
  }

  async disconnectWallet() {
    // Remove event listeners
    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
      window.ethereum.removeAllListeners("accountsChanged");
      //@ts-ignore
      window.ethereum.removeAllListeners("chainChanged");
    }

    this.updateStore(initialState);
  }

  private async handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.disconnectWallet();
    } else {
      // Reconnect with new account
      await this.connectWallet();
    }
  }

  private handleChainChanged(chainId: string) {
    // Reload the page when chain changes
    window.location.reload();
  }

  async checkConnection(): Promise<boolean> {
    try {
      //@ts-ignore
      if (!window.ethereum) return false;
      //@ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        await this.connectWallet();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async switchToNetwork(chainId: number): Promise<boolean> {
    try {
      //@ts-ignore
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error: any) {
      // Si la red no existe, intentar agregarla (específicamente para Sei Testnet)
      if (error.code === 4902 && chainId === 1328) {
        return await this.addSeiTestnetNetwork();
      }
      this.updateStore({ error: error.message });
      return false;
    }
  }

  async addSeiTestnetNetwork(): Promise<boolean> {
    try {
      //@ts-ignore
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x530", // 1328 en hexadecimal
            chainName: "Sei Testnet",
            nativeCurrency: {
              name: "SEI",
              symbol: "SEI",
              decimals: 18,
            },
            rpcUrls: ["https://evm-rpc-testnet.sei-apis.com"],
            blockExplorerUrls: ["https://seitrace.com"],
          },
        ],
      });
      return true;
    } catch (error: any) {
      // Si ya hay una solicitud pendiente, no mostrar error
      if (error.code === -32002) {
        console.log("Sei Testnet network already added");
        return false;
      }
      this.updateStore({ error: error.message });
      return false;
    }
  }

  async switchToSeiTestnet(): Promise<boolean> {
    return await this.switchToNetwork(1328);
  }
}

export const walletService = new WalletService();

// Auto-check connection on page load
if (typeof window !== "undefined") {
  walletService.checkConnection();
}
