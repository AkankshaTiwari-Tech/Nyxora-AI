import {

Document,

Page,

View,

Text

}

from "@react-pdf/renderer";


import "../styles/pdfFonts";


import PDFHeader

from "./PDFHeader";


import PDFMetadata

from "./PDFMetadata";


import PDFSection

from "./PDFSection";

import PDFQuestion

from "./PDFQuestion";



function cleanText(text = ""){



return text

.replace(/\*\*/g,"")

.replace(/###/g,"")

.replace(/##/g,"")

.replace(/#/g,"")

.replace(/\\\(/g,"")

.replace(/\\\)/g,"")

.replace(/\$/g,"")

.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,"$1/$2")

.replace(/\\times/g,"×")

.replace(/\\div/g,"÷")

.replace(/\\cdot/g,"·")

.replace(/\\circ/g,"°")

.replace(/\^\{([^}]+)\}/g,"^$1")

.replace(/\\angle/g,"∠")

.replace(/\\rightarrow/g,"→")

.replace(/\\to/g,"→")

.replace(/\\left/g,"")

.replace(/\\right/g,"")

.replace(/\\pm/g,"±")

.replace(/\\leq/g,"≤")

.replace(/\\le/g,"≤")

.replace(/\\geq/g,"≥")

.replace(/\\ge/g,"≥")

.replace(/\\neq/g,"≠")

.replace(/\\text\{([^{}]+)\}/g,"$1")

.replace(/\\mathrm\{([^{}]+)\}/g,"$1")

.replace(/\\mathbf\{([^{}]+)\}/g,"$1")

.replace(/\\_/g,"_")

.replace(/\\,/g," ")

.replace(/\$/g,"")

.replace(/\s*---\s*/g,"")

.replace(/\\ /g," ")

.trim();



}





function detectAnswerKey(text=""){



return text.match(

/^(Answer Key|उत्तर कुंजी)/i

);



}





function AnswerKeyBadge({title}){



return(



<View

style={{



marginTop:25,



marginBottom:15,



paddingVertical:8,



paddingHorizontal:14,



borderRadius:12,



backgroundColor:"#F5F1FF",



border:"1 solid #D8CCFF"



}}

>



<Text

style={{



fontSize:11,



fontWeight:"bold",



color:"#6D5DFB"



}}

>



{title}



</Text>



</View>



);



}

function cleanNoteText(text = ""){

return text

.replace(/\*\*/g,"")

.replace(/`/g,"")

.replace(/\\text\{([^{}]+)\}/g,"$1")

.replace(/\\mathrm\{([^{}]+)\}/g,"$1")

.replace(/\\mathbf\{([^{}]+)\}/g,"$1")

.replace(/\\textbf\{([^{}]+)\}/g,"$1")

.replace(/\\textit\{([^{}]+)\}/g,"$1")

.replace(/\*\/?text\{([^{}]+)\}/g,"$1")

.replace(/\\left/g,"")

.replace(/\\right/g,"")

.replace(/\\,/g," ")

.replace(/\\_/g,"_")

.replace(/\\times/g,"×")

.replace(/\\div/g,"÷")

.replace(/\\cdot/g,"·")

.replace(/\\circ/g,"°")

.replace(/\\angle/g,"∠")

.replace(/\\rightarrow/g,"→")

.replace(/\\to/g,"→")

.replace(/\\left/g,"")

.replace(/\\right/g,"")

.replace(/\\pm/g,"±")

.replace(/\\leq/g,"≤")

.replace(/\\le/g,"≤")

.replace(/\\geq/g,"≥")

.replace(/\\ge/g,"≥")

.replace(/\\neq/g,"≠")

.replace(/\\text\{([^{}]+)\}/g,"$1")

.replace(/\\mathrm\{([^{}]+)\}/g,"$1")

.replace(/\\mathbf\{([^{}]+)\}/g,"$1")

.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,"$1/$2")

.replace(/\$\$/g,"")

.replace(/\$/g,"")

.replace(/\s*---\s*/g,"")

.replace(/\*/g,"")

.replace(/[\t\r\n]+/g," ")

.replace(/\s{2,}/g," ")

.replace(/^\s*[-–—]\s*$/g,"")

.trim();

}



function isNoteHeading(line=""){

return /^\s*(?:[-*•]\s*)?#{1,6}\s+/.test(line);

}



function getNoteHeading(line=""){

return cleanNoteText(

line.replace(/^\s*(?:[-*•]\s*)?#{1,6}\s+/,"")

);

}



function isNoteSubheading(line=""){

const cleaned = cleanNoteText(

line

.replace(/^\s*(?:[-*•]\s*)?/,"")

);

return (

/^\*{1,2}[^*]+\*{1,2}\s*:?\s*$/.test(cleaned)

||

/^[A-Za-z][A-Za-z0-9 &()\/-]{1,60}:\s*$/.test(cleaned)

);

}



function getNoteSubheading(line=""){

return cleanNoteText(

line

.replace(/^\s*(?:[-*•]\s*)?/,"")

.replace(/^\*{1,2}/,"")

.replace(/\*{1,2}\s*:?\s*$/,"")

.trim()

);

}



function parseNotes(content=""){

const lines = content

.split("\n")

.map(line=>line.trim())

.filter(Boolean);



const blocks = [];

let currentBullets = [];



const flushBullets = () => {

if(currentBullets.length){

const safeItems = currentBullets

.map(item=>String(item || "").trim())

.filter(item=>item && !/^[*•._-]+$/.test(item));



if(safeItems.length){

blocks.push({

type:"bullets",

items:safeItems

});

}



currentBullets=[];

}

};



lines.forEach(rawLine=>{

let line = rawLine.trim();



if(!line){

return;

}



if(

/^\s*(?:[-–—]|[*•])\s*$/.test(line)

){

return;

}



if(isNoteHeading(line)){

flushBullets();

blocks.push({

type:"heading",

text:getNoteHeading(line)

});

return;

}



if(isNoteSubheading(line)){

flushBullets();

blocks.push({

type:"subheading",

text:getNoteSubheading(line)

});

return;

}



const inlineSubheading = line.match(

/^\s*(?:[-*•]\s+)?\*{1,2}([^*]+)\*{1,2}\s*:\s*(.+)$/i

);



if(inlineSubheading){

flushBullets();

blocks.push({

type:"subheading",

text:cleanNoteText(

inlineSubheading[1].trim() + ":"

)

});



const inlineText = cleanNoteText(

inlineSubheading[2].trim()

);



if(inlineText){

blocks.push({

type:"bullets",

items:[inlineText]

});

}



return;

}



const hasBullet = /^\s*(?:[-*•]|\d+[.)])\s+/.test(line);



line = cleanNoteText(line);



if(!line){

return;

}



if(hasBullet){

line = line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/g,"").trim();

if(line){

currentBullets.push(line);

}

return;

}



if(currentBullets.length){

currentBullets[currentBullets.length - 1] += " " + line;

}else{

currentBullets.push(line);

}

});



flushBullets();



return blocks;

}



function NotesContent({blocks=[]}){

return(

<View>

{

blocks.map((block,index)=>{

if(block.type==="subheading"){

return(

<View

key={"note-subheading-"+index}

style={{

alignSelf:"flex-start",

backgroundColor:"#F5F1FF",

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:10,

paddingHorizontal:10,

paddingVertical:5,

marginTop:6,

marginBottom:6,

maxWidth:"100%"

}}

wrap={false}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

color:"#4F46E5",

fontSize:10,

fontWeight:"bold"

}}

>

{block.text}

</Text>

</View>

);

}



if(block.type==="heading"){

return(

<View

key={"note-heading-"+index}

style={{

backgroundColor:"#F5F1FF",

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:14,

paddingHorizontal:14,

paddingVertical:8,

marginTop:index===0?0:14,

marginBottom:8,

width:"100%"

}}

wrap={false}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

color:"#4F46E5",

fontSize:12,

fontWeight:"bold"

}}

>

{block.text}

</Text>

</View>

);

}



return(

<View

key={"note-bullets-"+index}

style={{

marginBottom:4

}}

>

{

block.items.map((item,itemIndex)=>(

<View

key={"note-item-"+index+"-"+itemIndex}

style={{

flexDirection:"row",

alignItems:"flex-start",

marginBottom:5,

paddingLeft:2

}}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:18,

lineHeight:1.35,

color:"#6D5DFB",

width:18,

marginTop:1

}}

>

{"•"}

</Text>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

lineHeight:1.35,

color:"#111827",

flex:1

}}

>

{item}

</Text>

</View>

))

}

</View>

);

})

}

</View>

);

}



function isMultipleChoiceSectionTitle(title=""){

return (

/बहुविकल्पीय/.test(title)

||

/multiple\s*choice/i.test(title)

||

/multiple-choice/i.test(title)

);

}



function parseMultipleChoiceLine(line=""){

const normalized = cleanText(line)

.replace(/\s+/g," ")

.trim();



const questionPattern =

/(?:^|\s)((?:Q\s*)\d+\s*[.)]|(?:प्र|प्रश्न)\s*\d+\s*[.)]|\d+\s*\.\s*(?=[A-Za-zअ-ह]))/giu;



const matches = [];

let match;



while((match = questionPattern.exec(normalized)) !== null){

const marker = match[0].trim();



matches.push({

index:match.index + match[0].indexOf(marker),

marker,

length:marker.length,

number:(marker.match(/\d+/)||[""])[0]

});

}



if(!matches.length){

return [];

}



const questions = [];



matches.forEach((entry,index)=>{

const start = entry.index + entry.length;

const end = index + 1 < matches.length

? matches[index + 1].index

: normalized.length;



const body = normalized.slice(start,end).trim();



if(!body){

return;

}



const optionPattern =

/(?:^|\s)(?:\(([a-dA-Dकखगघ])\)|([a-dA-Dकखगघ])\s*[.)])\s*/gu;



const optionMatches = [];

let optionMatch;



while((optionMatch = optionPattern.exec(body)) !== null){

const markerIndex = optionMatch[0].indexOf(optionMatch[1] || optionMatch[2]);



optionMatches.push({

index:optionMatch.index + markerIndex,

length:optionMatch[0].length - markerIndex

});

}



let questionText = body;

const options = [];



if(optionMatches.length){

questionText = body.slice(0,optionMatches[0].index).trim();



optionMatches.forEach((option,index2)=>{

const optionStart = option.index + option.length;

const optionEnd = index2 + 1 < optionMatches.length

? optionMatches[index2 + 1].index

: body.length;



const optionText = body

.slice(optionStart,optionEnd)

.replace(/^\s*[-:]+\s*/g,"")

.trim();



if(optionText){

options.push(optionText);

}

});

}



if(questionText && options.length >= 2){

questions.push({

text:questionText,

options,

number:Number(entry.number) || questions.length + 1

});

}

});



return questions;

}



function isHindiMCQSection(section={}, isHindi=false){

const title = String(section.title || "");

const questions =

Array.isArray(section.questions)

? section.questions

: [];



const hasHindiOptions = questions.some(question=>{

if(question?.isHindiMCQ === true){

return true;

}



const questionText = String(question?.text || "");

const optionText = Array.isArray(question?.options)

? question.options.join(" ")

: "";



return (

(

Array.isArray(question?.options)

&&

question.options.length >= 2

&&

/[कखगघ]/u.test(

questionText +

" " +

optionText

)

)

||

/(?:\([कखगघ]\)|[कखगघ]\s*[.)])/.test(

questionText

)

);

});



return (

Boolean(isHindi)

&&

(

/बहुविकल्पीय/.test(title)

||

/MCQ|multiple\s*choice|multiple-choice/i.test(title)

||

hasHindiOptions

)

);

}



function HindiQuestionCircle({number}){

return(

<View

style={{

width:16,

height:16,

borderRadius:8,

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

color:"#FFFFFF",

lineHeight:10

}}

>

{String(number)}

</Text>

</View>

);

}



function HindiOptionBubble({letter,text}){

return(

<View

style={{

flexDirection:"row",

alignItems:"flex-start",

width:"100%",

marginTop:5,

paddingVertical:6,

paddingHorizontal:8,

borderRadius:9,

backgroundColor:"#F8F5FF",

borderWidth:1,

borderColor:"#E0D7FF"

}}

wrap={false}

>

<View

style={{

width:15,

height:15,

borderRadius:7.5,

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

fontSize:7.5,

fontWeight:"bold",

color:"#FFFFFF",

lineHeight:9

}}

>

{letter}

</Text>

</View>



<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:9.5,

lineHeight:1.35,

color:"#111827",

flex:1

}}

>

{text}

</Text>

</View>

);

}



function HindiMCQQuestion({question,index}){

const number =

question?.number ||

index + 1;



const options = Array.isArray(question?.options)

? question.options.filter(Boolean)

: [];



const letters = ["क","ख","ग","घ"];



return(

<View

style={{

width:"100%",

marginBottom:10

}}

wrap={false}

>

<View

style={{

flexDirection:"row",

alignItems:"flex-start",

width:"100%",

paddingVertical:7,

paddingHorizontal:9,

borderRadius:10,

backgroundColor:"#F3EEFF",

borderWidth:1,

borderColor:"#D8CCFF"

}}

>

<HindiQuestionCircle

number={number}

/>



<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10,

lineHeight:1.4,

color:"#111827",

fontWeight:"500",

flex:1

}}

>

{String(question?.text || "")}

</Text>

</View>



<View

style={{

width:"100%",

paddingLeft:10,

paddingRight:1,

paddingTop:1

}}

>

{

options.map((option,optionIndex)=>(

<HindiOptionBubble

key={"hindi-option-"+number+"-"+optionIndex}

letter={letters[optionIndex] || String.fromCharCode(97 + optionIndex)}

text={String(option)}

/>

))

}

</View>

</View>

);

}



function expandHindiMCQQuestions(questions=[]){

const expanded = [];



questions.forEach((question,index)=>{

if(

!question ||

typeof question !== "object"

){

return;

}



const rawText = String(question.text || "").trim();



const rawOptions = Array.isArray(question.options)

? question.options

.filter(Boolean)

.map(option=>

typeof option === "object"

? String(option.text || "").trim()

: String(option).trim()

)

.filter(Boolean)

: [];



const parsed = parseMultipleChoiceLine(rawText);



if(

parsed.length >= 1

){

parsed.forEach(parsedQuestion=>{

if(

parsedQuestion &&

String(parsedQuestion.text || "").trim() &&

Array.isArray(parsedQuestion.options) &&

parsedQuestion.options.length >= 2

){

expanded.push({

text:String(parsedQuestion.text).trim(),

options:parsedQuestion.options,

number:

Number(parsedQuestion.number) ||

expanded.length + 1

});

}

});



if(parsed.some(parsedQuestion=>

parsedQuestion &&

Array.isArray(parsedQuestion.options) &&

parsedQuestion.options.length >= 2

)){

return;

}

}



if(

rawOptions.length >= 2 &&

/[कखगघ]/u.test(

rawText +

" " +

rawOptions.join(" ")

)

){

expanded.push({

text:rawText,

options:rawOptions,

number:

Number(question.number) ||

expanded.length + 1

});



return;

}

});



return expanded;

}



function parseHindiMCQsFromSource(content=""){

const source = String(content || "");



const cleaned = source

.replace(/\r/g,"")

.replace(/\*\*/g,"")

.replace(/###/g,"")

.replace(/##/g,"")

.replace(/#/g,"")

.replace(/\\\(/g,"")

.replace(/\\\)/g,"")

.replace(/\$/g,"")

.replace(/\s+/g," ")

.trim();



const questions = [];



const sectionMatch = cleaned.match(

/खंड\s*['"]?क['"]?\s*:\s*बहुविकल्पीय[\s\S]*?(?=\s*खंड\s*['"]?[खगघ]['"]?\s*:|\s*(?:उत्तर कुंजी|Answer Key))/iu

);



const mcqBlock = sectionMatch

?

sectionMatch[0]

:

cleaned;



const questionRegex =

/प्र(?:श्न)?\s*(\d+)\s*[.)]\s*([\s\S]*?)(?=\s*प्र(?:श्न)?\s*\d+\s*[.)]|\s*खंड\s*['"]?[खगघ]['"]?\s*:|\s*(?:उत्तर कुंजी|Answer Key)|$)/gu;



let questionMatch;



while(

(questionMatch = questionRegex.exec(mcqBlock)) !== null

){



const number =

Number(questionMatch[1]) ||

questions.length + 1;



const body =

String(questionMatch[2] || "")

.replace(/\s+/g," ")

.trim();



const optionRegex =

/(?:^|\s)\(([कखगघ])\)\s*([\s\S]*?)(?=\s*\([कखगघ]\)\s*|$)/gu;



const options = [];

let optionMatch;



while(

(optionMatch = optionRegex.exec(body)) !== null

){

const text =

String(optionMatch[2] || "")

.trim();



if(text){

options.push({

letter:optionMatch[1],

text

});

}

}



if(options.length >= 2){

const firstOptionIndex =

body.search(

/(?:^|\s)\([कखगघ]\)\s*/u

);



const questionText =

firstOptionIndex >= 0

?

body

.slice(0,firstOptionIndex)

.trim()

:

body;



if(questionText){

questions.push({

number,

text:questionText,

options:options.map(

option=>option.text

),

isHindiMCQ:true

});

}

}

}



return questions;

}



function HindiMCQSection({section,sourceContent=""}){

const sourceQuestions =

parseHindiMCQsFromSource(

sourceContent

);



const mcqQuestions =

sourceQuestions.length

?

sourceQuestions

:

expandHindiMCQQuestions(

Array.isArray(section.questions)

? section.questions

: []

);



return(

<View

style={{

width:"100%",

marginBottom:8

}}

>

<View

style={{

backgroundColor:"#F5F1FF",

borderWidth:1,

borderColor:"#D8CCFF",

borderRadius:12,

paddingVertical:7,

paddingHorizontal:11,

marginBottom:8

}}

wrap={false}

>

<Text

style={{

fontFamily:"NotoSansDevanagari",

fontSize:10.5,

fontWeight:"bold",

color:"#4F46E5"

}}

>

{section.title}

</Text>

</View>



{

mcqQuestions.map((question,index)=>(

<HindiMCQQuestion

key={"hindi-question-"+String(question?.number || index + 1)+"-"+index}

question={question}

index={index}

/>

))

}

</View>

);

}



function parseHindiMCQQuestionLine(line=""){

const normalized = cleanText(line)

.replace(/\s+/g," ")

.trim();



const questionMatch = normalized.match(

/^प्र(?:श्न)?\s*(\d+)\s*[.)]\s*/u

);



if(!questionMatch){

return null;

}



const number = Number(questionMatch[1]);



const body = normalized

.slice(questionMatch[0].length)

.trim();



const optionPattern =

/(?:^|\s)\(([कखगघ])\)\s*/gu;



const optionMatches = [];

let optionMatch;



while(

(optionMatch = optionPattern.exec(body)) !== null

){

optionMatches.push({

index:optionMatch.index,

letter:optionMatch[1],

prefixLength:optionMatch[0].length

});

}



if(optionMatches.length < 2){

return null;

}



const questionText =

body

.slice(

0,

optionMatches[0].index

)

.trim();



if(!questionText){

return null;

}



const options = [];



optionMatches.forEach(

(option,index)=>{

const optionEnd =

index + 1 < optionMatches.length

?

optionMatches[index + 1].index

:

body.length;



const optionStart =

option.index +

option.prefixLength;



const optionText =

body

.slice(optionStart,optionEnd)

.trim();



if(optionText){

options.push({

letter:option.letter,

text:optionText

});

}

}

);



if(options.length < 2){

return null;

}



return {

number:number || 1,

text:questionText,

options:options.map(

option=>option.text

)

};

}





function parseContent(content=""){

const lines = content

.split("\n")

.map(line=>line.trim())

.filter(Boolean);



const sections = [];

const answerSections = [];

const isHindi = /उत्तर कुंजी|बहुविकल्पीय|खंड\s*["']?[कखगघ]/u.test(content);



let currentSection = {

title:"",

questions:[]

};



let currentAnswerSection = {

title:"",

questions:[]

};



let currentQuestion = null;

let currentAnswerQuestion = null;

let readingAnswerKey = false;



const pushCurrentSection = () => {

if(

currentSection.title &&

currentSection.questions.length

){

sections.push(currentSection);

}

};



const pushCurrentAnswerSection = () => {

if(

currentAnswerSection.title &&

currentAnswerSection.questions.length

){

answerSections.push(currentAnswerSection);

}

};



lines.forEach(rawLine=>{

const clean = cleanText(rawLine);



if(!clean){

return;

}



if(detectAnswerKey(clean)){

pushCurrentSection();

currentSection = {

title:"",

questions:[]

};



readingAnswerKey = true;

currentQuestion = null;

currentAnswerQuestion = null;



currentAnswerSection = {

title:isHindi

?

"उत्तर कुंजी"

:

"ANSWER KEY",

questions:[]

};



return;

}



if(readingAnswerKey){



const answerQuestionMatch = clean.match(

/^(?:Q\s*)?(\d+)[.)]/i

);



const hindiAnswerQuestionMatch = clean.match(

/^प्र(?:श्न)?\s*(\d+)[.)]/u

);



if(

answerQuestionMatch ||

hindiAnswerQuestionMatch

){

const number = Number(

(answerQuestionMatch ||

hindiAnswerQuestionMatch)[1]

);



currentAnswerQuestion = {

text:clean

.replace(

/^(?:Q\s*)?\d+[.)]\s*/i,

""

)

.replace(

/^प्र(?:श्न)?\s*\d+[.)]\s*/u,

""

)

.trim(),

options:[],

number:

number ||

currentAnswerSection.questions.length + 1

};



currentAnswerSection.questions.push(

currentAnswerQuestion

);

return;

}



if(

/^\s*\(?[a-dA-Dकखगघ]\)?[.)]/u.test(clean)

){

if(currentAnswerQuestion){

currentAnswerQuestion.options.push(

clean

.replace(

/^\s*\(?[a-dA-Dकखगघ]\)?[.)]\s*/u,

""

)

.trim()

);

}



return;

}



if(currentAnswerQuestion){

currentAnswerQuestion.text +=

" " + clean;

}



return;

}



if(

/^(subject|class|student name|time allowed|maximum marks|marks|विषय|कक्षा|विद्यार्थी|समय|पूर्णांक)\s*[:：]/iu.test(clean)

){

return;

}



if(

/^section\s+[a-d]/i.test(clean)

||

/^खंड\s*["']?[कखगघ]/u.test(clean)

){

pushCurrentSection();



currentSection = {

title:clean,

questions:[]

};



currentQuestion = null;

return;

}



if(

/^(सामान्य निर्देश|निर्देश|Instructions)/iu.test(clean)

){

pushCurrentSection();



currentSection = {

title:"Instructions",

questions:[]

};



currentQuestion = null;

return;

}



const hindiMCQQuestion =

parseHindiMCQQuestionLine(

clean.replace(

/^प्र\s+(\d+)/u,

"प्र$1"

)

);



if(hindiMCQQuestion){

currentQuestion = {

text:String(

hindiMCQQuestion.text || ""

).trim(),

options:Array.isArray(

hindiMCQQuestion.options

)

?

hindiMCQQuestion.options

.filter(Boolean)

.map(option=>

typeof option === "object"

?

String(

option.text || ""

).trim()

:

String(option).trim()

)

.filter(Boolean)

:

[],

number:

Number(

hindiMCQQuestion.number

) ||

currentSection.questions.length + 1,

isHindiMCQ:true

};



currentSection.questions.push(

currentQuestion

);

return;

}



const inlineMCQQuestions =

parseMultipleChoiceLine(clean);



if(

inlineMCQQuestions.length &&

(

isMultipleChoiceSectionTitle(

currentSection.title

)

||

/(?:प्र|प्रश्न)\s*\d+\s*[.)].*\([कखगघ]\)/u.test(clean)

)

){

inlineMCQQuestions.forEach(

question=>{

if(

question &&

String(question.text || "").trim() &&

Array.isArray(question.options) &&

question.options.length >= 2

){

currentSection.questions.push({

text:String(

question.text || ""

).trim(),

options:question.options

.filter(Boolean)

.map(option=>

String(option).trim()

)

.filter(Boolean),

number:

Number(question.number) ||

currentSection.questions.length + 1

});

}

}

);



currentQuestion =

currentSection.questions[

currentSection.questions.length - 1

] || null;



return;

}



const hindiQuestionMatch =

clean.match(

/^प्र(?:श्न)?\s*(\d+)[.)]/u

);



const normalQuestionMatch =

clean.match(

/^(?:Q\s*)?(\d+)[.)]/i

);



if(

hindiQuestionMatch ||

normalQuestionMatch

){

const number = Number(

(hindiQuestionMatch ||

normalQuestionMatch)[1]

);



currentQuestion = {

text:clean

.replace(

/^प्र(?:श्न)?\s*\d+[.)]\s*/u,

""

)

.replace(

/^(?:Q\s*)?\d+[.)]\s*/i,

""

)

.trim(),

options:[],

number:

number ||

currentSection.questions.length + 1

};



currentSection.questions.push(

currentQuestion

);

return;

}



if(

/^\s*(?:\([a-dA-Dकखगघ]\)|[a-dA-Dकखगघ][.)])\s*/u.test(clean)

){

if(currentQuestion){

currentQuestion.options.push(

clean

.replace(

/^\s*(?:\([a-dA-Dकखगघ]\)|[a-dA-Dकखगघ][.)])\s*/u,

""

)

.trim()

);



if(

/^\s*\([कखगघ]\)/u.test(clean)

){

currentQuestion.isHindiMCQ = true;

}

}



return;

}



if(

currentSection.title === "Instructions"

){

if(

/^\d+[.)]/.test(clean)

){

currentSection.questions.push({

text:clean.replace(

/^\d+[.)]\s*/,

""

),

options:[],

number:

currentSection.questions.length + 1

});



return;

}

}



if(currentQuestion){

currentQuestion.text +=

" " + clean;

}



});



pushCurrentSection();

pushCurrentAnswerSection();



return {

sections,

answerSections

};

}



export default function NyxoraPDF({



data = {}



}){



const parsed = parseContent(

data.content || ""

);



const sections = parsed.sections;



const answerSections = parsed.answerSections;



const instructionSection = sections.find(

item=>item.title==="Instructions"

);



const questionSections = sections.filter(

item =>

item &&

typeof item === "object" &&

item.title !== "Instructions" &&

Array.isArray(item.questions) &&

item.questions.length > 0

);



const hasAnswer = answerSections.length > 0;



const isHindi =

/उत्तर कुंजी|बहुविकल्पीय|खंड\s*["']?[कखगघ]|प्र(?:श्न)?\s*\d+/iu.test(

data.content || ""

);



const isNotes =

String(data.type || "").toLowerCase() === "notes";



const noteBlocks = isNotes

?

parseNotes(data.content || "")

:

[];



const metadataClass =

data.className ||

data.class ||

data.classLabel ||

"";



const metadataSource =

String(data.content || "");



const contentClassMatch =

metadataSource.match(

/(?:^|\n)\s*(?:#+\s*)?(?:Class\s*|कक्षा\s*)([0-9]+(?:\s*[A-Za-z])?)/iu

);



const metadataFromTitle =

String(data.title || "").match(

/(?:Class\s*|कक्षा\s*)([0-9]+(?:\s*[A-Za-z])?)/i

)

||

contentClassMatch;



const contentTitleMatch =

metadataSource.match(

/(?:^|\n)\s*(?:#+\s*)?(?:Class\s*\d+|कक्षा\s*\d+)\s+([^\n]+)/iu

);



const contentSubjectMatch =

metadataSource.match(

/(?:^|\n)\s*(?:#+\s*)?(?:Subject|विषय)\s*[:：-]\s*([^\n]+)/iu

);



const contentChapterMatch =

metadataSource.match(

/(?:^|\n)\s*(?:#+\s*)?(?:Chapter|अध्याय)\s*[:：-]\s*([^\n]+)/iu

);



const normalizedMetadata = {

...data,

subject:

data.subject ||

data.subjectName ||

(

contentSubjectMatch

?

contentSubjectMatch[1].trim()

:

""

) ||

(

contentTitleMatch

?

contentTitleMatch[1].split(/[—|]/)[0].trim()

:

""

) ||

(

String(data.title || "").match(

/^(?:Class\s*\d+|कक्षा\s*\d+)\s+([^—|]+)/i

)

?

String(data.title || "").match(

/^(?:Class\s*\d+|कक्षा\s*\d+)\s+([^—|]+)/i

)[1].trim()

:

""

),



chapter:

data.chapter ||

data.topic ||

data.chapterName ||

(

contentChapterMatch

?

contentChapterMatch[1].trim()

:

""

) ||

(

contentTitleMatch &&

/(?:अध्याय|Chapter)\s*[:：-]/i.test(

contentTitleMatch[1]

)

?

contentTitleMatch[1]

.split(

/(?:अध्याय|Chapter)\s*[:：-]/i

)[1].trim()

:

""

) ||

(

String(data.title || "").match(

/(?:Chapter\s*[:\/-]?\s*|अध्याय\s*[:\/-]?\s*)([^—|]+)/i

)

?

String(data.title || "").match(

/(?:Chapter\s*[:\/-]?\s*|अध्याय\s*[:\/-]?\s*)([^—|]+)/i

)[1].trim()

:

""

),



type:

data.type ||

data.documentType ||

"",

className:

metadataClass ||

(

metadataFromTitle

?

(

/कक्षा/.test(

String(data.title || "")

)

?

"कक्षा " +

metadataFromTitle[1].trim()

:

"Class " +

metadataFromTitle[1].trim()

)

:

""

)

};



if(isNotes){

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

<PDFHeader

title={

data.title || "Nyxora Document"

}

/>



<PDFMetadata

data={normalizedMetadata}

/>



<NotesContent

blocks={noteBlocks}

/>

</Page>

</Document>

);

}



return(

<Document>

<Page

size="A4"

style={{

paddingTop:40,

paddingBottom:40,

paddingLeft:40,

paddingRight:40,

backgroundColor:"#FFFFFF"

}}

>

<PDFHeader

title={

data.title || "Nyxora Document"

}

/>



<PDFMetadata

data={normalizedMetadata}

/>



{

instructionSection &&

<PDFSection

section={instructionSection}

/>

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

section &&

Array.isArray(section.questions)

?

(

(

/बहुविकल्पीय/.test(

String(section.title || "")

)

||

isHindiMCQSection(

section,

isHindi

)

)

?

(

<HindiMCQSection

key={

"hindi-mcq-section-"+index

}

section={section}

sourceContent={

data.content || ""

}

/>

)

:

(

<PDFSection

key={

"pdf-section-"+index

}

section={section}

/>

)

)

:

null

)

}



{

hasAnswer && (

<>

<AnswerKeyBadge

title={

isHindi

?

"उत्तर कुंजी"

:

"ANSWER KEY"

}

/>



{

answerSections

.filter(

section =>

section &&

Array.isArray(

section.questions

)

)

.flatMap(

section =>

section.questions || []

)

.filter(Boolean)

.map(

(question,index)=>(

<PDFQuestion

key={

"answer-question-"+index

}

number={

index + 1

}

question={question}

isInstruction={false}

/>

)

)

}



</>

)

}



</Page>



</Document>

);

}