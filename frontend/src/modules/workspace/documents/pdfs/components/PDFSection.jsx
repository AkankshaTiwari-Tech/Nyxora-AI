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

    fontWeight:700

}}

>

{title}

</Text>



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

number={question.number || index + 1}

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