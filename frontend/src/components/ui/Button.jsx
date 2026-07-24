export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300
      bg-gradient-to-r from-indigo-600 to-cyan-500
      hover:scale-[1.02]
      hover:shadow-lg
      ${className}`}
    >
      {children}
    </button>
  );
}