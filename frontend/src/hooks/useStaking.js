import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contract } from "ethers";
import { useWallet } from "./useWallet";
import { STAKING_ABI, STAKING_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS, ERC20_ABI } from "@/lib/contracts";

export const useStakeInfo = () => {
  const { address, provider } = useWallet();

  return useQuery({
    queryKey: ["stakeInfo", address],
    queryFn: async () => {
      if (!address || !provider) return null;
      const contract = new Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        provider,
      );
      const stake = await contract.stakes(address);
      return { 
        amount: stake.amount, 
        lastUpdated: stake.lastUpdated,
        rewards: stake.rewards,
        lockEnd: stake.lockEndTime 
      };
    },
    enabled: !!address && !!provider,
    refetchInterval: 10000,
  });
};

export const usePendingRewards = () => {
  const { address, provider } = useWallet();

  return useQuery({
    queryKey: ["pendingRewards", address],
    queryFn: async () => {
      if (!address || !provider) return BigInt(0);
      const contract = new Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        provider,
      );
      return await contract.pendingRewards(address);
    },
    enabled: !!address && !!provider,
    refetchInterval: 5000,
  });
};

export const useRewardRate = () => {
  const { provider } = useWallet();

  return useQuery({
    queryKey: ["rewardRate"],
    queryFn: async () => {
      if (!provider) return BigInt(0);
      const contract = new Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        provider,
      );
      return await contract.rewardRate();
    },
    enabled: !!provider,
  });
};

export const useStake = () => {
  const { signer } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, duration }) => {
      if (!signer) throw new Error("Wallet not connected");
      const contract = new Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        signer,
      );
      const tx = await contract.stake(amount, duration);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeInfo"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
    },
  });
};

export const useWithdraw = () => {
  const { signer } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount) => {
      if (!signer) throw new Error("Wallet not connected");
      const contract = new Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        signer,
      );
      const tx = await contract.withdraw(amount);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeInfo"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
    },
  });
};

export const useClaimRewards = () => {
  const { signer } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Wallet not connected");
      const contract = new Contract(
        STAKING_CONTRACT_ADDRESS,
        STAKING_ABI,
        signer,
      );
      const tx = await contract.claim();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRewards"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
    },
  });
};

export const useAllowance = () => {
  const { address, provider } = useWallet();

  return useQuery({
    queryKey: ["allowance", address, STAKING_CONTRACT_ADDRESS],
    queryFn: async () => {
      if (!address || !provider) return 0n;
      const contract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        ERC20_ABI,
        provider
      );
      return await contract.allowance(address, STAKING_CONTRACT_ADDRESS);
    },
    enabled: !!address && !!provider,
    refetchInterval: 10000,
  });
};

export const useApprove = () => {
  const { signer } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount) => {
      if (!signer) throw new Error("Wallet not connected");
      const contract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        ERC20_ABI,
        signer
      );
      const tx = await contract.approve(STAKING_CONTRACT_ADDRESS, amount);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allowance"] });
    },
  });
};
