import React from "react";

import {
    View,
    Text,
    Svg,
    Path,
    Circle
} from "@react-pdf/renderer";


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


/*
    SECTION LABEL

    Same style as:

    • TABLE
    • QUICK REVISION
    • FLOW CHART
*/

function SectionLabel({
    children
}){

    return (

        <View
            wrap={false}
            style={{
                flexDirection:"row",
                alignItems:"center",
                height:12
            }}
        >

            <View
                style={{
                    width:4,
                    height:4,
                    borderRadius:2,
                    backgroundColor:"#8B7CF6",
                    marginRight:5
                }}
            />

            <Text
                style={{
                    fontSize:7.5,
                    fontWeight:"bold",
                    color:"#6D5DFB",
                    letterSpacing:1.5,
                    lineHeight:9
                }}
            >
                {children}
            </Text>

        </View>

    );

}


/*
    QUICK REVISION STYLE ACCENT LINE

    ━━━━━ ● ─────────────────
*/

function AccentLine({
    color
}){

    return (

        <View
            wrap={false}
            style={{
                width:"100%",
                flexDirection:"row",
                alignItems:"center",
                height:7,
                marginTop:8
            }}
        >

            <View
                style={{
                    width:42,
                    height:3,
                    borderRadius:2,
                    backgroundColor:color.main
                }}
            />

            <View
                style={{
                    width:7,
                    height:7,
                    borderRadius:4,
                    backgroundColor:color.main,
                    marginLeft:5,
                    marginRight:6
                }}
            />

            <View
                style={{
                    flex:1,
                    height:1,
                    backgroundColor:color.light
                }}
            />

        </View>

    );

}


/*
    FLOW STEP

    No numbers.
    No bubbles.
    No square badges.
*/

function FlowStep({
    x,
    y,
    text,
    color
}){

    const width = 168;

    const height = 66;


    return (

        <View
            style={{
                position:"absolute",
                left:x,
                top:y - (height / 2),
                width:width,
                height:height,
                justifyContent:"center",
                alignItems:"center",
                paddingLeft:12,
                paddingRight:12,
                zIndex:10
            }}
        >

            <Text
                style={{
                    fontSize:10.5,
                    fontWeight:"bold",
                    color:"#252A35",
                    lineHeight:13,
                    textAlign:"center",
                    width:width - 24,
                    maxWidth:width - 24
                }}
            >
                {String(text || "").trim()}
            </Text>

            <AccentLine
                color={color}
            />

        </View>

    );

}


/*
    CONNECTOR
*/

function StepConnector({
    y,
    side,
    color
}){

    const spineX = 250;

    const nodeRadius = 5;

    const leftX = 28;

    const rightX = 304;

    const cardWidth = 168;


    const cardEdge =
        side === "right"
            ? rightX
            : leftX + cardWidth;


    const start =
        side === "right"
            ?
                spineX +
                nodeRadius
            :
                cardEdge;


    const end =
        side === "right"
            ?
                cardEdge
            :
                spineX -
                nodeRadius;


    const left =
        Math.min(
            start,
            end
        );


    const width =
        Math.abs(
            end -
            start
        );


    return (

        <View
            wrap={false}
            style={{
                position:"absolute",
                left:left,
                top:y - 1,
                width:width,
                height:2,
                borderRadius:2,
                backgroundColor:color.main
            }}
        />

    );

}


