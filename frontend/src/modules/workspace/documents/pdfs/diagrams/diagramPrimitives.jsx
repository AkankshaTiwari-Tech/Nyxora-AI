import {
  Line,
  Circle,
  Path,
  Polygon,
  Rect,
  Text,
} from "@react-pdf/renderer";

/* ======================================================
   BASIC VECTOR PRIMITIVES
   ====================================================== */

export function DiagramLine({
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 0,
  stroke = "#111827",
  strokeWidth = 1.5,
  ...props
}) {
  return (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

export function DiagramCircle({
  cx = 0,
  cy = 0,
  r = 1,
  stroke = "#111827",
  strokeWidth = 1.5,
  fill = "none",
  ...props
}) {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...props}
    />
  );
}

export function DiagramRectangle({
  x = 0,
  y = 0,
  width = 10,
  height = 10,
  stroke = "#111827",
  strokeWidth = 1.5,
  fill = "none",
  ...props
}) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...props}
    />
  );
}

export function DiagramPolygon({
  points = "",
  stroke = "#111827",
  strokeWidth = 1.5,
  fill = "none",
  ...props
}) {
  return (
    <Polygon
      points={points}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...props}
    />
  );
}

export function DiagramPath({
  d = "",
  stroke = "#111827",
  strokeWidth = 1.5,
  fill = "none",
  ...props
}) {
  return (
    <Path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...props}
    />
  );
}

/* ======================================================
   TEXT / LABEL
   ====================================================== */

export function DiagramText({
  x = 0,
  y = 0,
  children = "",
  fontSize = 9,
  fill = "#111827",
  fontFamily = "NotoSans",
  ...props
}) {
  return (
    <Text
      x={x}
      y={y}
      fontSize={fontSize}
      fill={fill}
      fontFamily={fontFamily}
      {...props}
    >
      {children}
    </Text>
  );
}

/* ======================================================
   POINT
   ====================================================== */

export function DiagramPoint({
  x = 0,
  y = 0,
  radius = 2.5,
  fill = "#111827",
  ...props
}) {
  return (
    <Circle
      cx={x}
      cy={y}
      r={radius}
      fill={fill}
      {...props}
    />
  );
}

/* ======================================================
   ARROW
   ====================================================== */

export function DiagramArrow({
  x1 = 0,
  y1 = 0,
  x2 = 20,
  y2 = 0,
  stroke = "#111827",
  strokeWidth = 1.5,
  headSize = 5,
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const length = Math.sqrt(
    dx * dx + dy * dy
  );

  if (!length) {
    return null;
  }

  const ux = dx / length;
  const uy = dy / length;

  const px = -uy;
  const py = ux;

  const leftX =
    x2 -
    ux * headSize +
    px * headSize * 0.6;

  const leftY =
    y2 -
    uy * headSize +
    py * headSize * 0.6;

  const rightX =
    x2 -
    ux * headSize -
    px * headSize * 0.6;

  const rightY =
    y2 -
    uy * headSize -
    py * headSize * 0.6;

  return (
    <>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <Line
        x1={x2}
        y1={y2}
        x2={leftX}
        y2={leftY}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <Line
        x1={x2}
        y1={y2}
        x2={rightX}
        y2={rightY}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </>
  );
}

/* ======================================================
   ANGLE ARMS
   ====================================================== */

export function DiagramAngle({
  vertex = { x: 0, y: 0 },
  arm1 = { x: 40, y: 0 },
  arm2 = { x: 20, y: -30 },
  stroke = "#111827",
  strokeWidth = 1.5,
}) {
  return (
    <>
      <Line
        x1={vertex.x}
        y1={vertex.y}
        x2={arm1.x}
        y2={arm1.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <Line
        x1={vertex.x}
        y1={vertex.y}
        x2={arm2.x}
        y2={arm2.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </>
  );
}

/* ======================================================
   ARC
   ====================================================== */

export function DiagramArc({
  path = "",
  stroke = "#111827",
  strokeWidth = 1.5,
  fill = "none",
  ...props
}) {
  return (
    <Path
      d={path}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...props}
    />
  );
}

/* ======================================================
   CURVE
   ====================================================== */

export function DiagramCurve({
  path = "",
  stroke = "#111827",
  strokeWidth = 1.5,
  fill = "none",
  ...props
}) {
  return (
    <Path
      d={path}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...props}
    />
  );
}

/* ======================================================
   SHADING
   ====================================================== */

export function DiagramShadedRegion({
  points = "",
  fill = "#EDE9FE",
  stroke = "#111827",
  strokeWidth = 1,
  opacity = 0.45,
  ...props
}) {
  return (
    <Polygon
      points={points}
      fill={fill}
      fillOpacity={opacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}