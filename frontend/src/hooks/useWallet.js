import { useWalletStore } from "@/store/walletStore";

export const useWallet = () => {
  const {
    address,
    isConnected,
    chainId,
    provider,
    signer,
    connect,
    disconnect,
    checkConnection,
  } = useWalletStore();
  return {
    address,
    isConnected,
    chainId,
    provider,
    signer,
    connect,
    disconnect,
    checkConnection,
    truncatedAddress: address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : "",
  };
};
