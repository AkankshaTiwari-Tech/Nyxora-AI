import {
  useState,
} from "react";

import {
  auth,
} from "../../../firebase/firebase";

import {
  getMemory,
} from "../../../services/memoryService";

import {
  saveMessages,
  updateChatTitle,
} from "../services/chatHistoryService";

import {
  stopGeneration,
} from "../services/geminiService";

import {
  streamResponse,
} from "./useStreaming";

import {
  extractPdfText,
  PDF_ERROR_CODES,
} from "../utils/extractPdfText";

import {
  extractDocxText,
} from "../utils/extractDocxText";

import {
  buildPdfInstruction,
  hasGeneratePdfCommand,
  isPdfRequest,
} from "../utils/pdfIntent";


// ======================================================
// CONFIG
// ======================================================

const MAX_CHAT_TITLE_LENGTH =
  40;

const MAX_WORKSPACE_DOCUMENTS =
  8;

const MAX_WORKSPACE_DOCUMENT_CONTENT =
  2500;

const MAX_WORKSPACE_RESULTS =
  20;


// ======================================================
// PDF GENERATOR MODE
// ======================================================

const PDF_GENERATOR_MODE =
  "pdf";


const PDF_GENERATOR_WARNING = `
## PDF Generator Mode

This mode is dedicated to creating PDF documents.

To generate a PDF, include **generate pdf** in your request.

Example:

**generate pdf notes on photosynthesis for Class 8**

You can also include details such as subject, chapter, class, marks, difficulty, language, or document type.
`.trim();


// ======================================================
// ASSISTANT MODES
// ======================================================

