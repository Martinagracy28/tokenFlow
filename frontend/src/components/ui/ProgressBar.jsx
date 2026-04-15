import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ProgressBar = ({
  progress,
  label,
  sublabel,
  className,
  color = "bg-accent",
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {(label || sublabel) && (
        <div className="flex justify-between items-end px-0.5">
          {label && (
            <span className="text-[13px] font-medium text-text-primary">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[11px] font-medium text-text-secondary">
              {sublabel}
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full bg-elevated rounded-full overflow-hidden relative border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn("h-full rounded-full relative z-10", color)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
        {/* Glow effect */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          className={cn(
            "absolute inset-0 blur-[6px] opacity-40 rounded-full",
            color,
          )}
        />
      </div>
    </div>
  );
};
