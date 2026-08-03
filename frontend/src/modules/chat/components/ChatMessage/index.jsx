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
} from "lucide-react";

import MessageContent
  from "./MessageContent";

import {
  createWorkspacePdfUrl,
  downloadWorkspacePdf,
} from "../../../workspace/documents/pdfs/generatePdf";

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
            : "justify-start"
        }
      `}
    >

      <div
        className={`
          min-w-0
          ${
            isUser
              ? "max-w-[88%] sm:max-w-[80%]"
              : "w-full max-w-4xl"
          }
        `}
      >

        {/* =============================================
            USER MESSAGE
        ============================================== */}

        {isUser && (

          <div
            className="
              rounded-2xl
              rounded-br-md
              border
              border-violet-400/40
              bg-gradient-to-br
              from-violet-900/60
              via-purple-900/40
              to-slate-900/80
              px-4
              py-3
              text-sm
              leading-6
              text-gray-100
              shadow-lg
              shadow-violet-700/30
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
                      whitespace-pre-wrap
                      break-words
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
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-violet-600
                text-white
                shadow-lg
                shadow-violet-900/40
              "
            >
              <Bot size={18} />
            </div>

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-5
                py-4
                shadow-sm
                flex-1
              "
            >

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
                    gap-1
                  "
                >

                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />

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
                PDF READY CARD
            ========================================== */}

            {pdfRequested &&
              String(
                text || ""
              ).trim() && (

              <div
                className="
                  mt-5
                  overflow-hidden
                  rounded-2xl
                  border
                  border-indigo-500/25
                  bg-gradient-to-br
                  from-indigo-500/[0.10]
                  via-violet-500/[0.05]
                  to-cyan-500/[0.08]
                  shadow-lg
                  shadow-indigo-950/10
                "
              >

                {/* PDF HEADER */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-indigo-500/15
                    px-4
                    py-4
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
                      border-indigo-400/20
                      bg-indigo-500/15
                      text-indigo-300
                    "
                  >

                    <FileText
                      size={21}
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
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      Professional PDF Ready
                    </p>


                    <p
                      className="
                        mt-0.5
                        text-xs
                        leading-5
                        text-gray-400
                      "
                    >
                      Generated with Nyxora&apos;s professional PDF engine.
                    </p>

                  </div>

                </div>


                {/* PDF ACTIONS */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                    p-4
                  "
                >

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
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-indigo-400/25
                      bg-indigo-500/10
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-indigo-200
                      transition
                      hover:border-indigo-400/40
                      hover:bg-indigo-500/20
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {pdfLoadingAction ===
                    "preview" ? (

                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                    ) : (

                      <Eye
                        size={16}
                      />

                    )}

                    Preview PDF

                  </button>


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
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-white
                      shadow-sm
                      transition
                      hover:bg-indigo-500
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {pdfLoadingAction ===
                    "download" ? (

                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                    ) : (

                      <Download
                        size={16}
                      />

                    )}

                    Download PDF

                  </button>

                </div>

              </div>

            )}

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