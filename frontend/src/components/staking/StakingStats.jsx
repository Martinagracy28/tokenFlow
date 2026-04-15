import { Zap, TrendingUp, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useStakeInfo, useRewardRate } from "@/hooks/useStaking";
import { formatTokenAmount, formatUnits } from "@/lib/ethers";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const StakingStats = () => {
  const { data: stakeInfo, isLoading: loadingStake } = useStakeInfo();
  const { data: rewardRate, isLoading: loadingRate } = useRewardRate();
  const [timeRemaining, setTimeRemaining] = useState(0n);

  useEffect(() => {
    if (!stakeInfo?.lockEnd) return;
    const interval = setInterval(() => {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const diff = stakeInfo.lockEnd - now;
      setTimeRemaining(diff > 0n ? diff : 0n);
    }, 1000);
    return () => clearInterval(interval);
  }, [stakeInfo?.lockEnd]);

  const isLocked = timeRemaining > 0n;
  const totalStaked = stakeInfo?.amount || 0n;
  const apy = 12.5; // Base mock for UI logic

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h3 className="text-text-secondary text-sm font-medium uppercase tracking-wider">
              Current Staked Balance
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-text-primary">
                {loadingStake ? "..." : formatTokenAmount(totalStaked)}
              </span>
              <span className="text-xl font-medium text-text-secondary">
                TFW
              </span>
            </div>
            <p className="text-success text-sm font-medium flex items-center gap-1.5 mt-1">
              <Zap className="w-3.5 h-3.5" />
              Earning ~
              {((Number(formatUnits(totalStaked || 0n)) * apy) / 36500).toFixed(
                4,
              )}{" "}
              TFW/day
            </p>
          </div>
          <Badge
            variant={
              totalStaked === 0n ? "neutral" : isLocked ? "success" : "warning"
            }
          >
            {totalStaked === 0n
              ? "Not Staked"
              : isLocked
                ? "Active"
                : "Unlocked"}
          </Badge>
        </div>

        {totalStaked > 0n && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-end">
              <span className="text-sm text-text-secondary">Lock Expiry</span>
              <span className="text-sm font-medium text-text-primary">
                {isLocked
                  ? `${Math.floor(Number(timeRemaining) / 86400)} days remaining`
                  : "Unlockable"}
              </span>
            </div>
            <ProgressBar
              progress={isLocked ? 65 : 100} // Mock progress calculation
              color={isLocked ? "bg-accent" : "bg-success"}
            />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <Badge variant="info">Estimated</Badge>
          </div>
          <p className="text-text-secondary text-xs uppercase font-medium">
            Yield Rate (APY)
          </p>
          <p className="text-2xl font-bold text-text-primary mt-1">{apy}%</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Base Rate</span>
              <span className="text-text-primary">8.00%</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Lock Boost</span>
              <span className="text-text-primary">+4.50%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <BarChart3 className="w-5 h-5 text-success" />
            <span className="text-[11px] text-text-secondary">Last 7 Days</span>
          </div>
          <p className="text-text-secondary text-xs uppercase font-medium">
            Reward Growth
          </p>
          <div className="flex items-end gap-1 mt-3 h-12">
            {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-success/20 rounded-t-sm border-t border-x border-success/30"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
