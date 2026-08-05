export default function NyxoraOrbitLogo({
  size = 60,
  animated = true,
}) {

  const coreSize =
    Math.max(
      18,
      size - 24
    );


  return (

    <div

      className="
        relative
        flex
        shrink-0
        items-center
        justify-center
      "

      style={{
        width: size,
        height: size,
      }}

      role="img"

      aria-label="Nyxora AI"

    >


      {/* ==================================================
          AMBIENT NYXORA GLOW
      ================================================== */}

      <div

        aria-hidden="true"

        className={
          `pointer-events-none absolute rounded-full ${
            animated
              ? "nyxora-orbit-glow"
              : ""
          }`
        }

        style={{

          width:
            size + 22,

          height:
            size + 22,

          background: `
            radial-gradient(
              circle,
              rgba(217,70,239,.35) 0%,
              rgba(139,92,246,.27) 28%,
              rgba(59,130,246,.20) 50%,
              rgba(6,182,212,.12) 65%,
              transparent 78%
            )
          `,

          filter:
            `blur(${Math.max(
              10,
              size * 0.2
            )}px)`,

        }}

      />


      {/* ==================================================
          OUTER ROTATING GRADIENT DISC/RING
      ================================================== */}

      <div

        aria-hidden="true"

        className={
          animated
            ? "nyxora-orbit-outer"
            : ""
        }

        style={{

          position:
            "absolute",

          width:
            size,

          height:
            size,

          borderRadius:
            "9999px",

          padding:
            "1.5px",

          background: `
            conic-gradient(
              from 0deg,
              #F43AF5,
              #A855F7,
              #7C3AED,
              #4F46E5,
              #2563EB,
              #06B6D4,
              #22D3EE,
              #2563EB,
              #7C3AED,
              #F43AF5
            )
          `,

          WebkitMask: `
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0)
          `,

          WebkitMaskComposite:
            "xor",

          maskComposite:
            "exclude",

          boxShadow:
            "0 0 16px rgba(124,58,237,.22)",

        }}

      />


      {/* ==================================================
          SECOND INNER ORBIT
      ================================================== */}

      <div

        aria-hidden="true"

        className={
          animated
            ? "nyxora-orbit-inner"
            : ""
        }

        style={{

          position:
            "absolute",

          width:
            size - 11,

          height:
            size - 11,

          borderRadius:
            "9999px",

          border:
            "1px solid rgba(103,232,249,.38)",

          boxShadow: `
            inset 0 0 10px rgba(6,182,212,.08),
            0 0 8px rgba(168,85,247,.08)
          `,

        }}

      />


      {/* ==================================================
          ROTATING ORBIT DOT — MAGENTA
      ================================================== */}

      <div

        aria-hidden="true"

        className={
          animated
            ? "nyxora-orbit-dot-track-one"
            : ""
        }

        style={{

          position:
            "absolute",

          width:
            size,

          height:
            size,

        }}

      >

        <div

          style={{

            position:
              "absolute",

            width:
              Math.max(
                6,
                size * 0.12
              ),

            height:
              Math.max(
                6,
                size * 0.12
              ),

            top:
              -Math.max(
                3,
                size * 0.06
              ),

            left:
              "50%",

            transform:
              "translateX(-50%)",

            borderRadius:
              "9999px",

            background:
              "#F43AF5",

            boxShadow: `
              0 0 5px #F43AF5,
              0 0 12px rgba(244,58,245,.85),
              0 0 22px rgba(168,85,247,.45)
            `,

          }}

        />

      </div>


      {/* ==================================================
          SECOND ROTATING DOT — CYAN
      ================================================== */}

      <div

        aria-hidden="true"

        className={
          animated
            ? "nyxora-orbit-dot-track-two"
            : ""
        }

        style={{

          position:
            "absolute",

          width:
            size - 10,

          height:
            size - 10,

        }}

      >

        <div

          style={{

            position:
              "absolute",

            width:
              Math.max(
                4,
                size * 0.075
              ),

            height:
              Math.max(
                4,
                size * 0.075
              ),

            bottom:
              -Math.max(
                2,
                size * 0.035
              ),

            left:
              "50%",

            transform:
              "translateX(-50%)",

            borderRadius:
              "9999px",

            background:
              "#22D3EE",

            boxShadow: `
              0 0 5px #22D3EE,
              0 0 11px rgba(34,211,238,.75)
            `,

          }}

        />

      </div>


      {/* ==================================================
          CENTRAL DISC
      ================================================== */}

      <div

        aria-hidden="true"

        className={
          animated
            ? "nyxora-orbit-core"
            : ""
        }

        style={{

          position:
            "relative",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          width:
            coreSize,

          height:
            coreSize,

          borderRadius:
            "9999px",

          background: `
            linear-gradient(
              135deg,
              #D946EF 0%,
              #A855F7 23%,
              #7C3AED 43%,
              #4F46E5 64%,
              #2563EB 82%,
              #06B6D4 100%
            )
          `,

          boxShadow: `
            0 0 10px rgba(217,70,239,.55),
            0 0 22px rgba(124,58,237,.50),
            0 0 34px rgba(6,182,212,.18)
          `,

        }}

      >


        {/* Small center highlight */}

        <div

          style={{

            position:
              "absolute",

            inset:
              "12%",

            borderRadius:
              "9999px",

            background: `
              radial-gradient(
                circle at 30% 25%,
                rgba(255,255,255,.28),
                transparent 42%
              )
            `,

          }}

        />


        {/* Nyxora spark */}

        <span

          style={{

            position:
              "relative",

            color:
              "#FFFFFF",

            fontSize:
              Math.max(
                10,
                size * 0.23
              ),

            fontWeight:
              800,

            lineHeight:
              1,

            textShadow:
              "0 0 8px rgba(255,255,255,.5)",

          }}

        >

          ✦

        </span>


      </div>


      {/* ==================================================
          ANIMATION
      ================================================== */}

      <style>{`

        .nyxora-orbit-outer {

          animation:
            nyxora-orbit-spin
            7s
            linear
            infinite;

          will-change:
            transform;

        }


        .nyxora-orbit-inner {

          animation:
            nyxora-orbit-spin-reverse
            5s
            linear
            infinite;

          will-change:
            transform;

        }


        .nyxora-orbit-dot-track-one {

          animation:
            nyxora-orbit-spin
            3.5s
            linear
            infinite;

          will-change:
            transform;

        }


        .nyxora-orbit-dot-track-two {

          animation:
            nyxora-orbit-spin-reverse
            4.7s
            linear
            infinite;

          will-change:
            transform;

        }


        .nyxora-orbit-core {

          animation:
            nyxora-core-breathe
            3.2s
            ease-in-out
            infinite;

        }


        .nyxora-orbit-glow {

          animation:
            nyxora-orbit-glow-pulse
            3.4s
            ease-in-out
            infinite;

        }


        @keyframes nyxora-orbit-spin {

          from {

            transform:
              rotate(0deg);

          }

          to {

            transform:
              rotate(360deg);

          }

        }


        @keyframes nyxora-orbit-spin-reverse {

          from {

            transform:
              rotate(360deg);

          }

          to {

            transform:
              rotate(0deg);

          }

        }


        @keyframes nyxora-core-breathe {

          0%,
          100% {

            transform:
              scale(1);

            filter:
              brightness(1);

          }

          50% {

            transform:
              scale(1.06);

            filter:
              brightness(1.12);

          }

        }


        @keyframes nyxora-orbit-glow-pulse {

          0%,
          100% {

            opacity:
              .62;

            transform:
              scale(.94);

          }

          50% {

            opacity:
              1;

            transform:
              scale(1.08);

          }

        }


        @media (
          prefers-reduced-motion:
          reduce
        ) {

          .nyxora-orbit-outer,
          .nyxora-orbit-inner,
          .nyxora-orbit-dot-track-one,
          .nyxora-orbit-dot-track-two,
          .nyxora-orbit-core,
          .nyxora-orbit-glow {

            animation:
              none !important;

          }

        }

      `}</style>


    </div>

  );

}