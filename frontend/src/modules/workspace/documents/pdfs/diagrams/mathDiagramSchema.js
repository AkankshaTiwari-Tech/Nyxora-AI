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

// ======================================================
// SEMANTIC GEOMETRIC CONSTRAINTS
// ======================================================

function normalizeConstraint(
    constraint
) {
    if (
        !constraint ||
        typeof constraint !== "object"
    ) {
        return null;
    }

    const type =
        cleanString(
            constraint.type
        );

    if (!type) {
        return null;
    }

    return {
        type,

        point:
            cleanString(
                constraint.point
            ),

        point1:
            cleanString(
                constraint.point1
            ),

        point2:
            cleanString(
                constraint.point2
            ),

        line:
            cleanString(
                constraint.line
            ),

        line2:
            cleanString(
                constraint.line2
            ),

        circle:
            cleanString(
                constraint.circle
            ),

        from:
            cleanString(
                constraint.from
            ),

        to:
            cleanString(
                constraint.to
            ),

        vertex:
            cleanString(
                constraint.vertex
            ),

        side1:
            cleanString(
                constraint.side1
            ),

        side2:
            cleanString(
                constraint.side2
            ),

        distance:
            Number.isFinite(
                Number(
                    constraint.distance
                )
            )
                ? Number(
                    constraint.distance
                )
                : null,

        parameter:
            Number.isFinite(
                Number(
                    constraint.parameter
                )
            )
                ? Number(
                    constraint.parameter
                )
                : null
    };
}

function normalizePoint(
    point = {},
    index = 0
) {
    return {
        id:
            cleanString(point.id) ||
            `point-${index}`,

        x:
            finiteNumber(
                point.x
            ),

        y:
            finiteNumber(
                point.y
            ),

        label:
            cleanString(point.label) ||
            `P${index + 1}`,

        constraint:
            normalizeConstraint(
                point.constraint
            )
    };
}

