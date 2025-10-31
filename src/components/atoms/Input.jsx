import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm transition-colors",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error 
          ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
          : "border-gray-300 hover:border-gray-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;