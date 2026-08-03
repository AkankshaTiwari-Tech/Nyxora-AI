import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Download,
  Eye,
  FileDown,
  FileText,
  RefreshCw,
} from "lucide-react";

import useWorkspace
  from "../hooks/useWorkspace";

import {
  createWorkspacePdfUrl,
  downloadWorkspacePdf,
} from "../documents/pdfs/generatePdf";

import {
  cleanMarkdownPreserveMath,
  latexToReadableText,
  tokenizeMathContent,
} from "../documents/pdfs/renderMath";


// ======================================================
// EMPTY FORM
// ======================================================

function createEmptyForm() {

  return {
    title: "",
    type: "",
    subject: "",
    chapter: "",
    content: "",
  };
}


// ======================================================
// INPUT STYLE
// ======================================================

const inputClass = `
  w-full
  rounded-xl
  border
  border-[#303A55]
  bg-[#111827]
  px-4
  py-3
  text-white
  outline-none
  placeholder:text-gray-600
  focus:border-indigo-500
`;


// ======================================================
// EDITOR FRIENDLY CONTENT
//
// IMPORTANT:
//
// Workspace keeps the original AI document unchanged.
//
// This function is ONLY used when loading content into
// the PDF Generator editor.
//
// It removes Markdown formatting and converts LaTeX into
// readable/editable notation.
// ======================================================

function createEditorFriendlyContent(
  value
) {

  const cleaned =
    cleanMarkdownPreserveMath(
      value || ""
    );


  const tokens =
    tokenizeMathContent(
      cleaned
    );


  return tokens
    .map(
      (token) => {

        if (
          token.type ===
          "text"
        ) {

          return token.content;
        }


        let math =
          latexToReadableText(
            token.content
          );


        // Editor cannot visually draw stacked fractions.
        // Convert internal fraction markers to readable
        // fractions such as (1/4).

        math =
          math.replace(
            /\[\[FRAC:([^|\]]+)\|([^\]]+)\]\]/g,
            "($1/$2)"
          );


        // Friendly symbols for editor display.

        math =
          math
            .replace(
              /∠/g,
              "∠"
            )
            .replace(
              /×/g,
              "×"
            )
            .replace(
              /÷/g,
              "÷"
            );


        return math;

      }
    )
    .join("")
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .trim();
}


// ======================================================
// PDF GENERATOR
// ======================================================

