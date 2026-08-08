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
              max-[480px]:text-xl
            "
          >
            Quick Actions
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
              max-[480px]:text-xs
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
          
          Desktop:
          1 / 2 / 4 columns as before.

          Mobile:
          Compact 2x2 cards.
          No horizontal overflow.
      ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-2
          sm:gap-4
          xl:grid-cols-4
        "
      >

        {
          actions.map(
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
                    min-w-0
                    min-h-[145px]
                    overflow-hidden
                    p-3

                    sm:min-h-[205px]
                    sm:p-5

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
                      h-32
                      w-32

                      sm:h-40
                      sm:w-40

                      rounded-full
                      blur-[60px]
                      sm:blur-[70px]
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
                      left-3
                      right-3
                      top-0

                      sm:left-5
                      sm:right-5

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
                      gap-1
                    "
                  >

                    {/* ICON */}

                    <div
                      className={`
                        flex
                        h-9
                        w-9

                        sm:h-12
                        sm:w-12

                        shrink-0
                        items-center
                        justify-center
                        rounded-lg

                        sm:rounded-xl

                        border
                        transition-all
                        duration-300
                        group-hover:scale-105
                        ${styles.icon}
                      `}
                    >

                      <Icon
                        size={18}
                        className="
                          sm:h-[23px]
                          sm:w-[23px]
                        "
                      />

                    </div>


                    {/* NUMBER + ARROW */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1

                        sm:gap-2
                      "
                    >

                      <span
                        className="
                          hidden
                          text-[10px]
                          font-semibold
                          tracking-[0.15em]
                          text-slate-700
                          sm:block
                        "
                      >
                        0{index + 1}
                      </span>


                      <div
                        className="
                          flex
                          h-6
                          w-6

                          sm:h-8
                          sm:w-8

                          items-center
                          justify-center
                          rounded-md

                          sm:rounded-lg

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
                          size={12}
                          className="
                            sm:h-[15px]
                            sm:w-[15px]
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
                      mt-3

                      sm:mt-6
                    "
                  >

                    <h3
                      className="
                        truncate
                        text-sm
                        font-semibold
                        tracking-tight
                        text-white

                        sm:text-lg

                        transition-colors
                        duration-300
                      "
                    >
                      {action.title}
                    </h3>


                    <p
                      className="
                        mt-1
                        hidden
                        text-xs
                        leading-5
                        text-slate-500

                        sm:mt-2
                        sm:block
                        sm:max-w-[220px]
                        sm:text-sm
                        sm:leading-6

                        sm:group-hover:text-slate-400
                        transition-colors
                        duration-300
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
          )
        }

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