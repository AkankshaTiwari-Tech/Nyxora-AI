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

.replace(/\\_/g,"_")

.replace(/\\,/g," ")

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
function parseContent(content=""){



const lines = content

.split("\n")

.map(line=>line.trim())

.filter(Boolean);







const sections = [];



const answerSections = [];
const isHindi =

/उत्तर कुंजी/.test(content);







let currentSection = {

title:"",

questions:[]

};







let currentAnswerSection = {

title:"",

questions:[]

};







let instructions = [];







let currentQuestion = null;



let currentAnswerQuestion = null;







let readingAnswerKey = false;







lines.forEach(rawLine=>{



const clean = cleanText(rawLine);







if(!clean){

return;

}







if(
detectAnswerKey(clean)
){

    readingAnswerKey = true;

    currentAnswerQuestion = null;

    currentAnswerSection = {

        title: isHindi ? "उत्तर कुंजी" : "ANSWER KEY",

        questions:[]

    };

    return;

}







if(readingAnswerKey){

    if(
        clean === "" ||
        clean === "---" ||
        clean === "###" ||
        clean === "##"
    ){
        return;
    }

    if(
        clean.match(/^(Q\s*)?\d+[.)]/i) ||
        clean.match(/^(प्र)\s*\d+[.)]/i)
    ){

        currentAnswerQuestion = {
            text: clean
                .replace(/^(Q\s*)?\d+[.)]\s*/i,"")
                .replace(/^(प्र)\s*\d+[.)]\s*/i,"")
                .trim(),
            options:[]
        };

        currentAnswerSection.questions.push(currentAnswerQuestion);
        return;
    }

    if(
        clean.match(/^\s*\(?[a-dA-Dकखगघ]\)?[\.\)]/)
    ){

        if(currentAnswerQuestion){
            currentAnswerQuestion.options.push(
                clean.replace(/^\s*\(?[a-dA-Dकखगघ]\)?[\.\)]\s*/,"").trim()
            );
        }

        return;
    }

    if(currentAnswerQuestion){
        currentAnswerQuestion.text += " " + clean;
    }

    return;
}

if(

clean.match(

/^(subject|class|student name|time allowed|maximum marks|marks|विषय|कक्षा|विद्यार्थी|समय|पूर्णांक)\s*[:：]/i

)

){

return;

}







if(

clean.match(

/^section\s+[a-d]/i

)

||

clean.match(

/^खंड\s*['"]?[कखगघ]['"]?/i

)

){



if(

currentSection.questions.length

){



sections.push(

currentSection

);



}







currentSection={



title:clean,



questions:[]

};



currentQuestion=null;



return;



}







if(

clean.match(

/^(सामान्य निर्देश|निर्देश|Instructions)/i

)

){



currentSection={



title:"Instructions",



questions:[]

};



currentQuestion=null;



return;



}







if(

clean.match(

/^(Q\s*)?\d+[.)]/i

)

||

clean.match(

/^(प्र)\s*\d+[.)]/i

)

){



currentQuestion={



text:

clean

.replace(

/^(Q\s*)?\d+[.)]\s*/i,

""

)

.replace(

/^(प्र)\s*\d+[.)]\s*/i,

""

)

.trim(),



options:[]

};



currentSection.questions.push(

currentQuestion

);



return;



}
if(

clean.match(

/^\s*\(?[a-dA-Dकखगघ]\)?[\.\)]/

)

){



if(currentQuestion){



currentQuestion.options.push(



clean

.replace(

/^\s*\(?[a-dA-Dकखगघ]\)?[\.\)]\s*/,

""

)

.trim()



);



}



return;



}







if(currentSection.title==="Instructions"){



if(

clean.match(

/^\d+[.)]/

)

){



currentSection.questions.push({



text:

clean.replace(

/^\d+[.)]\s*/,

""

),



options:[]

});



return;



}



}







if(currentQuestion){



currentQuestion.text +=



" " + clean;



}



});







if(currentSection.questions.length){



sections.push(

currentSection

);



}







if(currentAnswerSection.questions.length){



answerSections.push(

currentAnswerSection

);



}







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



item=>item.title!=="Instructions"



);







const hasAnswer = answerSections.length > 0;







const isHindi = /उत्तर कुंजी/i.test(



data.content || ""



);











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



data={data}



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



(section,index)=>(



<PDFSection



key={index}



section={section}



/>



)



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
.filter(Boolean)
.map((section,index)=>(
<PDFSection
key={"answer-"+index}
section={{
...section,
title:""
}}
/>
))
}
</>
)
}


</Page>







</Document>



);



}