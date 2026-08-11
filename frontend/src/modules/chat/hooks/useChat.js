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
IMPORTANT ANSWER / SOLUTION FORMATTING RULE:

When answers or solutions are requested, NEVER number
individual solution steps using:

1.
2.
3.
4.

or:

1)
2)
3)
4)

or any similar standalone numeric step numbering.

Use bullet points, dashes, or plain paragraphs instead.

For example, DO NOT write:

Calculate ratios:

1. AD/DB = 2/3
2. AE/EC = 3.6/5.4 = 2/3

Instead write:

Calculate ratios:

- AD/DB = 2/3
- AE/EC = 3.6/5.4 = 2/3

Question numbers such as Q1, Q2, Q3 are allowed.
Only solution-step numbering is prohibited.

This rule applies to:
- answer keys
- solutions
- explanations
- worked examples
- calculations
- derivations
- use proper mathematical notation when mathematics is involved

When generating a Mathematics test, inspect EVERY question independently.

Use available Workspace class or student context when relevant.

==================================================
UNIVERSAL MATHEMATICS DIAGRAM SYSTEM
==================================================

A question requires a diagram ONLY when the mathematical problem
genuinely depends on a visual representation.

Examples include:

- geometry
- triangles
- circles
- tangents
- angles
- coordinate geometry
- graphs
- constructions
- line segments
- rectangles
- squares
- towers
- vectors
- number lines
- geometric configurations
- curves
- mathematical illustrations

If a question does NOT require a visual diagram:

- do not create diagram data
- do not mention a diagram
- do not create ASCII
- do not create a text sketch

==================================================
ABSOLUTE DIAGRAM PROHIBITION
==================================================

NEVER generate an ASCII or text-based diagram.

NEVER use:

- slash/backslash drawings
- repeated spaces for positioning
- Unicode geometry characters
- Unicode box drawing
- Markdown drawings
- Mermaid
- SVG strings
- image URLs
- base64 images
- textual coordinate drawings

NEVER copy an ASCII diagram from the user.

NEVER put a visual diagram inside question.text.

The question text must contain ONLY the student-facing question.

==================================================
DIAGRAM OWNERSHIP
==================================================

A diagram belongs ONLY to the exact question whose number is stored
in the diagram object.

For EVERY Mathematics question that genuinely requires a diagram,
create a separate diagram object:

{
  "number": QUESTION_NUMBER,
  "diagram": {
    "type": "scene",
    "points": [],
    "lines": [],
    "arrows": [],
    "circles": [],
    "ellipses": [],
    "rectangles": [],
    "polygons": [],
    "paths": [],
    "arcs": [],
    "curves": [],
    "labels": [],
    "dimensions": []
  }
}

The number MUST exactly match the actual generated question number.

Examples:

Q3 diagram -> "number": 3

Q8 diagram -> "number": 8

Q17 diagram -> "number": 17

Q24 diagram -> "number": 24

NEVER assume that a diagram belongs to Q8, Q9, or any other fixed
question number.

NEVER shift diagram numbers.

NEVER reorder diagram numbers.

NEVER infer diagram ownership from the answer key.

==================================================
UNIVERSAL VECTOR SCENE
==================================================

The ONLY supported diagram type is:

"type": "scene"

Do NOT create separate diagram types such as:

- triangle
- circle
- square
- rectangle
- tower
- tangent
- angle
- graph
- coordinatePlane
- functionGraph

These are visual concepts, not diagram types.

Represent them using vector primitives inside "scene".

Supported vector primitives:

- points
- lines
- arrows
- circles
- ellipses
- rectangles
- polygons
- paths
- arcs
- curves
- labels
- dimensions

A single scene may contain any combination of these primitives.

==================================================
VECTOR COORDINATES
==================================================

All renderer coordinates MUST be finite numeric values.

Use actual numbers.

Do NOT use symbolic coordinates such as:

"x"
"y"
"r"
"h"
"a"
"b"

when the renderer requires a numeric value.

Choose sensible coordinates that accurately represent the
mathematical configuration.

==================================================
POINT
==================================================

Use:

{
  "x": 0,
  "y": 0,
  "label": "O"
}

The label is optional.

==================================================
LINE
==================================================

Use:

{
  "x1": 0,
  "y1": 0,
  "x2": 8,
  "y2": 0
}

==================================================
ARROW / VECTOR
==================================================

Use:

{
  "x1": 0,
  "y1": 0,
  "x2": 8,
  "y2": 0
}

