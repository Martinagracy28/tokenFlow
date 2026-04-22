import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contract } from "ethers";
import { useWallet } from "./useWallet";
import { VESTING_ABI, VESTING_CONTRACT_ADDRESS } from "@/lib/contracts";

export const useVestingInfo = () => {
  const { address, provider } = useWallet();

  return useQuery({
    queryKey: ["vestingInfo", address],
    queryFn: async () => {
      if (!address || !provider) return null;
      const contract = new Contract(
        VESTING_CONTRACT_ADDRESS,
        VESTING_ABI,
        provider,
      );
      const [total, released, cliff, duration, start] =
        await contract.getVestingInfo(address);
      return { total, released, cliff, duration, start };
    },
    enabled: !!address && !!provider,
    refetchInterval: 30000,
  });
};

export const useClaimVested = () => {
  const { signer } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Wallet not connected");
      const contract = new Contract(
        VESTING_CONTRACT_ADDRESS,
        VESTING_ABI,
        signer,
      );
      const tx = await contract.claim();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vestingInfo"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
    },
  });
};
