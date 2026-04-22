import { StakingPanel } from "@/components/staking/StakingPanel";
import { Info } from "lucide-react";

export const Staking = () => {
  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-text-primary">Staking</h1>
          <p className="text-text-secondary">
            Stake TFW tokens to earn rewards and governance votes
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-2xl max-w-sm">
          <Info className="w-5 h-5 text-accent shrink-0" />
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Staking APY is dynamic and based on total pool size. Current
            estimated APY:
            <span className="text-accent font-bold ml-1">12.5%</span>
          </p>
        </div>
      </header>

      <StakingPanel />
    </div>
  );
};
