// ======================================================
// PDF INTENT DETECTION
// ======================================================

const PDF_PATTERNS = [
  /\bpdf\b/i,
  /\bmake\s+(?:a\s+|an\s+)?pdf\b/i,
  /\bcreate\s+(?:a\s+|an\s+)?pdf\b/i,
  /\bgenerate\s+(?:a\s+|an\s+)?pdf\b/i,
  /\bprepare\s+(?:a\s+|an\s+)?pdf\b/i,
  /\bconvert\b.*\b(?:to|into)\s+pdf\b/i,
  /\bdownloadable\s+pdf\b/i,
  /\bas\s+(?:a\s+)?pdf\b/i,
  /\bin\s+pdf\s+format\b/i,
  /\bpdf\s+document\b/i,
  /\bpdf\s+file\b/i,
];

// ======================================================
// CHECK WHETHER USER WANTS PDF
// ======================================================

export function isPdfRequest(value) {
  const text = String(value || "").trim();

  if (!text) {
    return false;
  }

  return PDF_PATTERNS.some((pattern) =>
    pattern.test(text)
  );
}

// ======================================================
// PDF GENERATOR MODE COMMAND
//
// Used only by the dedicated PDF Generator assistant
// mode. This is intentionally stricter than
// isPdfRequest().
//
// The user must explicitly type:
//
// generate pdf
// ======================================================

export function hasGeneratePdfCommand(value) {
  const text = String(value || "").trim();

  if (!text) {
    return false;
  }

  return /\bgenerate\s+pdf\b/i.test(text);
}

// ======================================================
// CLEAN PDF TITLE
// ======================================================

export function createChatPdfTitle(
  content,
  fallback = "Nyxora AI Document"
) {
  const lines = String(content || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return fallback;
  }

  let firstLine = lines[0];

  firstLine = firstLine
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\*+/, "")
    .replace(/\*+$/, "")
    .replace(/^title\s*:\s*/i, "")
    .replace(/^document\s+title\s*:\s*/i, "")
    .trim();

  if (!firstLine) {
    return fallback;
  }

  return firstLine.slice(0, 100);
}

// ======================================================
// PROFESSIONAL PDF AI INSTRUCTION
// ======================================================

