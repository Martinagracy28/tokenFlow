import { useQuery } from "@tanstack/react-query";
import { Contract } from "ethers";
import { useWallet } from "./useWallet";
import { ERC20_ABI, TOKEN_CONTRACT_ADDRESS } from "@/lib/contracts";

export const useTokenBalance = () => {
  const { address, provider } = useWallet();

  return useQuery({
    queryKey: ["tokenBalance", address],
    queryFn: async () => {
      if (!address || !provider) return BigInt(0);
      const contract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        ERC20_ABI,
        provider,
      );
      return await contract.balanceOf(address);
    },
    enabled: !!address && !!provider,
    refetchInterval: 30000,
  });
};
