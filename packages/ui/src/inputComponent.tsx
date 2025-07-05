import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} className="" {...rest} />
        {error && <span>{error}</span>}
      </div>
    );
  }
);

InputComponent.displayName = "InputComponent";
export default InputComponent;