export default function NotesFlowchart({

    title = "Flow Chart",

    steps = [],

    content = ""

}){

    /*
        ---------------------------------------
        STEP EXTRACTION
        ---------------------------------------
    */

    let safeSteps = [];


    /*
        Extract readable text from a step.
    */

    const extractStepText = (
        step
    ) => {

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


    /*
        ---------------------------------------
        1. USE EXPLICIT FLOWCHART STEPS
        ---------------------------------------
    */

    if(
        Array.isArray(steps) &&
        steps.length > 0
    ){

        safeSteps =
            steps
                .map(
                    extractStepText
                )
                .filter(Boolean);

    }


    /*
        ---------------------------------------
        2. FALLBACK TO ACTUAL SUPPLIED CONTENT
        ---------------------------------------

        If explicit steps are not supplied, use
        headings and process bullets from the
        real notes content.

        No topic-specific data is hardcoded.
    */

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
            /\b(process|steps?|stages?|cycle|flow|mechanism|procedure|working|how it works|क्रम|चरण|प्रक्रिया|प्रवाह|कार्यविधि)\b/i;

        lines.forEach(line => {

            const headingMatch =
                line.match(
                    /^\s*#{1,6}\s+(.+?)\s*$/
                );

            if(headingMatch){

                const heading =
                    headingMatch[1]
                        .replace(/\*\*/g, "")
                        .trim();

                if(heading){
                    headingItems.push(heading);
                }

                activeProcess =
                    processPattern.test(heading);

                return;
            }

            if(activeProcess){

                const bulletMatch =
                    line.match(
                        /^\s*(?:[-*•]|\d+[.)])\s+(.+?)\s*$/
                    );

                if(bulletMatch){
                    safeSteps.push(
                        bulletMatch[1]
                            .replace(/\*\*/g, "")
                            .trim()
                    );
                }
            }
        });

        if(safeSteps.length === 0){
            safeSteps = headingItems;
        }

    }


    /*
        Remove the main document title from
        the step list when it is also present
        as the first heading.

        This is generic and does NOT assume
        any particular chapter/topic.
    */

    if(
        safeSteps.length > 0 &&
        title
    ){

        const normalizedTitle =
            String(title)
                .trim()
                .toLowerCase();


        if(
            String(
                safeSteps[0]
            )
                .trim()
                .toLowerCase()
                ===
            normalizedTitle
        ){

            safeSteps =
                safeSteps.slice(1);

        }

    }


    /*
        Maximum six steps.
    */

    safeSteps =
        safeSteps.slice(0,6);


    /*
        IMPORTANT:

        If there is no actual flowchart data,
        render NOTHING.

        This prevents a generic flowchart
        from appearing in unrelated PDFs.
    */

    if(
        safeSteps.length === 0
    ){

        return null;

    }


    /*
        ---------------------------------------
        LAYOUT
        ---------------------------------------
    */

    const width = 500;

    const spineX = 250;

    const topSpace = 30;

    const rowGap =
        safeSteps.length >= 5
            ? 70
            : 78;

    const resultGap = 48;

    const spineStartY = 10;


    /*
        STEP POSITIONS
    */

    const positions =
        safeSteps.map(
            (_,index) => {

                return {

                    y:
                        topSpace +
                        (
                            index *
                            rowGap
                        ),

                    side:
                        index % 2 === 0
                            ? "right"
                            : "left"

                };

            }
        );


    const lastY =
        positions[
            positions.length - 1
        ].y;


    const resultY =
        lastY +
        resultGap;


    const chartHeight =
        resultY +
        30;


    return (

        <View
            wrap={false}
            style={{
                width:"100%",
                marginTop:8,
                marginBottom:12
            }}
        >

            {/* ========================= */}
            {/* FLOW CHART HEADER */}
            {/* ========================= */}

            <SectionLabel>
                FLOW CHART
            </SectionLabel>


            <Text
                wrap={false}
                style={{
                    marginTop:4,
                    fontSize:15,
                    fontWeight:"bold",
                    color:"#24203B",
                    lineHeight:19
                }}
            >
                {title}
            </Text>


            {/* ========================= */}
            {/* HEADER DIVIDER */}
            {/* ========================= */}

            <View
                wrap={false}
                style={{
                    width:"100%",
                    flexDirection:"row",
                    alignItems:"center",
                    marginTop:8,
                    marginBottom:10
                }}
            >

                <View
                    style={{
                        width:52,
                        height:3,
                        borderRadius:2,
                        backgroundColor:"#6D5DFB"
                    }}
                />

                <View
                    style={{
                        width:7,
                        height:7,
                        borderRadius:4,
                        backgroundColor:"#A99CFB",
                        marginLeft:5,
                        marginRight:6
                    }}
                />

                <View
                    style={{
                        flex:1,
                        height:1,
                        backgroundColor:"#E3DFF0"
                    }}
                />

            </View>


            {/* ========================= */}
            {/* ROADMAP */}
            {/* ========================= */}

            <View
                wrap={false}
                style={{
                    width:width,
                    height:chartHeight,
                    position:"relative",
                    alignSelf:"center"
                }}
            >

                {/* ========================= */}
                {/* CENTRAL PATH */}
                {/* ========================= */}

                <Svg
                    width={width}
                    height={chartHeight}
                    viewBox={
                        `0 0 ${width} ${chartHeight}`
                    }
                >

                    <Path
                        d={
                            `M ${spineX} ${spineStartY}
                             V ${resultY}`
                        }
                        fill="none"
                        stroke="#64748B"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                    />


                    {/* START NODE */}

                    <Circle
                        cx={spineX}
                        cy={spineStartY}
                        r={5}
                        fill="#64748B"
                    />


                    {/* STEP NODES */}

                    {positions.map(
                        (
                            position,
                            index
                        ) => {

                            const color =
                                FLOW_COLORS[
                                    index %
                                    FLOW_COLORS.length
                                ];


                            return (

                                <Circle
                                    key={
                                        `node-${index}`
                                    }
                                    cx={spineX}
                                    cy={
                                        position.y
                                    }
                                    r={4.5}
                                    fill="#FFFFFF"
                                    stroke={
                                        color.main
                                    }
                                    strokeWidth={2}
                                />

                            );

                        }
                    )}


                    {/* END NODE */}

                    <Circle
                        cx={spineX}
                        cy={resultY}
                        r={5}
                        fill="#64748B"
                    />

                </Svg>


                {/* ========================= */}
                {/* START */}
                {/* ========================= */}

                <View
                    wrap={false}
                    style={{
                        position:"absolute",
                        left:
                            spineX - 82,
                        top:
                            spineStartY - 6,
                        width:70,
                        height:14
                    }}
                >

                    <SectionLabel>
                        START
                    </SectionLabel>

                </View>


                {/* ========================= */}
                {/* STEPS */}
                {/* ========================= */}

                {positions.map(
                    (
                        position,
                        index
                    ) => {

                        const color =
                            FLOW_COLORS[
                                index %
                                FLOW_COLORS.length
                            ];


                        const x =
                            position.side === "right"
                                ? 304
                                : 28;


                        return (

                            <React.Fragment
                                key={
                                    `step-${index}`
                                }
                            >

                                <StepConnector
                                    y={
                                        position.y
                                    }
                                    side={
                                        position.side
                                    }
                                    color={
                                        color
                                    }
                                />


                                <FlowStep
                                    x={x}
                                    y={
                                        position.y
                                    }
                                    text={
                                        safeSteps[
                                            index
                                        ]
                                    }
                                    color={
                                        color
                                    }
                                />

                            </React.Fragment>

                        );

                    }
                )}


                {/* ========================= */}
                {/* END / RESULT */}
                {/* ========================= */}

                <View
                    wrap={false}
                    style={{
                        position:"absolute",
                        left:
                            spineX + 14,
                        top:
                            resultY - 6,
                        width:110,
                        height:14
                    }}
                >

                    <SectionLabel>
                        END / RESULT
                    </SectionLabel>

                </View>

            </View>

        </View>

    );

}