import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputPrimary = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`input input-primary w-full ${className}`}
      />
    );
  }
);

InputPrimary.displayName = "InputPrimary";

export default InputPrimary;
