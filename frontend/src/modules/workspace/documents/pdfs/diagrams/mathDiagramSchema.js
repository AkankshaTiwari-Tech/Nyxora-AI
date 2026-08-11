// ======================================================
// NYXORA UNIVERSAL VECTOR DIAGRAM SCHEMA
// ======================================================
//
// Generic vector scene model for:
// mathematics, physics, chemistry, biology, engineering,
// electronics, computer science, charts, flowcharts,
// technical drawings, scientific diagrams, and custom
// diagrams.
//
// IMPORTANT:
// - No ASCII diagrams.
// - No image URLs.
// - No base64 images.
// - No random diagram assignment.
// - A diagram belongs to the question that owns it.
// - Renderer draws the scene from structured vectors.
//
// Backward compatibility is retained for the existing
// diagram types used by Nyxora.
// ======================================================

export const MATH_DIAGRAM_TYPES = {
    SCENE: "scene",

    COORDINATE_PLANE: "coordinatePlane",
    FUNCTION_GRAPH: "functionGraph",

    LINE: "line",
    TRIANGLE: "triangle",
    RECTANGLE: "rectangle",
    SQUARE: "square",
    CIRCLE: "circle",
    ANGLE: "angle",

    // Generic vector primitives
    VECTOR: "vector",
    POLYGON: "polygon",
    ELLIPSE: "ellipse",
    ARC: "arc",
    CURVE: "curve",
    ARROW: "arrow",
    FLOWCHART: "flowchart",
    CIRCUIT: "circuit",
    GRAPH: "graph",
    CUSTOM: "custom"
};

const VALID_TYPES = new Set(
    Object.values(MATH_DIAGRAM_TYPES)
);

function cleanString(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
}

function finiteNumber(
    value,
    fallback = 0
) {
    const number = Number(value);

    return Number.isFinite(number)
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
            fallback[1]
        ];
    }

    const min = finiteNumber(
        value[0],
        fallback[0]
    );

    const max = finiteNumber(
        value[1],
        fallback[1]
    );

    if (max <= min) {
        return [
            fallback[0],
            fallback[1]
        ];
    }

    return [
        min,
        max
    ];
}

function normalizePoint(
    point = {},
    index = 0
) {
    return {
        x: finiteNumber(point.x),
        y: finiteNumber(point.y),

        label:
            cleanString(point.label) ||
            `P${index + 1}`
    };
}

function normalizeLine(
    line = {}
) {
    return {
        x1: finiteNumber(line.x1),
        y1: finiteNumber(line.y1),
        x2: finiteNumber(line.x2),
        y2: finiteNumber(line.y2),

        label:
            cleanString(line.label),

        startArrow:
            line.startArrow === true,

        endArrow:
            line.endArrow === true
    };
}

function normalizeColor(
    value,
    fallback = "#111827"
) {
    const color = cleanString(value);

    return color || fallback;
}

function normalizeStyle(
    style = {}
) {
    return {
        stroke:
            normalizeColor(
                style.stroke
            ),

        fill:
            style.fill === "none" ||
            style.fill === null ||
            style.fill === undefined
                ? "none"
                : normalizeColor(
                    style.fill,
                    "#FFFFFF"
                ),

        strokeWidth:
            Math.max(
                0.1,
                finiteNumber(
                    style.strokeWidth,
                    1.5
                )
            ),

        opacity:
            Math.min(
                1,
                Math.max(
                    0,
                    finiteNumber(
                        style.opacity,
                        1
                    )
                )
            ),

        dash:
            Array.isArray(style.dash)
                ? style.dash
                    .map(
                        value =>
                            Math.max(
                                0,
                                finiteNumber(
                                    value
                                )
                            )
                    )
                    .filter(
                        value =>
                            value > 0
                    )
                : []
    };
}

