import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  endIcon?: React.ReactNode;
  toggleOnClick?: () => void;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, endIcon, toggleOnClick, ...rest }, ref) => {
    return (
      <div className="flex flex-col pb-1">
        {label && <label className="my-1 font-semibold">{label}</label>}
        <div className={`relative p-2 border rounded-lg ${error && "outline-red-500"}`}>
          <input
            ref={ref}
            className={`focus:outline-none ${endIcon ? "w-7/8" : "w-full"}`}
            {...rest}
          />
          {endIcon ? (
            <div
              className="absolute top-2 bottom-0 right-3 cursor-pointer"
              onClick={toggleOnClick}
            >
              {endIcon}
            </div>
          ) : null}
        </div>
        <span className="text-sm text-red-500 py-1">{error ? error : ""}</span>
      </div>
    );
  }
);

InputComponent.displayName = "InputComponent";
export default InputComponent;
