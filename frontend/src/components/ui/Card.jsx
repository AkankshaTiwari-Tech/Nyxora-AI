export default function Card({ children }) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-10
      backdrop-blur-2xl
      shadow-[0_20px_80px_rgba(0,0,0,.45)]
      "
    >
      {children}
    </div>
  );
}