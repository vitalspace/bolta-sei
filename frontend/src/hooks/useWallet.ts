import { derived, type Readable } from "svelte/store";
import {
  walletService,
  walletStore,
  type WalletState,
} from "../stores/walletStore";
import * as ethers from "ethers";

export function useWallet() {
  const isConnected: Readable<boolean> = derived(
    walletStore,
    ($wallet) => $wallet.isConnected
  );

  const address: Readable<string | null> = derived(
    walletStore,
    ($wallet) => $wallet.address
  );

  const chainId: Readable<number | null> = derived(
    walletStore,
    ($wallet) => $wallet.chainId
  );

  const isConnecting: Readable<boolean> = derived(
    walletStore,
    ($wallet) => $wallet.isConnecting
  );

  const error: Readable<string | null> = derived(
    walletStore,
    ($wallet) => $wallet.error
  );

  const signer: Readable<ethers.JsonRpcSigner | null> = derived(
    walletStore,
    ($wallet) => $wallet.signer
  );

  const provider: Readable<ethers.BrowserProvider | null> = derived(
    walletStore,
    ($wallet) => $wallet.provider
  );

  return {
    // Stores
    walletStore,
    isConnected,
    address,
    chainId,
    isConnecting,
    error,
    signer,
    provider,

    // Methods
    connect: walletService.connectWallet.bind(walletService),
    disconnect: walletService.disconnectWallet.bind(walletService),
    switchNetwork: walletService.switchToNetwork.bind(walletService),
    switchToSeiTestnet: walletService.switchToSeiTestnet.bind(walletService),
    checkConnection: walletService.checkConnection.bind(walletService),
  };
}

// Helper function to require wallet connection
export function requireWalletConnection(callback: () => void) {
  return () => {
    const wallet = walletStore;
    let currentState: WalletState;

    const unsubscribe = wallet.subscribe((state) => {
      currentState = state;
    });

    unsubscribe();

    if (currentState!.isConnected) {
      callback();
    } else {
      walletService.connectWallet().then((success) => {
        if (success) {
          callback();
        }
      });
    }
  };
}