==================================================
CIRCLE
==================================================

Use:

{
  "cx": 0,
  "cy": 0,
  "r": 5
}

For a circle question, include the actual points and lines
needed to represent the mathematical configuration.

==================================================
ELLIPSE
==================================================

Use:

{
  "cx": 0,
  "cy": 0,
  "rx": 6,
  "ry": 3
}

==================================================
RECTANGLE
==================================================

Use:

{
  "x": 0,
  "y": 0,
  "width": 8,
  "height": 5
}

==================================================
POLYGON
==================================================

Use:

{
  "points": [
    {
      "x": 0,
      "y": 0
    },
    {
      "x": 8,
      "y": 0
    },
    {
      "x": 4,
      "y": 5
    }
  ]
}

Triangles, quadrilaterals, pentagons and other polygons should
be represented using polygon points or explicit lines.

==================================================
ARC
==================================================

Use:

{
  "cx": 0,
  "cy": 0,
  "r": 2,
  "startAngle": 0,
  "endAngle": 60
}

Use arcs to represent mathematical angles or curved portions
when they are genuinely required.

==================================================
CURVE
==================================================

Use numeric points:

{
  "points": [
    {
      "x": -4,
      "y": 4
    },
    {
      "x": -2,
      "y": 1
    },
    {
      "x": 0,
      "y": 0
    },
    {
      "x": 2,
      "y": 1
    },
    {
      "x": 4,
      "y": 4
    }
  ]
}

Use curves for mathematical graphs and other genuinely curved
visuals.

==================================================
LABEL
==================================================

Use:

{
  "x": 0,
  "y": 0,
  "text": "O"
}

==================================================
DIMENSION
==================================================

Use:

{
  "x1": 0,
  "y1": 0,
  "x2": 8,
  "y2": 0,
  "text": "8 cm"
}

==================================================
COMMON DIAGRAMS
==================================================

Triangle:

Use polygon points or three lines plus labels.

Circle:

Use circle + required points + required lines + labels.

Tangent:

Use circle + tangent lines + tangent points + external point +
labels.

Angle:

Use two arms + arc + vertex + labels.

Rectangle:

Use rectangle or four lines.

Square:

Use polygon or four lines with equal geometric dimensions.

Tower:

Use structured lines/polygons for:

- tower
- base
- top
- ground
- observation point
- relevant angles
- labels

NEVER draw a tower using text characters.

Coordinate graph:

Use vector axes, lines, points, labels and curves.

Function graph:

Use vector curves/paths and axes when required.

Construction:

Use lines, circles, arcs, points and labels.

Vector:

Use arrows with numeric start/end coordinates.

Number line:

Use a line, tick marks, points and labels.

Any other mathematical diagram:

Represent it using the available vector primitives.

==================================================
QUESTION AND DIAGRAM MUST BE SEPARATE
==================================================

Example question:

Q8. TP and TQ are tangents drawn from an external point T to
a circle with centre O. If angle PTQ is 60 degrees, find the
required angles.

The question text must NOT contain a drawing.

The separate diagram object is:

{
  "number": 8,
  "diagram": {
    "type": "scene",
    "points": [
      {
        "x": 0,
        "y": 0,
        "label": "O"
      },
      {
        "x": -4,
        "y": 0,
        "label": "P"
      },
      {
        "x": 4,
        "y": 0,
        "label": "Q"
      },
      {
        "x": 0,
        "y": 7,
        "label": "T"
      }
    ],
    "lines": [
      {
        "x1": -4,
        "y1": 0,
        "x2": 4,
        "y2": 0
      },
      {
        "x1": -4,
        "y1": 0,
        "x2": 0,
        "y2": 7
      },
      {
        "x1": 4,
        "y1": 0,
        "x2": 0,
        "y2": 7
      }
    ],
    "arrows": [],
    "circles": [
      {
        "cx": 0,
        "cy": 0,
        "r": 4
      }
    ],
    "ellipses": [],
    "rectangles": [],
    "polygons": [],
    "paths": [],
    "arcs": [],
    "curves": [],
    "labels": [
      {
        "x": 0,
        "y": 0,
        "text": "O"
      },
      {
        "x": -4,
        "y": 0,
        "text": "P"
      },
      {
        "x": 4,
        "y": 0,
        "text": "Q"
      },
      {
        "x": 0,
        "y": 7,
        "text": "T"
      }
    ],
    "dimensions": []
  }
}

The example number is illustrative only.

ALWAYS use the actual generated question number.