function normalizeText(
    item = {},
    index = 0
) {
    return {
        x: finiteNumber(item.x),
        y: finiteNumber(item.y),

        text:
            cleanString(item.text) ||
            cleanString(item.label),

        fontSize:
            Math.max(
                1,
                finiteNumber(
                    item.fontSize,
                    10
                )
            ),

        fontWeight:
            cleanString(
                item.fontWeight
            ) || "normal",

        rotate:
            finiteNumber(
                item.rotate
            ),

        anchor:
            cleanString(
                item.anchor
            ) || "start",

        style:
            normalizeStyle(
                item.style
            ),

        id:
            cleanString(item.id) ||
            `text-${index}`
    };
}

function normalizeCircle(
    circle = {},
    index = 0
) {
    return {
        cx: finiteNumber(circle.cx),
        cy: finiteNumber(circle.cy),

        r:
            Math.max(
                0.1,
                finiteNumber(
                    circle.r,
                    1
                )
            ),

        style:
            normalizeStyle(
                circle.style
            ),

        id:
            cleanString(circle.id) ||
            `circle-${index}`
    };
}

function normalizeEllipse(
    ellipse = {},
    index = 0
) {
    return {
        cx: finiteNumber(ellipse.cx),
        cy: finiteNumber(ellipse.cy),

        rx:
            Math.max(
                0.1,
                finiteNumber(
                    ellipse.rx,
                    1
                )
            ),

        ry:
            Math.max(
                0.1,
                finiteNumber(
                    ellipse.ry,
                    1
                )
            ),

        rotate:
            finiteNumber(
                ellipse.rotate
            ),

        style:
            normalizeStyle(
                ellipse.style
            ),

        id:
            cleanString(ellipse.id) ||
            `ellipse-${index}`
    };
}

function normalizeRectangle(
    rectangle = {},
    index = 0
) {
    return {
        x: finiteNumber(rectangle.x),
        y: finiteNumber(rectangle.y),

        width:
            Math.max(
                0.1,
                finiteNumber(
                    rectangle.width,
                    1
                )
            ),

        height:
            Math.max(
                0.1,
                finiteNumber(
                    rectangle.height,
                    1
                )
            ),

        radius:
            Math.max(
                0,
                finiteNumber(
                    rectangle.radius
                )
            ),

        rotate:
            finiteNumber(
                rectangle.rotate
            ),

        style:
            normalizeStyle(
                rectangle.style
            ),

        id:
            cleanString(rectangle.id) ||
            `rectangle-${index}`
    };
}

function normalizePolygon(
    polygon = {},
    index = 0
) {
    return {
        points:
            Array.isArray(
                polygon.points
            )
                ? polygon.points.map(
                    normalizePoint
                )
                : [],

        closed:
            polygon.closed !== false,

        style:
            normalizeStyle(
                polygon.style
            ),

        id:
            cleanString(polygon.id) ||
            `polygon-${index}`
    };
}

function normalizePath(
    path = {},
    index = 0
) {
    return {
        d:
            cleanString(path.d),

        style:
            normalizeStyle(
                path.style
            ),

        fillRule:
            cleanString(
                path.fillRule
            ) || "nonzero",

        id:
            cleanString(path.id) ||
            `path-${index}`
    };
}

function normalizeArc(
    arc = {},
    index = 0
) {
    return {
        cx: finiteNumber(arc.cx),
        cy: finiteNumber(arc.cy),

        radius:
            Math.max(
                0.1,
                finiteNumber(
                    arc.radius,
                    1
                )
            ),

        startAngle:
            finiteNumber(
                arc.startAngle
            ),

        endAngle:
            finiteNumber(
                arc.endAngle
            ),

        clockwise:
            arc.clockwise !== false,

        style:
            normalizeStyle(
                arc.style
            ),

        id:
            cleanString(arc.id) ||
            `arc-${index}`
    };
}

function normalizeCurve(
    curve = {},
    index = 0
) {
    return {
        equation:
            cleanString(
                curve.equation
            ),

        points:
            Array.isArray(
                curve.points
            )
                ? curve.points.map(
                    normalizePoint
                )
                : [],

        xRange:
            normalizeRange(
                curve.xRange,
                [-10, 10]
            ),

        yRange:
            normalizeRange(
                curve.yRange,
                [-10, 10]
            ),

        style:
            normalizeStyle(
                curve.style
            ),

        id:
            cleanString(curve.id) ||
            `curve-${index}`
    };
}

