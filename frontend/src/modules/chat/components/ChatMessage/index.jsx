import {
  useRef,
  useState,
} from "react";

import {
  Copy,
  Check,
  RotateCcw,
  Pencil,
  X,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  FileText,
  File,
  Image as ImageIcon,
  Eye,
  Download,
  Loader2,
  FolderPlus,
  Bot,
  Star,
} from "lucide-react";

import NyxoraOrbitLogo
  from "../../../../components/common/NyxoraOrbitLogo";

import MessageContent
  from "./MessageContent";

import {
    downloadWorkspacePdf
}
from "../../../workspace/documents/pdfs/renderer/generatePdf";

import {
  createChatPdfTitle,
} from "../../utils/pdfIntent";


// ======================================================
// CHAT MESSAGE
// ======================================================

export default function ChatMessage({
  message,
  onRegenerate,
  onEdit,
  onSaveToWorkspace,
  isThinking = false,
}) {

  const {
    id,
    role,
    message: text,
    file,
    pdfRequested = false,
  } = message;


  const isUser =
    role === "user";


  const isAssistant =
    role === "assistant";


  // ====================================================
  // STATE
  // ====================================================

  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    feedback,
    setFeedback,
  ] = useState(null);


  const [
    isFavorite,
    setIsFavorite,
  ] = useState(false);


  const [
    isEditing,
    setIsEditing,
  ] = useState(false);


  const [
    editText,
    setEditText,
  ] = useState(
    text || ""
  );


  const [
    editFile,
    setEditFile,
  ] = useState(null);


  const [
    removeExistingFile,
    setRemoveExistingFile,
  ] = useState(false);


  const [
    pdfLoadingAction,
    setPdfLoadingAction,
  ] = useState(null);


  const editFileInputRef =
    useRef(null);


  // ====================================================
  // FILE HELPERS
  // ====================================================

  const getFileIcon =
    (
      fileData
    ) => {

      const type =
        String(
          fileData?.type || ""
        ).toLowerCase();


      const name =
        String(
          fileData?.name || ""
        ).toLowerCase();


      if (
        type.startsWith(
          "image/"
        )
      ) {

        return ImageIcon;

      }


      if (
        type ===
          "application/pdf" ||
        name.endsWith(
          ".pdf"
        )
      ) {

        return FileText;

      }


      return File;

    };


  const formatFileSize =
    (
      size
    ) => {

      const bytes =
        Number(
          size || 0
        );


      if (!bytes) {

        return "";

      }


      if (
        bytes <
        1024
      ) {

        return `${bytes} B`;

      }


      if (
        bytes <
        1024 * 1024
      ) {

        return `${
          (
            bytes /
            1024
          ).toFixed(1)
        } KB`;

      }


      return `${
        (
          bytes /
          (
            1024 *
            1024
          )
        ).toFixed(1)
      } MB`;

    };


  // ====================================================
  // COPY MESSAGE
  // ====================================================

  const copyMessage =
    async () => {

      const content =
        String(
          text || ""
        );


      if (!content) {

        return;

      }


      try {

        await navigator.clipboard.writeText(
          content
        );


        setCopied(
          true
        );


        window.setTimeout(
          () => {

            setCopied(
              false
            );

          },
          1600
        );

      } catch (error) {

        console.error(
          "Copy message error:",
          error
        );

      }

    };


  // ====================================================
  // START EDIT
  // ====================================================

  const startEditing =
    () => {

      if (
        isThinking
      ) {

        return;

      }


      setEditText(
        text || ""
      );


      setEditFile(
        null
      );


      setRemoveExistingFile(
        false
      );


      setIsEditing(
        true
      );

    };


  // ====================================================
  // CANCEL EDIT
  // ====================================================

  const cancelEditing =
    () => {

      setEditText(
        text || ""
      );


      setEditFile(
        null
      );


      setRemoveExistingFile(
        false
      );


      setIsEditing(
        false
      );


      if (
        editFileInputRef.current
      ) {

        editFileInputRef.current.value =
          "";

      }

    };


  // ====================================================
  // EDIT FILE CHANGE
  // ====================================================

  const handleEditFileChange =
    (
      event
    ) => {

      const selectedFile =
        event.target.files?.[0] ||
        null;


      if (!selectedFile) {

        return;

      }


      setEditFile(
        selectedFile
      );


      setRemoveExistingFile(
        false
      );

    };


  // ====================================================
  // REMOVE FILE WHILE EDITING
  // ====================================================

  const removeEditAttachment =
    () => {

      if (
        editFile
      ) {

        setEditFile(
          null
        );


        if (
          editFileInputRef.current
        ) {

          editFileInputRef.current.value =
            "";

        }


        return;

      }


      if (file) {

        setRemoveExistingFile(
          true
        );

      }

    };


  // ====================================================
  // SAVE EDIT
  // ====================================================

  const saveEdit =
    async () => {

      if (
        !onEdit ||
        isThinking
      ) {

        return;

      }


      const cleanText =
        String(
          editText || ""
        ).trim();


      const hasAttachment =
        Boolean(
          editFile ||
          (
            file &&
            !removeExistingFile
          )
        );


      if (
        !cleanText &&
        !hasAttachment
      ) {

        return;

      }


      setIsEditing(false);

      setEditFile(null);

      setRemoveExistingFile(false);


      await onEdit(
        id,
        cleanText,
        {
          newFile:
            editFile,

          removeFile:
            removeExistingFile,
        }
      );

      setEditFile(null);

      setRemoveExistingFile(false);


      if (
        editFileInputRef.current
      ) {

        editFileInputRef.current.value =
          "";

      }

    };


  const toggleFavorite =
    () => {

      const content =
        String(
          text || ""
        ).trim();


      if (!content) {
        return;
      }


      const saved =
        JSON.parse(
          localStorage.getItem(
            "nyxora_favorites"
          )
        ) || [];


      const exists =
        saved.includes(content);


      const updated =
        exists
          ? saved.filter(
              (item) =>
                item !== content
            )
          : [
              ...saved,
              content,
            ];


      localStorage.setItem(
        "nyxora_favorites",
        JSON.stringify(updated)
      );


      setIsFavorite(
        !exists
      );

    };


  // ====================================================
  // SAVE TO WORKSPACE
  // ====================================================

  const handleSaveToWorkspace =
    () => {

      if (
        !isAssistant ||
        !onSaveToWorkspace
      ) {

        return;

      }


      const content =
        String(
          text || ""
        ).trim();


      if (
        !content
      ) {

        return;

      }


      onSaveToWorkspace({
        messageId:
          id,

        content,

        pdfRequested:
          Boolean(
            pdfRequested
          ),
      });

    };


  // ====================================================
  // PDF DATA
  // ====================================================

  const getPdfData =
    () => {

      const content =
        String(
          text || ""
        ).trim();


      return {

        title:
          createChatPdfTitle(
            content,
            "Nyxora AI Document"
          ),

        type:
          "AI Generated Document",

        subject:
          "",

        chapter:
          "",

        content,

      };

    };


  // ====================================================
  // PREVIEW PDF
  // ====================================================

  const handlePreviewPdf =
    async () => {

      if (
        pdfLoadingAction ||
        !String(
          text || ""
        ).trim()
      ) {

        return;

      }


      let url =
        null;


      try {

        setPdfLoadingAction(
          "preview"
        );


        url =
          await createWorkspacePdfUrl(
            getPdfData()
          );


        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );


        window.setTimeout(
          () => {

            if (url) {

              URL.revokeObjectURL(
                url
              );

            }

          },
          60000
        );

      } catch (error) {

        console.error(
          "Chat PDF preview error:",
          error
        );


        window.alert(
          error?.message ||
          "Nyxora could not generate this PDF."
        );

      } finally {

        setPdfLoadingAction(
          null
        );

      }

    };


  // ====================================================
  // DOWNLOAD PDF
  // ====================================================

  const handleDownloadPdf =
    async () => {

      if (
        pdfLoadingAction ||
        !String(
          text || ""
        ).trim()
      ) {

        return;

      }


      try {

        setPdfLoadingAction(
          "download"
        );


        await downloadWorkspacePdf(
          getPdfData()
        );

      } catch (error) {

        console.error(
          "Chat PDF download error:",
          error
        );


        window.alert(
          error?.message ||
          "Nyxora could not download this PDF."
        );

      } finally {

        setPdfLoadingAction(
          null
        );

      }

    };


  // ====================================================
  // CURRENT EDIT ATTACHMENT
  // ====================================================

  const currentEditAttachment =
    editFile
      ? {
          name:
            editFile.name,

          type:
            editFile.type,

          size:
            editFile.size,
        }

      : (
          file &&
          !removeExistingFile

            ? file

            : null
        );


  // ====================================================
  // MESSAGE ATTACHMENT
  // ====================================================

  const AttachmentIcon =
    getFileIcon(
      file
    );


  const EditAttachmentIcon =
    getFileIcon(
      currentEditAttachment
    );


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
  className={`
    group
    flex
    w-full
    ${
      isUser
        ? "justify-end"
        : "justify-center"
    }
  `}
