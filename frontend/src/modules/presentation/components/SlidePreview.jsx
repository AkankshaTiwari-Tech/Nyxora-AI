import {
  Layers3,
  Sparkles,
} from "lucide-react";


import SlideCard
  from "./SlideCard";


// ======================================================
// SLIDE PREVIEW
// ======================================================

export default function SlidePreview({

  slides = [],

}) {


  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-violet-400/20
        bg-gradient-to-br
        from-fuchsia-950/10
        via-[#0B1020]/95
        to-cyan-950/10
        p-6
        shadow-[0_12px_40px_rgba(0,0,0,0.18)]
      "
    >

      {/* ===============================================
          AMBIENT GLOW
      ================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-fuchsia-500/[0.05]
          blur-3xl
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          right-0
          h-40
          w-40
          rounded-full
          bg-cyan-400/[0.05]
          blur-3xl
        "
      />


      {/* ===============================================
          TOP ACCENT
      ================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          h-[2px]
          bg-gradient-to-r
          from-fuchsia-500
          via-violet-500
          to-cyan-400
        "
      />


      <div
        className="
          relative
          z-10
        "
      >

        {/* =============================================
            HEADER
        ============================================== */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-violet-400/20
                bg-gradient-to-br
                from-fuchsia-500/15
                via-violet-500/15
                to-cyan-400/10
              "
            >

              <Layers3
                size={18}
                className="
                  text-violet-200
                "
              />

            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-semibold
                  text-white
                "
              >
                Slide Preview
              </h2>


              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                "
              >
                Preview your generated presentation
              </p>

            </div>

          </div>


          {/* SLIDE COUNT */}

          {slides.length > 0 && (

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-violet-400/20
                bg-violet-500/[0.07]
                px-3
                py-1.5
                text-xs
                font-medium
                text-violet-200
              "
            >

              <Sparkles
                size={12}
                className="
                  text-cyan-300
                "
              />

              {slides.length}

              {slides.length === 1
                ? " Slide"
                : " Slides"}

            </div>

          )}

        </div>


        {/* =============================================
            EMPTY STATE
        ============================================== */}

        {slides.length === 0 ? (

          <div
            className="
              relative
              flex
              min-h-[350px]
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-dashed
              border-violet-400/20
              bg-[#080D19]/45
              px-6
              text-center
            "
          >

            {/* EMPTY STATE GLOW */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-36
                w-36
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-violet-500/[0.06]
                blur-3xl
              "
            />


            <div
              className="
                relative
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                border
                border-violet-400/20
                bg-gradient-to-br
                from-fuchsia-500/10
                via-violet-500/10
                to-cyan-400/10
              "
            >

              <Layers3
                size={21}
                className="
                  text-violet-300
                "
              />

            </div>


            <p
              className="
                relative
                text-sm
                font-medium
                text-slate-400
              "
            >
              Generated slides will appear here
            </p>


            <p
              className="
                relative
                mt-1.5
                max-w-xs
                text-xs
                leading-5
                text-slate-600
              "
            >
              Enter your presentation details and let
              Nyxora AI create the slides.
            </p>

          </div>

        ) : (

          /* ===========================================
             GENERATED SLIDES
          ============================================ */

          <div
            className="
              space-y-4
            "
          >

            {slides.map(
              (
                slide,
                index
              ) => (

                <SlideCard

                  key={
                    slide?.id ||
                    index
                  }

                  slide={
                    slide
                  }

                  index={
                    index
                  }

                />

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}