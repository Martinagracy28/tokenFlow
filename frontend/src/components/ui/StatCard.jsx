import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Card } from "./Card";
import { Badge } from "./Badge";

export const StatCard = ({
  label,
  value,
  icon,
  delta,
  suffix,
  loading = false,
}) => {
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(springValue, (latest) =>
    typeof value === "number" ? latest.toFixed(2) : value,
  );

  useEffect(() => {
    if (typeof value === "number") {
      springValue.set(value);
    }
  }, [value, springValue]);

  return (
    <Card className="flex flex-col gap-1 h-full min-h-[140px] relative">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.1em]">
            {label}
          </span>
          <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-2xl text-accent w-fit md:hidden">
            {icon}
          </div>
        </div>
        <div className="hidden md:flex p-3 bg-accent/5 border border-accent/10 rounded-2xl text-accent shadow-inner">
          {icon}
        </div>
      </div>

      <div className="mt-auto flex items-end gap-1.5">
        <div className="flex flex-col">
          {loading ? (
            <div className="h-9 w-32 bg-elevated animate-pulse rounded-lg shimmer" />
          ) : (
            <div className="flex items-baseline gap-1">
              <motion.span className="text-[28px] font-bold text-text-primary drop-shadow-[0_0_8px_rgba(240,244,255,0.2)]">
                {typeof value === "number" ? (
                  <AnimatedNumber value={value} />
                ) : (
                  value
                )}
              </motion.span>
              {suffix && (
                <span className="text-[14px] font-medium text-text-secondary mb-1 tracking-tight">
                  {suffix}
                </span>
              )}
            </div>
          )}
        </div>

        {delta && !loading && (
          <Badge
            variant={delta.isPositive ? "success" : "danger"}
            className="mb-2 shadow-sm"
          >
            {delta.isPositive ? "+" : ""}
            {delta.value}%
          </Badge>
        )}
      </div>
    </Card>
  );
};

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const total = useTransform(spring, (current) => {
    const decimals = value > 100 ? 2 : 4;
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(current);
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{total}</motion.span>;
};
