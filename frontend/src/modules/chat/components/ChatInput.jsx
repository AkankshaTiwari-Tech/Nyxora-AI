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
  Sparkles,
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


    setSelectedFile(
      file
    );


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


      const currentMessage =
        message;


      const currentFile =
        selectedFile;


      // Clear composer immediately so the sent content
      // moves into the conversation.

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


        // Restore unsent content if validation or
        // server processing fails.

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
            size={21}
            className="text-rose-300"
          />

        );

      }


      if (isImage) {

        return (

          <ImageIcon
            size={21}
            className="text-fuchsia-300"
          />

        );

      }


      return (

        <File
          size={21}
          className="text-cyan-300"
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

    <div
      className="
        relative
        border-t
        border-white/[0.06]
        bg-[#050816]/95
        px-5
        pb-5
        pt-4
        backdrop-blur-xl
      "
    >


      {/* ==================================================
          AMBIENT BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-32
          w-[65%]
          -translate-x-1/2
          bg-violet-600/[0.055]
          blur-[80px]
        "
      />


      {/* ==================================================
          CONTENT CONTAINER
      ================================================== */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-5xl
        "
      >


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
              border-amber-400/20

              bg-amber-500/[0.07]

              px-4
              py-3

              shadow-[0_8px_30px_rgba(0,0,0,.12)]
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-lg

                border
                border-amber-400/20

                bg-amber-500/10
              "
            >

              <AlertTriangle
                size={17}
                className="
                  text-amber-300
                "
              />

            </div>


            <div className="flex-1">

              <p
                className="
                  pt-1
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
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center

                rounded-lg

                text-amber-300

                transition-all
                duration-200

                hover:bg-amber-400/10
                hover:text-white
              "

              aria-label="Dismiss attachment warning"

              title="Dismiss warning"
            >

              <X size={17} />

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

              overflow-hidden
              rounded-xl

              border
              border-violet-400/[0.14]

              bg-gradient-to-r
              from-violet-500/[0.07]
              via-[#0D1322]
              to-cyan-500/[0.05]

              px-4
              py-3

              shadow-[0_8px_30px_rgba(0,0,0,.15)]
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

              {/* FILE ICON */}

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
                  border-white/[0.07]

                  bg-white/[0.035]
                "
              >

                {getAttachmentIcon()}

              </div>


              {/* FILE INFORMATION */}

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

                    text-[11px]
                    text-slate-500
                  "
                >

                  <span>

                    {selectedFile.type ||
                      "Unknown file type"}

                  </span>


                  {selectedFile.size > 0 && (

                    <>

                      <span
                        className="
                          h-1
                          w-1
                          rounded-full
                          bg-slate-600
                        "
                      />


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
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-lg

                border
                border-transparent

                text-slate-500

                transition-all
                duration-200

                hover:border-white/[0.06]
                hover:bg-white/[0.05]
                hover:text-white
              "

              aria-label="Remove attached file"

              title="Remove attachment"
            >

              <X size={17} />

            </button>

          </div>

        )}


        {/* =============================================== */}
        {/* COMPOSER CARD                                  */}
        {/* =============================================== */}

        <div
          className={`
            group
            relative
            overflow-hidden

            rounded-[22px]

            border

            bg-[#0B1020]/95

            shadow-[0_15px_45px_rgba(0,0,0,.28)]

            transition-all
            duration-300

            ${
              isListening

                ? `
                  border-red-400/30
                  shadow-[0_0_0_1px_rgba(248,113,113,.06),0_0_35px_rgba(239,68,68,.08)]
                `

                : `
                  border-violet-400/[0.14]
                  focus-within:border-violet-400/30
                  focus-within:shadow-[0_0_0_1px_rgba(139,92,246,.06),0_0_40px_rgba(124,58,237,.09)]
                `
            }
          `}
        >


          {/* TOP NYXORA ACCENT */}

          <div
            className="
              pointer-events-none
              absolute
              left-12
              right-12
              top-0
              h-px

              bg-gradient-to-r
              from-transparent
              via-violet-400/45
              to-transparent

              opacity-70
            "
          />


          {/* INNER GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              right-10

              h-36
              w-52

              rounded-full

              bg-cyan-500/[0.035]

              blur-[60px]
            "
          />


          {/* ============================================= */}
          {/* MESSAGE FORM                                  */}
          {/* ============================================= */}

          <form
            onSubmit={
              handleSubmit
            }

            className="
              relative
              flex
              items-end
              gap-2
              p-2.5
            "
          >


            {/* =========================================== */}
            {/* FILE UPLOAD                                 */}
            {/* =========================================== */}

            <div
              className="
                shrink-0
              "
            >

              <FileUploadButton
                onSelect={
                  handleFileSelect
                }
              />

            </div>


            {/* =========================================== */}
            {/* MESSAGE                                     */}
            {/* =========================================== */}

            <textarea
              rows={1}

              value={
                message
              }

              placeholder={
                isListening

                  ? "Listening to you..."

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
                min-h-[46px]
                max-h-40
                flex-1
                resize-none

                bg-transparent

                px-3
                py-3

                text-[15px]
                leading-6
                text-slate-100

                outline-none

                placeholder:text-slate-600
              "
            />


            {/* =========================================== */}
            {/* VOICE INPUT                                 */}
            {/* =========================================== */}

            <button
              type="button"

              onClick={
                handleVoiceInput
              }

              disabled={
                loading
              }

              className={`
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center

                overflow-hidden
                rounded-xl

                border

                transition-all
                duration-300

                ${
                  isListening

                    ? `
                      border-red-400/30
                      bg-red-500/15
                      text-red-300
                      shadow-[0_0_25px_rgba(239,68,68,.12)]
                    `

                    : `
                      border-white/[0.07]
                      bg-white/[0.035]
                      text-slate-400
                      hover:border-violet-400/20
                      hover:bg-violet-500/[0.07]
                      hover:text-violet-300
                    `
                }

                ${
                  loading

                    ? `
                      cursor-not-allowed
                      opacity-40
                    `

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

              {isListening && (

                <span
                  className="
                    absolute
                    inset-0
                    animate-pulse
                    bg-red-400/[0.06]
                  "
                />

              )}


              {isListening ? (

                <MicOff
                  size={18}
                  className="relative"
                />

              ) : (

                <Mic
                  size={18}
                  className="relative"
                />

              )}

            </button>


            {/* =========================================== */}
            {/* SEND / STOP                                 */}
            {/* =========================================== */}

            {loading ? (

  <button
    type="button"
    onClick={onStop}

    style={{
      borderRadius: "9999px",
    }}

    className="
      flex
      h-11
      w-11
      min-h-11
      min-w-11
      shrink-0

      items-center
      justify-center

      rounded-full

      border
      border-red-400/30

      bg-red-500/15

      text-red-400

      shadow-[0_0_18px_rgba(239,68,68,.10)]

      transition-all
      duration-200

      hover:bg-red-500/20
      hover:shadow-[0_0_22px_rgba(239,68,68,.15)]

      active:scale-95
    "

    aria-label="Stop generating"
    title="Stop generating"
  >

    <span
      className="
        h-3
        w-3
        rounded-full
        bg-red-400
      "
    />

  </button>

) : (

              <button
                type="submit"

                disabled={
                  !message.trim() &&
                  !selectedFile
                }

                className="
                  group/send
                  relative
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center

                  overflow-hidden
                  rounded-xl

                  border
                  border-violet-300/20

                  bg-gradient-to-br
                  from-fuchsia-500
                  via-violet-600
                  to-cyan-500

                  text-white

                  shadow-[0_6px_22px_rgba(124,58,237,.25)]

                  transition-all
                  duration-300

                  hover:scale-[1.04]
                  hover:shadow-[0_8px_30px_rgba(124,58,237,.35)]

                  active:scale-[0.97]

                  disabled:cursor-not-allowed
                  disabled:border-white/[0.05]
                  disabled:bg-none
                  disabled:bg-white/[0.04]
                  disabled:text-slate-600
                  disabled:shadow-none
                  disabled:hover:scale-100
                "

                aria-label="Send message"

                title="Send"
              >

                {/* BUTTON GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-gradient-to-br
                    from-white/10
                    to-transparent

                    opacity-0

                    transition-opacity
                    duration-300

                    group-hover/send:opacity-100
                  "
                />


                <Send
                  size={18}
                  className="
                    relative
                    transition-transform
                    duration-300
                    group-hover/send:translate-x-[1px]
                    group-hover/send:-translate-y-[1px]
                  "
                />

              </button>

            )}

          </form>


          {/* ============================================= */}
          {/* COMPOSER FOOTER                               */}
          {/* ============================================= */}

          <div
            className="
              flex
              items-center
              justify-between

              border-t
              border-white/[0.045]

              px-4
              py-2
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Sparkles
                size={11}
                className="
                  text-violet-400
                "
              />


              <span
                className="
                  text-[10px]
                  font-medium
                  tracking-wide
                  text-slate-600
                "
              >

                NYXORA AI

              </span>

            </div>


            <span
              className="
                text-[10px]
                text-slate-600
              "
            >

              Enter to send · Shift + Enter for new line

            </span>

          </div>

        </div>


        {/* ==================================================
            DISCLAIMER
        ================================================== */}

        <p
  className="
    mt-2.5
    text-center
    text-[10px]
    leading-4
    text-slate-700
  "
>

  Nyxora AI can make mistakes. Verify important information.

</p>

      </div>

    </div>

  );

}