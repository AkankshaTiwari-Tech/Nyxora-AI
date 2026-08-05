import {
  FileText,
  ArrowUpRight,
  Clock3,
  FolderOpen,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getDocumentTypeIcon,
  getDocumentTypeLabel,
} from "../../workspace/utils/workspaceDocument";


function formatDate(
  timestamp
) {

  if (!timestamp) {
    return "";
  }


  try {

    const date =
      timestamp?.toDate
        ? timestamp.toDate()
        : new Date(timestamp);


    return date.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  } catch {

    return "";

  }

}


export default function RecentFiles({
  documents = [],
}) {

  const navigate =
    useNavigate();


  const recentDocuments =
    [...documents]
      .sort((a, b) => {

        const aTime =
          a.updatedAt?.toMillis?.() ||
          a.createdAt?.toMillis?.() ||
          0;


        const bTime =
          b.updatedAt?.toMillis?.() ||
          b.createdAt?.toMillis?.() ||
          0;


        return bTime - aTime;

      })
      .slice(
        0,
        4
      );


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

            <Clock3
              size={14}
              className="
                text-cyan-400
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

              Latest Activity

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

            Recent Files

          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >

            Continue working on your latest workspace documents.

          </p>


        </div>


        <button
          type="button"

          onClick={() =>
            navigate(
              "/workspace"
            )
          }

          className="
            group
            flex
            shrink-0
            items-center
            gap-2
            rounded-xl
            border
            border-violet-400/[0.12]
            bg-violet-500/[0.05]
            px-3.5
            py-2
            text-sm
            font-medium
            text-violet-300
            transition-all
            duration-300
            hover:border-violet-400/25
            hover:bg-violet-500/[0.10]
            hover:text-white
          "
        >

          View All


          <ArrowUpRight
            size={15}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-[1px]
              group-hover:-translate-y-[1px]
            "
          />

        </button>


      </div>



      {/* ==================================================
          RECENT FILES CONTAINER
      ================================================== */}

      <div
        className="
          nyxora-card
          relative
          overflow-hidden
        "
      >


        {/* TOP NYXORA ACCENT */}

        <div
          className="
            absolute
            left-8
            right-8
            top-0
            h-px
            bg-gradient-to-r
            from-fuchsia-500/35
            via-violet-500/45
            via-blue-500/35
            to-cyan-400/35
          "
        />


        {/* AMBIENT GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-violet-500/[0.045]
            blur-[100px]
          "
        />



        {recentDocuments.length === 0 ? (


          /* ==================================================
              EMPTY STATE
          ================================================== */

          <div
            className="
              relative
              z-10
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center
              px-6
              py-12
              text-center
            "
          >


            {/* ICON AREA */}

            <div
              className="
                relative
                flex
                h-20
                w-20
                items-center
                justify-center
              "
            >


              <div
                className="
                  absolute
                  inset-0
                  rounded-3xl
                  bg-gradient-to-br
                  from-fuchsia-500/[0.10]
                  via-violet-500/[0.10]
                  to-cyan-400/[0.08]
                  blur-xl
                "
              />


              <div
                className="
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-violet-400/[0.14]
                  bg-gradient-to-br
                  from-fuchsia-500/[0.08]
                  via-violet-500/[0.10]
                  to-cyan-400/[0.06]
                  text-violet-300
                  shadow-[0_0_28px_rgba(124,58,237,.08)]
                "
              >

                <FileText
                  size={27}
                />

              </div>


              <div
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/[0.08]
                  bg-[#0A0E1C]
                  text-cyan-300
                "
              >

                <Sparkles
                  size={13}
                />

              </div>


            </div>



            <h3
              className="
                mt-5
                text-lg
                font-semibold
                text-white
              "
            >

              No files yet

            </h3>


            <p
              className="
                mt-2
                max-w-sm
                text-sm
                leading-6
                text-slate-500
              "
            >

              Documents you create or save from Nyxora AI
              will appear here for quick access.

            </p>



            <button
              type="button"

              onClick={() =>
                navigate(
                  "/workspace"
                )
              }

              className="
                nyxora-button
                mt-6
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                text-sm
              "
            >

              <FolderOpen
                size={16}
                className="
                  relative
                  z-10
                "
              />


              <span
                className="
                  relative
                  z-10
                "
              >

                Open Workspace

              </span>

            </button>


          </div>


        ) : (


          /* ==================================================
              DOCUMENT LIST
          ================================================== */

          <div
            className="
              relative
              z-10
            "
          >


            {recentDocuments.map(
              (document, index) => {


                const styles =
                  getDocumentAccent(
                    index
                  );


                return (

                  <button

                    key={
                      document.id
                    }

                    type="button"

                    onClick={() =>
                      navigate(
                        "/workspace"
                      )
                    }

                    className="
                      group
                      relative
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      border-b
                      border-white/[0.055]
                      px-5
                      py-4
                      text-left
                      transition-all
                      duration-300
                      last:border-none
                      hover:bg-white/[0.025]
                      sm:px-6
                    "
                  >


                    {/* HOVER ACCENT LINE */}

                    <div
                      className={`
                        absolute
                        bottom-[22%]
                        left-0
                        top-[22%]
                        w-[2px]
                        rounded-r-full
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                        ${styles.side}
                      `}
                    />



                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                      "
                    >


                      {/* DOCUMENT ICON */}

                      <div
                        className={`
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          text-xl
                          transition-all
                          duration-300
                          group-hover:scale-[1.04]
                          ${styles.icon}
                        `}
                      >

                        {getDocumentTypeIcon(
                          document.type
                        )}

                      </div>



                      {/* DOCUMENT DETAILS */}

                      <div
                        className="
                          min-w-0
                        "
                      >


                        <h3
                          className="
                            truncate
                            font-semibold
                            text-slate-200
                            transition-colors
                            duration-300
                            group-hover:text-white
                          "
                        >

                          {document.title}

                        </h3>


                        <div
                          className="
                            mt-1.5
                            flex
                            items-center
                            gap-2
                          "
                        >


                          <span
                            className={`
                              h-1.5
                              w-1.5
                              shrink-0
                              rounded-full
                              ${styles.dot}
                            `}
                          />


                          <p
                            className="
                              truncate
                              text-xs
                              text-slate-500
                            "
                          >

                            {getDocumentTypeLabel(
                              document.type
                            )}

                          </p>


                        </div>


                      </div>


                    </div>



                    {/* ======================================
                        RIGHT SIDE
                    ====================================== */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-3
                      "
                    >


                      <span
                        className="
                          hidden
                          text-xs
                          text-slate-600
                          sm:block
                        "
                      >

                        {formatDate(
                          document.updatedAt ||
                          document.createdAt
                        )}

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
                          border-white/[0.05]
                          bg-white/[0.02]
                          text-slate-600
                          transition-all
                          duration-300
                          group-hover:border-violet-400/[0.12]
                          group-hover:bg-violet-500/[0.06]
                          group-hover:text-violet-300
                        "
                      >

                        <ArrowUpRight
                          size={14}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-[1px]
                            group-hover:-translate-y-[1px]
                          "
                        />

                      </div>


                    </div>


                  </button>

                );

              }
            )}


          </div>


        )}


      </div>


    </div>

  );

}



