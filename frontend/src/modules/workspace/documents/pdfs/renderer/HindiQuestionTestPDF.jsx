import {

Document,

Page,

View,

Text,

Image,

Svg,

Defs,

LinearGradient,

Stop,

Rect

}

from "@react-pdf/renderer";


import "../styles/pdfFonts";


function RestoredGradientLine(){

return(

<Svg

width="515"

height="4"

viewBox="0 0 515 4"

>

<Defs>

<LinearGradient

id="nyxoraHeaderGradientRestored"

x1="0%"

y1="0%"

x2="100%"

y2="0%"

>

<Stop

offset="0%"

stopColor="#6D5DFB"

/>

<Stop

offset="35%"

stopColor="#7C6CFF"

/>

<Stop

offset="65%"

stopColor="#06B6D4"

/>

<Stop

offset="100%"

stopColor="#EC4899"

/>

</LinearGradient>

</Defs>

<Rect

x="0"

y="0"

width="515"

height="4"

rx="2"

fill="url(#nyxoraHeaderGradientRestored)"

/>

</Svg>

);

}


function HindiPDFHeader({title="Nyxora Document"}){

return(

<View
style={{

marginBottom:12,

width:"100%"

}}
>

<Text
style={{

fontFamily:"NotoSansDevanagari",

fontSize:22,

fontWeight:"bold",

color:"#161C48",

marginBottom:6

}}
>

{cleanText(title)}

</Text>

<View
style={{

height:2,

backgroundColor:"#6D5DFB",

width:"100%"

}}
/>

</View>

);

}


function HindiPDFMetadata({data={}}){

const subject =
String(data.subject || data.subjectName || "Not Provided").trim() || "Not Provided";

const className =
String(data.className || data.class || data.grade || "Not Provided").trim() || "Not Provided";

const chapter =
String(data.chapter || data.chapterName || data.topic || "Not Provided").trim() || "Not Provided";

const type =
String(data.type || data.documentType || "test").trim() || "test";

return(

<View
style={{

marginBottom:18,

padding:12,

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:14,

backgroundColor:"#FFFFFF",

width:"100%"

}}
>

<Text
style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

fontWeight:"bold",

color:"#6D5DFB",

marginBottom:8

}}
>

DOCUMENT DETAILS

</Text>

<View
style={{

flexDirection:"row",

flexWrap:"wrap",

width:"100%"

}}
>

{[

["SUBJECT",subject],

["CLASS",className],

["CHAPTER",chapter],

["TYPE",type]

].map((item,index)=>(

<View
key={"metadata-" + index}
style={{

width:"48%",

marginRight:index % 2 === 0 ? "2%" : 0,

marginBottom:6,

padding:8,

backgroundColor:"#F5F1FF",

borderWidth:1,

borderColor:"#E2D9FF",

borderRadius:10

}}
>

<Text
style={{

fontFamily:"NotoSansDevanagari",

fontSize:7,

color:"#6D5DFB",

marginBottom:2

}}
>

{item[0]}

</Text>

<Text
style={{

fontFamily:"NotoSansDevanagari",

fontSize:9,

color:"#161C48"

}}
>

{cleanText(item[1])}

</Text>

</View>

))}

</View>

</View>

);

}


import PDFHeader

from "../components/PDFHeader";


import PDFMetadata

from "../components/PDFMetadata";


