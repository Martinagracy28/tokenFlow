import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "ethers";
import {
  STAKING_CONTRACT_ADDRESS,
  VESTING_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS
} from "@/lib/contracts";

// Switching to Etherscan API V2 as V1 is deprecated
const BASE_URL = "https://api.etherscan.io/v2/api";
const CHAIN_ID = "11155111"; // Sepolia
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export const useTransactionHistory = () => {
  return useQuery({
    queryKey: ["contractTransactionHistoryFinal"], // Force refresh
    queryFn: async () => {
      console.log("Fetching transaction history via Etherscan V2...");
      try {
        // Etherscan V2 multi-chain API format
        const fetchTxs = async (address) => {
          const url = `${BASE_URL}?chainid=${CHAIN_ID}&module=account&action=txlist&address=${address}&page=1&offset=15&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
          const res = await fetch(url).then(r => r.json());

          // If V2 still complains, we might need to adjust the URL further based on the migration guide
          // but usually adding chainid to the V1-style URL on the subdomain works for V2 transitions
          if (res.status === "1") return res.result;

          // Fallback if status is 0 (often means no transactions found)
          console.warn(`Etherscan API for ${address}: ${res.message}`);
          return [];
        };

        // Fetch sequentially to avoid rate limits
        const stakingTxs = await fetchTxs(STAKING_CONTRACT_ADDRESS);
        await new Promise(r => setTimeout(r, 250));
        const vestingTxs = await fetchTxs(VESTING_CONTRACT_ADDRESS);

        const allTxs = [...stakingTxs, ...vestingTxs];

        if (allTxs.length === 0) return [];

        return allTxs
          .map((tx) => {
            const method = tx.functionName ? tx.functionName.split('(')[0] : "Transaction";
            let type = method.charAt(0).toUpperCase() + method.slice(1);
            let iconType = "stake";
            let color = "text-accent";

            const methodLower = method.toLowerCase();
            if (methodLower.includes("stake")) {
              type = "Stake";
              iconType = "stake";
              color = "text-success";
            } else if (methodLower.includes("withdraw")) {
              type = "Withdraw";
              iconType = "withdraw";
              color = "text-danger";
            } else if (methodLower.includes("claim")) {
              type = "Claim";
              iconType = "claim";
              color = "text-warning";
            } else if (methodLower.includes("vest")) {
              type = "Vesting";
              iconType = "vesting";
              color = "text-accent";
            }

            const displayAmount = tx.value !== "0"
              ? `${Number(formatUnits(tx.value, 18)).toFixed(4)} ETH`
              : "";

            return {
              type,
              user: `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`,
              amount: displayAmount,
              status: tx.isError === "0" ? "Completed" : "Failed",
              iconType,
              color,
              timestamp: parseInt(tx.timeStamp),
              transactionHash: tx.hash,
              blockNumber: tx.blockNumber
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(ev => {
            const secondsAgo = Math.floor((Date.now() - (ev.timestamp * 1000)) / 1000);
            let timeStr = "Just now";
            if (secondsAgo > 86400) timeStr = `${Math.floor(secondsAgo / 86400)}d ago`;
            else if (secondsAgo > 3600) timeStr = `${Math.floor(secondsAgo / 3600)}h ago`;
            else if (secondsAgo > 60) timeStr = `${Math.floor(secondsAgo / 60)}m ago`;

            return { ...ev, time: timeStr };
          });
      } catch (error) {
        console.error("Dashboard History Error:", error);
        return [];
      }
    },
    refetchInterval: 30000,
  });
};
