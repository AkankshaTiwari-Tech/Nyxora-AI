import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      icon: Icon,
      label,
      type = "text",
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}

        <div className="group relative">
          {Icon && (
            <Icon
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
                transition-colors
                duration-300
                group-focus-within:text-cyan-400
              "
            />
          )}

          <input
            ref={ref}
            type={type}
            className={`
              w-full
              rounded-xl
              border
              ${
                error
                  ? "border-red-500"
                  : "border-white/10"
              }
              bg-[#111827]/70
              py-3
              ${Icon ? "pl-12" : "pl-4"}
              pr-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              duration-300
              focus:border-cyan-400
              focus:ring-2
              focus:ring-cyan-500/20
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;