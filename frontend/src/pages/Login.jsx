import { motion } from "framer-motion";
import { Mail, ArrowRight, Globe } from "lucide-react";

import Logo from "../components/ui/Logo";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* Background Glow */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-600/30 blur-[140px]" />
      <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-cyan-500/30 blur-[140px]" />
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          {/* Card */}
          <Card>
            <h2 className="text-center text-4xl font-bold text-white">
              Welcome Back 👋
            </h2>

            <p className="mt-3 text-center text-slate-400">
              Sign in to continue your workspace.
            </p>

            <div className="mt-8 space-y-5">
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="Enter your email"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-cyan-500"
                  />
                  Remember me
                </label>

                <a
                  href="/forgot-password"
                  className="text-cyan-400 transition hover:text-cyan-300"
                >
                  Forgot Password?
                </a>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(34,211,238,.35)]">
                Sign In
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10"></div>

                <span className="text-xs uppercase tracking-wider text-slate-500">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10"></div>
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition duration-300 hover:border-cyan-400/30 hover:bg-white/10">
                <Globe size={18} />
                Continue with Google
              </button>
            </div>

            <p className="mt-8 text-center text-slate-400">
              Don't have an account?

              <a
                href="/register"
                className="ml-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Register
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}