function cleanText(text = ""){

return String(text || "")

.replace(/\*\*/g, "")

.replace(/###/g, "")

.replace(/##/g, "")

.replace(/#/g, "")

.replace(/\\\(/g, "")

.replace(/\\\)/g, "")

.replace(/\$/g, "")

.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")

.replace(/\\times/g, "×")

.replace(/\\div/g, "÷")

.replace(/\\cdot/g, "·")

.replace(/\\circ/g, "°")

.replace(/\^\{([^}]+)\}/g, "^$1")

.replace(/\\angle/g, "∠")

.replace(/\\rightarrow/g, "→")

.replace(/\\to/g, "→")

.replace(/\\left/g, "")

.replace(/\\right/g, "")

.replace(/\\pm/g, "±")

.replace(/\\leq/g, "≤")

.replace(/\\le/g, "≤")

.replace(/\\geq/g, "≥")

.replace(/\\ge/g, "≥")

.replace(/\\neq/g, "≠")

.replace(/\\text\{([^{}]+)\}/g, "$1")

.replace(/\\mathrm\{([^{}]+)\}/g, "$1")

.replace(/\\mathbf\{([^{}]+)\}/g, "$1")

.replace(/\\_/g, "_")

.replace(/\\,/g, " ")

.replace(/\\ /g, " ")

.replace(/\s*---\s*/g, "")

.replace(/\s+/g, " ")

.trim();

}


function normalizeHindiLine(text = ""){

return cleanText(

String(text || "")

.replace(/\u200B/g, "")

.replace(/\uFEFF/g, "")

.replace(/\u00A0/g, " ")

.replace(/[ \t]+/g, " ")

.trim()

);

}


function isAnswerKeyLine(text = ""){

return /^(?:#{1,6}\s*)?(?:उत्तर कुंजी|answer key)\b/i.test(

String(text || "").trim()

);

}


function isSectionLine(text = ""){

return /^(?:#{1,6}\s*)?खंड\s*['"“”]?[कखगघa-d]['"“”]?\s*[:：]/iu.test(

String(text || "").trim()

)

||

/^(?:#{1,6}\s*)?section\s+[a-d]\b/i.test(

String(text || "").trim()

);

}


function getSectionTitle(text = ""){

return cleanText(

String(text || "")

.replace(/^#{1,6}\s*/, "")

);

}


function isInstructionLine(text = ""){

return /^(?:#{1,6}\s*)?(?:सामान्य निर्देश|निर्देश|instructions)\s*[:：]?/iu.test(

String(text || "").trim()

);

}


function isQuestionStart(text = ""){

return /^(?:प्र(?:श्न)?\s*\d+\s*[.)]|Q\s*\d+\s*[.)]|\d+\s*[.)])/iu.test(

String(text || "").trim()

);

}


function removeQuestionNumber(text = ""){

return cleanText(

String(text || "")

.replace(/^(?:प्र(?:श्न)?\s*\d+\s*[.)]|Q\s*\d+\s*[.)]|\d+\s*[.)])\s*/iu, "")

);

}


function parseInlineHindiOptions(text = ""){

const value = cleanText(text);

const marker = /(?:^|\s)\(([कखगघ])\)\s*/gu;

const matches = [];

let match;


while((match = marker.exec(value)) !== null){

matches.push({

index:match.index + (match[0].startsWith(" ") ? 1 : 0),

letter:match[1],

end:marker.lastIndex

});

}


if(matches.length < 2){

return {

question:value,

options:[]

};

}


const question = value

.slice(0, matches[0].index)

.trim();


const options = [];


matches.forEach((item,index)=>{

const start = item.end;

const end = index + 1 < matches.length

? matches[index + 1].index

: value.length;


const optionText = value

.slice(start,end)

.trim();


if(optionText){

options.push({

letter:item.letter,

text:optionText

});

}

});


return {

question,

options

};

}


function parseHindiQuestionTest(content = ""){

const rawLines = String(content || "")

.replace(/\r/g, "")

.split("\n")

.map(line=>String(line || "").trim());


const sections = [];

let currentSection = null;

let currentQuestion = null;

let readingAnswerKey = false;

let answerKeyQuestions = [];

let instructions = [];


const pushCurrentQuestion = () => {

if(!currentSection || !currentQuestion){

return;

}


if(

currentQuestion.text ||

currentQuestion.options.length

){

currentSection.questions.push(

currentQuestion

);

}


currentQuestion = null;

};


const createQuestion = (line) => {

const value = normalizeHindiLine(line);


const numberMatch = value.match(

/^(?:प्र(?:श्न)?\s*|Q\s*|Question\s*)(\d+)\s*[.)]/iu

);


const number = numberMatch

? Number(numberMatch[1])

: currentSection

? currentSection.questions.length + 1

: 1;


const body = removeQuestionNumber(value);


const parsed =

parseInlineHindiOptions(

body

);


return {

number,

text:

parsed.question ||

body,

options:

parsed.options || [],

isMCQ:

parsed.options.length >= 2

};

};


