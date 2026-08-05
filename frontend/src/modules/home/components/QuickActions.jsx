import {
  MessageSquarePlus,
  FileText,
  FileDown,
  ClipboardList,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


export default function QuickActions() {

  const navigate =
    useNavigate();


  const actions = [

    {
      title: "New Chat",

      description:
        "Start a new AI conversation",

      icon:
        MessageSquarePlus,

      accent:
        "fuchsia",

      action: () =>
        navigate(
          "/chat",
          {
            state: {
              createNewChat: true,
            },
          }
        ),
    },


    {
      title: "Create Note",

      description:
        "Create a Workspace note",

      icon:
        FileText,

      accent:
        "violet",

      action: () =>
        navigate(
          "/workspace"
        ),
    },


    {
      title: "Generate PDF",

      description:
        "Create a downloadable document",

      icon:
        FileDown,

      accent:
        "blue",

      action: () =>
        navigate(
          "/workspace"
        ),
    },


    {
      title: "Create Test",

      description:
        "Generate a test with Nyxora AI",

      icon:
        ClipboardList,

      accent:
        "cyan",

      action: () =>
        navigate(
          "/chat",
          {
            state: {
              createNewChat: true,
              assistantMode: "test",
            },
          }
        ),
    },

  ];


  return (

    <div>


      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div
        className="
          mb-5
          flex
          items-end
          justify-between
          gap-4
        "
      >


        <div>


          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >

            <Sparkles
              size={14}
              className="
                text-violet-400
              "
            />


            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-slate-500
              "
            >

              Get Started

            </span>

          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-white
            "
          >

            Quick Actions

          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >

            Jump straight into your most-used Nyxora tools.

          </p>


        </div>


        {/* DECORATIVE BRAND LINE */}

        <div
          className="
            mb-2
            hidden
            h-px
            w-32
            bg-gradient-to-r
            from-fuchsia-500/50
            via-violet-500/40
            to-cyan-400/40
            sm:block
          "
        />


      </div>



      {/* ==================================================
          ACTION GRID
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >


        {actions.map(
          (action, index) => {

            const Icon =
              action.icon;


            const styles =
              getAccentStyles(
                action.accent
              );


            return (

              <button

                key={
                  action.title
                }

                type="button"

                onClick={
                  action.action
                }

                className="
                  group
                  nyxora-card
                  nyxora-card-hover
                  relative
                  min-h-[205px]
                  overflow-hidden
                  p-5
                  text-left
                "

              >


                {/* ==========================================
                    CARD AMBIENT GLOW
                ========================================== */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    blur-[70px]
                    transition-all
                    duration-500
                    group-hover:scale-125
                    ${styles.glow}
                  `}
                />


                {/* ==========================================
                    TOP ACCENT
                ========================================== */}

                <div
                  className={`
                    absolute
                    left-5
                    right-5
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-current
                    to-transparent
                    opacity-50
                    ${styles.text}
                  `}
                />


                {/* ==========================================
                    TOP ROW
                ========================================== */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-start
                    justify-between
                  "
                >


                  {/* ICON */}

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      transition-all
                      duration-300
                      group-hover:scale-105
                      ${styles.icon}
                    `}
                  >

                    <Icon
                      size={23}
                    />

                  </div>



                  {/* NUMBER + ARROW */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >


                    <span
                      className="
                        text-[10px]
                        font-semibold
                        tracking-[0.15em]
                        text-slate-700
                      "
                    >

                      0{index + 1}

                    </span>


                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-white/[0.06]
                        bg-white/[0.025]
                        text-slate-600
                        transition-all
                        duration-300
                        group-hover:border-white/[0.10]
                        group-hover:bg-white/[0.05]
                        group-hover:text-white
                      "
                    >

                      <ArrowUpRight
                        size={15}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-[1px]
                          group-hover:-translate-y-[1px]
                        "
                      />

                    </div>


                  </div>


                </div>



                {/* ==========================================
                    CONTENT
                ========================================== */}

                <div
                  className="
                    relative
                    z-10
                    mt-6
                  "
                >


                  <h3
                    className="
                      text-lg
                      font-semibold
                      tracking-tight
                      text-white
                      transition-colors
                      duration-300
                    "
                  >

                    {action.title}

                  </h3>


                  <p
                    className="
                      mt-2
                      max-w-[220px]
                      text-sm
                      leading-6
                      text-slate-500
                      transition-colors
                      duration-300
                      group-hover:text-slate-400
                    "
                  >

                    {action.description}

                  </p>


                </div>



                {/* ==========================================
                    BOTTOM BRAND INDICATOR
                ========================================== */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-[2px]
                    overflow-hidden
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                >

                  <div
                    className={`
                      h-full
                      w-full
                      bg-gradient-to-r
                      ${styles.line}
                    `}
                  />

                </div>


              </button>

            );

          }
        )}


      </div>


    </div>

  );

}



/* =========================================================
   NYXORA ACTION ACCENTS
========================================================= */

function getAccentStyles(
  accent
) {


  switch (accent) {


    case "fuchsia":

      return {

        icon:
          "border-fuchsia-400/15 bg-fuchsia-500/[0.09] text-fuchsia-300 shadow-[0_0_22px_rgba(217,70,239,.07)]",

        glow:
          "bg-fuchsia-500/[0.10]",

        text:
          "text-fuchsia-400",

        line:
          "from-fuchsia-500 via-violet-500 to-transparent",

      };


    case "violet":

      return {

        icon:
          "border-violet-400/15 bg-violet-500/[0.09] text-violet-300 shadow-[0_0_22px_rgba(124,58,237,.07)]",

        glow:
          "bg-violet-500/[0.10]",

        text:
          "text-violet-400",

        line:
          "from-violet-500 via-indigo-500 to-transparent",

      };


    case "blue":

      return {

        icon:
          "border-blue-400/15 bg-blue-500/[0.09] text-blue-300 shadow-[0_0_22px_rgba(59,130,246,.07)]",

        glow:
          "bg-blue-500/[0.10]",

        text:
          "text-blue-400",

        line:
          "from-blue-500 via-cyan-500 to-transparent",

      };


    case "cyan":

      return {

        icon:
          "border-cyan-400/15 bg-cyan-500/[0.09] text-cyan-300 shadow-[0_0_22px_rgba(34,211,238,.07)]",

        glow:
          "bg-cyan-500/[0.10]",

        text:
          "text-cyan-400",

        line:
          "from-cyan-400 via-blue-500 to-transparent",

      };


    default:

      return {

        icon:
          "border-violet-400/15 bg-violet-500/[0.09] text-violet-300",

        glow:
          "bg-violet-500/[0.10]",

        text:
          "text-violet-400",

        line:
          "from-violet-500 via-blue-500 to-transparent",

      };


  }


}