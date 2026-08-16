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
  thinkingText,
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
// MODE CHANGE
// ====================================================

const handleModeChange = async (modeId) => {

  clearAttachmentError();

  setSelectedMode(modeId);

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
  // DETECT GENERATED TEST CONTENT
  // ====================================================

  const getWorkspaceDocumentTypeForContent =
    (
      content
    ) => {

      const explicitType =
        getWorkspaceDocumentType();

      if (
        selectedMode !==
        "normal"
      ) {

        return explicitType;

      }

      const cleanContent =
        String(
          content || ""
        )
          .replace(
            /[*_`#>]/g,
            " "
          )
          .replace(
            /\\/g,
            " "
          )
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      if (
        !cleanContent
      ) {

        return explicitType;

      }

      const lowerContent =
        cleanContent.toLowerCase();

      const hasTestTitle =
        /(?:unit\s*(?:test|assessment|exam)|class\s*test|periodic\s*test|question\s*paper|questionnaire|sample\s*paper|practice\s*test|assessment|examination|exam\s*paper|test\s*paper)/i.test(
          cleanContent
        );

      const hasSectionStructure =
        /(?:section\s*[a-d]|खंड\s*['‘“]?[क-घ]['’”]?|खंड\s*[क-घ])/i.test(
          cleanContent
        );

      const hasQuestionNumbering =
        /(?:^|\s)(?:q(?:uestion)?\s*\\d+|प्र\s*\\d+|प्रश्न\s*\\d+|\\d+\s*[.)])(?:\s|$)/i.test(
          cleanContent
        );

      const hasMcqOptions =
        /(?:^|\s)\(?[a-dA-Dक-घ]\)?[.)][ \t]+/.test(
          cleanContent
        );

      const hasMultipleQuestionLines =
        (
          cleanContent.match(
            /(?:^|\s)(?:q(?:uestion)?\s*\\d+|प्र\s*\\d+|प्रश्न\s*\\d+|\\d+\s*[.)])(?:\s|$)/gi
          ) || []
        ).length >= 3;

      const looksLikeTest =
        hasTestTitle ||
        (
          hasSectionStructure &&
          (
            hasQuestionNumbering ||
            hasMcqOptions
          )
        ) ||
        (
          hasMultipleQuestionLines &&
          hasMcqOptions
        );

      if (
        looksLikeTest
      ) {

        return (
          WORKSPACE_DOCUMENT_TYPES.TEST
        );

      }

      return explicitType;

    };


  // ====================================================
  // AI WORKSPACE DOCUMENT METADATA
  // ====================================================

  const getLatestUserMessage = () => {

    const messages =
      activeChat?.messages || [];

    for (
      let index = messages.length - 1;
      index >= 0;
      index -= 1
    ) {

      const message =
        messages[index];

      if (
        message?.role === "user"
      ) {

        return String(
          message?.message ??
          message?.content ??
          ""
        ).trim();

      }

    }

    return "";

  };

  const cleanMetadataText = (
    value
  ) => {

    return String(
      value || ""
    )
      .replace(
        /[*_`#>]/g,
        " "
      )
      .replace(
        /\\/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  };

  const extractMetadataField = (
    text,
    patterns
  ) => {

    const source =
      String(
        text || ""
      );

    for (
      const pattern of patterns
    ) {

      const match =
        source.match(
          pattern
        );

      if (
        match?.[1]
      ) {

        return cleanMetadataText(
          match[1]
        )
          .replace(
            /\s+[-–—:]\s*$/,
            ""
          )
          .trim();

      }

    }

    return "";

  };

  const normalizeClassValue = (
    value
  ) => {

    const cleaned =
      cleanMetadataText(
        value
      )
      .replace(
        /^(?:class|grade|standard|कक्षा|श्रेणी)\s*/i,
        ""
      )
      .trim();

    const romanMap = {
      i: "1",
      ii: "2",
      iii: "3",
      iv: "4",
      v: "5",
      vi: "6",
      vii: "7",
      viii: "8",
      ix: "9",
      x: "10",
      xi: "11",
      xii: "12",
    };

    const roman =
      cleaned.match(
        /^(i{1,3}|iv|vi{0,3}|ix|x|xi|xii)$/i
      );

    if (
      roman?.[1]
    ) {

      return (
        romanMap[
          roman[1].toLowerCase()
        ] ||
        cleaned
      );

    }

    const number =
      cleaned.match(
        /\b(?:1[0-2]|[1-9])\b/
      );

    return (
      number?.[0] ||
      cleaned
    );

  };

  const extractClassValue = (
    text
  ) => {

    const explicit =
      extractMetadataField(
        text,
        [
          /(?:^|\n)\s*(?:class|grade|standard|कक्षा|श्रेणी)\s*[:\-–—]?\s*([0-9]{1,2}|[ivx]{1,4})\b/im,
          /\bclass\s*[:\-–—]?\s*([0-9]{1,2}|[ivx]{1,4})\b/i,
          /\bgrade\s*[:\-–—]?\s*([0-9]{1,2}|[ivx]{1,4})\b/i,
          /\bstandard\s*[:\-–—]?\s*([0-9]{1,2}|[ivx]{1,4})\b/i,
          /कक्षा\s*[:\-–—]?\s*([0-9]{1,2}|[ivx]{1,4})/i,
        ]
      );

    if (
      explicit
    ) {

      return normalizeClassValue(
        explicit
      );

    }

    return "";

  };

  const extractSubjectValue = (
    text
  ) => {

    const explicit =
      extractMetadataField(
        text,
        [
          /(?:^|\n)\s*(?:subject|विषय)\s*[:\-–—]\s*([^\n|]+)/im,
          /\bsubject\s*[:\-–—]\s*([^\n|]+)/i,
          /विषय\s*[:\-–—]\s*([^\n|]+)/i,
        ]
      );

    if (
      explicit
    ) {

      return explicit
        .replace(
          /\b(?:class|grade|chapter|unit|test|exam|assessment)\b.*$/i,
          ""
        )
        .trim();

    }

    const subjects = [
      {
        pattern: /social\s*science|social\s*studies|सामाजिक\s*विज्ञान/i,
        value: "Social Science",
      },
      {
        pattern: /mathematics|maths|math|गणित/i,
        value: "Mathematics",
      },
      {
        pattern: /computer\s*science|computers|कंप्यूटर/i,
        value: "Computer Science",
      },
      {
        pattern: /science|विज्ञान/i,
        value: "Science",
      },
      {
        pattern: /english|अंग्रेज़ी|अंग्रेजी/i,
        value: "English",
      },
      {
        pattern: /hindi|हिंदी/i,
        value: "Hindi",
      },
      {
        pattern: /evs|environmental\s*studies|पर्यावरण/i,
        value: "EVS",
      },
      {
        pattern: /art|drawing|कला|चित्रकला/i,
        value: "Art",
      },
    ];

    for (
      const item of subjects
    ) {

      if (
        item.pattern.test(
          text
        )
      ) {

        return item.value;

      }

    }

    return "";

  };

  const extractChapterValue = (
    text
  ) => {

    const explicit =
      extractMetadataField(
        text,
        [
          /(?:^|\n)\s*(?:chapter|topic|lesson|unit|अध्याय|पाठ|इकाई)\s*[:\-–—]\s*([^\n|]+)/im,
          /\b(?:chapter|topic|lesson)\s+([^\n|,.;]+)/i,
          /(?:अध्याय|पाठ|इकाई)\s*[:\-–—]?\s*([^\n|,.;]+)/i,
        ]
      );

    if (
      explicit
    ) {

      return explicit
        .replace(
          /\s+(?:chapter|topic|lesson|unit|test|assessment|exam)\s*$/i,
          ""
        )
        .trim();

    }

    return "";

  };

  const isGenericTitle = (
    value
  ) => {

    const cleaned =
      cleanMetadataText(
        value
      )
      .toLowerCase();

    if (
      !cleaned
    ) {

      return true;

    }

    return (
      /^(?:hello|hi|hey|sure|okay|ok|of course|here(?:'s| is)|let(?:'s| me)|nyxora(?: ai)?)[!,.\s:]*/i.test(
        cleaned
      ) ||
      /^(?:hello|hi|hey)\s+nyxora/i.test(
        cleaned
      ) ||
      /^(?:sure|okay|ok),?\s+(?:here|i can|let me)/i.test(
        cleaned
      ) ||
      cleaned.length < 4
    );

  };

  const createWorkspaceTitle = (
    userRequest,
    content,
    subject,
    classValue,
    chapter
  ) => {

    const combined =
      `${String(userRequest || "")}\n${String(content || "")}`;

    const explicitTitle =
      extractMetadataField(
        combined,
        [
          /(?:^|\n)\s*(?:title|document\s*title|test\s*title|शीर्षक)\s*[:\-–—]\s*([^\n]+)/im,
        ]
      );

    if (
      explicitTitle &&
      !isGenericTitle(
        explicitTitle
      )
    ) {

      return explicitTitle.slice(
        0,
        80
      );

    }

    const lines =
      String(
        content || ""
      )
        .split("\n")
        .map(
          (line) =>
            cleanMetadataText(
              line
            )
        )
        .filter(Boolean);

    const heading =
      lines.find(
        (line) =>
          !isGenericTitle(line) &&
          (
            /\b(?:test|assessment|exam|examination|question\s*paper|questionnaire|unit\s*test|practice\s*test|sample\s*paper)\b/i.test(line) ||
            /\b(?:class|grade|standard)\s*[0-9ivx]+\b/i.test(line) ||
            /(?:परीक्षा|प्रश्न\s*पत्र|इकाई\s*परीक्षा|मूल्यांकन)/i.test(line)
          )
      );

    if (
      heading
    ) {

      return heading.slice(
        0,
        80
      );

    }

    const userLine =
      String(
        userRequest || ""
      )
        .split("\n")
        .map(
          (line) =>
            cleanMetadataText(
              line
            )
        )
        .find(
          (line) =>
            line &&
            !isGenericTitle(line)
        );

    if (
      userLine
    ) {

      const cleanedRequest =
        userLine
          .replace(
            /^(?:please|pls|can you|could you|i want you to|make|create|generate|give me|prepare|write)\s+/i,
            ""
          )
          .trim();

      if (
        cleanedRequest
      ) {

        return cleanedRequest.slice(
          0,
          80
        );

      }

    }

    const parts = [];

    if (
      classValue
    ) {

      parts.push(
        `Class ${classValue}`
      );

    }

    if (
      subject
    ) {

      parts.push(
        subject
      );

    }

    if (
      chapter
    ) {

      parts.push(
        chapter
      );

    }

    parts.push(
      selectedMode === "test"
        ? "Test"
        : selectedMode === "homework"
          ? "Homework"
          : selectedMode === "report"
            ? "Student Report"
            : selectedMode === "teacher"
              ? "Teacher Notes"
              : selectedMode === "doubt"
                ? "Doubt Solution"
                : "AI Generated Notes"
    );

    return parts.join(
      " — "
    ).slice(
      0,
      80
    );

  };

  // ====================================================
  // SAVE AI RESPONSE TO WORKSPACE
  // ====================================================

const handleSaveToWorkspace =
  async ({
    content,
    notesImageRequested = false,
    notesImageTopic = "",
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

        const userRequest =
          getLatestUserMessage();

        const combinedMetadataText =
          `${userRequest}\n${cleanContent}`;

        const extractedClass =
          extractClassValue(
            combinedMetadataText
          );

        const extractedSubject =
          extractSubjectValue(
            combinedMetadataText
          );

        const extractedChapter =
          extractChapterValue(
            combinedMetadataText
          );

        const selectedClassValue =
          normalizeClassValue(
            selectedClass?.grade ||
            selectedClass?.name ||
            ""
          );

        const hasExplicitClass =
          Boolean(
            extractedClass
          );

        const selectedClassMatches =
          Boolean(
            selectedClassValue &&
            extractedClass &&
            selectedClassValue ===
              extractedClass
          );

        const useSelectedWorkspaceTarget =
          Boolean(
            selectedClassId &&
            (
              !hasExplicitClass ||
              selectedClassMatches
            )
          );

        const resolvedClass =
          extractedClass ||
          (
            useSelectedWorkspaceTarget
              ? selectedClassValue
              : ""
          );

        const resolvedSubject =
          extractedSubject ||
          (
            useSelectedWorkspaceTarget
              ? selectedClass?.subject || ""
              : ""
          );

        const resolvedTitle =
          createWorkspaceTitle(
            userRequest,
            cleanContent,
            resolvedSubject,
            resolvedClass,
            extractedChapter
          );

        await saveAiDocument({

          title:
            resolvedTitle,

          type:
            getWorkspaceDocumentTypeForContent(
              cleanContent
            ),

          content:
            cleanContent,

          classId:
            useSelectedWorkspaceTarget
              ? selectedClassId
              : "",

          studentId:
            useSelectedWorkspaceTarget
              ? selectedStudentId
              : "",

          subject:
            resolvedSubject,

          chapter:
            extractedChapter,

            notesImageRequested:
  Boolean(
    notesImageRequested
  ),

notesImageTopic:
  String(
    notesImageTopic || ""
  ).trim(),

aiMode:
  selectedMode,

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
        h-[100dvh]
        w-full
        min-w-0
        overflow-hidden
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
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >

        <ChatHeader
          selectedMode={
            selectedMode
          }

          onModeChange={
  handleModeChange
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

          thinkingText={
  isThinkingMessage
    ? thinkingText
    : ""
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