import { ReactElement } from "react";

type Variant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant: Variant;
  size: ButtonSize;
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-gray-700 text-white hover:bg-gray-800 focus:bg-black",
  secondary: "bg-gray-200 text-black hover:bg-gray-300 focus:bg-gray-400",
};

const defaultStyles =
  "rounded-md flex items-center cursor-pointer transition-all duration-150";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "py-1 px-2",
  md: "py-2 px-4",
  lg: "py-4 px-6",
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${variantStyles[props.variant]} ${defaultStyles} ${
        sizeStyles[props.size]
      } ${props.fullWidth ? "w-full justify-center" : ""} ${
        props.loading ? "opacity-40" : "opacity-100"
      }`}
      onClick={props.onClick}
      disabled={props.loading}
    >
      {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}{" "}
      {props.text} {props.endIcon}
    </button>
  );
};
