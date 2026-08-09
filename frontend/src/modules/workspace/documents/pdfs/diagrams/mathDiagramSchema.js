// ======================================================
// NYXORA MATH DIAGRAM SCHEMA
// ======================================================
//
// This file defines the structured diagram data that the
// AI Test Generator will eventually return.
//
// IMPORTANT:
// - This file does not change any existing PDF renderer.
// - It does not change AI generation yet.
// - It only normalizes and validates diagram data.
//
// Supported diagram types:
//   coordinatePlane
//   functionGraph
//   line
//   triangle
//   rectangle
//   square
//   circle
//   angle
//
// Graph/curve support is represented by functionGraph.
// ======================================================

export const MATH_DIAGRAM_TYPES = {
    COORDINATE_PLANE:
        "coordinatePlane",

    FUNCTION_GRAPH:
        "functionGraph",

    LINE:
        "line",

    TRIANGLE:
        "triangle",

    RECTANGLE:
        "rectangle",

    SQUARE:
        "square",

    CIRCLE:
        "circle",

    ANGLE:
        "angle",
};

const VALID_TYPES =
    new Set(
        Object.values(
            MATH_DIAGRAM_TYPES
        )
    );

function cleanString(value) {
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

function finiteNumber(
    value,
    fallback = 0
) {
    const number =
        Number(value);

    return Number.isFinite(
        number
    )
        ? number
        : fallback;
}

function normalizeRange(
    value,
    fallback
) {
    if (
        !Array.isArray(value) ||
        value.length < 2
    ) {
        return [
            fallback[0],
            fallback[1],
        ];
    }

    const min =
        finiteNumber(
            value[0],
            fallback[0]
        );

    const max =
        finiteNumber(
            value[1],
            fallback[1]
        );

    if (max <= min) {
        return [
            fallback[0],
            fallback[1],
        ];
    }

    return [
        min,
        max,
    ];
}

function normalizePoint(
    point = {},
    index = 0
) {
    return {
        x: finiteNumber(
            point.x
        ),

        y: finiteNumber(
            point.y
        ),

        label:
            cleanString(
                point.label
            ) ||
            `P${index + 1}`,
    };
}

function normalizeLine(
    line = {}
) {
    return {
        x1: finiteNumber(
            line.x1
        ),

        y1: finiteNumber(
            line.y1
        ),

        x2: finiteNumber(
            line.x2
        ),

        y2: finiteNumber(
            line.y2
        ),
    };
}

function normalizeDiagram(
    diagram = {}
) {
    const type =
        cleanString(
            diagram.type
        );

    if (
        !VALID_TYPES.has(
            type
        )
    ) {
        return null;
    }

    const normalized = {
        type,

        title:
            cleanString(
                diagram.title
            ),

        showGrid:
            diagram.showGrid !== false,

        showAxes:
            diagram.showAxes !== false,

        showLabels:
            diagram.showLabels !== false,

        xRange:
            normalizeRange(
                diagram.xRange,
                [-10, 10]
            ),

        yRange:
            normalizeRange(
                diagram.yRange,
                [-10, 10]
            ),

        points:
            Array.isArray(
                diagram.points
            )
                ? diagram.points
                    .map(
                        (
                            point,
                            index
                        ) =>
                            normalizePoint(
                                point,
                                index
                            )
                    )
                : [],

        lines:
            Array.isArray(
                diagram.lines
            )
                ? diagram.lines
                    .map(
                        (line) =>
                            normalizeLine(
                                line
                            )
                    )
                : [],

        labels:
            diagram.labels &&
            typeof diagram.labels ===
                "object"
                ? diagram.labels
                : {},
    };

    if (
        type ===
        MATH_DIAGRAM_TYPES.FUNCTION_GRAPH
    ) {
        normalized.equation =
            cleanString(
                diagram.equation
            );
    }

    if (
        type ===
        MATH_DIAGRAM_TYPES.CIRCLE
    ) {
        normalized.center = {
            x: finiteNumber(
                diagram.center?.x
            ),

            y: finiteNumber(
                diagram.center?.y
            ),
        };

        normalized.radius =
            Math.max(
                0.1,
                finiteNumber(
                    diagram.radius,
                    1
                )
            );
    }

    if (
        type ===
        MATH_DIAGRAM_TYPES.ANGLE
    ) {
        normalized.vertex =
            normalizePoint(
                diagram.vertex,
                0
            );

        normalized.arm1 =
            normalizePoint(
                diagram.arm1,
                1
            );

        normalized.arm2 =
            normalizePoint(
                diagram.arm2,
                2
            );

        normalized.angleLabel =
            cleanString(
                diagram.angleLabel
            );
    }

    return normalized;
}

export function normalizeMathDiagram(
    diagram
) {
    return normalizeDiagram(
        diagram
    );
}

export function normalizeMathDiagrams(
    diagrams
) {
    if (
        !Array.isArray(
            diagrams
        )
    ) {
        return [];
    }

    return diagrams
        .map(
            (diagram) =>
                normalizeDiagram(
                    diagram
                )
        )
        .filter(Boolean);
}

export function hasMathDiagram(
    question = {}
) {
    return Boolean(
        question?.diagram ||
        (
            Array.isArray(
                question?.diagrams
            ) &&
            question.diagrams.length
        )
    );
}

export function getQuestionDiagrams(
    question = {}
) {
    if (
        question?.diagram
    ) {
        const diagram =
            normalizeDiagram(
                question.diagram
            );

        return diagram
            ? [diagram]
            : [];
    }

    return normalizeMathDiagrams(
        question?.diagrams
    );
}

// ======================================================
// AI OUTPUT CONTRACT
// ======================================================

export const MATH_DIAGRAM_AI_CONTRACT = `
When generating a mathematics test, determine whether a
question genuinely requires a mathematical diagram.

If a diagram is required, add a "diagram" object to that
question.

If no diagram is required, omit "diagram".

Never add a diagram merely for decoration.

Supported diagram types:

1. coordinatePlane
2. functionGraph
3. line
4. triangle
5. rectangle
6. square
7. circle
8. angle

For coordinatePlane:
{
  "type": "coordinatePlane",
  "xRange": [-10, 10],
  "yRange": [-10, 10],
  "points": [
    { "x": 2, "y": 3, "label": "A" }
  ],
  "lines": [],
  "showGrid": true,
  "showAxes": true,
  "showLabels": true
}

For functionGraph:
{
  "type": "functionGraph",
  "equation": "y=x^2-4",
  "xRange": [-5, 5],
  "yRange": [-6, 10],
  "points": [
    { "x": -2, "y": 0, "label": "A" }
  ],
  "showGrid": true,
  "showAxes": true,
  "showLabels": true
}

For line:
{
  "type": "line",
  "points": [
    { "x": 0, "y": 0, "label": "A" },
    { "x": 6, "y": 4, "label": "B" }
  ]
}

For triangle:
{
  "type": "triangle",
  "points": [
    { "x": 0, "y": 0, "label": "A" },
    { "x": 8, "y": 0, "label": "B" },
    { "x": 4, "y": 5, "label": "C" }
  ]
}

For circle:
{
  "type": "circle",
  "center": {
    "x": 0,
    "y": 0
  },
  "radius": 5
}

For angle:
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

Mathematical geometry must be represented with numeric
coordinates or exact mathematical values whenever possible.

For function graphs, provide the equation and suitable
x/y ranges.

Do not generate image URLs, base64 images, SVG strings,
or natural-language drawing instructions.

The PDF renderer will draw the diagram itself.
`;