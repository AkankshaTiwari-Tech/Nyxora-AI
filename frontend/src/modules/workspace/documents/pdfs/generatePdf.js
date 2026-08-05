import {
  jsPDF,
} from "jspdf";

import html2canvas
  from "html2canvas";

import {
  cleanMarkdownPreserveMath,
  getRenderableSegments,
} from "./renderMath";


// ======================================================
// PAGE
// ======================================================

const PAGE = {
  width: 210,
  height: 297,

  marginLeft: 18,
  marginRight: 18,

  marginTop: 20,
  marginBottom: 20,
};


const CONTENT_WIDTH =
  PAGE.width -
  PAGE.marginLeft -
  PAGE.marginRight;


// ======================================================
// NYXORA AI PDF THEME
// ======================================================

const COLORS = {

  // Nyxora violet
  primary: [
    124,
    58,
    237,
  ],

  // Nyxora fuchsia
  secondary: [
    192,
    38,
    211,
  ],

  // Nyxora cyan
  accent: [
    6,
    182,
    212,
  ],

  // Strong heading
  title: [
    24,
    24,
    45,
  ],

  // Main readable text
  text: [
    45,
    45,
    65,
  ],

  // Secondary text
  muted: [
    107,
    114,
    128,
  ],

  // Soft Nyxora border
  border: [
    226,
    220,
    245,
  ],

  // Very light violet surface
  lightPrimary: [
    247,
    244,
    255,
  ],

  // Light cyan surface
  lightBlue: [
    240,
    253,
    255,
  ],

  lightGreen: [
    240,
    253,
    244,
  ],

  lightYellow: [
    255,
    251,
    235,
  ],

  lightRed: [
    254,
    242,
    242,
  ],

  white: [
    255,
    255,
    255,
  ],

  // Nyxora-specific additions

  fuchsia: [
    217,
    70,
    239,
  ],

  violet: [
    124,
    58,
    237,
  ],

  cyan: [
    34,
    211,
    238,
  ],

  darkViolet: [
    91,
    33,
    182,
  ],

  softFuchsia: [
    253,
    244,
    255,
  ],

  softCyan: [
    236,
    254,
    255,
  ],

};


// ======================================================
// HINDI FONT
// ======================================================

const DEVANAGARI_FONT_URL =
  "/fonts/NotoSansDevanagari-Regular.ttf";


// ======================================================
// SAFE TEXT
// ======================================================

function safeText(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value);

}


// ======================================================
// FILE NAME
// ======================================================

function createFileName(title) {

  const cleaned =
    safeText(title)
      .trim()
      .replace(
        /[<>:"/\\|?*]+/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .toLowerCase();


  return `${
    cleaned ||
    "nyxora-document"
  }.pdf`;

}


// ======================================================
// DEVANAGARI DETECTION
// ======================================================

function containsDevanagari(value) {

  return /[\u0900-\u097F]/.test(
    safeText(value)
  );

}


// ======================================================
// DOCUMENT CONTAINS HINDI
// ======================================================

function documentContainsDevanagari(
  documentData = {}
) {

  return containsDevanagari(
    [
      documentData.title,
      documentData.type,
      documentData.subject,
      documentData.chapter,
      documentData.content,
    ].join("\n")
  );

}


// ======================================================
// PDF SAFE SYMBOLS
//
// EXISTING MATH PATH PRESERVED
// ======================================================

function pdfSafeText(value) {

  return safeText(value)

    .replace(
      /∠/g,
      "angle "
    )

    .replace(
      /×/g,
      "x"
    )

    .replace(
      /÷/g,
      "/"
    )

    .replace(
      /·/g,
      "."
    )

    .replace(
      /≤/g,
      "<="
    )

    .replace(
      /≥/g,
      ">="
    )

    .replace(
      /≠/g,
      "!="
    )

    .replace(
      /≈/g,
      "~"
    )

    .replace(
      /≡/g,
      "="
    )

    .replace(
      /∥/g,
      "||"
    )

    .replace(
      /⊥/g,
      " perpendicular "
    )

    .replace(
      /⇒/g,
      "=>"
    )

    .replace(
      /⇐/g,
      "<="
    )

    .replace(
      /→/g,
      "->"
    )

    .replace(
      /←/g,
      "<-"
    )

    .replace(
      /↔/g,
      "<->"
    )

    .replace(
      /∈/g,
      " in "
    )

    .replace(
      /∉/g,
      " not in "
    )

    .replace(
      /∞/g,
      "infinity"
    )

    .replace(
      /∴/g,
      "therefore"
    )

    .replace(
      /∵/g,
      "because"
    )

    .replace(
      /[ \t]+/g,
      " "
    );

}


// ======================================================
// SUPERSCRIPTS
// ======================================================

const SUPERSCRIPT_PATTERN =
  /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁱⁿ]+/g;


function superscriptToNormal(value) {

  const map = {

    "⁰": "0",
    "¹": "1",
    "²": "2",
    "³": "3",
    "⁴": "4",
    "⁵": "5",
    "⁶": "6",
    "⁷": "7",
    "⁸": "8",
    "⁹": "9",

    "⁺": "+",
    "⁻": "-",
    "⁼": "=",
    "⁽": "(",
    "⁾": ")",

    "ⁱ": "i",
    "ⁿ": "n",

  };


  return [
    ...safeText(value),
  ]
    .map(
      (character) =>
        map[character] ||
        character
    )
    .join("");

}


// ======================================================
// FRACTIONS
// ======================================================

const FRACTION_PATTERN =
  /\[\[FRAC:([^|\]]+)\|([^\]]+)\]\]/g;


function tokenizeFractions(value) {

  const text =
    safeText(value);


  const result = [];


  let lastIndex = 0;

  let match;


  FRACTION_PATTERN.lastIndex =
    0;


  while (
    (
      match =
        FRACTION_PATTERN.exec(
          text
        )
    ) !== null
  ) {

    if (
      match.index >
      lastIndex
    ) {

      result.push({

        type:
          "text",

        value:
          text.slice(
            lastIndex,
            match.index
          ),

      });

    }


    result.push({

      type:
        "fraction",

      numerator:
        pdfSafeText(
          match[1]
        ),

      denominator:
        pdfSafeText(
          match[2]
        ),

    });


    lastIndex =
      FRACTION_PATTERN.lastIndex;

  }


  if (
    lastIndex <
    text.length
  ) {

    result.push({

      type:
        "text",

      value:
        text.slice(
          lastIndex
        ),

    });

  }


  return result;

}


function tokenizeSuperscripts(value) {

  const text =
    safeText(value);


  const tokens = [];


  let lastIndex = 0;

  let match;


  SUPERSCRIPT_PATTERN.lastIndex =
    0;


  while (
    (
      match =
        SUPERSCRIPT_PATTERN.exec(
          text
        )
    ) !== null
  ) {

    if (
      match.index >
      lastIndex
    ) {

      tokens.push({

        type:
          "text",

        value:
          text.slice(
            lastIndex,
            match.index
          ),

      });

    }


    tokens.push({

      type:
        "superscript",

      value:
        superscriptToNormal(
          match[0]
        ),

    });


    lastIndex =
      SUPERSCRIPT_PATTERN.lastIndex;

  }


  if (
    lastIndex <
    text.length
  ) {

    tokens.push({

      type:
        "text",

      value:
        text.slice(
          lastIndex
        ),

    });

  }


  return tokens;

}


// ======================================================
// PREPARE PDF CONTENT
// ======================================================

