export default function NyxoraLogo({
  size = 60,
  animated = true,
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Glow */}
      <div
        className={`absolute rounded-full ${
          animated ? "animate-pulse" : ""
        }`}
        style={{
          width: size + 18,
          height: size + 18,
          background:
            "radial-gradient(circle, rgba(124,58,237,.45) 0%, rgba(99,102,241,.25) 40%, transparent 75%)",
          filter: "blur(18px)",
        }}
      />

      {/* Outer Ring */}
      <div
        className="absolute rounded-full border border-indigo-400/40"
        style={{
          width: size,
          height: size,
          animation: animated
            ? "nyxora-spin 7s linear infinite"
            : "none",
        }}
      />

      {/* Orbit Dot */}
      <div
        className="absolute"
        style={{
          width: size,
          height: size,
          animation: animated
            ? "nyxora-spin 3.5s linear infinite reverse"
            : "none",
        }}
      >
        <div
          className="absolute rounded-full bg-purple-300"
          style={{
            width: 8,
            height: 8,
            top: -4,
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 0 12px #A855F7",
          }}
        />
      </div>

      {/* Inner Ring */}
      <div
        className="absolute rounded-full border border-violet-400/50"
        style={{
          width: size - 12,
          height: size - 12,
          animation: animated
            ? "nyxora-spin-reverse 5s linear infinite"
            : "none",
        }}
      />

      {/* Core */}
      <div
        className="rounded-full"
        style={{
          width: size - 24,
          height: size - 24,
          background:
            "linear-gradient(135deg,#4F46E5,#7C3AED,#A855F7)",
          boxShadow:
            "0 0 28px rgba(124,58,237,.9)",
        }}
      />

      <style>{`
        @keyframes nyxora-spin{
          from{
            transform:rotate(0deg);
          }
          to{
            transform:rotate(360deg);
          }
        }

        @keyframes nyxora-spin-reverse{
          from{
            transform:rotate(360deg);
          }
          to{
            transform:rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}