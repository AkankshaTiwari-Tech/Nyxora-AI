import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
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

  // ====================================================
  // WORKSPACE CONTEXT
  // ====================================================

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
          h-20
          border-b
          border-[#20263B]
          bg-[#050816]
          flex
          items-center
          justify-between
          px-8
        "
      >

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-indigo-600
            "
          >

            <Bot
              className="text-white"
              size={24}
            />

          </div>


          <div>

            <h2 className="text-xl font-semibold text-white">

              Nyxora AI Assistant

            </h2>


            <p className="flex items-center gap-2 text-sm text-green-400">

              <Sparkles size={14} />

              Online

            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="flex items-center gap-3">


          {/* =========================================== */}
          {/* WORKSPACE CONTEXT                           */}
          {/* =========================================== */}

          {!workspaceLoading && (

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
                flex
                h-12
                min-w-[225px]
                items-center
                justify-between
                gap-4
                rounded-xl
                border
                border-slate-600
                bg-[#111827]
                px-4
                text-white
                transition
                hover:border-violet-500
                hover:bg-[#151D30]
              "
            >

              <div className="flex items-center gap-3">

                <span className="text-xl">

                  {currentMode.emoji}

                </span>


                <span className="font-medium whitespace-nowrap">

                  {currentMode.label}

                </span>

              </div>


              <ChevronDown
                size={18}

                className={`
                  text-gray-400
                  transition-transform
                  ${
                    isModeOpen
                      ? "rotate-180"
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
                  w-[300px]
                  rounded-2xl
                  border
                  border-[#293149]
                  bg-[#111827]
                  p-2
                  shadow-2xl
                "
              >

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
                          flex
                          w-full
                          items-center
                          gap-4
                          rounded-xl
                          px-4
                          py-3
                          text-left
                          transition
                          ${
                            selected
                              ? "bg-violet-600/15 text-violet-300"
                              : "text-gray-200 hover:bg-[#1A2236] hover:text-white"
                          }
                        `}
                      >

                        <span className="w-7 text-center text-xl">

                          {mode.emoji}

                        </span>


                        <span className="font-medium">

                          {mode.label}

                        </span>

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

              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#151B2F]
                transition
                hover:bg-[#1B2340]
              "
            >

              <MoreVertical
                size={20}
                className="text-gray-300"
              />

            </button>


            {isMoreOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-[55px]
                  z-50
                  w-[255px]
                  rounded-xl
                  border
                  border-[#293149]
                  bg-[#111827]
                  p-2
                  shadow-2xl
                "
              >

                {/* EXPORT */}

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


                {/* COPY */}

                <MenuButton
                  icon={
                    copied
                      ? (
                          <Check
                            size={18}
                            className="text-green-400"
                          />
                        )
                      : (
                          <Copy
                            size={18}
                            className="text-blue-400"
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


                {/* RENAME */}

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


                <div className="my-1 border-t border-[#293149]" />


                {/* CLEAR */}

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


                {/* DELETE */}

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
                size={22}
                className="text-violet-400"
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
                border-slate-600
                bg-[#0B1020]
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-violet-500
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
                size={22}
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


          <p className="mt-5 text-sm leading-6 text-gray-400">

            All messages in this conversation will be
            permanently removed. The conversation itself
            will remain in your chat history.

          </p>


          <p className="mt-2 text-sm font-medium text-red-300">

            This action cannot be undone.

          </p>


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
                size={22}
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


          <p className="mt-5 text-sm leading-6 text-gray-400">

            This will permanently delete this conversation
            and all of its messages from Nyxora.

          </p>


          <p className="mt-2 text-sm font-medium text-red-300">

            This action cannot be undone.

          </p>


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
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-3
        text-left
        transition
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${
          danger
            ? "text-red-300 hover:bg-red-500/10"
            : "text-gray-200 hover:bg-[#1A2236] hover:text-white"
        }
      `}
    >

      <div className="shrink-0">

        {icon}

      </div>


      <div>

        <p className="text-sm font-medium">

          {title}

        </p>


        <p className="mt-0.5 text-xs text-gray-500">

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
        bg-black/70
        px-4
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-[#293149]
          bg-[#111827]
          p-6
          shadow-2xl
        "
      >

        {children}

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
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-white/5
          "
        >

          {icon}

        </div>


        <h3 className="text-xl font-semibold text-white">

          {title}

        </h3>

      </div>


      <button
        type="button"

        onClick={
          onClose
        }

        className="
          rounded-lg
          p-2
          text-gray-400
          transition
          hover:bg-white/5
          hover:text-white
        "
      >

        <X size={19} />

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
          border-slate-600
          px-4
          py-2.5
          text-sm
          font-medium
          text-gray-200
          transition
          hover:bg-white/5
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
          rounded-xl
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          disabled:opacity-50
          ${
            danger
              ? "bg-red-500 hover:bg-red-600"
              : "bg-violet-600 hover:bg-violet-700"
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
        rounded-xl
        border
        border-red-500/30
        bg-red-500/10
        px-4
        py-3
        text-sm
        text-red-300
      "
    >

      {message}

    </div>

  );

}