export function preparePdfContent(value) {

  const cleaned =
    cleanMarkdownPreserveMath(
      value
    );


  return getRenderableSegments(
    cleaned
  )

    .map(
      (segment) =>
        segment.value
    )

    .join("")

    .replace(
      FRACTION_PATTERN,
      "($1/$2)"
    )

    .replace(
      /∠/g,
      "angle "
    )

    .replace(
      /×/g,
      "x"
    )

    .replace(
      /÷/g,
      "/"
    )

    .trim();

}


// ======================================================
// CONTENT DETECTION
// ======================================================

function isMarkdownHeading(value) {

  return /^#{1,6}\s+/.test(
    safeText(value).trim()
  );

}


function getHeadingLevel(value) {

  const match =
    safeText(value)
      .trim()
      .match(
        /^(#{1,6})\s+/
      );


  return match
    ? match[1].length
    : 0;

}


function removeHeadingMarker(value) {

  return safeText(value)
    .trim()
    .replace(
      /^#{1,6}\s+/,
      ""
    );

}


function isSectionHeading(value) {

  const text =
    safeText(value)
      .trim();


  return (
    isMarkdownHeading(
      text
    ) ||

    /^section\s+[a-z0-9]+[:.\s-]/i.test(
      text
    ) ||

    /^instructions?\s*:?\s*$/i.test(
      text
    ) ||

    /^general\s+instructions?\s*:?\s*$/i.test(
      text
    ) ||

    /^(summary|conclusion|introduction|examples?|key points?|revision|formulae?|formulas?|answers?|solutions?)\s*:?\s*$/i.test(
      text
    )
  );

}


function isQuestionLine(value) {

  const text =
    safeText(value)
      .trim();


  return (
    /^q\d+[\s.:)]*/i.test(
      text
    ) ||

    /^question\s*\d+[\s.:)]*/i.test(
      text
    ) ||

    /^\d+[\s.)]+\S/.test(
      text
    )
  );

}


function isOptionLine(value) {

  return (
    /^\([a-d]\)\s*/i.test(
      safeText(value).trim()
    ) ||

    /^[a-d][.)]\s+/i.test(
      safeText(value).trim()
    )
  );

}


function isBulletLine(value) {

  return /^[-*•]\s+/.test(
    safeText(value).trim()
  );

}


function getBulletText(value) {

  return safeText(value)
    .trim()
    .replace(
      /^[-*•]\s+/,
      ""
    );

}


function isNumberedListLine(value) {

  return /^\d+[.)]\s+/.test(
    safeText(value).trim()
  );

}


function getNumberedParts(value) {

  const match =
    safeText(value)
      .trim()
      .match(
        /^(\d+[.)])\s+(.+)$/
      );


  if (!match) {

    return null;

  }


  return {

    marker:
      match[1],

    text:
      match[2],

  };

}


// ======================================================
// CALLOUT DETECTION
// ======================================================

function getCallout(value) {

  const text =
    safeText(value)
      .trim();


  const match =
    text.match(
      /^(key point|remember|note|definition|formula|tip|warning|important|example)\s*:\s*(.*)$/i
    );


  if (!match) {

    return null;

  }


  return {

    label:
      match[1],

    content:
      match[2],

  };

}


// ======================================================
// DIAGRAM PARSER
// ======================================================

function parseDiagramBlocks(
  content
) {

  const lines =
    safeText(content)
      .split("\n");


  const output = [];


  let diagram = null;


  lines.forEach(
    (rawLine) => {

      const line =
        rawLine.trim();


      if (
        line ===
        "[DIAGRAM]"
      ) {

        diagram = {

          title:
            "Diagram",

          type:
            "flowchart",

          items:
            [],

        };


        return;

      }


      if (
        line ===
        "[/DIAGRAM]"
      ) {

        if (diagram) {

          output.push({

            type:
              "diagram",

            diagram,

          });

        }


        diagram =
          null;


        return;

      }


      if (diagram) {

        if (
          /^title\s*:/i.test(
            line
          )
        ) {

          diagram.title =
            line.replace(
              /^title\s*:/i,
              ""
            ).trim();


          return;

        }


        if (
          /^type\s*:/i.test(
            line
          )
        ) {

          diagram.type =
            line.replace(
              /^type\s*:/i,
              ""
            ).trim()
              .toLowerCase();


          return;

        }


        if (
          /^[-*•]\s+/.test(
            line
          )
        ) {

          diagram.items.push(
            line.replace(
              /^[-*•]\s+/,
              ""
            )
          );

        }


        return;

      }


      output.push({

        type:
          "line",

        value:
          rawLine,

      });

    }
  );


  return output;

}


// ======================================================
// ENGLISH / MATH PDF GENERATOR
// ======================================================

