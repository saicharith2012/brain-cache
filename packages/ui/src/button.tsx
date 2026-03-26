type Variant = "primary" | "secondary" | "ink" | "ghost" | "google";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant: Variant;
  size: ButtonSize;
  text: string;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
}

// primary = the recall colour. Use it once per screen, for the main action.
const variantStyles: Record<Variant, string> = {
  primary:
    "bg-recall text-recall-ink font-semibold hover:brightness-95 active:brightness-90",
  secondary:
    "bg-transparent text-ink border border-ink/25 hover:border-ink/60 hover:bg-ink/[0.04]",
  ink: "bg-ink text-matter font-semibold hover:opacity-90",
  ghost: "bg-transparent text-dim hover:text-ink hover:bg-ink/[0.06]",
  google:
    "bg-tissue text-ink border border-fold font-medium hover:border-ink/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 text-[13px] gap-1.5",
  md: "h-10 px-3.5 text-[15px] gap-2",
  lg: "h-12 px-5 text-[15px] gap-2",
};

export const Button = ({
  variant,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
  fullWidth,
  loading,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full cursor-pointer transition-[background-color,border-color,opacity,filter] duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-4 rounded-full border-2 border-current border-r-transparent animate-spin"
        />
      ) : (
        startIcon
      )}
      {text}
      {endIcon}
    </button>
  );
};
