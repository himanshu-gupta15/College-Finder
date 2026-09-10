import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            icon ? "pl-10" : ""
          } ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
              : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
          } ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