export function generateWorkspacePdf(
  documentData = {}
) {

  const {

    title =
      "Nyxora Document",

    type = "",

    subject = "",

    chapter = "",

    content = "",

  } = documentData;


  const pdf =
    new jsPDF({

      orientation:
        "portrait",

      unit:
        "mm",

      format:
        "a4",

    });


  let y =
    PAGE.marginTop;


  // ====================================================
  // PAGE SPACE
  // ====================================================

  function ensureSpace(
    required = 10
  ) {

    if (
      y + required >
      PAGE.height -
      PAGE.marginBottom
    ) {

      pdf.addPage();


      y =
        PAGE.marginTop;

    }

  }


  // ====================================================
  // FONT
  // ====================================================

  function setFont(
    bold = false,
    size = 11,
    color = COLORS.text
  ) {

    pdf.setFont(
      "helvetica",
      bold
        ? "bold"
        : "normal"
    );


    pdf.setFontSize(
      size
    );


    pdf.setTextColor(
      ...color
    );

  }


  // ====================================================
  // TEXT WIDTH
  // ====================================================

  function textWidth(
    value,
    size = 11,
    bold = false
  ) {

    const safe =
      pdfSafeText(
        value
      );


    setFont(
      bold,
      size
    );


    return pdf.getTextWidth(
      safe
    );

  }


  // ====================================================
  // FRACTION WIDTH
  // ====================================================

  function fractionWidth(
    numerator,
    denominator,
    size
  ) {

    const fractionSize =
      size *
      0.68;


    const topWidth =
      textWidth(
        numerator,
        fractionSize
      );


    const bottomWidth =
      textWidth(
        denominator,
        fractionSize
      );


    return (
      Math.max(
        topWidth,
        bottomWidth
      ) +
      2
    );

  }


  // ====================================================
  // DRAW FRACTION
  // ====================================================

  function drawFraction(
    numerator,
    denominator,
    x,
    baseline,
    size,
    color = COLORS.text
  ) {

    const fractionSize =
      size *
      0.68;


    const safeNumerator =
      pdfSafeText(
        numerator
      );


    const safeDenominator =
      pdfSafeText(
        denominator
      );


    const topWidth =
      textWidth(
        safeNumerator,
        fractionSize
      );


    const bottomWidth =
      textWidth(
        safeDenominator,
        fractionSize
      );


    const width =
      Math.max(
        topWidth,
        bottomWidth
      ) +
      2;


    setFont(
      false,
      fractionSize,
      color
    );


    pdf.text(
      safeNumerator,

      x +
        (
          width -
          topWidth
        ) /
          2,

      baseline -
        2.2
    );


    pdf.setDrawColor(
      ...color
    );


    pdf.setLineWidth(
      0.2
    );


    pdf.line(
      x,
      baseline - 0.7,

      x + width,
      baseline - 0.7
    );


    setFont(
      false,
      fractionSize,
      color
    );


    pdf.text(
      safeDenominator,

      x +
        (
          width -
          bottomWidth
        ) /
          2,

      baseline +
        2.6
    );


    return (
      x +
      width
    );

  }


  // ====================================================
  // BUILD TEXT TOKENS
  // ====================================================

  function addTextTokens(
    tokens,
    value,
    size,
    bold
  ) {

    const superscriptParts =
      tokenizeSuperscripts(
        value
      );


    superscriptParts.forEach(
      (part) => {

        if (
          part.type ===
          "superscript"
        ) {

          const supSize =
            size *
            0.68;


          tokens.push({

            type:
              "superscript",

            value:
              part.value,

            width:
              textWidth(
                part.value,
                supSize,
                false
              ),

          });


          return;

        }


        const safe =
          pdfSafeText(
            part.value
          );


        safe
          .split(
            /(\s+)/
          )
          .forEach(
            (word) => {

              if (!word) {

                return;

              }


              const isSpace =
                /^\s+$/.test(
                  word
                );


              tokens.push({

                type:
                  isSpace
                    ? "space"
                    : "text",

                value:
                  word,

                width:
                  textWidth(
                    word,
                    size,
                    bold
                  ),

              });

            }
          );

      }
    );

  }


  // ====================================================
  // BUILD INLINE TOKENS
  // ====================================================

  function buildInlineTokens(
    rawLine,
    size,
    bold
  ) {

    const segments =
      getRenderableSegments(
        rawLine
      );


    const tokens = [];


    segments.forEach(
      (segment) => {

        const parts =
          tokenizeFractions(
            segment.value
          );


        parts.forEach(
          (part) => {

            if (
              part.type ===
              "fraction"
            ) {

              tokens.push({

                type:
                  "fraction",

                numerator:
                  part.numerator,

                denominator:
                  part.denominator,

                width:
                  fractionWidth(
                    part.numerator,
                    part.denominator,
                    size
                  ),

              });


              return;

            }


            addTextTokens(
              tokens,
              part.value,
              size,
              bold
            );

          }
        );

      }
    );


    return tokens;

  }


  // ====================================================
  // DRAW MIXED LINE
  // ====================================================

  function drawMixedLine(
    rawLine,
    options = {}
  ) {

    const {

      bold = false,

      size = 11,

      indent = 0,

      color =
        COLORS.text,

      maxWidth =
        CONTENT_WIDTH -
        indent,

    } = options;


    const tokens =
      buildInlineTokens(
        rawLine,
        size,
        bold
      );


    const startX =
      PAGE.marginLeft +
      indent;


    const maxX =
      Math.min(
        startX +
          maxWidth,

        PAGE.width -
          PAGE.marginRight
      );


    const lineHeight =
      size >= 16
        ? 8
        : size >= 13
          ? 7.5
          : 7;


    let x =
      startX;


    ensureSpace(
      lineHeight +
      4
    );


    function nextLine() {

      y +=
        lineHeight;


      ensureSpace(
        lineHeight +
        4
      );


      x =
        startX;

    }


    tokens.forEach(
      (token) => {

        if (
          token.type ===
          "space"
        ) {

          if (
            x ===
            startX
          ) {

            return;

          }


          if (
            x +
              token.width >
            maxX
          ) {

            nextLine();

            return;

          }


          x +=
            token.width;


          return;

        }


        if (
          x !==
            startX &&
          x +
            token.width >
            maxX
        ) {

          nextLine();

        }


        if (
          token.type ===
          "text"
        ) {

          setFont(
            bold,
            size,
            color
          );


          pdf.text(
            pdfSafeText(
              token.value
            ),
            x,
            y
          );


          x +=
            token.width;


          return;

        }


        if (
          token.type ===
          "superscript"
        ) {

          const supSize =
            size *
            0.68;


          setFont(
            false,
            supSize,
            color
          );


          pdf.text(
            token.value,
            x,
            y -
              size *
                0.23
          );


          x +=
            token.width;


          return;

        }


        if (
          token.type ===
          "fraction"
        ) {

          x =
            drawFraction(
              token.numerator,
              token.denominator,
              x,
              y,
              size,
              color
            ) +
            0.8;

        }

      }
    );


    y +=
      lineHeight;

  }


    // ====================================================
  // DRAW NYXORA SECTION HEADING
  // ====================================================

  function drawHeading(
    value,
    level = 2
  ) {

    const clean =
      removeHeadingMarker(
        value
      );


    const size =
      level <= 1
        ? 17
        : level === 2
          ? 14
          : 12;


    ensureSpace(
      20
    );


    y +=
      4;


    // ==================================================
    // MAIN SECTION HEADINGS
    // ==================================================

    if (
      level <= 2
    ) {

      // SOFT CARD BACKGROUND

      pdf.setFillColor(
        250,
        249,
        255
      );


      pdf.setDrawColor(
        ...COLORS.border
      );


      pdf.setLineWidth(
        0.2
      );


      pdf.roundedRect(
        PAGE.marginLeft,
        y - 6,

        CONTENT_WIDTH,
        11,

        2.5,
        2.5,

        "FD"
      );


      // FUCHSIA → VIOLET → CYAN LEFT ACCENT

      pdf.setFillColor(
        ...COLORS.fuchsia
      );


      pdf.roundedRect(
        PAGE.marginLeft,
        y - 6,

        1.2,
        3.7,

        0.5,
        0.5,

        "F"
      );


      pdf.setFillColor(
        ...COLORS.violet
      );


      pdf.rect(
        PAGE.marginLeft,
        y - 2.3,

        1.2,
        3.7,

        "F"
      );


      pdf.setFillColor(
        ...COLORS.cyan
      );


      pdf.roundedRect(
        PAGE.marginLeft,
        y + 1.4,

        1.2,
        3.6,

        0.5,
        0.5,

        "F"
      );


      // HEADING TEXT

      drawMixedLine(
        clean,
        {

          bold:
            true,

          size,

          indent:
            5,

          color:
            COLORS.darkViolet,

          maxWidth:
            CONTENT_WIDTH -
            8,

        }
      );

    } else {

      // ================================================
      // SMALL SUBHEADINGS
      // ================================================

      pdf.setFillColor(
        ...COLORS.cyan
      );


      pdf.circle(
        PAGE.marginLeft +
          1.2,

        y - 1.3,

        1,

        "F"
      );


      drawMixedLine(
        clean,
        {

          bold:
            true,

          size,

          indent:
            5,

          color:
            COLORS.secondary,

          maxWidth:
            CONTENT_WIDTH -
            5,

        }
      );

    }


    y +=
      3;

  }


  // ====================================================
  // DRAW BULLET
  // ====================================================

  function drawBullet(
    value
  ) {

    ensureSpace(
      9
    );


    const bulletY =
      y - 1.2;


    pdf.setFillColor(
      ...COLORS.primary
    );


    pdf.circle(
      PAGE.marginLeft +
        2,

      bulletY,

      1.05,

      "F"
    );


    drawMixedLine(
      getBulletText(
        value
      ),
      {

        size:
          11,

        indent:
          6,

        maxWidth:
          CONTENT_WIDTH -
          6,

      }
    );

  }


  // ====================================================
  // DRAW NUMBERED LIST
  // ====================================================

  function drawNumberedList(
    value
  ) {

    const parts =
      getNumberedParts(
        value
      );


    if (!parts) {

      drawMixedLine(
        value
      );


      return;

    }


    ensureSpace(
      9
    );


    setFont(
      true,
      10,
      COLORS.primary
    );


    pdf.text(
      parts.marker,
      PAGE.marginLeft,
      y
    );


    drawMixedLine(
      parts.text,
      {

        size:
          11,

        indent:
          8,

        maxWidth:
          CONTENT_WIDTH -
          8,

      }
    );

  }


   // ====================================================
  // DRAW NYXORA CALLOUT
  // ====================================================

  function drawCallout(
    callout
  ) {

    const label =
      callout.label
        .toLowerCase();


    // DEFAULT NYXORA STYLE

    let background =
      COLORS.softCyan;


    let accent =
      COLORS.cyan;


    // DEFINITION / FORMULA

    if (
      label ===
        "definition" ||
      label ===
        "formula"
    ) {

      background =
        COLORS.lightPrimary;

      accent =
        COLORS.violet;

    }


    // EXAMPLE

    if (
      label ===
        "example"
    ) {

      background =
        COLORS.softFuchsia;

      accent =
        COLORS.fuchsia;

    }


    // TIP / KEY POINT

    if (
      label ===
        "tip" ||
      label ===
        "key point"
    ) {

      background =
        COLORS.softCyan;

      accent =
        COLORS.cyan;

    }


    // REMEMBER / IMPORTANT

    if (
      label ===
        "remember" ||
      label ===
        "important"
    ) {

      background =
        COLORS.lightPrimary;

      accent =
        COLORS.violet;

    }


    // WARNING REMAINS SEMANTIC RED

    if (
      label ===
        "warning"
    ) {

      background =
        COLORS.lightRed;

      accent = [
        220,
        38,
        38,
      ];

    }


    const wrapped =
      pdf.splitTextToSize(
        pdfSafeText(
          callout.content
        ),
        CONTENT_WIDTH -
          16
      );


    const boxHeight =
      Math.max(
        19,
        13 +
          wrapped.length *
            5.5
      );


    ensureSpace(
      boxHeight +
      6
    );


    // BACKGROUND

    pdf.setFillColor(
      ...background
    );


    // SOFT BORDER

    pdf.setDrawColor(
      ...COLORS.border
    );


    pdf.setLineWidth(
      0.25
    );


    pdf.roundedRect(
      PAGE.marginLeft,
      y - 5,

      CONTENT_WIDTH,
      boxHeight,

      3,
      3,

      "FD"
    );


    // LEFT ACCENT

    pdf.setFillColor(
      ...accent
    );


    pdf.roundedRect(
      PAGE.marginLeft,
      y - 5,

      2,
      boxHeight,

      1,
      1,

      "F"
    );


    // SMALL ACCENT DOT

    pdf.setFillColor(
      ...accent
    );


    pdf.circle(
      PAGE.marginLeft +
        7,

      y,

      1.25,

      "F"
    );


    // LABEL

    setFont(
      true,
      9,
      accent
    );


    pdf.text(
      callout.label
        .toUpperCase(),

      PAGE.marginLeft +
        11,

      y + 1
    );


    y +=
      7;


    // CONTENT

    drawMixedLine(
      callout.content,
      {

        size:
          10.5,

        indent:
          7,

        color:
          COLORS.text,

        maxWidth:
          CONTENT_WIDTH -
          14,

      }
    );


    y +=
      5;

  }

    // ====================================================
  // DRAW NYXORA DIAGRAM
  // ====================================================

  function drawDiagram(
    diagram
  ) {

    const items =
      Array.isArray(
        diagram.items
      )

        ? diagram.items.filter(
            Boolean
          )

        : [];


    if (
      items.length === 0
    ) {

      return;

    }


    const visibleItems =
      items.slice(
        0,
        8
      );


    const boxHeight =
      17;


    const gap =
      8;


    const titleSpace =
      18;


    const totalHeight =
      titleSpace +
      visibleItems.length *
        boxHeight +
      Math.max(
        0,
        visibleItems.length -
          1
      ) *
        gap +
      10;


    ensureSpace(
      Math.min(
        totalHeight,
        115
      )
    );


    y +=
      4;


    // ==================================================
    // DIAGRAM TITLE
    // ==================================================

    pdf.setFillColor(
      ...COLORS.fuchsia
    );


    pdf.circle(
      PAGE.marginLeft +
        1.5,
      y - 1.2,
      1.3,
      "F"
    );


    setFont(
      true,
      12,
      COLORS.darkViolet
    );


    pdf.text(
      pdfSafeText(
        diagram.title ||
        "Diagram"
      ),
      PAGE.marginLeft +
        6,
      y
    );


    y +=
      9;


    // ==================================================
    // DIAGRAM ITEMS
    // ==================================================

    visibleItems.forEach(
      (
        item,
        index
      ) => {

        ensureSpace(
          boxHeight +
          gap +
          5
        );


        const x =
          PAGE.marginLeft +
          12;


        const width =
          CONTENT_WIDTH -
          24;


        // NYXORA ROTATING ACCENT

        const accent =
          index % 3 === 0
            ? COLORS.fuchsia
            : index % 3 === 1
              ? COLORS.violet
              : COLORS.cyan;


        // SOFT CARD BACKGROUND

        if (
          index % 3 === 0
        ) {

          pdf.setFillColor(
            ...COLORS.softFuchsia
          );

        } else if (
          index % 3 === 1
        ) {

          pdf.setFillColor(
            ...COLORS.lightPrimary
          );

        } else {

          pdf.setFillColor(
            ...COLORS.softCyan
          );

        }


        pdf.setDrawColor(
          ...COLORS.border
        );


        pdf.setLineWidth(
          0.25
        );


        pdf.roundedRect(
          x,
          y,

          width,
          boxHeight,

          3,
          3,

          "FD"
        );


        // LEFT ACCENT

        pdf.setFillColor(
          ...accent
        );


        pdf.roundedRect(
          x,
          y,

          2,
          boxHeight,

          1,
          1,

          "F"
        );


        // NUMBER CIRCLE

        pdf.setFillColor(
          ...accent
        );


        pdf.circle(
          x + 8,
          y +
            boxHeight / 2,

          3.3,

          "F"
        );


        setFont(
          true,
          8,
          COLORS.white
        );


        pdf.text(
          String(
            index + 1
          ),

          x + 8,

          y +
            boxHeight / 2 +
            1,

          {
            align:
              "center",
          }
        );


        // ITEM TEXT

        setFont(
          false,
          10,
          COLORS.text
        );


        const textLines =
          pdf.splitTextToSize(
            pdfSafeText(
              item
            ),
            width -
              24
          );


        pdf.text(
          textLines.slice(
            0,
            2
          ),
          x + 15,
          y + 6
        );


        y +=
          boxHeight;


        // ==============================================
        // CONNECTOR
        // ==============================================

        if (
          index <
          visibleItems.length -
            1
        ) {

          const connectorAccent =
            index % 3 === 0
              ? COLORS.fuchsia
              : index % 3 === 1
                ? COLORS.violet
                : COLORS.cyan;


          pdf.setDrawColor(
            ...connectorAccent
          );


          pdf.setLineWidth(
            0.45
          );


          pdf.line(
            PAGE.width / 2,
            y,

            PAGE.width / 2,
            y + gap - 2
          );


          // ARROW HEAD

          pdf.line(
            PAGE.width / 2,
            y + gap - 2,

            PAGE.width / 2 -
              1.5,
            y + gap - 4
          );


          pdf.line(
            PAGE.width / 2,
            y + gap - 2,

            PAGE.width / 2 +
              1.5,
            y + gap - 4
          );


          y +=
            gap;

        }

      }
    );


    y +=
      9;

  }


    // ====================================================
  // NYXORA AI HEADER
  // ====================================================

  // BRAND BADGE BACKGROUND

  pdf.setFillColor(
    ...COLORS.violet
  );


  pdf.roundedRect(
    PAGE.marginLeft,
    y - 6,

    38,
    10,

    2.5,
    2.5,

    "F"
  );


  // BRAND ACCENT DOT

  pdf.setFillColor(
    ...COLORS.cyan
  );


  pdf.circle(
    PAGE.marginLeft + 5,
    y - 1,

    1.5,

    "F"
  );


  // BRAND NAME

  setFont(
    true,
    9,
    COLORS.white
  );


  pdf.text(
    "NYXORA AI",
    PAGE.marginLeft + 21,
    y,

    {
      align:
        "center",
    }
  );


  // RIGHT SIDE LABEL

  setFont(
    true,
    7.5,
    COLORS.muted
  );


  pdf.text(
    "AI GENERATED DOCUMENT",
    PAGE.width -
      PAGE.marginRight,
    y,

    {
      align:
        "right",
    }
  );


  y +=
    11;


  // ====================================================
  // NYXORA THREE-COLOR ACCENT LINE
  // ====================================================

  const headerLineWidth =
    CONTENT_WIDTH / 3;


  pdf.setLineWidth(
    0.9
  );


  // FUCHSIA

  pdf.setDrawColor(
    ...COLORS.fuchsia
  );


  pdf.line(
    PAGE.marginLeft,
    y,

    PAGE.marginLeft +
      headerLineWidth,
    y
  );


  // VIOLET

  pdf.setDrawColor(
    ...COLORS.violet
  );


  pdf.line(
    PAGE.marginLeft +
      headerLineWidth,
    y,

    PAGE.marginLeft +
      headerLineWidth * 2,
    y
  );


  // CYAN

  pdf.setDrawColor(
    ...COLORS.cyan
  );


  pdf.line(
    PAGE.marginLeft +
      headerLineWidth * 2,
    y,

    PAGE.width -
      PAGE.marginRight,
    y
  );


  y +=
    13;



   // ====================================================
  // NYXORA DOCUMENT TITLE
  // ====================================================

  const cleanTitle =
    preparePdfContent(
      title
    );


  ensureSpace(
    35
  );


  // SMALL DOCUMENT LABEL

  setFont(
    true,
    7.5,
    COLORS.fuchsia
  );


  pdf.text(
    "NYXORA DOCUMENT",
    PAGE.marginLeft,
    y
  );


  y +=
    7;


  // MAIN TITLE

  setFont(
    true,
    22,
    COLORS.title
  );


  const titleLines =
    pdf.splitTextToSize(
      cleanTitle,
      CONTENT_WIDTH - 6
    );


  pdf.text(
    titleLines,
    PAGE.marginLeft,
    y
  );


  y +=
    titleLines.length *
      8.5 +
    4;


  // SMALL CYAN TITLE ACCENT

  pdf.setFillColor(
    ...COLORS.cyan
  );


  pdf.roundedRect(
    PAGE.marginLeft,
    y,

    18,
    1.3,

    0.6,
    0.6,

    "F"
  );


  y +=
    9;

    // ====================================================
  // NYXORA METADATA CARDS
  // ====================================================

  const metadata = [

    type
      ? {
          label:
            "TYPE",

          value:
            preparePdfContent(
              type
            ),

          accent:
            COLORS.fuchsia,
        }
      : null,

    subject
      ? {
          label:
            "SUBJECT",

          value:
            preparePdfContent(
              subject
            ),

          accent:
            COLORS.violet,
        }
      : null,

    chapter
      ? {
          label:
            "TOPIC",

          value:
            preparePdfContent(
              chapter
            ),

          accent:
            COLORS.cyan,
        }
      : null,

  ].filter(
    Boolean
  );


  if (
    metadata.length
  ) {

    const gap =
      4;


    const width =
      (
        CONTENT_WIDTH -
        gap *
          (
            metadata.length -
            1
          )
      ) /
      metadata.length;


    const height =
      19;


    ensureSpace(
      height +
      10
    );


    metadata.forEach(
      (
        item,
        index
      ) => {

        const x =
          PAGE.marginLeft +
          index *
            (
              width +
              gap
            );


        // CARD BACKGROUND

        pdf.setFillColor(
          250,
          249,
          255
        );


        // SOFT BORDER

        pdf.setDrawColor(
          ...COLORS.border
        );


        pdf.setLineWidth(
          0.25
        );


        pdf.roundedRect(
          x,
          y,

          width,
          height,

          2.5,
          2.5,

          "FD"
        );


        // TOP NYXORA ACCENT

        pdf.setFillColor(
          ...item.accent
        );


        pdf.roundedRect(
          x,
          y,

          width,
          1.2,

          0.6,
          0.6,

          "F"
        );


        // LABEL

        setFont(
          true,
          7,
          item.accent
        );


        pdf.text(
          item.label,
          x + 4,
          y + 6
        );


        // VALUE

        setFont(
          true,
          9,
          COLORS.text
        );


        const valueLines =
          pdf.splitTextToSize(
            pdfSafeText(
              item.value
            ),
            width - 8
          );


        pdf.text(
          valueLines.slice(
            0,
            2
          ),
          x + 4,
          y + 12
        );

      }
    );


    y +=
      height +
      11;

  }

  // ====================================================
  // CONTENT
  // ====================================================

  const preparedContent =
    cleanMarkdownPreserveMath(
      content
    );


  const blocks =
    parseDiagramBlocks(
      preparedContent
    );


  blocks.forEach(
    (block) => {

      if (
        block.type ===
        "diagram"
      ) {

        drawDiagram(
          block.diagram
        );


        return;

      }


      const rawLine =
        block.value;


      const line =
        rawLine.trim();


      if (!line) {

        y +=
          4;


        ensureSpace(
          5
        );


        return;

      }


      const callout =
        getCallout(
          line
        );


      if (callout) {

        drawCallout(
          callout
        );


        return;

      }


      if (
        isMarkdownHeading(
          line
        )
      ) {

        drawHeading(
          line,
          getHeadingLevel(
            line
          )
        );


        return;

      }


      if (
        isSectionHeading(
          line
        )
      ) {

        drawHeading(
          line,
          2
        );


        return;

      }


      if (
        isBulletLine(
          line
        )
      ) {

        drawBullet(
          line
        );


        return;

      }


      if (
        isQuestionLine(
          line
        )
      ) {

        ensureSpace(
          12
        );


        drawMixedLine(
          line,
          {

            bold:
              true,

            size:
              11,

            color:
              COLORS.title,

          }
        );


        y +=
          1;


        return;

      }


      if (
        isNumberedListLine(
          line
        )
      ) {

        drawNumberedList(
          line
        );


        return;

      }


      if (
        isOptionLine(
          line
        )
      ) {

        drawMixedLine(
          line,
          {

            size:
              10.5,

            indent:
              5,

            maxWidth:
              CONTENT_WIDTH -
              5,

          }
        );


        return;

      }


      drawMixedLine(
        line,
        {

          size:
            11,

        }
      );


      y +=
        1;

    }
  );


    // ====================================================
  // NYXORA PDF FOOTERS
  // ====================================================

  const totalPages =
    pdf.getNumberOfPages();


  for (
    let pageNumber = 1;
    pageNumber <= totalPages;
    pageNumber += 1
  ) {

    pdf.setPage(
      pageNumber
    );


    // ==================================================
    // THREE-COLOR NYXORA FOOTER ACCENT
    // ==================================================

    const footerLineWidth =
      CONTENT_WIDTH / 3;


    pdf.setLineWidth(
      0.45
    );


    // FUCHSIA

    pdf.setDrawColor(
      ...COLORS.fuchsia
    );


    pdf.line(
      PAGE.marginLeft,
      PAGE.height - 16,

      PAGE.marginLeft +
        footerLineWidth,
      PAGE.height - 16
    );


    // VIOLET

    pdf.setDrawColor(
      ...COLORS.violet
    );


    pdf.line(
      PAGE.marginLeft +
        footerLineWidth,
      PAGE.height - 16,

      PAGE.marginLeft +
        footerLineWidth * 2,
      PAGE.height - 16
    );


    // CYAN

    pdf.setDrawColor(
      ...COLORS.cyan
    );


    pdf.line(
      PAGE.marginLeft +
        footerLineWidth * 2,
      PAGE.height - 16,

      PAGE.width -
        PAGE.marginRight,
      PAGE.height - 16
    );


    // ==================================================
    // LEFT BRAND
    // ==================================================

    pdf.setFillColor(
      ...COLORS.violet
    );


    pdf.circle(
      PAGE.marginLeft + 1.5,
      PAGE.height - 9.5,
      1.2,
      "F"
    );


    setFont(
      true,
      8,
      COLORS.darkViolet
    );


    pdf.text(
      "NYXORA AI",
      PAGE.marginLeft + 5,
      PAGE.height - 8.5
    );


    // SMALL BRAND DESCRIPTION

    setFont(
      false,
      7,
      COLORS.muted
    );


    pdf.text(
      "AI-powered document",
      PAGE.marginLeft + 5,
      PAGE.height - 5
    );


    // ==================================================
    // PAGE NUMBER
    // ==================================================

    setFont(
      true,
      7.5,
      COLORS.violet
    );


    pdf.text(
      `${pageNumber} / ${totalPages}`,

      PAGE.width -
        PAGE.marginRight,

      PAGE.height - 8,

      {
        align:
          "right",
      }
    );

  }


  return pdf;
   
   }

