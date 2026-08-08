import {

View,

Text

}

from "@react-pdf/renderer";

import PDFOption

from "./PDFOption";

import MathExpression

from "../renderer/MathExpression";

import pdfTheme

from "../styles/pdfTheme";



function NumberBubble({

number

}){



return (

<View

style={{

width:22,

height:22,

borderRadius:11,

backgroundColor:"#6D5DFB",

justifyContent:"center",

alignItems:"center",

marginRight:8

}}

>



<Text

style={{

fontFamily:"NotoSansDevanagari",

color:"#FFFFFF",

fontSize:9,

fontWeight:700

}}

>

{number}



</Text>



</View>

);

}



function parseHindiInlineMCQ(text=""){



const value = String(text || "")

.replace(/\s+/g," ")

.trim();



const firstOption = value.search(

/\([कखगघ]\)\s*/u

);



if(firstOption < 0){

return null;

}



const questionText =

value

.slice(0,firstOption)

.trim();



if(!questionText){

return null;

}



const optionPart =

value.slice(firstOption);



const matches = [

...optionPart.matchAll(

/\(([कखगघ])\)\s*([\s\S]*?)(?=\s*\([कखगघ]\)\s*|$)/gu

)

];



if(matches.length < 2){

return null;

}



const options = matches

.map(match=>({

letter:match[1],

text:String(match[2] || "")

.trim()

}))

.filter(option=>option.text);



if(options.length < 2){

return null;

}



return {

questionText,

options

};

}



function HindiMCQOption({

letter,

text

}){



return (

<View

wrap={false}

style={{

flexDirection:"row",

alignItems:"center",

marginTop:6,

marginLeft:28,

padding:8,

backgroundColor:"#F7F5FF",

borderWidth:1,

borderColor:"#E2D9FF",

borderRadius:10

}}

>



<View

style={{

width:20,

height:20,

borderRadius:10,

backgroundColor:"#6D5DFB",

justifyContent:"center",

alignItems:"center",

marginRight:8

}}

>



<Text

style={{

fontFamily:"NotoSansDevanagari",

color:"#FFFFFF",

fontSize:9,

fontWeight:700

}}

>

{letter}



</Text>



</View>



<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:pdfTheme.option.text,

color:pdfTheme.colors.text,

flex:1

}}

>

{text}



</Text>



</View>

);

}



function HindiMCQOptions({

options=[]

}){



const letters=[

"क",

"ख",

"ग",

"घ"

];



return (

<View

style={{

width:"100%",

marginTop:2

}}

>



{

options.map(

(option,index)=>{

const value =

typeof option === "object"

?

String(

option.text ||

option.value ||

""

)

:

String(option || "");



return (

<HindiMCQOption

key={"hindi-option-"+index}

letter={

typeof option === "object" &&

option.letter

?

option.letter

:

letters[index] ||

String.fromCharCode(97 + index)

}

text={value.trim()}

/>

);

}

)

}



</View>

);

}



export default function PDFQuestion({



number,



question = {},



isInstruction = false



}){



const rawQuestionText =

String(question.text || "");



const inlineHindiMCQ =

parseHindiInlineMCQ(

rawQuestionText

);



const separateHindiOptions =

Array.isArray(question.options)

?

question.options

:

[];



const looksLikeHindiMCQ =

question.isHindiMCQ === true

||

inlineHindiMCQ !== null

||

(

/^प्र(?:श्न)?\s*\d+\s*[.)]/u.test(

rawQuestionText.trim()

)

&&

separateHindiOptions.length >= 2

&&

/\([कखगघ]\)/u.test(

separateHindiOptions

.map(option=>

typeof option === "object"

?

String(

option.text ||

option.value ||

""

)

:

String(option || "")

)

.join(" ")

)

);



if(looksLikeHindiMCQ && !isInstruction){



const hindiQuestionText =

inlineHindiMCQ

?

inlineHindiMCQ.questionText

:

rawQuestionText;



const hindiOptions =

inlineHindiMCQ

?

inlineHindiMCQ.options

:

separateHindiOptions;



return (

<View

style={{

marginBottom:12,

width:"100%"

}}

>



<View

wrap={false}

style={{

width:"100%",

paddingVertical:8,

paddingHorizontal:10,

borderRadius:12,

backgroundColor:"#F5F1FF",

borderWidth:1,

borderColor:"#D8CCFF",

flexDirection:"row",

alignItems:"flex-start",

marginBottom:6

}}

>



<NumberBubble

number={number}

/>



<Text

style={{

flex:1,

fontFamily:"NotoSansDevanagari",

fontSize:11,

lineHeight:1.4,

color:"#161C48"

}}

>

{hindiQuestionText}



</Text>



</View>



{

question.math &&

<MathExpression

value={question.math}

/>

}



<HindiMCQOptions

options={hindiOptions}

/>



</View>

);

}



return (

<View

style={{

marginBottom:12

}}

>



<View

style={{

flexDirection:"row",

alignItems:"flex-start"

}}

>



<NumberBubble

number={number}

/>



<Text

style={{

flex:1,

fontFamily:"NotoSansDevanagari",

fontSize:11,

color:"#161C48"

}}

>

{question.text}



</Text>



{

question.math &&

<MathExpression

value={question.math}

/>

}



</View>



{

!isInstruction &&

<View

wrap={false}

style={{

marginTop:6

}}

>



{

(question.options || [])

.map(

(option,index)=>(



<PDFOption

key={index}

option={option}

index={index}

/>



)

)

}



</View>

}



</View>

);

}