const assistantModePrompts = {

  normal: `
You are Nyxora AI, a helpful general-purpose AI assistant.

Respond naturally and directly to the user's request.
Be clear, accurate, and useful.
Do not force an educational format unless the user asks for it.
`,

      pdf: `
You are Nyxora AI operating in dedicated PDF Generator mode.

Your only purpose in this mode is to create PDF-ready documents.

The user should describe the PDF they want.

If the user's message is a valid PDF generation request:
- generate the requested document
- produce complete, structured content
- follow the Nyxora PDF document formatting rules
- use Workspace context when relevant

If the user sends a normal conversational message that is not asking you to create or modify a PDF, do not answer it normally.

Instead respond exactly:

⚠️ PDF Generator mode only creates PDF documents. Include the words "generate PDF" in your request.

Example:
"Generate PDF notes for Class 8 Science on Photosynthesis."

Do not behave like the Normal Assistant in this mode.
`,

  teacher: `
You are Nyxora AI operating as a Teacher Assistant.

Your job is to help teachers with:
- lesson planning
- classroom explanations
- teaching strategies
- worksheets
- examples
- revision material
- student activities
- chapter planning

Give teacher-friendly, practical and well-structured responses.

Use available Workspace class or student context when relevant.

If important information is genuinely missing,
ask a concise clarification.
`,


test: `
You are Nyxora AI operating as a professional Test Generator.

Your primary job is to create high-quality student tests.

When generating a test:
- clearly mention the title
- mention class and subject when known
- organize questions neatly
- use appropriate difficulty
- follow the marks requested by the user
- include different question types when appropriate
- ensure total marks are correct
- do not provide answers unless requested
- use proper mathematical notation when mathematics is involved

MATHEMATICS DIAGRAM RULES:

When the subject is Mathematics, determine whether each question genuinely requires a mathematical diagram.

If a diagram is genuinely required, add a structured "diagram" object to that question.

If no diagram is required, do not add a diagram.

Never add diagrams merely for decoration.

Supported diagram types:

1. coordinatePlane
2. functionGraph
3. line
4. triangle
5. rectangle
6. square
7. circle
8. angle

Use numeric coordinates or exact mathematical values whenever possible.

Coordinate plane format:

{
  "type": "coordinatePlane",
  "xRange": [-10, 10],
  "yRange": [-10, 10],
  "points": [
    {
      "x": 2,
      "y": 3,
      "label": "A"
    }
  ],
  "lines": [],
  "showGrid": true,
  "showAxes": true,
  "showLabels": true
}

Function graph / curve format:

{
  "type": "functionGraph",
  "equation": "y=x^2-4",
  "xRange": [-5, 5],
  "yRange": [-6, 10],
  "points": [
    {
      "x": -2,
      "y": 0,
      "label": "A"
    }
  ],
  "showGrid": true,
  "showAxes": true,
  "showLabels": true
}

Line format:

{
  "type": "line",
  "points": [
    {
      "x": 0,
      "y": 0,
      "label": "A"
    },
    {
      "x": 6,
      "y": 4,
      "label": "B"
    }
  ]
}

Triangle format:

{
  "type": "triangle",
  "points": [
    {
      "x": 0,
      "y": 0,
      "label": "A"
    },
    {
      "x": 8,
      "y": 0,
      "label": "B"
    },
    {
      "x": 4,
      "y": 5,
      "label": "C"
    }
  ]
}

Circle format:

{
  "type": "circle",
  "center": {
    "x": 0,
    "y": 0
  },
  "radius": 5
}

Angle format:

{
  "type": "angle",
  "vertex": {
    "x": 0,
    "y": 0,
    "label": "O"
  },
  "arm1": {
    "x": 4,
    "y": 0,
    "label": "A"
  },
  "arm2": {
    "x": 2,
    "y": 3,
    "label": "B"
  },
  "angleLabel": "60°"
}

For function graphs, always provide the equation and suitable x/y ranges.

Do not generate image URLs, base64 images, SVG strings, or natural-language drawing instructions.

The PDF renderer will draw the diagram from the structured diagram data.

Use Workspace context when it provides class, subject,
student or related academic information.

Do not invent important requirements that are not available.
`,


  homework: `
You are Nyxora AI operating as a Homework Creator.

Create clear, age-appropriate and useful homework for students.

When appropriate:
- mention subject and topic
- organize questions clearly
- balance practice and understanding
- include different types of questions
- match the student's class level
- avoid unnecessary answers unless requested
- use proper mathematical notation for mathematics

Use available Workspace class and student context when relevant.
`,


  report: `
You are Nyxora AI operating as a Student Report Analyzer.

Your job is to analyze student academic information such as:
- test scores
- attendance
- homework performance
- subject performance
- strengths
- weaknesses
- improvement trends

When data is available:
1. Summarize overall performance.
2. Identify strengths.
3. Identify areas needing improvement.
4. Highlight meaningful patterns.
5. Suggest practical next steps.

Use Workspace student information, test results and related documents
when they are supplied.

Never invent student data.
Clearly state when there is not enough information.
`,


  doubt: `
You are Nyxora AI operating as a student Doubt Solver.

Your goal is to help the student understand the concept,
not merely give the final answer.

When solving a doubt:
- explain in simple language
- adapt to the student level when known
- break difficult ideas into steps
- show calculations clearly when needed
- give examples when helpful
- avoid unnecessary complexity

Use Workspace class/student context when relevant.

If the question is ambiguous, ask a concise clarification.
`,


  pdf: `
You are Nyxora AI operating in dedicated PDF Generator Mode.

Your only purpose in this mode is to create professional,
structured, PDF-ready documents.

Do not behave like a general conversational assistant.

When a valid PDF generation command is received:
- follow the user's document requirements carefully
- use available Workspace context when relevant
- create complete PDF-ready content
- preserve correct academic and mathematical notation
- follow the professional PDF document instructions supplied below

Return only useful document content.
`,

};


// ======================================================
// CLEAN VALUE
// ======================================================

function cleanValue(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(
    value
  ).trim();

}


// ======================================================
// CHAT TITLE
// ======================================================

function buildChatTitle(
  text,
  file
) {

  const cleanText =
    cleanValue(
      text
    )
      .replace(
        /\s+/g,
        " "
      );


  let title =
    cleanText ||
    file?.name ||
    "New Chat";


  if (
    title.length >
    MAX_CHAT_TITLE_LENGTH
  ) {

    title =
      `${title
        .slice(
          0,
          MAX_CHAT_TITLE_LENGTH
        )
        .trim()}…`;

  }


  return title;

}


