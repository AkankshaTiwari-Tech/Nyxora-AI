import React from "react";

import {
    View,
    Text
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


function getFlowFont(text=""){

    return /[\u0900-\u097F]/u.test(
        String(text || "")
    )
        ? "NotoSansDevanagari"
        : "Helvetica";

}


function SectionLabel({children}){

    return (

        <View
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
                    fontFamily:"Helvetica",
                    fontSize:7.5,
                    fontWeight:"bold",
                    color:"#6D5DFB",
                    letterSpacing:1.5,
                    lineHeight:9
                }}
            >
                {String(children || "")}
            </Text>

        </View>

    );

}


function AccentLine({color}){

    return (

        <View
            style={{
                width:"100%",
                flexDirection:"row",
                alignItems:"center",
                height:7,
                marginTop:5
            }}
        >

            <View
                style={{
                    width:34,
                    height:2.5,
                    borderRadius:2,
                    backgroundColor:color.main
                }}
            />

            <View
                style={{
                    width:6,
                    height:6,
                    borderRadius:3,
                    backgroundColor:color.main,
                    marginLeft:4,
                    marginRight:5
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


function FlowCard({text,color}){

    const rawText =
        String(text || "")
            .replace(/\*\*/g, "")
            .replace(/^[-*•]\s*/u, "")
            .trim();

    const mainPointMatch =
        rawText.match(
            /^([^:：]{2,56})\s*[:：]/
        );

    const displayText =
        mainPointMatch
            ? mainPointMatch[1].trim()
            : rawText;

    return (

        <View
            style={{
                width:150,
                minHeight:48,
                paddingVertical:6,
                paddingHorizontal:8,
                borderWidth:1,
                borderColor:"#DDE1EA",
                borderRadius:8,
                backgroundColor:"#FCFCFE",
                justifyContent:"center"
            }}
        >

            <Text
                style={{
                    fontFamily:getFlowFont(displayText),
                    fontSize:8.2,
                    fontWeight:"bold",
                    color:"#252A35",
                    lineHeight:9.5,
                    textAlign:"center"
                }}
            >
                {displayText}
            </Text>

        </View>

    );

}


function Connector({side,color}){

    return (

        <View
            style={{
                width:42,
                height:50,
                justifyContent:"center",
                alignItems:"center"
            }}
        >

            <View
                style={{
                    width:"100%",
                    height:1.5,
                    backgroundColor:color.main
                }}
            />

            <View
                style={{
                    position:"absolute",
                    width:9,
                    height:9,
                    borderRadius:5,
                    backgroundColor:"#FFFFFF",
                    borderWidth:2,
                    borderColor:color.main
                }}
            />

        </View>

    );

}


function CenterNode({color,last=false}){

    return (

        <View
            style={{
                width:42,
                height:60,
                alignItems:"center",
                justifyContent:"center",
                position:"relative"
            }}
        >

            <View
                style={{
                    position:"absolute",
                    top:0,
                    bottom:last ? 30 : 0,
                    width:2,
                    backgroundColor:"#64748B",
                    borderRadius:2
                }}
            />

            <View
                style={{
                    width:9,
                    height:9,
                    borderRadius:5,
                    backgroundColor:"#FFFFFF",
                    borderWidth:2,
                    borderColor:color.main,
                    zIndex:2
                }}
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


    if(
        safeSteps.length > 0 &&
        title
    ){

        const normalizedTitle =
            String(title)
                .trim()
                .toLowerCase();

        if(
            String(safeSteps[0])
                .trim()
                .toLowerCase()
                ===
            normalizedTitle
        ){
            safeSteps =
                safeSteps.slice(1);
        }

    }


    safeSteps =
        safeSteps
            .filter(Boolean)
            .slice(0,6);


    if(safeSteps.length === 0){
        return null;
    }


    const rows =
        safeSteps.map(
            (_,index) => index
        );


    return (

        <View
            style={{
                width:"100%",
                marginTop:18,
                marginBottom:16
            }}
        >

            <SectionLabel>
                FLOW CHART
            </SectionLabel>

            <Text
                style={{
                    fontFamily:getFlowFont(title),
                    fontSize:15,
                    fontWeight:"bold",
                    color:"#24203B",
                    lineHeight:19,
                    marginTop:3
                }}
            >
                {String(title || "Flow Chart")}
            </Text>

            <View
                style={{
                    width:"100%",
                    flexDirection:"row",
                    alignItems:"center",
                    marginTop:7,
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


            <View
                style={{
                    alignItems:"center",
                    width:"100%"
                }}
            >

                <View
                    style={{
                        flexDirection:"row",
                        alignItems:"center",
                        justifyContent:"center",
                        marginBottom:2
                    }}
                >

                    <Text
                        style={{
                            fontFamily:"Helvetica",
                            fontSize:7.5,
                            fontWeight:"bold",
                            color:"#6D5DFB",
                            letterSpacing:1.2,
                            marginRight:8
                        }}
                    >
                        START
                    </Text>

                    <View
                        style={{
                            width:10,
                            height:10,
                            borderRadius:5,
                            backgroundColor:"#64748B"
                        }}
                    />

                </View>


                {
                    rows.map(index => {

                        const color =
                            FLOW_COLORS[
                                index % FLOW_COLORS.length
                            ];

                        const isRight =
                            index % 2 === 0;

                        return (

                            <View
                                key={`flow-row-${index}`}
                                style={{
                                    width:"100%",
                                    minHeight:54,
                                    flexDirection:"row",
                                    alignItems:"center",
                                    justifyContent:"center"
                                }}
                            >

                                <View
                                    style={{
                                        width:160,
                                        alignItems:isRight
                                            ? "flex-end"
                                            : "flex-end",
                                        justifyContent:"center"
                                    }}
                                >
                                    {!isRight && (
                                        <FlowCard
                                            text={
                                                safeSteps[index]
                                            }
                                            color={color}
                                        />
                                    )}
                                </View>


                                <Connector
                                    side={
                                        isRight
                                            ? "right"
                                            : "left"
                                    }
                                    color={color}
                                />


                                <View
                                    style={{
                                        width:160,
                                        alignItems:isRight
                                            ? "flex-start"
                                            : "flex-start",
                                        justifyContent:"center"
                                    }}
                                >
                                    {isRight && (
                                        <FlowCard
                                            text={
                                                safeSteps[index]
                                            }
                                            color={color}
                                        />
                                    )}
                                </View>

                            </View>

                        );

                    })
                }


                <View
                    style={{
                        flexDirection:"row",
                        alignItems:"center",
                        justifyContent:"center",
                        marginTop:2
                    }}
                >

                    <View
                        style={{
                            width:10,
                            height:10,
                            borderRadius:5,
                            backgroundColor:"#64748B",
                            marginRight:8
                        }}
                    />

                    <Text
                        style={{
                            fontFamily:"Helvetica",
                            fontSize:7.5,
                            fontWeight:"bold",
                            color:"#6D5DFB",
                            letterSpacing:1.2
                        }}
                    >
                        END / RESULT
                    </Text>

                </View>

            </View>

        </View>

    );

}