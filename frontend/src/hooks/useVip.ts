import { writable, get } from 'svelte/store';
import { useWallet } from './useWallet';
import { VIP_ADDRESS } from '../contants/constants';
import vipABI from '../abi/vipMembership.json';
import * as ethers from 'ethers';

interface VipData {
  price: string;
  isVip: boolean;
  expiry: number;
  loading: boolean;
  error: string | null;
}

const vipStore = writable<VipData>({
  price: '0',
  isVip: false,
  expiry: 0,
  loading: false,
  error: null
});

export function useVip() {
  const { signer, address, isConnected } = useWallet();

  async function loadVipData() {
    const currentSigner = get(signer);
    const currentAddress = get(address);
    const connected = get(isConnected);
    
    if (!connected || !currentSigner) return;
    
    vipStore.update(state => ({ ...state, loading: true, error: null }));
    
    try {
      const contract = new ethers.Contract(VIP_ADDRESS, vipABI, currentSigner);
      
      const [price, isVip, expiry] = await Promise.all([
        contract.membershipPrice(),
        contract.isVIPMember(currentAddress),
        contract.getMembershipExpiry(currentAddress)
      ]);
      
      vipStore.set({
        price: ethers.formatEther(price),
        isVip,
        expiry: Number(expiry) * 1000, // Convert to milliseconds
        loading: false,
        error: null
      });
    } catch (error) {
      vipStore.update(state => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }

  async function buyMembership() {
    const currentSigner = get(signer);
    const connected = get(isConnected);
    
    if (!connected || !currentSigner) return;
    
    vipStore.update(state => ({ ...state, loading: true, error: null }));
    
    try {
      const contract = new ethers.Contract(VIP_ADDRESS, vipABI, currentSigner);
      const price = await contract.membershipPrice();
      
      const tx = await contract.buyMembership({ value: price });
      await tx.wait();
      
      // Reload data after purchase
      await loadVipData();
    } catch (error) {
      vipStore.update(state => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Error en la compra'
      }));
    }
  }

  return {
    vipStore,
    loadVipData,
    buyMembership
  };
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('es-ES');
}

export function isExpired(expiry: number): boolean {
  return expiry > 0 && Date.now() > expiry;
}