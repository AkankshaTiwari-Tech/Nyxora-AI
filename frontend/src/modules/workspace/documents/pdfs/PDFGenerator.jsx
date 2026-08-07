import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  BookOpen,
  Download,
  Eye,
  FileDown,
  FileText,
  Layers3,
  RefreshCw,
  Sparkles,
  Type,
} from "lucide-react";

import useWorkspace
  from "../../hooks/useWorkspace";

import {
    createWorkspacePdfUrl,
    downloadWorkspacePdf,
} from "./renderer/generatePdf";


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
  border-white/[0.08]
  bg-[#070B17]/80
  px-4
  py-3.5
  text-sm
  text-white
  outline-none
  transition-all
  duration-300
  placeholder:text-slate-600
  focus:border-violet-400/40
  focus:bg-[#090E1C]
  focus:shadow-[0_0_0_3px_rgba(124,58,237,.06),0_0_25px_rgba(124,58,237,.05)]
`;


// ======================================================
// EDITOR FRIENDLY CONTENT
// ======================================================

function createEditorFriendlyContent(
    content = ""
) {

    return String(content)

        .replace(
            /\r\n/g,
            "\n"
        )

        .trim();

}

// ======================================================
// PDF GENERATOR
// ======================================================

export default function PDFGenerator() {

    const navigate =
    useNavigate();


  // ====================================================
  // GENERATE PDF WITH AI
  // ====================================================

  function handleGenerateWithAI() {

    navigate(
      "/chat",
      {
        state: {
          createNewChat: true,
          assistantMode: "pdf",
          pdfGenerationMode: true,
        },
      }
    );

  }

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
  useMemo(() => {

    console.log(
      "Documents:",
      documents
    );

    console.log(
      "Selected ID:",
      selectedDocumentId
    );

    const found =
      documents.find(
        (document) =>
          document.id ===
          selectedDocumentId
      );

    console.log(
  JSON.stringify(
    found,
    null,
    2
  )
);

    return found || null;

  }, [
    documents,
    selectedDocumentId,
  ]);
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

        console.log(
  "Selected Document:",
  selectedDocument
);

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

  console.log(
    "Selected ID:",
    event.target.value
  );

  console.log(
    "Documents:",
    documents
  );

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
          nyxora-page
          nyxora-grid-bg
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050816]
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >

          <div
            className="
              relative
              flex
              h-12
              w-12
              items-center
              justify-center
            "
          >

            <div
              className="
                absolute
                inset-0
                animate-spin
                rounded-full
                border-2
                border-transparent
                border-r-cyan-400
                border-t-violet-500
              "
            />


            <FileDown
              size={19}
              className="
                text-violet-300
              "
            />

          </div>


          <p
            className="
              mt-4
              text-sm
              font-medium
              text-slate-300
            "
          >
            Loading PDF Generator...
          </p>

        </div>

      </div>

    );

  }


  // ====================================================
  // UI
  // ====================================================

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
          bg-fuchsia-600/[0.045]
          blur-[140px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -right-48
          top-[20%]
          h-[460px]
          w-[460px]
          rounded-full
          bg-violet-600/[0.045]
          blur-[145px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          bottom-[-230px]
          left-[35%]
          h-[480px]
          w-[480px]
          rounded-full
          bg-cyan-500/[0.035]
          blur-[155px]
        "
      />


      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1600px]
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
            lg:px-7
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
              -top-20
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
              via-violet-400/55
              to-transparent
            "
          />


          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div
              className="
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

                <FileDown
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
                    bg-cyan-400
                    shadow-[0_0_10px_rgba(34,211,238,.8)]
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

                  Nyxora Document Tools

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
                  PDF Generator
                </h1>


                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-slate-400
                  "
                >
                  Turn Workspace documents or your own content
                  into clean, downloadable PDF files.
                </p>

              </div>

            </div>


            {/* HEADER ACTIONS */}

            <div
              className="
                flex
                flex-wrap
                items-center
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
                  border-white/[0.08]
                  bg-[#0B1020]/90
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-300
                  transition-all
                  duration-300
                  hover:border-violet-400/30
                  hover:bg-violet-500/[0.06]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {previewing ? (

                  <RefreshCw
                    size={17}
                    className="
                      animate-spin
                    "
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


              <GradientButton
                onClick={
                  handleDownload
                }
                icon={
                  <Download
                    size={17}
                  />
                }
              >
                Download PDF
              </GradientButton>

            </div>

          </div>

        </section>


               {/* ==================================================
            SOURCE SELECTOR
        ================================================== */}

        <div
          className="
            mt-6
            inline-flex
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#090E1C]/90
            p-1.5
            shadow-[0_10px_35px_rgba(0,0,0,.15)]
          "
        >

          <SourceButton
            active={
              sourceMode ===
              "workspace"
            }
            onClick={() =>
              changeSourceMode(
                "workspace"
              )
            }
          >
            <FileText
              size={15}
            />

            Workspace Document
          </SourceButton>


          <SourceButton
            active={
              sourceMode ===
              "custom"
            }
            onClick={() =>
              changeSourceMode(
                "custom"
              )
            }
          >
            <Type
              size={15}
            />

            Custom Content
          </SourceButton>


          <SourceButton
            active={false}
            onClick={
              handleGenerateWithAI
            }
          >
            <Sparkles
              size={15}
            />

            Generate with AI
          </SourceButton>

        </div>

        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div
          className="
            mt-5
            grid
            gap-6
            xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
          "
        >

          {/* ==================================================
              CONTENT EDITOR
          ================================================== */}

          <section
            className="
              relative
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
                -left-20
                -top-20
                h-52
                w-52
                rounded-full
                bg-violet-600/[0.045]
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

              {/* CONTENT HEADER */}

              <div
                className="
                  mb-6
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

                  <FileText
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
                    PDF Content
                  </h2>


                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-500
                    "
                  >
                    Prepare the information that will appear in your document.
                  </p>

                </div>

              </div>


              {/* WORKSPACE SELECTOR */}

              {sourceMode ===
                "workspace" && (

                <label
                  className="
                    mb-5
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
                        mt-2
                        text-xs
                        leading-5
                        text-slate-600
                      "
                    >
                      No Workspace documents yet. Save an AI response
                      to Workspace or use Custom Content.
                    </p>

                  )}

                </label>

              )}


              {/* FORM */}

              <div
                className="
                  space-y-4
                "
              >

                <Field
                  label="PDF Title"
                  icon={
                    FileText
                  }
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
                    icon={
                      Layers3
                    }
                    value={
                      form.type
                    }
                    onChange={(value) =>
                      updateForm(
                        "type",
                        value
                      )
                    }
                    placeholder="Test, Notes, Homework"
                  />


                  <Field
                    label="Subject"
                    icon={
                      BookOpen
                    }
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
                  icon={
                    Sparkles
                  }
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
                      min-h-[420px]
                      resize-y
                      leading-7
                    `}
                  />

                </label>

              </div>

            </div>

          </section>


          {/* ==================================================
              PDF PREVIEW
          ================================================== */}

          <section
            className="
              relative
              flex
              min-h-[700px]
              flex-col
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
                -right-24
                -top-24
                h-56
                w-56
                rounded-full
                bg-cyan-500/[0.035]
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
                via-violet-400/35
                to-transparent
              "
            />


            {/* PREVIEW HEADER */}

            <div
              className="
                relative
                z-10
                flex
                min-h-[72px]
                items-center
                justify-between
                gap-4
                border-b
                border-white/[0.06]
                px-5
                py-4
                sm:px-6
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
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-violet-400/15
                    bg-violet-500/[0.08]
                    text-violet-300
                  "
                >

                  <Eye
                    size={17}
                  />

                </div>


                <div>

                  <h2
                    className="
                      font-semibold
                      text-white
                    "
                  >
                    PDF Preview
                  </h2>


                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-600
                    "
                  >
                    Review your document before downloading.
                  </p>

                </div>

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
                    rounded-lg
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-400
                    transition
                    hover:bg-white/[0.04]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
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


            {/* PREVIEW BODY */}

            {previewUrl ? (

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-1
                  bg-[#070B17]
                  p-3
                  sm:p-4
                "
              >

                <iframe
                  title="Nyxora PDF Preview"
                  src={
                    previewUrl
                  }
                  className="
                    min-h-[650px]
                    w-full
                    flex-1
                    rounded-xl
                    bg-white
                  "
                />

              </div>

            ) : (

              <div
                className="
                  relative
                  z-10
                  flex
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  px-8
                  py-12
                  text-center
                "
              >

                <div
                  className="
                    relative
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-violet-400/15
                    bg-gradient-to-br
                    from-fuchsia-500/[0.07]
                    via-violet-500/[0.12]
                    to-cyan-500/[0.06]
                    text-violet-300
                    shadow-[0_0_35px_rgba(124,58,237,.08)]
                  "
                >

                  <FileDown
                    size={32}
                  />


                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-cyan-400
                      shadow-[0_0_9px_rgba(34,211,238,.8)]
                    "
                  />

                </div>


                <h3
                  className="
                    mt-6
                    text-lg
                    font-semibold
                    text-white
                  "
                >
                  Your PDF preview will appear here
                </h3>


                <p
                  className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Select a Workspace document or enter custom
                  content, then generate a preview to see exactly
                  how your PDF will look.
                </p>


                <div
                  className="
                    mt-6
                  "
                >

                  <GradientButton
                    onClick={
                      handlePreview
                    }
                    disabled={
                      previewing
                    }
                    icon={
                      previewing ? (

                        <RefreshCw
                          size={16}
                          className="
                            animate-spin
                          "
                        />

                      ) : (

                        <Eye
                          size={16}
                        />

                      )
                    }
                  >
                    {previewing
                      ? "Generating..."
                      : "Generate Preview"}
                  </GradientButton>

                </div>

              </div>

            )}

          </section>

        </div>

      </div>

    </main>

  );

}