>

  <div
    className={`
      min-w-0
      ${
        isUser
          ? "max-w-[88%] sm:max-w-[80%]"
          : "w-[82%] max-w-5xl"
      }
    `}
  >

        {/* =============================================
            USER MESSAGE
        ============================================== */}

        {isUser && (

  <div
    className="
      relative
      overflow-hidden
      rounded-2xl
      rounded-br-md

      border
      border-violet-400/35

      bg-gradient-to-br
      from-fuchsia-950/70
      via-violet-950/75
      to-[#071426]/95

      px-5
      py-3.5

      text-sm
      leading-6
      text-slate-100

      shadow-[0_8px_30px_rgba(109,40,217,0.18),0_0_18px_rgba(34,211,238,0.05)]

      transition-all
      duration-300

      hover:border-violet-400/55
      hover:shadow-[0_10px_34px_rgba(109,40,217,0.25),0_0_22px_rgba(34,211,238,0.08)]

      before:pointer-events-none
      before:absolute
      before:inset-x-3
      before:top-0
      before:h-px
      before:bg-gradient-to-r
      before:from-transparent
      before:via-fuchsia-400/70
      before:to-cyan-400/60

      after:pointer-events-none
      after:absolute
      after:-right-10
      after:-top-10
      after:h-24
      after:w-24
      after:rounded-full
      after:bg-cyan-400/[0.06]
      after:blur-2xl
    "
  >
            {isEditing ? (

              <div
                className="
                  space-y-3
                "
              >

                {/* EDIT TEXT */}

                <textarea
                  value={
                    editText
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setEditText(
                        event.target.value
                      )
                  }
                  rows={4}
                  autoFocus
                  className="
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.06]
                    px-3
                    py-2.5
                    text-sm
                    leading-6
                    text-white
                    outline-none
                    transition
                    placeholder:text-gray-500
                    focus:border-indigo-500/60
                    focus:ring-2
                    focus:ring-indigo-500/20
                  "
                />


                {/* EDIT ATTACHMENT */}

                {currentEditAttachment && (

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.05]
                      px-3
                      py-2.5
                    "
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-indigo-500/15
                        text-indigo-300
                      "
                    >

                      <EditAttachmentIcon
                        size={18}
                      />

                    </div>


                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <p
                        className="
                          truncate
                          text-xs
                          font-medium
                          text-gray-200
                        "
                      >
                        {
                          currentEditAttachment.name ||
                          "Attachment"
                        }
                      </p>


                      {formatFileSize(
                        currentEditAttachment.size
                      ) && (

                        <p
                          className="
                            mt-0.5
                            text-[11px]
                            text-gray-500
                          "
                        >
                          {
                            formatFileSize(
                              currentEditAttachment.size
                            )
                          }
                        </p>

                      )}

                    </div>


                    <button
                      type="button"
                      onClick={
                        removeEditAttachment
                      }
                      className="
                        rounded-lg
                        p-1.5
                        text-gray-400
                        transition
                        hover:bg-white/10
                        hover:text-white
                      "
                      title="Remove attachment"
                    >

                      <X
                        size={16}
                      />

                    </button>

                  </div>

                )}


                {/* ATTACH FILE */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                  "
                >

                  <div>

                    <input
                      ref={
                        editFileInputRef
                      }
                      type="file"
                      className="hidden"
                      onChange={
                        handleEditFileChange
                      }
                    />


                    <button
                      type="button"
                      onClick={
                        () =>
                          editFileInputRef
                            .current
                            ?.click()
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-3
                        py-2
                        text-xs
                        text-gray-300
                        transition
                        hover:bg-white/[0.08]
                        hover:text-white
                      "
                    >

                      <Paperclip
                        size={14}
                      />

                      {
                        currentEditAttachment
                          ? "Replace file"
                          : "Attach file"
                      }

                    </button>

                  </div>


                  {/* EDIT ACTIONS */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <button
                      type="button"
                      onClick={
                        cancelEditing
                      }
                      disabled={
                        isThinking
                      }
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-gray-400
                        transition
                        hover:bg-white/10
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Cancel
                    </button>


                    <button
                      type="button"
                      onClick={
                        saveEdit
                      }
                      disabled={
                        isThinking
                      }
                      className="
                        rounded-lg
                        bg-indigo-600
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-white
                        transition
                        hover:bg-indigo-500
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Save & Regenerate
                    </button>

                  </div>

                </div>

              </div>

            ) : (

              <>
                {/* ATTACHMENT */}

                {file && (

                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-white/10
                      bg-black/15
                      px-3
                      py-2.5
                    "
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-indigo-500/15
                        text-indigo-300
                      "
                    >

                      <AttachmentIcon
                        size={18}
                      />

                    </div>


                    <div
                      className="
                        min-w-0
                      "
                    >

                      <p
                        className="
                          truncate
                          text-xs
                          font-medium
                          text-gray-200
                        "
                      >
                        {
                          file.name ||
                          "Attachment"
                        }
                      </p>


                      {formatFileSize(
                        file.size
                      ) && (

                        <p
                          className="
                            mt-0.5
                            text-[11px]
                            text-gray-500
                          "
                        >
                          {
                            formatFileSize(
                              file.size
                            )
                          }
                        </p>

                      )}

                    </div>

                  </div>

                )}


                {/* USER TEXT */}

{text && (

  <div
    className="
      relative
      z-10
      whitespace-pre-wrap
      break-words
      font-medium
      tracking-[0.01em]
    "
  >
    {text}
  </div>

)}

              </>

            )}

          </div>

        )}


        {/* =============================================
            ASSISTANT MESSAGE
        ============================================== */}

        {isAssistant && (

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <div
  className="
    mt-1
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
  "
>
  <NyxoraOrbitLogo
    size={38}
    animated={true}
  />
</div>

            <div
  className="
    relative
    min-w-0
    flex-1
    overflow-hidden
    rounded-2xl
    border
    border-violet-400/20
    bg-gradient-to-br
    from-violet-950/20
    via-[#0B1020]/95
    to-cyan-950/20
    px-5
    py-4
    shadow-[0_10px_40px_rgba(0,0,0,0.18)]
    transition-all
    duration-300
    hover:border-violet-400/30
  "
>
  {/* NYXORA MESSAGE AMBIENT GLOW */}

<div
  className="
    pointer-events-none
    absolute
    -left-20
    -top-20
    h-40
    w-40
    rounded-full
    bg-fuchsia-500/[0.07]
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
    bg-cyan-400/[0.06]
    blur-3xl
  "
/>

{/* NYXORA AI RESPONSE ACCENT */}

<div
  className="
    pointer-events-none
    absolute
    bottom-4
    left-0
    top-4
    w-[2px]
    rounded-full
    bg-gradient-to-b
    from-fuchsia-400
    via-violet-400
    to-cyan-400
    shadow-[0_0_10px_rgba(139,92,246,0.65)]
  "
/>


<div className="relative z-10">

  {isThinking ? (

              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-400
                "
              >

                <div
  className="
    flex
    items-center
    gap-1.5
  "
>

  {/* FUCHSIA */}

  <span
    className="
      h-2
      w-2
      rounded-full
      bg-fuchsia-400
      shadow-[0_0_8px_rgba(232,121,249,.65)]
      animate-bounce
    "
  />


  {/* VIOLET */}

  <span
    className="
      h-2
      w-2
      rounded-full
      bg-violet-400
      shadow-[0_0_8px_rgba(167,139,250,.65)]
      animate-bounce
      [animation-delay:150ms]
    "
  />


  {/* CYAN */}

  <span
    className="
      h-2
      w-2
      rounded-full
      bg-cyan-400
      shadow-[0_0_8px_rgba(34,211,238,.65)]
      animate-bounce
      [animation-delay:300ms]
    "
  />

</div>

                <span>
                  Nyxora AI is thinking...
                </span>

              </div>

            ) : (

              <MessageContent
                message={
                  text
                }
              />

            )}


            {/* =========================================
    PDF READY CARD — NYXORA THEME
========================================== */}

{pdfRequested &&
  String(
    text || ""
  ).trim() && (

  <div
    className="
      relative
      mt-5
      overflow-hidden
      rounded-2xl
      border
      border-violet-400/25
      bg-gradient-to-br
      from-fuchsia-950/25
      via-[#0B1020]/95
      to-cyan-950/25
      shadow-[0_14px_45px_rgba(0,0,0,0.28)]
    "
  >

    {/* AMBIENT GLOW */}

    <div
      className="
        pointer-events-none
        absolute
        -left-16
        -top-16
        h-32
        w-32
        rounded-full
        bg-fuchsia-500/10
        blur-3xl
      "
    />

    <div
      className="
        pointer-events-none
        absolute
        -bottom-16
        right-0
        h-32
        w-32
        rounded-full
        bg-cyan-400/10
        blur-3xl
      "
    />


    {/* TOP ACCENT */}

    <div
      className="
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


    {/* PDF HEADER */}

    <div
      className="
        relative
        z-10
        flex
        items-center
        gap-3
        border-b
        border-white/[0.07]
        px-4
        py-4
      "
    >

      {/* ICON */}

      <div
        className="
          relative
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-violet-400/30
          bg-gradient-to-br
          from-fuchsia-500/20
          via-violet-500/20
          to-cyan-400/15
          text-violet-200
          shadow-[0_0_24px_rgba(139,92,246,0.18)]
        "
      >

        <FileText
          size={21}
        />


        {/* CYAN STATUS DOT */}

        <span
          className="
            absolute
            -right-1
            -top-1
            h-2.5
            w-2.5
            rounded-full
            bg-cyan-400
            shadow-[0_0_10px_rgba(34,211,238,0.9)]
          "
        />

      </div>


      {/* TEXT */}

      <div
        className="
          min-w-0
          flex-1
        "
      >

        <div
          className="
            mb-1
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-fuchsia-300
            "
          >
            ✨ NYXORA PDF ENGINE
          </span>

        </div>


        <p
          className="
            text-sm
            font-semibold
            text-white
          "
        >
          Your PDF is ready
        </p>


        <p
          className="
            mt-0.5
            text-xs
            leading-5
            text-slate-400
          "
        >
          Preview your document or download the final PDF.
        </p>

      </div>

    </div>


    {/* PDF ACTIONS */}

    <div
      className="
        relative
        z-10
        flex
        flex-wrap
        items-center
        gap-3
        p-4
      "
    >

      {/* PREVIEW */}

      <button
        type="button"
        onClick={
          handlePreviewPdf
        }
        disabled={
          Boolean(
            pdfLoadingAction
          )
        }
        className="
          group/pdfpreview
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-violet-400/25
          bg-white/[0.035]
          px-4
          py-2.5
          text-sm
          font-medium
          text-violet-200
          transition-all
          duration-200
          hover:border-violet-400/50
          hover:bg-violet-500/10
          hover:text-white
          hover:shadow-[0_0_22px_rgba(139,92,246,0.14)]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        {pdfLoadingAction ===
        "preview" ? (

          <Loader2
            size={16}
            className="
              animate-spin
              text-cyan-300
            "
          />

        ) : (

          <Eye
            size={16}
            className="
              text-violet-300
              transition
              group-hover/pdfpreview:text-cyan-300
            "
          />

        )}

        Preview PDF

      </button>


      {/* DOWNLOAD */}

      <button
        type="button"
        onClick={
          handleDownloadPdf
        }
        disabled={
          Boolean(
            pdfLoadingAction
          )
        }
        className="
          group/pdfdownload
          relative
          inline-flex
          items-center
          justify-center
          gap-2
          overflow-hidden
          rounded-xl
         
border-white/10
bg-gradient-to-r
from-fuchsia-600
via-violet-600
to-cyan-500
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-[0_0_25px_rgba(139,92,246,0.22)]
          transition-all
          duration-200
          hover:-translate-y-[1px]
          hover:shadow-[0_0_32px_rgba(34,211,238,0.24)]
          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:hover:translate-y-0
        "
      >

        {/* BUTTON SHINE */}

        <span
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-white/0
            via-white/10
            to-white/0
            opacity-0
            transition-opacity
            duration-200
            group-hover/pdfdownload:opacity-100
          "
        />


        {pdfLoadingAction ===
        "download" ? (

          <Loader2
            size={16}
            className="
              relative
              z-10
              animate-spin
            "
          />

        ) : (

          <Download
            size={16}
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
          Download PDF
        </span>

             </button>

    </div>

  </div>

)}

</div>

</div>

</div>

)}

        {/* =============================================
            MESSAGE TOOLBAR
        ============================================== */}
        {!isEditing &&
          String(
            text || ""
          ).trim() && (

          <div
            className={`
              mt-2
              flex
              items-center
              gap-1
              opacity-0
              transition-opacity
              duration-200
              group-hover:opacity-100
              ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }
            `}
          >

            {/* COPY */}

            <button
              type="button"
              onClick={
                copyMessage
              }
              className="
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-white/[0.06]
                hover:text-gray-200
              "
              title="Copy"
            >

              {copied ? (

                <Check
                  size={15}
                  className="
                    text-emerald-400
                  "
                />

              ) : (

                <Copy
                  size={15}
                />

              )}

            </button>


            {/* USER EDIT */}

            {isUser &&
              onEdit && (

              <button
                type="button"
                onClick={
                  startEditing
                }
                disabled={
                  isThinking
                }
                className="
                  rounded-lg
                  p-2
                  text-gray-500
                  transition
                  hover:bg-white/[0.06]
                  hover:text-gray-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                title="Edit message"
              >

                <Pencil
                  size={15}
                />

              </button>

            )}


            {/* ASSISTANT REGENERATE */}

            {isAssistant &&
              onRegenerate && (

              <button
                type="button"
                onClick={
                  onRegenerate
                }
                disabled={
                  isThinking
                }
                className="
                  rounded-lg
                  p-2
                  text-gray-500
                  transition
                  hover:bg-white/[0.06]
                  hover:text-gray-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                title="Regenerate"
              >

                <RotateCcw
                  size={15}
                />

              </button>

            )}


           {/* SAVE TO WORKSPACE */}

{isAssistant &&
  onSaveToWorkspace && (

  <button
    type="button"
    onClick={
      handleSaveToWorkspace
    }
    className="
      inline-flex
      items-center
      gap-1.5
      rounded-lg
      border
      border-violet-500/20
      bg-violet-500/10
      px-3
      py-1.5
      text-xs
      font-medium
      text-violet-300
      transition
      hover:bg-violet-500/20
      hover:text-violet-200
    "
    title="Save AI response to Workspace"
  >

    <FolderPlus
      size={15}
    />

    <span>
      Save to Workspace
    </span>

  </button>

)}

            {/* FAVORITE */}

            {isAssistant && (

              <button
                type="button"
                onClick={toggleFavorite}
                className={`
                  rounded-lg
                  p-2
                  transition
                  ${
                    isFavorite
                      ? "text-yellow-400 bg-yellow-400/10"
                      : "text-gray-500 hover:bg-white/[0.06] hover:text-yellow-400"
                  }
                `}
                title="Add to Favorites"
              >
                <Star size={15} />
              </button>

            )}


            {/* LIKE */}

            <button
              type="button"
              onClick={() =>
                setFeedback(
                  feedback === "like"
                    ? null
                    : "like"
                )
              }
              className={`
                rounded-lg
                p-2
                transition
                ${
                  feedback === "like"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-gray-500 hover:bg-white/[0.06] hover:text-emerald-400"
                }
              `}
              title="Like"
            >
              <ThumbsUp size={15} />
            </button>


            {/* DISLIKE */}

            <button
              type="button"
              onClick={() =>
                setFeedback(
                  feedback === "dislike"
                    ? null
                    : "dislike"
                )
              }
              className={`
                rounded-lg
                p-2
                transition
                ${
                  feedback === "dislike"
                    ? "bg-red-500/20 text-red-400"
                    : "text-gray-500 hover:bg-white/[0.06] hover:text-red-400"
                }
              `}
              title="Dislike"
            >
              <ThumbsDown size={15} />
            </button>


          </div>

        )}

      </div>

    </div>

  );

}