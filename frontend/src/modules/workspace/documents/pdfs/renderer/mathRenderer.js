import katex
from "katex";


import "katex/dist/katex.min.css";



export function renderMathToSvg(

    value=""

){


if(!value){

    return null;

}



try{


const html =

katex.renderToString(

    value,

    {

        throwOnError:false,

        output:"html"

    }

);



return html;



}

catch(error){


return value;


}


}