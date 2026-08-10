import React from "react";

import {
    Svg,
    Line,
    Circle,
    Path,
    Text,
} from "@react-pdf/renderer";

function finite(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function safeDimension(value, fallback) {
    const number = Number(value);

    return Number.isFinite(number) && number > 0
        ? number
        : fallback;
}

function safeRange(range, fallbackMin, fallbackMax) {
    const min = finite(range?.[0], fallbackMin);
    const max = finite(range?.[1], fallbackMax);

    if (max <= min) {
        return [fallbackMin, fallbackMax];
    }

    return [min, max];
}

function mapX(value, minX, maxX, width, padding) {
    return (
        padding +
        ((value - minX) / (maxX - minX)) *
            (width - padding * 2)
    );
}

function mapY(value, minY, maxY, height, padding) {
    return (
        height -
        padding -
        ((value - minY) / (maxY - minY)) *
            (height - padding * 2)
    );
}

function createEquationFunction(equation) {
    if (typeof equation === "function") {
        return equation;
    }

    const source = String(equation || "")
        .trim()
        .replace(/^y\s*=\s*/i, "")
        .replace(/\^/g, "**")
        .replace(/\bpi\b/gi, "Math.PI")
        .replace(/\be\b/g, "Math.E")
        .replace(/\bsqrt\s*\(/gi, "Math.sqrt(")
        .replace(/\bsin\s*\(/gi, "Math.sin(")
        .replace(/\bcos\s*\(/gi, "Math.cos(")
        .replace(/\btan\s*\(/gi, "Math.tan(")
        .replace(/\babs\s*\(/gi, "Math.abs(")
        .replace(/\blog\s*\(/gi, "Math.log(")
        .replace(/\bln\s*\(/gi, "Math.log(");

    if (!source) {
        return null;
    }

    if (
        !/^[0-9xXyY+\-*/().,%\s_*a-zA-Z]+$/.test(
            source
        )
    ) {
        return null;
    }

    try {
        const evaluator = new Function(
            "x",
            `return (${source});`
        );

        return (x) => {
            const result = evaluator(x);
            return Number(result);
        };
    } catch {
        return null;
    }
}

function buildFunctionPath({
    equation,
    minX,
    maxX,
    width,
    height,
    padding,
    samples = 180,
}) {
    const equationFunction =
        createEquationFunction(equation);

    if (
        typeof equationFunction !== "function" ||
        samples < 2
    ) {
        return "";
    }

    let path = "";
    let drawing = false;

    for (
        let index = 0;
        index <= samples;
        index += 1
    ) {
        const x =
            minX +
            ((maxX - minX) * index) /
                samples;

        let y;

        try {
            y = Number(
                equationFunction(x)
            );
        } catch {
            y = NaN;
        }

        if (!Number.isFinite(y)) {
            drawing = false;
            continue;
        }

        const px = mapX(
            x,
            minX,
            maxX,
            width,
            padding
        );

        const py = mapY(
            y,
            -10,
            10,
            height,
            padding
        );

        path += drawing
            ? ` L ${px} ${py}`
            : `M ${px} ${py}`;

        drawing = true;
    }

    return path;
}

function CoordinatePlane({
    width = 515,
    height = 260,
    xRange = [-10, 10],
    yRange = [-10, 10],
    points = [],
    lines = [],
    showGrid = true,
    showAxes = true,
    showLabels = true,
}) {
    const safeWidth = safeDimension(
        width,
        515
    );

    const safeHeight = safeDimension(
        height,
        260
    );

    const padding = 28;

    const [minX, maxX] = safeRange(
        xRange,
        -10,
        10
    );

    const [minY, maxY] = safeRange(
        yRange,
        -10,
        10
    );

    const xAxisY =
        minY <= 0 && maxY >= 0
            ? mapY(
                  0,
                  minY,
                  maxY,
                  safeHeight,
                  padding
              )
            : safeHeight - padding;

    const yAxisX =
        minX <= 0 && maxX >= 0
            ? mapX(
                  0,
                  minX,
                  maxX,
                  safeWidth,
                  padding
              )
            : padding;

    const gridLines = [];

    if (showGrid) {
        const xStart = Math.ceil(minX);
        const xEnd = Math.floor(maxX);

        for (
            let x = xStart;
            x <= xEnd;
            x += 1
        ) {
            const px = mapX(
                x,
                minX,
                maxX,
                safeWidth,
                padding
            );

            gridLines.push(
                <Line
                    key={`grid-x-${x}`}
                    x1={px}
                    y1={padding}
                    x2={px}
                    y2={
                        safeHeight -
                        padding
                    }
                    stroke="#E5E7EB"
                    strokeWidth={0.6}
                />
            );
        }

        const yStart = Math.ceil(minY);
        const yEnd = Math.floor(maxY);

        for (
            let y = yStart;
            y <= yEnd;
            y += 1
        ) {
            const py = mapY(
                y,
                minY,
                maxY,
                safeHeight,
                padding
            );

            gridLines.push(
                <Line
                    key={`grid-y-${y}`}
                    x1={padding}
                    y1={py}
                    x2={
                        safeWidth -
                        padding
                    }
                    y2={py}
                    stroke="#E5E7EB"
                    strokeWidth={0.6}
                />
            );
        }
    }

    return (
        <Svg
            width={safeWidth}
            height={safeHeight}
            viewBox={`0 0 ${safeWidth} ${safeHeight}`}
        >
            {gridLines}

            {showAxes && (
                <>
                    <Line
                        x1={padding}
                        y1={xAxisY}
                        x2={
                            safeWidth -
                            padding
                        }
                        y2={xAxisY}
                        stroke="#111827"
                        strokeWidth={1.2}
                    />

                    <Line
                        x1={yAxisX}
                        y1={
                            safeHeight -
                            padding
                        }
                        x2={yAxisX}
                        y2={padding}
                        stroke="#111827"
                        strokeWidth={1.2}
                    />
                </>
            )}

            {lines.map(
                (line, index) => {
                    const x1 = mapX(
                        finite(line?.x1),
                        minX,
                        maxX,
                        safeWidth,
                        padding
                    );

                    const y1 = mapY(
                        finite(line?.y1),
                        minY,
                        maxY,
                        safeHeight,
                        padding
                    );

                    const x2 = mapX(
                        finite(line?.x2),
                        minX,
                        maxX,
                        safeWidth,
                        padding
                    );

                    const y2 = mapY(
                        finite(line?.y2),
                        minY,
                        maxY,
                        safeHeight,
                        padding
                    );

                    return (
                        <Line
                            key={`line-${index}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#6D5DFB"
                            strokeWidth={1.5}
                        />
                    );
                }
            )}

            {points.map(
                (point, index) => {
                    const px = mapX(
                        finite(point?.x),
                        minX,
                        maxX,
                        safeWidth,
                        padding
                    );

                    const py = mapY(
                        finite(point?.y),
                        minY,
                        maxY,
                        safeHeight,
                        padding
                    );

                    return (
                        <React.Fragment
                            key={`point-${index}`}
                        >
                            <Circle
                                cx={px}
                                cy={py}
                                r={3}
                                fill="#6D5DFB"
                            />

                            {showLabels &&
                                point?.label && (
                                    <Text
                                        x={
                                            px +
                                            6
                                        }
                                        y={
                                            py -
                                            6
                                        }
                                        fontSize={9}
                                        fill="#111827"
                                    >
                                        {
                                            point.label
                                        }
                                    </Text>
                                )}
                        </React.Fragment>
                    );
                }
            )}

            {showLabels && (
                <>
                    <Text
                        x={
                            safeWidth -
                            padding +
                            5
                        }
                        y={xAxisY - 5}
                        fontSize={9}
                        fill="#111827"
                    >
                        x
                    </Text>

                    <Text
                        x={yAxisX + 5}
                        y={padding - 5}
                        fontSize={9}
                        fill="#111827"
                    >
                        y
                    </Text>
                </>
            )}
        </Svg>
    );
}

function FunctionGraph({
    width = 515,
    height = 260,
    xRange = [-10, 10],
    yRange = [-10, 10],
    equation,
    points = [],
    showGrid = true,
    showAxes = true,
    showLabels = true,
}) {
    const safeWidth = safeDimension(
        width,
        515
    );

    const safeHeight = safeDimension(
        height,
        260
    );

    const padding = 28;

    const [minX, maxX] = safeRange(
        xRange,
        -10,
        10
    );

    const [minY, maxY] = safeRange(
        yRange,
        -10,
        10
    );

    const xAxisY =
        minY <= 0 && maxY >= 0
            ? mapY(
                  0,
                  minY,
                  maxY,
                  safeHeight,
                  padding
              )
            : safeHeight - padding;

    const yAxisX =
        minX <= 0 && maxX >= 0
            ? mapX(
                  0,
                  minX,
                  maxX,
                  safeWidth,
                  padding
              )
            : padding;

    const gridLines = [];

    if (showGrid) {
        for (
            let x = Math.ceil(minX);
            x <= Math.floor(maxX);
            x += 1
        ) {
            const px = mapX(
                x,
                minX,
                maxX,
                safeWidth,
                padding
            );

            gridLines.push(
                <Line
                    key={`function-grid-x-${x}`}
                    x1={px}
                    y1={padding}
                    x2={px}
                    y2={
                        safeHeight -
                        padding
                    }
                    stroke="#E5E7EB"
                    strokeWidth={0.6}
                />
            );
        }

        for (
            let y = Math.ceil(minY);
            y <= Math.floor(maxY);
            y += 1
        ) {
            const py = mapY(
                y,
                minY,
                maxY,
                safeHeight,
                padding
            );

            gridLines.push(
                <Line
                    key={`function-grid-y-${y}`}
                    x1={padding}
                    y1={py}
                    x2={
                        safeWidth -
                        padding
                    }
                    y2={py}
                    stroke="#E5E7EB"
                    strokeWidth={0.6}
                />
            );
        }
    }

    const path = buildFunctionPath({
        equation,
        minX,
        maxX,
        safeWidth,
        safeHeight,
        padding,
        samples: 220,
    });

    return (
        <Svg
            width={safeWidth}
            height={safeHeight}
            viewBox={`0 0 ${safeWidth} ${safeHeight}`}
        >
            {gridLines}

            {showAxes && (
                <>
                    <Line
                        x1={padding}
                        y1={xAxisY}
                        x2={
                            safeWidth -
                            padding
                        }
                        y2={xAxisY}
                        stroke="#111827"
                        strokeWidth={1.2}
                    />

                    <Line
                        x1={yAxisX}
                        y1={
                            safeHeight -
                            padding
                        }
                        x2={yAxisX}
                        y2={padding}
                        stroke="#111827"
                        strokeWidth={1.2}
                    />
                </>
            )}

            {path && (
                <Path
                    d={path}
                    fill="none"
                    stroke="#6D5DFB"
                    strokeWidth={2}
                />
            )}

            {points.map(
                (point, index) => {
                    const px = mapX(
                        finite(point?.x),
                        minX,
                        maxX,
                        safeWidth,
                        padding
                    );

                    const py = mapY(
                        finite(point?.y),
                        minY,
                        maxY,
                        safeHeight,
                        padding
                    );

                    return (
                        <React.Fragment
                            key={`function-point-${index}`}
                        >
                            <Circle
                                cx={px}
                                cy={py}
                                r={3}
                                fill="#6D5DFB"
                            />

                            {showLabels &&
                                point?.label && (
                                    <Text
                                        x={
                                            px +
                                            6
                                        }
                                        y={
                                            py -
                                            6
                                        }
                                        fontSize={9}
                                        fill="#111827"
                                    >
                                        {
                                            point.label
                                        }
                                    </Text>
                                )}
                        </React.Fragment>
                    );
                }
            )}

            {showLabels && (
                <>
                    <Text
                        x={
                            safeWidth -
                            padding +
                            5
                        }
                        y={xAxisY - 5}
                        fontSize={9}
                        fill="#111827"
                    >
                        x
                    </Text>

                    <Text
                        x={yAxisX + 5}
                        y={padding - 5}
                        fontSize={9}
                        fill="#111827"
                    >
                        y
                    </Text>
                </>
            )}
        </Svg>
    );
}
function mapDiagramPoint(
    point,
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    padding
) {
    return {
        x: mapX(
            finite(point?.x),
            minX,
            maxX,
            width,
            padding
        ),
        y: mapY(
            finite(point?.y),
            minY,
            maxY,
            height,
            padding
        ),
    };
}

function GeometryLabels({
    points = [],
    showLabels = true,
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    padding,
}) {
    if (!showLabels) {
        return null;
    }

    return (
        <>
            {points.map(
                (point, index) => {
                    const mapped =
                        mapDiagramPoint(
                            point,
                            minX,
                            maxX,
                            minY,
                            maxY,
                            width,
                            height,
                            padding
                        );

                    return point?.label ? (
                        <Text
                            key={`geometry-label-${index}`}
                            x={mapped.x + 6}
                            y={mapped.y - 6}
                            fontSize={10}
                            fill="#111827"
                        >
                            {point.label}
                        </Text>
                    ) : null;
                }
            )}
        </>
    );
}

function GeometryDiagram({
    type,
    width = 515,
    height = 260,
    xRange = [-10, 10],
    yRange = [-10, 10],
    points = [],
    lines = [],
    showLabels = true,
    center = { x: 0, y: 0 },
    radius = 5,
    vertex = { x: 0, y: 0 },
    arm1 = { x: 4, y: 0 },
    arm2 = { x: 2, y: 3 },
    angleLabel = "",
}) {
    const safeWidth = safeDimension(
        width,
        515
    );

    const safeHeight = safeDimension(
        height,
        260
    );

    const padding = 28;

    const [minX, maxX] = safeRange(
        xRange,
        -10,
        10
    );

    const [minY, maxY] = safeRange(
        yRange,
        -10,
        10
    );

    const mappedPoints = points.map(
        (point) =>
            mapDiagramPoint(
                point,
                minX,
                maxX,
                minY,
                maxY,
                safeWidth,
                safeHeight,
                padding
            )
    );

    const renderLine = (
        line,
        index
    ) => {
        let first = line;
        let second = null;

        if (
            Array.isArray(line?.points) &&
            line.points.length >= 2
        ) {
            first = line.points[0];
            second = line.points[1];
        }

        if (!second) {
            second = {
                x: line?.x2,
                y: line?.y2,
            };

            first = {
                x: line?.x1,
                y: line?.y1,
            };
        }

        const start =
            mapDiagramPoint(
                first,
                minX,
                maxX,
                minY,
                maxY,
                safeWidth,
                safeHeight,
                padding
            );

        const end =
            mapDiagramPoint(
                second,
                minX,
                maxX,
                minY,
                maxY,
                safeWidth,
                safeHeight,
                padding
            );

        return (
            <Line
                key={`geometry-line-${index}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#6D5DFB"
                strokeWidth={1.8}
            />
        );
    };

    const renderPolygon = (
        polygonPoints,
        closePath = true
    ) => {
        if (
            !Array.isArray(
                polygonPoints
            ) ||
            polygonPoints.length < 2
        ) {
            return null;
        }

        const mapped =
            polygonPoints.map(
                (point) =>
                    mapDiagramPoint(
                        point,
                        minX,
                        maxX,
                        minY,
                        maxY,
                        safeWidth,
                        safeHeight,
                        padding
                    )
            );

        const first = mapped[0];

        const commands = [
            `M ${first.x} ${first.y}`,
        ];

        mapped
            .slice(1)
            .forEach((point) => {
                commands.push(
                    `L ${point.x} ${point.y}`
                );
            });

        if (closePath) {
            commands.push("Z");
        }

        return (
            <Path
                d={commands.join(" ")}
                fill="none"
                stroke="#6D5DFB"
                strokeWidth={1.8}
            />
        );
    };

    const renderAngle = () => {
        const mappedVertex =
            mapDiagramPoint(
                vertex,
                minX,
                maxX,
                minY,
                maxY,
                safeWidth,
                safeHeight,
                padding
            );

        const mappedArm1 =
            mapDiagramPoint(
                arm1,
                minX,
                maxX,
                minY,
                maxY,
                safeWidth,
                safeHeight,
                padding
            );

        const mappedArm2 =
            mapDiagramPoint(
                arm2,
                minX,
                maxX,
                minY,
                maxY,
                safeWidth,
                safeHeight,
                padding
            );

        const labelX =
            (mappedArm1.x +
                mappedArm2.x) /
            2;

        const labelY =
            (mappedArm1.y +
                mappedArm2.y) /
            2;

        return (
            <>
                <Line
                    x1={mappedVertex.x}
                    y1={mappedVertex.y}
                    x2={mappedArm1.x}
                    y2={mappedArm1.y}
                    stroke="#6D5DFB"
                    strokeWidth={1.8}
                />

                <Line
                    x1={mappedVertex.x}
                    y1={mappedVertex.y}
                    x2={mappedArm2.x}
                    y2={mappedArm2.y}
                    stroke="#6D5DFB"
                    strokeWidth={1.8}
                />

                {showLabels &&
                    vertex?.label && (
                        <Text
                            x={
                                mappedVertex.x +
                                6
                            }
                            y={
                                mappedVertex.y -
                                6
                            }
                            fontSize={10}
                            fill="#111827"
                        >
                            {vertex.label}
                        </Text>
                    )}

                {showLabels &&
                    arm1?.label && (
                        <Text
                            x={
                                mappedArm1.x +
                                6
                            }
                            y={
                                mappedArm1.y -
                                6
                            }
                            fontSize={10}
                            fill="#111827"
                        >
                            {arm1.label}
                        </Text>
                    )}

                {showLabels &&
                    arm2?.label && (
                        <Text
                            x={
                                mappedArm2.x +
                                6
                            }
                            y={
                                mappedArm2.y -
                                6
                            }
                            fontSize={10}
                            fill="#111827"
                        >
                            {arm2.label}
                        </Text>
                    )}

                {showLabels &&
                    angleLabel && (
                        <Text
                            x={labelX + 6}
                            y={labelY - 6}
                            fontSize={10}
                            fill="#111827"
                        >
                            {angleLabel}
                        </Text>
                    )}
            </>
        );
    };

    const mappedCenter =
        mapDiagramPoint(
            center,
            minX,
            maxX,
            minY,
            maxY,
            safeWidth,
            safeHeight,
            padding
        );

    const radiusX =
        (finite(radius, 5) /
            (maxX - minX)) *
        (safeWidth - padding * 2);

    const radiusY =
        (finite(radius, 5) /
            (maxY - minY)) *
        (safeHeight - padding * 2);

    return (
        <Svg
            width={safeWidth}
            height={safeHeight}
            viewBox={`0 0 ${safeWidth} ${safeHeight}`}
        >
            {type === "triangle" &&
                renderPolygon(points)}

            {type === "rectangle" &&
                renderPolygon(points)}

            {type === "square" &&
                renderPolygon(points)}

            {type === "line" &&
                lines.map(renderLine)}

            {type === "line" &&
                lines.length === 0 &&
                points.length >= 2 &&
                renderPolygon(
                    points,
                    false
                )}

            {type === "circle" && (
                <Circle
                    cx={mappedCenter.x}
                    cy={mappedCenter.y}
                    r={Math.max(
                        2,
                        Math.min(
                            radiusX,
                            radiusY
                        )
                    )}
                    fill="none"
                    stroke="#6D5DFB"
                    strokeWidth={1.8}
                />
            )}

            {type === "angle" &&
                renderAngle()}

            {mappedPoints.map(
                (point, index) => (
                    <React.Fragment
                        key={`geometry-point-${index}`}
                    >
                        <Circle
                            cx={point.x}
                            cy={point.y}
                            r={3}
                            fill="#6D5DFB"
                        />
                    </React.Fragment>
                )
            )}

            <GeometryLabels
                points={points}
                showLabels={showLabels}
                minX={minX}
                maxX={maxX}
                minY={minY}
                maxY={maxY}
                width={safeWidth}
                height={safeHeight}
                padding={padding}
            />
        </Svg>
    );
}

/* ======================================================
   ASCII → VECTOR DIAGRAM
   ====================================================== */

function ASCIIDiagram({
    ascii = "",
    width = 515,
    height = 260,
}) {
    const safeWidth = safeDimension(
        width,
        515
    );

    const safeHeight = safeDimension(
        height,
        260
    );

    const source = String(
        ascii || ""
    )
        .replace(/\r/g, "")
        .replace(/```/g, "")
        .trim();

    if (!source) {
        return null;
    }

    const rows = source
        .split("\n")
        .filter(
            (row) =>
                row.trim().length > 0
        );

    if (!rows.length) {
        return null;
    }

    const maxColumns = Math.max(
        ...rows.map(
            (row) => row.length
        )
    );

    const columns = Math.max(
        maxColumns,
        1
    );

    const rowCount = Math.max(
        rows.length,
        1
    );

    const horizontalPadding = 24;
    const verticalPadding = 20;

    const cellWidth =
        (safeWidth -
            horizontalPadding * 2) /
        columns;

    const cellHeight =
        (safeHeight -
            verticalPadding * 2) /
        rowCount;

    const elements = [];

    const isHorizontal = (char) =>
        char === "-" ||
        char === "_" ||
        char === "─";

    const isVertical = (char) =>
        char === "|" ||
        char === "│";

    const isDiagonalDown = (char) =>
        char === "\\" ||
        char === "＼";

    const isDiagonalUp = (char) =>
        char === "/" ||
        char === "／";

    const getPoint = (
        row,
        column
    ) => ({
        x:
            horizontalPadding +
            column * cellWidth +
            cellWidth / 2,

        y:
            verticalPadding +
            row * cellHeight +
            cellHeight / 2,
    });

    rows.forEach(
        (row, rowIndex) => {
            for (
                let column = 0;
                column < row.length;
                column += 1
            ) {
                const char =
                    row[column];

                if (
                    !char ||
                    char === " "
                ) {
                    continue;
                }

                const point =
                    getPoint(
                        rowIndex,
                        column
                    );

                if (
                    isHorizontal(char)
                ) {
                    const left =
                        getPoint(
                            rowIndex,
                            Math.max(
                                0,
                                column - 1
                            )
                        );

                    const right =
                        getPoint(
                            rowIndex,
                            Math.min(
                                columns - 1,
                                column + 1
                            )
                        );

                    elements.push(
                        <Line
                            key={`ascii-h-${rowIndex}-${column}`}
                            x1={left.x}
                            y1={point.y}
                            x2={right.x}
                            y2={point.y}
                            stroke="#111827"
                            strokeWidth={1.5}
                        />
                    );

                    continue;
                }

                if (
                    isVertical(char)
                ) {
                    const top =
                        getPoint(
                            Math.max(
                                0,
                                rowIndex - 1
                            ),
                            column
                        );

                    const bottom =
                        getPoint(
                            Math.min(
                                rowCount - 1,
                                rowIndex + 1
                            ),
                            column
                        );

                    elements.push(
                        <Line
                            key={`ascii-v-${rowIndex}-${column}`}
                            x1={point.x}
                            y1={top.y}
                            x2={point.x}
                            y2={bottom.y}
                            stroke="#111827"
                            strokeWidth={1.5}
                        />
                    );

                    continue;
                }

                if (
                    isDiagonalDown(char)
                ) {
                    const start =
                        getPoint(
                            Math.max(
                                0,
                                rowIndex - 1
                            ),
                            Math.max(
                                0,
                                column - 1
                            )
                        );

                    const end =
                        getPoint(
                            Math.min(
                                rowCount - 1,
                                rowIndex + 1
                            ),
                            Math.min(
                                columns - 1,
                                column + 1
                            )
                        );

                    elements.push(
                        <Line
                            key={`ascii-d-${rowIndex}-${column}`}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            stroke="#111827"
                            strokeWidth={1.5}
                        />
                    );

                    continue;
                }

                if (
                    isDiagonalUp(char)
                ) {
                    const start =
                        getPoint(
                            Math.min(
                                rowCount - 1,
                                rowIndex + 1
                            ),
                            Math.max(
                                0,
                                column - 1
                            )
                        );

                    const end =
                        getPoint(
                            Math.max(
                                0,
                                rowIndex - 1
                            ),
                            Math.min(
                                columns - 1,
                                column + 1
                            )
                        );

                    elements.push(
                        <Line
                            key={`ascii-u-${rowIndex}-${column}`}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            stroke="#111827"
                            strokeWidth={1.5}
                        />
                    );

                    continue;
                }

                /*
                 * Any remaining non-space character is treated
                 * as a diagram label.
                 */
                elements.push(
                    <Text
                        key={`ascii-label-${rowIndex}-${column}`}
                        x={
                            point.x -
                            3
                        }
                        y={
                            point.y +
                            3
                        }
                        fontSize={9}
                        fill="#111827"
                    >
                        {char}
                    </Text>
                );
            }
        }
    );

    return (
        <Svg
            width={safeWidth}
            height={safeHeight}
            viewBox={`0 0 ${safeWidth} ${safeHeight}`}
        >
            {elements}
        </Svg>
    );
}

/* ======================================================
   MAIN DIAGRAM COMPONENT
   ====================================================== */

export default function MathDiagram({
    type = "coordinatePlane",
    ...props
}) {
    if (type === "functionGraph") {
        return (
            <FunctionGraph
                {...props}
            />
        );
    }

    if (type === "ascii") {
        return (
            <ASCIIDiagram
                {...props}
            />
        );
    }

    if (
        type === "line" ||
        type === "triangle" ||
        type === "rectangle" ||
        type === "square" ||
        type === "circle" ||
        type === "angle"
    ) {
        return (
            <GeometryDiagram
                type={type}
                {...props}
            />
        );
    }

    return (
        <CoordinatePlane
            {...props}
        />
    );
}

export {
    MathDiagram,
    CoordinatePlane,
    FunctionGraph,
    GeometryDiagram,
    ASCIIDiagram,
};