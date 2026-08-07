import {

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







function GradientLine(){



return (

<Svg

width="515"

height="4"

viewBox="0 0 515 4"

>



<Defs>



<LinearGradient

id="nyxoraHeaderGradient"

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

fill="url(#nyxoraHeaderGradient)"

/>



</Svg>

);

}











export default function PDFHeader({



    title



}){



return (

<View

style={{

    marginBottom:20,

    alignItems:"flex-start"

}}

>







<View

style={{

    width:"100%",

    alignItems:"center",

    marginBottom:10

}}

>







<Image

src="/nyxora-logo.svg"

style={{

    width:70,

    height:45,

    objectFit:"contain",

    marginBottom:3

}}

/>







<Text

style={{

    fontFamily:"NotoSansDevanagari",

    fontSize:11,

    fontWeight:700,

    color:"#6D5DFB",

    letterSpacing:0.5

}}

>

Nyxora AI

</Text>







</View>











<View

style={{

    width:"100%",

    marginBottom:16

}}

>



<GradientLine />



</View>











<Text

style={{

    fontFamily:"NotoSansDevanagari",

    fontSize:24,

    fontWeight:700,

    color:"#161C48",

    marginBottom:4

}}

>

{title || "Nyxora Document"}

</Text>









<Text

style={{

    fontFamily:"NotoSansDevanagari",

    fontSize:10,

    color:"#64748B"

}}

>

Smart Digital Learning Workspace

</Text>







</View>

);

}