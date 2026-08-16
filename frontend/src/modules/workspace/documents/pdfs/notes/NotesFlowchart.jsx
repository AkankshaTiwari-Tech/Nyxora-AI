import React from "react";

import {
    View,
    Text,
    Svg,
    Circle,
    Rect,
    Line,
    Path
} from "@react-pdf/renderer";

import {
    normalizeLatexText,
    normalizeContentText
} from "./contentTextNormalizer.js";


const FLOW_COLORS = [

    {
        main:"#4F7DF3",
        light:"#DCE7FF"
    },

    {
        main:"#16A394",
        light:"#D8F3EE"
    },

    {
        main:"#E58A00",
        light:"#F9E4B8"
    },

    {
        main:"#F0445E",
        light:"#F9D6DD"
    },

    {
        main:"#3FA66B",
        light:"#DDF1E4"
    },

    {
        main:"#8A63D8",
        light:"#E8DDF7"
    }

];


const FLOW_MATH_PATTERN =
    /[π√∞∑∫≤≥≠≈±×÷→←↔⇒⇔α-ωΑ-Ω⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/u;

function getFlowFont(text=""){

    const value = String(text || "");

    if(/[\u0900-\u097F]/u.test(value)){
        return "NotoSansDevanagari";
    }

    if(FLOW_MATH_PATTERN.test(value)){
        return "STIXTwoMath";
    }

    return "Helvetica";

}



function cleanFlowPoint(text=""){

    const sourceText =
        String(text || "")
            .replace(/\*\*/g, "")
            .replace(/^[-*•]\s*/u, "")
            .trim();

    /*
     * DIRECTLY CONNECT THE SHARED NYXORA LATEX NORMALIZER.
     *
     * This is the same normalizeLatexText() exported by
     * contentTextNormalizer.js.
     *
     * Examples:
     *   \leftrightarrow  -> ↔
     *   \rightarrow      -> →
     *   \leftarrow       -> ←
     *   \Rightarrow     -> ⇒
     *   \Longleftrightarrow -> ⟺
     *   x^{2}            -> x²
     *   a_{1}            -> a₁
     *   \frac{a}{b}      -> (a)/(b)
     */

    const latexNormalized =
        normalizeLatexText(
            sourceText
        );

    /*
     * Keep the ordinary content normalizer in the flowchart pipeline too.
     * This preserves the existing Notes text-cleaning behavior.
     */

const rawText =
    normalizeContentText(
        normalizeLatexText(
            String(text || "")
                .replace(/\*\*/g, "")
                .replace(/^[-*•]\s*/u, "")
        )
    )
        .replace(/\s+/g, " ")
        .trim();

const mainPointMatch =
    rawText.match(
        /^([^:：]{2,56})\s*[:：]/
    );

if (mainPointMatch) {
    return mainPointMatch[1].trim();
}

if (rawText.length <= 32) {
    return rawText.trim();
}

const sentenceBreak =
    rawText.match(
        /^(.{1,32}?)(?:[.!?;,:]\s+|\s+(?:is|are|was|were|means|refers to|represents|shows|includes|contains|involves)\b)/iu
    );

if (sentenceBreak?.[1]) {
    return sentenceBreak[1].trim();
}

return rawText
    .split(/\s+/)
    .slice(0, 4)
    .join(" ")
    .trim();

}


function normalizeFlowTitle(title=""){

    return normalizeLatexText(
        String(title || "")
            .replace(/\*\*/g, "")
            .trim()
    )
        .replace(/\s+/g, " ")
        .trim();

}


function wrapSvgText(
    text = ""
){

    const value =
        String(text || "")
            .trim()
            .replace(/\s+/g, " ");

    if (!value) {
        return [];
    }

    const words =
        value
            .split(/\s+/)
            .filter(Boolean);

    if (!words.length) {
        return [];
    }

    const MAX_CHARS_PER_LINE = 20;
    const MAX_LINES = 3;

    const lines = [];
    let currentLine = "";

    words.forEach(
        word => {

            const candidate =
                currentLine
                    ? `${currentLine} ${word}`
                    : word;

            if (
                candidate.length <=
                MAX_CHARS_PER_LINE
            ) {

                currentLine =
                    candidate;

                return;
            }

            if (currentLine) {
                lines.push(
                    currentLine
                );
            }

            currentLine =
                word;

        }
    );

    if (currentLine) {
        lines.push(
            currentLine
        );
    }

    if (
        lines.length > MAX_LINES
    ) {

        const compactLines = [];

        const wordsPerLine =
            Math.ceil(
                words.length /
                MAX_LINES
            );

        for (
            let i = 0;
            i < words.length;
            i += wordsPerLine
        ) {

            compactLines.push(
                words
                    .slice(
                        i,
                        i + wordsPerLine
                    )
                    .join(" ")
            );
        }

        return compactLines
            .slice(
                0,
                MAX_LINES
            );
    }

    return lines;
}


function getFlowTextFontSize(lines=[]){

    const longestLine =
        Math.max(
            ...lines.map(
                line =>
                    String(line || "").length
            ),
            1
        );

    const lineCount =
        lines.length;

    if(lineCount >= 3){
        return 5.2;
    }

    if(lineCount === 2){
        return 6.5;
    }

    if(longestLine <= 28){
        return 7.2;
    }

    if(longestLine <= 34){
        return 6.9;
    }

    if(longestLine <= 40){
        return 6.6;
    }

    return 6.2;
}




function FlowchartSvg({
    title="",
    steps=[]
}){

    const normalizedTitle =
        normalizeFlowTitle(
            title
        ).toLowerCase();

    const filteredSteps =
        steps
            .map(step => {

                let point =
                    cleanFlowPoint(step);

                if(
                    /\bvs\.?$/iu.test(point) &&
                    normalizedTitle &&
                    point.toLowerCase() !==
                        normalizedTitle
                ){

                    point =
                        point.replace(
                            /\bvs\.?$/iu,
                            "vs. " +
                            normalizeFlowTitle(title)
                        ).trim();

                }

                return point;

            })
            .filter(Boolean)
            .filter(step =>
                step.toLowerCase() !== normalizedTitle
            )
            .slice(0,6);

    /*
     * NEW LAYOUT:
     *
     *              START
     *                ●
     *                │
     *          ╱────────────╲
     *       [01]          [02]
     *          ╲────────────╱
     *             ╲      ╱
     *             [03]
     *                │
     *             [04]
     *                │
     *          ╲────────────╱
     *       [05]          [06]
     *          ╲────────────╱
     *                │
     *              ● END
     *
     * This is a "diamond cascade": not a grid, not an S-curve,
     * and not a standard vertical timeline.
     */

    const width = 500;
    const height = 365;

    const centerX = 250;

    const cardWidth = 156;
    const cardHeight = 42;

    const leftX = 28;
    const rightX =
        width -
        28 -
        cardWidth;

    const topY = 66;
    const pairGapY = 58;
    const singleGapY = 62;

    const layouts = [
        { kind:"pair", y:66,  left:0, right:1 },
        { kind:"single", y:125, index:2 },
        { kind:"single", y:187, index:3 },
        { kind:"pair", y:249, left:4, right:5 }
    ];

    const accent = "#6D5DFB";
    const spine = "#D2D6E0";

    return (

        <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
        >

            {/* START */}

            <Circle
                cx={centerX}
                cy={22}
                r={5.5}
                fill="#5F6878"
            />

            <Circle
                cx={centerX - 64}
                cy={28}
                r={2}
                fill="#8B7CF6"
            />

            <Text
                x={centerX - 55}
                y={30.8}
                fontFamily="Helvetica"
                fontSize={6.3}
                fontWeight="bold"
                fill={accent}
                letterSpacing={1.25}
                textAnchor="start"
            >
                START
            </Text>

            <Line
                x1={centerX - 55}
                y1={36}
                x2={centerX - 20}
                y2={36}
                stroke={accent}
                strokeWidth={2}
                strokeLinecap="round"
            />

            <Line
                x1={centerX - 16}
                y1={36}
                x2={centerX - 9}
                y2={36}
                stroke="#E3DFF0"
                strokeWidth={1}
                strokeLinecap="round"
            />

            <Line
                x1={centerX}
                y1={28}
                x2={centerX}
                y2={45}
                stroke={spine}
                strokeWidth={1.6}
                strokeLinecap="round"
            />


            {layouts.map((layout,layoutIndex) => {

                const colorFor =
                    index =>
                        FLOW_COLORS[
                            index %
                            FLOW_COLORS.length
                        ];

                if(layout.kind === "pair"){

                    const leftStep =
                        filteredSteps[
                            layout.left
                        ];

                    const rightStep =
                        filteredSteps[
                            layout.right
                        ];

                    if(!leftStep && !rightStep){
                        return null;
                    }

                    const y = layout.y;

                    return (
                        <View
                            key={
                                "diamond-pair-" +
                                layoutIndex
                            }
                        >

                            {/* pair bridge */}

                            <Line
                                x1={centerX}
                                y1={y - 22}
                                x2={centerX}
                                y2={y}
                                stroke={spine}
                                strokeWidth={1.6}
                                strokeLinecap="round"
                            />

                            <Line
                                x1={centerX}
                                y1={y}
                                x2={centerX}
                                y2={y + 22}
                                stroke={spine}
                                strokeWidth={1.6}
                                strokeLinecap="round"
                            />

                            {leftStep && (

                                <Card
                                    step={leftStep}
                                    index={layout.left}
                                    x={leftX}
                                    y={y}
                                    side="left"
                                    color={colorFor(layout.left)}
                                />

                            )}

                            {rightStep && (

                                <Card
                                    step={rightStep}
                                    index={layout.right}
                                    x={rightX}
                                    y={y}
                                    side="right"
                                    color={colorFor(layout.right)}
                                />

                            )}

                            <Circle
                                cx={centerX}
                                cy={y}
                                r={6}
                                fill="#FFFFFF"
                                stroke={
                                    leftStep
                                        ? colorFor(layout.left).main
                                        : colorFor(layout.right).main
                                }
                                strokeWidth={1.8}
                            />

                            <Circle
                                cx={centerX}
                                cy={y}
                                r={1.8}
                                fill={
                                    leftStep
                                        ? colorFor(layout.left).main
                                        : colorFor(layout.right).main
                                }
                            />

                        </View>
                    );
                }

                const step =
                    filteredSteps[
                        layout.index
                    ];

                if(!step){
                    return null;
                }

                const color =
                    colorFor(
                        layout.index
                    );

                const y =
                    layout.y;

                const lines =
                    wrapSvgText(step);

                const fontSize =
                    getFlowTextFontSize(lines);

const lineGap =
    lines.length >= 3
        ? 6
        : 8;

                const textStart =
                    y -
                    (
                        (
                            (lines.length - 1) *
                            lineGap
                        ) /
                        2
                    );

                const cardTop =
                    y -
                    (
                        cardHeight / 2
                    );

                return (
                    <View
                        key={
                            "diamond-single-" +
                            layoutIndex
                        }
                    >

                        <Line
                            x1={centerX}
                            y1={y - 28}
                            x2={centerX}
                            y2={y + 28}
                            stroke={spine}
                            strokeWidth={1.6}
                            strokeLinecap="round"
                        />

                        <Rect
                            x={centerX - (cardWidth / 2) + 2}
                            y={cardTop + 2}
                            rx={12}
                            ry={12}
                            width={cardWidth}
                            height={cardHeight}
                            fill="#E9EBF0"
                            opacity={0.28}
                        />

                        <Rect
                            x={centerX - (cardWidth / 2)}
                            y={cardTop}
                            rx={12}
                            ry={12}
                            width={cardWidth}
                            height={cardHeight}
                            fill="#FFFFFF"
                            stroke={color.light}
                            strokeWidth={1}
                        />

                        <Line
                            x1={centerX - 28}
                            y1={cardTop + 5}
                            x2={centerX}
                            y2={cardTop + 5}
                            stroke={color.main}
                            strokeWidth={2}
                            strokeLinecap="round"
                        />

                        <Line
                            x1={centerX + 5}
                            y1={cardTop + 5}
                            x2={centerX + 16}
                            y2={cardTop + 5}
                            stroke="#E7E8EF"
                            strokeWidth={2}
                            strokeLinecap="round"
                        />

                        <Text
                            x={centerX + (cardWidth / 2) - 14}
                            y={cardTop + 13}
                            fontFamily="Helvetica"
                            fontSize={5.8}
                            fontWeight="bold"
                            fill="#7A8190"
                            letterSpacing={0.8}
                            textAnchor="end"
                        >
                            {String(layout.index + 1).padStart(2,"0")}
                        </Text>

                        {lines.map(
                            (line,lineIndex) => (
                                <Text
                                    key={
                                        "diamond-single-text-" +
                                        layoutIndex +
                                        "-" +
                                        lineIndex
                                    }
                                    x={centerX}
                                    y={
                                        textStart +
                                        (
                                            lineIndex *
                                            lineGap
                                        ) +
                                        1
                                    }
                                    fontFamily={
                                        getFlowFont(line)
                                    }
                                    fontSize={fontSize}
                                    fontWeight="bold"
                                    fill="#252A35"
                                    textAnchor="middle"
                                >
                                    {line}
                                </Text>
                            )
                        )}

                        <Line
                            x1={centerX - 46}
                            y1={cardTop + cardHeight - 3}
                            x2={centerX + 46}
                            y2={cardTop + cardHeight - 3}
                            stroke={color.main}
                            strokeWidth={1.8}
                            strokeLinecap="round"
                        />

                    </View>
                );

            })}


            {/* final connector */}

            <Line
                x1={centerX}
                y1={271}
                x2={centerX}
                y2={309}
                stroke={spine}
                strokeWidth={1.6}
                strokeLinecap="round"
            />


            {/* END */}

            <Circle
                cx={centerX}
                cy={312}
                r={5.5}
                fill="#5F6878"
            />

            <Circle
                cx={centerX - 52}
                cy={337}
                r={2}
                fill="#8B7CF6"
            />

            <Text
                x={centerX - 43}
                y={339.8}
                fontFamily="Helvetica"
                fontSize={6.3}
                fontWeight="bold"
                fill={accent}
                letterSpacing={1.2}
                textAnchor="start"
            >
                END / RESULT
            </Text>

            <Line
                x1={centerX - 43}
                y1={345}
                x2={centerX + 1}
                y2={345}
                stroke={accent}
                strokeWidth={2}
                strokeLinecap="round"
            />

            <Line
                x1={centerX + 5}
                y1={345}
                x2={centerX + 13}
                y2={345}
                stroke="#E3DFF0"
                strokeWidth={1}
                strokeLinecap="round"
            />

        </Svg>

    );

}


function Card({
    step,
    index,
    x,
    y,
    side,
    color
}){

    const cardWidth = 156;
    const cardHeight = 42;

    /*
     * Normalize one more time at the card boundary.
     *
     * This guarantees that every AI-generated label reaching the actual
     * SVG Text element has already passed through the shared LaTeX parser.
     */

    const normalizedStep =
        cleanFlowPoint(
            step
        );

    const lines =
        wrapSvgText(
            normalizedStep
        );

    const fontSize =
        getFlowTextFontSize(lines);

const lineGap =
    lines.length >= 3
        ? 6
        : 8;

    const textStart =
        y -
        (
            (
                (lines.length - 1) *
                lineGap
            ) /
            2
        );

    const cardTop =
        y -
        (
            cardHeight / 2
        );

    const center =
        x +
        (
            cardWidth / 2
        );

    return (

        <View>

            <Rect
                x={x + 2}
                y={cardTop + 2}
                rx={12}
                ry={12}
                width={cardWidth}
                height={cardHeight}
                fill="#E9EBF0"
                opacity={0.28}
            />

            <Rect
                x={x}
                y={cardTop}
                rx={12}
                ry={12}
                width={cardWidth}
                height={cardHeight}
                fill="#FFFFFF"
                stroke={color.light}
                strokeWidth={1}
            />

            <Line
                x1={x + 16}
                y1={cardTop + 5}
                x2={x + 44}
                y2={cardTop + 5}
                stroke={color.main}
                strokeWidth={2}
                strokeLinecap="round"
            />

            <Line
                x1={x + 49}
                y1={cardTop + 5}
                x2={x + 60}
                y2={cardTop + 5}
                stroke="#E7E8EF"
                strokeWidth={2}
                strokeLinecap="round"
            />

            <Text
                x={
                    side === "left"
                        ? x + cardWidth - 14
                        : x + 14
                }
                y={cardTop + 13}
                fontFamily="Helvetica"
                fontSize={5.8}
                fontWeight="bold"
                fill="#7A8190"
                letterSpacing={0.8}
                textAnchor={
                    side === "left"
                        ? "end"
                        : "start"
                }
            >
                {String(index + 1).padStart(2,"0")}
            </Text>

            {lines.map(
                (line,lineIndex) => (

                    <Text
                        key={
                            "diamond-card-text-" +
                            index +
                            "-" +
                            lineIndex
                        }
                        x={center}
                        y={
                            textStart +
                            (
                                lineIndex *
                                lineGap
                            ) +
                            1
                        }
                        fontFamily={
                            getFlowFont(line)
                        }
                        fontSize={fontSize}
                        fontWeight="bold"
                        fill="#252A35"
                        textAnchor="middle"
                    >
                        {line}
                    </Text>

                )
            )}

            <Line
                x1={x + 16}
                y1={cardTop + cardHeight - 3}
                x2={x + cardWidth - 16}
                y2={cardTop + cardHeight - 3}
                stroke={color.main}
                strokeWidth={1.8}
                strokeLinecap="round"
            />

        </View>

    );

}


export default function NotesFlowchart({

    title = "Flow Chart",

    steps = [],

    content = ""

}){

    let safeSteps = [];


    const extractStepText = (step) => {

        if(
            typeof step === "string"
        ){
            return step.trim();
        }


        if(
            Array.isArray(step)
        ){

            const firstText =
                step.find(
                    item =>
                        typeof item === "string" &&
                        item.trim()
                );

            return firstText
                ? firstText.trim()
                : "";

        }


        if(
            step &&
            typeof step === "object"
        ){

            const possibleValues = [
                step.text,
                step.label,
                step.title,
                step.content,
                step.description,
                step.name,
                step.step,
                step.value,
                step.topic,
                step.heading
            ];

            const value =
                possibleValues.find(
                    item =>
                        typeof item === "string" &&
                        item.trim()
                );

            if(value){
                return value.trim();
            }

            const firstString =
                Object.values(step).find(
                    value =>
                        typeof value === "string" &&
                        value.trim()
                );

            return firstString
                ? firstString.trim()
                : "";

        }

        return "";

    };


    if(
        Array.isArray(steps) &&
        steps.length > 0
    ){

        safeSteps =
            steps
                .map(extractStepText)
                .filter(Boolean);

    }


    if(
        safeSteps.length === 0 &&
        typeof content === "string" &&
        content.trim()
    ){

        const lines =
            content
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean);

        const headingItems = [];
        let activeProcess = false;

        const processPattern =
            /\b(process|steps?|stages?|cycle|flow|mechanism|procedure|working|how it works|sequence|क्रम|चरण|प्रक्रिया|प्रवाह|कार्यविधि|क्रमबद्ध)\b/i;

        lines.forEach(line => {

            const headingMatch =
                line.match(
                    /^\s*#{1,6}\s+(.+?)\s*$/
                );

            if(headingMatch){

                const heading =
                    normalizeLatexText(
                        headingMatch[1]
                            .replace(/\*\*/g, "")
                            .trim()
                    );

                if(heading){
                    headingItems.push(
                        heading
                    );
                }

                activeProcess =
                    processPattern.test(
                        heading
                    );

                return;

            }

            if(activeProcess){

                const bulletMatch =
                    line.match(
                        /^\s*(?:[-*•]|\d+[.)])\s+(.+?)\s*$/
                    );

                if(bulletMatch){

                    safeSteps.push(
                        normalizeLatexText(
                            bulletMatch[1]
                                .replace(/\*\*/g, "")
                                .trim()
                        )
                    );

                }

            }

        });


        if(safeSteps.length === 0){
            safeSteps = headingItems;
        }

    }


    if(
        safeSteps.length > 0 &&
        title
    ){

        const normalizedTitle =
            normalizeFlowTitle(
                title
            ).toLowerCase();

        if(
            normalizeFlowTitle(
                safeSteps[0]
            ).toLowerCase()
            ===
            normalizedTitle
        ){

            safeSteps =
                safeSteps.slice(1);

        }

    }


    safeSteps =
        safeSteps
            .map(
                step =>
                    normalizeLatexText(
                        String(step || "")
                    )
            )
            .filter(Boolean)
            .slice(0,6);


    if(safeSteps.length === 0){
        return null;
    }


    return (

        <View
            style={{
                width:"100%",
                marginTop:2,
                marginBottom:8
            }}
        >

            <FlowchartSvg
                title={title}
                steps={safeSteps}
            />

        </View>

    );

}