/* =========================================================
   DOCUMENT ACCENT PALETTE

   Cycles through the Nyxora brand colors without
   changing document data or document types.
========================================================= */

function getDocumentAccent(
  index
) {


  const styles = [


    {
      icon:
        "border-fuchsia-400/15 bg-fuchsia-500/[0.08] text-fuchsia-300 shadow-[0_0_18px_rgba(217,70,239,.05)]",

      dot:
        "bg-fuchsia-400 shadow-[0_0_7px_rgba(217,70,239,.65)]",

      side:
        "bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,.45)]",
    },


    {
      icon:
        "border-violet-400/15 bg-violet-500/[0.08] text-violet-300 shadow-[0_0_18px_rgba(124,58,237,.05)]",

      dot:
        "bg-violet-400 shadow-[0_0_7px_rgba(167,139,250,.65)]",

      side:
        "bg-violet-400 shadow-[0_0_8px_rgba(124,58,237,.45)]",
    },


    {
      icon:
        "border-blue-400/15 bg-blue-500/[0.08] text-blue-300 shadow-[0_0_18px_rgba(59,130,246,.05)]",

      dot:
        "bg-blue-400 shadow-[0_0_7px_rgba(96,165,250,.65)]",

      side:
        "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,.45)]",
    },


    {
      icon:
        "border-cyan-400/15 bg-cyan-500/[0.08] text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.05)]",

      dot:
        "bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,.65)]",

      side:
        "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,.45)]",
    },

  ];


  return styles[
    index %
    styles.length
  ];

}