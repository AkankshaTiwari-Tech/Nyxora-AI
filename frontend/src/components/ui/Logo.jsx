import { motion } from "framer-motion";

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-4"
    >
      {/* Logo */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-500 to-cyan-500 shadow-[0_0_40px_rgba(99,102,241,.45)]">

        <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-md"></div>

        <span className="relative text-3xl font-black text-white">
          N
        </span>

      </div>

      {/* Text */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Nyxora AI
        </h1>

        <p className="text-sm text-slate-400">
          AI Powered Student Workspace
        </p>
      </div>
    </motion.div>
  );
}