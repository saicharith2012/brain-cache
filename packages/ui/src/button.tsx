type Variant = "primary" | "secondary" | "google";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

const variantStyles: Record<Variant, string> = {
  primary: "bg-gray-700 text-white hover:bg-gray-800 focus:bg-black",
  secondary: "bg-gray-200 text-black hover:bg-gray-300 focus:bg-gray-400",
  google: "bg-[#131314] text-white border border-gray-400"
};

const defaultStyles =
  "rounded-md flex items-center cursor-pointer transition-all duration-150 justify-center";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-1 px-2",
  md: "py-2 px-3",
  lg: "py-4 px-6",
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${defaultStyles} ${variantStyles[props.variant]} ${sizeStyles[props.size]} ${props.className} ${props.fullWidth ? "w-full justify-center" : ""} ${props.loading ? "opacity-40" : "opacity-100"}`}
      onClick={props.onClick}
      disabled={props.loading}
    >
      {props.startIcon ? <div className="pr-2.5">{props.startIcon}</div> : null}

      {props.text}
      {props.endIcon ? <div className="pl-2.5">{props.endIcon}</div> : null}
    </button>
  );
};
