import { cn } from "@/lib/utils";

export const Input = ({ label, suffix, error, className, id, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-[12px] font-medium text-text-secondary ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center group">
        <input
          id={id}
          className={cn(
            "input-field pr-12 bg-surface/80 border-border group-hover:border-border-hover",
            "focus:bg-surface focus:border-accent focus:ring-[4px] focus:ring-accent/10 focus:shadow-[0_0_12px_rgba(108,99,255,0.1)]",
            "placeholder:text-text-muted/60 transition-all duration-300",
            error && "border-danger focus:border-danger focus:ring-danger/10",
            className,
          )}
          {...props}
        />

        {suffix && (
          <div className="absolute right-4 flex items-center pointer-events-none transition-transform group-focus-within:translate-x-0.5">
            {suffix}
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-danger ml-1">{error}</p>}
    </div>
  );
};
