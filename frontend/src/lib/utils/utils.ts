export const formatAddress = (addr: string | null) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const getNetworkName = (chainId: number | null) => {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 5:
      return "Goerli Testnet";
    case 11155111:
      return "Sepolia Testnet";
    case 137:
      return "Polygon Mainnet";
    case 80001:
      return "Polygon Mumbai";
    case 1329:
      return "Sei Mainnet";
    case 1328:
      return "Sei Testnet";
    default:
      return `Chain ${chainId}`;
  }
};

export const copyAddress = async (address: string) => {
  if (address) {
    await navigator.clipboard.writeText(address);
  }
};
