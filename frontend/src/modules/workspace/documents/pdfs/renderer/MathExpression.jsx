import {
    Image
}
from "@react-pdf/renderer";


import katex
from "katex";


import "katex/dist/katex.min.css";





function convertLatexToSvg(

    latex=""

){


try{


const html =

katex.renderToString(

    latex,

    {

        throwOnError:false,

        output:"html"

    }

);



const svg = `

<svg

xmlns="http://www.w3.org/2000/svg"

width="300"

height="60"

>

<foreignObject

width="300"

height="60"

>

<div

xmlns="http://www.w3.org/1999/xhtml"

style="font-size:22px"

>

${html}

</div>

</foreignObject>

</svg>

`;



return (

"data:image/svg+xml;base64," +

btoa(
    unescape(
        encodeURIComponent(svg)
    )
)

);



}

catch(error){


return null;


}



}





export default function MathExpression({

value

}){


if(!value){

    return null;

}



const svgSource =

convertLatexToSvg(

    value

);




if(!svgSource){

    return null;

}



return (

<Image

src={svgSource}

style={{

    width:120,

    height:30

}}

/>

);


}