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

return /^(?:#{1,6}\s*)?(?:उत्तर कुंजी|answer key)(?:\s*\([^)]*\))?(?:\s+(?:खंड|section)\s*['"“”]?[कखगघa-d]['"“”]?)?\s*(?:[:：-]\s*)?$/iu.test(

String(text || "").trim()

);

}


function isSectionLine(text = ""){

return /^(?:#{1,6}\s*)?खंड\s*['"“”]?[कखगघa-d]['"“”]?\s*(?:[:：-].*)?$/iu.test(

String(text || "").trim()

)

||

/^(?:#{1,6}\s*)?section\s+[a-d]\b.*$/i.test(

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



function extractHindiAnswerKey(text = ""){

const value = normalizeHindiLine(text);

const parsePayload = (payload = "") => {

const cleanedPayload =
cleanText(payload);

const optionPayload =
cleanedPayload.match(
/^\(?([कखगघ])\)?(?:\s*[.:-]\s*(.*))?$/u
);

if(optionPayload){

return {
answer:optionPayload[1],
solution:
cleanText(
optionPayload[2] || ""
)
};

}

return {
answer:cleanedPayload,
solution:""
};

};


const inlineMarker =
value.match(
/^(.*?)(?:उत्तर\s*कुंजी|सही\s*उत्तर|उत्तर|answer\s*key|correct\s*answer)\s*[:：-]\s*(.+)$/iu
);

if(inlineMarker){

const parsedPayload =
parsePayload(
inlineMarker[2]
);

return {
text:cleanText(inlineMarker[1]),
answer:parsedPayload.answer,
solution:parsedPayload.solution
};

}

const answerMatch = value.match(
/^(?:उत्तर\s*कुंजी|सही\s*उत्तर|उत्तर|answer\s*key|correct\s*answer)\s*[:：-]\s*(.+)$/iu
);

if(answerMatch){

const parsedPayload =
parsePayload(
answerMatch[1]
);

return {
text:"",
answer:parsedPayload.answer,
solution:parsedPayload.solution
};

}

const optionOnly = value.match(
/^\(?([कखगघ])\)?\.?$/u
);

if(optionOnly){

return {
text:"",
answer:optionOnly[1],
solution:""
};

}

return {
text:value,
answer:"",
solution:""
};

}


function splitHindiSolutionSteps(text = ""){

const value = String(text || "")
.replace(/\r/g,"")
.split("\n")
.filter(line => !isSectionLine(line))
.join("\n")
.trim();

if(!value){

return [];

}

const lines = value
.split(/\n+/)
.map(line=>cleanText(line))
.filter(Boolean);

if(lines.length > 1){

return lines;

}

const sentenceParts = value
.split(/(?<=[।!?])\s+/u)
.map(line=>cleanText(line))
.filter(Boolean);

return sentenceParts.length > 1
? sentenceParts
: lines;
}


function normalizeHindiAnswerValue(answer = ""){

const value = cleanText(answer);

if(!value){

return "";

}

const optionOnly = value.match(
/^\(?([कखगघ])\)?\.?$/u
);

if(optionOnly){

return "(" + optionOnly[1] + ")";

}

const labelledOption = value.match(
/^(?:सही\s*उत्तर|उत्तर\s*कुंजी|उत्तर|answer\s*key|correct\s*answer)\s*[:：-]?\s*\(?([कखगघ])\)?\.?$/iu
);

if(labelledOption){

return "(" + labelledOption[1] + ")";

}

return value;

}


function normalizeHindiMetadataText(value = "", field = ""){

let result = cleanText(value);

if(!result){

return "";

}

const replacements = [

[/\bclass\s*(\d{1,2})\b/gi,"कक्षा $1"],
[/\bgrade\s*(\d{1,2})\b/gi,"कक्षा $1"],
[/\bmathematics\b/gi,"गणित"],
[/\bmaths?\b/gi,"गणित"],
[/\bhindi\b/gi,"हिंदी"],
[/\benglish\b/gi,"अंग्रेज़ी"],
[/\bscience\b/gi,"विज्ञान"],
[/\bphysics\b/gi,"भौतिक विज्ञान"],
[/\bchemistry\b/gi,"रसायन विज्ञान"],
[/\bbiology\b/gi,"जीव विज्ञान"],
[/\bsocial\s+science\b/gi,"सामाजिक विज्ञान"],
[/\bsocial\s+studies\b/gi,"सामाजिक विज्ञान"],
[/\bsst\b/gi,"सामाजिक विज्ञान"],
[/\bevs\b/gi,"पर्यावरण अध्ययन"],
[/\benvironmental\s+studies\b/gi,"पर्यावरण अध्ययन"],
[/\bcomputer\s+science\b/gi,"कंप्यूटर विज्ञान"],
[/\bcomputer\b/gi,"कंप्यूटर"],
[/\bunit\s+assessment\b/gi,"इकाई मूल्यांकन"],
[/\bunit\s+test\b/gi,"इकाई परीक्षा"],
[/\bunit\s+exam\b/gi,"इकाई परीक्षा"],
[/\bpractice\s+test\b/gi,"अभ्यास परीक्षा"],
[/\bquestion\s+paper\b/gi,"प्रश्न-पत्र"],
[/\bquestion\s+test\b/gi,"प्रश्न-पत्र"],
[/\btest\s+paper\b/gi,"परीक्षा-पत्र"],
[/\btest\b/gi,"परीक्षा"],
[/\bexam\b/gi,"परीक्षा"],
[/\bworksheet\b/gi,"कार्यपत्रक"],
[/\bchapter\b/gi,"अध्याय"],
[/\btopic\b/gi,"विषय"],
[/\bsubject\b/gi,"विषय"],
[/\btitle\b/gi,"शीर्षक"],
[/\bchapter\s+(\d+)\b/gi,"अध्याय $1"],
[/\bclass\b/gi,"कक्षा"],
[/\bgrade\b/gi,"कक्षा"]
];

replacements.forEach(([pattern,replacement])=>{
result=result.replace(pattern,replacement);
});

const commonHindiChapterNames = [

[/\bdo bailon ki katha\b/gi,"दो बैलों की कथा"],
[/\blakh ki churiyan\b/gi,"लाख की चूड़ियाँ"],
[/\bbus ki yatra\b/gi,"बस की यात्रा"],
[/\bdiwanon ki hasti\b/gi,"दीवानों की हस्ती"],
[/\bchitthiyon ki anuthi duniya\b/gi,"चिट्ठियों की अनूठी दुनिया"],
[/\bbhagwan ke dakiye\b/gi,"भगवान के डाकिए"],
[/\bkya nirash hua jaye\b/gi,"क्या निराश हुआ जाए"],
[/\bye sabse kathin samay nahi\b/gi,"यह सबसे कठिन समय नहीं"],
[/\bkabir ki sakhiyan\b/gi,"कबीर की साखियाँ"],
[/\bkamchor\b/gi,"कामचोर"],
[/\bdhwani\b/gi,"ध्वनि"],
[/\bvasant\b/gi,"वसंत"],
[/\bbharat ki khoj\b/gi,"भारत की खोज"]

];

commonHindiChapterNames.forEach(([pattern,replacement])=>{
result=result.replace(pattern,replacement);
});


const commonHinglish = [
[/\bprakash\b/gi,"प्रकाश"],
[/\bparyayvachi\b/gi,"पर्यायवाची"],
[/\bvilom\b/gi,"विलोम"],
[/\bsamas\b/gi,"समास"],
[/\bsandhi\b/gi,"संधि"],
[/\bupasarg\b/gi,"उपसर्ग"],
[/\bpratyay\b/gi,"प्रत्यय"],
[/\bmuhavare?\b/gi,"मुहावरे"],
[/\bpath\b/gi,"पाठ"],
[/\bkavita\b/gi,"कविता"],
[/\bkahani\b/gi,"कहानी"],
[/\blekhan\b/gi,"लेखन"],
[/\bvyakaran\b/gi,"व्याकरण"]
];

commonHinglish.forEach(([pattern,replacement])=>{
result=result.replace(pattern,replacement);
});

if(field === "class"){

const classMatch=result.match(/(?:कक्षा|class)\s*[:\-]?\s*(\d{1,2})/iu);

if(classMatch){

return "कक्षा " + classMatch[1];

}

}

return cleanText(result);
}


function getHindiMetadata(data = "", content = ""){

const source = String(content || "");

const classFromContent =
source.match(
/(?:कक्षा|class|grade)\s*[:\-]?\s*(\d{1,2})/iu
);

const subjectFromContent =
source.match(
/(?:विषय|subject)\s*[:：-]\s*([^\n|]+)/iu
);

const chapterFromContent =
source.match(
/(?:अध्याय|पाठ|chapter|topic)\s*[:：-]\s*([^\n|]+)/iu
);

const titleFromContent =
source
.split(/\r?\n/)
.map(line=>cleanText(line))
.find(line=>{
return Boolean(
line &&
!isAnswerKeyLine(line) &&
!isInstructionLine(line) &&
!isSectionLine(line) &&
!/^(?:प्र(?:श्न)?\s*\d+|Q\s*\d+|\d+)\s*[.)]/iu.test(line)
);
});

const suppliedTitle =
cleanText(
data.title || ""
);

const unusableTitle =
/^(?:hello\s+nyxora|sure(?:!|,)?\s+here|here(?:'|’)s\s+your|nyxora\s+document)$/iu.test(
suppliedTitle
);

const explicitAiTitle =
source.match(
/^(?:शीर्षक|title)\s*[:：-]\s*(.+)$/imu
);

const rawTitle =
cleanText(
explicitAiTitle
? explicitAiTitle[1]
: titleFromContent ||
"न्योरा दस्तावेज़"
);

const rawSubject =
cleanText(
subjectFromContent
? subjectFromContent[1]
: /[\u0900-\u097F]/u.test(source)
? "हिंदी"
: ""
);

const rawClass =
cleanText(
classFromContent ? classFromContent[1] : ""
);

const inferredHindiChapter =
[
"दो बैलों की कथा",
"लाख की चूड़ियाँ",
"बस की यात्रा",
"दीवानों की हस्ती",
"चिट्ठियों की अनूठी दुनिया",
"भगवान के डाकिए",
"क्या निराश हुआ जाए",
"यह सबसे कठिन समय नहीं",
"कबीर की साखियाँ",
"कामचोर",
"ध्वनि",
"वसंत",
"भारत की खोज"
].find(
name => source.toLocaleLowerCase().includes(name.toLocaleLowerCase())
) || "";

const rawChapter =
cleanText(
chapterFromContent
? chapterFromContent[1]
: inferredHindiChapter
);

const rawType =
cleanText(
(source.match(
/(?:प्रकार|type|document\s*type)\s*[:：-]\s*([^\n|]+)/iu
) || [,""])[1] ||
"test"
);

return {
title:normalizeHindiMetadataText(rawTitle,"title") || "न्योरा दस्तावेज़",
subject:normalizeHindiMetadataText(rawSubject,"subject") || "उपलब्ध नहीं",
className:normalizeHindiMetadataText(rawClass,"class") || "उपलब्ध नहीं",
chapter:normalizeHindiMetadataText(rawChapter,"chapter") || "उपलब्ध नहीं",
type:normalizeHindiMetadataText(rawType,"type") || "परीक्षा"
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

let readingInlineAnswerKey = false;

let answerKeyQuestions = [];

let currentAnswerKeySection = "";

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


const extractHindiAnswerSectionTitle = (text = "") => {

const match = String(text || "").match(
/(?:उत्तर कुंजी|answer key)(?:\s*\([^)]*\))?\s+(खंड|section)\s*['"“”]?([कखगघa-d])['"“”]?/iu
);

if(!match){

return "";

}

return match[1].toLowerCase() === "section"
? "Section " + String(match[2]).toUpperCase()
: "खंड '" + match[2] + "'";

};


const stripInlineAnswerKeyHeader = (text = "") => {

return cleanText(

String(text || "")

.replace(

/\s*(?:उत्तर कुंजी|answer key)(?:\s*\([^)]*\))?(?:\s+(?:खंड|section)\s*['"“”]?[कखगघa-d]['"“”]?)?\s*$/iu,
""
)

);

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

const answerExtraction =

extractHindiAnswerKey(
body
);

const questionBody =
stripInlineAnswerKeyHeader(
answerExtraction.text || body
);

const parsed =

parseInlineHindiOptions(

questionBody

);


return {

number,

text:

cleanText(
(
parsed.question ||

questionBody ||

body
)
.replace(
/^\s*(?:खंड\s*['"“”]?[कखगघa-d]['"“”]?\s*[:：].*)$/iu,
""
)
),

options:

parsed.options || [],

answerKey:

answerExtraction.answer || "",

answerSectionTitle:

extractHindiAnswerSectionTitle(body),

solution:

answerExtraction.solution || "",

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
 * A standalone Answer Key header belongs to the Answer Key flow.
 * It must be detected BEFORE inline-answer handling so that the
 * following answer entries are never added back into the normal
 * question section.
 */

if(

isAnswerKeyLine(normalized)

){

pushCurrentQuestion();

readingAnswerKey = true;

readingInlineAnswerKey = false;

currentSection = null;

currentAnswerKeySection =
extractHindiAnswerSectionTitle(
normalized
);

return;

}


if(
currentQuestion &&
readingInlineAnswerKey
){

const inlineAnswer =
extractHindiAnswerKey(
normalized
);

if(inlineAnswer.answer){

currentQuestion.answerKey =
normalizeHindiAnswerValue(
inlineAnswer.answer
);

if(inlineAnswer.solution){

currentQuestion.solution =
cleanText(
(
currentQuestion.solution
? currentQuestion.solution + "\n"
: ""
) +
inlineAnswer.solution
);

}

readingInlineAnswerKey = false;

return;

}

if(normalized){

currentQuestion.answerKey =
normalizeHindiAnswerValue(
normalized
);

readingInlineAnswerKey = false;

return;

}

}


if(
currentQuestion
){

const inlineAnswerLine =
normalized.match(
/^(?:उत्तर\s*कुंजी|सही\s*उत्तर|उत्तर|answer\s*key|correct\s*answer)(?:\s*\([^)]*\))?\s*[:：-]?\s*(.*)$/iu
);

if(inlineAnswerLine){

const inlineValue =
cleanText(
inlineAnswerLine[1] || ""
);

if(
!inlineValue &&
/^(?:उत्तर\s*कुंजी|answer\s*key)/iu.test(normalized)
){

currentQuestion.text =
stripInlineAnswerKeyHeader(
currentQuestion.text
);

readingInlineAnswerKey = true;

return;

}


if(inlineValue){

const inlineAnswer =
extractHindiAnswerKey(
normalized
);

currentQuestion.answerKey =
normalizeHindiAnswerValue(
inlineAnswer.answer ||
inlineValue
);

if(inlineAnswer.solution){

currentQuestion.solution =
cleanText(
(
currentQuestion.solution
? currentQuestion.solution + "\n"
: ""
) +
inlineAnswer.solution
);

}

}else{

readingInlineAnswerKey = true;

}

return;

}

}


/*
 * ANSWER KEY
 */

if(readingAnswerKey){

if(

isSectionLine(normalized)

){

currentAnswerKeySection = getSectionTitle(normalized);

return;

}


if(

isQuestionStart(normalized)

){

const numberMatch =

normalized.match(

/^(?:प्र(?:श्न)?\s*|Q\s*|Question\s*)(\d+)\s*[.)]/iu

);

const fallbackNumberMatch =

normalized.match(

/^(\d+)\s*[.)]/u

);

const answerNumber =

numberMatch

? Number(numberMatch[1])

: fallbackNumberMatch

? Number(fallbackNumberMatch[1])

: answerKeyQuestions.length + 1;

const answerBody =

cleanText(

normalized

.replace(

/^(?:प्र(?:श्न)?\s*|Q\s*|Question\s*)(\d+)\s*[.)]\s*/iu,

""

)

.replace(

/^(\d+)\s*[.)]\s*/u,

""

)

);

const answerQuestion = {

number:answerNumber,

text:"",

options:[],

isMCQ:false,

answerKey:"",

answerSectionTitle:"",

sectionTitle:currentAnswerKeySection,

solution:""

};

const answerWithLabel =

extractHindiAnswerKey(

answerBody

);

if(

answerWithLabel.answer

){

answerQuestion.answerKey =

normalizeHindiAnswerValue(

answerWithLabel.answer

);

answerQuestion.solution =

cleanText(

answerWithLabel.solution || ""

);

}else{

const optionWithText =

answerBody.match(

/^\(?([कखगघ])\)?\s+(.+)$/u

);

if(optionWithText){

answerQuestion.answerKey =

normalizeHindiAnswerValue(

optionWithText[1]

);

answerQuestion.solution =

cleanText(

optionWithText[2]

);

}else{

const optionOnly =

answerBody.match(

/^\(?([कखगघ])\)?\.?$/u

);

if(optionOnly){

answerQuestion.answerKey =

normalizeHindiAnswerValue(

optionOnly[1]

);

}else{

answerQuestion.solution =

cleanText(

answerBody

);

}

}

}

answerKeyQuestions.push(

answerQuestion

);

return;

}


if(

answerKeyQuestions.length

){

const last =

answerKeyQuestions[

answerKeyQuestions.length - 1

];


const directAnswer =

normalized.match(

/^(?:उत्तर\s*कुंजी|सही\s*उत्तर|उत्तर|answer\s*key|correct\s*answer)\s*[:：-]?\s*\(?([कखगघ])\)?(?:\s*[-–—:：]\s*(.*))?$/iu

);

if(directAnswer){

last.answerKey =

normalizeHindiAnswerValue(

directAnswer[1]

);

if(directAnswer[2]){

last.solution =

cleanText(

(

last.solution

? last.solution + "\n"

: ""

) +

directAnswer[2]

);

}

return;

}


const answerOption =

normalized.match(

/^\(?([कखगघ])\)?\s*(?:[.:-]\s*)?(.*)$/u

);


if(

answerOption

&&

answerOption[1]

&&

answerOption[2] === ""

&&

!last.answerKey

){

last.answerKey =

normalizeHindiAnswerValue(

answerOption[1]

);

return;

}


const answerOptionWithText =

normalized.match(

/^\(?([कखगघ])\)?\s*[.:-]\s*(.+)$/u

);


if(

answerOptionWithText

&&

answerOptionWithText[1]

&&

!last.answerKey

&&

answerOptionWithText[2]

){

last.answerKey =

normalizeHindiAnswerValue(

answerOptionWithText[1]

);

last.solution =

cleanText(

(

last.solution

? last.solution + "\n"

: ""

) +

answerOptionWithText[2]

);

return;

}


last.solution =

cleanText(

(

last.solution

? last.solution + "\n"

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

readingInlineAnswerKey = false;


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

const answerQuestions =
Array.isArray(questions)
? questions
: [];

if(!answerQuestions.length){

return null;

}

return(

<View
style={{
marginTop:18,
width:"100%"
}}
wrap={true}
>

<GlassBadge>

उत्तर कुंजी

</GlassBadge>

{

answerQuestions.map((question,index)=>(

<View
key={"answer-key-" + index}
style={{
marginBottom:10,
width:"100%"
}}
wrap={false}
>

{
cleanText(question.sectionTitle || "") &&
(
index === 0 ||
cleanText(question.sectionTitle || "") !==
cleanText(answerQuestions[index - 1]?.sectionTitle || "")
) &&
<HindiAnswerSectionBadge
title={
cleanText(
question.sectionTitle || ""
)
}
/>

}

<View
style={{
flexDirection:"row",
alignItems:"flex-start",
width:"100%"
}}
>

<QuestionNumberCircle
number={
question.number ||
index + 1
}
/>

<View
style={{
flex:1,
width:"100%"
}}
>

{
(() => {

const answerData =
getHindiAnswerData(
question
);

return(
<>

{answerData.answer &&
<HindiAnswerBubble
answer={
answerData.answer
}
/>
}

{answerData.solution &&
<HindiSolutionSteps
solution={
answerData.solution
}
/>
}

</>
);

})()
}

</View>

</View>

</View>

))

}

</View>

);

}

function HindiAnswerSectionBadge({title=""}){

const value = cleanText(title);

if(!value){

return null;

}

return(

<View
wrap={false}
style={{
alignSelf:"flex-start",
marginLeft:26,
marginTop:5,
marginBottom:6,
paddingHorizontal:9,
paddingVertical:4,
backgroundColor:"#F5F1FF",
borderWidth:1,
borderColor:"#D8CCFF",
borderRadius:8
}}
>

<Text
style={{
fontFamily:"NotoSansDevanagari",
fontSize:8.5,
fontWeight:"bold",
color:"#4F46E5",
lineHeight:1.25
}}
>
{value}
</Text>

</View>

);

}


function HindiAnswerBubble({answer=""}){

const value =
normalizeHindiAnswerValue(
answer
);

if(!value){

return null;

}

const isOptionAnswer =
/^\([कखगघ]\)$/u.test(
value
);

return(

<View
wrap={false}
style={{
marginTop:7,
marginBottom:5,
marginLeft:26,
width:"100%"
}}
>

<View
wrap={false}
style={{
alignSelf:"flex-start",
paddingHorizontal:9,
paddingVertical:4,
backgroundColor:"#F5F1FF",
borderWidth:1,
borderColor:"#D8CCFF",
borderRadius:8
}}
>

<Text
style={{
fontFamily:"NotoSansDevanagari",
fontSize:8.5,
fontWeight:"bold",
color:"#4F46E5",
lineHeight:1.25
}}
>

{
isOptionAnswer
? "उत्तर: " + value
: "उत्तर:"
}

</Text>

</View>

{
!isOptionAnswer &&

<Text
style={{
fontFamily:"NotoSansDevanagari",
fontSize:9.5,
fontWeight:"bold",
color:"#161C48",
lineHeight:1.35,
marginTop:4,
paddingLeft:1
}}
>
{value}
</Text>

}

</View>

);

}

function HindiSolutionSteps({solution=""}){

const steps =
splitHindiSolutionSteps(
solution
);

if(!steps.length){

return null;

}

return(

<View
style={{
marginLeft:26,
marginTop:2,
marginBottom:6,
width:"100%"
}}
>

{

steps.map(
(step,index)=>(

<Text
key={"answer-solution-step-" + index}
style={{
fontFamily:"NotoSansDevanagari",
fontSize:9.5,
lineHeight:1.4,
color:"#161C48",
marginBottom:4
}}
>

{cleanText(step)}

</Text>

)
)

}

</View>

);

}


function getHindiAnswerData(question = {}){

const directAnswer =
normalizeHindiAnswerValue(
question.answerKey || ""
);

const extracted =
extractHindiAnswerKey(
question.answerKey || ""
);

let answer =
directAnswer ||
normalizeHindiAnswerValue(
extracted.answer || ""
);

let solution =
String(question.solution || "")
.split("\n")
.filter(line => !isSectionLine(line))
.map(line => cleanText(line))
.filter(line => !/^(?:खंड\s*['"“”]?[कखगघa-d]['"“”]?|section\s+[a-d])(?:\s*[:：-].*)?$/iu.test(line))
.filter(Boolean)
.join("\n");

return {
answer,
solution
};

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

return /^(?:उत्तर\s*कुंजी|answer\s*key)(?:\s*\([^)]*\))?(?:\s+(?:खंड|section)\s*['"“”]?[कखगघa-d]['"“”]?)?\s*(?:[:：-]|\s*)$/iu.test(
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


const hindiMetadata =
getHindiMetadata(
data,
data.content || ""
);

const answerKeyByNumber = {};

parsed.answerKeyQuestions.forEach(
question => {

const number =
Number(question?.number);

if(!Number.isFinite(number)){

return;

}

answerKeyByNumber[number] = {
...getHindiAnswerData(
question
),
sectionTitle:
cleanText(
question.sectionTitle || ""
)
};

}
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

{hindiMetadata.title}

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

["SUBJECT", hindiMetadata.subject],

["CLASS", hindiMetadata.className],

["CHAPTER", hindiMetadata.chapter],

["TYPE", hindiMetadata.type]

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

<AnswerKey
questions={
parsed.answerKeyQuestions
}
/>

}


</Page>

</Document>

);

}