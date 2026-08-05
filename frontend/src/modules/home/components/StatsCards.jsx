import {
  MessageSquare,
  FileText,
  Star,
  HardDrive,
  Activity,
  TrendingUp,
} from "lucide-react";


export default function StatsCards({
  chats = [],
  documents = [],
}) {


  const stats = [

    {
      title: "Chats",

      value: chats.length,

      description:
        "AI conversations",

      icon:
        MessageSquare,

      accent:
        "fuchsia",
    },


    {
      title: "Documents",

      value: documents.length,

      description:
        "Workspace files",

      icon:
        FileText,

      accent:
        "violet",
    },


    {
      title: "Favorites",

      value: 0,

      description:
        "Saved items",

      icon:
        Star,

      accent:
        "blue",
    },


    {
      title: "Storage",

      value: "0 MB",

      description:
        "Workspace storage",

      icon:
        HardDrive,

      accent:
        "cyan",
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

            <Activity
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

              Workspace Activity

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

            Overview

          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >

            A quick look at your Nyxora workspace.

          </p>


        </div>


        <div
          className="
            mb-2
            hidden
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.06]
            bg-white/[0.025]
            px-3
            py-1.5
            text-xs
            text-slate-500
            sm:flex
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-cyan-400
              shadow-[0_0_8px_rgba(34,211,238,.7)]
            "
          />

          Live workspace

        </div>


      </div>



      {/* ==================================================
          STATS GRID
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


        {stats.map(
          (item, index) => {


            const Icon =
              item.icon;


            const styles =
              getStatStyles(
                item.accent
              );


            return (

              <div

                key={
                  item.title
                }

                className="
                  group
                  nyxora-card
                  nyxora-card-hover
                  relative
                  min-h-[190px]
                  overflow-hidden
                  p-5
                "

              >


                {/* ==========================================
                    AMBIENT GLOW
                ========================================== */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-14
                    -top-14
                    h-36
                    w-36
                    rounded-full
                    blur-[65px]
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
                    opacity-45
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
                      size={22}
                    />

                  </div>



                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/[0.05]
                      bg-white/[0.025]
                      px-2
                      py-1
                    "
                  >

                    <TrendingUp
                      size={11}
                      className={
                        styles.text
                      }
                    />


                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-slate-500
                      "
                    >

                      0{index + 1}

                    </span>

                  </div>


                </div>



                {/* ==========================================
                    STAT VALUE
                ========================================== */}

                <div
                  className="
                    relative
                    z-10
                    mt-5
                  "
                >


                  <div
                    className="
                      flex
                      items-end
                      gap-2
                    "
                  >

                    <p
                      className="
                        text-3xl
                        font-bold
                        tracking-tight
                        text-white
                      "
                    >

                      {item.value}

                    </p>


                    <span
                      className={`
                        mb-1.5
                        h-1.5
                        w-1.5
                        rounded-full
                        ${styles.dot}
                      `}
                    />

                  </div>


                  <h3
                    className="
                      mt-2
                      text-sm
                      font-semibold
                      text-slate-300
                    "
                  >

                    {item.title}

                  </h3>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-600
                    "
                  >

                    {item.description}

                  </p>


                </div>



                {/* ==========================================
                    BOTTOM ACCENT
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


              </div>

            );


          }
        )}


      </div>


    </div>

  );

}



/* =========================================================
   NYXORA STAT ACCENTS
========================================================= */

function getStatStyles(
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

        dot:
          "bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,.75)]",

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

        dot:
          "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,.75)]",

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

        dot:
          "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,.75)]",

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

        dot:
          "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,.75)]",

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

        dot:
          "bg-violet-400",

        line:
          "from-violet-500 via-blue-500 to-transparent",

      };


  }


}