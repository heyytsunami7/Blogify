import React, { useId } from "react";

export const fieldClass =
  "w-full rounded-[10px] border-[1.5px] border-fg bg-card px-3.5 py-2.5 text-base text-fg outline-none transition duration-200 placeholder:text-mute/70 focus:border-accent focus:ring-4 focus:ring-accent/25";
export const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-mute";

const Input = React.forwardRef(function Input({ label, type = "text", className = "", ...props }, ref) {
  const id = useId();
  return (
    <div className="w-full">
      {label && <label className={labelClass} htmlFor={id}>{label}</label>}
      <input type={type} className={`${fieldClass} ${className}`} ref={ref} {...props} id={id} />
    </div>
  );
});

export default Input;