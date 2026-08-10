import React from "react";

import {
  Svg,
  Text,
  Path,
  G,
} from "@react-pdf/renderer";

function normalizeLatex(value = "") {
  return String(value || "")
    .replace(/^\s*\$\$?/, "")
    .replace(/\$\$?\s*$/, "")
    .replace(/^\\\(/, "")
    .replace(/\\\)$/, "")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .trim();
}

function parseSimpleLatex(value = "") {
  const latex = normalizeLatex(value);

  const tokens = [];

  let i = 0;

  while (i < latex.length) {
    if (latex[i] === "\\") {
      if (latex.startsWith("\\frac", i)) {
        i += 5;

        while (latex[i] === " ") {
          i++;
        }

        if (latex[i] === "{") {
          const numerator = readGroup(latex, i);
          i = numerator.end;

          while (latex[i] === " ") {
            i++;
          }

          if (latex[i] === "{") {
            const denominator = readGroup(latex, i);
            i = denominator.end;

            tokens.push({
              type: "fraction",
              numerator: numerator.value,
              denominator: denominator.value,
            });

            continue;
          }
        }
      }

      if (latex.startsWith("\\sqrt", i)) {
        i += 5;

        while (latex[i] === " ") {
          i++;
        }

        if (latex[i] === "{") {
          const content = readGroup(latex, i);

          tokens.push({
            type: "sqrt",
            value: content.value,
          });

          i = content.end;

          continue;
        }
      }

      const commands = {
        "\\times": "×",
        "\\cdot": "·",
        "\\div": "÷",
        "\\pm": "±",
        "\\leq": "≤",
        "\\le": "≤",
        "\\geq": "≥",
        "\\ge": "≥",
        "\\neq": "≠",
        "\\angle": "∠",
        "\\circ": "°",
        "\\rightarrow": "→",
        "\\to": "→",
        "\\therefore": "∴",
        "\\because": "∵",
        "\\infty": "∞",
      };

      let matchedCommand = false;

      for (const [command, replacement] of Object.entries(commands)) {
        if (latex.startsWith(command, i)) {
          tokens.push({
            type: "text",
            value: replacement,
          });

          i += command.length;
          matchedCommand = true;
          break;
        }
      }

      if (matchedCommand) {
        continue;
      }

      const commandMatch = latex
        .slice(i)
        .match(/^\\([A-Za-z]+)/);

      if (commandMatch) {
        tokens.push({
          type: "text",
          value: commandMatch[1],
        });

        i += commandMatch[0].length;

        continue;
      }
    }

    if (latex[i] === "^") {
      i++;

      if (latex[i] === "{") {
        const power = readGroup(latex, i);

        tokens.push({
          type: "superscript",
          value: power.value,
        });

        i = power.end;

        continue;
      }

      if (latex[i]) {
        tokens.push({
          type: "superscript",
          value: latex[i],
        });

        i++;

        continue;
      }
    }

    if (latex[i] === "_") {
      i++;

      if (latex[i] === "{") {
        const subscript = readGroup(latex, i);

        tokens.push({
          type: "subscript",
          value: subscript.value,
        });

        i = subscript.end;

        continue;
      }

      if (latex[i]) {
        tokens.push({
          type: "subscript",
          value: latex[i],
        });

        i++;

        continue;
      }
    }

    if (latex[i] === "{") {
      const group = readGroup(latex, i);

      tokens.push({
        type: "text",
        value: group.value,
      });

      i = group.end;

      continue;
    }

    if (latex[i] === " ") {
      tokens.push({
        type: "space",
        value: " ",
      });

      i++;

      continue;
    }

    tokens.push({
      type: "text",
      value: latex[i],
    });

    i++;
  }

  return tokens;
}

function readGroup(text, start) {
  let depth = 0;

  let value = "";

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (char === "{") {
      depth++;

      if (depth > 1) {
        value += char;
      }

      continue;
    }

    if (char === "}") {
      depth--;

      if (depth === 0) {
        return {
          value,
          end: i + 1,
        };
      }

      value += char;

      continue;
    }

    value += char;
  }

  return {
    value,
    end: text.length,
  };
}

