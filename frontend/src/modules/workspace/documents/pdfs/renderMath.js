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
// HTML ENTITIES
// ======================================================

function decodeEntities(value) {

  return safeText(value)

    .replace(
      /&nbsp;/gi,
      " "
    )

    .replace(
      /&amp;/gi,
      "&"
    )

    .replace(
      /&lt;/gi,
      "<"
    )

    .replace(
      /&gt;/gi,
      ">"
    )

    .replace(
      /&quot;/gi,
      '"'
    )

    .replace(
      /&#39;/gi,
      "'"
    );
}


// ======================================================
// CLEAN MARKDOWN
//
// IMPORTANT:
// Math delimiters are preserved here so mathematical
// expressions can still be processed afterwards.
// ======================================================

export function cleanMarkdownPreserveMath(
  value
) {

  let text =
    decodeEntities(
      value
    )

      .replace(
        /\r\n/g,
        "\n"
      )

      .replace(
        /\r/g,
        "\n"
      );


  // ----------------------------------------------------
  // CODE BLOCK MARKERS
  // ----------------------------------------------------

  text =
    text

      .replace(
        /```[\w-]*\n?/g,
        ""
      )

      .replace(
        /```/g,
        ""
      );


  // ----------------------------------------------------
  // HORIZONTAL RULES
  // ----------------------------------------------------

  text =
    text.replace(
      /^\s*(?:---+|\*\*\*+|___+)\s*$/gm,
      ""
    );


  // ----------------------------------------------------
  // HEADINGS
  //
  // ### Section A
  // ->
  // Section A
  // ----------------------------------------------------

  text =
    text.replace(
      /^\s*#{1,6}\s*/gm,
      ""
    );


  // ----------------------------------------------------
  // BOLD
  //
  // **Q1.**
  // ->
  // Q1.
  // ----------------------------------------------------

  text =
    text

      .replace(
        /\*\*([^*\n]+)\*\*/g,
        "$1"
      )

      .replace(
        /__([^_\n]+)__/g,
        "$1"
      );


  // ----------------------------------------------------
  // STRIKETHROUGH
  // ----------------------------------------------------

  text =
    text.replace(
      /~~([^~\n]+)~~/g,
      "$1"
    );


  // ----------------------------------------------------
  // INLINE CODE
  // ----------------------------------------------------

  text =
    text.replace(
      /`([^`\n]+)`/g,
      "$1"
    );


  // ----------------------------------------------------
  // BLOCK QUOTES
  // ----------------------------------------------------

  text =
    text.replace(
      /^\s*>\s?/gm,
      ""
    );


  // ----------------------------------------------------
  // MARKDOWN LINKS
  // ----------------------------------------------------

  text =
    text.replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      "$1"
    );


  // ----------------------------------------------------
  // BULLETS
  // ----------------------------------------------------

  text =
    text.replace(
      /^\s*[-*]\s+/gm,
      "• "
    );


  // ----------------------------------------------------
  // REMAINING MARKDOWN EMPHASIS
  //
  // *(2 Marks)*
  // ->
  // (2 Marks)
  // ----------------------------------------------------

  text =
    text.replace(
      /(?<!\\)\*/g,
      ""
    );


  // ----------------------------------------------------
  // CLEAN EXTRA BLANK LINES
  // ----------------------------------------------------

  return text

    .split(
      "\n"
    )

    .map(
      (line) =>
        line.trimEnd()
    )

    .join(
      "\n"
    )

    .replace(
      /\n{3,}/g,
      "\n\n"
    )

    .trim();
}


// ======================================================
// STRIP MATH DELIMITERS
//
// $x$
// $$x$$
// \(x\)
// \[x\]
//
// become:
//
// x
// ======================================================

export function stripMathDelimiters(
  value
) {

  const text =
    safeText(
      value
    ).trim();


  if (
    text.startsWith(
      "$$"
    ) &&
    text.endsWith(
      "$$"
    )
  ) {

    return text
      .slice(
        2,
        -2
      )
      .trim();
  }


  if (
    text.startsWith(
      "\\["
    ) &&
    text.endsWith(
      "\\]"
    )
  ) {

    return text
      .slice(
        2,
        -2
      )
      .trim();
  }


  if (
    text.startsWith(
      "\\("
    ) &&
    text.endsWith(
      "\\)"
    )
  ) {

    return text
      .slice(
        2,
        -2
      )
      .trim();
  }


  if (
    text.startsWith(
      "$"
    ) &&
    text.endsWith(
      "$"
    )
  ) {

    return text
      .slice(
        1,
        -1
      )
      .trim();
  }


  return text;
}


// ======================================================
// TOKENIZE MATH CONTENT
// ======================================================

export function tokenizeMathContent(
  value
) {

  const text =
    safeText(
      value
    );


  const pattern =
    /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]*?\$)/g;


  const tokens = [];


  let lastIndex = 0;

  let match;


  while (
    (
      match =
        pattern.exec(
          text
        )
    ) !== null
  ) {

    // --------------------------------------------------
    // NORMAL TEXT BEFORE MATH
    // --------------------------------------------------

    if (
      match.index >
      lastIndex
    ) {

      tokens.push({
        type:
          "text",

        content:
          text.slice(
            lastIndex,
            match.index
          ),
      });
    }


    const raw =
      match[0];


    // --------------------------------------------------
    // MATH TOKEN
    // --------------------------------------------------

    tokens.push({
      type:
        "math",

      content:
        stripMathDelimiters(
          raw
        ),

      displayMode:
        raw.startsWith(
          "$$"
        ) ||
        raw.startsWith(
          "\\["
        ),
    });


    lastIndex =
      pattern.lastIndex;
  }


  // ----------------------------------------------------
  // REMAINING TEXT
  // ----------------------------------------------------

  if (
    lastIndex <
    text.length
  ) {

    tokens.push({
      type:
        "text",

      content:
        text.slice(
          lastIndex
        ),
    });
  }


  return tokens;
}


// ======================================================
// READ BALANCED LATEX GROUP
//
// Example:
//
// {12}
//
// returns:
//
// {
//   content: "12",
//   endIndex: ...
// }
// ======================================================

function readGroup(
  source,
  startIndex
) {

  if (
    source[
      startIndex
    ] !== "{"
  ) {
    return null;
  }


  let depth = 0;


  for (
    let index =
      startIndex;

    index <
    source.length;

    index += 1
  ) {

    const character =
      source[index];


    if (
      character === "{"
    ) {

      depth += 1;
    }


    if (
      character === "}"
    ) {

      depth -= 1;


      if (
        depth === 0
      ) {

        return {
          content:
            source.slice(
              startIndex + 1,
              index
            ),

          endIndex:
            index,
        };
      }
    }
  }


  return null;
}


// ======================================================
// FRACTIONS
//
// \frac{1}{4}
//
// becomes:
//
// [[FRAC:1|4]]
//
// Your PDF renderer can continue using the existing
// fraction marker logic.
// ======================================================

function convertFractions(
  value
) {

  const source =
    safeText(
      value
    );


  let result = "";


  for (
    let index = 0;

    index <
    source.length;

    index += 1
  ) {

    if (
      source.startsWith(
        "\\frac",
        index
      )
    ) {

      let cursor =
        index + 5;


      // Skip spaces

      while (
        source[
          cursor
        ] === " "
      ) {

        cursor += 1;
      }


      // Numerator

      const numerator =
        readGroup(
          source,
          cursor
        );


      if (
        !numerator
      ) {

        result +=
          source[index];

        continue;
      }


      cursor =
        numerator.endIndex +
        1;


      // Skip spaces

      while (
        source[
          cursor
        ] === " "
      ) {

        cursor += 1;
      }


      // Denominator

      const denominator =
        readGroup(
          source,
          cursor
        );


      if (
        !denominator
      ) {

        result +=
          source[index];

        continue;
      }


      result +=
        `[[FRAC:${
          latexToReadableText(
            numerator.content
          )
        }|${
          latexToReadableText(
            denominator.content
          )
        }]]`;


      index =
        denominator.endIndex;


      continue;
    }


    result +=
      source[index];
  }


  return result;
}


// ======================================================
// SUPERSCRIPT MAP
//
// IMPORTANT:
// NO [[SUP:...]] MARKERS.
//
// Numeric powers become real Unicode superscripts.
//
// 5^5    -> 5⁵
// 5^-3   -> 5⁻³
// x^2    -> x²
//
// Unicode does not contain superscript versions of
// every alphabetic character. For unsupported letters,
// we keep the readable character rather than exposing
// an internal marker.
// ======================================================

const SUPERSCRIPT_MAP = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",

  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",

  "i": "ⁱ",
  "n": "ⁿ",
};


// ======================================================
// TO SUPERSCRIPT
// ======================================================

function toSuperscript(
  value
) {

  const source =
    safeText(
      value
    ).trim();


  let result = "";


  for (
    const character
    of source
  ) {

    result +=
      SUPERSCRIPT_MAP[
        character
      ] ||
      character;
  }


  return result;
}


// ======================================================
// POWERS
//
// Fixes the SUP problem.
//
// There are NO internal SUP markers anymore.
// ======================================================

function convertPowers(
  value
) {

  let text =
    safeText(
      value
    );


  // ----------------------------------------------------
  // DEGREE FIRST
  //
  // 75^{\circ}
  // 75^\circ
  //
  // ->
  //
  // 75°
  // ----------------------------------------------------

  text =
    text

      .replace(
        /\^\s*\{\s*\\circ\s*\}/g,
        "°"
      )

      .replace(
        /\^\s*\\circ\b/g,
        "°"
      );


  // ----------------------------------------------------
  // BRACED POWERS
  //
  // 5^{5}
  // ->
  // 5⁵
  //
  // 5^{-3}
  // ->
  // 5⁻³
  //
  // 5^{m}
  // ->
  // 5m
  //
  // No [[SUP:m]]
  // ----------------------------------------------------

  text =
    text.replace(
      /\^\s*\{([^{}]+)\}/g,

      (
        _match,
        power
      ) =>
        toSuperscript(
          power
        )
    );


  // ----------------------------------------------------
  // SIMPLE POWERS
  //
  // 5^5
  // ->
  // 5⁵
  //
  // 5^-3
  // ->
  // 5⁻³
  //
  // x^2
  // ->
  // x²
  // ----------------------------------------------------

  text =
    text.replace(
      /\^(-?[A-Za-z0-9]+)/g,

      (
        _match,
        power
      ) =>
        toSuperscript(
          power
        )
    );


  return text;
}


// ======================================================
// SQUARE ROOTS
// ======================================================

function convertSquareRoots(
  value
) {

  let text =
    safeText(
      value
    );


  // ----------------------------------------------------
  // \sqrt{25}
  // ->
  // √(25)
  // ----------------------------------------------------

  text =
    text.replace(
      /\\sqrt\s*\{([^{}]+)\}/g,
      "√($1)"
    );


  return text;
}


// ======================================================
// LATEX -> READABLE TEXT
// ======================================================

export function latexToReadableText(
  value
) {

  let text =
    stripMathDelimiters(
      value
    );


  // ====================================================
  // FRACTIONS
  // ====================================================

  text =
    convertFractions(
      text
    );


  // ====================================================
  // POWERS
  // ====================================================

  text =
    convertPowers(
      text
    );


  // ====================================================
  // ROOTS
  // ====================================================

  text =
    convertSquareRoots(
      text
    );


  // ====================================================
  // LATEX SPACING
  // ====================================================

  text =
    text

      .replace(
        /\\,/g,
        " "
      )

      .replace(
        /\\;/g,
        " "
      )

      .replace(
        /\\:/g,
        " "
      )

      .replace(
        /\\!/g,
        ""
      )

      .replace(
        /\\quad\b/g,
        "  "
      )

      .replace(
        /\\qquad\b/g,
        "   "
      );


  // ====================================================
  // LEFT / RIGHT
  // ====================================================

  text =
    text

      .replace(
        /\\left\b/g,
        ""
      )

      .replace(
        /\\right\b/g,
        ""
      );


  // ====================================================
  // COMMON MATHEMATICAL SYMBOLS
  // ====================================================

  text =
    text

      // Angles

      .replace(
        /\\measuredangle\b/g,
        "∠"
      )

      .replace(
        /\\angle\b/g,
        "∠"
      )


      // Arithmetic

      .replace(
        /\\times\b/g,
        "×"
      )

      .replace(
        /\\div\b/g,
        "÷"
      )

      .replace(
        /\\cdot\b/g,
        "·"
      )

      .replace(
        /\\pm\b/g,
        "±"
      )


      // Comparisons

      .replace(
        /\\neq\b/g,
        "≠"
      )

      .replace(
        /\\ne\b/g,
        "≠"
      )

      .replace(
        /\\leq\b/g,
        "≤"
      )

      .replace(
        /\\le\b/g,
        "≤"
      )

      .replace(
        /\\geq\b/g,
        "≥"
      )

      .replace(
        /\\ge\b/g,
        "≥"
      )

      .replace(
        /\\approx\b/g,
        "≈"
      )


      // Geometry

      .replace(
        /\\parallel\b/g,
        "∥"
      )

      .replace(
        /\\perp\b/g,
        "⊥"
      )


      // Other

      .replace(
        /\\infty\b/g,
        "∞"
      )

      .replace(
        /\\rightarrow\b/g,
        "→"
      )

      .replace(
        /\\Rightarrow\b/g,
        "⇒"
      )

      .replace(
        /\\to\b/g,
        "→"
      );


  // ====================================================
  // DEGREE
  // ====================================================

  text =
    text.replace(
      /\\circ\b/g,
      "°"
    );


  // ====================================================
  // GREEK LOWERCASE
  // ====================================================

  text =
    text

      .replace(
        /\\alpha\b/g,
        "α"
      )

      .replace(
        /\\beta\b/g,
        "β"
      )

      .replace(
        /\\gamma\b/g,
        "γ"
      )

      .replace(
        /\\delta\b/g,
        "δ"
      )

      .replace(
        /\\epsilon\b/g,
        "ε"
      )

      .replace(
        /\\theta\b/g,
        "θ"
      )

      .replace(
        /\\lambda\b/g,
        "λ"
      )

      .replace(
        /\\mu\b/g,
        "μ"
      )

      .replace(
        /\\pi\b/g,
        "π"
      )

      .replace(
        /\\rho\b/g,
        "ρ"
      )

      .replace(
        /\\sigma\b/g,
        "σ"
      )

      .replace(
        /\\phi\b/g,
        "φ"
      )

      .replace(
        /\\omega\b/g,
        "ω"
      );


  // ====================================================
  // GREEK UPPERCASE
  // ====================================================

  text =
    text

      .replace(
        /\\Delta\b/g,
        "Δ"
      )

      .replace(
        /\\Theta\b/g,
        "Θ"
      )

      .replace(
        /\\Lambda\b/g,
        "Λ"
      )

      .replace(
        /\\Pi\b/g,
        "Π"
      )

      .replace(
        /\\Sigma\b/g,
        "Σ"
      )

      .replace(
        /\\Omega\b/g,
        "Ω"
      );


  // ====================================================
  // TEXT COMMAND
  //
  // \text{Marks}
  // ->
  // Marks
  // ====================================================

  text =
    text.replace(
      /\\text\s*\{([^{}]*)\}/g,
      "$1"
    );


  // ====================================================
  // FORMATTING COMMANDS
  // ====================================================

  text =
    text

      .replace(
        /\\mathrm\s*\{([^{}]*)\}/g,
        "$1"
      )

      .replace(
        /\\mathbf\s*\{([^{}]*)\}/g,
        "$1"
      )

      .replace(
        /\\mathit\s*\{([^{}]*)\}/g,
        "$1"
      )

      .replace(
        /\\operatorname\s*\{([^{}]*)\}/g,
        "$1"
      );


  // ====================================================
  // ESCAPED CHARACTERS
  // ====================================================

  text =
    text

      .replace(
        /\\%/g,
        "%"
      )

      .replace(
        /\\&/g,
        "&"
      )

      .replace(
        /\\_/g,
        "_"
      )

      .replace(
        /\\#/g,
        "#"
      )

      .replace(
        /\\\$/g,
        "$"
      );


  // ====================================================
  // REMOVE UNKNOWN LATEX COMMAND BACKSLASH
  //
  // This prevents things such as:
  //
  // \abc
  //
  // from appearing as raw LaTeX.
  // ====================================================

  text =
    text.replace(
      /\\([A-Za-z]+)/g,
      "$1"
    );


  // ====================================================
  // REMOVE LEFTOVER BRACES
  // ====================================================

  text =
    text

      .replace(
        /\{/g,
        ""
      )

      .replace(
        /\}/g,
        ""
      );


  // ====================================================
  // FINAL CLEANUP
  // ====================================================

  return text

    .replace(
      /[ \t]+/g,
      " "
    )

    .trim();
}


// ======================================================
// EDITOR FRIENDLY MATH
//
// Useful when the PDF Generator textarea needs readable
// text instead of raw LaTeX.
//
// Fractions:
//
// [[FRAC:1|4]]
//
// become:
//
// (1/4)
// ======================================================

export function mathToEditorText(
  value
) {

  return latexToReadableText(
    value
  ).replace(
    /\[\[FRAC:([^|\]]+)\|([^\]]+)\]\]/g,
    "($1/$2)"
  );
}


// ======================================================
// RENDERABLE SEGMENTS
// ======================================================

export function getRenderableSegments(
  value
) {

  const tokens =
    tokenizeMathContent(
      value
    );


  return tokens.map(
    (token) => {

      // ------------------------------------------------
      // NORMAL TEXT
      // ------------------------------------------------

      if (
        token.type ===
        "text"
      ) {

        return {
          type:
            "text",

          value:
            token.content,
        };
      }


      // ------------------------------------------------
      // MATHEMATICAL CONTENT
      // ------------------------------------------------

      return {
        type:
          "math",

        value:
          latexToReadableText(
            token.content
          ),

        latex:
          token.content,

        displayMode:
          token.displayMode,
      };

    }
  );
}