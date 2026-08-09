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

function buildFunctionPath({
    equation,
    minX,
    maxX,
    width,
    height,
    padding,
    samples = 180,
}) {
    if (
        typeof equation !== "function" ||
        samples < 2
    ) {
        return "";
    }

    let path = "";
    let drawing = false;

    for (let index = 0; index <= samples; index += 1) {
        const x =
            minX +
            ((maxX - minX) * index) /
                samples;

        let y;

        try {
            y = Number(equation(x));
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
                  height,
                  padding
              )
            : height - padding;

    const yAxisX =
        minX <= 0 && maxX >= 0
            ? mapX(
                  0,
                  minX,
                  maxX,
                  width,
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
                width,
                padding
            );

            gridLines.push(
                <Line
                    key={`grid-x-${x}`}
                    x1={px}
                    y1={padding}
                    x2={px}
                    y2={height - padding}
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
                height,
                padding
            );

            gridLines.push(
                <Line
                    key={`grid-y-${y}`}
                    x1={padding}
                    y1={py}
                    x2={width - padding}
                    y2={py}
                    stroke="#E5E7EB"
                    strokeWidth={0.6}
                />
            );
        }
    }

    return (
        <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
        >
            {gridLines}

            {showAxes && (
                <>
                    <Line
                        x1={padding}
                        y1={xAxisY}
                        x2={width - padding}
                        y2={xAxisY}
                        stroke="#111827"
                        strokeWidth={1.2}
                    />

                    <Line
                        x1={yAxisX}
                        y1={height - padding}
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
                        width,
                        padding
                    );

                    const y1 = mapY(
                        finite(line?.y1),
                        minY,
                        maxY,
                        height,
                        padding
                    );

                    const x2 = mapX(
                        finite(line?.x2),
                        minX,
                        maxX,
                        width,
                        padding
                    );

                    const y2 = mapY(
                        finite(line?.y2),
                        minY,
                        maxY,
                        height,
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
                        width,
                        padding
                    );

                    const py = mapY(
                        finite(point?.y),
                        minY,
                        maxY,
                        height,
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
                                        x={px + 6}
                                        y={py - 6}
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
                        x={width - padding + 5}
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
                  height,
                  padding
              )
            : height - padding;

    const yAxisX =
        minX <= 0 && maxX >= 0
            ? mapX(
                  0,
                  minX,
                  maxX,
                  width,
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
                width,
                padding
            );

            gridLines.push(
                <Line
                    key={`function-grid-x-${x}`}
                    x1={px}
                    y1={padding}
                    x2={px}
                    y2={height - padding}
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
                height,
                padding
            );

            gridLines.push(
                <Line
                    key={`function-grid-y-${y}`}
                    x1={padding}
                    y1={py}
                    x2={width - padding}
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
        width,
        height,
        padding,
        samples: 220,
    });

    return (
        <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
        >
            {gridLines}

            {showAxes && (
                <>
                    <Line
                        x1={padding}
                        y1={xAxisY}
                        x2={width - padding}
                        y2={xAxisY}
                        stroke="#111827"
                        strokeWidth={1.2}
                    />

                    <Line
                        x1={yAxisX}
                        y1={height - padding}
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
                        width,
                        padding
                    );

                    const py = mapY(
                        finite(point?.y),
                        minY,
                        maxY,
                        height,
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
                                        x={px + 6}
                                        y={py - 6}
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
                        x={width - padding + 5}
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
};