function estimateWidth(tokens) {
  let width = 0;

  tokens.forEach((token) => {
    if (token.type === "fraction") {
      const numeratorWidth =
        String(token.numerator || "").length * 7;

      const denominatorWidth =
        String(token.denominator || "").length * 7;

      width +=
        Math.max(
          numeratorWidth,
          denominatorWidth,
          18
        ) + 8;

      return;
    }

    if (token.type === "sqrt") {
      width +=
        String(token.value || "").length * 7 + 18;

      return;
    }

    if (
      token.type === "superscript" ||
      token.type === "subscript"
    ) {
      width +=
        String(token.value || "").length * 4.5;

      return;
    }

    width +=
      String(token.value || "").length * 7;
  });

  return Math.max(40, width + 8);
}

function MathToken({
  token,
  x,
  baseY,
}) {
  if (!token) {
    return null;
  }

  if (token.type === "text") {
    return (
      <Text
        x={x}
        y={baseY}
        fontSize={14}
        fontFamily="Helvetica"
      >
        {token.value}
      </Text>
    );
  }

  if (token.type === "space") {
    return null;
  }

  if (token.type === "superscript") {
    return (
      <Text
        x={x}
        y={baseY - 6}
        fontSize={9}
        fontFamily="Helvetica"
      >
        {token.value}
      </Text>
    );
  }

  if (token.type === "subscript") {
    return (
      <Text
        x={x}
        y={baseY + 4}
        fontSize={9}
        fontFamily="Helvetica"
      >
        {token.value}
      </Text>
    );
  }

  if (token.type === "fraction") {
    const numerator =
      String(token.numerator || "");

    const denominator =
      String(token.denominator || "");

    const width =
      Math.max(
        numerator.length * 7,
        denominator.length * 7,
        18
      );

    return (
      <G>
        <Text
          x={x + width / 2}
          y={baseY - 7}
          fontSize={9}
          textAnchor="middle"
          fontFamily="Helvetica"
        >
          {numerator}
        </Text>

        <Path
          d={`M ${x} ${baseY - 3} L ${
            x + width
          } ${baseY - 3}`}
          stroke="#111827"
          strokeWidth={0.8}
        />

        <Text
          x={x + width / 2}
          y={baseY + 9}
          fontSize={9}
          textAnchor="middle"
          fontFamily="Helvetica"
        >
          {denominator}
        </Text>
      </G>
    );
  }

  if (token.type === "sqrt") {
    const content =
      String(token.value || "");

    const width =
      Math.max(
        18,
        content.length * 7 + 5
      );

    return (
      <G>
        <Path
          d={`
            M ${x} ${baseY - 2}
            L ${x + 4} ${baseY + 3}
            L ${x + 8} ${baseY - 9}
            L ${x + width} ${baseY - 9}
          `}
          fill="none"
          stroke="#111827"
          strokeWidth={1}
        />

        <Text
          x={x + 9}
          y={baseY}
          fontSize={12}
          fontFamily="Helvetica"
        >
          {content}
        </Text>
      </G>
    );
  }

  return null;
}

export default function MathExpression({
  value,
}) {
  if (!value) {
    return null;
  }

  const tokens =
    parseSimpleLatex(value);

  if (!tokens.length) {
    return null;
  }

  const width =
    estimateWidth(tokens);

  let currentX = 4;

  const baseY = 24;

  const renderedTokens =
    tokens.map((token, index) => {
      const element = (
        <MathToken
          key={`math-token-${index}`}
          token={token}
          x={currentX}
          baseY={baseY}
        />
      );

      if (token.type === "fraction") {
        const fractionWidth =
          Math.max(
            String(token.numerator || "")
              .length * 7,
            String(token.denominator || "")
              .length * 7,
            18
          ) + 8;

        currentX += fractionWidth;

        return element;
      }

      if (token.type === "sqrt") {
        currentX +=
          String(token.value || "").length * 7 +
          18;

        return element;
      }

      if (
        token.type === "superscript" ||
        token.type === "subscript"
      ) {
        currentX +=
          String(token.value || "").length * 4.5;

        return element;
      }

      if (token.type === "space") {
        currentX += 4;

        return element;
      }

      currentX +=
        String(token.value || "").length * 7;

      return element;
    });

  return (
    <Svg
      width={width}
      height={38}
      viewBox={`0 0 ${width} 38`}
    >
      {renderedTokens}
    </Svg>
  );
}