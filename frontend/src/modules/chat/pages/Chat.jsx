// ======================================================
// IMPORTS
// ======================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

import useChatHistory from "../hooks/useChatHistory";
import useChat from "../hooks/useChat";

import useWorkspace
  from "../../workspace/hooks/useWorkspace";


// ======================================================
// CHAT PAGE
// ======================================================

export default function Chat() {

  const location =
    useLocation();

  const navigate =
    useNavigate();


  // ====================================================
  // ASSISTANT MODE
  // ====================================================

  const [
    selectedMode,
    setSelectedMode,
  ] = useState(
    location.state?.assistantMode ||
    "normal"
  );


  // ====================================================
  // WORKSPACE
  // ====================================================

  const {
    classes,
    students,
    documents,

    loading:
      workspaceLoading,
  } = useWorkspace();


  const [
    selectedClassId,
    setSelectedClassId,
  ] = useState("");


  const [
    selectedStudentId,
    setSelectedStudentId,
  ] = useState("");


  const selectedClass =
    classes.find(
      (item) =>
        item.id ===
        selectedClassId
    ) || null;


  const selectedStudent =
    students.find(
      (item) =>
        item.id ===
        selectedStudentId
    ) || null;


  // ====================================================
  // RELEVANT WORKSPACE DOCUMENTS
  // ====================================================

  const relevantDocuments =
    documents.filter(
      (document) => {

        if (
          selectedStudentId &&
          document.studentId ===
            selectedStudentId
        ) {

          return true;

        }


        if (
          selectedClassId &&
          document.classId ===
            selectedClassId
        ) {

          return true;

        }


        return false;

      }
    );


  const workspaceContext = {

    class:
      selectedClass,

    student:
      selectedStudent,

    documents:
      relevantDocuments,

  };


  // ====================================================
  // CHAT HISTORY
  // ====================================================

  const {
    chats,
    setChats,

    activeChat,
    activeChatId,

    newChat,
    selectChat,
    deleteChat,
    renameChat,

    clearConversation,

    loading:
      chatHistoryLoading,

  } = useChatHistory();


  // ====================================================
  // DASHBOARD NAVIGATION
  // ====================================================

  const dashboardActionHandled =
    useRef(false);


  useEffect(() => {

    if (
      chatHistoryLoading
    ) {

      return;

    }


    if (
      dashboardActionHandled.current
    ) {

      return;

    }


    const shouldCreateChat =
      location.state
        ?.createNewChat ===
      true;


    const requestedMode =
      location.state
        ?.assistantMode;


    if (
      requestedMode
    ) {

      setSelectedMode(
        requestedMode
      );

    }


    if (
      !shouldCreateChat
    ) {

      dashboardActionHandled.current =
        true;

      return;

    }


    dashboardActionHandled.current =
      true;


    async function createDashboardChat() {

      try {

        await newChat();

      } catch (error) {

        console.error(
          "Dashboard new chat error:",
          error
        );

      } finally {

        navigate(
          "/chat",
          {
            replace: true,
          }
        );

      }

    }


    createDashboardChat();

  }, [
    chatHistoryLoading,
    location.state,
    navigate,
    newChat,
  ]);


  // ====================================================
  // CHAT AI
  // ====================================================

  const {
    send,
    regenerate,
    editMessage,
    stop,

    isThinking,

    attachmentError,
    clearAttachmentError,

  } = useChat({

    activeChatId,

    chats,

    setChats,

    selectedMode,

    workspaceContext,

  });


  const bottomRef =
    useRef(null);


  // ====================================================
  // AUTO SCROLL
  // ====================================================

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior:
          "smooth",
      });

  }, [
    activeChat?.messages,
    isThinking,
  ]);


  // ====================================================
  // NEW CHAT
  // ====================================================

  const handleNewChat =
    async () => {

      clearAttachmentError();

      await newChat();

    };


  // ====================================================
  // SELECT CHAT
  // ====================================================

  const handleSelectChat =
    (
      chatId
    ) => {

      clearAttachmentError();

      selectChat(
        chatId
      );

    };


  // ====================================================
  // DELETE CHAT
  // ====================================================

  const handleDeleteChat =
    async (
      chatId
    ) => {

      clearAttachmentError();

      return await deleteChat(
        chatId
      );

    };


  // ====================================================
  // RENAME CHAT
  // ====================================================

  const handleRenameChat =
    async (
      chatId,
      title
    ) => {

      await renameChat(
        chatId,
        title
      );


      return true;

    };


  // ====================================================
  // HEADER RENAME
  // ====================================================

  const handleRenameConversation =
    async (
      title
    ) => {

      if (
        !activeChatId
      ) {

        return false;

      }


      return await handleRenameChat(
        activeChatId,
        title
      );

    };


  // ====================================================
  // HEADER DELETE
  // ====================================================

  const handleDeleteConversation =
    async () => {

      if (
        !activeChatId ||
        chats.length <= 1
      ) {

        return false;

      }


      await handleDeleteChat(
        activeChatId
      );


      return true;

    };


  // ====================================================
  // CLEAR CONVERSATION
  // ====================================================

  const handleClearConversation =
    async () => {

      if (
        !activeChatId
      ) {

        return false;

      }


      clearAttachmentError();


      return await clearConversation(
        activeChatId
      );

    };


  // ====================================================
  // REGENERATE
  // ====================================================

  const handleRegenerate =
    () => {

      regenerate();

    };


  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit =
    (
      messageId,
      newText,
      attachmentOptions
    ) => {

      return editMessage(
        messageId,
        newText,
        attachmentOptions
      );

    };


  // ====================================================
  // CLASS CHANGE
  // ====================================================

  const handleClassChange =
    (
      classId
    ) => {

      setSelectedClassId(
        classId
      );


      if (
        !classId
      ) {

        setSelectedStudentId(
          ""
        );

      }

    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="
        flex
        h-screen
        bg-[#050816]
      "
    >

      <ChatSidebar
        chats={
          chats
        }

        activeChatId={
          activeChatId
        }

        onNewChat={
          handleNewChat
        }

        onSelectChat={
          handleSelectChat
        }

        onDeleteChat={
          handleDeleteChat
        }

        onRenameChat={
          handleRenameChat
        }
      />


      <div
        className="
          flex
          flex-1
          flex-col
          min-w-0
        "
      >

        <ChatHeader
          selectedMode={
            selectedMode
          }

          onModeChange={
            setSelectedMode
          }

          activeChat={
            activeChat
          }

          chatCount={
            chats.length
          }

          onRenameConversation={
            handleRenameConversation
          }

          onClearConversation={
            handleClearConversation
          }

          onDeleteConversation={
            handleDeleteConversation
          }

          isThinking={
            isThinking
          }

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
            handleClassChange
          }

          onStudentChange={
            setSelectedStudentId
          }

          workspaceLoading={
            workspaceLoading
          }
        />


        <div
          className="
            flex-1
            overflow-y-auto
            px-8
            py-8
          "
        >

          {activeChat
            ?.messages
            ?.map(
              (msg) => (

                <ChatMessage
                  key={
                    msg.id
                  }

                  message={
                    msg
                  }

                  onRegenerate={
                    handleRegenerate
                  }

                  onEdit={
                    handleEdit
                  }
                />

              )
            )}


          {isThinking && (

            <ChatMessage
              message={{
                id:
                  "thinking",

                role:
                  "assistant",

                message:
                  "",
              }}

              thinking
            />

          )}


          <div
            ref={
              bottomRef
            }
          />

        </div>


        <ChatInput
          onSend={
            send
          }

          onStop={
            stop
          }

          loading={
            isThinking
          }

          attachmentError={
            attachmentError
          }

          onClearAttachmentError={
            clearAttachmentError
          }
        />

      </div>

    </div>

  );

}