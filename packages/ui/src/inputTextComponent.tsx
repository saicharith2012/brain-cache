import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSubmitted?: boolean;
  endIcon?: React.ReactNode;
  toggleOnClick?: () => void;
  toggleLabel?: string;
}

const InputTextComponent = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      endIcon,
      toggleOnClick,
      toggleLabel = "Show or hide",
      isSubmitted,
      className = "",
      id,
      ...rest
    },
    ref
  ) => {
    void isSubmitted; // accepted for API compatibility; errors show as soon as they exist
    const autoId = useId();
    const inputId = id || autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-ink">
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center h-10 bg-tissue border rounded-[8px] transition-colors focus-within:border-ink ${error ? "border-danger" : "border-fold hover:border-ink/40"}`}
        >
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            className="h-full w-full bg-transparent px-3 text-[15px] text-ink placeholder:text-dim/70 focus:outline-none disabled:opacity-60"
            {...rest}
          />
          {endIcon ? (
            <button
              type="button"
              aria-label={toggleLabel}
              className="mr-2 p-1 rounded-[8px] text-dim hover:text-ink cursor-pointer"
              onClick={toggleOnClick}
            >
              {endIcon}
            </button>
          ) : null}
        </div>
        {error ? (
          <span id={errorId} className="text-[13px] text-danger">
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);

InputTextComponent.displayName = "InputTextComponent";
export default InputTextComponent;