function normalizeArrow(
    arrow = {},
    index = 0
) {
    return {
        x1: finiteNumber(arrow.x1),
        y1: finiteNumber(arrow.y1),
        x2: finiteNumber(arrow.x2),
        y2: finiteNumber(arrow.y2),

        startArrow:
            arrow.startArrow === true,

        endArrow:
            arrow.endArrow !== false,

        label:
            cleanString(
                arrow.label
            ),

        style:
            normalizeStyle(
                arrow.style
            ),

        id:
            cleanString(arrow.id) ||
            `arrow-${index}`
    };
}

function normalizeDimension(
    dimension = {},
    index = 0
) {
    return {
        x1: finiteNumber(dimension.x1),
        y1: finiteNumber(dimension.y1),
        x2: finiteNumber(dimension.x2),
        y2: finiteNumber(dimension.y2),

        label:
            cleanString(
                dimension.label
            ),

        offset:
            finiteNumber(
                dimension.offset,
                8
            ),

        arrows:
            dimension.arrows !== false,

        style:
            normalizeStyle(
                dimension.style
            ),

        id:
            cleanString(dimension.id) ||
            `dimension-${index}`
    };
}

function normalizeGroup(
    group = {},
    index = 0
) {
    return {
        id:
            cleanString(group.id) ||
            `group-${index}`,

        x:
            finiteNumber(group.x),

        y:
            finiteNumber(group.y),

        rotate:
            finiteNumber(
                group.rotate
            ),

        scale:
            Math.max(
                0.01,
                finiteNumber(
                    group.scale,
                    1
                )
            ),

        elements:
            Array.isArray(
                group.elements
            )
                ? group.elements
                : []
    };
}

function normalizeLabels(
    labels
) {
    if (
        !Array.isArray(labels)
    ) {
        return [];
    }

    return labels
        .map(
            normalizeText
        )
        .filter(
            item =>
                item.text
        );
}

function normalizeSceneElements(
    diagram
) {
    return {
        lines:
            Array.isArray(
                diagram.lines
            )
                ? diagram.lines.map(
                    normalizeLine
                )
                : [],

        arrows:
            Array.isArray(
                diagram.arrows
            )
                ? diagram.arrows.map(
                    normalizeArrow
                )
                : [],

        circles:
            Array.isArray(
                diagram.circles
            )
                ? diagram.circles.map(
                    normalizeCircle
                )
                : [],

        ellipses:
            Array.isArray(
                diagram.ellipses
            )
                ? diagram.ellipses.map(
                    normalizeEllipse
                )
                : [],

        rectangles:
            Array.isArray(
                diagram.rectangles
            )
                ? diagram.rectangles.map(
                    normalizeRectangle
                )
                : [],

        polygons:
            Array.isArray(
                diagram.polygons
            )
                ? diagram.polygons.map(
                    normalizePolygon
                )
                : [],

        paths:
            Array.isArray(
                diagram.paths
            )
                ? diagram.paths.map(
                    normalizePath
                )
                : [],

        arcs:
            Array.isArray(
                diagram.arcs
            )
                ? diagram.arcs.map(
                    normalizeArc
                )
                : [],

        curves:
            Array.isArray(
                diagram.curves
            )
                ? diagram.curves.map(
                    normalizeCurve
                )
                : [],

        points:
            Array.isArray(
                diagram.points
            )
                ? diagram.points.map(
                    normalizePoint
                )
                : [],

        labels:
            normalizeLabels(
                diagram.labels
            ),

        dimensions:
            Array.isArray(
                diagram.dimensions
            )
                ? diagram.dimensions.map(
                    normalizeDimension
                )
                : [],

        groups:
            Array.isArray(
                diagram.groups
            )
                ? diagram.groups.map(
                    normalizeGroup
                )
                : []
    };
}

