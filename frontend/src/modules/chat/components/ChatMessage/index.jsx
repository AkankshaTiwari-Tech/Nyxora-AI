import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FileText,
  File,
  Image as ImageIcon,
  Paperclip,
  X,
} from "lucide-react";

import MessageAvatar from "./MessageAvatar";
import MessageToolbar from "./MessageToolbar";
import ThinkingIndicator from "./ThinkingIndicator";
import MessageContent from "./MessageContent";


// ======================================================
// CHAT MESSAGE
// ======================================================

export default function ChatMessage({
  message,
  thinking = false,
  onRegenerate,
  onEdit,
}) {

  const {
    id,
    role,
    message: text,
    file,
  } = message;


  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    editing,
    setEditing,
  ] = useState(false);


  const [
    editedText,
    setEditedText,
  ] = useState(text);


  // ====================================================
  // EDIT ATTACHMENT STATE
  //
  // file = metadata belonging to the existing message.
  //
  // editedFile = newly selected browser File.
  //
  // removeExistingFile = whether the old attachment
  // should be removed when Save is pressed.
  // ====================================================

  const [
    editedFile,
    setEditedFile,
  ] = useState(null);


  const [
    removeExistingFile,
    setRemoveExistingFile,
  ] = useState(false);


  const fileInputRef =
    useRef(null);


  // ====================================================
  // SYNC MESSAGE TEXT
  // ====================================================

  useEffect(() => {

    setEditedText(
      text
    );

  }, [text]);


  // ====================================================
  // COPY MESSAGE
  // ====================================================

  const copyMessage =
    async () => {

      try {

        await navigator
          .clipboard
          .writeText(
            text
          );


        setCopied(
          true
        );


        setTimeout(
          () => {

            setCopied(
              false
            );

          },
          2000
        );

      } catch (error) {

        console.error(
          error
        );

      }

    };


  // ====================================================
  // START EDITING
  // ====================================================

  const startEditing = () => {

    setEditedText(
      text
    );


    setEditedFile(
      null
    );


    setRemoveExistingFile(
      false
    );


    setEditing(
      true
    );

  };


  // ====================================================
  // CANCEL EDITING
  // ====================================================

  const cancelEditing = () => {

    setEditedText(
      text
    );


    setEditedFile(
      null
    );


    setRemoveExistingFile(
      false
    );


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }


    setEditing(
      false
    );

  };


  // ====================================================
  // SELECT NEW ATTACHMENT
  // ====================================================

  const handleFileChange = (
    event
  ) => {

    const selected =
      event.target.files?.[0];


    if (!selected) {

      return;

    }


    // New file automatically replaces the old file.

    setEditedFile(
      selected
    );


    setRemoveExistingFile(
      true
    );


    event.target.value =
      "";

  };


  // ====================================================
  // REMOVE ATTACHMENT DURING EDIT
  // ====================================================

  const removeEditAttachment =
    () => {

      // If a newly selected file exists, remove it first.
      //
      // The original attachment stays removed because
      // selecting a replacement already marked it for
      // replacement.

      if (editedFile) {

        setEditedFile(
          null
        );


        setRemoveExistingFile(
          true
        );


        return;

      }


      // Otherwise remove the original message attachment.

      if (file) {

        setRemoveExistingFile(
          true
        );

      }

    };


  // ====================================================
  // SAVE EDIT
  // ====================================================

  const handleSave = async () => {

    const cleanText =
      String(
        editedText || ""
      ).trim();


    // A message is allowed to contain only an attachment.

    const hasAttachment =
      Boolean(
        editedFile ||
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


    const success =
      await onEdit?.(

        id,

        cleanText,

        {
          newFile:
            editedFile,

          removeFile:
            removeExistingFile,
        }

      );


    // Keep edit mode open when attachment validation
    // fails, such as a password-protected PDF.

    if (
      success === false
    ) {

      return;

    }


    setEditing(
      false
    );


    setEditedFile(
      null
    );


    setRemoveExistingFile(
      false
    );

  };


  // ====================================================
  // FILE ICON
  // ====================================================

  const getFileIcon = (
    currentFile
  ) => {

    const type =
      currentFile?.type ||
      "";


    const name =
      currentFile?.name
        ?.toLowerCase() ||
      "";


    if (
      type ===
        "application/pdf" ||
      name.endsWith(
        ".pdf"
      )
    ) {

      return (

        <FileText
          size={22}
          className="text-red-400"
        />

      );

    }


    if (
      type.startsWith(
        "image/"
      )
    ) {

      return (

        <ImageIcon
          size={22}
          className="text-violet-300"
        />

      );

    }


    return (

      <File
        size={22}
        className="text-blue-400"
      />

    );

  };


  // ====================================================
  // CURRENT EDIT ATTACHMENT
  // ====================================================

  const currentEditFile =
    editedFile ||
    (
      file &&
      !removeExistingFile

        ? file

        : null
    );


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className={`flex gap-4 ${
        role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {role === "assistant" && (

        <MessageAvatar
          role={role}
        />

      )}


      <div
        className={`max-w-[85%] rounded-3xl px-6 py-5 shadow-md ${
          role === "assistant"
            ? "bg-[#111827] text-gray-100"
            : "bg-violet-600 text-white"
        }`}
      >

        {thinking ? (

          <ThinkingIndicator />

        ) : editing ? (

          // =================================================
          // EDIT MODE
          // =================================================

          <div className="space-y-4">


            {/* EDIT TEXT */}

            <textarea
              rows={4}

              value={
                editedText
              }

              onChange={(e) =>
                setEditedText(
                  e.target.value
                )
              }

              className="
                w-full
                resize-none
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                p-4
                text-white
                outline-none
                focus:border-violet-400
              "
            />


            {/* ============================================= */}
            {/* CURRENT ATTACHMENT                            */}
            {/* ============================================= */}

            {currentEditFile && (

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-xl
                  border
                  border-white/20
                  bg-black/20
                  p-3
                "
              >

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >

                  <div className="shrink-0">

                    {getFileIcon(
                      currentEditFile
                    )}

                  </div>


                  <div className="min-w-0">

                    <p
                      className="
                        truncate
                        text-sm
                        font-medium
                        text-white
                      "
                    >

                      {currentEditFile.name ||
                        "Attachment"}

                    </p>


                    <p
                      className="
                        truncate
                        text-xs
                        text-white/60
                      "
                    >

                      {currentEditFile.type ||
                        "Unknown file type"}

                    </p>

                  </div>

                </div>


                {/* REMOVE */}

                <button
                  type="button"

                  onClick={
                    removeEditAttachment
                  }

                  className="
                    shrink-0
                    rounded-lg
                    p-2
                    text-white/70
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "

                  title="Remove attachment"

                  aria-label="Remove attachment"
                >

                  <X size={18} />

                </button>

              </div>

            )}


            {/* ============================================= */}
            {/* ADD / REPLACE ATTACHMENT                     */}
            {/* ============================================= */}

            <div>

              <input
                ref={
                  fileInputRef
                }

                type="file"

                className="hidden"

                accept="
                  .pdf,
                  .doc,
                  .docx,
                  .txt,
                  .md,
                  image/png,
                  image/jpeg,
                  image/jpg,
                  image/webp
                "

                onChange={
                  handleFileChange
                }
              />


              <button
                type="button"

                onClick={() =>
                  fileInputRef
                    .current
                    ?.click()
                }

                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/20
                  bg-black/10
                  px-3
                  py-2
                  text-sm
                  text-white
                  transition
                  hover:bg-white/10
                "
              >

                <Paperclip
                  size={17}
                />


                {currentEditFile
                  ? "Replace file"
                  : "Add file"}

              </button>

            </div>


            {/* ============================================= */}
            {/* ACTIONS                                      */}
            {/* ============================================= */}

            <div
              className="
                flex
                justify-end
                gap-3
              "
            >

              <button
                type="button"

                onClick={
                  cancelEditing
                }

                className="
                  rounded-lg
                  border
                  border-slate-600
                  px-4
                  py-2
                  transition
                  hover:bg-white/10
                "
              >

                Cancel

              </button>


              <button
                type="button"

                onClick={
                  handleSave
                }

                className="
                  rounded-lg
                  bg-violet-500
                  px-4
                  py-2
                  transition
                  hover:bg-violet-400
                "
              >

                Save

              </button>

            </div>

          </div>

        ) : (

          // =================================================
          // NORMAL MESSAGE
          // =================================================

          <>

            {file && (

              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-700
                  bg-black/20
                  p-3
                "
              >

                {getFileIcon(
                  file
                )}


                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                    "
                  >

                    {file.name}

                  </p>


                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >

                    {file.type}

                  </p>

                </div>

              </div>

            )}


            <MessageContent
              message={text}
            />


            <MessageToolbar
              copied={copied}

              onCopy={
                copyMessage
              }

              onRegenerate={
                role ===
                  "assistant"

                  ? onRegenerate

                  : undefined
              }

              onEdit={
                role ===
                  "user"

                  ? startEditing

                  : undefined
              }
            />

          </>

        )}

      </div>


      {role === "user" && (

        <MessageAvatar
          role={role}
        />

      )}

    </div>

  );

}