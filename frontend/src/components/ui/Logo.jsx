import { motion } from "framer-motion";

import NyxoraLogo
  from "../common/NyxoraLogo";


export default function Logo() {

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: -20,
        scale: 0.96,
      }}

      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}

      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}

      className="
        flex
        items-center
        gap-4
      "

    >


      {/* ==================================================
          PRODUCTION NYXORA N MARK

          Uses the main Nyxora brand component.

          ✓ Folded N
          ✓ Magenta
          ✓ Violet
          ✓ Indigo
          ✓ Blue
          ✓ Cyan
          ✓ Internal pattern
          ✓ Controlled glow
      ================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.72,
          rotateY: -20,
        }}

        animate={{
          opacity: 1,
          scale: 1,
          rotateY: 0,
        }}

        transition={{
          duration: 0.8,
          delay: 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}

        className="
          relative
          flex
          h-16
          w-16
          shrink-0
          items-center
          justify-center
        "

      >

        <NyxoraLogo
          size={64}
          animated={true}
        />

      </motion.div>


      {/* ==================================================
          BRAND TEXT
      ================================================== */}

      <div>


        <motion.h1

          initial={{
            opacity: 0,
            x: -8,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.55,
            delay: 0.18,
          }}

          className="
            text-3xl
            font-bold
            tracking-tight
            text-white
          "

        >

          Nyxora{" "}

          <span
            className="
              bg-gradient-to-r
              from-fuchsia-400
              via-violet-400
              to-cyan-400
              bg-clip-text
              text-transparent
            "
          >
            AI
          </span>

        </motion.h1>


        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            duration: 0.55,
            delay: 0.3,
          }}

          className="
            mt-0.5
            text-sm
            text-slate-400
          "

        >

          AI Powered Student Workspace

        </motion.p>


      </div>


    </motion.div>

  );

}