function normalizeDiagram(
    diagram = {}
) {
    if (
        !diagram ||
        typeof diagram !== "object"
    ) {
        return null;
    }

    const type =
        cleanString(
            diagram.type
        );

    if (
        !VALID_TYPES.has(type)
    ) {
        return null;
    }

    const normalized = {

        type,

        title:
            cleanString(
                diagram.title
            ),

        width:
            Math.max(
                100,
                finiteNumber(
                    diagram.width,
                    515
                )
            ),

        height:
            Math.max(
                100,
                finiteNumber(
                    diagram.height,
                    300
                )
            ),

        background:
            normalizeColor(
                diagram.background,
                "transparent"
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

        elements:
            normalizeSceneElements(
                diagram
            )
    };

    // ------------------------------------------
    // Function graph compatibility
    // ------------------------------------------

    if (
        type ===
        MATH_DIAGRAM_TYPES.FUNCTION_GRAPH
    ) {
        normalized.equation =
            cleanString(
                diagram.equation
            );
    }

    // ------------------------------------------
    // Circle compatibility
    // ------------------------------------------

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
            )
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

    // ------------------------------------------
    // Angle compatibility
    // ------------------------------------------

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

// ======================================================
// PUBLIC API
// ======================================================

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
            normalizeDiagram
        )
        .filter(Boolean);
}

export function hasMathDiagram(
    question = {}
) {
    return Boolean(
        question?.diagram
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

    if (
        Array.isArray(
            question?.diagrams
        )
    ) {
        return normalizeMathDiagrams(
            question.diagrams
        );
    }

    return [];
}

// ======================================================
// UNIVERSAL AI OUTPUT CONTRACT
// ======================================================
//
// The AI should describe diagrams as vector scenes.
//
// A diagram belongs INSIDE the question that needs it:
//
// {
//   "number": 5,
//   "text": "...",
//   "diagram": {
//      "type": "scene",
//      ...
//   }
// }
//
// Never create a separate global diagram list.
// Never use ASCII.
// Never use image URLs.
// Never use base64.
// Never use random diagram numbering.
// ======================================================

export const MATH_DIAGRAM_AI_CONTRACT = `
When generating content, determine whether a question
requires a visual diagram.

If a diagram is required, place the diagram directly inside
that question as the "diagram" property.

A diagram must belong to exactly one question.

Never create a global diagram list.

Never attach a diagram to another question.

Never generate ASCII art.

Never generate image URLs.

Never generate base64 images.

Never generate SVG strings.

Never provide natural-language instructions for drawing.

Use structured vector data.

The preferred universal diagram type is:

{
  "type": "scene"
}

A scene may contain any combination of:

- lines
- arrows
- circles
- ellipses
- rectangles
- polygons
- paths
- arcs
- curves
- points
- labels
- dimensions
- groups

Example:

{
  "number": 5,
  "text": "Find the angle ABC.",
  "diagram": {
    "type": "scene",
    "width": 515,
    "height": 300,
    "lines": [
      {
        "x1": 100,
        "y1": 220,
        "x2": 400,
        "y2": 220
      },
      {
        "x1": 100,
        "y1": 220,
        "x2": 250,
        "y2": 70
      }
    ],
    "arcs": [
      {
        "cx": 100,
        "cy": 220,
        "radius": 45,
        "startAngle": 0,
        "endAngle": 45
      }
    ],
    "labels": [
      {
        "x": 90,
        "y": 245,
        "text": "B"
      },
      {
        "x": 410,
        "y": 220,
        "text": "C"
      },
      {
        "x": 245,
        "y": 60,
        "text": "A"
      }
    ]
  }
}

Use coordinates appropriate to the diagram.

Use multiple primitives whenever necessary.

For curves, use either an equation or structured curve
points.

For mathematical graphs, provide suitable xRange and yRange.

For technical diagrams, use explicit vector components,
connectors, labels and symbols.

For flowcharts, use rectangles, paths, arrows and labels.

For circuits, represent components with vector geometry,
lines, connectors and labels.

For scientific diagrams, use vector primitives and labels.

For maps or technical layouts, use paths, polygons,
lines, points and labels.

The renderer will draw the final diagram.

Only add a diagram when it materially helps answer or
understand the question.
`;
` ```

### After replacing

Run:

```powershell
npm run dev