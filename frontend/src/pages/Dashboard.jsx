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
              {[
                {
                  type: "Stake",
                  amount: "+2,500 TFW",
                  status: "Completed",
                  time: "2h ago",
                  icon: ArrowUpRight,
                  color: "text-success",
                },
                {
                  type: "Withdraw",
                  amount: "-1,200 TFW",
                  status: "Completed",
                  time: "5h ago",
                  icon: ArrowDownRight,
                  color: "text-danger",
                },
                {
                  type: "Claim",
                  amount: "+145.20 TFW",
                  status: "Completed",
                  time: "1d ago",
                  icon: Gift,
                  color: "text-warning",
                },
                {
                  type: "Vesting",
                  amount: "+10,000 TFW",
                  status: "Pending",
                  time: "3d ago",
                  icon: Lock,
                  color: "text-accent",
                },
                {
                  type: "Stake",
                  amount: "+5,000 TFW",
                  status: "Completed",
                  time: "1w ago",
                  icon: ArrowUpRight,
                  color: "text-success",
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-elevated/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-2 rounded-xl bg-background border border-border",
                        tx.color,
                      )}
                    >
                      <tx.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {tx.type}
                      </p>
                      <p className="text-xs text-text-secondary">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", tx.color)}>
                      {tx.amount}
                    </p>
                    <Badge
                      variant={
                        tx.status === "Completed" ? "success" : "warning"
                      }
                      className="mt-1"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
