import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

export const Button = ({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-br from-accent via-accent to-accent-hover text-white shadow-[0_4px_12px_rgba(108,99,255,0.3)] hover:shadow-[0_8px_24px_rgba(108,99,255,0.4)]",
    secondary:
      "bg-elevated border border-border text-text-primary hover:border-border-hover hover:bg-border/50 shadow-sm",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-accent/5",
    danger:
      "bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 hover:border-danger/40",
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center rounded-button font-medium transition-all duration-200 min-h-[44px] px-6 gap-2",
        variants[variant],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      <span className={cn(loading && "opacity-0")}>{children}</span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      )}
    </motion.button>
  );
};
