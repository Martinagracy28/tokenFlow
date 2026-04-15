import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ArrowUpRight, ArrowDownRight, Gift, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useWallet } from "@/hooks/useWallet";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import {
  useStake,
  useWithdraw,
  useClaimRewards,
  useStakeInfo,
  usePendingRewards,
} from "@/hooks/useStaking";
import { formatTokenAmount, parseTokenAmount } from "@/lib/ethers";
import { cn, parseRevertReason } from "@/lib/utils";
import { toast } from "react-hot-toast";

export const StakeForm = () => {
  const [activeTab, setActiveTab] = useState("stake");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);

  const { isConnected } = useWallet();
  const { data: balance = 0n } = useTokenBalance();
  const { data: stakeInfo } = useStakeInfo();
  const { data: pendingRewards = 0n } = usePendingRewards();

  const { mutateAsync: stake } = useStake();
  const { mutateAsync: withdraw } = useWithdraw();
  const { mutateAsync: claim } = useClaimRewards();

  const tabs = [
    { id: "stake", label: "Stake", icon: ArrowUpRight },
    { id: "withdraw", label: "Withdraw", icon: ArrowDownRight },
    { id: "rewards", label: "Rewards", icon: Gift },
  ];

  const handleStake = async () => {
    if (!amount || isNaN(Number(amount)))
      return toast.error("Enter a valid amount");
    const parsedAmount = parseTokenAmount(amount);
    if (parsedAmount > balance) return toast.error("Insufficient balance");

    setLoading(true);
    const tId = toast.loading("Waiting for signature...");
    try {
      const tx = await stake({
        amount: parsedAmount,
        duration: Number(duration) * 86400,
      });
      toast.loading("Transaction pending...", { id: tId });
      await tx.wait();
      toast.success("Tokens staked successfully!", { id: tId });
      setAmount("");
    } catch (error) {
      toast.error(`Transaction failed: ${parseRevertReason(error)}`, {
        id: tId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    const tId = toast.loading("Waiting for signature...");
    try {
      const tx = await withdraw();
      toast.loading("Transaction pending...", { id: tId });
      await tx.wait();
      toast.success("Tokens withdrawn!", { id: tId });
    } catch (error) {
      toast.error(`Transaction failed: ${parseRevertReason(error)}`, {
        id: tId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    setLoading(true);
    const tId = toast.loading("Waiting for signature...");
    try {
      const tx = await claim();
      toast.loading("Transaction pending...", { id: tId });
      await tx.wait();
      toast.success("Rewards claimed!", { id: tId });
    } catch (error) {
      toast.error(`Transaction failed: ${parseRevertReason(error)}`, {
        id: tId,
      });
    } finally {
      setLoading(false);
    }
  };

  const isLocked = stakeInfo?.lockEnd
    ? BigInt(Math.floor(Date.now() / 1000)) < stakeInfo.lockEnd
    : false;

  return (
    <Card className="p-0 border-none bg-surface shadow-2xl">
      {/* Tabs */}
      <div className="flex p-1.5 bg-card/50 rounded-t-card border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-all",
                activeTab === tab.id
                  ? "bg-elevated text-text-primary shadow-lg"
                  : "text-text-secondary hover:text-text-primary hover:bg-elevated/50",
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "stake" && (
            <motion.div
              key="stake"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <Input
                  label="Stake Amount"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  suffix={
                    <span className="text-text-secondary text-xs font-bold">
                      TFW
                    </span>
                  }
                  className="pr-16"
                />

                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] text-text-secondary">
                    Available: {formatTokenAmount(balance)} TFW
                  </span>
                  <button
                    onClick={() =>
                      setAmount(formatTokenAmount(balance).replace(/,/g, ""))
                    }
                    className="text-[11px] text-accent font-bold hover:underline"
                  >
                    MAX
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-medium text-text-secondary ml-1">
                    Lock Duration (Days)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["7", "30", "90", "365"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={cn(
                          "py-2 text-xs font-medium rounded-lg border transition-all",
                          duration === d
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-border-hover",
                        )}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-2xl border border-border/50 space-y-3">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-accent mt-0.5" />
                  <div className="text-[11px] leading-relaxed text-text-secondary">
                    Staking for{" "}
                    <span className="text-text-primary font-bold">
                      {duration} days
                    </span>{" "}
                    will earn you an estimated
                    <span className="text-success font-bold">
                      {" "}
                      {((Number(amount || 0) * 12.5) / 100).toFixed(2)} TFW
                    </span>{" "}
                    in rewards.
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!isConnected}
                loading={loading}
                onClick={handleStake}
              >
                Stake Tokens
              </Button>
            </motion.div>
          )}

          {activeTab === "withdraw" && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-8">
                <p className="text-text-secondary text-sm">
                  Amount Available to Withdraw
                </p>
                <h4 className="text-4xl font-bold text-text-primary mt-2">
                  {stakeInfo ? formatTokenAmount(stakeInfo.amount) : "0.0000"}
                </h4>
              </div>

              {isLocked ? (
                <div className="p-4 bg-danger/5 border border-danger/20 rounded-2xl text-center space-y-3">
                  <Lock className="w-5 h-5 text-danger mx-auto" />
                  <p className="text-xs text-text-secondary">
                    Your tokens are locked. Force withdraw will incur a 10%
                    penalty.
                  </p>
                  <Button
                    variant="danger"
                    className="w-full"
                    loading={loading}
                    onClick={handleWithdraw}
                  >
                    Force Withdraw (10% Penalty)
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  disabled={!stakeInfo || stakeInfo.amount === 0n}
                  loading={loading}
                  onClick={handleWithdraw}
                >
                  Withdraw All Tokens
                </Button>
              )}
            </motion.div>
          )}

          {activeTab === "rewards" && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center py-8">
                <p className="text-text-secondary text-sm">
                  Pending Staking Rewards
                </p>
                <div className="flex items-baseline justify-center gap-2 mt-2">
                  <h4 className="text-4xl font-bold text-text-primary">
                    {formatTokenAmount(pendingRewards)}
                  </h4>
                  <span className="text-xl font-medium text-accent">TFW</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">
                    Auto-compound
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Restake rewards automatically
                  </span>
                </div>
                <div className="w-12 h-6 bg-elevated rounded-full relative cursor-pointer opacity-50">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-text-muted rounded-full" />
                </div>
              </div>

              <Button
                className="w-full"
                disabled={pendingRewards === 0n}
                loading={loading}
                onClick={handleClaim}
              >
                Claim Rewards
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
