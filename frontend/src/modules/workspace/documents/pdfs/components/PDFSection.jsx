import {

    View,

    Text

}

from "@react-pdf/renderer";


import PDFQuestion

from "./PDFQuestion";


import pdfTheme

from "../styles/pdfTheme";

function SectionHeader({

    title

}){

    return (

        <View

            style={{

                width:"100%",

                marginTop:2,

                marginBottom:12,

                paddingBottom:9,

            }}

            wrap={false}

        >

            {/* SECTION LABEL */}

            <View

                style={{

                    flexDirection:"row",

                    alignItems:"center",

                    marginBottom:5,

                }}

            >

                <View

                    style={{

                        width:4,

                        height:4,

                        borderRadius:2,

                        backgroundColor:"#8B7CF6",

                        marginRight:5,

                    }}

                />

                <Text

                    style={{

                        fontFamily:"NotoSansDevanagari",

                        fontSize:7.5,

                        fontWeight:"bold",

                        color:"#6D5DFB",

                        letterSpacing:1.5,

                    }}

                >

                    SECTION

                </Text>

            </View>


            {/* MAIN SECTION TITLE */}

            <Text

                style={{

                    fontFamily:"NotoSansDevanagari",

                    fontSize:15.5,

                    fontWeight:"bold",

                    color:"#24203B",

                    lineHeight:1.38,

                    textAlign:"left",

                }}

            >

                {title}

            </Text>


            {/* PREMIUM DIVIDER */}

            <View

                style={{

                    flexDirection:"row",

                    alignItems:"center",

                    marginTop:8,

                }}

            >

                <View

                    style={{

                        width:52,

                        height:3,

                        backgroundColor:"#6D5DFB",

                        borderRadius:2,

                    }}

                />

                <View

                    style={{

                        width:7,

                        height:7,

                        borderRadius:4,

                        backgroundColor:"#A99CFB",

                        marginLeft:5,

                        marginRight:6,

                    }}

                />

                <View

                    style={{

                        flex:1,

                        height:1,

                        backgroundColor:"#E3DFF0",

                    }}

                />

            </View>

        </View>

    );

}


export default function PDFSection({



    section = {}



}){



return (

<View
    style={{
        marginBottom:18
    }}
>







<SectionHeader

title={section.title}

/>









{

(section.questions || [])

.map(

(question,index)=>(



<PDFQuestion

key={index}

number={index + 1}

question={question}

isInstruction={

section.title === "Instructions"

}

/>



)

)

}







</View>

);


}