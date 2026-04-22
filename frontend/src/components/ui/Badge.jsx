import { cn } from "@/lib/utils";

export const Badge = ({ children, variant = "info", className }) => {
  const variants = {
    success: "bg-success/10 text-success border-success/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    danger: "bg-danger/10 text-danger border-danger/30",
    info: "bg-accent/10 text-accent border-accent/30",
    neutral: "bg-elevated text-text-secondary border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
