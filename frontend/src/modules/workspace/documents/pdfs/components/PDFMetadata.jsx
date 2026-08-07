import {

    View,

    Text

}

from "@react-pdf/renderer";


import pdfTheme

from "../styles/pdfTheme";







export default function PDFMetadata({



    data = {}



}){







const items = [



{

    label:"SUBJECT",

    value:data.subject || "Not Provided"

},



{

    label:"CLASS",

    value:data.className || data.class || "Not Provided"

},



{

    label:"CHAPTER",

    value:data.chapter || "Not Provided"

},



{

    label:"TYPE",

    value:data.type || "Document"

}



];











return (

<View

style={{



    marginBottom:20,



    padding:14,



    backgroundColor:"#FFFFFF",



    borderWidth:1,



    borderColor:pdfTheme.colors.border,



    borderRadius:16



}}

>









<Text

style={{



    fontFamily:"NotoSansDevanagari",



    fontSize:11,



    fontWeight:700,



    color:pdfTheme.colors.primary,



    marginBottom:12



}}

>

DOCUMENT DETAILS

</Text>









<View

style={{



    flexDirection:"row",



    flexWrap:"wrap"



}}

>









{

items.map(

(item,index)=>(



<View

key={index}

style={{



    width:"50%",



    padding:5



}}

>









<View

style={{



    backgroundColor:"#F5F3FF",



    borderWidth:1,



    borderColor:"#E2D9FF",



    borderRadius:12,



    padding:12



}}

>









<Text

style={{



    fontFamily:"NotoSansDevanagari",



    fontSize:8,



    color:pdfTheme.colors.secondaryText,



    fontWeight:700



}}

>

{item.label}

</Text>









<Text

style={{



    fontFamily:"NotoSansDevanagari",



    fontSize:11,



    color:pdfTheme.colors.text,



    fontWeight:700



}}

>

{item.value}

</Text>









</View>









</View>



)

)

}









</View>









</View>

);



}