const createSection = (title) => {

return {

title:

getSectionTitle(title),

questions:[],

instructions:[]

};

};


rawLines.forEach(rawLine=>{

const raw = String(rawLine || "").trim();


if(!raw){

return;

}


const normalized =

normalizeHindiLine(raw);


/*
 * ANSWER KEY
 */

if(

isAnswerKeyLine(normalized)

){

pushCurrentQuestion();

readingAnswerKey = true;

currentSection = null;

return;

}


if(readingAnswerKey){

if(

isSectionLine(normalized)

){

return;

}


if(

isQuestionStart(normalized)

){

const answerQuestion =

createQuestion(

normalized

);


answerKeyQuestions.push(

answerQuestion

);

return;

}


const inlineAnswer =

parseInlineHindiOptions(

normalized

);


if(

inlineAnswer.options.length >= 2

&&

answerKeyQuestions.length

){

const last =

answerKeyQuestions[

answerKeyQuestions.length - 1

];


last.options.push(

...inlineAnswer.options

);

if(inlineAnswer.question){

last.text = cleanText(

(

last.text

? last.text + " "

: ""

) +

inlineAnswer.question

);

}


return;

}


const answerOption =

normalized.match(

/^\(([कखगघ])\)\s*(.*)$/u

);


if(

answerOption

&&

answerKeyQuestions.length

){

const last =

answerKeyQuestions[

answerKeyQuestions.length - 1

];


last.options.push({

letter:

answerOption[1],

text:

cleanText(

answerOption[2]

)

});


return;

}


if(

answerKeyQuestions.length

){

const last =

answerKeyQuestions[

answerKeyQuestions.length - 1

];


last.text =

cleanText(

(

last.text

? last.text + " "

: ""

) +

normalized

);

}


return;

}


/*
 * SECTION HEADING
 */

if(

isSectionLine(normalized)

){

pushCurrentQuestion();


currentSection =

createSection(

normalized

);


sections.push(

currentSection

);


return;

}


/*
 * INSTRUCTIONS
 *
 * Instruction text is collected only here.
 * It cannot become a question.
 */

if(

isInstructionLine(normalized)

){

pushCurrentQuestion();


currentSection = {

title:"सामान्य निर्देश",

questions:[],

instructions:[]

};


sections.push(

currentSection

);


return;

}


/*
 * INSTRUCTION NUMBER
 */

if(

currentSection

&&

currentSection.title ===

"सामान्य निर्देश"

){

const instructionText =

cleanText(

normalized.replace(

/^(?:[-•*]\s*)?\d+\s*[.)]\s*/u,

""

)

);


if(instructionText){

currentSection.instructions.push(

instructionText

);

}


return;

}


/*
 * QUESTION
 *
 * IMPORTANT:
 * Questions are only recognized after a
 * real section heading has been found.
 *
 * Therefore instruction lines such as:
 * 1. सभी प्रश्न अनिवार्य हैं।
 *
 * can never become questions.
 */

if(

currentSection

&&

isQuestionStart(normalized)

){

pushCurrentQuestion();


currentQuestion =

createQuestion(

normalized

);


return;

}


/*
 * MCQ OPTION ON ITS OWN LINE
 */

if(

currentQuestion

){

const optionMatch =

normalized.match(

/^\(([कखगघ])\)\s*(.*)$/u

);


if(optionMatch){

currentQuestion.options.push({

letter:

optionMatch[1],

text:

cleanText(

optionMatch[2]

)

});


currentQuestion.isMCQ =

currentQuestion.options.length >= 2;


return;

}


/*
 * Continuation of the current question.
 */

const extra =

cleanText(

normalized

);


if(extra){

currentQuestion.text =

currentQuestion.text

? currentQuestion.text +

" " +

extra

: extra;

}


return;

}


/*
 * Ignore material before the first
 * actual section/question heading.
 */

return;

});


pushCurrentQuestion();


return {

sections,

answerKeyQuestions

};

}