// ======================================================
// FILE METADATA
// ======================================================

function buildFileMetadata(
  file
) {

  if (!file) {

    return null;

  }


  return {

    name:
      file.name ||
      "Attachment",

    type:
      file.type ||
      "application/octet-stream",

    size:
      Number(
        file.size || 0
      ),

  };

}


// ======================================================
// WORKSPACE CONTEXT
// ======================================================

function buildWorkspaceContextPrompt(
  workspaceContext
) {

  if (
    !workspaceContext
  ) {

    return "";

  }


  const selectedClass =
    workspaceContext.class;

  const selectedStudent =
    workspaceContext.student;


  const documents =
    Array.isArray(
      workspaceContext.documents
    )

      ? workspaceContext.documents
          .slice(
            0,
            MAX_WORKSPACE_DOCUMENTS
          )

      : [];


  const results =
    Array.isArray(
      workspaceContext.results
    )

      ? workspaceContext.results
          .slice(
            0,
            MAX_WORKSPACE_RESULTS
          )

      : [];


  if (
    !selectedClass &&
    !selectedStudent &&
    documents.length === 0 &&
    results.length === 0
  ) {

    return "";

  }


  const lines = [

    "WORKSPACE CONTEXT:",
    "",
    "The following information comes from the user's Nyxora Workspace.",
    "Use it only when relevant to the user's request.",
    "Do not invent missing Workspace information.",

  ];


  if (
    selectedClass
  ) {

    lines.push(
      "",
      "SELECTED CLASS:",
      `Name: ${cleanValue(selectedClass.name) || "Not provided"}`,
      `Grade: ${cleanValue(selectedClass.grade) || "Not provided"}`,
      `Subject: ${cleanValue(selectedClass.subject) || "Not provided"}`,
      `Board: ${cleanValue(selectedClass.board) || "Not provided"}`,
      `Description: ${cleanValue(selectedClass.description) || "Not provided"}`
    );

  }


  if (
    selectedStudent
  ) {

    lines.push(
      "",
      "SELECTED STUDENT:",
      `Name: ${cleanValue(selectedStudent.name) || "Not provided"}`,
      `Roll Number: ${cleanValue(selectedStudent.rollNumber) || "Not provided"}`,
      `Parent Name: ${cleanValue(selectedStudent.parentName) || "Not provided"}`,
      `Performance: ${cleanValue(selectedStudent.performance) || "Not provided"}`,
      `Notes: ${cleanValue(selectedStudent.notes) || "Not provided"}`
    );

  }


  if (
    documents.length > 0
  ) {

    lines.push(
      "",
      "RELATED WORKSPACE DOCUMENTS:"
    );


    documents.forEach(
      (
        document,
        index
      ) => {

        const documentContent =
          cleanValue(
            document.content
          )
            .slice(
              0,
              MAX_WORKSPACE_DOCUMENT_CONTENT
            );


        lines.push(
          "",
          `Document ${index + 1}:`,
          `Title: ${cleanValue(document.title) || "Untitled"}`,
          `Type: ${cleanValue(document.type) || "Document"}`,
          `Subject: ${cleanValue(document.subject) || "Not provided"}`,
          `Chapter: ${cleanValue(document.chapter) || "Not provided"}`,
          `Content: ${documentContent || "No content available"}`
        );

      }
    );

  }


  if (
    results.length > 0
  ) {

    lines.push(
      "",
      "STUDENT TEST RESULTS:"
    );


    results.forEach(
      (
        result,
        index
      ) => {

        const marksObtained =
          Number(
            result.marksObtained
          );


        const totalMarks =
          Number(
            result.totalMarks
          );


        const percentage =
          Number.isFinite(
            marksObtained
          ) &&
          Number.isFinite(
            totalMarks
          ) &&
          totalMarks > 0

            ? Math.round(
                (
                  marksObtained /
                  totalMarks
                ) *
                100
              )

            : null;


        lines.push(
          "",
          `Result ${index + 1}:`,
          `Test: ${cleanValue(result.title) || "Untitled"}`,
          `Subject: ${cleanValue(result.subject) || "Not provided"}`,
          `Chapter: ${cleanValue(result.chapter) || "Not provided"}`,
          `Marks: ${cleanValue(result.marksObtained)} / ${cleanValue(result.totalMarks)}`,
          `Percentage: ${percentage !== null ? `${percentage}%` : "Not available"}`,
          `Test Date: ${cleanValue(result.testDate) || "Not provided"}`,
          `Remarks: ${cleanValue(result.remarks) || "None"}`
        );

      }
    );

  }


  return lines.join(
    "\n"
  );

}


