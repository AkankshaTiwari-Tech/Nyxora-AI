import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Sparkles,
  MoreVertical,
  ChevronDown,
  FileDown,
  Copy,
  Pencil,
  Trash2,
  Eraser,
  X,
  AlertTriangle,
  Check,
} from "lucide-react";

import {
  exportChatAsPdf,
} from "../utils/exportChat";

import {
  copyConversation,
} from "../utils/copyChat";

import WorkspaceContextSelector
  from "./WorkspaceContextSelector";


// ======================================================
// ASSISTANT MODES
// ======================================================

// ======================================================
// ASSISTANT MODES
// ======================================================

const assistantModes = [
  {
    id: "normal",
    label: "Normal Assistant",
    emoji: "💬",
  },
  {
    id: "teacher",
    label: "Teacher Assistant",
    emoji: "🧑‍🏫",
  },
  {
    id: "test",
    label: "Test Generator",
    emoji: "📝",
  },
  {
    id: "homework",
    label: "Homework Creator",
    emoji: "📚",
  },
  {
    id: "report",
    label: "Student Report Analyzer",
    emoji: "📊",
  },
  {
    id: "doubt",
    label: "Doubt Solver",
    emoji: "❓",
  },
  {
    id: "pdf",
    label: "PDF Generator",
    emoji: "📄",
  },
];

// ======================================================
// CHAT HEADER
// ======================================================