function GlassBadge({children,small=false}){

return(

<View

wrap={false}

style={{

backgroundColor:"#F5F1FF",

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:small?10:13,

paddingHorizontal:small?10:13,

paddingVertical:small?5:7,

marginBottom:8,

width:"100%"

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:small?9.5:11,

fontWeight:"bold",

color:"#4F46E5",

lineHeight:1.3

}}

>

{children}

</Text>

</View>

);

}


function QuestionNumberCircle({number}){

return(

<View

style={{

width:19,

height:19,

borderRadius:9.5,

backgroundColor:"#6D5DFB",

justifyContent:"center",

alignItems:"center",

marginRight:7,

marginTop:1,

flexShrink:0

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:8,

fontWeight:"bold",

color:"#FFFFFF"

}}

>

{number}

</Text>

</View>

);

}


function OptionCircle({letter}){

return(

<View

style={{

width:19,

height:19,

borderRadius:9.5,

backgroundColor:"#6D5DFB",

justifyContent:"center",

alignItems:"center",

marginRight:7,

flexShrink:0

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:8,

fontWeight:"bold",

color:"#FFFFFF"

}}

>

{letter}

</Text>

</View>

);

}


function HindiOption({option}){

return(

<View

wrap={false}

style={{

flexDirection:"row",

alignItems:"flex-start",

marginBottom:5,

marginLeft:26,

paddingHorizontal:8,

paddingVertical:6,

backgroundColor:"#F7F5FF",

borderWidth:1,

borderColor:"#E2D9FF",

borderRadius:10,

width:"100%"

}}

>

<OptionCircle

letter={option.letter}

/>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

lineHeight:1.3,

color:"#161C48",

flex:1

}}

>

{option.text}

</Text>

</View>

);

}


function HindiMCQ({question}){

return(

<View

style={{

marginBottom:12,

width:"100%"

}}

>

<View

wrap={false}

style={{

flexDirection:"row",

alignItems:"flex-start",

backgroundColor:"#F5F1FF",

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:12,

paddingHorizontal:9,

paddingVertical:7,

marginBottom:5,

width:"100%"

}}

>

<QuestionNumberCircle

number={question.number}

/>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10.5,

lineHeight:1.35,

color:"#161C48",

flex:1

}}

>

{question.text}

</Text>

</View>


{

question.options.map((option,index)=>(

<HindiOption

key={"option-" + question.number + "-" + index}

option={option || {letter:"",text:""}}

/>

))

}

</View>

);

}


function NormalHindiQuestion({question}){

return(

<View

style={{

marginBottom:11,

width:"100%"

}}

wrap={false}

>

<View

style={{

flexDirection:"row",

alignItems:"flex-start",

width:"100%"

}}

>

<QuestionNumberCircle

number={question.number}

/>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10.5,

lineHeight:1.35,

color:"#161C48",

flex:1

}}

>

{question.text}

</Text>

</View>


{

question.options.length > 0 &&

<View

style={{

marginTop:4

}}

>

{

question.options.map((option,index)=>(

<HindiOption

key={"normal-option-" + question.number + "-" + index}

option={option || {letter:"",text:""}}

/>

))

}

</View>

}

</View>

);

}


function HindiSection({section}){

return(

<View

style={{

marginBottom:16,

width:"100%"

}}

>

<GlassBadge>

{section.title}

</GlassBadge>


{

section.instructions && section.instructions.length > 0 &&

<View

style={{

marginBottom:6

}}

>

{

section.instructions.map((instruction,index)=>(

<View

key={"instruction-" + index}

style={{

flexDirection:"row",

alignItems:"flex-start",

marginBottom:5

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10.5,

color:"#6D5DFB",

width:13

}}

>

{"•"}

</Text>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

lineHeight:1.35,

color:"#161C48",

flex:1

}}

>

{instruction}

</Text>

</View>

))

}

</View>

}


{

section.questions.map((question,index)=>

question.isMCQ && question.options.length >= 2

?

<HindiMCQ

key={"mcq-" + index}

question={question}

/>

:

<NormalHindiQuestion

key={"question-" + index}

question={question}

/>

)

}

</View>

);

}


