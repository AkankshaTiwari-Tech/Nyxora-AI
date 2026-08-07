import {

    Svg,

    Defs,

    LinearGradient,

    Stop,

    Circle,

    Path

}

from "@react-pdf/renderer";





export default function PDFIcon({

    type

}){





const icons = {



subject:

"M5 4h14v16H5z",



class:

"M12 2L2 7l10 5 10-5-10-5z",



chapter:

"M6 2h9l3 3v17H6z",



type:

"M4 4h16v16H4z"



};







return (

<Svg

width="18"

height="18"

viewBox="0 0 24 24"

>





<Defs>



<LinearGradient

id="iconGradient"

x1="0%"

y1="0%"

x2="100%"

y2="100%"

>



<Stop

offset="0%"

stopColor="#6D5DFB"

/>



<Stop

offset="35%"

stopColor="#3B82F6"

/>



<Stop

offset="70%"

stopColor="#06B6D4"

/>



<Stop

offset="100%"

stopColor="#EC4899"

/>



</LinearGradient>



</Defs>







<Circle

cx="12"

cy="12"

r="12"

fill="url(#iconGradient)"

/>







<Path

d={icons[type]}

fill="#FFFFFF"

/>







</Svg>

);

}