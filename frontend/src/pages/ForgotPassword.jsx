import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset email sent successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-5">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0e1c] p-8 shadow-[0_20px_80px_rgba(0,0,0,.45)]">
        <h1 className="text-3xl font-bold text-white text-center">
          Forgot Password
        </h1>

        <p className="mt-3 text-center text-sm text-slate-400">
          Enter your registered email to receive a password reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-8 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-400"
        />

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        {message && (
          <p className="mt-3 text-sm text-green-400">{message}</p>
        )}

        <button
          onClick={handleReset}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full text-sm text-slate-400 hover:text-white"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}