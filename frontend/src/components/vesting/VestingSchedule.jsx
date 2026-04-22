import { motion } from "framer-motion";
import { Calendar, CheckCircle2, ChevronRight, History } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useVestingInfo, useClaimVested } from "@/hooks/useVesting";
import { formatTokenAmount } from "@/lib/ethers";
import { formatDateTime } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useState } from "react";

export const VestingSchedule = () => {
  const { data: vesting, isLoading } = useVestingInfo();
  const { mutateAsync: claim } = useClaimVested();
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    const tId = toast.loading("Waiting for signature...");
    try {
      const tx = await claim();
      toast.loading("Transaction pending...", { id: tId });
      await tx.wait();
      toast.success("Successfully claimed vested tokens!", { id: tId });
    } catch (error) {
      toast.error("Claim failed. Try again.", { id: tId });
    } finally {
      setClaiming(false);
    }
  };

  // Calculate progress
  const now = Math.floor(Date.now() / 1000);
  const start = Number(vesting?.start || 0);
  const duration = Number(vesting?.duration || 0);
  const cliff = Number(vesting?.cliff || 0);
  const elapsed = Math.max(0, now - start);
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0;
  const isCliffPassed = now >= cliff;
  // Mock available to claim (logic would normally be in contract)
  const availableToClaim = isCliffPassed
    ? vesting?.total
      ? vesting.total / 4n
      : 0n
    : 0n;

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <h3 className="text-lg font-semibold text-text-primary mb-8 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Vesting Timeline
        </h3>

        <div className="relative pt-12 pb-8">
          {/* Timeline markers */}
          <div className="flex justify-between text-[11px] font-medium text-text-secondary uppercase mb-4 px-1">
            <div className="text-left">
              <span className="block text-text-muted">Start</span>
              {vesting ? formatDateTime(Number(vesting.start)) : "--"}
            </div>
            <div
              className={`text-center transition-colors ${isCliffPassed ? "text-success" : "text-warning"}`}
            >
              <span className="block text-text-muted">Cliff</span>
              {vesting ? formatDateTime(Number(vesting.cliff)) : "--"}
            </div>
            <div className="text-right">
              <span className="block text-text-muted">Full Vest</span>
              {vesting
                ? formatDateTime(
                    Number(vesting.start) + Number(vesting.duration),
                  )
                : "--"}
            </div>
          </div>

          <div className="relative">
            <ProgressBar
              progress={progress}
              className="h-4"
              color={isCliffPassed ? "bg-accent" : "bg-warning"}
            />

            {/* Cliff indicator */}
            <div
              className="absolute top-[-30px] w-px h-[40px] bg-border-active flex flex-col items-center"
              style={{ left: `${((cliff - start) / duration) * 100}%` }}
            >
              <div className="px-2 py-1 rounded bg-elevated border border-border text-[10px] whitespace-nowrap mb-1">
                Cliff Point
              </div>
            </div>

            {/* Current marker */}
            <motion.div
              className="absolute top-[-8px] w-4 h-4 rounded-full bg-white border-4 border-accent shadow-glow"
              style={{ left: `calc(${progress}% - 8px)` }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-border/50">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-text-secondary uppercase font-bold tracking-widest text-[10px]">
                Available to Claim
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-text-primary">
                  {formatTokenAmount(availableToClaim)}
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  TFW
                </span>
              </div>
            </div>
            {!isCliffPassed && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-warning text-xs">
                Vesting is currently before the cliff. Tokens will start
                unlocking after the cliff date.
              </div>
            )}
            <Button
              className="w-full"
              disabled={!isCliffPassed || availableToClaim === 0n}
              loading={claiming}
              onClick={handleClaim}
            >
              Claim Vested Tokens
            </Button>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-text-secondary" />
              Claim History
            </h4>
            <div className="space-y-4">
              {vesting?.released && vesting.released > 0n ? (
                <div className="flex items-center justify-between group">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Tokens Released
                      </p>
                      <p className="text-[11px] text-text-secondary">
                        Automatic release to wallet
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
                </div>
              ) : (
                <div className="text-center py-4 text-text-muted text-xs">
                  No claims yet
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
