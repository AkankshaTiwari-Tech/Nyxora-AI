import {
  useEffect,
  useRef,
} from "react";

import NyxoraLogo from "../common/NyxoraLogo";




// ======================================================
// NYXORA — OPTIMIZED CINEMATIC SPLASH
// ======================================================

export default function SplashScreen({
  mode = "intro",
  onComplete,
}) {
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const glowRef = useRef(null);
  const flashRef = useRef(null);
  const brandRef = useRef(null);
  const frameRef = useRef(null);
  const completedRef = useRef(false);

  const isExit =
    mode === "loginExit";


  // ====================================================
  // COMPLETE
  // ====================================================

  useEffect(() => {
    const root =
      rootRef.current;

    const logo =
      logoRef.current;

    const glow =
      glowRef.current;

    const flash =
      flashRef.current;

    const brand =
      brandRef.current;

    if (
      !root ||
      !logo ||
      !glow ||
      !flash ||
      !brand
    ) {
      return undefined;
    }


    completedRef.current = false;


    // ==================================================
    // HELPERS
    // ==================================================

    const clamp = (
      value,
      min = 0,
      max = 1
    ) =>
      Math.max(
        min,
        Math.min(max, value)
      );


    const range = (
      time,
      start,
      end
    ) =>
      clamp(
        (time - start) /
        (end - start)
      );


    const lerp = (
      start,
      end,
      amount
    ) =>
      start +
      (
        end -
        start
      ) *
      amount;


    const easeOutCubic = (t) =>
      1 -
      Math.pow(
        1 - t,
        3
      );


    const easeInCubic = (t) =>
      t * t * t;


    const easeInOutCubic = (t) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 -
          Math.pow(
            -2 * t + 2,
            3
          ) / 2;


    const easeOutExpo = (t) =>
      t === 1
        ? 1
        : 1 -
          Math.pow(
            2,
            -10 * t
          );


    function finish() {
      if (
        completedRef.current
      ) {
        return;
      }

      completedRef.current = true;

      onComplete?.();
    }


    // ==================================================
    // PERFORMANCE
    // ==================================================

    /*
      IMPORTANT:

      We only animate:

      transform
      opacity

      Both are normally compositor-friendly.

      No continuously changing:
      - blur
      - drop-shadow
      - backdrop-filter
      - mix-blend-mode
      - SVG filters
    */

    logo.style.willChange =
      "transform, opacity";

    glow.style.willChange =
      "transform, opacity";

    flash.style.willChange =
      "opacity";

    brand.style.willChange =
      "transform, opacity";


    // ==================================================
    // INTRO
    // ==================================================

    const INTRO_DURATION = 5200;


    function drawIntro(time) {

      // =================================================
      // 0 — 350
      // BLACK
      // =================================================

      if (time < 350) {
        logo.style.opacity = "0";
        glow.style.opacity = "0";
        flash.style.opacity = "0";
        brand.style.opacity = "0";

        return;
      }


      // =================================================
      // 350 — 1250
      //
      // Start extremely close.
      // Camera pulls backward.
      // =================================================

      const pullOne =
        easeOutCubic(
          range(
            time,
            350,
            1250
          )
        );


      if (
        time >= 350 &&
        time < 1250
      ) {
        const scale =
          lerp(
            5.2,
            2.8,
            pullOne
          );

        const x =
          lerp(
            -80,
            55,
            pullOne
          );

        const y =
          lerp(
            45,
            -15,
            pullOne
          );

        const rotation =
          lerp(
            -11,
            -5,
            pullOne
          );


        logo.style.opacity =
          String(
            lerp(
              0.45,
              1,
              pullOne
            )
          );


        logo.style.transform =
          `
            translate3d(
              ${x}px,
              ${y}px,
              0
            )
            scale(${scale})
            rotate(${rotation}deg)
          `;


        glow.style.opacity =
          String(
            lerp(
              0.08,
              0.25,
              pullOne
            )
          );


        glow.style.transform =
          `
            translate3d(
              -50%,
              -50%,
              0
            )
            scale(
              ${lerp(
                1.3,
                1,
                pullOne
              )}
            )
          `;


        flash.style.opacity = "0";
        brand.style.opacity = "0";

        return;
      }


      // =================================================
      // 1250 — 2050
      //
      // Continue camera movement.
      // Logo begins becoming recognizable.
      // =================================================

      const pullTwo =
        easeInOutCubic(
          range(
            time,
            1250,
            2050
          )
        );


      if (
        time >= 1250 &&
        time < 2050
      ) {
        const scale =
          lerp(
            2.8,
            1.45,
            pullTwo
          );

        const x =
          lerp(
            55,
            -18,
            pullTwo
          );

        const y =
          lerp(
            -15,
            5,
            pullTwo
          );

        const rotation =
          lerp(
            -5,
            -1.5,
            pullTwo
          );


        logo.style.opacity = "1";


        logo.style.transform =
          `
            translate3d(
              ${x}px,
              ${y}px,
              0
            )
            scale(${scale})
            rotate(${rotation}deg)
          `;


        glow.style.opacity =
          String(
            lerp(
              0.25,
              0.34,
              pullTwo
            )
          );


        glow.style.transform =
          `
            translate3d(
              -50%,
              -50%,
              0
            )
            scale(
              ${lerp(
                1,
                0.85,
                pullTwo
              )}
            )
          `;


        // ===============================================
        // QUICK PURPLE CAMERA CROSS
        // ===============================================

        const firstFlash =
          range(
            time,
            1450,
            1570
          );


        flash.style.opacity =
          String(
            Math.sin(
              firstFlash *
              Math.PI
            ) *
            0.65
          );


        brand.style.opacity = "0";

        return;
      }


      // =================================================
      // 2050 — 2800
      //
      // Final pullback.
      // Logo reaches correct position.
      // =================================================

      const reveal =
        easeOutExpo(
          range(
            time,
            2050,
            2800
          )
        );


      if (
        time >= 2050 &&
        time < 2800
      ) {
        const scale =
          lerp(
            1.45,
            1,
            reveal
          );

        const x =
          lerp(
            -18,
            0,
            reveal
          );

        const y =
          lerp(
            5,
            0,
            reveal
          );

        const rotation =
          lerp(
            -1.5,
            0,
            reveal
          );


        logo.style.opacity = "1";


        logo.style.transform =
          `
            translate3d(
              ${x}px,
              ${y}px,
              0
            )
            scale(${scale})
            rotate(${rotation}deg)
          `;


        glow.style.opacity =
          String(
            lerp(
              0.34,
              0.26,
              reveal
            )
          );


        glow.style.transform =
          `
            translate3d(
              -50%,
              -50%,
              0
            )
            scale(
              ${lerp(
                0.85,
                0.72,
                reveal
              )}
            )
          `;


        // ===============================================
        // IMPACT FLASH
        // ===============================================

        const impact =
          range(
            time,
            2090,
            2220
          );


        flash.style.opacity =
          String(
            Math.sin(
              impact *
              Math.PI
            ) *
            0.92
          );


        brand.style.opacity = "0";

        return;
      }


      // =================================================
      // 2800 — 3450
      //
      // PERFECT STILL LOGO.
      // Important cinematic pause.
      // =================================================

      if (
        time >= 2800 &&
        time < 3450
      ) {
        logo.style.opacity = "1";

        logo.style.transform =
          `
            translate3d(
              0,
              0,
              0
            )
            scale(1)
            rotate(0deg)
          `;


        glow.style.opacity = "0.24";

        glow.style.transform =
          `
            translate3d(
              -50%,
              -50%,
              0
            )
            scale(.72)
          `;


        flash.style.opacity = "0";

        brand.style.opacity = "0";

        return;
      }


      // =================================================
      // 3450 — 4300
      //
      // BRAND APPEARS.
      // =================================================

      if (
        time >= 3450 &&
        time < 4300
      ) {
        logo.style.opacity = "1";

        logo.style.transform =
          `
            translate3d(
              0,
              0,
              0
            )
            scale(1)
          `;


        glow.style.opacity = "0.24";


        const brandProgress =
          easeOutCubic(
            range(
              time,
              3450,
              3850
            )
          );


        brand.style.opacity =
          String(
            brandProgress
          );


        brand.style.transform =
          `
            translate3d(
              -50%,
              ${lerp(
                10,
                0,
                brandProgress
              )}px,
              0
            )
          `;


        flash.style.opacity = "0";

        return;
      }


      // =================================================
      // 4300 — 4550
      //
      // CHARGE
      // =================================================

      if (
        time >= 4300 &&
        time < 4550
      ) {
        const charge =
          easeOutCubic(
            range(
              time,
              4300,
              4550
            )
          );


        logo.style.opacity = "1";


        logo.style.transform =
          `
            translate3d(
              0,
              0,
              0
            )
            scale(
              ${lerp(
                1,
                1.08,
                charge
              )}
            )
          `;


        glow.style.opacity =
          String(
            lerp(
              0.24,
              0.48,
              charge
            )
          );


        glow.style.transform =
          `
            translate3d(
              -50%,
              -50%,
              0
            )
            scale(
              ${lerp(
                0.72,
                0.92,
                charge
              )}
            )
          `;


        brand.style.opacity =
          String(
            1 -
            charge
          );


        flash.style.opacity = "0";

        return;
      }


      // =================================================
      // 4550 — END
      //
      // FINAL ZOOM
      // =================================================

      const zoom =
        easeInCubic(
          range(
            time,
            4550,
            5150
          )
        );


      const scale =
        lerp(
          1.08,
          5.2,
          zoom
        );


      logo.style.transform =
        `
          translate3d(
            0,
            0,
            0
          )
          scale(${scale})
        `;


      logo.style.opacity =
        String(
          1 -
          range(
            time,
            4780,
            5150
          )
        );


      glow.style.opacity =
        String(
          lerp(
            0.48,
            0.08,
            zoom
          )
        );


      glow.style.transform =
        `
          translate3d(
            -50%,
            -50%,
            0
          )
          scale(
            ${lerp(
              0.92,
              2.2,
              zoom
            )}
          )
        `;


      brand.style.opacity = "0";


      // tiny final flash

      const endFlash =
        range(
          time,
          4880,
          5000
        );


      flash.style.opacity =
        String(
          Math.sin(
            endFlash *
            Math.PI
          ) *
          0.45
        );

    }


    // ==================================================
    // LOGIN → DASHBOARD
    // ==================================================

    const EXIT_DURATION = 1700;


    function drawExit(time) {

      // ===============================================
      // HOLD
      // ===============================================

      if (time < 250) {
        logo.style.opacity = "1";

        logo.style.transform =
          `
            translate3d(
              0,
              0,
              0
            )
            scale(1)
          `;

        glow.style.opacity = "0.24";

        brand.style.opacity = "0";

        flash.style.opacity = "0";

        return;
      }


      // ===============================================
      // CHARGE
      // ===============================================

      if (
        time >= 250 &&
        time < 600
      ) {
        const charge =
          easeOutCubic(
            range(
              time,
              250,
              600
            )
          );


        logo.style.opacity = "1";


        logo.style.transform =
          `
            translate3d(
              0,
              0,
              0
            )
            scale(
              ${lerp(
                1,
                1.1,
                charge
              )}
            )
          `;


        glow.style.opacity =
          String(
            lerp(
              0.24,
              0.52,
              charge
            )
          );


        glow.style.transform =
          `
            translate3d(
              -50%,
              -50%,
              0
            )
            scale(
              ${lerp(
                0.72,
                1,
                charge
              )}
            )
          `;


        return;
      }


      // ===============================================
      // CAMERA DIVES INTO LOGO
      // ===============================================

      const dive =
        easeInCubic(
          range(
            time,
            600,
            1600
          )
        );


      const scale =
        lerp(
          1.1,
          5.4,
          dive
        );


      const x =
        lerp(
          0,
          -55,
          dive
        );


      const rotation =
        lerp(
          0,
          -5,
          dive
        );


      logo.style.transform =
        `
          translate3d(
            ${x}px,
            0,
            0
          )
          scale(${scale})
          rotate(${rotation}deg)
        `;


      logo.style.opacity =
        String(
          1 -
          range(
            time,
            1250,
            1600
          )
        );


      glow.style.opacity =
        String(
          lerp(
            0.52,
            0.05,
            dive
          )
        );


      glow.style.transform =
        `
          translate3d(
            -50%,
            -50%,
            0
          )
          scale(
            ${lerp(
              1,
              2.2,
              dive
            )}
          )
        `;


      const exitFlash =
        range(
          time,
          1100,
          1230
        );


      flash.style.opacity =
        String(
          Math.sin(
            exitFlash *
            Math.PI
          ) *
          0.7
        );

    }


    // ==================================================
    // LOOP
    // ==================================================

    let start = null;


    function animate(timestamp) {

      if (start === null) {
        start = timestamp;
      }


      const elapsed =
        timestamp -
        start;


      if (isExit) {
        drawExit(elapsed);
      } else {
        drawIntro(elapsed);
      }


      const duration =
        isExit
          ? EXIT_DURATION
          : INTRO_DURATION;


      if (
        elapsed < duration
      ) {
        frameRef.current =
          requestAnimationFrame(
            animate
          );
      } else {
        finish();
      }

    }


    frameRef.current =
      requestAnimationFrame(
        animate
      );


    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };

  }, [isExit, onComplete]);


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      ref={rootRef}
      className="nyxora-splash"
    >

      {/* ===============================================
          BACKGROUND
      ================================================ */}

      <div className="nyxora-background" />


      {/* ===============================================
          STATIC GLOW

          We only animate opacity + scale.
      ================================================ */}

      <div
        ref={glowRef}
        className="nyxora-glow"
      />


      {/* ===============================================
          ONLY ONE LOGO
      ================================================ */}

      <div
        ref={logoRef}
        className="nyxora-logo-stage"
      >
        <NyxoraLogo
          size={190}
          animated={false}
        />
      </div>


      {/* ===============================================
          FLASH
      ================================================ */}

      <div
        ref={flashRef}
        className="nyxora-flash"
      />


      {/* ===============================================
          BRAND
      ================================================ */}

      <div
        ref={brandRef}
        className="nyxora-brand"
      >
        <div className="nyxora-name">
          NYXORA
        </div>

        <div className="nyxora-tagline">
          INTELLIGENCE, EVOLVED
        </div>
      </div>


      {/* ===============================================
          VIGNETTE
      ================================================ */}

      <div className="nyxora-vignette" />


      <style>{`

        /* =================================================
           ROOT
        ================================================= */

        .nyxora-splash {
          position: fixed;
          inset: 0;

          z-index: 99999;

          overflow: hidden;

          background: #000106;

          contain: strict;

          isolation: isolate;
        }


        /* =================================================
           BACKGROUND

           Completely static = cheap to render.
        ================================================= */

        .nyxora-background {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              ellipse at center,
              #09091b 0%,
              #04040d 28%,
              #010207 58%,
              #000 100%
            );
        }


        /* =================================================
           GLOW

           Static gradient.

           NO animated blur.
        ================================================= */

        .nyxora-glow {
          position: absolute;

          z-index: 1;

          left: 50%;
          top: 50%;

          width: min(
            520px,
            70vw
          );

          aspect-ratio: 1;

          border-radius: 50%;

          opacity: 0;

          transform:
            translate3d(
              -50%,
              -50%,
              0
            )
            scale(.7);

          background:
            radial-gradient(
              circle,

              rgba(
                168,
                85,
                247,
                .24
              )
              0%,

              rgba(
                99,
                102,
                241,
                .11
              )
              25%,

              rgba(
                34,
                211,
                238,
                .045
              )
              44%,

              transparent
              70%
            );

          pointer-events: none;
        }


        /* =================================================
           LOGO

           ONE render only.
        ================================================= */

        .nyxora-logo-stage {
          position: absolute;

          z-index: 5;

          left: 50%;
          top: 50%;

          width: 190px;
          height: 190px;

          margin-left: -95px;
          margin-top: -95px;

          display: flex;
          align-items: center;
          justify-content: center;

          opacity: 0;

          transform:
            translate3d(
              0,
              0,
              0
            )
            scale(1);

          transform-origin:
            center center;

          backface-visibility:
            hidden;

          pointer-events: none;
        }


        /* =================================================
           FLASH

           Single static radial gradient.
        ================================================= */

        .nyxora-flash {
          position: absolute;

          z-index: 20;

          inset: 0;

          opacity: 0;

          pointer-events: none;

          background:
            radial-gradient(
              ellipse at center,

              rgba(
                255,
                255,
                255,
                .95
              )
              0%,

              rgba(
                216,
                180,
                254,
                .72
              )
              7%,

              rgba(
                168,
                85,
                247,
                .32
              )
              18%,

              rgba(
                34,
                211,
                238,
                .09
              )
              38%,

              transparent
              68%
            );
        }


        /* =================================================
           BRAND
        ================================================= */

        .nyxora-brand {
          position: absolute;

          z-index: 10;

          left: 50%;

          top:
            calc(
              50% + 130px
            );

          opacity: 0;

          transform:
            translate3d(
              -50%,
              10px,
              0
            );

          text-align: center;

          pointer-events: none;
        }


        .nyxora-name {
          padding-left: .42em;

          font-size: 18px;

          font-weight: 700;

          letter-spacing: .42em;

          background:
            linear-gradient(
              90deg,
              #f0abfc,
              #c4b5fd,
              #67e8f9
            );

          -webkit-background-clip:
            text;

          background-clip:
            text;

          color: transparent;
        }


        .nyxora-tagline {
          margin-top: 8px;

          padding-left: .3em;

          white-space: nowrap;

          color:
            rgba(
              148,
              163,
              184,
              .58
            );

          font-size: 7px;

          font-weight: 600;

          letter-spacing: .3em;
        }


        /* =================================================
           VIGNETTE

           Static.
        ================================================= */

        .nyxora-vignette {
          position: absolute;

          z-index: 30;

          inset: 0;

          pointer-events: none;

          background:
            radial-gradient(
              ellipse at center,

              transparent 30%,

              rgba(
                0,
                0,
                0,
                .12
              )
              58%,

              rgba(
                0,
                0,
                0,
                .78
              )
              100%
            );
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (
          max-width: 640px
        ) {

          .nyxora-logo-stage {
            width: 165px;
            height: 165px;

            margin-left: -82.5px;
            margin-top: -82.5px;
          }


          .nyxora-logo-stage > * {
            transform:
              scale(.87);
          }


          .nyxora-brand {
            top:
              calc(
                50% + 112px
              );
          }


          .nyxora-name {
            font-size: 16px;
          }


          .nyxora-glow {
            width: 85vw;
          }

        }


        /* =================================================
           REDUCED MOTION
        ================================================= */

        @media (
          prefers-reduced-motion:
          reduce
        ) {

          .nyxora-logo-stage {
            transform:
              translate3d(
                0,
                0,
                0
              )
              scale(1)
              !important;

            opacity: 1 !important;
          }

        }

      `}</style>

    </div>
  );
}