export default function ChatHeader({
  selectedMode,
  onModeChange,

  activeChat,
  chatCount = 0,

  onRenameConversation,
  onClearConversation,
  onDeleteConversation,

  isThinking = false,

  classes = [],
  students = [],

  selectedClassId = "",
  selectedStudentId = "",

  onClassChange,
  onStudentChange,

  workspaceLoading = false,
}) {

  // ====================================================
  // MENU STATES
  // ====================================================

  const [
    isModeOpen,
    setIsModeOpen,
  ] = useState(false);

  const [
    isMoreOpen,
    setIsMoreOpen,
  ] = useState(false);


  // ====================================================
  // COPY STATE
  // ====================================================

  const [
    copied,
    setCopied,
  ] = useState(false);


  // ====================================================
  // RENAME STATE
  // ====================================================

  const [
    showRename,
    setShowRename,
  ] = useState(false);

  const [
    renameTitle,
    setRenameTitle,
  ] = useState("");

  const [
    isRenaming,
    setIsRenaming,
  ] = useState(false);

  const [
    renameError,
    setRenameError,
  ] = useState("");


  // ====================================================
  // CLEAR STATE
  // ====================================================

  const [
    showClear,
    setShowClear,
  ] = useState(false);

  const [
    isClearing,
    setIsClearing,
  ] = useState(false);

  const [
    clearError,
    setClearError,
  ] = useState("");


  // ====================================================
  // DELETE STATE
  // ====================================================

  const [
    showDelete,
    setShowDelete,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState("");


  // ====================================================
  // REFS
  // ====================================================

  const modeRef =
    useRef(null);

  const moreRef =
    useRef(null);


  // ====================================================
  // CURRENT MODE
  // ====================================================

  const currentMode =
    assistantModes.find(
      (mode) =>
        mode.id ===
        selectedMode
    ) ||
    assistantModes[0];


  // ====================================================
  // HAS MESSAGES
  // ====================================================

  const hasMessages =
    Array.isArray(
      activeChat?.messages
    ) &&
    activeChat.messages.some(
      (message) =>
        String(
          message?.message ||
          ""
        ).trim() ||
        message?.file
    );


  // ====================================================
  // OUTSIDE CLICK
  // ====================================================

  useEffect(() => {

    const handleOutsideClick =
      (event) => {

        if (
          modeRef.current &&
          !modeRef.current.contains(
            event.target
          )
        ) {

          setIsModeOpen(
            false
          );

        }

        if (
          moreRef.current &&
          !moreRef.current.contains(
            event.target
          )
        ) {

          setIsMoreOpen(
            false
          );

        }

      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // ====================================================
  // ESCAPE MODALS
  // ====================================================

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          event.key !==
          "Escape"
        ) {

          return;

        }


        if (
          isRenaming ||
          isClearing ||
          isDeleting
        ) {

          return;

        }


        setShowRename(
          false
        );

        setShowClear(
          false
        );

        setShowDelete(
          false
        );

        setRenameError(
          ""
        );

        setClearError(
          ""
        );

        setDeleteError(
          ""
        );

      };


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    isRenaming,
    isClearing,
    isDeleting,
  ]);


  // ====================================================
  // MODE
  // ====================================================

  const handleSelectMode = (
    mode
  ) => {

    onModeChange(
      mode.id
    );

    setIsModeOpen(
      false
    );

  };


  const toggleMode = () => {

    setIsModeOpen(
      (current) =>
        !current
    );

    setIsMoreOpen(
      false
    );

  };


  // ====================================================
  // MORE MENU
  // ====================================================

  const toggleMore = () => {

    setIsMoreOpen(
      (current) =>
        !current
    );

    setIsModeOpen(
      false
    );

  };


  // ====================================================
  // EXPORT
  // ====================================================

  const handleExport = () => {

    try {

      if (
        !activeChat ||
        !hasMessages
      ) {

        alert(
          "This conversation has no messages to export."
        );

        return;

      }


      setIsMoreOpen(
        false
      );


      exportChatAsPdf(
        activeChat
      );

    } catch (error) {

      console.error(
        "Export error:",
        error
      );


      alert(
        error?.message ||
        "Nyxora could not export this conversation."
      );

    }

  };


  // ====================================================
  // COPY
  // ====================================================

  const handleCopy =
    async () => {

      try {

        if (
          !activeChat ||
          !hasMessages
        ) {

          return;

        }


        await copyConversation(
          activeChat
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


        setIsMoreOpen(
          false
        );

      } catch (error) {

        console.error(
          "Copy conversation error:",
          error
        );


        alert(
          error?.message ||
          "Nyxora could not copy this conversation."
        );

      }

    };


  // ====================================================
  // OPEN RENAME
  // ====================================================

  const openRename = () => {

    if (
      !activeChat ||
      isThinking
    ) {

      return;

    }


    setRenameTitle(
      activeChat.title ||
      "New Chat"
    );


    setRenameError(
      ""
    );


    setIsMoreOpen(
      false
    );


    setShowRename(
      true
    );

  };


  // ====================================================
  // RENAME
  // ====================================================

  const confirmRename =
    async () => {

      const cleanTitle =
        renameTitle.trim();


      if (!cleanTitle) {

        setRenameError(
          "Conversation name cannot be empty."
        );

        return;

      }


      if (
        typeof onRenameConversation !==
        "function"
      ) {

        return;

      }


      try {

        setIsRenaming(
          true
        );


        setRenameError(
          ""
        );


        const success =
          await onRenameConversation(
            cleanTitle
          );


        if (
          success === false
        ) {

          setRenameError(
            "Could not rename this conversation."
          );

          return;

        }


        setShowRename(
          false
        );

      } catch (error) {

        console.error(
          "Rename conversation error:",
          error
        );


        setRenameError(
          "Could not rename this conversation."
        );

      } finally {

        setIsRenaming(
          false
        );

      }

    };


  // ====================================================
  // CLEAR
  // ====================================================

  const openClear = () => {

    if (
      !activeChat ||
      isThinking
    ) {

      return;

    }


    setClearError(
      ""
    );


    setIsMoreOpen(
      false
    );


    setShowClear(
      true
    );

  };


  const confirmClear =
    async () => {

      if (
        typeof onClearConversation !==
        "function"
      ) {

        return;

      }


      try {

        setIsClearing(
          true
        );


        setClearError(
          ""
        );


        const success =
          await onClearConversation();


        if (
          success === false
        ) {

          setClearError(
            "Could not clear this conversation."
          );

          return;

        }


        setShowClear(
          false
        );

      } catch (error) {

        console.error(
          "Clear conversation error:",
          error
        );


        setClearError(
          "Could not clear this conversation."
        );

      } finally {

        setIsClearing(
          false
        );

      }

    };


  // ====================================================
  // DELETE
  // ====================================================

  const openDelete = () => {

    if (
      !activeChat ||
      isThinking
    ) {

      return;

    }


    setDeleteError(
      ""
    );


    setIsMoreOpen(
      false
    );


    setShowDelete(
      true
    );

  };


  const confirmDelete =
    async () => {

      if (
        chatCount <= 1
      ) {

        setDeleteError(
          "Nyxora must keep at least one conversation."
        );

        return;

      }


      if (
        typeof onDeleteConversation !==
        "function"
      ) {

        return;

      }


      try {

        setIsDeleting(
          true
        );


        setDeleteError(
          ""
        );


        const success =
          await onDeleteConversation();


        if (
          success === false
        ) {

          setDeleteError(
            "Could not delete this conversation."
          );

          return;

        }


        setShowDelete(
          false
        );

      } catch (error) {

        console.error(
          "Delete conversation error:",
          error
        );


        setDeleteError(
          "Could not delete this conversation."
        );

      } finally {

        setIsDeleting(
          false
        );

      }

    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <>

      <header
        className="
          relative
          z-40
          flex
          h-20
          items-center
          justify-between
          overflow-visible
          border-b
          border-white/[0.07]
          bg-[#050816]/95
          px-8
          backdrop-blur-xl
        "
      >

        {/* BACKGROUND AESTHETIC */}

        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            h-full
            w-[420px]
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              -left-24
              -top-24
              h-52
              w-52
              rounded-full
              bg-violet-600/10
              blur-[70px]
            "
          />

          <div
            className="
              absolute
              left-32
              -top-24
              h-48
              w-48
              rounded-full
              bg-cyan-500/[0.07]
              blur-[75px]
            "
          />

        </div>


        {/* LEFT */}

        <div className="relative flex items-center gap-4">

          <NyxoraChatLogo />


          <div>

            <div className="flex items-center gap-2">

              <h2
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >

                Nyxora AI

              </h2>


              <span
                className="
                  hidden
                  rounded-full
                  border
                  border-violet-400/20
                  bg-violet-500/10
                  px-2
                  py-0.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-violet-300
                  xl:inline-flex
                "
              >

                Assistant

              </span>

            </div>


            <p
              className="
                mt-0.5
                flex
                items-center
                gap-2
                text-sm
                text-emerald-400
              "
            >

              <span className="relative flex h-2 w-2">

                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-emerald-400
                    opacity-50
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-400
                  "
                />

              </span>


              <Sparkles size={13} />

              Online

            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="relative flex items-center gap-3">


          {/* =========================================== */}
          {/* WORKSPACE CONTEXT                           */}
          {/* =========================================== */}

          {!workspaceLoading && (

            <div
              className="
                rounded-xl
                transition
                duration-300
                hover:shadow-[0_0_25px_rgba(99,102,241,0.08)]
              "
            >

              <WorkspaceContextSelector
                classes={
                  classes
                }

                students={
                  students
                }

                selectedClassId={
                  selectedClassId
                }

                selectedStudentId={
                  selectedStudentId
                }

                onClassChange={
                  onClassChange
                }

                onStudentChange={
                  onStudentChange
                }
              />

            </div>

          )}


          {/* =========================================== */}
          {/* ASSISTANT MODE                              */}
          {/* =========================================== */}

          <div
            ref={
              modeRef
            }

            className="relative"
          >

            <button
              type="button"

              onClick={
                toggleMode
              }

              className="
                group
                relative
                flex
                h-12
                min-w-[225px]
                items-center
                justify-between
                gap-4
                overflow-hidden
                rounded-xl
                border
                border-white/10
                bg-[#0D1322]/90
                px-4
                text-white
                shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                transition-all
                duration-300
                hover:border-violet-400/30
                hover:bg-[#11182A]
                hover:shadow-[0_0_28px_rgba(124,58,237,0.12)]
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-violet-500/[0.06]
                  via-indigo-500/[0.03]
                  to-cyan-400/[0.05]
                  opacity-0
                  transition
                  duration-300
                  group-hover:opacity-100
                "
              />


              <div className="relative flex items-center gap-3">

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/[0.07]
                    bg-white/[0.04]
                    text-lg
                  "
                >

                  {currentMode.emoji}

                </span>


                <span className="font-medium whitespace-nowrap">

                  {currentMode.label}

                </span>

              </div>


              <ChevronDown
                size={18}

                className={`
                  relative
                  text-slate-400
                  transition-transform
                  duration-300
                  ${
                    isModeOpen
                      ? "rotate-180 text-violet-300"
                      : ""
                  }
                `}
              />

            </button>


            {isModeOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-[58px]
                  z-50
                  w-[310px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0B1020]/95
                  p-2
                  shadow-[0_24px_80px_rgba(0,0,0,0.55)]
                  backdrop-blur-2xl
                "
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-violet-500/10
                    blur-[60px]
                  "
                />


                <div
                  className="
                    relative
                    mb-2
                    border-b
                    border-white/[0.06]
                    px-3
                    pb-3
                    pt-2
                  "
                >

                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-slate-500
                    "
                  >

                    Assistant Mode

                  </p>

                </div>


                {assistantModes.map(
                  (mode) => {

                    const selected =
                      mode.id ===
                      currentMode.id;


                    return (

                      <button
                        key={
                          mode.id
                        }

                        type="button"

                        onClick={() =>
                          handleSelectMode(
                            mode
                          )
                        }

                        className={`
                          relative
                          flex
                          w-full
                          items-center
                          gap-4
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          transition-all
                          duration-200
                          ${
                            selected
                              ? "bg-gradient-to-r from-violet-500/15 via-indigo-500/10 to-cyan-500/[0.07] text-white"
                              : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                          }
                        `}
                      >

                        <span
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            text-lg
                            ${
                              selected
                                ? "border-violet-400/20 bg-violet-500/10"
                                : "border-white/[0.06] bg-white/[0.03]"
                            }
                          `}
                        >

                          {mode.emoji}

                        </span>


                        <span className="flex-1 font-medium">

                          {mode.label}

                        </span>


                        {selected && (

                          <Check
                            size={16}
                            className="text-cyan-300"
                          />

                        )}

                      </button>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* =========================================== */}
          {/* MORE                                        */}
          {/* =========================================== */}

          <div
            ref={
              moreRef
            }

            className="relative"
          >

            <button
              type="button"

              onClick={
                toggleMore
              }

              className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                border
                transition-all
                duration-300
                ${
                  isMoreOpen
                    ? "border-violet-400/30 bg-violet-500/10 shadow-[0_0_24px_rgba(124,58,237,0.12)]"
                    : "border-white/[0.08] bg-[#0D1322] hover:border-violet-400/25 hover:bg-[#12192B]"
                }
              `}
            >

              <MoreVertical
                size={20}
                className={
                  isMoreOpen
                    ? "text-violet-300"
                    : "text-slate-300"
                }
              />

            </button>


            {isMoreOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-[58px]
                  z-50
                  w-[270px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0B1020]/95
                  p-2
                  shadow-[0_24px_80px_rgba(0,0,0,0.55)]
                  backdrop-blur-2xl
                "
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-cyan-500/[0.07]
                    blur-[60px]
                  "
                />


                <div
                  className="
                    relative
                    mb-2
                    border-b
                    border-white/[0.06]
                    px-3
                    pb-3
                    pt-2
                  "
                >

                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-slate-500
                    "
                  >

                    Conversation

                  </p>

                </div>


                <div className="relative">

                  <MenuButton
                    icon={
                      <FileDown
                        size={18}
                        className="text-violet-400"
                      />
                    }

                    title="Export chat"

                    subtitle="Save as PDF"

                    onClick={
                      handleExport
                    }
                  />


                  <MenuButton
                    icon={
                      copied
                        ? (
                            <Check
                              size={18}
                              className="text-emerald-400"
                            />
                          )
                        : (
                            <Copy
                              size={18}
                              className="text-cyan-400"
                            />
                          )
                    }

                    title={
                      copied
                        ? "Copied"
                        : "Copy conversation"
                    }

                    subtitle="Copy as text"

                    onClick={
                      handleCopy
                    }
                  />


                  <MenuButton
                    icon={
                      <Pencil
                        size={18}
                        className="text-amber-400"
                      />
                    }

                    title="Rename conversation"

                    subtitle="Change chat name"

                    onClick={
                      openRename
                    }

                    disabled={
                      isThinking
                    }
                  />


                  <div className="my-2 border-t border-white/[0.06]" />


                  <MenuButton
                    icon={
                      <Eraser
                        size={18}
                        className="text-orange-400"
                      />
                    }

                    title="Clear conversation"

                    subtitle={
                      isThinking
                        ? "Wait for Nyxora to finish"
                        : "Remove all messages"
                    }

                    onClick={
                      openClear
                    }

                    disabled={
                      isThinking
                    }

                    danger
                  />


                  <MenuButton
                    icon={
                      <Trash2
                        size={18}
                        className="text-red-400"
                      />
                    }

                    title="Delete conversation"

                    subtitle={
                      chatCount <= 1
                        ? "At least one chat is required"
                        : "Delete chat permanently"
                    }

                    onClick={
                      openDelete
                    }

                    disabled={
                      isThinking
                    }

                    danger
                  />

                </div>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* ================================================= */}
      {/* RENAME MODAL                                      */}
      {/* ================================================= */}

      {showRename && (

        <ModalShell>

          <ModalHeader
            icon={
              <Pencil
                size={21}
                className="text-violet-300"
              />
            }

            title="Rename conversation"

            onClose={() => {

              if (!isRenaming) {

                setShowRename(
                  false
                );

              }

            }}
          />


          <div className="mt-5">

            <label
              className="
                mb-2
                block
                text-xs
                font-medium
                uppercase
                tracking-[0.12em]
                text-slate-500
              "
            >

              Conversation name

            </label>


            <input
              type="text"

              autoFocus

              maxLength={80}

              value={
                renameTitle
              }

              onChange={(event) =>
                setRenameTitle(
                  event.target.value
                )
              }

              onKeyDown={(event) => {

                if (
                  event.key ===
                  "Enter"
                ) {

                  confirmRename();

                }

              }}

              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#070B16]
                px-4
                py-3
                text-white
                outline-none
                transition-all
                duration-300
                placeholder:text-slate-600
                focus:border-violet-400/50
                focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08),0_0_28px_rgba(124,58,237,0.08)]
              "

              placeholder="Conversation name"
            />


            {renameError && (

              <ErrorMessage
                message={
                  renameError
                }
              />

            )}

          </div>


          <ModalActions
            onCancel={() =>
              setShowRename(
                false
              )
            }

            onConfirm={
              confirmRename
            }

            disabled={
              isRenaming
            }

            confirmText={
              isRenaming
                ? "Renaming..."
                : "Rename"
            }
          />

        </ModalShell>

      )}


      {/* ================================================= */}
      {/* CLEAR MODAL                                       */}
      {/* ================================================= */}

      {showClear && (

        <ModalShell>

          <ModalHeader
            icon={
              <AlertTriangle
                size={21}
                className="text-orange-400"
              />
            }

            title="Clear conversation?"

            onClose={() => {

              if (!isClearing) {

                setShowClear(
                  false
                );

              }

            }}
          />


          <p className="mt-5 text-sm leading-6 text-slate-400">

            All messages in this conversation will be
            permanently removed. The conversation itself
            will remain in your chat history.

          </p>


          <div
            className="
              mt-4
              rounded-xl
              border
              border-orange-500/15
              bg-orange-500/[0.06]
              px-4
              py-3
            "
          >

            <p className="text-sm font-medium text-orange-300">

              This action cannot be undone.

            </p>

          </div>


          {clearError && (

            <ErrorMessage
              message={
                clearError
              }
            />

          )}


          <ModalActions
            onCancel={() =>
              setShowClear(
                false
              )
            }

            onConfirm={
              confirmClear
            }

            disabled={
              isClearing
            }

            confirmText={
              isClearing
                ? "Clearing..."
                : "Clear conversation"
            }

            danger
          />

        </ModalShell>

      )}


      {/* ================================================= */}
      {/* DELETE MODAL                                      */}
      {/* ================================================= */}

      {showDelete && (

        <ModalShell>

          <ModalHeader
            icon={
              <Trash2
                size={21}
                className="text-red-400"
              />
            }

            title="Delete conversation?"

            onClose={() => {

              if (!isDeleting) {

                setShowDelete(
                  false
                );

              }

            }}
          />


          <p className="mt-5 text-sm leading-6 text-slate-400">

            This will permanently delete this conversation
            and all of its messages from Nyxora.

          </p>


          <div
            className="
              mt-4
              rounded-xl
              border
              border-red-500/15
              bg-red-500/[0.06]
              px-4
              py-3
            "
          >

            <p className="text-sm font-medium text-red-300">

              This action cannot be undone.

            </p>

          </div>


          {deleteError && (

            <ErrorMessage
              message={
                deleteError
              }
            />

          )}


          <ModalActions
            onCancel={() =>
              setShowDelete(
                false
              )
            }

            onConfirm={
              confirmDelete
            }

            disabled={
              isDeleting
            }

            confirmText={
              isDeleting
                ? "Deleting..."
                : "Delete conversation"
            }

            danger
          />

        </ModalShell>

      )}

    </>

  );

}


// ======================================================
// NYXORA CHAT LOGO
//
// New N identity used specifically in AI Chat.
// No image asset required.
// ======================================================

function NyxoraChatLogo() {

  return (

    <div
      className="
        group
        relative
        flex
        h-12
        w-12
        shrink-0
        items-center
        justify-center
      "
    >

      {/* SOFT GLOW */}

      <div
        className="
          absolute
          inset-[-8px]
          rounded-2xl
          bg-gradient-to-br
          from-fuchsia-500/25
          via-violet-500/20
          to-cyan-400/20
          opacity-70
          blur-xl
          transition
          duration-500
          group-hover:opacity-100
        "
      />


      {/* LOGO CARD */}

      <div
        className="
          relative
          flex
          h-12
          w-12
          items-center
          justify-center
          overflow-hidden
          rounded-[14px]
          border
          border-white/15
          bg-[#090D19]
          shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        "
      >

        {/* COLOR LIGHT */}

        <div
          className="
            absolute
            -left-4
            -top-4
            h-10
            w-10
            rounded-full
            bg-fuchsia-500/50
            blur-xl
          "
        />

        <div
          className="
            absolute
            -bottom-4
            -right-4
            h-10
            w-10
            rounded-full
            bg-cyan-400/50
            blur-xl
          "
        />


        {/* N */}

        <svg
          viewBox="0 0 100 100"
          className="relative h-8 w-8"
          aria-hidden="true"
        >

          <defs>

            <linearGradient
              id="nyxora-header-left"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#D946EF"
              />

              <stop
                offset="100%"
                stopColor="#7C3AED"
              />

            </linearGradient>


            <linearGradient
              id="nyxora-header-right"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#22D3EE"
              />

              <stop
                offset="100%"
                stopColor="#2563EB"
              />

            </linearGradient>


            <linearGradient
              id="nyxora-header-middle"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#A855F7"
              />

              <stop
                offset="48%"
                stopColor="#6366F1"
              />

              <stop
                offset="100%"
                stopColor="#06B6D4"
              />

            </linearGradient>

          </defs>


          {/* LEFT STROKE */}

          <path
            d="M18 82 L18 18 L38 18 L38 82 Z"
            fill="url(#nyxora-header-left)"
          />


          {/* RIGHT STROKE */}

          <path
            d="M62 18 L82 18 L82 82 L62 82 Z"
            fill="url(#nyxora-header-right)"
          />


          {/* DIAGONAL */}

          <path
            d="M18 18 L38 18 L82 82 L62 82 Z"
            fill="url(#nyxora-header-middle)"
          />


          {/* LIGHT DETAILS */}

          <path
            d="M24 22 L34 22 L72 77"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M68 22 L76 22 L76 73"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
            fill="none"
          />

        </svg>

      </div>

    </div>

  );

}


// ======================================================
// MENU BUTTON
// ======================================================

function MenuButton({
  icon,
  title,
  subtitle,
  onClick,
  disabled = false,
  danger = false,
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

      className={`
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-left
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${
          danger
            ? "text-red-300 hover:bg-red-500/[0.07]"
            : "text-slate-200 hover:bg-white/[0.05] hover:text-white"
        }
      `}
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
          border
          border-white/[0.06]
          bg-white/[0.03]
          transition
          group-hover:bg-white/[0.05]
        "
      >

        {icon}

      </div>


      <div className="min-w-0">

        <p className="text-sm font-medium">

          {title}

        </p>


        <p className="mt-0.5 truncate text-xs text-slate-500">

          {subtitle}

        </p>

      </div>

    </button>

  );

}


// ======================================================
// MODAL SHELL
// ======================================================

function ModalShell({
  children,
}) {

  return (

    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-[#02040B]/80
        px-4
        backdrop-blur-md
      "
    >

      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-[22px]
          border
          border-white/10
          bg-[#0B1020]/95
          p-6
          shadow-[0_30px_100px_rgba(0,0,0,0.65)]
          backdrop-blur-2xl
        "
      >

        {/* VIOLET GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-violet-600/10
            blur-[70px]
          "
        />


        {/* CYAN GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-20
            h-48
            w-48
            rounded-full
            bg-cyan-500/[0.06]
            blur-[70px]
          "
        />


        {/* TOP NYXORA ACCENT */}

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


        <div className="relative">

          {children}

        </div>

      </div>

    </div>

  );

}


// ======================================================
// MODAL HEADER
// ======================================================

function ModalHeader({
  icon,
  title,
  onClose,
}) {

  return (

    <div className="flex items-start justify-between gap-4">

      <div className="flex items-center gap-3">

        <div
          className="
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-white/[0.08]
            bg-gradient-to-br
            from-violet-500/10
            via-indigo-500/[0.06]
            to-cyan-500/[0.06]
          "
        >

          {icon}

        </div>


        <h3
          className="
            text-xl
            font-semibold
            tracking-tight
            text-white
          "
        >

          {title}

        </h3>

      </div>


      <button
        type="button"

        onClick={
          onClose
        }

        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-transparent
          text-slate-500
          transition-all
          hover:border-white/[0.07]
          hover:bg-white/[0.05]
          hover:text-white
        "
      >

        <X size={18} />

      </button>

    </div>

  );

}


// ======================================================
// MODAL ACTIONS
// ======================================================

function ModalActions({
  onCancel,
  onConfirm,
  disabled,
  confirmText,
  danger = false,
}) {

  return (

    <div className="mt-6 flex justify-end gap-3">

      <button
        type="button"

        onClick={
          onCancel
        }

        disabled={
          disabled
        }

        className="
          rounded-xl
          border
          border-white/10
          bg-white/[0.02]
          px-4
          py-2.5
          text-sm
          font-medium
          text-slate-300
          transition-all
          hover:border-white/15
          hover:bg-white/[0.05]
          hover:text-white
          disabled:opacity-40
        "
      >

        Cancel

      </button>


      <button
        type="button"

        onClick={
          onConfirm
        }

        disabled={
          disabled
        }

        className={`
          relative
          overflow-hidden
          rounded-xl
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:scale-[1.02]
          disabled:opacity-50
          disabled:hover:scale-100
          ${
            danger
              ? "bg-gradient-to-r from-red-600 to-rose-500 shadow-red-900/20 hover:shadow-red-500/20"
              : "bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 shadow-violet-900/30 hover:shadow-violet-500/20"
          }
        `}
      >

        {confirmText}

      </button>

    </div>

  );

}


// ======================================================
// ERROR MESSAGE
// ======================================================

function ErrorMessage({
  message,
}) {

  return (

    <div
      className="
        mt-4
        flex
        items-start
        gap-3
        rounded-xl
        border
        border-red-500/20
        bg-red-500/[0.07]
        px-4
        py-3
        text-sm
        text-red-300
      "
    >

      <AlertTriangle
        size={17}
        className="mt-0.5 shrink-0"
      />


      <span>

        {message}

      </span>

    </div>

  );

}