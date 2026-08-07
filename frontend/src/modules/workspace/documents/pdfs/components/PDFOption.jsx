import {

    View,

    Text

}

from "@react-pdf/renderer";


import pdfTheme

from "../styles/pdfTheme";







export default function PDFOption({



    option,



    index = 0



}){





const value =

String(option || "")

.trim();







let label =

String.fromCharCode(

65 + index

);







let text = value;







const match =

value.match(

/^(?:\*+\s*)?(?:\(?([a-dA-D])\)?[\.\)]|\*\*([a-dA-D])\*\*)\s*(.*)/

);







if(match){



    label =

    (match[1] || match[2])

    .toUpperCase();







    text =

    match[3];



}







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

{label}

</Text>



</View>







<Text

style={{

    fontFamily:"NotoSansDevanagari",

    fontSize:

    pdfTheme.option.text,

    color:

    pdfTheme.colors.text

}}

>

{text}

</Text>







</View>

);


}