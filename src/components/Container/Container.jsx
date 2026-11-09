function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-[clamp(18px,3vw,32px)] ${className}`}>
      {children}
    </div>
  );
}

export default Container;