// ======================================================
// FIELD
// ======================================================

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder = "",
}) {

  return (

    <label
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
        {label}
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

        {Icon && (

          <Icon
            size={16}
            className="
              shrink-0
              text-slate-600
              transition-colors
              duration-300
              group-focus-within:text-violet-300
            "
          />

        )}


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


// ======================================================
// SOURCE BUTTON
// ======================================================

function SourceButton({
  active,
  onClick,
  children,
}) {

  return (

    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        flex
        items-center
        gap-2
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-300

        ${
          active
            ? `
              bg-violet-500/15
              text-violet-200
              shadow-[0_4px_18px_rgba(124,58,237,.08)]
            `
            : `
              text-slate-500
              hover:bg-white/[0.035]
              hover:text-slate-200
            `
        }
      `}
    >
      {children}
    </button>

  );

}


// ======================================================
// GRADIENT BUTTON
// ======================================================

function GradientButton({
  children,
  icon,
  onClick,
  disabled = false,
}) {

  return (

    <button
      type="button"
      onClick={
        onClick
      }
      disabled={
        disabled
      }
      className="
        group
        relative
        flex
        items-center
        justify-center
        gap-2
        overflow-hidden
        rounded-xl
        bg-gradient-to-r
        from-fuchsia-600
        via-violet-600
        to-cyan-500
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-[0_8px_28px_rgba(124,58,237,.20)]
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-[0_10px_36px_rgba(124,58,237,.30)]
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:scale-100
      "
    >

      {/* ANIMATED SHINE */}

      {!disabled && (

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


      <span
        className="
          relative
          z-10
          flex
          items-center
          justify-center
        "
      >
        {icon}
      </span>


      <span
        className="
          relative
          z-10
        "
      >
        {children}
      </span>

    </button>

  );

}