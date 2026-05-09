import {
  Layers,
  Gift,
  Lock,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StakeForm } from "@/components/staking/StakeForm";
import { useWallet } from "@/hooks/useWallet";
import { useStakeInfo, usePendingRewards } from "@/hooks/useStaking";
import { useVestingInfo } from "@/hooks/useVesting";
import { useTransactionHistory } from "@/hooks/useActivity";
import { formatTokenAmount } from "@/lib/ethers";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const { isConnected, connect, address } = useWallet();
  const { data: stakeInfo, isLoading: loadingStake } = useStakeInfo();
  const { data: pendingRewards, isLoading: loadingRewards } =
    usePendingRewards();
  const { data: vestingInfo, isLoading: loadingVesting } = useVestingInfo();
  const { data: history, isLoading: loadingHistory } = useTransactionHistory();
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    if (!stakeInfo?.lockEnd) return;
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = Number(stakeInfo.lockEnd) - now;
      if (diff <= 0) {
        setTimeLeft("00:00:00");
      } else {
        const h = Math.floor(diff / 3600)
          .toString()
          .padStart(2, "0");
        const m = Math.floor((diff % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const s = (diff % 60).toString().padStart(2, "0");
        setTimeLeft(`${h}:${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [stakeInfo?.lockEnd]);

  return (
    <div className="space-y-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-text-primary">Overview</h1>
        <p className="text-text-secondary">Your DeFi portfolio at a glance</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Staked"
          value={stakeInfo ? formatTokenAmount(stakeInfo.amount) : "0.0000"}
          icon={<Layers className="w-5 h-5 text-accent" />}
          suffix="TFW"
          loading={loadingStake}
        />

        <StatCard
          label="Pending Rewards"
          value={pendingRewards ? formatTokenAmount(pendingRewards) : "0.0000"}
          icon={<Gift className="w-5 h-5 text-warning" />}
          suffix="TFW"
          loading={loadingRewards}
        />

        <StatCard
          label="Vested Tokens"
          value={
            vestingInfo ? formatTokenAmount(vestingInfo.released) : "0.0000"
          }
          icon={<Lock className="w-5 h-5 text-success" />}
          suffix="TFW"
          loading={loadingVesting}
        />

        <StatCard
          label="Remaining Lock"
          value={timeLeft}
          icon={<Clock className="w-5 h-5 text-text-muted" />}
          loading={loadingStake}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            Quick Stake
          </h2>
          <StakeForm />
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Recent Activity
            </h2>
            <Button variant="ghost" className="text-xs h-8">
              View All
            </Button>
          </div>

          <Card className="p-0 border-none bg-surface/50 overflow-hidden">
            <div className="divide-y divide-border">
              {loadingHistory ? (
                <div className="p-12 flex flex-col items-center justify-center text-text-muted gap-3">
                  <Activity className="w-8 h-8 animate-pulse opacity-20" />
                  <p className="text-sm font-medium animate-pulse">Fetching activities...</p>
                </div>
              ) : !history || history.length === 0 ? (
                <div className="p-12 text-center text-text-muted">
                  <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No recent activity found</p>
                </div>
              ) : (
                history.slice(0, 6).map((tx, i) => {
                  const Icon = tx.iconType === 'stake' ? ArrowUpRight : 
                               tx.iconType === 'withdraw' ? ArrowDownRight : 
                               tx.iconType === 'claim' ? Gift : Lock;
                  
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 hover:bg-elevated/30 transition-colors cursor-pointer group"
                      onClick={() => window.open(`https://sepolia.etherscan.io/tx/${tx.transactionHash}`, '_blank')}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2.5 rounded-xl bg-background border border-border group-hover:border-accent/30 transition-colors",
                            tx.color,
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                            {tx.type}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-text-muted font-mono bg-elevated px-1.5 py-0.5 rounded-md">
                              {tx.user}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono">{tx.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-sm font-bold", tx.color)}>
                          {tx.amount}
                        </p>
                        <Badge
                          variant="success"
                          className="mt-1 text-[10px] py-0 px-1.5 h-4"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
