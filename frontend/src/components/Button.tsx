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
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-gray-700 text-white",
  secondary: "bg-gray-200 text-black",
};

const defaultStyles = "rounded-md flex items-center cursor-pointer";

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
      }`}
      onClick={props.onClick}
    >
      {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}{" "}
      {props.text} {props.endIcon}
    </button>
  );
};