function normalizeLine(
    line = {},
    index = 0
) {
    return {
        x1:
            finiteNumber(
                line.x1
            ),

        y1:
            finiteNumber(
                line.y1
            ),

        x2:
            finiteNumber(
                line.x2
            ),

        y2:
            finiteNumber(
                line.y2
            ),

        id:
            cleanString(line.id) ||
            `line-${index}`,

        from:
            cleanString(
                line.from
            ),

        to:
            cleanString(
                line.to
            ),

        label:
            cleanString(
                line.label
            ),

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
    const color =
        cleanString(value);

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
            Array.isArray(
                style.dash
            )
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

function normalizeAttachment(
    value
) {
    if (!value) {
        return null;
    }

    if (
        typeof value === "string"
    ) {
        return {
            type: "auto",
            id:
                cleanString(
                    value
                )
        };
    }

    if (
        typeof value !== "object"
    ) {
        return null;
    }

    return {
        type:
            cleanString(
                value.type
            ) || "auto",

        id:
            cleanString(
                value.id
            ),

        from:
            cleanString(
                value.from
            ),

        to:
            cleanString(
                value.to
            ),

        vertex:
            cleanString(
                value.vertex
            ),

        side1:
            cleanString(
                value.side1
            ),

        side2:
            cleanString(
                value.side2
            )
    };
}

function normalizeAngle(
    angle = {},
    index = 0
) {
    return {
        id:
            cleanString(
                angle.id
            ) ||
            `angle-${index}`,

        vertex:
            cleanString(
                angle.vertex
            ),

        side1:
            cleanString(
                angle.side1
            ),

        side2:
            cleanString(
                angle.side2
            ),

        value:
            cleanString(
                angle.value
            ) ||
            cleanString(
                angle.label
            ),

        arcRadius:
            Math.max(
                0.1,
                finiteNumber(
                    angle.arcRadius,
                    0.8
                )
            ),

        showArc:
            angle.showArc !== false,

        showValue:
            angle.showValue !== false,

        style:
            normalizeStyle(
                angle.style
            )
    };
}

function normalizeText(
    item = {},
    index = 0
) {
    return {
        x:
            finiteNumber(
                item.x
            ),

        y:
            finiteNumber(
                item.y
            ),

        text:
            cleanString(
                item.text
            ) ||
            cleanString(
                item.label
            ),

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
            cleanString(
                item.id
            ) ||
            `text-${index}`,

        attachedTo:
            normalizeAttachment(
                item.attachedTo
            )
    };
}

function normalizeCircle(
    circle = {},
    index = 0
) {
    return {
        cx:
            finiteNumber(
                circle.cx
            ),

        cy:
            finiteNumber(
                circle.cy
            ),

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
            cleanString(
                circle.id
            ) ||
            `circle-${index}`
    };
}

function normalizeEllipse(
    ellipse = {},
    index = 0
) {
    return {
        cx:
            finiteNumber(
                ellipse.cx
            ),

        cy:
            finiteNumber(
                ellipse.cy
            ),

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
            cleanString(
                ellipse.id
            ) ||
            `ellipse-${index}`
    };
}

function normalizeRectangle(
    rectangle = {},
    index = 0
) {
    return {
        x:
            finiteNumber(
                rectangle.x
            ),

        y:
            finiteNumber(
                rectangle.y
            ),

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
            cleanString(
                rectangle.id
            ) ||
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
            cleanString(
                polygon.id
            ) ||
            `polygon-${index}`
    };
}

function normalizePath(
    path = {},
    index = 0
) {
    return {
        d:
            cleanString(
                path.d
            ),

        style:
            normalizeStyle(
                path.style
            ),

        fillRule:
            cleanString(
                path.fillRule
            ) || "nonzero",

        id:
            cleanString(
                path.id
            ) ||
            `path-${index}`
    };
}

function normalizeArc(
    arc = {},
    index = 0
) {
    return {
        cx:
            finiteNumber(
                arc.cx
            ),

        cy:
            finiteNumber(
                arc.cy
            ),

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
            cleanString(
                arc.id
            ) ||
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
            cleanString(
                curve.id
            ) ||
            `curve-${index}`
    };
}

function normalizeArrow(
    arrow = {},
    index = 0
) {
    return {
        x1:
            finiteNumber(
                arrow.x1
            ),

        y1:
            finiteNumber(
                arrow.y1
            ),

        x2:
            finiteNumber(
                arrow.x2
            ),

        y2:
            finiteNumber(
                arrow.y2
            ),

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
            cleanString(
                arrow.id
            ) ||
            `arrow-${index}`
    };
}

function normalizeDimension(
    dimension = {},
    index = 0
) {
    return {
        x1:
            finiteNumber(
                dimension.x1
            ),

        y1:
            finiteNumber(
                dimension.y1
            ),

        x2:
            finiteNumber(
                dimension.x2
            ),

        y2:
            finiteNumber(
                dimension.y2
            ),

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
            cleanString(
                dimension.id
            ) ||
            `dimension-${index}`
    };
}

function normalizeGroup(
    group = {},
    index = 0
) {
    return {
        id:
            cleanString(
                group.id
            ) ||
            `group-${index}`,

        x:
            finiteNumber(
                group.x
            ),

        y:
            finiteNumber(
                group.y
            ),

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
        !Array.isArray(
            labels
        )
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

        angles:
            Array.isArray(
                diagram.angles
            )
                ? diagram.angles.map(
                    normalizeAngle
                )
                : [],

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
            x:
                finiteNumber(
                    diagram.center?.x
                ),

            y:
                finiteNumber(
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

SEMANTIC RELATIONSHIPS ARE REQUIRED FOR MATHEMATICAL MARKINGS.

When a label belongs to a specific object, do not describe it
only with arbitrary x/y coordinates. Use an "attachedTo" object
that identifies the geometry the label belongs to.

Examples:

{
  "id": "label-o",
  "x": 0,
  "y": 0,
  "text": "O (Center)",
  "attachedTo": {
    "type": "point",
    "id": "O"
  }
}

For a label describing a line:

{
  "id": "label-ad",
  "text": "AD = ?",
  "attachedTo": {
    "type": "line",
    "id": "AD"
  }
}

For an angle, use a semantic angle object instead of a free-floating
text label whenever the angle has mathematical meaning:

{
  "id": "angle-1",
  "vertex": "A",
  "side1": "AB",
  "side2": "AC",
  "value": "45°",
  "arcRadius": 0.8,
  "showArc": true,
  "showValue": true
}

Rules for semantic geometry:

- Every important point should have a stable unique id.
- Every important line should have a stable unique id.
- If a line connects named points, use "from" and "to" with those
  point ids.
- A center label must attach to the actual center point.
- A side/length label must attach to the actual line it describes.
- An angle must reference its actual vertex and its two actual sides.
- Do not create an angle as ordinary text when an actual angle
  marking is required.
- Do not invent relationship ids that do not exist in the same diagram.
- Keep x/y as valid numeric fallback coordinates, but semantic
  relationships take priority for mathematical meaning.

DIAGRAM LABEL CONTENT RULE:

Keep diagram labels minimal.

For ordinary geometry points, vertices, endpoints, centers,
intersections and marked locations, use ONLY short identifiers.

Allowed examples:
- "A"
- "B"
- "C"
- "D"
- "O"
- "P"
- "Q"
- "X"

Do NOT put descriptive words inside ordinary diagram labels.

Do NOT generate labels such as:
- "Center (O)"
- "Radius (r)"
- "Diameter (d)"
- "Chord"
- "Tangent Line"
- "Point of Contact (P)"
- "Tower"
- "Building"
- "Base"
- "Height"
- "Center"
- "Radius"
- "Diameter"
- "Angle"
- "Vertex"

The explanation of what a point, line or object represents must
remain in the question text, notes, or surrounding explanation.

SPECIAL MATHEMATICAL MARKINGS ARE ALLOWED.

A label may contain mathematical information when the marking itself
is part of the mathematical diagram.

Allowed examples:
- "AD = ?"
- "AB = 5 cm"
- "x"
- "2x"
- "60°"
- "90°"
- "θ"
- "r"
- "d"
- "l"
- "2x + 5"

These are mathematical markings, not descriptive object names.

For example, for a circle:

CORRECT:
{
  "points": [
    {
      "id": "O",
      "x": 0,
      "y": 0,
      "label": "O"
    },
    {
      "id": "A",
      "x": 3,
      "y": 0,
      "label": "A"
    }
  ],
  "labels": [
    {
      "text": "O",
      "attachedTo": {
        "type": "point",
        "id": "O"
      }
    },
    {
      "text": "A",
      "attachedTo": {
        "type": "point",
        "id": "A"
      }
    },
    {
      "text": "r",
      "attachedTo": {
        "type": "line",
        "id": "OA"
      }
    }
  ]
}

INCORRECT:
{
  "labels": [
    {
      "text": "Center (O)"
    },
    {
      "text": "Radius (r)"
    }
  ]
}

The renderer must determine the final visual placement of these labels.
Do not compensate for long descriptive labels by moving them far away
from the geometry.

If a descriptive explanation is needed, put it outside the diagram.

==================================================
GEOMETRY POSITION PRIORITY
==================================================

POINTS AND VERTICES ARE ANCHORS.

The coordinates of every point/vertex are authoritative.

NEVER move, shift, resize, or reposition a point/vertex to make
space for a label, angle marking, dimension, or any other text.

If the AI specifies:

{
  "id": "A",
  "x": 8,
  "y": 2
}

then A MUST remain at exactly that mathematical position.

Labels and markings must adapt to the point positions.
Points must NOT adapt to labels.

The designated geometry must preserve its mathematical configuration.

==================================================
ANGLE MARKING RULE
==================================================

An angle is NOT an ordinary text label.

Whenever an angle is mathematically represented in the diagram,
generate a structured angle object.

Example:

{
  "id": "angle-A",
  "vertex": "A",
  "side1": "AB",
  "side2": "AC",
  "value": "45°",
  "arcRadius": 0.6,
  "showArc": true,
  "showValue": true
}

The renderer must determine the angle arc from:

1. The referenced vertex.
2. The first referenced side.
3. The second referenced side.

The angle arc MUST have its center at the referenced vertex.

The angle value MUST be placed near the midpoint of that arc.

Do NOT provide an arbitrary x/y position for an angle value.

Do NOT place an angle value somewhere else in the diagram.

For example, for:

vertex = A
side1 = AB
side2 = AC

the 45° arc must be drawn immediately around A between AB
and AC, and "45°" must appear next to that arc.

==================================================
ANGLE VALIDATION
==================================================

Before returning the diagram:

- Verify that the vertex exists.
- Verify that side1 exists.
- Verify that side2 exists.
- Verify that both sides actually connect to the vertex.
- Verify that the angle arc lies between those two sides.
- Verify that the angle value is placed beside that arc.
- Never place the angle value at an unrelated coordinate.
- Never create an angle arc around a different vertex.

If an angle cannot be represented using the referenced geometry,
fix the geometry/relationship before returning the JSON.

==================================================
POINT LABEL RULE
==================================================

Point labels such as:

A
B
C
D
O
P
Q

must remain immediately adjacent to their corresponding point.

Do NOT move the point itself.

Do NOT move a point to accommodate its label.

The label position may be adjusted around the point, but the
underlying point coordinates must remain unchanged.

==================================================

LABEL PLACEMENT:

Choose final label coordinates close to the object they describe.
Never place the complete label text on geometry or another label.
Consider the full text width and height, not only its x/y anchor.
Do not move labels unnecessarily far away just to find empty space.
If the natural position is occupied, choose the nearest clear position
that still makes the relationship obvious.
Perform a final collision check against all geometry and all labels
before returning the diagram.

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
- angles
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
        "id": "BC",
        "from": "B",
        "to": "C",
        "x1": 100,
        "y1": 220,
        "x2": 400,
        "y2": 220
      },
      {
        "id": "BA",
        "from": "B",
        "to": "A",
        "x1": 100,
        "y1": 220,
        "x2": 250,
        "y2": 70
      }
    ],
    "points": [
      {
        "id": "A",
        "x": 250,
        "y": 70,
        "label": "A"
      },
      {
        "id": "B",
        "x": 100,
        "y": 220,
        "label": "B"
      },
      {
        "id": "C",
        "x": 400,
        "y": 220,
        "label": "C"
      }
    ],
    "angles": [
      {
        "id": "angle-B",
        "vertex": "B",
        "side1": "BA",
        "side2": "BC",
        "value": "45°",
        "arcRadius": 45,
        "showArc": true,
        "showValue": true
      }
    ],
    "arcs": [],
    "labels": [
      {
        "x": 90,
        "y": 245,
        "text": "B",
        "attachedTo": {
          "type": "point",
          "id": "B"
        }
      },
      {
        "x": 410,
        "y": 220,
        "text": "C",
        "attachedTo": {
          "type": "point",
          "id": "C"
        }
      },
      {
        "x": 245,
        "y": 60,
        "text": "A",
        "attachedTo": {
          "type": "point",
          "id": "A"
        }
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


ADDITIONAL SEMANTIC GEOMETRY CONSTRAINT RULES:

When a point has a known mathematical relationship with another
geometric object, include a "constraint" object on that point.

Supported constraint types include:
- "onLine"
- "onCircle"
- "intersection"
- "tangentContact"
- "midpoint"
- "perpendicularFoot"
- "projection"
- "collinear"
- "fixedDistance"

Example for a point on a circle:
{
  "id": "C",
  "x": 0,
  "y": 0,
  "label": "C",
  "constraint": {
    "type": "onCircle",
    "circle": "circle-1"
  }
}

Example for a tangent-contact point:
{
  "id": "C",
  "x": 0,
  "y": 0,
  "label": "C",
  "constraint": {
    "type": "tangentContact",
    "circle": "circle-1",
    "line": "AB"
  }
}

For a tangent-contact point, the point must mathematically lie
on both the circle circumference and the tangent line.
Do not represent a known tangent-contact point as an unrelated
free point.

ANGLE SEMANTIC VALIDATION:

Whenever the question refers to a specific angle, the angle object
must identify the actual vertex and the actual two sides forming it.

For example, if the question states:

∠APB = 80°

use:
{
  "vertex": "P",
  "side1": "PA",
  "side2": "PB",
  "value": "80°",
  "showArc": true,
  "showValue": true
}

Do NOT substitute another ray such as PO.

The renderer must calculate the angle marking from the referenced
vertex and sides. Do not use arbitrary x/y coordinates for an
angle that has mathematical meaning.

CENTER AND CONTACT VALIDATION:

If a point is the center of a circle, its coordinates must coincide
with the actual circle center.

If a point is identified as a point of contact, use the appropriate
geometric constraint so the renderer can resolve the actual contact
position from the geometry.

If two lines intersect at a named point, represent that relationship
semantically whenever possible.

GEOMETRY HAS PRIORITY:

Do not move a mathematical point, vertex, circle, line, or other
geometry to make space for labels or markings. Labels and markings
must adapt to the geometry.
`;