import {
  Check,
  Copy,
  Download,
  FileText,
  Pencil,
  Sparkles,
  Trash2,
  Eye,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
    downloadWorkspacePdf
}
from "../documents/pdfs/renderer/generatePdf";

import {
  getDocumentTypeIcon,
  getDocumentTypeLabel,
} from "../utils/workspaceDocument";


export default function WorkspaceDocumentCard({
  document,
  classItem,
  student,
  onEdit,
  onDelete,
}) {

  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    viewerOpen,
    setViewerOpen,
  ] = useState(false);


  async function copyDocument() {

    try {

      await navigator.clipboard.writeText(
        document.content || ""
      );


      setCopied(true);


      setTimeout(
        () => {
          setCopied(false);
        },
        1600
      );

    } catch (error) {

      console.error(
        "Document copy failed:",
        error
      );

    }

  }


  function downloadPdf() {

    downloadWorkspacePdf({

      ...document,

      className:
        classItem?.name || "",

      studentName:
        student?.name || "",

    });

  }


  return (

    <>

      {/* =================================================
          DOCUMENT CARD
      ================================================== */}

      <article
        className="
          group
          relative
          overflow-hidden

          rounded-2xl

          border
          border-white/[0.08]

          bg-[#0B1020]/85

          p-5

          shadow-[0_12px_35px_rgba(0,0,0,0.14)]

          backdrop-blur-xl

          transition-all
          duration-300

          hover:-translate-y-1
          hover:border-violet-400/25
          hover:bg-[#0E1426]
          hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)]
        "
      >

        {/* ===============================================
            AMBIENT GLOWS
        ================================================ */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20

            h-48
            w-48

            rounded-full

            bg-violet-500/[0.08]

            blur-[80px]

            transition-all
            duration-300

            group-hover:bg-violet-500/[0.12]
          "
        />


        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-20

            h-40
            w-40

            rounded-full

            bg-cyan-500/[0.04]

            blur-[70px]
          "
        />


        {/* TOP ACCENT */}

        <div
          className="
            pointer-events-none
            absolute
            left-[12%]
            top-0

            h-px
            w-[76%]

            bg-gradient-to-r
            from-transparent
            via-violet-400/45
            to-transparent
          "
        />


        <div className="relative z-10">

          {/* ===============================================
              HEADER
          ================================================ */}

          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div className="min-w-0">

              {/* BADGES */}

              <div
                className="
                  mb-3
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5

                    rounded-lg

                    border
                    border-violet-400/10

                    bg-violet-500/[0.08]

                    px-2.5
                    py-1

                    text-xs
                    font-medium
                    text-violet-300
                  "
                >

                  <span>
                    {getDocumentTypeIcon(
                      document.type
                    )}
                  </span>


                  <span>
                    {getDocumentTypeLabel(
                      document.type
                    )}
                  </span>

                </span>


                {document.source === "ai" && (

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5

                      rounded-lg

                      border
                      border-cyan-400/10

                      bg-gradient-to-r
                      from-fuchsia-500/[0.07]
                      via-violet-500/[0.10]
                      to-cyan-500/[0.07]

                      px-2.5
                      py-1

                      text-xs
                      font-medium
                      text-violet-200
                    "
                  >

                    <Sparkles
                      size={12}
                      className="
                        text-fuchsia-400
                      "
                    />

                    AI Generated

                  </span>

                )}

              </div>


              {/* TITLE */}

              <h3
                className="
                  truncate
                  text-base
                  font-semibold
                  text-white
                "
              >
                {document.title}
              </h3>


              {/* METADATA */}

              <p
                className="
                  mt-2
                  line-clamp-2
                  text-sm
                  leading-5
                  text-slate-500
                "
              >

                {[
                  document.subject,
                  document.chapter,
                  classItem?.name,
                  student?.name,
                ]
                  .filter(Boolean)
                  .join(" • ") ||
                  "No additional information"}

              </p>

            </div>


            {/* DOCUMENT ICON */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-violet-400/15

                bg-gradient-to-br
                from-fuchsia-500/10
                via-violet-500/15
                to-cyan-500/10

                text-violet-300

                shadow-[0_0_24px_rgba(139,92,246,0.08)]
              "
            >

              <FileText
                size={20}
              />

            </div>

          </div>


          {/* ===============================================
              CONTENT PREVIEW
          ================================================ */}

          <div
            className="
              relative
              mt-4
              overflow-hidden

              rounded-xl

              border
              border-white/[0.055]

              bg-white/[0.02]

              px-4
              py-3.5
            "
          >

            {/* LEFT ACCENT */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-3
                left-0
                top-3

                w-[2px]

                rounded-full

                bg-gradient-to-b
                from-fuchsia-400/70
                via-violet-400/70
                to-cyan-400/70

                shadow-[0_0_8px_rgba(139,92,246,0.35)]
              "
            />


            <p
              className="
                line-clamp-4
                whitespace-pre-line
                text-sm
                leading-6
                text-slate-400
              "
            >

              {document.content ||
                "No content"}

            </p>

          </div>


          {/* ===============================================
              ACTIONS
          ================================================ */}

          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-2
            "
          >

            <Action
              primary
              onClick={() =>
                setViewerOpen(true)
              }
            >

              <Eye size={14} />

              Open

            </Action>


            <Action
              onClick={downloadPdf}
            >

              <Download size={14} />

              PDF

            </Action>


            <Action
              active={copied}
              onClick={copyDocument}
            >

              {copied ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}

              {copied
                ? "Copied"
                : "Copy"}

            </Action>


            <Action
              onClick={() =>
                onEdit(document)
              }
            >

              <Pencil size={14} />

              Edit

            </Action>


            <Action
              danger
              onClick={() =>
                onDelete(document)
              }
            >

              <Trash2 size={14} />

              Delete

            </Action>

          </div>

        </div>

      </article>


      {/* =================================================
          DOCUMENT VIEWER
      ================================================== */}

      {viewerOpen && (

        <div
          className="
            fixed
            inset-0
            z-50

            flex
            items-center
            justify-center

            bg-black/75

            p-4

            backdrop-blur-md

            sm:p-6
          "
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              setViewerOpen(false);

            }

          }}
        >

          <div
            className="
              relative

              max-h-[88vh]
              w-full
              max-w-4xl

              overflow-hidden

              rounded-3xl

              border
              border-violet-400/20

              bg-[#090E1C]

              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
            "
          >

            {/* MODAL AMBIENCE */}

            <div
              className="
                pointer-events-none
                absolute
                -left-32
                -top-32

                h-72
                w-72

                rounded-full

                bg-fuchsia-500/[0.08]

                blur-[110px]
              "
            />


            <div
              className="
                pointer-events-none
                absolute
                -bottom-36
                right-0

                h-80
                w-80

                rounded-full

                bg-cyan-500/[0.06]

                blur-[120px]
              "
            />


            {/* TOP GRADIENT */}

            <div
              className="
                pointer-events-none
                absolute
                left-0
                top-0

                h-px
                w-full

                bg-gradient-to-r
                from-fuchsia-400/60
                via-violet-400/70
                to-cyan-400/60
              "
            />


            <div
              className="
                relative
                z-10

                flex
                max-h-[88vh]
                flex-col
              "
            >

              {/* =========================================
                  VIEWER HEADER
              ========================================== */}

              <div
                className="
                  border-b
                  border-white/[0.07]

                  px-5
                  py-5

                  sm:px-6
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      min-w-0
                      items-start
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        border
                        border-violet-400/15

                        bg-gradient-to-br
                        from-fuchsia-500/10
                        via-violet-500/15
                        to-cyan-500/10

                        text-violet-300
                      "
                    >
                      <FileText
                        size={20}
                      />
                    </div>


                    <div className="min-w-0">

                      <div
                        className="
                          mb-1.5
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >

                        <span
                          className="
                            text-xs
                            font-medium
                            text-violet-300
                          "
                        >
                          {getDocumentTypeLabel(
                            document.type
                          )}
                        </span>


                        {document.source === "ai" && (

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1

                              text-xs
                              text-cyan-300
                            "
                          >
                            <Sparkles
                              size={11}
                            />

                            AI Generated
                          </span>

                        )}

                      </div>


                      <h2
                        className="
                          truncate
                          text-lg
                          font-semibold
                          text-white

                          sm:text-xl
                        "
                      >
                        {document.title}
                      </h2>


                      <p
                        className="
                          mt-1
                          line-clamp-1
                          text-xs
                          text-slate-500
                        "
                      >
                        {[
                          document.subject,
                          document.chapter,
                          classItem?.name,
                          student?.name,
                        ]
                          .filter(Boolean)
                          .join(" • ") ||
                          "Nyxora Workspace Document"}
                      </p>

                    </div>

                  </div>


                  {/* CLOSE */}

                  <button
                    type="button"
                    aria-label="Close document"
                    onClick={() =>
                      setViewerOpen(false)
                    }
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      border
                      border-transparent

                      text-slate-500

                      transition-all
                      duration-200

                      hover:border-white/[0.08]
                      hover:bg-white/[0.05]
                      hover:text-white
                    "
                  >
                    <X size={19} />
                  </button>

                </div>


                {/* VIEWER ACTIONS */}

                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  <Action
                    onClick={
                      downloadPdf
                    }
                  >
                    <Download size={14} />

                    Download PDF
                  </Action>


                  <Action
                    active={copied}
                    onClick={
                      copyDocument
                    }
                  >

                    {copied ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}

                    {copied
                      ? "Copied"
                      : "Copy"}

                  </Action>


                  <Action
                    onClick={() => {

                      setViewerOpen(false);

                      onEdit(document);

                    }}
                  >
                    <Pencil size={14} />

                    Edit
                  </Action>

                </div>

              </div>


              {/* =========================================
                  DOCUMENT CONTENT
              ========================================== */}

              <div
                className="
                  flex-1
                  overflow-y-auto

                  px-5
                  py-6

                  sm:px-7
                  sm:py-7
                "
              >

                <div
                  className="
                    relative

                    rounded-2xl

                    border
                    border-white/[0.06]

                    bg-[#0B1020]/70

                    px-5
                    py-5

                    sm:px-6
                    sm:py-6
                  "
                >

                  {/* CONTENT ACCENT */}

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

                      shadow-[0_0_10px_rgba(139,92,246,0.45)]
                    "
                  />


                  <div
                    className="
                      whitespace-pre-wrap
                      break-words

                      text-[15px]
                      leading-8
                      text-slate-300
                    "
                  >
                    {document.content ||
                      "No content available."}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  );

}


// ======================================================
// ACTION BUTTON
// ======================================================

function Action({
  children,
  onClick,
  danger = false,
  primary = false,
  active = false,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
        group/action
        relative

        flex
        items-center
        gap-2

        overflow-hidden

        rounded-lg

        border

        px-3
        py-2

        text-xs
        font-medium

        transition-all
        duration-200

        ${
          danger
            ? `
              border-red-500/15
              bg-red-500/[0.035]
              text-red-400

              hover:border-red-400/25
              hover:bg-red-500/[0.09]
            `
            : primary
              ? `
                border-violet-400/20

                bg-gradient-to-r
                from-fuchsia-500/[0.10]
                via-violet-500/[0.15]
                to-cyan-500/[0.10]

                text-violet-200

                hover:border-violet-400/35
                hover:text-white
              `
              : active
                ? `
                  border-emerald-400/20
                  bg-emerald-500/[0.08]
                  text-emerald-300
                `
                : `
                  border-white/[0.08]
                  bg-white/[0.02]
                  text-slate-400

                  hover:border-violet-400/20
                  hover:bg-violet-500/[0.06]
                  hover:text-white
                `
        }
      `}
    >

      {children}

    </button>

  );

}