function AnswerKey({questions=[]}){

return(

<View

style={{

marginTop:14,

width:"100%"

}}

>

<GlassBadge>

उत्तर कुंजी

</GlassBadge>


{

questions.map((question,index)=>(

<View

key={"answer-" + index}

style={{

marginBottom:8,

width:"100%"

}}

wrap={false}

>

<View

style={{

flexDirection:"row",

alignItems:"flex-start"

}}

>

<QuestionNumberCircle

number={question.number || index + 1}

/>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

lineHeight:1.35,

color:"#161C48",

flex:1

}}

>

{question.text}

</Text>

</View>


{

question.options.map((option,optionIndex)=>(

<HindiOption

key={"answer-option-" + index + "-" + optionIndex}

option={option || {letter:"",text:""}}

/>

))

}

</View>

))

}

</View>

);

}


export default function HindiQuestionTestPDF({

data = {}

}){

const parsed = parseHindiQuestionTest(

data.content || ""

);

const hasWrittenAnswerKey =
String(data.content || "")
.split(/\r?\n/)
.some(line => {

const normalized = String(line || "")
.trim()
.replace(/^[-*#>\s]+/, "")
.replace(/[*_`]/g, "")
.trim();

return /^(?:उत्तर\s*कुंजी|answer\s*key)(?:\s*[:：-]|\s*)$/iu.test(
normalized
);

});


const instructionSections =

parsed.sections.filter(

section =>

section &&

section.title === "सामान्य निर्देश"

);


const questionSections =

parsed.sections.filter(

section =>

section &&

section.title !== "सामान्य निर्देश"

);


const renderOption = (

option,

index,

prefix = ""

) => {

const safeOption = option || {

letter:

String.fromCharCode(

0x0915 + index

),

text:""

};


return(

<View

key={

prefix +

"-option-" +

index

}

wrap={false}

style={{

flexDirection:"row",

alignItems:"flex-start",

marginTop:6,

marginLeft:26,

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

fontWeight:"bold"

}}

>

{

safeOption.letter ||

String.fromCharCode(

65 + index

)

}

</Text>

</View>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

lineHeight:1.3,

color:"#161C48",

flex:1

}}

>

{safeOption.text || ""}

</Text>

</View>

);

};


const renderQuestion = (

question,

index,

prefix = ""

) => {

const safeQuestion = question || {

number:index + 1,

text:"",

options:[],

isMCQ:false

};


const options =

Array.isArray(

safeQuestion.options

)

? safeQuestion.options

: [];


return(

<View

key={

prefix +

"-question-" +

index

}

style={{

marginBottom:12,

width:"100%"

}}

wrap={false}

>

<View

wrap={false}

style={{

flexDirection:"row",

alignItems:"flex-start",

backgroundColor:

safeQuestion.isMCQ &&

options.length >= 2

? "#F5F1FF"

: "#FFFFFF",

borderWidth:

safeQuestion.isMCQ &&

options.length >= 2

? 1

: 0,

borderColor:"#D8CCFF",

borderRadius:12,

padding:

safeQuestion.isMCQ &&

options.length >= 2

? 8

: 0,

marginBottom:

safeQuestion.isMCQ &&

options.length >= 2

? 5

: 0

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

marginRight:8,

marginTop:1

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

color:"#FFFFFF",

fontSize:9,

fontWeight:"bold"

}}

>

{

safeQuestion.number ||

index + 1

}

</Text>

</View>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10.5,

lineHeight:1.35,

color:"#161C48",

flex:1

}}

>

{safeQuestion.text || ""}

</Text>

</View>


{

options.map(

(option,optionIndex)=>

renderOption(

option,

optionIndex,

prefix +

"-" +

index

)

)

}

</View>

);

};


const renderSection = (

section,

index,

prefix = ""

) => {

const safeSection = section || {

title:"",

questions:[],

instructions:[]

};


const questions =

Array.isArray(

safeSection.questions

)

? safeSection.questions

: [];


const sectionInstructions =

Array.isArray(

safeSection.instructions

)

? safeSection.instructions

: [];


return(

<View

key={

prefix +

"-section-" +

index

}

style={{

marginBottom:18,

width:"100%"

}}

wrap={true}

>

<View

wrap={false}

style={{

backgroundColor:"#F5F3FF",

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:14,

paddingHorizontal:14,

paddingVertical:8,

marginBottom:12,

width:"100%"

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

color:"#4F46E5",

fontSize:14,

fontWeight:"bold"

}}

>

{safeSection.title || ""}

</Text>

</View>


{

sectionInstructions.map(

(instruction,instructionIndex)=>(

<View

key={

prefix +

"-instruction-" +

instructionIndex

}

wrap={false}

style={{

flexDirection:"row",

marginBottom:6

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:13,

color:"#6D5DFB",

marginRight:7

}}

>

{"•"}

</Text>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

lineHeight:1.35,

color:"#161C48",

flex:1

}}

>

{instruction}

</Text>

</View>

)

)

}


{

questions.map(

(question,questionIndex)=>

renderQuestion(

question,

questionIndex,

prefix +

"-" +

index

)

)

}

</View>

);

};


return(

<Document>

<Page

size="A4"

wrap={true}

style={{

paddingTop:40,

paddingBottom:40,

paddingLeft:40,

paddingRight:40,

backgroundColor:"#FFFFFF"

}}

>

<View

wrap={false}

style={{

width:"100%",

alignItems:"center",

marginBottom:8

}}

>

<Image

src="/nyxora-logo.svg"

style={{

width:72,

height:46,

objectFit:"contain"

}}

/>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:11,

fontWeight:"bold",

color:"#6D5DFB",

marginTop:2

}}

>

Nyxora AI

</Text>

<RestoredGradientLine />

</View>


<View

wrap={false}

style={{

marginBottom:14,

paddingBottom:10,

borderBottomWidth:1,

borderBottomColor:"#E2D9FF"

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:20,

fontWeight:"bold",

color:"#4F46E5",

textAlign:"center"

}}

>

{data.title || "Nyxora Document"}

</Text>

</View>


<View

wrap={false}

style={{

marginBottom:16,

padding:12,

backgroundColor:"#FFFFFF",

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:14

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:8,

fontWeight:"bold",

color:"#6D5DFB",

marginBottom:10,

letterSpacing:0.4

}}

>

DOCUMENT DETAILS

</Text>


<View

style={{

flexDirection:"row",

flexWrap:"wrap",

width:"100%"

}}

>

{

[

["SUBJECT", data.subject || data.subjectName || "Not Provided"],

["CLASS", data.className || data.class || data.grade || "Not Provided"],

["CHAPTER", data.chapter || data.chapterName || data.topic || "Not Provided"],

["TYPE", data.type || data.documentType || "Document"]

]

.map(

(item,index)=>(

<View

key={"document-detail-" + index}

style={{

width:"50%",

padding:4

}}

>

<View

style={{

backgroundColor:"#F5F3FF",

borderWidth:1,

borderColor:"#E2D9FF",

borderRadius:10,

padding:9,

minHeight:38

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:6.5,

color:"#64748B",

marginBottom:2

}}

>

{item[0]}

</Text>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:9,

color:"#161C48",

fontWeight:"bold"

}}

>

{String(item[1] || "Not Provided")}

</Text>

</View>

</View>

)

)

}

</View>

</View>


{

instructionSections.map(

(section,index)=>

renderSection(

section,

index,

"instructions"

)

)

}

</Page>


<Page

size="A4"

wrap={true}

style={{

paddingTop:40,

paddingBottom:40,

paddingLeft:40,

paddingRight:40,

backgroundColor:"#FFFFFF"

}}

>

{

questionSections.map(

(section,index)=>

renderSection(

section,

index,

"questions"

)

)

}


{

hasWrittenAnswerKey &&

parsed.answerKeyQuestions.length > 0 &&

<View

style={{

marginTop:18,

width:"100%"

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:14,

fontWeight:"bold",

color:"#4F46E5",

marginBottom:10

}}

>

उत्तर कुंजी

</Text>


{

parsed.answerKeyQuestions.map(

(question,index)=>

renderQuestion(

question,

index,

"answer"

)

)

}

</View>

}


{

!hasWrittenAnswerKey &&

<View

wrap={false}

style={{

marginTop:18,

width:"100%"

}}

>

<GlassBadge>

उत्तर कुंजी

</GlassBadge>

</View>

}



</Page>

</Document>

);

}