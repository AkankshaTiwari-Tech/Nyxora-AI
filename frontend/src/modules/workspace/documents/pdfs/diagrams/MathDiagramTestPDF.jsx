import React from "react";

import {
    Document,
    Page,
    View,
    Text,
    StyleSheet,
} from "@react-pdf/renderer";

import MathDiagram from "../diagrams/MathDiagram";

const styles = StyleSheet.create({
    page: {
        padding: 32,
        fontSize: 10,
    },

    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },

    heading: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 14,
        marginBottom: 6,
    },

    diagramBox: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 8,
        padding: 4,
    },
});

export default function MathDiagramTestPDF() {
    return (
        <Document>

            {/* ==================================================
                PAGE 1
                ================================================== */}

            <Page
                size="A4"
                style={styles.page}
            >

                <Text style={styles.title}>
                    Nyxora Universal Vector Diagram Test
                </Text>

                {/* ==============================================
                    1. COORDINATE PLANE
                    ============================================== */}

                <Text style={styles.heading}>
                    1. Coordinate Plane
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="coordinatePlane"
                        xRange={[-6, 6]}
                        yRange={[-6, 6]}
                        points={[
                            {
                                x: 2,
                                y: 3,
                                label: "A",
                            },
                            {
                                x: -3,
                                y: 2,
                                label: "B",
                            },
                            {
                                x: 4,
                                y: -2,
                                label: "C",
                            },
                        ]}
                        lines={[
                            {
                                x1: -3,
                                y1: 2,
                                x2: 2,
                                y2: 3,
                            },
                        ]}
                    />
                </View>

                {/* ==============================================
                    2. FUNCTION GRAPH
                    ============================================== */}

                <Text style={styles.heading}>
                    2. Function Graph: y = x² - 4
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="functionGraph"
                        xRange={[-5, 5]}
                        yRange={[-6, 10]}
                        equation={(x) =>
                            x * x - 4
                        }
                        points={[
                            {
                                x: -2,
                                y: 0,
                                label: "A",
                            },
                            {
                                x: 2,
                                y: 0,
                                label: "B",
                            },
                            {
                                x: 0,
                                y: -4,
                                label: "C",
                            },
                        ]}
                    />
                </View>

                {/* ==============================================
                    3. UNIVERSAL TRIANGLE
                    ============================================== */}

                <Text style={styles.heading}>
                    3. Vector Triangle
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="scene"
                        xRange={[0, 10]}
                        yRange={[0, 8]}
                        showGrid={false}
                        showAxes={false}
                        lines={[
                            {
                                x1: 1,
                                y1: 1,
                                x2: 9,
                                y2: 1,
                            },
                            {
                                x1: 9,
                                y1: 1,
                                x2: 5,
                                y2: 7,
                            },
                            {
                                x1: 5,
                                y1: 7,
                                x2: 1,
                                y2: 1,
                            },
                        ]}
                        points={[
                            {
                                x: 1,
                                y: 1,
                            },
                            {
                                x: 9,
                                y: 1,
                            },
                            {
                                x: 5,
                                y: 7,
                            },
                        ]}
                        labels={[
                            {
                                x: 0.7,
                                y: 0.5,
                                text: "A",
                            },
                            {
                                x: 9.2,
                                y: 0.5,
                                text: "B",
                            },
                            {
                                x: 5,
                                y: 7.6,
                                text: "C",
                            },
                        ]}
                    />
                </View>

                {/* ==============================================
                    4. CIRCLE + DIAMETER + LABELS
                    ============================================== */}

                <Text style={styles.heading}>
                    4. Circle
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="scene"
                        xRange={[-7, 7]}
                        yRange={[-7, 7]}
                        showGrid={false}
                        showAxes={false}
                        circles={[
                            {
                                cx: 0,
                                cy: 0,
                                r: 5,
                            },
                        ]}
                        lines={[
                            {
                                x1: -5,
                                y1: 0,
                                x2: 5,
                                y2: 0,
                            },
                        ]}
                        points={[
                            {
                                x: -5,
                                y: 0,
                            },
                            {
                                x: 0,
                                y: 0,
                            },
                            {
                                x: 5,
                                y: 0,
                            },
                        ]}
                        labels={[
                            {
                                x: -5.5,
                                y: 0.5,
                                text: "A",
                            },
                            {
                                x: -0.3,
                                y: 0.5,
                                text: "O",
                            },
                            {
                                x: 5.2,
                                y: 0.5,
                                text: "B",
                            },
                        ]}
                    />
                </View>

            </Page>


            {/* ==================================================
                PAGE 2
                ================================================== */}

            <Page
                size="A4"
                style={styles.page}
            >

                <Text style={styles.title}>
                    Universal Vector Components
                </Text>

                {/* ==============================================
                    5. ARROWS / VECTORS
                    ============================================== */}

                <Text style={styles.heading}>
                    5. Vectors and Arrows
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="scene"
                        xRange={[0, 10]}
                        yRange={[0, 8]}
                        showGrid={true}
                        showAxes={false}
                        arrows={[
                            {
                                x1: 1,
                                y1: 2,
                                x2: 8,
                                y2: 2,
                                endArrow: true,
                                label: "F",
                            },
                            {
                                x1: 2,
                                y1: 1,
                                x2: 5,
                                y2: 6,
                                endArrow: true,
                                label: "v",
                            },
                        ]}
                        labels={[
                            {
                                x: 8.2,
                                y: 2.2,
                                text: "F",
                            },
                            {
                                x: 5.2,
                                y: 6.2,
                                text: "v",
                            },
                        ]}
                    />
                </View>

                {/* ==============================================
                    6. ELLIPSE + RECTANGLE
                    ============================================== */}

                <Text style={styles.heading}>
                    6. Ellipse and Rectangle
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="scene"
                        xRange={[0, 12]}
                        yRange={[0, 8]}
                        showGrid={false}
                        showAxes={false}
                        ellipses={[
                            {
                                cx: 3,
                                cy: 4,
                                rx: 2,
                                ry: 1.5,
                            },
                        ]}
                        rectangles={[
                            {
                                x: 7,
                                y: 7,
                                width: 4,
                                height: 3,
                            },
                        ]}
                        labels={[
                            {
                                x: 2.2,
                                y: 5.8,
                                text: "Ellipse",
                            },
                            {
                                x: 7.5,
                                y: 6.5,
                                text: "Rectangle",
                            },
                        ]}
                    />
                </View>

                {/* ==============================================
                    7. POLYGON + PATH
                    ============================================== */}

                <Text style={styles.heading}>
                    7. Polygon and Path
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="scene"
                        xRange={[0, 12]}
                        yRange={[0, 8]}
                        showGrid={false}
                        showAxes={false}
                        polygons={[
                            {
                                points: [
                                    {
                                        x: 1,
                                        y: 1,
                                    },
                                    {
                                        x: 4,
                                        y: 6,
                                    },
                                    {
                                        x: 7,
                                        y: 1,
                                    },
                                    {
                                        x: 4,
                                        y: 3,
                                    },
                                ],
                                closed: true,
                            },
                        ]}
                        paths={[
                            {
                                d:
                                    "M 8 6 C 9 8 10 2 11 4",
                                style: {
                                    stroke: "#111827",
                                    strokeWidth: 1.5,
                                    fill: "none",
                                },
                            },
                        ]}
                        labels={[
                            {
                                x: 3.6,
                                y: 6.5,
                                text: "P",
                            },
                            {
                                x: 8,
                                y: 7,
                                text: "Curve",
                            },
                        ]}
                    />
                </View>

                {/* ==============================================
                    8. ARC / ANGLE
                    ============================================== */}

                <Text style={styles.heading}>
                    8. Arc and Angle
                </Text>

                <View style={styles.diagramBox}>
                    <MathDiagram
                        type="scene"
                        xRange={[-2, 8]}
                        yRange={[-2, 8]}
                        showGrid={false}
                        showAxes={false}
                        lines={[
                            {
                                x1: 0,
                                y1: 0,
                                x2: 6,
                                y2: 0,
                            },
                            {
                                x1: 0,
                                y1: 0,
                                x2: 4,
                                y2: 5,
                            },
                        ]}
                        arcs={[
                            {
                                cx: 0,
                                cy: 0,
                                radius: 1.5,
                                startAngle: 0,
                                endAngle: 51,
                            },
                        ]}
                        points={[
                            {
                                x: 0,
                                y: 0,
                            },
                        ]}
                        labels={[
                            {
                                x: -0.4,
                                y: -0.6,
                                text: "O",
                            },
                            {
                                x: 6.2,
                                y: 0.2,
                                text: "A",
                            },
                            {
                                x: 4.2,
                                y: 5.3,
                                text: "B",
                            },
                            {
                                x: 1.5,
                                y: 1,
                                text: "θ",
                            },
                        ]}
                    />
                </View>

            </Page>

        </Document>
    );
}