import { VestingPanel } from "@/components/vesting/VestingPanel";
import { Badge } from "@/components/ui/Badge";
import { Info } from "lucide-react";

export const Vesting = () => {
  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-text-primary">Vesting</h1>
            <Badge variant="success">Active Schedule</Badge>
          </div>
          <p className="text-text-secondary">
            Manage and claim your TFW token rewards distribution
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 p-4 bg-accent/5 border border-accent/20 rounded-2xl max-w-sm">
          <Info className="w-5 h-5 text-accent shrink-0" />
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Your tokens are distributed according to a linear vesting schedule.
            Next claim:
            <span className="text-accent font-bold ml-1">Daily</span>
          </p>
        </div>
      </header>

      <VestingPanel />
    </div>
  );
};