export default function PDFGenerator() {

  const {
    documents,
    classes,
    students,
    loading,
  } = useWorkspace();


  // ====================================================
  // SOURCE
  // ====================================================

  const [
    sourceMode,
    setSourceMode,
  ] = useState(
    "workspace"
  );


  const [
    selectedDocumentId,
    setSelectedDocumentId,
  ] = useState(
    ""
  );


  // ====================================================
  // FORM
  // ====================================================

  const [
    form,
    setForm,
  ] = useState(
    createEmptyForm()
  );


  // ====================================================
  // PREVIEW
  // ====================================================

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState(
    ""
  );


  const [
    previewing,
    setPreviewing,
  ] = useState(
    false
  );


  const previewUrlRef =
    useRef(
      ""
    );


  // ====================================================
  // CLASS MAP
  // ====================================================

  const classMap =
    useMemo(
      () =>
        Object.fromEntries(
          classes.map(
            (item) => [
              item.id,
              item,
            ]
          )
        ),
      [
        classes,
      ]
    );


  // ====================================================
  // STUDENT MAP
  // ====================================================

  const studentMap =
    useMemo(
      () =>
        Object.fromEntries(
          students.map(
            (item) => [
              item.id,
              item,
            ]
          )
        ),
      [
        students,
      ]
    );


  // ====================================================
  // SELECTED DOCUMENT
  // ====================================================

  const selectedDocument =
    useMemo(
      () =>
        documents.find(
          (document) =>
            document.id ===
            selectedDocumentId
        ) ||
        null,
      [
        documents,
        selectedDocumentId,
      ]
    );


  // ====================================================
  // DOCUMENT LABEL
  // ====================================================

  function getDocumentLabel(
    document
  ) {

    const className =
      classMap[
        document.classId
      ]?.name;


    const studentName =
      studentMap[
        document.studentId
      ]?.name;


    const details =
      [
        document.type,
        className,
        studentName,
      ]
        .filter(
          Boolean
        )
        .join(
          " • "
        );


    if (
      !details
    ) {

      return (
        document.title ||
        "Untitled Document"
      );
    }


    return `${
      document.title ||
      "Untitled Document"
    } — ${details}`;
  }


  // ====================================================
  // CLEAR PREVIEW
  // ====================================================

  function clearPreview() {

    if (
      previewUrlRef.current
    ) {

      URL.revokeObjectURL(
        previewUrlRef.current
      );


      previewUrlRef.current =
        "";
    }


    setPreviewUrl(
      ""
    );
  }


  // ====================================================
  // CLEANUP
  // ====================================================

  useEffect(
    () => {

      return () => {

        if (
          previewUrlRef.current
        ) {

          URL.revokeObjectURL(
            previewUrlRef.current
          );
        }

      };

    },
    []
  );


  // ====================================================
  // LOAD WORKSPACE DOCUMENT
  //
  // Workspace/Firestore content is NOT modified.
  //
  // Only the PDF editor receives the readable version.
  // ====================================================

  useEffect(
    () => {

      if (
        sourceMode !==
        "workspace"
      ) {

        return;
      }


      if (
        !selectedDocument
      ) {

        setForm(
          createEmptyForm()
        );


        clearPreview();


        return;
      }


      setForm({

        title:
          selectedDocument.title ||
          "",

        type:
          selectedDocument.type ||
          "",

        subject:
          selectedDocument.subject ||
          "",

        chapter:
          selectedDocument.chapter ||
          "",

        content:
          createEditorFriendlyContent(
            selectedDocument.content ||
            ""
          ),

      });


      clearPreview();

    },
    [
      selectedDocument,
      sourceMode,
    ]
  );


  // ====================================================
  // UPDATE FORM
  // ====================================================

  function updateForm(
    key,
    value
  ) {

    clearPreview();


    setForm(
      (current) => ({

        ...current,

        [key]:
          value,

      })
    );
  }


  // ====================================================
  // CHANGE SOURCE MODE
  // ====================================================

  function changeSourceMode(
    mode
  ) {

    if (
      mode ===
      sourceMode
    ) {

      return;
    }


    clearPreview();


    setSourceMode(
      mode
    );


    setSelectedDocumentId(
      ""
    );


    setForm(
      createEmptyForm()
    );
  }


  // ====================================================
  // SELECT WORKSPACE DOCUMENT
  // ====================================================

  function handleDocumentChange(
    event
  ) {

    clearPreview();


    setSelectedDocumentId(
      event.target.value
    );
  }


  // ====================================================
  // VALIDATION
  // ====================================================

  function validateDocument() {

    if (
      !form.title.trim()
    ) {

      alert(
        "Please enter a PDF title."
      );


      return false;
    }


    if (
      !form.content.trim()
    ) {

      alert(
        "Please add content before generating the PDF."
      );


      return false;
    }


    return true;
  }


  // ====================================================
  // PDF DATA
  //
  // IMPORTANT:
  // Pass editor content directly to generatePdf.js.
  //
  // Do not run preparePdfContent here because the PDF
  // generator handles the final rendering itself.
  // ====================================================

  function getPdfData() {

    return {

      title:
        form.title,

      type:
        form.type,

      subject:
        form.subject,

      chapter:
        form.chapter,

      content:
        form.content,

    };
  }


  // ====================================================
  // PREVIEW
  // ====================================================

  async function handlePreview() {

    if (
      !validateDocument()
    ) {

      return;
    }


    try {

      setPreviewing(
        true
      );


      clearPreview();


      const url =
        await createWorkspacePdfUrl(
          getPdfData()
        );


      previewUrlRef.current =
        url;


      setPreviewUrl(
        url
      );

    } catch (
      error
    ) {

      console.error(
        "PDF preview error:",
        error
      );


      alert(
        error?.message ||
        "Nyxora could not generate the PDF preview."
      );

    } finally {

      setPreviewing(
        false
      );

    }

  }


  // ====================================================
  // DOWNLOAD
  // ====================================================

  async function handleDownload() {

    if (
      !validateDocument()
    ) {

      return;
    }


    try {

      await downloadWorkspacePdf(
        getPdfData()
      );

    } catch (
      error
    ) {

      console.error(
        "PDF download error:",
        error
      );


      alert(
        error?.message ||
        "Nyxora could not download the PDF."
      );

    }

  }


  // ====================================================
  // LOADING
  // ====================================================

  if (
    loading
  ) {

    return (

      <div
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          text-gray-400
        "
      >
        Loading PDF Generator.
      </div>

    );

  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="
        mx-auto
        w-full
        max-w-[1500px]
      "
    >

      {/* =============================================== */}
      {/* HEADER */}
      {/* =============================================== */}

      <div
        className="
          mb-7
          flex
          flex-wrap
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
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-indigo-500/10
                text-indigo-400
              "
            >

              <FileDown
                size={22}
              />

            </div>


            <h1
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              PDF Generator
            </h1>

          </div>


          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Turn Workspace documents or custom content into downloadable PDFs.
          </p>

        </div>


        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >

          <button
            type="button"
            onClick={
              handlePreview
            }
            disabled={
              previewing
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#303A55]
              bg-[#111827]
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-200
              transition
              hover:border-indigo-500/60
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {previewing ? (

              <RefreshCw
                size={17}
                className="animate-spin"
              />

            ) : (

              <Eye
                size={17}
              />

            )}


            {previewing
              ? "Generating..."
              : "Preview"}

          </button>


          <button
            type="button"
            onClick={
              handleDownload
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-indigo-500
            "
          >

            <Download
              size={17}
            />

            Download PDF

          </button>

        </div>

      </div>


      {/* =============================================== */}
      {/* SOURCE SELECTOR */}
      {/* =============================================== */}

      <div
        className="
          mb-6
          inline-flex
          rounded-xl
          border
          border-[#293149]
          bg-[#0D1322]
          p-1
        "
      >

        <button
          type="button"
          onClick={() =>
            changeSourceMode(
              "workspace"
            )
          }
          className={`
            rounded-lg
            px-4
            py-2
            text-sm
            font-medium
            transition
            ${
              sourceMode ===
              "workspace"

                ? "bg-indigo-600 text-white"

                : "text-gray-400 hover:text-white"
            }
          `}
        >
          Workspace Document
        </button>


        <button
          type="button"
          onClick={() =>
            changeSourceMode(
              "custom"
            )
          }
          className={`
            rounded-lg
            px-4
            py-2
            text-sm
            font-medium
            transition
            ${
              sourceMode ===
              "custom"

                ? "bg-indigo-600 text-white"

                : "text-gray-400 hover:text-white"
            }
          `}
        >
          Custom Content
        </button>

      </div>


      {/* =============================================== */}
      {/* MAIN GRID */}
      {/* =============================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
        "
      >

        {/* ============================================= */}
        {/* CONTENT EDITOR */}
        {/* ============================================= */}

        <section
          className="
            rounded-2xl
            border
            border-[#242D43]
            bg-[#0D1322]
            p-5
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              gap-2
            "
          >

            <FileText
              size={18}
              className="text-indigo-400"
            />


            <h2
              className="
                font-semibold
                text-white
              "
            >
              PDF Content
            </h2>

          </div>


          {/* =========================================== */}
          {/* WORKSPACE DOCUMENT SELECTOR */}
          {/* =========================================== */}

          {sourceMode ===
            "workspace" && (

            <label
              className="
                mb-5
                block
                space-y-2
              "
            >

              <span
                className="
                  text-sm
                  text-gray-400
                "
              >
                Select Workspace Document
              </span>


              <select
                value={
                  selectedDocumentId
                }
                onChange={
                  handleDocumentChange
                }
                className={
                  inputClass
                }
              >

                <option value="">
                  Select a document
                </option>


                {documents.map(
                  (
                    document
                  ) => (

                    <option
                      key={
                        document.id
                      }
                      value={
                        document.id
                      }
                    >
                      {getDocumentLabel(
                        document
                      )}
                    </option>

                  )
                )}

              </select>


              {documents.length ===
                0 && (

                <p
                  className="
                    text-xs
                    text-gray-600
                  "
                >
                  No Workspace documents yet. Save an AI response to Workspace or use Custom Content.
                </p>

              )}

            </label>

          )}


          {/* =========================================== */}
          {/* FORM */}
          {/* =========================================== */}

          <div
            className="
              space-y-4
            "
          >

            <Field
              label="PDF Title"
              value={
                form.title
              }
              onChange={(value) =>
                updateForm(
                  "title",
                  value
                )
              }
              placeholder="Example: Class 8 Mathematics Test"
            />


            <div
              className="
                grid
                gap-4
                md:grid-cols-2
              "
            >

              <Field
                label="Type"
                value={
                  form.type
                }
                onChange={(value) =>
                  updateForm(
                    "type",
                    value
                  )
                }
                placeholder="Test, Notes, Homework."
              />


              <Field
                label="Subject"
                value={
                  form.subject
                }
                onChange={(value) =>
                  updateForm(
                    "subject",
                    value
                  )
                }
                placeholder="Mathematics"
              />

            </div>


            <Field
              label="Chapter / Topic"
              value={
                form.chapter
              }
              onChange={(value) =>
                updateForm(
                  "chapter",
                  value
                )
              }
              placeholder="Optional"
            />


            <label
              className="
                block
                space-y-2
              "
            >

              <span
                className="
                  text-sm
                  text-gray-400
                "
              >
                Content
              </span>


              <textarea
                rows={18}
                value={
                  form.content
                }
                onChange={(event) =>
                  updateForm(
                    "content",
                    event.target.value
                  )
                }
                placeholder="Enter or edit the content that should appear in the PDF."
                className={`
                  ${inputClass}
                  resize-y
                  leading-7
                `}
              />

            </label>

          </div>

        </section>


        {/* ============================================= */}
        {/* PDF PREVIEW */}
        {/* ============================================= */}

        <section
          className="
            flex
            min-h-[700px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-[#242D43]
            bg-[#0D1322]
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#242D43]
              px-5
              py-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Eye
                size={18}
                className="text-indigo-400"
              />


              <h2
                className="
                  font-semibold
                  text-white
                "
              >
                PDF Preview
              </h2>

            </div>


            {previewUrl && (

              <button
                type="button"
                onClick={
                  handlePreview
                }
                disabled={
                  previewing
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-gray-400
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <RefreshCw
                  size={14}
                  className={
                    previewing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh

              </button>

            )}

          </div>


          {previewUrl ? (

            <iframe
              title="Nyxora PDF Preview"
              src={
                previewUrl
              }
              className="
                min-h-[650px]
                flex-1
                bg-white
              "
            />

          ) : (

            <div
              className="
                flex
                flex-1
                flex-col
                items-center
                justify-center
                px-8
                text-center
              "
            >

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-indigo-500/10
                  text-indigo-400
                "
              >

                <FileDown
                  size={30}
                />

              </div>


              <h3
                className="
                  mt-5
                  font-semibold
                  text-white
                "
              >
                Your PDF preview will appear here
              </h3>


              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Select a Workspace document or enter custom content, then click Preview.
              </p>


              <button
                type="button"
                onClick={
                  handlePreview
                }
                disabled={
                  previewing
                }
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  hover:bg-indigo-500
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {previewing ? (

                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />

                ) : (

                  <Eye
                    size={16}
                  />

                )}

                {previewing
                  ? "Generating..."
                  : "Generate Preview"}

              </button>

            </div>

          )}

        </section>

      </div>

    </div>

  );
}


// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  value,
  onChange,
  placeholder = "",
}) {

  return (

    <label
      className="
        block
        space-y-2
      "
    >

      <span
        className="
          text-sm
          text-gray-400
        "
      >
        {label}
      </span>


      <input
        type="text"
        value={
          value
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        className={
          inputClass
        }
      />

    </label>

  );
}