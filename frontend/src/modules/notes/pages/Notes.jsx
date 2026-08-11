import {
  FileText,
  Sparkles,
  Download,
  Loader2,
  Save,
  BookOpen,
  GraduationCap,
  Layers3,
  Lightbulb,
  Check,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  generateResponse,
} from "../../chat/services/geminiService";

import {
    downloadWorkspacePdf
} from "../../workspace/documents/pdfs/renderer/generatePdf";

import useWorkspace
  from "../../workspace/hooks/useWorkspace";


// ======================================================
// NOTES
// ======================================================

export default function Notes() {

  const {
    addAiDocument,
  } = useWorkspace();


  const [
    form,
    setForm,
  ] = useState({

    className: "",

    subject: "",

    chapter: "",

    topic: "",

  });


  const [
    generatedNotes,
    setGeneratedNotes,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    saved,
    setSaved,
  ] = useState(false);


  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleChange =
    (event) => {

      setForm({

        ...form,

        [event.target.name]:
          event.target.value,

      });


      if (saved) {

        setSaved(false);

      }

    };


  // ====================================================
  // GENERATE NOTES
  // ====================================================

  const generateNotes =
    async () => {

      if (
        !form.topic &&
        !form.chapter
      ) {

        return;

      }


      setLoading(true);

      setGeneratedNotes("");

      setSaved(false);


      const prompt = `

You are Nyxora AI Study Material Generator.

Create detailed exam oriented study notes.

Class:
${form.className}

Subject:
${form.subject}

Chapter:
${form.chapter}

Topic:
${form.topic}


Format:

# Topic Name

## Introduction

## Important Concepts

## Definitions

## Key Points

## Examples

## Summary

## Practice Questions


Make it clear and student friendly.

`;


      try {

        await generateResponse(

          prompt,

          (chunk) => {

            setGeneratedNotes(
              chunk
            );

          }

        );

      } catch (error) {

        console.error(
          error
        );


        setGeneratedNotes(
          "Failed to generate notes."
        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // SAVE TO WORKSPACE
  // ====================================================

  const saveToWorkspace =
    async () => {

      if (
        !generatedNotes ||
        saved
      ) {

        return;

      }


      try {

        await addAiDocument({

          title:
            form.topic ||
            "AI Generated Notes",

          type:
            "Study Material",

          subject:
            form.subject,

          chapter:
            form.chapter,

          className:
            form.className,

          content:
            generatedNotes,

          source:
            "Nyxora AI Notes Generator",

          status:
            "saved",

        });


        setSaved(true);

      } catch (error) {

        console.error(
          "Failed to save notes:",
          error
        );

      }

    };


  // ====================================================
  // EXPORT PDF
  // ====================================================

  const exportPDF =
    async () => {

      if (!generatedNotes) {

        return;

      }


      try {

        await downloadWorkspacePdf({

          title:
            form.topic ||
            "Study Material",

          type:
            "Study Material",

          subject:
            form.subject,

          chapter:
            form.chapter,

          className:
            form.className,

          content:
            generatedNotes,

        });

      } catch (error) {

        console.error(
          "Failed to export notes PDF:",
          error
        );

      }

    };


  // ====================================================
  // INPUTS
  // ====================================================

  const fields = [

    {
      name: "className",
      label: "Class",
      placeholder:
        "e.g. BCA AIML",
      icon: GraduationCap,
    },

    {
      name: "subject",
      label: "Subject",
      placeholder:
        "e.g. Machine Learning",
      icon: BookOpen,
    },

    {
      name: "chapter",
      label: "Chapter",
      placeholder:
        "e.g. Introduction to AI",
      icon: Layers3,
    },

    {
      name: "topic",
      label: "Topic",
      placeholder:
        "e.g. Machine Learning",
      icon: Lightbulb,
    },

  ];


  return (

    <main
      className="
        nyxora-page
        nyxora-grid-bg
        relative
        min-h-screen
        overflow-hidden
        px-5
        py-7
        text-white
        sm:px-6
        lg:px-8
        lg:py-8
      "
    >

      {/* ==================================================
          AMBIENT BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-44
          -top-44
          h-[430px]
          w-[430px]
          rounded-full
          bg-fuchsia-600/[0.05]
          blur-[140px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -right-48
          top-[18%]
          h-[460px]
          w-[460px]
          rounded-full
          bg-violet-600/[0.05]
          blur-[145px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          bottom-[-240px]
          left-[30%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-500/[0.035]
          blur-[160px]
        "
      />


      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1500px]
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/[0.07]
            bg-[#080C18]/90
            px-6
            py-6
            shadow-[0_18px_60px_rgba(0,0,0,.22)]
            sm:px-7
            lg:px-8
            lg:py-7
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-24
              h-64
              w-64
              rounded-full
              bg-fuchsia-600/[0.08]
              blur-[95px]
            "
          />


          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-24
              h-64
              w-64
              rounded-full
              bg-cyan-400/[0.07]
              blur-[95px]
            "
          />


          <div
            className="
              absolute
              left-8
              right-8
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-violet-400/60
              to-transparent
            "
          />


          <div
            className="
              relative
              z-10
              flex
              items-start
              gap-4
            "
          >

            <div
              className="
                relative
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-violet-400/20
                bg-gradient-to-br
                from-fuchsia-500/15
                via-violet-500/20
                to-cyan-400/10
                text-violet-200
                shadow-[0_0_30px_rgba(124,58,237,.12)]
              "
            >

              <FileText
                size={27}
              />


              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-fuchsia-400
                  shadow-[0_0_10px_rgba(217,70,239,.9)]
                "
              />

            </div>


            <div>

              <div
                className="
                  mb-1.5
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-violet-300
                "
              >

                <Sparkles
                  size={13}
                  className="
                    text-fuchsia-400
                  "
                />

                Nyxora Study Tools

              </div>


              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-white
                  sm:text-3xl
                "
              >
                AI Notes Generator
              </h1>


              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-400
                  sm:text-[15px]
                "
              >
                Generate structured, exam-focused study material
                with Nyxora AI and save it directly to your
                Workspace.
              </p>

            </div>

          </div>

        </section>


        {/* ==================================================
            GENERATOR
        ================================================== */}

        <section
          className="
            relative
            mt-6
            overflow-hidden
            rounded-3xl
            border
            border-white/[0.07]
            bg-[#0B1020]/90
            p-5
            shadow-[0_16px_50px_rgba(0,0,0,.16)]
            sm:p-6
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-56
              w-56
              rounded-full
              bg-violet-600/[0.06]
              blur-[90px]
            "
          />


          <div
            className="
              absolute
              left-8
              right-8
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-violet-400/35
              to-transparent
            "
          />


          <div
            className="
              relative
              z-10
            "
          >

            {/* SECTION HEADER */}

            <div
              className="
                mb-5
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
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-violet-400/15
                  bg-violet-500/[0.08]
                  text-violet-300
                "
              >

                <Sparkles
                  size={18}
                />

              </div>


              <div>

                <h2
                  className="
                    font-semibold
                    text-white
                  "
                >
                  Generate Study Notes
                </h2>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  "
                >
                  Give Nyxora the learning context for your notes.
                </p>

              </div>

            </div>


            {/* INPUT GRID */}

            <div
              className="
                grid
                gap-4
                md:grid-cols-2
              "
            >

              {fields.map(
                (field) => {

                  const Icon =
                    field.icon;


                  return (

                    <label
                      key={
                        field.name
                      }
                      className="
                        group
                        block
                      "
                    >

                      <span
                        className="
                          mb-2
                          block
                          text-xs
                          font-medium
                          text-slate-500
                        "
                      >
                        {field.label}
                      </span>


                      <div
                        className="
                          flex
                          items-center
                          rounded-xl
                          border
                          border-white/[0.08]
                          bg-[#070B17]/80
                          px-4
                          transition-all
                          duration-300
                          focus-within:border-violet-400/40
                          focus-within:bg-[#090E1C]
                          focus-within:shadow-[0_0_0_3px_rgba(124,58,237,.06),0_0_25px_rgba(124,58,237,.05)]
                        "
                      >

                        <Icon
                          size={17}
                          className="
                            shrink-0
                            text-slate-600
                            transition-colors
                            duration-300
                            group-focus-within:text-violet-300
                          "
                        />


                        <input
                          name={
                            field.name
                          }
                          value={
                            form[
                              field.name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                          placeholder={
                            field.placeholder
                          }
                          autoComplete="off"
                          className="
                            min-w-0
                            flex-1
                            bg-transparent
                            px-3
                            py-3.5
                            text-sm
                            text-white
                            outline-none
                            placeholder:text-slate-600
                          "
                        />

                      </div>

                    </label>

                  );

                }
              )}

            </div>


            {/* GENERATE BUTTON */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-4
              "
            >

              <button
                type="button"
                onClick={
                  generateNotes
                }
                disabled={
                  loading ||
                  (
                    !form.topic.trim() &&
                    !form.chapter.trim()
                  )
                }
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-2
                  overflow-hidden
                  rounded-xl
                  
                  bg-gradient-to-r
                  from-fuchsia-600
                  via-violet-600
                  to-cyan-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_8px_30px_rgba(124,58,237,.20)]
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  hover:shadow-[0_10px_36px_rgba(124,58,237,.30)]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:hover:scale-100
                "
              >

                {/* DIAGONAL SHINE */}

                {!loading && (

                  <span
                    className="
                      pointer-events-none
                      absolute
                      -left-[55%]
                      top-[-120%]
                      h-[340%]
                      w-[35%]
                      rotate-[24deg]
                      bg-gradient-to-r
                      from-transparent
                      via-white/25
                      to-transparent
                      transition-all
                      duration-700
                      group-hover:left-[120%]
                    "
                  />

                )}


                {loading ? (

                  <Loader2
                    size={18}
                    className="
                      relative
                      z-10
                      animate-spin
                    "
                  />

                ) : (

                  <Sparkles
                    size={18}
                    className="
                      relative
                      z-10
                    "
                  />

                )}


                <span
                  className="
                    relative
                    z-10
                  "
                >
                  {loading
                    ? "Generating Notes..."
                    : "Generate Notes"}
                </span>

              </button>


              <p
                className="
                  text-xs
                  text-slate-600
                "
              >
                Topic or chapter is required.
              </p>

            </div>

          </div>

        </section>


        {/* ==================================================
            GENERATED NOTES
        ================================================== */}

        {generatedNotes && (

          <section
            className="
              relative
              mt-6
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.07]
              bg-[#0B1020]/90
              shadow-[0_16px_50px_rgba(0,0,0,.16)]
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -left-20
                -top-20
                h-52
                w-52
                rounded-full
                bg-fuchsia-500/[0.045]
                blur-[85px]
              "
            />


            <div
              className="
                pointer-events-none
                absolute
                -right-20
                bottom-[-80px]
                h-52
                w-52
                rounded-full
                bg-cyan-500/[0.04]
                blur-[90px]
              "
            />


            <div
              className="
                absolute
                left-8
                right-8
                top-0
                h-px
                bg-gradient-to-r
                from-fuchsia-400/0
                via-violet-400/45
                to-cyan-400/0
              "
            />


            {/* RESULT HEADER */}

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-4
                border-b
                border-white/[0.06]
                px-5
                py-5
                sm:px-6
                lg:flex-row
                lg:items-center
                lg:justify-between
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
                    border-violet-400/15
                    bg-gradient-to-br
                    from-fuchsia-500/[0.08]
                    via-violet-500/[0.12]
                    to-cyan-500/[0.06]
                    text-violet-300
                  "
                >

                  <FileText
                    size={19}
                  />

                </div>


                <div>

                  <h2
                    className="
                      font-semibold
                      text-white
                    "
                  >
                    {form.topic ||
                      form.chapter ||
                      "Generated Notes"}
                  </h2>


                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-500
                    "
                  >
                    Generated by Nyxora AI
                  </p>

                </div>

              </div>


              {/* ACTIONS */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <button
                  type="button"
                  onClick={
                    saveToWorkspace
                  }
                  disabled={
                    saved
                  }
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-300

                    ${
                      saved
                        ? `
                          cursor-default
                          border-emerald-400/15
                          bg-emerald-500/[0.07]
                          text-emerald-300
                        `
                        : `
                          border-emerald-400/20
                          bg-emerald-500/[0.08]
                          text-emerald-300
                          hover:border-emerald-400/35
                          hover:bg-emerald-500/[0.13]
                        `
                    }
                  `}
                >

                  {saved ? (
                    <Check
                      size={16}
                    />
                  ) : (
                    <Save
                      size={16}
                    />
                  )}

                  {saved
                    ? "Saved to Workspace"
                    : "Save to Workspace"}

                </button>


                <button
                  type="button"
                  onClick={
                    exportPDF
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-violet-400/20
                    bg-violet-500/[0.08]
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-violet-300
                    transition-all
                    duration-300
                    hover:border-violet-400/35
                    hover:bg-violet-500/[0.14]
                    hover:text-violet-200
                  "
                >

                  <Download
                    size={16}
                  />

                  Export PDF

                </button>

              </div>

            </div>


            {/* DOCUMENT */}

            <div
              className="
                relative
                z-10
                px-5
                py-6
                sm:px-7
                lg:px-8
                lg:py-8
              "
            >

              <div
                className="
                  mx-auto
                  max-w-5xl
                  rounded-2xl
                  border
                  border-white/[0.055]
                  bg-[#080C18]/65
                  px-5
                  py-6
                  shadow-[inset_0_1px_0_rgba(255,255,255,.02)]
                  sm:px-7
                  lg:px-9
                  lg:py-8
                "
              >

                <NotesContent
                  content={
                    generatedNotes
                  }
                />

              </div>

            </div>

          </section>

        )}

      </div>

    </main>

  );

}


// ======================================================
// MARKDOWN TABLE HELPERS
// Keeps normal Notes content unchanged while rendering
// Markdown tables as actual tables.
// Every cell still uses InlineText, so the same LaTeX
// renderer is used inside table cells.
// ======================================================

function splitMarkdownTableRow(
  line
) {

  let value =
    String(line || "")
      .trim();

  if (
    value.startsWith("|")
  ) {
    value =
      value.slice(1);
  }

  if (
    value.endsWith("|")
  ) {
    value =
      value.slice(
        0,
        -1
      );
  }

  return value
    .split("|")
    .map(
      cell =>
        cell.trim()
    );
}


function isMarkdownTableSeparator(
  line
) {

  const cells =
    splitMarkdownTableRow(
      line
    );

  if (
    cells.length < 2
  ) {
    return false;
  }

  return cells.every(
    cell =>
      /^:?-{3,}:?$/.test(
        cell
      )
  );
}


function isMarkdownTableHeader(
  lines,
  index
) {

  const current =
    String(
      lines[index] || ""
    ).trim();

  const next =
    String(
      lines[index + 1] || ""
    ).trim();

  return (
    current.startsWith("|") &&
    current.endsWith("|") &&
    isMarkdownTableSeparator(
      next
    )
  );
}


function renderMarkdownTable(
  rows,
  key
) {

  if (
    !rows.length
  ) {
    return null;
  }

  const header =
    rows[0] || [];

  const body =
    rows.slice(1);

  return (

    <div
      key={key}
      className="
        my-5
        w-full
        overflow-x-auto
        rounded-xl
        border
        border-white/[0.10]
      "
    >

      <table
        className="
          w-full
          min-w-[520px]
          border-collapse
          text-left
          text-[14px]
          leading-6
        "
      >

        <thead>

          <tr
            className="
              bg-violet-500/[0.08]
            "
          >

            {
              header.map(
                (
                  cell,
                  cellIndex
                ) => (

                  <th
                    key={
                      key +
                      "-head-" +
                      cellIndex
                    }
                    className="
                      border-b
                      border-white/[0.10]
                      px-4
                      py-3
                      font-semibold
                      text-white
                    "
                  >

                    <InlineText
                      text={cell}
                    />

                  </th>

                )
              )
            }

          </tr>

        </thead>


        <tbody>

          {
            body.map(
              (
                row,
                rowIndex
              ) => {

                const columnCount =
                  header.length;

                const cells = [
                  ...row
                ];

                while (
                  cells.length <
                  columnCount
                ) {
                  cells.push("");
                }

                return (

                  <tr
                    key={
                      key +
                      "-row-" +
                      rowIndex
                    }
                    className="
                      border-b
                      border-white/[0.07]
                      last:border-b-0
                    "
                  >

                    {
                      cells
                        .slice(
                          0,
                          columnCount
                        )
                        .map(
                          (
                            cell,
                            cellIndex
                          ) => (

                            <td
                              key={
                                key +
                                "-cell-" +
                                rowIndex +
                                "-" +
                                cellIndex
                              }
                              className="
                                border-r
                                border-white/[0.07]
                                px-4
                                py-3
                                align-top
                                text-slate-300
                                last:border-r-0
                              "
                            >

                              <InlineText
                                text={cell}
                              />

                            </td>

                          )
                        )
                    }

                  </tr>

                );

              }
            )
          }

        </tbody>

      </table>

    </div>

  );
}


// ======================================================
// NOTES CONTENT
// Lightweight Markdown-style renderer
// No extra package required.
// ======================================================

function NotesContent({
  content,
}) {

  const lines =
    String(content || "")
      .replace(/\r/g, "")
      .split("\n");

  const tableRows =
    new Set();

  const tableStarts =
    new Map();

  for (
    let i = 0;
    i < lines.length - 1;
    i++
  ) {

    if (
      isMarkdownTableHeader(
        lines,
        i
      )
    ) {

      const rows = [];

      let j = i;

      while (
        j < lines.length
      ) {

        const current =
          String(
            lines[j] || ""
          ).trim();

        if (
          !current.startsWith("|") ||
          !current.endsWith("|")
        ) {
          break;
        }

        if (
          j === i + 1 &&
          isMarkdownTableSeparator(
            current
          )
        ) {
          j++;
          continue;
        }

        if (
          j !== i + 1 &&
          isMarkdownTableSeparator(
            current
          )
        ) {
          j++;
          continue;
        }

        rows.push(
          splitMarkdownTableRow(
            current
          )
        );

        tableRows.add(j);

        j++;
      }

      if (
        rows.length >= 1
      ) {
        tableStarts.set(
          i,
          rows
        );
      }

      i =
        Math.max(
          i,
          j - 1
        );
    }
  }


  return (

    <div
      className="
        text-[15px]
        leading-7
        text-slate-300
      "
    >

      {lines.map(
        (line, index) => {

          const trimmed =
            line.trim();


          // MARKDOWN TABLE

          if (
            tableStarts.has(
              index
            )
          ) {

            return renderMarkdownTable(
              tableStarts.get(
                index
              ),
              "notes-table-" +
                index
            );

          }


          // SKIP TABLE ROWS ALREADY
          // RENDERED BY THE TABLE BLOCK

          if (
            tableRows.has(
              index
            )
          ) {

            return null;

          }


          // EMPTY LINE

          if (!trimmed) {

            return (

              <div
                key={index}
                className="h-3"
              />

            );

          }


          // DIVIDER

          if (
            trimmed === "---" ||
            trimmed === "***"
          ) {

            return (

              <div
                key={index}
                className="
                  my-6
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-white/[0.09]
                  to-transparent
                "
              />

            );

          }


          // H1

          if (
            trimmed.startsWith(
              "# "
            )
          ) {

            return (

              <h1
                key={index}
                className="
                  mb-5
                  mt-1
                  text-2xl
                  font-bold
                  tracking-tight
                  text-white
                  sm:text-3xl
                "
              >

                <InlineText
                  text={
                    trimmed.slice(2)
                  }
                />

              </h1>

            );

          }


          // H2

          if (
            trimmed.startsWith(
              "## "
            )
          ) {

            return (

              <h2
                key={index}
                className="
                  mb-3
                  mt-7
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-semibold
                  text-white
                  sm:text-xl
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-violet-400
                    shadow-[0_0_8px_rgba(167,139,250,.6)]
                  "
                />

                <InlineText
                  text={
                    trimmed.slice(3)
                  }
                />

              </h2>

            );

          }


          // H3

          if (
            trimmed.startsWith(
              "### "
            )
          ) {

            return (

              <h3
                key={index}
                className="
                  mb-2
                  mt-5
                  font-semibold
                  text-violet-200
                "
              >

                <InlineText
                  text={
                    trimmed.slice(4)
                  }
                />

              </h3>

            );

          }


          // BULLET

          if (
            /^[-*]\s+/.test(
              trimmed
            )
          ) {

            return (

              <div
                key={index}
                className="
                  my-1.5
                  flex
                  items-start
                  gap-3
                  pl-1
                "
              >

                <span
                  className="
                    mt-[11px]
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-cyan-400/80
                  "
                />


                <p
                  className="
                    min-w-0
                    text-slate-300
                  "
                >

                  <InlineText
                    text={
                      trimmed.replace(
                        /^[-*]\s+/,
                        ""
                      )
                    }
                  />

                </p>

              </div>

            );

          }


          // NUMBERED LIST

          const numberedMatch =
            trimmed.match(
              /^(\d+)\.\s+(.*)$/
            );


          if (
            numberedMatch
          ) {

            return (

              <div
                key={index}
                className="
                  my-2
                  flex
                  items-start
                  gap-3
                  pl-1
                "
              >

                <span
                  className="
                    mt-0.5
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-violet-400/15
                    bg-violet-500/[0.07]
                    px-1.5
                    text-[11px]
                    font-semibold
                    text-violet-300
                  "
                >
                  {numberedMatch[1]}
                </span>


                <p
                  className="
                    min-w-0
                    flex-1
                    text-slate-300
                  "
                >

                  <InlineText
                    text={
                      numberedMatch[2]
                    }
                  />

                </p>

              </div>

            );

          }


          // NORMAL PARAGRAPH

          return (

            <p
              key={index}
              className="
                my-2
                text-slate-300
              "
            >

              <InlineText
                text={trimmed}
              />

            </p>

          );

        }
      )}

    </div>

  );

}


// ======================================================
// ANSWER KEY LATEX RENDERER
// Uses the SAME LaTeX conversion logic as the Answer Key.
// ======================================================

function replaceBalancedLatexCommand(
  value,
  command,
  replacer
) {
  const prefix = "\\" + command;
  let result = String(value || "");
  let searchFrom = 0;

  while (true) {
    const start = result.indexOf(prefix, searchFrom);

    if (start < 0) {
      break;
    }

    const openBrace = result.indexOf(
      "{",
      start + prefix.length
    );

    if (openBrace < 0) {
      break;
    }

    let depth = 0;
    let closeBrace = -1;

    for (
      let i = openBrace;
      i < result.length;
      i++
    ) {
      if (result[i] === "{") {
        depth++;
      } else if (result[i] === "}") {
        depth--;

        if (depth === 0) {
          closeBrace = i;
          break;
        }
      }
    }

    if (closeBrace < 0) {
      break;
    }

    const content = result.slice(
      openBrace + 1,
      closeBrace
    );

    if (
      command === "frac" ||
      command === "dfrac"
    ) {
      let denominatorStart =
        closeBrace + 1;

      while (
        denominatorStart < result.length &&
        /\s/.test(
          result[denominatorStart]
        )
      ) {
        denominatorStart++;
      }

      if (
        result[denominatorStart] !== "{"
      ) {
        searchFrom =
          closeBrace + 1;
        continue;
      }

      let denominatorDepth = 0;
      let denominatorEnd = -1;

      for (
        let i = denominatorStart;
        i < result.length;
        i++
      ) {
        if (
          result[i] === "{"
        ) {
          denominatorDepth++;
        } else if (
          result[i] === "}"
        ) {
          denominatorDepth--;

          if (
            denominatorDepth === 0
          ) {
            denominatorEnd = i;
            break;
          }
        }
      }

      if (
        denominatorEnd < 0
      ) {
        break;
      }

      const denominator =
        result.slice(
          denominatorStart + 1,
          denominatorEnd
        );

      const replacement =
        replacer(
          content,
          denominator
        );

      result =
        result.slice(
          0,
          start
        ) +
        replacement +
        result.slice(
          denominatorEnd + 1
        );

      searchFrom =
        start +
        replacement.length;

      continue;
    }

    const replacement =
      replacer(content);

    result =
      result.slice(
        0,
        start
      ) +
      replacement +
      result.slice(
        closeBrace + 1
      );

    searchFrom =
      start +
      replacement.length;
  }

  return result;
}


function cleanAnswerKeyText(
  text = ""
) {

  let value =
    String(text || "");

  // Normalize escaped LaTeX commands.
  // This keeps the same Answer Key LaTeX conversion
  // while allowing Notes text such as \\pi / \\theta.
  value =
    value.replace(/\\\\+/g, "\\");

  // Remove markdown
  value =
    value
      .replace(/\*\*/g, "")
      .replace(/\`/g, "");

  // --------------------------------------------------
  // FRACTIONS
  // --------------------------------------------------

  value =
    replaceBalancedLatexCommand(
      value,
      "frac",
      (numerator, denominator) =>
        `${numerator}/${denominator}`
    );

  value =
    replaceBalancedLatexCommand(
      value,
      "dfrac",
      (numerator, denominator) =>
        `${numerator}/${denominator}`
    );

  // --------------------------------------------------
  // SQUARE ROOTS
  // --------------------------------------------------

  value =
    replaceBalancedLatexCommand(
      value,
      "sqrt",
      content =>
        `√(${content})`
    );

  // --------------------------------------------------
  // COMMON LATEX COMMANDS
  // --------------------------------------------------

  value =
    value
      .replace(/\implies/g, "⇒")
      .replace(/\Rightarrow/g, "⇒")
      .replace(/\Longrightarrow/g, "⇒")
      .replace(/\\therefore/g, "∴")
      .replace(/\\because/g, "∵")
      .replace(/\\rightarrow/g, "→")
      .replace(/\\to/g, "→")
      .replace(/\\triangle/g, "△ ")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\angle/g, "∠")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\delta/g, "δ")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\theta/g, "θ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\mu/g, "μ")
      .replace(/\\pi/g, "π")
      .replace(/\\rho/g, "ρ")
      .replace(/\\sigma/g, "σ")
      .replace(/\\phi/g, "φ")
      .replace(/\\psi/g, "ψ")
      .replace(/\\omega/g, "ω")
      .replace(/\\Gamma/g, "Γ")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\Theta/g, "Θ")
      .replace(/\\Lambda/g, "Λ")
      .replace(/\\Pi/g, "Π")
      .replace(/\\Sigma/g, "Σ")
      .replace(/\\Phi/g, "Φ")
      .replace(/\\Psi/g, "Ψ")
      .replace(/\\Omega/g, "Ω")
      .replace(/\\cong/g, "≅")
      .replace(/\\approx/g, "≈")
      .replace(/\\times/g, "×")
      .replace(/\\cdot/g, "·")
      .replace(/\\div/g, "÷")
      .replace(/\\pm/g, "±")
      .replace(/\\leq/g, "≤")
      .replace(/\\le/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\ge/g, "≥")
      .replace(/\\neq/g, "≠")
      .replace(/\\sim/g, "∼")
      .replace(/\\parallel/g, " || ")
      .replace(/\\parallel/g, " || ")
      .replace(/\\perpendicular/g, "⊥")
      .replace(/\\perp/g, "⊥")
      .replace(/\\in/g, "∈")
      .replace(/\\notin/g, "∉");

  // --------------------------------------------------
  // TRIGONOMETRY
  // --------------------------------------------------

  value =
    value
      .replace(/\\tan\b/g, "tan")
      .replace(/\\theta/g, "θ")
      .replace(/\\sin\b/g, "sin")
      .replace(/\\cos\b/g, "cos")
      .replace(/\\cot\b/g, "cot")
      .replace(/\\sec\b/g, "sec")
      .replace(/\\csc\b/g, "csc");

  // --------------------------------------------------
  // TEXT COMMANDS
  // --------------------------------------------------

  value =
    value
      .replace(
        /\\text{([^{}]*)}/g,
        "$1"
      )
      .replace(
        /\\mathrm{([^{}]*)}/g,
        "$1"
      )
      .replace(
        /\\mathbf{([^{}]*)}/g,
        "$1"
      )
      .replace(
        /\\textbf{([^{}]*)}/g,
        "$1"
      )
      .replace(
        /\\textit{([^{}]*)}/g,
        "$1"
      );

  // --------------------------------------------------
  // ANGLES / POWERS
  // --------------------------------------------------

  value =
    value
      .replace(
        /^{([^{}]+)}/g,
        "^$1"
      )
      .replace(
        /\^\\circ/g,
        "°"
      )
      .replace(
        /\^o\b/g,
        "°"
      )
      .replace(
        /\\circ/g,
        "°"
      );

  // --------------------------------------------------
  // LATEX DELIMITERS
  // --------------------------------------------------

  value =
    value
      .replace(/\\left/g, "")
      .replace(/\\right/g, "")
      .replace(/\\\(/g, "")
      .replace(/\\\)/g, "")
      .replace(/\\\[/g, "")
      .replace(/\\\]/g, "")
      .replace(/\$\$/g, "")
      .replace(/\$/g, "")
      .replace(/\\,/g, " ")
      .replace(/\\_/g, "_")
      .replace(/\\ /g, " ");

  // --------------------------------------------------
  // CLEAN SPACING
  // --------------------------------------------------

  value =
    value
      .replace(
        /[ \t]+/g,
        " "
      )
      .replace(
        /[ \t]*\r?\n[ \t]*/g,
        "\n"
      )
      .trim();

  return value;
}


function renderMixedMathText(
  text = ""
) {

  const value =
    String(text || "");

  const mathSymbols =
    /[△⊥∥α-ωΑ-ΩθπμσφψΔΓΣΩ∠∼≅≈≠≤≥±×÷·√∞∴∵→⇒←↔∈∉°]/u;

  const parts =
    value.split(
      /(r_[A-Za-z0-9]+(?:^[A-Za-z0-9]+)?|[A-Za-z]^[A-Za-z0-9]+|[A-Za-z]_[A-Za-z0-9]+|[△⊥∥α-ωΑ-ΩθπμσφψΔΓΣΩ∠∼≅≈≠≤≥±×÷·√∞∴∵→⇒←↔∈∉°])/u
    );

  return parts.map(
    (part, index) => {

      if (!part) {
        return null;
      }

      const subSupMatch =
        part.match(
          /^([A-Za-z])_([A-Za-z0-9]+)\^([A-Za-z0-9]+)$/
        );

      if (subSupMatch) {
        return (
          <span
            key={
              "mixed-math-" +
              index
            }
          >

            <span>
              {subSupMatch[1]}
            </span>

            <sub
              style={{
                fontSize:"0.65em",
                lineHeight:0,
                verticalAlign:"sub"
              }}
            >
              {subSupMatch[2]}
            </sub>

            <sup
              style={{
                fontSize:"0.65em",
                lineHeight:0,
                verticalAlign:"super"
              }}
            >
              {subSupMatch[3]}
            </sup>

          </span>
        );
      }

      const subMatch =
        part.match(
          /^([A-Za-z])_([A-Za-z0-9]+)$/
        );

      if (subMatch) {
        return (
          <span
            key={
              "mixed-math-" +
              index
            }
          >

            <span>
              {subMatch[1]}
            </span>

            <sub
              style={{
                fontSize:"0.65em",
                lineHeight:0,
                verticalAlign:"sub"
              }}
            >
              {subMatch[2]}
            </sub>

          </span>
        );
      }

      const supMatch =
        part.match(
          /^([A-Za-z])\^([A-Za-z0-9]+)$/
        );

      if (supMatch) {
        return (
          <span
            key={
              "mixed-math-" +
              index
            }
          >

            <span>
              {supMatch[1]}
            </span>

            <sup
              style={{
                fontSize:"0.65em",
                lineHeight:0,
                verticalAlign:"super"
              }}
            >
              {supMatch[2]}
            </sup>

          </span>
        );
      }

      let fontFamily =
        "Noto Sans, sans-serif";

      if (
        /[\u0900-\u097F]/u.test(
          part
        )
      ) {
        fontFamily =
          "Noto Sans Devanagari, sans-serif";
      }

      return (
        <span
          key={
            "mixed-math-" +
            index
          }
          style={{
            fontFamily
          }}
        >
          {part}
        </span>
      );
    }
  );
}



// ======================================================
// INLINE MARKDOWN
// Handles **bold** without extra dependencies.
// ======================================================

function InlineText({
  text,
}) {

  const parts =
    String(text)
      .split(
        /(\*\*.*?\*\*)/g
      );

  return (

    <>

      {parts.map(
        (part, index) => {

          if (
            part.startsWith(
              "**"
            ) &&
            part.endsWith(
              "**"
            ) &&
            part.length >= 4
          ) {

            return (

              <strong
                key={index}
                className="
                  font-semibold
                  text-white
                "
              >
                {
                  renderMixedMathText(
                    cleanAnswerKeyText(
                      part.slice(
                        2,
                        -2
                      )
                    )
                  )
                }
              </strong>

            );
          }

          return (
            <span key={index}>
              {
                renderMixedMathText(
                  cleanAnswerKeyText(
                    part
                  )
                )
              }
            </span>
          );
        }
      )}

    </>

  );
}