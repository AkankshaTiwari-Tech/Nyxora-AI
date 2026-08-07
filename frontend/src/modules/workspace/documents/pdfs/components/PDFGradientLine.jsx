import {

    Svg,

    Defs,

    LinearGradient,

    Stop,

    Rect

}

from "@react-pdf/renderer";





export default function PDFGradientLine(){



return (

<Svg

width="100%"

height="5"

>



<Defs>



<LinearGradient

id="nyxoraGradient"

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

offset="25%"

stopColor="#8B5CF6"

/>



<Stop

offset="50%"

stopColor="#3B82F6"

/>



<Stop

offset="75%"

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

width="100%"

height="5"

rx="2.5"

fill="url(#nyxoraGradient)"

/>



</Svg>

);

}