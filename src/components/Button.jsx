import { Link } from "react-router-dom";

const variants = {
  solid: "bg-fg text-bg border-fg hover:bg-accent hover:border-accent hover:text-ink",
  outline: "bg-transparent text-fg border-fg hover:bg-fg hover:text-bg",
  danger: "bg-danger text-white border-danger hover:bg-fg hover:border-fg hover:text-bg",
};
const sizes = { md: "px-5 py-3 text-sm", sm: "px-3.5 py-2 text-[13px]" };

// With `to` it renders a router Link, otherwise a <button>.
function Button({ children, to, type = "button", variant = "solid", size = "md", className = "", ...props }) {
  const cls = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[1.5px] font-semibold transition duration-200 hover:-translate-y-0.5 ${variants[variant]} ${sizes[size]} ${className}`;
  return to ? (
    <Link to={to} className={cls} {...props}>{children}</Link>
  ) : (
    <button type={type} className={cls} {...props}>{children}</button>
  );
}

export default Button;