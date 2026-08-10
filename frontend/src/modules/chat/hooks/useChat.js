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

==================================================
MATHEMATICS DIAGRAM SYSTEM
==================================================

When generating a Mathematics test, inspect EVERY question independently.

A question requires a diagram ONLY when the mathematical problem genuinely depends on a visual representation.

Examples include:
- geometry figures
- triangles
- circles
- tangents
- angles
- coordinate planes
- graphs
- constructions
- line segments
- rectangles
- squares
- towers
- geometric configurations

If a question does NOT require a visual diagram:
- do not create diagram data
- do not mention a diagram
- do not create ASCII
- do not create a text sketch

==================================================
ABSOLUTE DIAGRAM PROHIBITION
==================================================

NEVER generate an ASCII or text-based diagram.

This applies to BOTH the question text and the answer/solution.

NEVER use ASCII characters to visually represent geometry.

NEVER create drawings using:
/
\\
|
_
-
+
< >
repeated spaces
Unicode geometry characters
Unicode box drawing
backticks containing drawings
Markdown drawings
Mermaid
SVG
image URLs
base64 images

NEVER create diagrams such as:

A
/\\
/  \\
/____\\

NEVER create diagrams such as:

P
/ \\
/   \\
O-----T
\\   /
 \\ /

NEVER create a tower using text characters.

NEVER create a circle using text characters.

NEVER create a coordinate graph using text characters.

NEVER put a diagram inside the question's text.

If a diagram is required, the question text must contain ONLY the student-facing question.

For example:

Q8. TP and TQ are tangents drawn from an external point T to a circle with centre O. If angle PTQ is 60°, find:
(i) angle POQ
(ii) angle OPQ.

The visual diagram MUST NOT appear in this text.

==================================================
STRUCTURED DIAGRAM DATA
==================================================

For EVERY Mathematics question that genuinely requires a diagram, create a separate JSON object.

The JSON object MUST contain:

{
  "number": QUESTION_NUMBER,
  "diagram": {
    ...
  }
}

The number MUST exactly match the actual question number.

NEVER assume that a diagram question is Q8 or Q9.

If the diagram belongs to Q3, use 3.

If the diagram belongs to Q8, use 8.

If the diagram belongs to Q17, use 17.

If the diagram belongs to Q24, use 24.

The question number must always come from the actual generated test.

==================================================
SUPPORTED DIAGRAM TYPES
==================================================

The only supported diagram types are:

- coordinatePlane
- functionGraph
- line
- triangle
- rectangle
- square
- circle
- angle

Never invent another diagram type.

==================================================
GEOMETRY DIAGRAMS
==================================================

For triangle diagrams use structured coordinates.

Example:

{
  "number": 8,
  "diagram": {
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
}

Coordinates MUST be numbers.

For additional points, include only points actually required by the question.

For a circle use structured center/radius information.

For a line use structured points.

For an angle use structured vertex/arms/angle information.

For a coordinate plane use:

{
  "number": QUESTION_NUMBER,
  "diagram": {
    "type": "coordinatePlane",
    "xRange": [-10, 10],
    "yRange": [-10, 10],
    "points": [],
    "lines": [],
    "showGrid": true,
    "showAxes": true,
    "showLabels": true
  }
}

For a function graph use:

{
  "number": QUESTION_NUMBER,
  "diagram": {
    "type": "functionGraph",
    "equation": "y=x^2-4",
    "xRange": [-5, 5],
    "yRange": [-6, 10],
    "points": [],
    "showGrid": true,
    "showAxes": true,
    "showLabels": true
  }
}

==================================================
CIRCLE / TANGENT QUESTIONS
==================================================

For circle and tangent questions, represent the actual mathematical configuration using structured data.

For example, if a question contains:
- circle centre O
- tangent points P and Q
- external point T

the diagram data must contain those points and the circle information.

Do NOT draw them with text.

Do NOT write:

P
/ \
O---T
\ /
Q

Instead provide structured diagram metadata.

The renderer will create the actual visual diagram.

==================================================
TOWER / HEIGHT QUESTIONS
==================================================

For tower questions, use structured geometry.

Represent:
- tower base
- tower top
- observation points
- ground line
- relevant labels
- relevant angles

Do NOT create a text tower.

Do NOT use:

D
|
|
C----B----A

The renderer will create the visual representation.

==================================================
OUTPUT SEPARATION
==================================================

Question text and diagram metadata are ALWAYS separate.

Question text must contain only the student-facing question.

Then separately provide:

with simply:

{
  "number": QUESTION_NUMBER,
  "diagram": {
    "type": "circle"
  }
}
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

  const diagramOutputEnforcement =
    selectedMode === "test"
      ? `

==================================================
FINAL MATHEMATICS DIAGRAM OUTPUT CONTRACT
==================================================

When generating a Mathematics test, NEVER create
ASCII or text-based diagrams.

NEVER use:

- /
- \\
- |
- _
- repeated -
- repeated spaces for positioning
- Unicode drawing characters
- Markdown drawings
- Mermaid
- SVG
- image URLs
- base64 images

NEVER copy an ASCII diagram from the user's request.

NEVER put a diagram inside the question text.

If a Mathematics question genuinely requires a
diagram, provide structured diagram data separately
from the question text.

Use ONLY these supported diagram types:

- coordinatePlane
- functionGraph
- line
- triangle
- rectangle
- square
- circle
- angle

For every diagram, use the ACTUAL question number.

Example:

{
  "number": 8,
  "diagram": {
    "type": "circle"
  }
}

The number above is only an example.

DO NOT hardcode 8.

If the diagram belongs to Q5, use:

{
  "number": 5,
  "diagram": { ... }
}

If the diagram belongs to Q12, use:

{
  "number": 12,
  "diagram": { ... }
}

Coordinates and renderer dimensions MUST always
be numeric.

NEVER use symbolic values such as:

"h"
"x"
"y"
"r"

where the diagram renderer expects a number.

For example, this is INVALID:

{
  "height": "h"
}

Use valid numeric geometry instead.

The mathematical variable can remain in the
student-facing question text.

For example:

"Let the height of the tower be h."

But the diagram itself must use valid numeric
coordinates.

==================================================
QUESTION TEXT RULE
==================================================

The question text must contain NO drawing.

For example, write:

Q8. Two tangents TP and TQ are drawn to a circle
with centre O from an external point T. Find the
required angles.

Then provide the structured diagram separately.

NEVER write an ASCII figure after the question.

==================================================
ANSWER KEY RULE
==================================================

The answer key and detailed solutions must ALSO
contain no ASCII diagrams.

If a solution requires a diagram, provide structured
diagram metadata only.

==================================================
FINAL SELF-CHECK
==================================================

Before returning a Mathematics test:

1. Check every question.
2. Find every question that genuinely needs a diagram.
3. Remove every ASCII/text drawing.
4. Do not copy diagrams supplied by the user.
5. Create separate structured diagram data.
6. Use the actual question number.
7. Use only supported diagram types.
8. Use numeric coordinates.
9. Keep the question text clean.
10. Keep the answer key free of ASCII diagrams.

The AI provides mathematical diagram STRUCTURE.

The Nyxora PDF renderer creates the actual visual.

NEVER generate a textual drawing as a fallback.

==================================================
END MATHEMATICS DIAGRAM CONTRACT
==================================================
`
      : "";

  return `
${modeInstruction}

${workspacePrompt}

${pdfInstruction}

${diagramOutputEnforcement}

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