// ======================================================
// HINDI CONTENT PREPARATION
// ======================================================

function prepareHindiContent(value) {

  return cleanMarkdownPreserveMath(
    safeText(value)
  )

    .replace(
      FRACTION_PATTERN,
      "$1/$2"
    )

    .trim();

}


// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHtml(value) {

  return safeText(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// ======================================================
// HINDI CALLOUT HTML — NYXORA THEME
// ======================================================

function createHindiCalloutHtml(
  callout
) {

  const label =
    callout.label
      .toLowerCase();


  // DEFAULT — CYAN

  let background =
    "#ecfeff";

  let accent =
    "#06b6d4";


  // DEFINITION / FORMULA — VIOLET

  if (
    label ===
      "definition" ||
    label ===
      "formula"
  ) {

    background =
      "#f5f3ff";

    accent =
      "#8b5cf6";

  }


  // EXAMPLE — FUCHSIA

  if (
    label ===
    "example"
  ) {

    background =
      "#fdf4ff";

    accent =
      "#d946ef";

  }


  // TIP / KEY POINT — CYAN

  if (
    label ===
      "tip" ||
    label ===
      "key point"
  ) {

    background =
      "#ecfeff";

    accent =
      "#06b6d4";

  }


  // REMEMBER / IMPORTANT — VIOLET

  if (
    label ===
      "remember" ||
    label ===
      "important"
  ) {

    background =
      "#f5f3ff";

    accent =
      "#8b5cf6";

  }


  // WARNING — RED

  if (
    label ===
    "warning"
  ) {

    background =
      "#fef2f2";

    accent =
      "#dc2626";

  }


  return `
    <div
      style="
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        margin: 15px 0;
        padding: 14px 16px 14px 19px;
        background: ${background};
        border: 1px solid #e2e8f0;
        border-radius: 10px;
      "
    >

      <div
        style="
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: ${accent};
        "
      ></div>


      <div
        style="
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 6px;
        "
      >

        <div
          style="
            width: 7px;
            height: 7px;
            flex: 0 0 7px;
            border-radius: 50%;
            background: ${accent};
          "
        ></div>


        <div
          style="
            color: ${accent};
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          "
        >
          ${escapeHtml(
            callout.label
          )}
        </div>

      </div>


      <div
        style="
          color: #1f2937;
          font-size: 15px;
          line-height: 1.7;
        "
      >
        ${escapeHtml(
          callout.content
        )}
      </div>

    </div>
  `;

}

// ======================================================
// HINDI LINE HTML
// ======================================================

function createHindiLineHtml(
  rawLine
) {

  const line =
    safeText(rawLine)
      .trim();


  if (!line) {

    return `
      <div
        style="
          height: 10px;
        "
      ></div>
    `;

  }


  const callout =
    getCallout(
      line
    );


  if (callout) {

    return createHindiCalloutHtml(
      callout
    );

  }


    if (
    isMarkdownHeading(
      line
    ) ||
    isSectionHeading(
      line
    )
  ) {

    const clean =
      removeHeadingMarker(
        line
      );


    return `
      <div
        style="
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          margin-top: 20px;
          margin-bottom: 11px;
          padding: 11px 15px 11px 19px;
          background: #faf9ff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #312e81;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.55;
        "
      >

        <div
          style="
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            display: flex;
            flex-direction: column;
          "
        >

          <div
            style="
              flex: 1;
              background: #d946ef;
            "
          ></div>

          <div
            style="
              flex: 1;
              background: #8b5cf6;
            "
          ></div>

          <div
            style="
              flex: 1;
              background: #06b6d4;
            "
          ></div>

        </div>


        ${escapeHtml(
          clean
        )}

      </div>
    `;

  }


    if (
    isBulletLine(
      line
    )
  ) {

    return `
      <div
        style="
          display: flex;
          gap: 11px;
          align-items: flex-start;
          margin: 8px 0;
          padding-left: 4px;
          font-size: 15px;
          line-height: 1.7;
          color: #1f2937;
        "
      >

        <div
          style="
            margin-top: 8px;
            width: 8px;
            height: 8px;
            flex: 0 0 8px;
            box-sizing: border-box;
            border-radius: 50%;
            background: #8b5cf6;
            border: 2px solid #ede9fe;
          "
        ></div>


        <div
          style="
            flex: 1;
            min-width: 0;
          "
        >
          ${escapeHtml(
            getBulletText(
              line
            )
          )}
        </div>

      </div>
    `;

  }


    if (
    isQuestionLine(
      line
    )
  ) {

    return `
      <div
        style="
          position: relative;
          margin-top: 12px;
          margin-bottom: 7px;
          padding: 9px 12px;
          background: #faf9ff;
          border: 1px solid #ede9fe;
          border-radius: 8px;
          color: #1e293b;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.7;
        "
      >

        <div
          style="
            position: absolute;
            left: 0;
            top: 7px;
            bottom: 7px;
            width: 3px;
            border-radius: 999px;
            background: #8b5cf6;
          "
        ></div>


        <div
          style="
            padding-left: 5px;
          "
        >
          ${escapeHtml(
            line
          )}
        </div>

      </div>
    `;

  }

    if (
    isOptionLine(
      line
    )
  ) {

    return `
      <div
        style="
          display: flex;
          align-items: flex-start;
          margin: 6px 0 6px 18px;
          padding: 7px 11px;
          background: #fcfcff;
          border: 1px solid #f1f5f9;
          border-radius: 7px;
          color: #334155;
          font-size: 15px;
          line-height: 1.7;
        "
      >
        ${escapeHtml(
          line
        )}
      </div>
    `;

    }


  return `
    <div
      style="
        font-size: 15px;
        margin-bottom: 7px;
        line-height: 1.75;
        color: #1f2937;
      "
    >
      ${escapeHtml(
        line
      )}
    </div>
  `;

}


// ======================================================
// HINDI DIAGRAM HTML — NYXORA THEME
// ======================================================
function createHindiDiagramHtml(
  diagram
) {

  const items =
    Array.isArray(
      diagram.items
    )

      ? diagram.items
          .filter(
            Boolean
          )
          .slice(
            0,
            8
          )

      : [];


  if (
    items.length === 0
  ) {

    return "";

  }


  const itemsHtml =
    items
      .map(
        (
          item,
          index
        ) => {

          const accent =
            index % 3 === 0
              ? "#d946ef"
              : index % 3 === 1
                ? "#8b5cf6"
                : "#06b6d4";


          const background =
            index % 3 === 0
              ? "#fdf4ff"
              : index % 3 === 1
                ? "#f5f3ff"
                : "#ecfeff";


          return `

            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >

              <div
                style="
                  position: relative;
                  width: 84%;
                  box-sizing: border-box;
                  overflow: hidden;
                  padding: 14px 16px 14px 20px;
                  background: ${background};
                  border: 1px solid #e2e8f0;
                  border-radius: 11px;
                  display: flex;
                  align-items: center;
                  gap: 13px;
                "
              >

                <!-- LEFT ACCENT -->

                <div
                  style="
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: ${accent};
                  "
                ></div>


                <!-- STEP NUMBER -->

                <div
                  style="
                    width: 29px;
                    height: 29px;
                    flex: 0 0 29px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: ${accent};
                    color: #ffffff;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    font-weight: 700;
                  "
                >
                  ${index + 1}
                </div>


                <!-- STEP TEXT -->

                <div
                  style="
                    flex: 1;
                    min-width: 0;
                    color: #1f2937;
                    font-size: 15px;
                    line-height: 1.6;
                    overflow-wrap: break-word;
                  "
                >
                  ${escapeHtml(
                    item
                  )}
                </div>

              </div>


              ${
                index <
                items.length - 1

                  ? `
                    <div
                      style="
                        width: 2px;
                        height: 18px;
                        background: ${accent};
                      "
                    ></div>

                    <div
                      style="
                        margin-top: -6px;
                        margin-bottom: 2px;
                        color: ${accent};
                        font-family: Arial, sans-serif;
                        font-size: 18px;
                        font-weight: 700;
                        line-height: 16px;
                      "
                    >
                      ↓
                    </div>
                  `

                  : ""
              }

            </div>

          `;

        }
      )
      .join("");


  return `
    <div
      style="
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        margin: 22px 0;
        padding: 19px 18px 20px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #ffffff;
      "
    >

      <!-- TOP NYXORA ACCENT -->

      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          height: 3px;
        "
      >

        <div
          style="
            flex: 1;
            background: #d946ef;
          "
        ></div>

        <div
          style="
            flex: 1;
            background: #8b5cf6;
          "
        ></div>

        <div
          style="
            flex: 1;
            background: #06b6d4;
          "
        ></div>

      </div>


      <!-- DIAGRAM TITLE -->

      <div
        style="
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 18px;
        "
      >

        <div
          style="
            width: 8px;
            height: 8px;
            flex: 0 0 8px;
            border-radius: 50%;
            background: #d946ef;
          "
        ></div>


        <div
          style="
            color: #312e81;
            font-size: 18px;
            font-weight: 700;
            line-height: 1.5;
          "
        >
          ${escapeHtml(
            diagram.title ||
            "Diagram"
          )}
        </div>

      </div>


      ${itemsHtml}

    </div>
  `;

}
// ======================================================
// HINDI CONTENT HTML
// ======================================================

function createHindiContentHtml(
  content
) {

  const blocks =
    parseDiagramBlocks(
      prepareHindiContent(
        content
      )
    );


  return blocks
    .map(
      (block) => {

        if (
          block.type ===
          "diagram"
        ) {

          return createHindiDiagramHtml(
            block.diagram
          );

        }


        return createHindiLineHtml(
          block.value
        );

      }
    )
    .join("");

}


// ======================================================
// WAIT FOR HINDI FONT
// ======================================================

async function waitForHindiFont() {

  try {

    const fontFace =
      new FontFace(
        "NyxoraDevanagari",
        `url("${DEVANAGARI_FONT_URL}")`
      );


    const loadedFont =
      await fontFace.load();


    document.fonts.add(
      loadedFont
    );


    await document.fonts.ready;


    return true;

  } catch (error) {

    console.error(
      "Hindi font loading error:",
      error
    );


    return false;

  }

}


// ======================================================
// CREATE HINDI HTML ELEMENT
// ======================================================

function createHindiPdfElement(
  documentData
) {

  const {

    title =
      "Nyxora Document",

    type = "",

    subject = "",

    chapter = "",

    content = "",

  } = documentData;


  const container =
    document.createElement(
      "div"
    );


  container.style.position =
    "fixed";

  container.style.left =
    "-10000px";

  container.style.top =
    "0";

  container.style.width =
    "794px";

  container.style.background =
    "#ffffff";

  container.style.color =
    "#1f2937";

  container.style.padding =
    "68px";

  container.style.boxSizing =
    "border-box";

  container.style.fontFamily =
    '"NyxoraDevanagari", "Noto Sans Devanagari", Arial, sans-serif';

  container.style.fontWeight =
    "400";

  container.style.textAlign =
    "left";


  const contentHtml =
    createHindiContentHtml(
      content
    );


  const metadata = [

    type
      ? {
          label:
            "TYPE",

          value:
            prepareHindiContent(
              type
            ),
        }
      : null,

    subject
      ? {
          label:
            "SUBJECT",

          value:
            prepareHindiContent(
              subject
            ),
        }
      : null,

    chapter
      ? {
          label:
            "TOPIC",

          value:
            prepareHindiContent(
              chapter
            ),
        }
      : null,

  ].filter(
    Boolean
  );


    const metadataHtml =
    metadata
      .map(
        (item, index) => {

          const accent =
            index === 0
              ? "#d946ef"
              : index === 1
                ? "#8b5cf6"
                : "#06b6d4";


          const background =
            index === 0
              ? "#fdf4ff"
              : index === 1
                ? "#f5f3ff"
                : "#ecfeff";


          return `
            <div
              style="
                position: relative;
                flex: 1;
                min-width: 0;
                overflow: hidden;
                box-sizing: border-box;
                padding: 14px 14px 13px;
                background: ${background};
                border: 1px solid #e2e8f0;
                border-radius: 10px;
              "
            >

              <div
                style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 3px;
                  background: ${accent};
                "
              ></div>


              <div
                style="
                  color: ${accent};
                  font-family: Arial, sans-serif;
                  font-size: 10px;
                  font-weight: 700;
                  letter-spacing: 0.7px;
                  margin-bottom: 6px;
                "
              >
                ${item.label}
              </div>


              <div
                style="
                  color: #1f2937;
                  font-size: 13px;
                  font-weight: 600;
                  line-height: 1.5;
                  overflow-wrap: break-word;
                "
              >
                ${escapeHtml(
                  item.value
                )}
              </div>

            </div>
          `;

        }
      )
      .join("");


  container.innerHTML = `

    <div
      style="
        font-family:
          'NyxoraDevanagari',
          'Noto Sans Devanagari',
          Arial,
          sans-serif;
      "
    >

            <div
        style="
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        "
      >

        <div
          style="
            width: 32px;
            height: 32px;
            flex: 0 0 32px;
            border-radius: 50%;
            background: linear-gradient(
              135deg,
              #d946ef,
              #8b5cf6,
              #06b6d4
            );
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: Arial, sans-serif;
            font-size: 15px;
            font-weight: 700;
          "
        >
          N
        </div>


        <div>

          <div
            style="
              color: #312e81;
              font-family: Arial, sans-serif;
              font-size: 15px;
              font-weight: 700;
            "
          >
            NYXORA AI
          </div>

          <div
            style="
              margin-top: 2px;
              color: #64748b;
              font-family: Arial, sans-serif;
              font-size: 9px;
              font-weight: 500;
              letter-spacing: 0.6px;
            "
          >
            AI-POWERED DOCUMENT
          </div>

        </div>

      </div>


      <div
        style="
          display: flex;
          height: 3px;
          overflow: hidden;
          border-radius: 999px;
          margin-bottom: 27px;
        "
      >

        <div
          style="
            flex: 1;
            background: #d946ef;
          "
        ></div>

        <div
          style="
            flex: 1;
            background: #8b5cf6;
          "
        ></div>

        <div
          style="
            flex: 1;
            background: #06b6d4;
          "
        ></div>

      </div>


      <div
        style="
          color: #1e293b;
          font-size: 29px;
          font-weight: 700;
          line-height: 1.45;
          margin-bottom: 18px;
        "
      >
        ${escapeHtml(
          prepareHindiContent(
            title
          )
        )}
      </div>


      ${
        metadata.length

          ? `
            <div
              style="
                display: flex;
                gap: 9px;
                margin-bottom: 27px;
              "
            >
              ${metadataHtml}
            </div>
          `

          : ""
      }


      <div
        style="
          font-size: 15px;
          line-height: 1.75;
          white-space: normal;
          overflow-wrap: break-word;
          word-break: normal;
        "
      >
        ${contentHtml}
      </div>

    </div>

  `;


  document.body.appendChild(
    container
  );


  return container;

}


// ======================================================
// GENERATE HINDI PDF
//
// EXISTING BROWSER SHAPING PATH PRESERVED
// ======================================================

async function generateHindiWorkspacePdf(
  documentData = {}
) {

  await waitForHindiFont();


  const element =
    createHindiPdfElement(
      documentData
    );


  try {

    const canvas =
      await html2canvas(
        element,
        {

          scale:
            2,

          backgroundColor:
            "#ffffff",

          useCORS:
            true,

          logging:
            false,

          windowWidth:
            794,

        }
      );


    const pdf =
      new jsPDF({

        orientation:
          "portrait",

        unit:
          "mm",

        format:
          "a4",

      });


    const imageData =
      canvas.toDataURL(
        "image/png"
      );


    const pageWidth =
      PAGE.width;


    const pageHeight =
      PAGE.height;


    const marginX =
      PAGE.marginLeft;


    const marginTop =
      14;


    const marginBottom =
      16;


    const usableWidth =
      pageWidth -
      marginX * 2;


    const usableHeight =
      pageHeight -
      marginTop -
      marginBottom;


    const imageWidth =
      usableWidth;


    const imageHeight =
      (
        canvas.height *
        imageWidth
      ) /
      canvas.width;


    // ==================================================
    // SINGLE PAGE
    // ==================================================

    if (
      imageHeight <=
      usableHeight
    ) {

      pdf.addImage(
        imageData,
        "PNG",

        marginX,
        marginTop,

        imageWidth,
        imageHeight,

        undefined,
        "FAST"
      );

    } else {

      // =================================================
      // MULTI PAGE
      //
      // EXISTING CANVAS SLICING PRESERVED
      // =================================================

      const pageCanvasHeight =
        Math.floor(
          canvas.width *
          usableHeight /
          imageWidth
        );


      let sourceY =
        0;


      let pageNumber =
        0;


      while (
        sourceY <
        canvas.height
      ) {

        if (
          pageNumber >
          0
        ) {

          pdf.addPage();

        }


        const sliceHeight =
          Math.min(
            pageCanvasHeight,
            canvas.height -
              sourceY
          );


        const pageCanvas =
          document.createElement(
            "canvas"
          );


        pageCanvas.width =
          canvas.width;


        pageCanvas.height =
          sliceHeight;


        const context =
          pageCanvas.getContext(
            "2d"
          );


        context.fillStyle =
          "#ffffff";


        context.fillRect(
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );


        context.drawImage(
          canvas,

          0,
          sourceY,
          canvas.width,
          sliceHeight,

          0,
          0,
          canvas.width,
          sliceHeight
        );


        const pageImage =
          pageCanvas.toDataURL(
            "image/png"
          );


        const renderedHeight =
          (
            sliceHeight *
            imageWidth
          ) /
          canvas.width;


        pdf.addImage(
          pageImage,
          "PNG",

          marginX,
          marginTop,

          imageWidth,
          renderedHeight,

          undefined,
          "FAST"
        );


        sourceY +=
          sliceHeight;


        pageNumber +=
          1;

      }

    }


        // ==================================================
    // NYXORA HINDI PDF FOOTERS
    // ==================================================

    const totalPages =
      pdf.getNumberOfPages();


    for (
      let pageNumber = 1;
      pageNumber <= totalPages;
      pageNumber += 1
    ) {

      pdf.setPage(
        pageNumber
      );


      // ================================================
      // FUCHSIA → VIOLET → CYAN FOOTER ACCENT
      // ================================================

      const footerLineWidth =
        CONTENT_WIDTH / 3;


      pdf.setLineWidth(
        0.45
      );


      // FUCHSIA

      pdf.setDrawColor(
        217,
        70,
        239
      );


      pdf.line(
        PAGE.marginLeft,
        PAGE.height - 15,

        PAGE.marginLeft +
          footerLineWidth,
        PAGE.height - 15
      );


      // VIOLET

      pdf.setDrawColor(
        139,
        92,
        246
      );


      pdf.line(
        PAGE.marginLeft +
          footerLineWidth,
        PAGE.height - 15,

        PAGE.marginLeft +
          footerLineWidth * 2,
        PAGE.height - 15
      );


      // CYAN

      pdf.setDrawColor(
        6,
        182,
        212
      );


      pdf.line(
        PAGE.marginLeft +
          footerLineWidth * 2,
        PAGE.height - 15,

        PAGE.width -
          PAGE.marginRight,
        PAGE.height - 15
      );


      // ================================================
      // NYXORA BRAND
      // ================================================

      pdf.setFillColor(
        139,
        92,
        246
      );


      pdf.circle(
        PAGE.marginLeft + 1.5,
        PAGE.height - 9,
        1.2,
        "F"
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.setFontSize(
        8
      );


      pdf.setTextColor(
        76,
        29,
        149
      );


      pdf.text(
        "NYXORA AI",

        PAGE.marginLeft + 5,

        PAGE.height - 8
      );


      // ================================================
      // BRAND DESCRIPTION
      // ================================================

      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        7
      );


      pdf.setTextColor(
        100,
        116,
        139
      );


      pdf.text(
        "AI-powered document",

        PAGE.marginLeft + 5,

        PAGE.height - 4.8
      );


      // ================================================
      // PAGE NUMBER
      // ================================================

      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.setFontSize(
        7.5
      );


      pdf.setTextColor(
        124,
        58,
        237
      );


      pdf.text(
        `${pageNumber} / ${totalPages}`,

        PAGE.width -
          PAGE.marginRight,

        PAGE.height - 7.5,

        {
          align:
            "right",
        }
      );

    }


    return pdf;

  } finally {

    element.remove();

  }

}


// ======================================================
// GENERATE CORRECT PDF PATH
// ======================================================

async function generateFinalWorkspacePdf(
  documentData = {}
) {

  if (
    documentContainsDevanagari(
      documentData
    )
  ) {

    return generateHindiWorkspacePdf(
      documentData
    );

  }


  return generateWorkspacePdf(
    documentData
  );

}


// ======================================================
// DOWNLOAD
// ======================================================

export async function downloadWorkspacePdf(
  documentData
) {

  const pdf =
    await generateFinalWorkspacePdf(
      documentData
    );


  pdf.save(
    createFileName(
      documentData?.title
    )
  );

}


// ======================================================
// PREVIEW
// ======================================================

export async function createWorkspacePdfUrl(
  documentData
) {

  const pdf =
    await generateFinalWorkspacePdf(
      documentData
    );


  const blob =
    pdf.output(
      "blob"
    );


  return URL.createObjectURL(
    blob
  );

}