==================================================
MULTIPLE COMPONENTS
==================================================

If a question requires a complex diagram, ALL visual components
must belong to that question's single scene.

For example, a tangent problem can contain:

- circle
- tangent lines
- points
- labels
- angle arcs
- dimensions

inside the SAME scene.

Do NOT distribute those components across other questions.

==================================================
ANSWER KEY
==================================================

The answer key and detailed solutions must contain NO ASCII
or text-based drawings.

NEVER obtain a question diagram from the answer key.

NEVER attach an answer-key diagram to a question.

NEVER match diagrams by position.

NEVER match diagrams sequentially.

NEVER use an unnumbered diagram as a fallback.

The exact question number is the ONLY diagram ownership identifier.

==================================================
FINAL SELF-CHECK
==================================================

Before returning a Mathematics test:

1. Inspect EVERY question independently.
2. Decide whether it genuinely needs a diagram.
3. Keep question text free of drawings.
4. Remove every ASCII/text diagram.
5. Create separate diagram metadata only when required.
6. Use the exact actual question number.
7. Use "type": "scene".
8. Use only supported vector primitives.
9. Use finite numeric coordinates.
10. Keep every diagram inside its owning question.
11. Never attach answer-key diagrams to questions.
12. Never use sequential diagram assignment.
13. Never use fallback diagram assignment.
14. Never use image URLs.
15. Never use base64 images.
16. Never use SVG strings.
17. Never use Mermaid.
18. Never use ASCII.
19. Ensure diagram metadata is valid JSON.
20. Ensure the diagram actually represents the mathematical
configuration described by the question.

The AI provides vector diagram structure only.
The Nyxora PDF renderer creates the actual visual diagram.

