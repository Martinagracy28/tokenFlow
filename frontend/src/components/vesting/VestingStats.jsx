import { Lock, Unlock, Clock, Coins } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { useVestingInfo } from "@/hooks/useVesting";
import { formatTokenAmount } from "@/lib/ethers";

export const VestingStats = () => {
  const { data: vesting, isLoading } = useVestingInfo();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Allocated"
        value={vesting ? formatTokenAmount(vesting.total) : "0.0000"}
        icon={<Coins className="w-5 h-5" />}
        suffix="TFW"
        loading={isLoading}
      />

      <StatCard
        label="Already Released"
        value={vesting ? formatTokenAmount(vesting.released) : "0.0000"}
        icon={<Unlock className="w-5 h-5 text-success" />}
        suffix="TFW"
        loading={isLoading}
      />

      <StatCard
        label="Remaining Locked"
        value={
          vesting
            ? formatTokenAmount(vesting.total - vesting.released)
            : "0.0000"
        }
        icon={<Lock className="w-5 h-5 text-danger" />}
        suffix="TFW"
        loading={isLoading}
      />

      <StatCard
        label="Next Unlock"
        value="-- : -- : --"
        icon={<Clock className="w-5 h-5 text-warning" />}
        loading={isLoading}
      />
    </div>
  );
};
