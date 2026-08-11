import {
  Svg,
} from "@react-pdf/renderer";

import {
  DiagramLine,
  DiagramCircle,
  DiagramRectangle,
  DiagramPolygon,
  DiagramPath,
  DiagramText,
  DiagramPoint,
  DiagramArrow,
  DiagramAngle,
  DiagramArc,
  DiagramCurve,
  DiagramShadedRegion,
} from "./diagramPrimitives";

/* ======================================================
   HELPERS
   ====================================================== */

function number(value, fallback = 0) {
  const result = Number(value);

  return Number.isFinite(result)
    ? result
    : fallback;
}

function point(value = {}) {
  return {
    x: number(value.x),
    y: number(value.y),
    label:
      value.label === undefined ||
      value.label === null
        ? ""
        : String(value.label),
  };
}

function getBounds(points = []) {
  if (!points.length) {
    return {
      minX: -10,
      maxX: 10,
      minY: -10,
      maxY: 10,
    };
  }

  const xs = points.map(
    item => number(item.x)
  );

  const ys = points.map(
    item => number(item.y)
  );

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/* ======================================================
   COORDINATE TRANSFORM
   ====================================================== */

function createTransform({
  width,
  height,
  xRange,
  yRange,
  padding = 35,
}) {
  const minX = number(
    xRange?.[0],
    -10
  );

  const maxX = number(
    xRange?.[1],
    10
  );

  const minY = number(
    yRange?.[0],
    -10
  );

  const maxY = number(
    yRange?.[1],
    10
  );

  const usableWidth =
    Math.max(
      width - padding * 2,
      1
    );

  const usableHeight =
    Math.max(
      height - padding * 2,
      1
    );

  const xScale =
    usableWidth /
    Math.max(maxX - minX, 1);

  const yScale =
    usableHeight /
    Math.max(maxY - minY, 1);

  const scale =
    Math.min(
      xScale,
      yScale
    );

  const actualWidth =
    (maxX - minX) * scale;

  const actualHeight =
    (maxY - minY) * scale;

  const offsetX =
    (width - actualWidth) / 2;

  const offsetY =
    (height - actualHeight) / 2;

  return {
    x(value) {
      return (
        offsetX +
        (number(value) - minX) *
          scale
      );
    },

    y(value) {
      return (
        height -
        offsetY -
        (number(value) - minY) *
          scale
      );
    },

    scale,
  };
}

/* ======================================================
   POINT COLLECTION
   ====================================================== */

function collectPoints(diagram) {
  const result = [];

  if (
    Array.isArray(
      diagram.points
    )
  ) {
    result.push(
      ...diagram.points.map(point)
    );
  }

  if (
    diagram.center
  ) {
    result.push(
      point(diagram.center)
    );
  }

  if (
    diagram.vertex
  ) {
    result.push(
      point(diagram.vertex)
    );
  }

  if (
    diagram.arm1
  ) {
    result.push(
      point(diagram.arm1)
    );
  }

  if (
    diagram.arm2
  ) {
    result.push(
      point(diagram.arm2)
    );
  }

  return result;
}

/* ======================================================
   LABELS
   ====================================================== */

function renderPointLabels({
  points,
  transform,
}) {
  return points.map(
    (item, index) => {
      if (!item.label) {
        return null;
      }

      return (
        <DiagramText
          key={
            `diagram-label-${index}`
          }
          x={
            transform.x(item.x) + 5
          }
          y={
            transform.y(item.y) - 5
          }
          fontSize={9}
        >
          {item.label}
        </DiagramText>
      );
    }
  );
}

/* ======================================================
   GRID
   ====================================================== */

function renderGrid({
  xRange,
  yRange,
  transform,
  showGrid,
}) {
  if (!showGrid) {
    return null;
  }

  const minX = Math.ceil(
    number(xRange?.[0], -10)
  );

  const maxX = Math.floor(
    number(xRange?.[1], 10)
  );

  const minY = Math.ceil(
    number(yRange?.[0], -10)
  );

  const maxY = Math.floor(
    number(yRange?.[1], 10)
  );

  const elements = [];

  for (
    let x = minX;
    x <= maxX;
    x += 1
  ) {
    elements.push(
      <DiagramLine
        key={`grid-x-${x}`}
        x1={transform.x(x)}
        y1={transform.y(minY)}
        x2={transform.x(x)}
        y2={transform.y(maxY)}
        stroke="#E5E7EB"
        strokeWidth={0.6}
      />
    );
  }

  for (
    let y = minY;
    y <= maxY;
    y += 1
  ) {
    elements.push(
      <DiagramLine
        key={`grid-y-${y}`}
        x1={transform.x(minX)}
        y1={transform.y(y)}
        x2={transform.x(maxX)}
        y2={transform.y(y)}
        stroke="#E5E7EB"
        strokeWidth={0.6}
      />
    );
  }

  return elements;
}

/* ======================================================
   AXES
   ====================================================== */

function renderAxes({
  xRange,
  yRange,
  transform,
  showAxes,
}) {
  if (!showAxes) {
    return null;
  }

  const minX = number(
    xRange?.[0],
    -10
  );

  const maxX = number(
    xRange?.[1],
    10
  );

  const minY = number(
    yRange?.[0],
    -10
  );

  const maxY = number(
    yRange?.[1],
    10
  );

  return (
    <>
      <DiagramArrow
        x1={transform.x(minX)}
        y1={transform.y(0)}
        x2={transform.x(maxX)}
        y2={transform.y(0)}
        stroke="#374151"
        strokeWidth={1}
        headSize={4}
      />

      <DiagramArrow
        x1={transform.x(0)}
        y1={transform.y(minY)}
        x2={transform.x(0)}
        y2={transform.y(maxY)}
        stroke="#374151"
        strokeWidth={1}
        headSize={4}
      />
    </>
  );
}

/* ======================================================
   COORDINATE POINTS
   ====================================================== */

function renderPoints({
  points,
  transform,
}) {
  return points.map(
    (item, index) => (
      <DiagramPoint
        key={`point-${index}`}
        x={transform.x(item.x)}
        y={transform.y(item.y)}
        radius={2.5}
      />
    )
  );
}

/* ======================================================
   LINES
   ====================================================== */

function renderLines({
  lines = [],
  transform,
}) {
  return lines.map(
    (line, index) => (
      <DiagramLine
        key={`line-${index}`}
        x1={transform.x(line.x1)}
        y1={transform.y(line.y1)}
        x2={transform.x(line.x2)}
        y2={transform.y(line.y2)}
      />
    )
  );
}

/* ======================================================
   TRIANGLE
   ====================================================== */

function renderTriangle({
  diagram,
  transform,
}) {
  const points =
    Array.isArray(
      diagram.points
    )
      ? diagram.points
      : [];

  if (points.length < 3) {
    return null;
  }

  const coordinates =
    points
      .slice(0, 3)
      .map(
        item =>
          `${transform.x(item.x)},${transform.y(item.y)}`
      )
      .join(" ");

  return (
    <DiagramPolygon
      points={coordinates}
    />
  );
}

/* ======================================================
   RECTANGLE / SQUARE
   ====================================================== */

function renderRectangle({
  diagram,
  transform,
}) {
  const points =
    Array.isArray(
      diagram.points
    )
      ? diagram.points
      : [];

  if (points.length >= 4) {
    return (
      <DiagramPolygon
        points={
          points
            .slice(0, 4)
            .map(
              item =>
                `${transform.x(item.x)},${transform.y(item.y)}`
            )
            .join(" ")
        }
      />
    );
  }

  const x = number(
    diagram.x,
    0
  );

  const y = number(
    diagram.y,
    0
  );

  const diagramWidth =
    number(
      diagram.width,
      5
    );

  const diagramHeight =
    number(
      diagram.height,
      3
    );

  return (
    <DiagramRectangle
      x={transform.x(x)}
      y={
        transform.y(
          y + diagramHeight
        )
      }
      width={
        diagramWidth *
        transform.scale
      }
      height={
        diagramHeight *
        transform.scale
      }
    />
  );
}

/* ======================================================
   CIRCLE
   ====================================================== */

function renderCircle({
  diagram,
  transform,
}) {
  const center =
    point(
      diagram.center
    );

  return (
    <DiagramCircle
      cx={transform.x(center.x)}
      cy={transform.y(center.y)}
      r={
        Math.abs(
          number(
            diagram.radius,
            1
          )
        ) *
        transform.scale
      }
    />
  );
}

/* ======================================================
   ANGLE
   ====================================================== */

function renderAngle({
  diagram,
  transform,
}) {
  const vertex =
    point(
      diagram.vertex
    );

  const arm1 =
    point(
      diagram.arm1
    );

  const arm2 =
    point(
      diagram.arm2
    );

  return (
    <>
      <DiagramAngle
        vertex={{
          x: transform.x(
            vertex.x
          ),
          y: transform.y(
            vertex.y
          ),
        }}
        arm1={{
          x: transform.x(
            arm1.x
          ),
          y: transform.y(
            arm1.y
          ),
        }}
        arm2={{
          x: transform.x(
            arm2.x
          ),
          y: transform.y(
            arm2.y
          ),
        }}
      />

      {diagram.angleLabel && (
        <DiagramText
          x={
            transform.x(
              vertex.x
            ) + 8
          }
          y={
            transform.y(
              vertex.y
            ) - 8
          }
          fontSize={9}
        >
          {diagram.angleLabel}
        </DiagramText>
      )}
    </>
  );
}

/* ======================================================
   FUNCTION GRAPH
   ====================================================== */

function evaluateEquation(
  equation,
  x
) {
  try {
    let expression =
      String(
        equation || ""
      )
        .replace(
          /\^/g,
          "**"
        )
        .replace(
          /π/g,
          "Math.PI"
        )
        .replace(
          /sin/gi,
          "Math.sin"
        )
        .replace(
          /cos/gi,
          "Math.cos"
        )
        .replace(
          /tan/gi,
          "Math.tan"
        )
        .replace(
          /sqrt/gi,
          "Math.sqrt"
        )
        .replace(
          /abs/gi,
          "Math.abs"
        );

    expression =
      expression.replace(
        /^y\s*=\s*/i,
        ""
      );

    /*
     * This evaluator is intentionally limited
     * to mathematical expressions.
     */
    const fn = new Function(
      "x",
      `"use strict"; return (${expression});`
    );

    const result =
      Number(fn(x));

    return Number.isFinite(
      result
    )
      ? result
      : null;
  } catch {
    return null;
  }
}

function renderFunctionGraph({
  diagram,
  transform,
}) {
  const equation =
    String(
      diagram.equation || ""
    ).trim();

  if (!equation) {
    return null;
  }

  const minX =
    number(
      diagram.xRange?.[0],
      -10
    );

  const maxX =
    number(
      diagram.xRange?.[1],
      10
    );

  const steps = 180;

  const pathParts = [];

  let previous = null;

  for (
    let index = 0;
    index <= steps;
    index += 1
  ) {
    const x =
      minX +
      ((maxX - minX) *
        index) /
        steps;

    const y =
      evaluateEquation(
        equation,
        x
      );

    if (y === null) {
      previous = null;
      continue;
    }

    const screenX =
      transform.x(x);

    const screenY =
      transform.y(y);

    if (!previous) {
      pathParts.push(
        `M ${screenX} ${screenY}`
      );
    } else {
      pathParts.push(
        `L ${screenX} ${screenY}`
      );
    }

    previous = {
      x: screenX,
      y: screenY,
    };
  }

  if (!pathParts.length) {
    return null;
  }

  return (
    <DiagramCurve
      path={pathParts.join(" ")}
      stroke="#4F46E5"
      strokeWidth={1.8}
      fill="none"
    />
  );
}

/* ======================================================
   GENERIC PATHS
   ====================================================== */

function renderPaths({
  paths = [],
}) {
  return paths.map(
    (item, index) => (
      <DiagramPath
        key={`path-${index}`}
        d={String(
          item.d || ""
        )}
        stroke={
          item.stroke ||
          "#111827"
        }
        strokeWidth={number(
          item.strokeWidth,
          1.5
        )}
        fill={
          item.fill ||
          "none"
        }
      />
    )
  );
}

/* ======================================================
   UNIVERSAL DIAGRAM
   ====================================================== */

export default function UniversalDiagram({
  diagram = {},
  width = 515,
  height = 300,
}) {
  const safeWidth =
    Math.max(
      number(width, 515),
      100
    );

  const safeHeight =
    Math.max(
      number(height, 300),
      100
    );

  const points =
    collectPoints(
      diagram
    );

  const bounds =
    getBounds(
      points
    );

  const xRange =
    diagram.xRange ||
    [
      Math.min(
        bounds.minX,
        -10
      ),
      Math.max(
        bounds.maxX,
        10
      ),
    ];

  const yRange =
    diagram.yRange ||
    [
      Math.min(
        bounds.minY,
        -10
      ),
      Math.max(
        bounds.maxY,
        10
      ),
    ];

  const transform =
    createTransform({
      width: safeWidth,
      height: safeHeight,
      xRange,
      yRange,
    });

  const type =
    String(
      diagram.type || ""
    );

  return (
    <Svg
      width={safeWidth}
      height={safeHeight}
      viewBox={`0 0 ${safeWidth} ${safeHeight}`}
    >
      {renderGrid({
        xRange,
        yRange,
        transform,
        showGrid:
          diagram.showGrid !== false,
      })}

      {renderAxes({
        xRange,
        yRange,
        transform,
        showAxes:
          diagram.showAxes !== false,
      })}

      {type === "triangle" &&
        renderTriangle({
          diagram,
          transform,
        })}

      {(type === "rectangle" ||
        type === "square") &&
        renderRectangle({
          diagram,
          transform,
        })}

      {type === "circle" &&
        renderCircle({
          diagram,
          transform,
        })}

      {type === "angle" &&
        renderAngle({
          diagram,
          transform,
        })}

      {type ===
        "functionGraph" &&
        renderFunctionGraph({
          diagram,
          transform,
        })}

      {renderLines({
        lines:
          diagram.lines ||
          [],
        transform,
      })}

      {renderPaths({
        paths:
          diagram.paths ||
          [],
      })}

      {renderPoints({
        points,
        transform,
      })}

      {diagram.showLabels !== false &&
        renderPointLabels({
          points,
          transform,
        })}
    </Svg>
  );
}