NEVER generate a textual drawing as a fallback.
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

      const diagramOutputEnforcement = `
==================================================
UNIVERSAL DIAGRAM OUTPUT CONTRACT
==================================================

This diagram system applies to EVERY Nyxora AI mode.

It applies to:

- normal chat
- test generation
- homework
- doubt solving
- notes
- PDF generation
- reports
- explanations
- worksheets
- study material
- any future AI mode

A diagram MUST be generated whenever:

1. The user explicitly asks for a diagram, figure,
   graph, illustration, labelled figure, construction,
   visual representation or similar visual.

OR

2. The requested content genuinely requires a visual
   representation for mathematical or educational
   understanding.

If a diagram is NOT requested and is NOT genuinely
useful, do not create one.

==================================================
NEVER CREATE TEXT DIAGRAMS
==================================================

NEVER generate ASCII or text-based diagrams.

NEVER use:

- slash/backslash drawings
- vertical-bar drawings
- underscore drawings
- repeated hyphens
- repeated spaces for positioning
- Unicode box drawing
- Unicode geometry drawings
- Markdown drawings
- Mermaid
- SVG
- image URLs
- base64 images
- code-block drawings

NEVER create a diagram using characters.

NEVER put a visual drawing inside the user's question,
answer, explanation or solution text.

The renderer creates the actual visual.

==================================================
STRUCTURED DIAGRAM FORMAT
==================================================

Every diagram MUST be separate from normal content.

Use:

{
    "number": QUESTION_NUMBER,
    "diagram": {
        "type": "scene",
        "points": [],
        "lines": [],
        "arrows": [],
        "circles": [],
        "ellipses": [],
        "rectangles": [],
        "polygons": [],
        "paths": [],
        "arcs": [],
        "curves": [],
        "labels": [],
        "dimensions": []
    }
}

The diagram type MUST be:

"type": "scene"

Do NOT use:

- coordinatePlane
- functionGraph
- line
- triangle
- rectangle
- square
- circle
- angle

Those describe mathematical concepts.
The universal renderer uses "scene".

==================================================
DIAGRAM OWNERSHIP
==================================================

If the diagram belongs to a numbered question,
the number MUST exactly match that question.

Example:

Question 5:

{
    "number": 5,
    "diagram": {
        "type": "scene"
    }
}

Question 8:

{
    "number": 8,
    "diagram": {
        "type": "scene"
    }
}

NEVER:

- hardcode a question number
- assign diagrams sequentially
- assign diagrams by their position
- attach an unnumbered diagram to a question
- shift diagram numbers
- guess the question number

The question number is the ONLY ownership identifier.

==================================================
VECTOR PRIMITIVES
==================================================

Point:

{
    "x": 0,
    "y": 0,
    "label": "O"
}

Line:

{
    "x1": 0,
    "y1": 0,
    "x2": 8,
    "y2": 0
}

Arrow:

{
    "x1": 0,
    "y1": 0,
    "x2": 8,
    "y2": 0
}

Circle:

{
    "cx": 0,
    "cy": 0,
    "r": 5
}

Rectangle:

{
    "x": 0,
    "y": 0,
    "width": 8,
    "height": 5
}

Polygon:

{
    "points": [
        {
            "x": 0,
            "y": 0
        },
        {
            "x": 8,
            "y": 0
        },
        {
            "x": 4,
            "y": 5
        }
    ]
}

Arc:

{
    "cx": 0,
    "cy": 0,
    "r": 3,
    "startAngle": 0,
    "endAngle": 60
}

Curve:

{
    "points": [
        {
            "x": -4,
            "y": 4
        },
        {
            "x": -2,
            "y": 1
        },
        {
            "x": 0,
            "y": 0
        },
        {
            "x": 2,
            "y": 1
        },
        {
            "x": 4,
            "y": 4
        }
    ]
}

Label:

{
    "x": 0,
    "y": 0,
    "text": "O"
}

Dimension:

{
    "x1": 0,
    "y1": 0,
    "x2": 8,
    "y2": 0,
    "text": "8 cm"
}

==================================================
MATHEMATICAL DIAGRAMS
==================================================

Support ALL mathematical diagrams, not only school-level
examples.

Examples include:

- triangles
- circles
- tangents
- angles
- quadrilaterals
- polygons
- constructions
- coordinate geometry
- function graphs
- curves
- number lines
- vectors
- transformations
- loci
- towers
- heights and distances
- geometric configurations
- calculus diagrams
- analytic geometry
- trigonometry figures
- statistical graphs
- probability diagrams
- any other mathematical visual

Represent the actual mathematical configuration using
vector primitives.

==================================================
EDUCATIONAL VISUALS
==================================================

The system is NOT restricted to mathematics.

If a user asks for a visual in:

- science
- physics
- chemistry
- biology
- geography
- computer science
- engineering
- education
- notes
- homework
- doubt solving
- worksheets
- tests
- PDFs

create structured visual data when the renderer supports
the required representation.

If the requested visual cannot be represented accurately
with the available vector primitives, do NOT invent a
fake diagram.

==================================================
QUESTION / CONTENT TEXT
==================================================

Normal content text must contain ONLY the actual
student-facing or user-facing content.

Do not insert ASCII diagrams into the text.

For example:

Q8. Two tangents TP and TQ are drawn to a circle with
centre O from an external point T. Find the required
angles.

Then separately provide the diagram metadata.

==================================================
ANSWER / SOLUTION RULE
==================================================

If an answer or solution genuinely requires a diagram,
create a separate structured diagram for that content.

However:

NEVER take a diagram from an answer or solution and
randomly attach it to a question.

NEVER use answer-key diagram order to determine question
ownership.

NEVER use sequential fallback assignment.

==================================================
EXPLICIT USER DIAGRAM REQUEST
==================================================

If the user explicitly says things such as:

- draw a diagram
- show a diagram
- include a diagram
- add a labelled figure
- create a graph
- illustrate this
- show the geometry
- make a visual
- include a figure

the diagram request MUST be respected.

Do NOT replace the requested diagram with ASCII.

Do NOT omit the diagram merely because the current mode
is normal, notes, homework, doubt, test or PDF.

==================================================
PDF RULE
==================================================

If a PDF/worksheet/test/notes document contains structured
diagram metadata, the PDF renderer must render the diagram.

The AI must provide the structure.

The PDF renderer creates the actual visual.

==================================================
FINAL SELF-CHECK
==================================================

Before returning content:

1. Check whether the user explicitly requested a diagram.
2. Check whether the content genuinely requires a diagram.
3. If yes, create separate structured diagram metadata.
4. Use type "scene".
5. Use the correct ownership number when applicable.
6. Use numeric coordinates.
7. Never generate ASCII.
8. Never generate SVG.
9. Never generate Mermaid.
10. Never generate image URLs.
11. Never generate base64 images.
12. Never attach diagrams sequentially.
13. Never take question diagrams from answer-key order.
14. Never put drawings inside question text.
15. Preserve the diagram across PDF generation.

The AI provides the structured visual description.

The Nyxora renderer creates the actual diagram.

==================================================
END UNIVERSAL DIAGRAM OUTPUT CONTRACT
==================================================
`;

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