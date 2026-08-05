import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Mail,
  ArrowRight,
  Globe,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

import SplashScreen from "../components/splash/SplashScreen";

import Logo from "../components/ui/Logo";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";

import {
  loginUser,
  loginWithGoogle,
} from "../services/authService";





export default function Login() {

  const navigate = useNavigate();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showLoginExit, setShowLoginExit] = useState(false);





  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };





  // ======================================================
  // EMAIL LOGIN
  // ======================================================

  const handleLogin = async () => {

    setError("");


    if (
      !form.email ||
      !form.password
    ) {

      setError(
        "Please enter email and password."
      );

      return;

    }


    try {

      setLoading(true);


      console.log(
        "========== LOGIN DEBUG =========="
      );

      console.log(
        "Email:",
        form.email.trim()
      );

      console.log(
        "Password Length:",
        form.password.length
      );


      const userCredential =
        await loginUser(

          form.email.trim(),

          form.password

        );


      console.log(
        "✅ Login Success"
      );

      console.log(
        userCredential.user
      );


      setShowLoginExit(true);

    }

    catch (err) {

      console.error(
        "❌ Firebase Login Error"
      );

      console.error(err);

      console.error(
        "Error Code:",
        err.code
      );

      console.error(
        "Error Message:",
        err.message
      );


      setError(
        err.message
      );

    }

    finally {

      setLoading(false);

    }

  };





  // ======================================================
  // GOOGLE LOGIN
  // ======================================================

  const handleGoogle = async () => {

    try {

      setError("");


      const result =
        await loginWithGoogle();


      console.log(
        "Google Login Success"
      );

      console.log(
        result.user
      );


     setShowLoginExit(true);
    }

    catch (err) {

      console.error(err);


      setError(
        err.message
      );

    }

  };


  if (showLoginExit) {
    return (
      <SplashScreen
        mode="loginExit"
        onComplete={() => {
          navigate("/dashboard");
        }}
      />
    );
  }


  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#02040d]
        text-white
      "
    >

      {/* ==================================================
          DEEP BACKGROUND GRADIENT
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,#101126_0%,#050816_38%,#02040d_72%)]
        "
      />



      {/* ==================================================
          MAGENTA AMBIENT LIGHT
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        transition={{
          duration: 1.3,
        }}

        className="
          pointer-events-none
          absolute
          -left-40
          top-[5%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-fuchsia-600/20
          blur-[150px]
        "

      />



      {/* ==================================================
          VIOLET AMBIENT LIGHT
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        transition={{
          duration: 1.5,
          delay: 0.1,
        }}

        className="
          pointer-events-none
          absolute
          left-[32%]
          top-[-260px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-violet-600/15
          blur-[170px]
        "

      />



      {/* ==================================================
          CYAN AMBIENT LIGHT
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        transition={{
          duration: 1.5,
          delay: 0.15,
        }}

        className="
          pointer-events-none
          absolute
          -right-40
          bottom-[-100px]
          h-[560px]
          w-[560px]
          rounded-full
          bg-cyan-500/15
          blur-[160px]
        "

      />



      {/* ==================================================
          SUBTLE GRID
      ================================================== */}

      <div
        className="
          nyxora-login-grid
          pointer-events-none
          absolute
          inset-0
          opacity-[0.16]
        "
      />



      {/* ==================================================
          CINEMATIC VERTICAL LIGHT STREAKS
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >

        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: [0.15, 0.5, 0.15],
          }}

          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}

          className="
            absolute
            left-[12%]
            top-[-10%]
            h-[120%]
            w-px
            bg-gradient-to-b
            from-transparent
            via-fuchsia-400/40
            to-transparent
            shadow-[0_0_18px_rgba(217,70,239,.45)]
          "

        />


        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: [0.1, 0.4, 0.1],
          }}

          transition={{
            duration: 6,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}

          className="
            absolute
            left-[18%]
            top-[15%]
            h-[65%]
            w-px
            bg-gradient-to-b
            from-transparent
            via-violet-400/30
            to-transparent
          "

        />


        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: [0.1, 0.45, 0.1],
          }}

          transition={{
            duration: 5.5,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}

          className="
            absolute
            right-[15%]
            top-[-5%]
            h-[105%]
            w-px
            bg-gradient-to-b
            from-transparent
            via-cyan-400/35
            to-transparent
            shadow-[0_0_18px_rgba(34,211,238,.35)]
          "

        />

      </div>



      {/* ==================================================
          FLOATING DECORATIVE ORBS
      ================================================== */}

      <motion.div

        animate={{
          y: [0, -12, 0],
          x: [0, 5, 0],
        }}

        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}

        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[24%]
          hidden
          h-2
          w-2
          rounded-full
          bg-fuchsia-400
          shadow-[0_0_20px_#d946ef]
          lg:block
        "

      />


      <motion.div

        animate={{
          y: [0, 15, 0],
        }}

        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}

        className="
          pointer-events-none
          absolute
          right-[10%]
          top-[34%]
          hidden
          h-1.5
          w-1.5
          rounded-full
          bg-cyan-300
          shadow-[0_0_18px_#22d3ee]
          lg:block
        "

      />



      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-10
          sm:px-6
        "
      >


        <motion.div

          initial={{
            opacity: 0,
            y: 34,
            scale: 0.98,
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}

          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}

          className="
            w-full
            max-w-[500px]
          "

        >


          {/* ==================================================
              NYXORA BRAND
          ================================================== */}

          <div
            className="
              mb-8
              flex
              justify-center
            "
          >

            <Logo />

          </div>



          {/* ==================================================
              LOGIN CARD GLOW
          ================================================== */}

          <div
            className="
              relative
              rounded-[28px]
            "
          >


            <div
              className="
                pointer-events-none
                absolute
                -inset-[1px]
                rounded-[29px]
                bg-gradient-to-br
                from-fuchsia-500/35
                via-violet-500/10
                to-cyan-400/30
                opacity-80
                blur-[1px]
              "
            />


            <div
              className="
                pointer-events-none
                absolute
                -inset-8
                -z-10
                rounded-[40px]
                bg-gradient-to-br
                from-fuchsia-600/10
                via-violet-600/10
                to-cyan-500/10
                blur-[45px]
              "
            />



            {/* ==================================================
                LOGIN GLASS PANEL
            ================================================== */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-white/[0.08]
                bg-[#0a0e1c]/90
                px-7
                py-8
                shadow-[0_30px_100px_rgba(0,0,0,.55)]
                backdrop-blur-2xl
                sm:px-10
                sm:py-10
              "
            >


              {/* TOP CARD SHIMMER */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-[10%]
                  right-[10%]
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-violet-300/70
                  to-transparent
                "
              />


              {/* CARD AMBIENT LIGHT */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-52
                  w-52
                  rounded-full
                  bg-violet-500/[0.08]
                  blur-[70px]
                "
              />



              {/* ==================================================
                  HEADING
              ================================================== */}

              <motion.div

                initial={{
                  opacity: 0,
                  y: 12,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  duration: 0.55,
                  delay: 0.15,
                }}

                className="
                  relative
                  text-center
                "

              >


                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <Sparkles
                    size={17}
                    className="
                      text-fuchsia-400
                    "
                  />

                  <span
                    className="
                      bg-gradient-to-r
                      from-fuchsia-300
                      via-violet-300
                      to-cyan-300
                      bg-clip-text
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.24em]
                      text-transparent
                    "
                  >
                    Welcome to Nyxora
                  </span>

                  <Sparkles
                    size={17}
                    className="
                      text-cyan-400
                    "
                  />

                </div>


                <h2
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                    text-white
                    sm:text-4xl
                  "
                >

                  Welcome Back

                  <span
                    className="
                      ml-2
                      inline-block
                    "
                  >
                    👋
                  </span>

                </h2>


                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-slate-400
                    sm:text-base
                  "
                >

                  Sign in to continue your intelligent workspace.

                </p>

              </motion.div>



              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (

                <motion.div

                  initial={{
                    opacity: 0,
                    y: -5,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  className="
                    mt-5
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-500/[0.08]
                    px-4
                    py-3
                    text-center
                    text-sm
                    text-red-300
                  "

                >

                  {error}

                </motion.div>

              )}



              {/* ==================================================
                  LOGIN FORM
              ================================================== */}

              <div
                className="
                  mt-8
                  space-y-5
                "
              >


                <Input

                  name="email"

                  label="Email Address"

                  icon={Mail}

                  type="email"

                  placeholder="Enter your email"

                  value={form.email}

                  onChange={handleChange}

                />


                <PasswordInput

                  name="password"

                  label="Password"

                  placeholder="Enter your password"

                  value={form.password}

                  onChange={handleChange}

                />



                {/* ==================================================
                    SIGN IN BUTTON
                ================================================== */}

                <motion.button

                  whileHover={
                    loading
                      ? {}
                      : {
                          scale: 1.015,
                          y: -1,
                        }
                  }

                  whileTap={
                    loading
                      ? {}
                      : {
                          scale: 0.985,
                        }
                  }

                  onClick={handleLogin}

                  disabled={loading}

                  className="
                    group
                    relative
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    bg-gradient-to-r
                    from-fuchsia-600
                    via-violet-600
                    via-45%
                    to-cyan-500
                    py-3.5
                    font-semibold
                    text-white
                    shadow-[0_10px_35px_rgba(124,58,237,.28)]
                    transition
                    duration-300
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "

                >


                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      -translate-x-full
                      bg-gradient-to-r
                      from-transparent
                      via-white/20
                      to-transparent
                      transition-transform
                      duration-700
                      group-hover:translate-x-full
                    "
                  />


                  <span
                    className="
                      relative
                      z-10
                    "
                  >

                    {
                      loading
                        ? "Signing In..."
                        : "Sign In"
                    }

                  </span>


                  <ArrowRight
                    size={18}
                    className="
                      relative
                      z-10
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />

                </motion.button>



                {/* ==================================================
                    DIVIDER
                ================================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    py-1
                  "
                >

                  <div
                    className="
                      h-px
                      flex-1
                      bg-gradient-to-r
                      from-transparent
                      to-white/15
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.22em]
                      text-slate-500
                    "
                  >
                    OR
                  </span>

                  <div
                    className="
                      h-px
                      flex-1
                      bg-gradient-to-l
                      from-transparent
                      to-white/15
                    "
                  />

                </div>



                {/* ==================================================
                    GOOGLE LOGIN
                ================================================== */}

                <motion.button

                  whileHover={{
                    y: -1,
                  }}

                  whileTap={{
                    scale: 0.99,
                  }}

                  onClick={handleGoogle}

                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    border
                    border-white/[0.10]
                    bg-white/[0.035]
                    py-3.5
                    text-sm
                    font-medium
                    text-slate-200
                    transition
                    duration-300
                    hover:border-violet-400/25
                    hover:bg-white/[0.065]
                    hover:shadow-[0_8px_25px_rgba(124,58,237,.10)]
                  "

                >

                  <Globe
                    size={18}
                    className="
                      text-cyan-300
                      transition-transform
                      duration-500
                      group-hover:rotate-12
                    "
                  />

                  Continue with Google

                </motion.button>


              </div>



              {/* ==================================================
                  REGISTER
              ================================================== */}

              <p
                className="
                  mt-8
                  text-center
                  text-sm
                  text-slate-400
                "
              >

                Don't have an account?

                <a
                  href="/register"
                  className="
                    ml-2
                    bg-gradient-to-r
                    from-fuchsia-400
                    via-violet-400
                    to-cyan-400
                    bg-clip-text
                    font-semibold
                    text-transparent
                    transition
                    hover:brightness-125
                  "
                >

                  Register

                </a>

              </p>



              {/* ==================================================
                  SMALL TRUST FOOTER
              ================================================== */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-5
                  gap-y-2
                  border-t
                  border-white/[0.06]
                  pt-5
                  text-[11px]
                  text-slate-500
                "
              >

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <ShieldCheck
                    size={13}
                    className="
                      text-violet-400
                    "
                  />

                  Secure access

                </span>


                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <Zap
                    size={13}
                    className="
                      text-cyan-400
                    "
                  />

                  Powered by Nyxora AI

                </span>

              </div>


            </div>

          </div>


        </motion.div>

      </div>



      {/* ==================================================
          LOCAL BACKGROUND STYLES
      ================================================== */}

      <style>{`

        .nyxora-login-grid {

          background-image:
            linear-gradient(
              rgba(139, 92, 246, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34, 211, 238, 0.05) 1px,
              transparent 1px
            );

          background-size:
            54px 54px;

          mask-image:
            radial-gradient(
              ellipse at center,
              black 15%,
              transparent 75%
            );

          -webkit-mask-image:
            radial-gradient(
              ellipse at center,
              black 15%,
              transparent 75%
            );

        }


        @media (
          prefers-reduced-motion:
          reduce
        ) {

          .nyxora-login-grid {

            animation:
              none !important;

          }

        }

      `}</style>


    </div>

  );

}