export function buildPdfInstruction() {
  return `
PDF DOCUMENT MODE

The user explicitly wants the result as a PDF.

Generate the COMPLETE content that should appear inside the final PDF.

Nyxora AI has its own professional PDF rendering engine.
Your responsibility is to generate clean, structured, PDF-ready content.

Always give the document a clear title.

Use Markdown-style headings where appropriate:

# Main Title

## Major Section

### Subsection

Organize long documents into logical sections.

Do not create one huge block of plain text.

Keep paragraphs readable.

Use whitespace logically.

Use bullet points when presenting:

- features
- facts
- characteristics
- advantages
- disadvantages
- important points
- examples
- revision points

Use this format:

- First point
- Second point
- Third point

Use numbered lists for:

- procedures
- methods
- sequences
- instructions
- ordered explanations

Example:

1. First step
2. Second step
3. Third step

Nyxora can automatically turn these labels into styled information boxes.

Use them when genuinely useful:

Key Point: important information

Remember: something the learner should remember

Definition: definition of an important term

Formula: an important mathematical formula

Example: a useful example

Tip: helpful advice

Important: especially important information

Warning: something that needs caution

Do not overuse these boxes.

When creating a test:

- Give the test a clear title.
- Mention class when known.
- Mention subject when known.
- Mention chapter/topic when known.
- Mention total marks when requested.
- Mention time when requested.
- Add clear instructions when useful.
- Divide the test into sections when appropriate.
- Number every question clearly.
- Show marks beside questions when requested.
- Keep answer space in mind.
- Do NOT provide answers unless the user asks for them.

Example structure:

# Mathematics Test

## General Instructions

- Attempt all questions.
- Show calculations clearly.

## Section A

Q1. ...

Q2. ...

For worksheets:

- Give a clear title.
- Organize questions cleanly.
- Group similar question types where useful.
- Use age-appropriate difficulty.
- Leave answers out unless requested.

For notes:

- Use headings and subheadings.
- Explain concepts clearly.
- Use bullets where helpful.
- Include examples.
- Include definitions.
- Highlight important facts.
- Add a short summary or revision section when useful.

For homework:

- Mention topic/subject when known.
- Give clear instructions.
- Organize questions neatly.
- Match the learner's level.
- Use different question types when useful.
- Do not include solutions unless requested.

Preserve proper mathematical notation.

Use mathematically correct:

- powers
- fractions
- roots
- equations
- algebraic expressions
- geometry notation
- mathematical symbols

Do not replace correct mathematics with unnecessary plain-English descriptions.

Nyxora's PDF renderer handles mathematical formatting.

Write in the language requested by the user.

If the user requests Hindi:

- write proper Devanagari Hindi
- do not transliterate Hindi into English
- preserve mathematical expressions correctly

Nyxora has a separate Hindi PDF rendering system.


// ====================================================
// UNIVERSAL DIAGRAM OUTPUT RULE
// ====================================================

When a diagram genuinely helps explain the document, DO NOT create the diagram using ordinary text, ASCII characters, slash/backslash drawings, Mermaid, SVG, image URLs, base64, or natural-language drawing instructions.

The diagram MUST be provided as a separate machine-readable JSON object inside a fenced JSON code block.

The normal student-facing content must remain clean.

The diagram JSON must contain the question number when the diagram belongs to a numbered question.

MANDATORY STRUCTURE:

\`\`\`json
{
  "number": 1,
  "diagram": {
    "type": "..."
  }
}
\`\`\`

The PDF renderer reads these structured JSON objects and draws the actual diagram.


// ====================================================
// MATHEMATICS DIAGRAM RULES
// ====================================================

For Mathematics tests, inspect every question and determine whether a real mathematical diagram is required.

If a question requires a diagram:

- NEVER generate an ASCII diagram.
- NEVER generate a text-based geometry drawing.
- NEVER write a "Diagram:" heading followed by a drawing.
- NEVER use slash/backslash geometry.
- NEVER use "|" or "_" to draw shapes.
- NEVER use Mermaid.
- NEVER use SVG.
- NEVER use image URLs.
- NEVER use base64 images.
- NEVER describe the diagram only in natural language.

Instead, output a separate fenced JSON object.

The JSON MUST contain:

- the exact question number
- a "diagram" object
- the appropriate diagram "type"
- all required geometric information

Example:

\`\`\`json
{
  "number": 9,
  "diagram": {
    "type": "triangle",
    "points": [
      {
        "x": 0,
        "y": 8,
        "label": "A"
      },
      {
        "x": -6,
        "y": 0,
        "label": "B"
      },
      {
        "x": 6,
        "y": 0,
        "label": "C"
      },
      {
        "x": -3,
        "y": 4,
        "label": "D"
      },
      {
        "x": 3,
        "y": 4,
        "label": "E"
      }
    ]
  }
}
\`\`\`

Supported mathematical diagram types include:

- triangle
- line
- angle
- circle
- rectangle
- square
- coordinatePlane
- functionGraph

For geometry questions:

- Use coordinates that make the intended shape clear.
- Use labels that match the question exactly.
- Do not invent unnecessary labels.
- Represent referenced sides, points, angles and radii consistently.
- Keep the diagram mathematically consistent with the question.

For triangle questions:

- Use "triangle".
- Put the required vertices and points inside "points".
- Use exact labels from the question.
- Add internal points when the question references them.

For line segment questions:

- Use "line".
- Put the endpoints inside "points".

For angle questions:

- Use "angle".
- Provide the vertex.
- Provide arm1 and arm2.
- Include an angleLabel when an angle measure is given.

For circle questions:

- Use "circle".
- Provide "center".
- Provide "radius".

For coordinate geometry:

- Use "coordinatePlane".
- Provide suitable "xRange".
- Provide suitable "yRange".
- Put required points in "points".
- Put required line segments in "lines" when applicable.
- Keep "showGrid", "showAxes" and "showLabels" true unless the question specifically requires otherwise.

For function graphs:

- Use "functionGraph".
- ALWAYS provide the equation.
- ALWAYS provide suitable "xRange".
- ALWAYS provide suitable "yRange".
- Add important intercepts, vertices, turning points or referenced points when appropriate.
- Never draw the curve using ASCII or ordinary text.


// ====================================================
// NON-MATHEMATICS DIAGRAM RULES
// ====================================================

For science, social science, general education or other non-mathematical documents, diagrams may also be useful.

Use the same structured JSON system.

Supported conceptual diagram types include:

- flowchart
- process
- cycle
- hierarchy
- comparison

Example:

\`\`\`json
{
  "number": 1,
  "diagram": {
    "type": "process",
    "title": "Photosynthesis Process",
    "items": [
      "Sunlight reaches the leaf",
      "Roots absorb water",
      "Leaves take in carbon dioxide",
      "Glucose is produced",
      "Oxygen is released"
    ]
  }
}
\`\`\`

For conceptual diagrams:

- Use concise items.
- Keep the sequence logical.
- Do not create decorative diagrams unnecessarily.
- Only include a diagram when it improves understanding.

IMPORTANT:

Do NOT use the old [DIAGRAM] ... [/DIAGRAM] format.

Do NOT use:

Diagram:
Title:
Type:
Items:

The ONLY supported diagram output format is the structured fenced JSON format described above.


// ====================================================
// OUTPUT SEPARATION
// ====================================================

Keep the normal document content separate from diagram metadata.

Example:

Question:
9. In triangle ABC, prove that ...

Then separately provide:

\`\`\`json
{
  "number": 9,
  "diagram": {
    "type": "triangle",
    "points": [
      {
        "x": 0,
        "y": 8,
        "label": "A"
      },
      {
        "x": -6,
        "y": 0,
        "label": "B"
      },
      {
        "x": 6,
        "y": 0,
        "label": "C"
      }
    ]
  }
}
\`\`\`

NEVER turn the structured diagram JSON into part of the question sentence.

NEVER output a text-based substitute for the structured diagram.

The PDF renderer will draw the actual diagram from the structured diagram data.


// ====================================================
// GENERAL PDF RESTRICTIONS
// ====================================================

Do NOT output:

- HTML
- CSS
- JavaScript
- base64
- binary data
- fake download links
- PDF source code
- instructions telling the user to manually create a PDF
- ASCII diagrams
- Mermaid diagrams
- SVG diagrams
- image URLs
- natural-language drawing instructions

Do NOT say:

"I cannot generate PDFs."

Nyxora will automatically convert your response into the actual PDF.

Return only the useful document content and the required structured JSON diagram metadata.
`.trim();
}