// ======================================================
// CHAT HOOK
// ======================================================

export default function useChat({
  activeChatId,
  chats,
  setChats,

  selectedMode = "normal",

  workspaceContext = null,
}) {

  const [
    isThinking,
    setIsThinking,
  ] = useState(false);


  const [
    attachmentError,
    setAttachmentError,
  ] = useState("");


  // ====================================================
  // CLEAR ATTACHMENT ERROR
  // ====================================================

  const clearAttachmentError =
    () => {

      setAttachmentError("");

    };


  // ====================================================
  // PDF GENERATOR MODE CHECK
  // ====================================================

  const isPdfGeneratorMode =
    selectedMode ===
    PDF_GENERATOR_MODE;


  // ====================================================
  // FILE EXTRACTION
  // ====================================================

  const extractFileContent =
    async (
      file
    ) => {

      if (!file) {

        return "";

      }


      if (
        file.type ===
          "application/pdf" ||
        file.name
          ?.toLowerCase()
          .endsWith(".pdf")
      ) {

        return await extractPdfText(
          file
        );

      }


      if (
        file.name
          ?.toLowerCase()
          .endsWith(".docx")
      ) {

        return await extractDocxText(
          file
        );

      }


      if (
        file.type ===
          "text/plain" ||
        file.name
          ?.toLowerCase()
          .endsWith(".txt") ||
        file.name
          ?.toLowerCase()
          .endsWith(".md")
      ) {

        return await file.text();

      }


      return "";

    };


  // ====================================================
  // ATTACHMENT ERROR
  // ====================================================

  const handleAttachmentError =
    (
      error
    ) => {

      console.error(
        "File extraction error:",
        error
      );


      if (
        error?.code ===
        PDF_ERROR_CODES
          .PASSWORD_PROTECTED
      ) {

        setAttachmentError(
          error.message ||
          "⚠️ This PDF is password-protected. Please remove the password and upload it again."
        );


        return false;

      }


      if (
        error?.code ===
        PDF_ERROR_CODES
          .INVALID_PDF
      ) {

        setAttachmentError(
          error.message ||
          "This PDF appears to be invalid or corrupted. Please try another file."
        );


        return false;

      }


      setAttachmentError(
        error?.message ||
        "Nyxora couldn't read this attachment. Please try another file."
      );


      return false;

    };


  // ====================================================
  // FILE PROMPT
  // ====================================================

  const buildPromptWithFile =
    async (
      text,
      file
    ) => {

      let userPrompt =
        cleanValue(
          text
        );


      if (
        file &&
        !file.type?.startsWith(
          "image/"
        )
      ) {

        const extractedText =
          await extractFileContent(
            file
          );


        if (
          extractedText
        ) {

          userPrompt += `


ATTACHED FILE TEXT CONTENT:

${extractedText}`;

        }

      }


      return userPrompt;

    };


  // ====================================================
  // FINAL MODE PROMPT
  // ====================================================

  const buildModePrompt =
    (
      userPrompt,
      pdfRequested = false
    ) => {

      const modeInstruction =
        assistantModePrompts[
          selectedMode
        ] ||
        assistantModePrompts.normal;


      const workspacePrompt =
        buildWorkspaceContextPrompt(
          workspaceContext
        );


      const pdfInstruction =
        pdfRequested

          ? buildPdfInstruction()

          : "";


      return `
${modeInstruction}

${workspacePrompt}

${pdfInstruction}

USER REQUEST:

${userPrompt}
`.trim();

    };


  // ====================================================
  // PDF MODE WARNING
  // ====================================================

  const addPdfModeWarning =
    async ({
      currentChat,
      cleanUserMessage,
      file,
    }) => {

      const history =
        currentChat.messages ||
        [];


      const fileMetadata =
        buildFileMetadata(
          file
        );


      const userMessage = {

        id:
          Date.now(),

        role:
          "user",

        message:
          cleanUserMessage,

        ...(fileMetadata

          ? {
              file:
                fileMetadata,
            }

          : {}),

      };


      const warningMessage = {

        id:
          Date.now() + 1,

        role:
          "assistant",

        message:
          PDF_GENERATOR_WARNING,

        pdfRequested:
          false,

        pdfModeWarning:
          true,

      };


      const hasUserMessage =
        history.some(
          (msg) =>
            msg.role ===
            "user"
        );


      const shouldCreateTitle =
        currentChat.title ===
          "New Chat" &&
        !hasUserMessage;


      const generatedTitle =
        shouldCreateTitle

          ? buildChatTitle(
              cleanUserMessage,
              file
            )

          : currentChat.title;


      const newMessages = [

        ...history,

        userMessage,

        warningMessage,

      ];


      setChats(
        (prev) =>
          prev.map(
            (chat) => {

              if (
                chat.id !==
                activeChatId
              ) {

                return chat;

              }


              return {

                ...chat,

                title:
                  shouldCreateTitle
                    ? generatedTitle
                    : chat.title,

                messages:
                  newMessages,

              };

            }
          )
      );


      await saveMessages(
        activeChatId,
        newMessages
      );


      if (
        shouldCreateTitle &&
        generatedTitle !==
          "New Chat"
      ) {

        try {

          await updateChatTitle(
            activeChatId,
            generatedTitle
          );

        } catch (error) {

          console.error(
            "Failed to save chat title:",
            error
          );

        }

      }


      return true;

    };


  // ====================================================
  // SEND
  // ====================================================

  const send =
    async (
      payload
    ) => {

      if (
        isThinking
      ) {

        return false;

      }


      setAttachmentError("");


      const userId =
        auth.currentUser?.uid;


      const text =
        typeof payload ===
          "string"

          ? payload

          : payload?.message ||
            "";


      const file =
        typeof payload ===
          "string"

          ? null

          : payload?.file ||
            null;


      if (
        !cleanValue(text) &&
        !file
      ) {

        return false;

      }


      const currentChat =
        chats.find(
          (chat) =>
            chat.id ===
            activeChatId
        );


      if (
        !currentChat
      ) {

        return false;

      }


      const history =
        currentChat.messages ||
        [];


      const cleanUserMessage =
        cleanValue(
          text
        );

         
      // ================================================
      // DEDICATED PDF GENERATOR MODE VALIDATION
      // ================================================

      if (
        isPdfGeneratorMode &&
        !hasGeneratePdfCommand(
          cleanUserMessage
        )
      ) {

        try {

          return await addPdfModeWarning({

            currentChat,

            cleanUserMessage,

            file,

          });

        } catch (error) {

          console.error(
            "PDF mode warning error:",
            error
          );


          return false;

        }

      }


      // ================================================
      // PDF REQUEST DETECTION
      //
      // Dedicated PDF mode is always a PDF request once
      // the required command has been accepted.
      //
      // Other assistant modes keep the existing direct
      // PDF request detection.
      // ================================================

      const pdfRequested =
        isPdfGeneratorMode

          ? true

          : isPdfRequest(
              cleanUserMessage
            );


      let userPrompt;


      try {

        userPrompt =
          await buildPromptWithFile(
            cleanUserMessage,
            file
          );

      } catch (error) {

        return handleAttachmentError(
          error
        );

      }


      let memory =
        null;


      try {

        memory =
          await getMemory();

      } catch (error) {

        console.error(
          "Memory loading error:",
          error
        );

      }


      const hasUserMessage =
        history.some(
          (msg) =>
            msg.role ===
            "user"
        );


      const shouldCreateTitle =
        currentChat.title ===
          "New Chat" &&
        !hasUserMessage;


      const generatedTitle =
        shouldCreateTitle

          ? buildChatTitle(
              text,
              file
            )

          : currentChat.title;


      const prompt =
        buildModePrompt(
          userPrompt,
          pdfRequested
        );


      const fileMetadata =
        buildFileMetadata(
          file
        );


      const userMessage = {

        id:
          Date.now(),

        role:
          "user",

        message:
          cleanUserMessage,

        ...(fileMetadata

          ? {
              file:
                fileMetadata,
            }

          : {}),

      };


      const aiMessage = {

        id:
          Date.now() + 1,

        role:
          "assistant",

        message:
          "",

        pdfRequested:
          pdfRequested,

        pdfGeneratorMode:
          isPdfGeneratorMode,

      };


      const newMessages = [

        ...history,

        userMessage,

        aiMessage,

      ];


      setChats(
        (prev) =>
          prev.map(
            (chat) => {

              if (
                chat.id !==
                activeChatId
              ) {

                return chat;

              }


              return {

                ...chat,

                title:
                  shouldCreateTitle
                    ? generatedTitle
                    : chat.title,

                messages:
                  newMessages,

              };

            }
          )
      );


      await saveMessages(
        activeChatId,
        newMessages
      );


      if (
        shouldCreateTitle &&
        generatedTitle !==
          "New Chat"
      ) {

        try {

          await updateChatTitle(
            activeChatId,
            generatedTitle
          );

        } catch (error) {

          console.error(
            "Failed to save chat title:",
            error
          );

        }

      }


      setIsThinking(
        true
      );


      try {

        await streamResponse({

          prompt,

          memoryMessage:
            cleanUserMessage,

          file,

          history,

          messages:
            newMessages,

          aiMessageId:
            aiMessage.id,

          activeChatId,

          setChats,

          setIsThinking,

          userId,

          memory,

        });


        return true;

      } catch (error) {

        console.error(
          "AI streaming error:",
          error
        );


        setIsThinking(
          false
        );


        return false;

      }

    };


  // ====================================================
  // REGENERATE
  // ====================================================

  const regenerate =
    async () => {

      if (
        isThinking
      ) {

        return false;

      }


      setAttachmentError("");


      const activeChat =
        chats.find(
          (chat) =>
            chat.id ===
            activeChatId
        );


      if (
        !activeChat
      ) {

        return false;

      }


      const messages =
        activeChat.messages ||
        [];


      const lastUserIndex =
        messages
          .map(
            (msg) =>
              msg.role
          )
          .lastIndexOf(
            "user"
          );


      if (
        lastUserIndex ===
        -1
      ) {

        return false;

      }


      const lastUser =
        messages[
          lastUserIndex
        ];


      const assistantIndex =
        messages.findIndex(
          (
            msg,
            index
          ) =>
            index >
              lastUserIndex &&
            msg.role ===
              "assistant"
        );


      if (
        assistantIndex ===
        -1
      ) {

        return false;

      }


      const lastAssistant =
        messages[
          assistantIndex
        ];


      const cleanUserMessage =
        cleanValue(
          lastUser.message
        );


      // ================================================
      // PDF MODE REGENERATE PROTECTION
      // ================================================

      if (
        isPdfGeneratorMode &&
        !hasGeneratePdfCommand(
          cleanUserMessage
        )
      ) {

        const updatedMessages =
          messages.map(
            (msg) =>

              msg.id ===
              lastAssistant.id

                ? {
                    ...msg,

                    message:
                      PDF_GENERATOR_WARNING,

                    pdfRequested:
                      false,

                    pdfModeWarning:
                      true,

                    pdfGeneratorMode:
                      false,
                  }

                : msg
          );


        setChats(
          (prev) =>
            prev.map(
              (chat) =>

                chat.id ===
                activeChatId

                  ? {
                      ...chat,

                      messages:
                        updatedMessages,
                    }

                  : chat
            )
        );


        await saveMessages(
          activeChatId,
          updatedMessages
        );


        return true;

      }


      let memory =
        null;


      try {

        memory =
          await getMemory();

      } catch (error) {

        console.error(
          "Memory loading error:",
          error
        );

      }


      const pdfRequested =
        isPdfGeneratorMode

          ? true

          : Boolean(
              lastAssistant
                ?.pdfRequested
            ) ||
            isPdfRequest(
              cleanUserMessage
            );


      const prompt =
        buildModePrompt(
          cleanUserMessage,
          pdfRequested
        );


      const updatedMessages =
        messages.map(
          (msg) =>

            msg.id ===
            lastAssistant.id

              ? {
                  ...msg,

                  message:
                    "",

                  pdfRequested:
                    pdfRequested,

                  pdfModeWarning:
                    false,

                  pdfGeneratorMode:
                    isPdfGeneratorMode,
                }

              : msg
        );


      setChats(
        (prev) =>
          prev.map(
            (chat) =>

              chat.id ===
              activeChatId

                ? {
                    ...chat,

                    messages:
                      updatedMessages,
                  }

                : chat
          )
      );


      await saveMessages(
        activeChatId,
        updatedMessages
      );


      setIsThinking(
        true
      );


      try {

        await streamResponse({

          prompt,

          memoryMessage:
            cleanUserMessage,

          history:
            updatedMessages.slice(
              0,
              lastUserIndex
            ),

          messages:
            updatedMessages,

          memory,

          aiMessageId:
            lastAssistant.id,

          activeChatId,

          setChats,

          setIsThinking,

          userId:
            auth.currentUser?.uid,

        });


        return true;

      } catch (error) {

        console.error(
          "Regeneration error:",
          error
        );


        setIsThinking(
          false
        );


        return false;

      }

    };


  // ====================================================
  // EDIT MESSAGE
  // ====================================================

  const editMessage =
    async (
      messageId,
      newText,
      attachmentOptions = {}
    ) => {

      if (
        isThinking
      ) {

        return false;

      }


      setAttachmentError("");


      const activeChat =
        chats.find(
          (chat) =>
            chat.id ===
            activeChatId
        );


      if (
        !activeChat
      ) {

        return false;

      }


      const messageIndex =
        activeChat.messages
          .findIndex(
            (msg) =>
              msg.id ===
              messageId
          );


      if (
        messageIndex ===
        -1
      ) {

        return false;

      }


      const originalMessage =
        activeChat.messages[
          messageIndex
        ];


      if (
        originalMessage.role !==
        "user"
      ) {

        return false;

      }


      const assistantIndex =
        activeChat.messages
          .findIndex(
            (
              msg,
              index
            ) =>
              index >
                messageIndex &&
              msg.role ===
                "assistant"
          );


      if (
        assistantIndex ===
        -1
      ) {

        return false;

      }


      const {
        newFile = null,
        removeFile = false,
      } = attachmentOptions;


      const cleanUserMessage =
        cleanValue(
          newText
        );


      let finalFileMetadata =
        originalMessage.file ||
        null;


      let fileForAI =
        null;


      if (
        newFile
      ) {

        finalFileMetadata =
          buildFileMetadata(
            newFile
          );


        fileForAI =
          newFile;

      } else if (
        removeFile
      ) {

        finalFileMetadata =
          null;

      }


      if (
        !cleanUserMessage &&
        !finalFileMetadata
      ) {

        return false;

      }


      // ================================================
      // PDF MODE EDIT VALIDATION
      // ================================================

      const validPdfGeneratorCommand =
        !isPdfGeneratorMode ||
        hasGeneratePdfCommand(
          cleanUserMessage
        );


      const pdfRequested =
        isPdfGeneratorMode

          ? validPdfGeneratorCommand

          : isPdfRequest(
              cleanUserMessage
            );


      // ================================================
      // INVALID PDF MODE EDIT
      //
      // Update the user's edited message and replace the
      // assistant response with the local warning.
      // No AI request is sent.
      // ================================================

      if (
        isPdfGeneratorMode &&
        !validPdfGeneratorCommand
      ) {

        const updatedMessages =
          activeChat.messages.map(
            (
              msg,
              index
            ) => {

              if (
                index ===
                messageIndex
              ) {

                const updatedUserMessage = {

                  ...msg,

                  message:
                    cleanUserMessage,

                };


                if (
                  finalFileMetadata
                ) {

                  updatedUserMessage.file =
                    finalFileMetadata;

                } else {

                  delete updatedUserMessage.file;

                }


                return updatedUserMessage;

              }


              if (
                index ===
                assistantIndex
              ) {

                return {

                  ...msg,

                  message:
                    PDF_GENERATOR_WARNING,

                  pdfRequested:
                    false,

                  pdfModeWarning:
                    true,

                  pdfGeneratorMode:
                    false,

                };

              }


              return msg;

            }
          );


        setChats(
          (prev) =>
            prev.map(
              (chat) =>

                chat.id ===
                activeChatId

                  ? {
                      ...chat,

                      messages:
                        updatedMessages,
                    }

                  : chat
            )
        );


        await saveMessages(
          activeChatId,
          updatedMessages
        );


        return true;

      }


      let userPrompt =
        cleanUserMessage;


      if (
        newFile
      ) {

        try {

          userPrompt =
            await buildPromptWithFile(
              cleanUserMessage,
              newFile
            );

        } catch (error) {

          return handleAttachmentError(
            error
          );

        }

      }


      let memory =
        null;


      try {

        memory =
          await getMemory();

      } catch (error) {

        console.error(
          "Memory loading error:",
          error
        );

      }


      const updatedMessages =
        activeChat.messages.map(
          (
            msg,
            index
          ) => {

            if (
              index ===
              messageIndex
            ) {

              const updatedUserMessage = {

                ...msg,

                message:
                  cleanUserMessage,

              };


              if (
                finalFileMetadata
              ) {

                updatedUserMessage.file =
                  finalFileMetadata;

              } else {

                delete updatedUserMessage.file;

              }


              return updatedUserMessage;

            }


            if (
              index ===
              assistantIndex
            ) {

              return {

                ...msg,

                message:
                  "",

                pdfRequested:
                  pdfRequested,

                pdfModeWarning:
                  false,

                pdfGeneratorMode:
                  isPdfGeneratorMode,

              };

            }


            return msg;

          }
        );


      setChats(
        (prev) =>
          prev.map(
            (chat) =>

              chat.id ===
              activeChatId

                ? {
                    ...chat,

                    messages:
                      updatedMessages,
                  }

                : chat
          )
      );


      await saveMessages(
        activeChatId,
        updatedMessages
      );


      const prompt =
        buildModePrompt(
          userPrompt,
          pdfRequested
        );


      const aiMessage =
        updatedMessages[
          assistantIndex
        ];


      setIsThinking(
        true
      );


      try {

        await streamResponse({

          prompt,

          memoryMessage:
            cleanUserMessage,

          file:
            fileForAI,

          history:
            updatedMessages.slice(
              0,
              messageIndex
            ),

          messages:
            updatedMessages,

          memory,

          aiMessageId:
            aiMessage.id,

          activeChatId,

          setChats,

          setIsThinking,

          userId:
            auth.currentUser?.uid,

        });


        return true;

      } catch (error) {

        console.error(
          "Edit regeneration error:",
          error
        );


        setIsThinking(
          false
        );


        return false;

      }

    };


  // ====================================================
  // STOP GENERATION
  // ====================================================

  const stop =
    () => {

      stopGeneration();

      setIsThinking(
        false
      );

    };


  // ====================================================
  // RETURN
  // ====================================================

  return {

    send,

    regenerate,

    editMessage,

    stop,

    isThinking,

    attachmentError,

    clearAttachmentError,

  };

}