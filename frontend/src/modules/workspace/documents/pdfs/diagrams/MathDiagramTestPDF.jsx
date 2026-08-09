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
    },
});

export default function MathDiagramTestPDF() {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>
                    Nyxora Math Diagram Test
                </Text>

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
            </Page>
        </Document>
    );
}