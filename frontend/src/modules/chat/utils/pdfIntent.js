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

export function hasGeneratePdfCommand(
  value
) {

  const text =
    String(
      value || ""
    ).trim();


  if (!text) {

    return false;

  }


  return /\bgenerate\s+pdf\b/i.test(
    text
  );

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

==================================================
DOCUMENT STRUCTURE
==================================================

Always give the document a clear title.

Use Markdown-style headings where appropriate:

# Main Title
## Major Section
### Subsection

Organize long documents into logical sections.

Do not create one huge block of plain text.

Keep paragraphs readable.

Use whitespace logically.

==================================================
BULLET POINTS
==================================================

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

==================================================
NUMBERED STEPS
==================================================

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

==================================================
PROFESSIONAL HIGHLIGHT BOXES
==================================================

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

==================================================
TESTS
==================================================

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

==================================================
WORKSHEETS
==================================================

For worksheets:

- Give a clear title.
- Organize questions cleanly.
- Group similar question types where useful.
- Use age-appropriate difficulty.
- Leave answers out unless requested.

==================================================
NOTES
==================================================

For notes:

- Use headings and subheadings.
- Explain concepts clearly.
- Use bullets where helpful.
- Include examples.
- Include definitions.
- Highlight important facts.
- Add a short summary or revision section when useful.

==================================================
HOMEWORK
==================================================

For homework:

- Mention topic/subject when known.
- Give clear instructions.
- Organize questions neatly.
- Match the learner's level.
- Use different question types when useful.
- Do not include solutions unless requested.

==================================================
MATHEMATICS
==================================================

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

==================================================
LANGUAGE
==================================================

Write in the language requested by the user.

If the user requests Hindi:
- write proper Devanagari Hindi
- do not transliterate Hindi into English
- preserve mathematical expressions correctly

Nyxora has a separate Hindi PDF rendering system.

==================================================
DIAGRAMS
==================================================

When a diagram genuinely helps explain the topic, include a diagram specification.

Use EXACTLY this format:

[DIAGRAM]
Title: Water Cycle
Type: cycle
Items:
- Evaporation
- Condensation
- Precipitation
- Collection
[/DIAGRAM]

For a process:

[DIAGRAM]
Title: Photosynthesis Process
Type: process
Items:
- Sunlight reaches the leaf
- Roots absorb water
- Leaves take in carbon dioxide
- Glucose is produced
- Oxygen is released
[/DIAGRAM]

For a hierarchy:

[DIAGRAM]
Title: Classification
Type: hierarchy
Items:
- Main Category
- Category A
- Category B
- Category C
[/DIAGRAM]

For comparison:

[DIAGRAM]
Title: Plant Cell vs Animal Cell
Type: comparison
Items:
- Plant Cell
- Animal Cell
- Cell Wall
- Chloroplast
- Vacuole
[/DIAGRAM]

Supported diagram types:

- flowchart
- process
- cycle
- hierarchy
- comparison

Only include a diagram when it improves the document.

Do not add meaningless decorative diagrams.

==================================================
IMPORTANT OUTPUT RULES
==================================================

Do NOT output:
- HTML
- CSS
- JavaScript
- base64
- binary data
- fake download links
- PDF source code
- instructions telling the user to manually create a PDF

Do NOT say:
"I cannot generate PDFs."

Nyxora will automatically convert your response into the actual PDF.

Return only the useful document content.
`.trim();
}