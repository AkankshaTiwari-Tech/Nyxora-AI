import {
    View,
    Text,
} from "@react-pdf/renderer";

import {
    normalizeLatexText,
    normalizeContentText
} from "./contentTextNormalizer.js";



function normalizeCellValue(value){

    return normalizeContentText(
        normalizeLatexText(
            String(value ?? "")
        )
    );

}

function getTableFont(text=""){

    const value = String(text || "");

    if(/[\u0900-\u097F]/u.test(value)){
        return "NotoSansDevanagari";
    }

    /*
     * Any non-ASCII character after normalizeLatexText()
     * (π, √, ↔, ≤, α, β, superscripts, subscripts, etc.)
     * uses STIXTwoMath.
     */
    if(/[^\x00-\x7F]/u.test(value)){
        return "STIXTwoMath";
    }

    return "Helvetica";

}

export default function NotesTable({
    headers = [],
    rows = [],
    title = "",
}) {

    const normalizedHeaders =
        Array.isArray(headers)
            ? headers.slice(0, 4)
            : [];

    const normalizedRows =
        Array.isArray(rows)
            ? rows
            : [];

    if (
        normalizedHeaders.length === 0 &&
        normalizedRows.length === 0
    ) {
        return null;
    }



    return (
        <View
            style={{
                width: "100%",

                marginTop: 14,

                marginBottom: 16,
            }}
        >

            {/* TABLE TITLE */}

            {title ? (

    <View
        style={{
            width: "100%",
            marginBottom: 10,
            paddingBottom: 8,
        }}
        wrap={false}
    >

        {/* SECTION LABEL */}

        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
            }}
        >

            <View
                style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "#8B7CF6",
                    marginRight: 5,
                }}
            />

            <Text
                style={{
                    fontFamily: "STIXTwoMath",
                    fontSize: 7.5,
                    fontWeight: "bold",
                    color: "#6D5DFB",
                    letterSpacing: 1.5,
                }}
            >
                TABLE
            </Text>

        </View>


        {/* TABLE HEADING */}

        <Text
            style={{
                fontFamily: "STIXTwoMath",
                fontSize: 15.5,
                fontWeight: "bold",
                color: "#24203B",
                lineHeight: 1.38,
                textAlign: "left",
            }}
        >
            {normalizeCellValue(title)}
        </Text>


        {/* PREMIUM DIVIDER */}

        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
            }}
        >

            <View
                style={{
                    width: 52,
                    height: 3,
                    backgroundColor: "#6D5DFB",
                    borderRadius: 2,
                }}
            />

            <View
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: "#A99CFB",
                    marginLeft: 5,
                    marginRight: 6,
                }}
            />

            <View
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#E3DFF0",
                }}
            />

        </View>

    </View>

) : null}



            {/* TABLE CARD */}

            <View
                style={{
                    width: "100%",

                    borderWidth: 1,

                    borderColor: "#C8BFFF",

                    borderRadius: 14,

                    overflow: "hidden",

                    backgroundColor: "#FFFFFF",

                    marginTop: 1,

                    marginBottom: 1,
                }}
                wrap={false}
            >

                {/* HEADER */}

                {normalizedHeaders.length > 0 && (

                    <View
                        style={{
                            flexDirection: "row",

                            width: "100%",

                            backgroundColor: "#6D5DFB",

                            borderBottomWidth: 1,

                            borderBottomColor: "#5948E7",
                        }}

                        wrap={false}
                    >

                        {normalizedHeaders.map(
                            (header, index) => (

                                <View
                                    key={
                                        "notes-table-header-" +
                                        index
                                    }

                                    style={{
                                        flex:
                                            index === 0
                                                ? 0.95
                                                : 1,

                                        minHeight: 38,

                                        justifyContent:
                                            "center",

                                        paddingVertical: 8,

                                        paddingHorizontal: 8,

                                        borderRightWidth:
                                            index <
                                            normalizedHeaders.length - 1
                                                ? 1
                                                : 0,

                                        borderRightColor:
                                            "#8D7EF5",
                                    }}
                                >

                                    <Text
                                        style={{
                                            fontFamily: "STIXTwoMath",

                                            fontSize: 8.5,

                                            fontWeight:
                                                "bold",

                                            color: "#FFFFFF",

                                            textAlign: "center",

                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {normalizeCellValue(
                                            header
                                        )}
                                    </Text>

                                </View>
                            )
                        )}

                    </View>
                )}



                {/* BODY */}

                {normalizedRows.map(
                    (row, rowIndex) => {

                        const cells =
                            Array.isArray(row)
                                ? row
                                : (
                                    row &&
                                    typeof row === "object"
                                )
                                    ? normalizedHeaders.map(
                                          header =>
                                              row[header]
                                      )
                                    : [row];



                        return (
                            <View
                                key={
                                    "notes-table-row-" +
                                    rowIndex
                                }

                                style={{
                                    flexDirection: "row",

                                    width: "100%",

                                    backgroundColor:
                                        rowIndex % 2 === 0
                                            ? "#FFFFFF"
                                            : "#FAF9FF",

                                    borderBottomWidth:
                                        rowIndex <
                                        normalizedRows.length - 1
                                            ? 1
                                            : 0,

                                    borderBottomColor:
                                        "#E5E0F7",

                                    borderBottomLeftRadius:
                                        rowIndex ===
                                        normalizedRows.length - 1
                                            ? 13
                                            : 0,

                                    borderBottomRightRadius:
                                        rowIndex ===
                                        normalizedRows.length - 1
                                            ? 13
                                            : 0,

                                    overflow: "hidden",
                                }}
                            >

                                {cells
                                    .slice(0, 4)
                                    .map(
                                        (
                                            cell,
                                            cellIndex
                                        ) => (

                                            <View
                                                key={
                                                    "notes-table-cell-" +
                                                    rowIndex +
                                                    "-" +
                                                    cellIndex
                                                }

                                                style={{
                                                    flex:
                                                        cellIndex === 0
                                                            ? 0.95
                                                            : 1,

                                                    paddingVertical: 8,

                                                    paddingHorizontal: 8,

                                                    backgroundColor:
                                                        cellIndex === 0
                                                            ? "#F6F3FF"
                                                            : undefined,

                                                    borderRightWidth:
                                                        cellIndex <
                                                        cells.length - 1
                                                            ? 1
                                                            : 0,

                                                    borderRightColor:
                                                        "#E8E3F5",

                                                    borderBottomLeftRadius:
                                                        rowIndex ===
                                                            normalizedRows.length - 1 &&
                                                        cellIndex === 0
                                                            ? 13
                                                            : 0,

                                                    borderBottomRightRadius:
                                                        rowIndex ===
                                                            normalizedRows.length - 1 &&
                                                        cellIndex ===
                                                            cells.length - 1
                                                            ? 13
                                                            : 0,
                                                }}
                                            >

                                                <Text
                                                    style={{
                                                        fontFamily: "STIXTwoMath",

                                                        fontSize: 8,

                                                        fontWeight:
                                                            cellIndex === 0
                                                                ? "bold"
                                                                : "normal",

                                                        color:
                                                            cellIndex === 0
                                                                ? "#4F46E5"
                                                                : "#1F2937",

                                                        lineHeight: 1.35,
                                                    }}
                                                >
                                                    {normalizeCellValue(
                                                        cell
                                                    )}
                                                </Text>

                                            </View>
                                        )
                                    )}

                            </View>
                        );
                    }
                )}

            </View>

        </View>
    );
}