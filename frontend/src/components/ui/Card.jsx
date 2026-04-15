import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Card = ({ children, className, glass = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "bg-card border border-border rounded-card p-6 overflow-hidden transition-all duration-500",
        glass && "backdrop-blur-xl bg-card/70",
        "hover:border-border-hover/80 hover:shadow-card-hover hover:-translate-y-1",
        "relative before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-[inherit] before:pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
