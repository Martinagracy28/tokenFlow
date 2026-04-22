import { create } from "zustand";
import { BrowserProvider } from "ethers";
import { toast } from "react-hot-toast";

export const useWalletStore = create((set, get) => ({
  address: null,
  isConnected: false,
  chainId: null,
  provider: null,
  signer: null,

  connect: async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not installed! Please install it to continue.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const address = accounts[0];

      set({
        address,
        isConnected: true,
        chainId: Number(network.chainId),
        provider,
        signer,
      });

      localStorage.setItem("wallet_connected", "true");
      toast.success("Wallet connected!");

      // Setup Listeners
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          get().disconnect();
        } else {
          set({ address: accounts[0] });
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet");
    }
  },

  disconnect: () => {
    set({
      address: null,
      isConnected: false,
      chainId: null,
      provider: null,
      signer: null,
    });
    localStorage.removeItem("wallet_connected");
    toast("Wallet disconnected", { icon: "🔌" });
  },

  checkConnection: async () => {
    const wasConnected = localStorage.getItem("wallet_connected") === "true";
    if (wasConnected && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          const address = accounts[0].address;

          set({
            address,
            isConnected: true,
            chainId: Number(network.chainId),
            provider,
            signer,
          });
        }
      } catch (error) {
        console.error("Auto-connect error:", error);
      }
    }
  },
}));
