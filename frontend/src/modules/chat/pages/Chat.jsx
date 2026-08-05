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

import {
  saveAiDocument,
} from "../../workspace/services/workspaceService";

import {
  WORKSPACE_DOCUMENT_TYPES,
} from "../../workspace/types/workspaceTypes";


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
    results,

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


  // ====================================================
  // RELEVANT STUDENT RESULTS
  // ====================================================

  const relevantResults =
    results.filter(
      (result) => {

        if (
          selectedStudentId
        ) {

          return (
            result.studentId ===
            selectedStudentId
          );

        }


        if (
          selectedClassId
        ) {

          return (
            result.classId ===
            selectedClassId
          );

        }


        return false;

      }
    );


  // ====================================================
  // WORKSPACE AI CONTEXT
  // ====================================================

  const workspaceContext = {

    class:
      selectedClass,

    student:
      selectedStudent,

    documents:
      relevantDocuments,

    results:
      relevantResults,

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
  // WORKSPACE DOCUMENT TYPE
  // ====================================================

  const getWorkspaceDocumentType =
    () => {

      switch (
        selectedMode
      ) {

        case "test":

          return (
            WORKSPACE_DOCUMENT_TYPES.TEST
          );


        case "homework":

          return (
            WORKSPACE_DOCUMENT_TYPES.HOMEWORK
          );


        case "report":

          return (
            WORKSPACE_DOCUMENT_TYPES.REPORT
          );


        default:

          return (
            WORKSPACE_DOCUMENT_TYPES.NOTES
          );

      }

    };


  // ====================================================
  // WORKSPACE DOCUMENT TITLE
  // ====================================================

  const createWorkspaceTitle =
    (
      content
    ) => {

      const firstLine =
        String(
          content || ""
        )
          .split("\n")
          .map(
            (line) =>
              line.trim()
          )
          .find(
            Boolean
          );


      if (
        firstLine
      ) {

        const cleaned =
          firstLine
            .replace(
              /^#+\s*/,
              ""
            )
            .replace(
              /^\*+|\*+$/g,
              ""
            )
            .trim();


        if (
          cleaned
        ) {

          return cleaned.slice(
            0,
            80
          );

        }

      }


      switch (
        selectedMode
      ) {

        case "test":

          return "AI Generated Test";


        case "homework":

          return "AI Generated Homework";


        case "report":

          return "AI Student Report";


        case "teacher":

          return "Teacher Notes";


        case "doubt":

          return "Doubt Solution";


        default:

          return "AI Generated Notes";

      }

    };


  // ====================================================
  // SAVE AI RESPONSE TO WORKSPACE
  // ====================================================

  const handleSaveToWorkspace =
    async ({
      content,
    }) => {

      const cleanContent =
        String(
          content || ""
        ).trim();


      if (
        !cleanContent
      ) {

        return false;

      }


      try {

        await saveAiDocument({

          title:
            createWorkspaceTitle(
              cleanContent
            ),

          type:
            getWorkspaceDocumentType(),

          content:
            cleanContent,

          classId:
            selectedClassId,

          studentId:
            selectedStudentId,

          subject:
            selectedClass
              ?.subject ||
            "",

          chapter:
            "",

          aiMode:
            selectedMode,

        });


        return true;

      } catch (error) {

        console.error(
          "Save AI response to Workspace error:",
          error
        );


        alert(
          error?.message ||
          "Nyxora could not save this response to Workspace."
        );


        return false;

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
    (msg, index) => {

      const messages =
        activeChat?.messages || [];

      const isLastMessage =
        index ===
        messages.length - 1;

      const isThinkingMessage =
        isThinking &&
        isLastMessage &&
        msg.role === "assistant" &&
        !String(
          msg.message || ""
        ).trim();

      return (

        <ChatMessage
          key={
            msg.id
          }

          message={
            msg
          }

          isThinking={
            isThinkingMessage
          }

          onRegenerate={
            handleRegenerate
          }

          onEdit={
            handleEdit
          }

          onSaveToWorkspace={
            handleSaveToWorkspace
          }
        />

      );

    }
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