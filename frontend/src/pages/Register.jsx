import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, ArrowRight, Globe } from "lucide-react";

import Logo from "../components/ui/Logo";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";

import {
  registerUser,
  loginWithGoogle,
} from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    setError("");

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return setError("Please fill all fields.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      await registerUser(form.email, form.password);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712]">
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
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          <Card>
            <h2 className="text-center text-4xl font-bold text-white">
              Create Account 🚀
            </h2>

            <p className="mt-3 text-center text-slate-400">
              Join Nyxora AI today.
            </p>

            {error && (
              <p className="mt-4 text-center text-red-400">
                {error}
              </p>
            )}

            <div className="mt-8 space-y-5">

              <Input
                name="fullName"
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
              />

              <Input
                name="email"
                label="Email"
                icon={Mail}
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />

              <PasswordInput
                name="password"
                label="Password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
              />

              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 py-3 font-semibold text-white transition hover:scale-[1.02]"
              >
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-xs text-slate-500">OR</span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>

              <button
                onClick={handleGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-white hover:bg-white/10"
              >
                <Globe size={18} />
                Continue with Google
              </button>

            </div>

            <p className="mt-8 text-center text-slate-400">
              Already have an account?

              <a
                href="/"
                className="ml-2 font-semibold text-cyan-400"
              >
                Sign In
              </a>
            </p>

          </Card>
        </motion.div>
      </div>
    </div>
  );
}