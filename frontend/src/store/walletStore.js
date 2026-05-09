import { create } from "zustand";
import { BrowserProvider } from "ethers";
import { toast } from "react-hot-toast";

export const useWalletStore = create((set, get) => ({
  address: null,
  isConnected: false,
  chainId: null,
  provider: null,
  signer: null,

  initListeners: () => {
    if (!window.ethereum || window.ethereum._tokenFlowListenersSet) return;

    window.ethereum.on("accountsChanged", async (accounts) => {
      console.log("TokenFlow: accountsChanged", accounts);
      if (accounts.length === 0) {
        get().disconnect();
      } else {
        // Update address immediately from event data
        set({ address: accounts[0] });
        // Then re-verify everything (network, signer, etc.)
        await get().checkConnection();
      }
    });

    window.ethereum.on("chainChanged", (chainId) => {
      console.log("TokenFlow: chainChanged", chainId);
      // Modern best practice is to reload on chain change to avoid stale state
      // but we'll try to re-sync first. If that's not enough, we can reload.
      get().checkConnection();
    });

    window.ethereum._tokenFlowListenersSet = true;
  },

  ensureSepolia: async () => {
    if (!window.ethereum) return false;
    const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111
    
    try {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId === SEPOLIA_CHAIN_ID) return true;

      console.log("TokenFlow: Switching to Sepolia...");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia Test Network",
                nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
          return true;
        } catch (addError) {
          toast.error("Failed to add Sepolia network");
          return false;
        }
      }
      if (switchError.code === 4001) {
        toast.error("Please switch to Sepolia network to use TokenFlow");
      }
      return false;
    }
  },

  connect: async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not installed!");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      get().initListeners();
      
      // 1. Request Accounts First (using direct request for better compatibility)
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      
      // Update address immediately
      set({ address });

      // 2. Ensure Sepolia Network
      const isCorrectNetwork = await get().ensureSepolia();
      if (!isCorrectNetwork) {
        // If they refuse, we don't proceed with full connection
        return;
      }

      // 3. Setup Ethers provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      set({
        address,
        isConnected: true,
        chainId: Number(network.chainId),
        provider,
        signer,
      });

      localStorage.setItem("wallet_connected", "true");
      toast.success("Connected to Sepolia!");
    } catch (error) {
      console.error("Connection error:", error);
      if (error.code === 4001) {
        toast.error("Connection rejected");
      } else {
        toast.error(error.message || "Failed to connect");
      }
    }
  },

  disconnect: async () => {
    try {
      // Clear state first
      set({
        address: null,
        isConnected: false,
        chainId: null,
        provider: null,
        signer: null,
      });
      localStorage.removeItem("wallet_connected");

      if (window.ethereum?.request) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        }).catch(() => {}); // Ignore errors on revocation
      }

      toast.success("Disconnected");
    } catch (error) {
      console.error("Disconnect error:", error);
      set({ address: null, isConnected: false, chainId: null, provider: null, signer: null });
      localStorage.removeItem("wallet_connected");
    }
  },

  checkConnection: async () => {
    if (!window.ethereum) return;
    
    // Check if we were previously connected
    const wasConnected = localStorage.getItem("wallet_connected") === "true";
    
    try {
      get().initListeners();
      
      // Check current accounts
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      
      if (accounts.length > 0 && wasConnected) {
        const address = accounts[0];
        
        // Ensure Sepolia
        await get().ensureSepolia();

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        set({
          address,
          isConnected: true,
          chainId: Number(network.chainId),
          provider,
          signer,
        });
      } else if (accounts.length === 0 && wasConnected) {
        // If localStorage says connected but no accounts, disconnect
        get().disconnect();
      }
    } catch (error) {
      console.error("Auto-connect error:", error);
      // Don't disconnect here to avoid clearing localStorage on transient errors
    }
  },
}));
