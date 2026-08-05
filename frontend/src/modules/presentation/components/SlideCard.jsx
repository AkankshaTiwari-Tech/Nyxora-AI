import {
  Image,
  FileText,
  List,
  Network,
} from "lucide-react";


// ======================================================
// SLIDE CARD
// ======================================================

export default function SlideCard({

  slide,

  index,

}) {


  return (

    <div
      className="
        group/slide
        relative
        overflow-hidden
        rounded-2xl
        border
        border-violet-400/15
        bg-gradient-to-br
        from-fuchsia-950/[0.08]
        via-[#0A0F1E]/95
        to-cyan-950/[0.08]
        p-5
        shadow-[0_8px_30px_rgba(0,0,0,0.14)]
        transition-all
        duration-300
        hover:border-violet-400/30
        hover:shadow-[0_10px_35px_rgba(139,92,246,0.08)]
      "
    >

      {/* ===============================================
          LEFT ACCENT
      ================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-5
          left-0
          top-5
          w-[2px]
          rounded-full
          bg-gradient-to-b
          from-fuchsia-400
          via-violet-400
          to-cyan-400
          opacity-80
          shadow-[0_0_10px_rgba(139,92,246,0.35)]
        "
      />


      {/* ===============================================
          AMBIENT GLOW
      ================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-violet-500/[0.05]
          blur-3xl
        "
      />


      <div
        className="
          relative
          z-10
        "
      >

        {/* =============================================
            SLIDE HEADER
        ============================================== */}

        <div
          className="
            mb-4
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div
            className="
              min-w-0
              flex-1
            "
          >

            {/* SLIDE NUMBER */}

            <div
              className="
                mb-2
                inline-flex
                items-center
                rounded-full
                border
                border-violet-400/20
                bg-violet-500/[0.07]
                px-2.5
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-violet-300
              "
            >
              Slide {index + 1}
            </div>


            {/* TITLE */}

            <h3
              className="
                text-lg
                font-semibold
                leading-7
                text-white
              "
            >
              {slide.title || "Untitled Slide"}
            </h3>

          </div>


          {/* DOCUMENT ICON */}

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
              from-fuchsia-500/10
              via-violet-500/15
              to-cyan-400/10
            "
          >

            <FileText
              size={18}
              className="
                text-violet-200
              "
            />

          </div>

        </div>


        {/* =============================================
            SUBTITLE
        ============================================== */}

        {slide.subtitle && (

          <p
            className="
              mb-5
              text-sm
              leading-6
              text-slate-400
            "
          >
            {slide.subtitle}
          </p>

        )}


        {/* =============================================
            KEY POINTS
        ============================================== */}

        {slide.points &&
          slide.points.length > 0 && (

          <div
            className="
              mb-5
            "
          >

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-slate-300
              "
            >

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-violet-500/10
                  text-violet-300
                "
              >

                <List
                  size={14}
                />

              </div>

              Key Points

            </div>


            <ul
              className="
                space-y-2.5
              "
            >

              {slide.points.map(
                (
                  point,
                  pointIndex
                ) => (

                  <li
                    key={
                      pointIndex
                    }
                    className="
                      flex
                      items-start
                      gap-3
                      text-sm
                      leading-6
                      text-slate-400
                    "
                  >

                    {/* NYXORA BULLET */}

                    <span
                      className="
                        mt-[8px]
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-violet-400
                        shadow-[0_0_7px_rgba(167,139,250,0.55)]
                      "
                    />


                    <span>
                      {point}
                    </span>

                  </li>

                )
              )}

            </ul>

          </div>

        )}


        {/* =============================================
            IMAGE SUGGESTION
        ============================================== */}

        {slide.imageSuggestion && (

          <div
            className="
              relative
              mb-3
              overflow-hidden
              rounded-xl
              border
              border-cyan-400/15
              bg-gradient-to-r
              from-cyan-950/15
              via-[#090F1C]
              to-violet-950/10
              p-4
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-20
                w-20
                rounded-full
                bg-cyan-400/[0.05]
                blur-2xl
              "
            />


            <div
              className="
                relative
                z-10
                mb-2
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-cyan-300
              "
            >

              <Image
                size={15}
              />

              Image Suggestion

            </div>


            <p
              className="
                relative
                z-10
                text-sm
                leading-6
                text-slate-400
              "
            >
              {slide.imageSuggestion}
            </p>

          </div>

        )}


        {/* =============================================
            DIAGRAM SUGGESTION
        ============================================== */}

        {slide.diagramSuggestion && (

          <div
            className="
              relative
              overflow-hidden
              rounded-xl
              border
              border-violet-400/15
              bg-gradient-to-r
              from-violet-950/15
              via-[#090F1C]
              to-fuchsia-950/10
              p-4
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-20
                w-20
                rounded-full
                bg-fuchsia-400/[0.04]
                blur-2xl
              "
            />


            <div
              className="
                relative
                z-10
                mb-2
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-violet-300
              "
            >

              <Network
                size={15}
              />

              Diagram Suggestion

            </div>


            <p
              className="
                relative
                z-10
                text-sm
                leading-6
                text-slate-400
              "
            >
              {slide.diagramSuggestion}
            </p>

          </div>

        )}

      </div>

    </div>

  );

}