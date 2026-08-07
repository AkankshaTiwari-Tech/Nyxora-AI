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







export default function PDFQuestion({



    number,



    question = {},



    isInstruction = false



}){





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







</View>











{

question.math &&

<MathExpression

value={question.math}

/>

}











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