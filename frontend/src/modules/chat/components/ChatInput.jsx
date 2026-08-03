import {
  useRef,
  useState,
} from "react";

import {
  Send,
  Square,
  X,
  Mic,
  MicOff,
  AlertTriangle,
  FileText,
  File,
  Image as ImageIcon,
} from "lucide-react";

import FileUploadButton from "./FileUploadButton";


export default function ChatInput({
  onSend,
  onStop,
  loading,

  attachmentError = "",

  onClearAttachmentError,
}) {

  const [
    message,
    setMessage,
  ] = useState("");


  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);


  const [
    isListening,
    setIsListening,
  ] = useState(false);


  const recognitionRef =
    useRef(null);


  // ====================================================
  // FILE TYPE HELPERS
  // ====================================================

  const isPdf =
    selectedFile &&
    (
      selectedFile.type ===
        "application/pdf" ||
      selectedFile.name
        ?.toLowerCase()
        .endsWith(".pdf")
    );


  const isImage =
    selectedFile?.type
      ?.startsWith(
        "image/"
      );


  // ====================================================
  // FILE SELECT
  // ====================================================

  const handleFileSelect = (
    file
  ) => {

    if (!file) {

      return;

    }


    // Selecting another file automatically replaces
    // the currently selected attachment.

    setSelectedFile(
      file
    );


    // Clear an error belonging to the previous file.

    onClearAttachmentError?.();

  };


  // ====================================================
  // REMOVE FILE
  // ====================================================

  const removeFile = () => {

    setSelectedFile(
      null
    );


    onClearAttachmentError?.();

  };


  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit =
    async (e) => {

      e?.preventDefault?.();


      if (loading) {

        return;

      }


      if (
        !message.trim() &&
        !selectedFile
      ) {

        return;

      }


      // =================================================
      // KEEP CURRENT VALUES
      //
      // We keep these references because the visible
      // composer will be cleared immediately.
      // =================================================

      const currentMessage =
        message;


      const currentFile =
        selectedFile;


      // =================================================
      // CLEAR COMPOSER IMMEDIATELY
      //
      // The attachment should move into the sent message
      // instead of remaining inside the bottom composer
      // while Nyxora generates its response.
      // =================================================

      setMessage("");


      setSelectedFile(
        null
      );


      onClearAttachmentError?.();


      try {

        const success =
          await onSend({

            message:
              currentMessage,

            file:
              currentFile,

          });


        // ================================================
        // SEND / VALIDATION FAILURE
        //
        // Restore the original prompt and attachment.
        //
        // This is especially important for:
        // - password-protected PDFs
        // - corrupted PDFs
        // - attachment validation failures
        // - AI/server failures returning false
        // ================================================

        if (
          success === false
        ) {

          setMessage(
            currentMessage
          );


          setSelectedFile(
            currentFile
          );

        }

      } catch (error) {

        console.error(
          "Message send error:",
          error
        );


        // ================================================
        // UNEXPECTED FAILURE
        //
        // Restore the unsent content so the user does not
        // lose their prompt or selected attachment.
        // ================================================

        setMessage(
          currentMessage
        );


        setSelectedFile(
          currentFile
        );

      }

    };


  // ====================================================
  // VOICE INPUT
  // ====================================================

  const handleVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );

      return;

    }


    if (isListening) {

      recognitionRef
        .current
        ?.stop();

      return;

    }


    const recognition =
      new SpeechRecognition();


    recognition.continuous =
      false;


    recognition.interimResults =
      true;


    recognition.lang =
      "en-IN";


    recognitionRef.current =
      recognition;


    recognition.onstart = () => {

      setIsListening(
        true
      );

    };


    recognition.onresult = (
      event
    ) => {

      let transcript =
        "";


      for (
        let i =
          event.resultIndex;

        i <
          event.results.length;

        i++
      ) {

        transcript +=
          event.results[
            i
          ][0].transcript;

      }


      setMessage(
        transcript
      );

    };


    recognition.onerror = (
      event
    ) => {

      console.error(
        "Speech recognition error:",
        event.error
      );


      setIsListening(
        false
      );

    };


    recognition.onend = () => {

      setIsListening(
        false
      );


      recognitionRef.current =
        null;

    };


    recognition.start();

  };


  // ====================================================
  // ATTACHMENT ICON
  // ====================================================

  const getAttachmentIcon =
    () => {

      if (isPdf) {

        return (

          <FileText
            size={22}
            className="text-red-400"
          />

        );

      }


      if (isImage) {

        return (

          <ImageIcon
            size={22}
            className="text-violet-400"
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
  // FILE SIZE
  // ====================================================

  const formatFileSize = (
    bytes
  ) => {

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

      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;

    }


    return `${(
      bytes /
      (
        1024 *
        1024
      )
    ).toFixed(1)} MB`;

  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="border-t border-slate-800 bg-[#050816] p-5">


      {/* =============================================== */}
      {/* ATTACHMENT ERROR                               */}
      {/* =============================================== */}

      {attachmentError && (

        <div
          className="
            mb-3
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-amber-500/40
            bg-amber-500/10
            px-4
            py-3
          "
        >

          <AlertTriangle
            size={20}
            className="
              mt-0.5
              shrink-0
              text-amber-400
            "
          />


          <div className="flex-1">

            <p
              className="
                text-sm
                leading-6
                text-amber-200
              "
            >

              {attachmentError}

            </p>

          </div>


          <button
            type="button"

            onClick={
              onClearAttachmentError
            }

            className="
              shrink-0
              text-amber-300
              transition
              hover:text-white
            "

            aria-label="Dismiss attachment warning"

            title="Dismiss warning"
          >

            <X size={18} />

          </button>

        </div>

      )}


      {/* =============================================== */}
      {/* SELECTED FILE                                  */}
      {/* =============================================== */}

      {selectedFile && (

        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
            rounded-xl
            border
            border-slate-700
            bg-[#111827]
            px-4
            py-3
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

              {getAttachmentIcon()}

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

                {selectedFile.name}

              </p>


              <div
                className="
                  mt-1
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  text-xs
                  text-gray-400
                "
              >

                <span>

                  {selectedFile.type ||
                    "Unknown file type"}

                </span>


                {selectedFile.size > 0 && (

                  <>

                    <span>•</span>

                    <span>

                      {formatFileSize(
                        selectedFile.size
                      )}

                    </span>

                  </>

                )}

              </div>

            </div>

          </div>


          {/* REMOVE ATTACHMENT */}

          <button
            type="button"

            onClick={
              removeFile
            }

            className="
              shrink-0
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-white/10
              hover:text-white
            "

            aria-label="Remove attached file"

            title="Remove attachment"
          >

            <X size={18} />

          </button>

        </div>

      )}


      {/* =============================================== */}
      {/* MESSAGE FORM                                   */}
      {/* =============================================== */}

      <form
        onSubmit={
          handleSubmit
        }

        className="
          flex
          items-end
          gap-3
        "
      >


        {/* ADD / REPLACE FILE */}

        <FileUploadButton
          onSelect={
            handleFileSelect
          }
        />


        {/* MESSAGE */}

        <textarea
          rows={1}

          value={
            message
          }

          placeholder={
            isListening

              ? "Listening..."

              : selectedFile

                ? "Ask Nyxora about this file..."

                : "Message Nyxora AI..."
          }

          onChange={(e) => {

            setMessage(
              e.target.value
            );


            if (
              attachmentError
            ) {

              onClearAttachmentError?.();

            }

          }}

          onKeyDown={(e) => {

            if (
              e.key ===
                "Enter" &&
              !e.shiftKey
            ) {

              e.preventDefault();


              handleSubmit(
                e
              );

            }

          }}

          className="
            flex-1
            resize-none
            rounded-2xl
            border
            border-slate-700
            bg-[#111827]
            px-4
            py-3
            text-white
            outline-none
            transition
            placeholder:text-gray-500
            focus:border-violet-500
          "
        />


        {/* ============================================= */}
        {/* VOICE INPUT                                  */}
        {/* ============================================= */}

        <button
          type="button"

          onClick={
            handleVoiceInput
          }

          disabled={
            loading
          }

          className={`
            rounded-xl
            p-3
            text-white
            transition
            ${
              isListening

                ? "bg-red-500 hover:bg-red-600"

                : "bg-slate-700 hover:bg-slate-600"
            }

            ${
              loading

                ? "cursor-not-allowed opacity-50"

                : ""
            }
          `}

          aria-label={
            isListening

              ? "Stop listening"

              : "Start voice input"
          }

          title={
            isListening

              ? "Stop listening"

              : "Voice input"
          }
        >

          {isListening ? (

            <MicOff size={18} />

          ) : (

            <Mic size={18} />

          )}

        </button>


        {/* ============================================= */}
        {/* SEND / STOP                                  */}
        {/* ============================================= */}

        {loading ? (

          <button
            type="button"

            onClick={
              onStop
            }

            className="
              rounded-xl
              bg-red-500
              p-3
              text-white
              transition
              hover:bg-red-600
            "

            aria-label="Stop generating"

            title="Stop generating"
          >

            <Square size={18} />

          </button>

        ) : (

          <button
            type="submit"

            disabled={
              !message.trim() &&
              !selectedFile
            }

            className="
              rounded-xl
              bg-violet-600
              p-3
              text-white
              transition
              hover:bg-violet-500
              disabled:cursor-not-allowed
              disabled:opacity-40
            "

            aria-label="Send message"

            title="Send"
          >

            <Send size={18} />

          </button>

        )}

      </form>

    </div>

  );

}