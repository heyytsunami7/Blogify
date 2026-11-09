import React, { useId } from "react";
import { fieldClass, labelClass } from "./Input";

function Select({ options, label, className = "", ...props }, ref) {
  const id = useId();
  return (
    <div className="w-full">
      {label && <label className={labelClass} htmlFor={id}>{label}</label>}
      <select {...props} id={id} ref={ref} className={`${fieldClass} ${className}`}>
        {options?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);