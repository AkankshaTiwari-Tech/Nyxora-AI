// ======================================================
// NYXORA AI VISUAL GENERATION SERVICE
//
// Hybrid Visual Engine
//
// Flow:
//
// slide.visualType
//        ↓
// visualGenerationService
//        ↓
// ┌─────────────────────────────┐
// │ Diagram / Flow              │
// │        ↓                    │
// │     addShape()              │
// │                             │
// │ SVG / Visual Asset          │
// │        ↓                    │
// │     addImage()              │
// │                             │
// │ AI Generated Image          │
// │        ↓                    │
// │     addImage()              │
// └─────────────────────────────┘
//
//        ↓
//
// PPTX Export
//
// ======================================================
//
// Responsibilities:
//
// - Decide visual rendering method
// - Generate local SVG visuals
// - Generate diagrams
// - Prepare PPT-ready assets
// - Support future AI image APIs
//
// ======================================================






export function generateSlideVisual({


  visualType,


  prompt,


  diagram,


}) {



  switch(visualType){



    case "diagram":


      return generateDiagramVisual(

        diagram

      );




    case "icon":


      return generateIconVisual(

        prompt

      );




    case "image":


      return generateImageVisual(

        prompt

      );




    default:


      return null;


  }


}








// ======================================================
// IMAGE VISUAL
//
// Current:
// Generates premium SVG visual.
//
// Future:
// Replace with AI image generation API.
//
// Output:
// Used with pptx.addImage()
//
// ======================================================


function generateImageVisual(

  prompt

){



  return {


    type:

      "image",



    format:

      "svg",



    data:


`

<svg

xmlns="http://www.w3.org/2000/svg"

width="900"

height="550"

viewBox="0 0 900 550"

>


<defs>


<linearGradient

id="gradient"

x1="0"

y1="0"

x2="1"

y2="1"

>


<stop

offset="0%"

stop-color="#6366f1"

/>


<stop

offset="100%"

stop-color="#a855f7"

/>


</linearGradient>


</defs>





<rect

width="900"

height="550"

rx="50"

fill="url(#gradient)"

/>





<circle

cx="450"

cy="190"

r="90"

fill="white"

opacity="0.15"

/>





<text

x="450"

y="210"

fill="white"

font-size="70"

font-family="Arial"

text-anchor="middle"

>

✦

</text>





<text

x="450"

y="330"

fill="white"

font-size="34"

font-family="Arial"

text-anchor="middle"

>

AI Visual Concept

</text>





<text

x="450"

y="390"

fill="white"

opacity="0.85"

font-size="22"

font-family="Arial"

text-anchor="middle"

>

${escapeXML(

  shortenText(prompt)

)}

</text>





</svg>

`

  };


}
// ======================================================
// ICON VISUAL
//
// Used for:
// - concept cards
// - feature slides
// - highlight sections
//
// Output:
// SVG asset → pptx.addImage()
//
// ======================================================


function generateIconVisual(

  prompt

){


  return {


    type:

      "image",



    format:

      "svg",



    data:


`

<svg

xmlns="http://www.w3.org/2000/svg"

width="500"

height="500"

viewBox="0 0 500 500"

>


<rect

width="500"

height="500"

rx="80"

fill="#111827"

/>





<circle

cx="250"

cy="190"

r="90"

fill="#8b5cf6"

/>





<text

x="250"

y="220"

fill="white"

font-size="80"

font-family="Arial"

text-anchor="middle"

>

✦

</text>





<text

x="250"

y="360"

fill="white"

font-size="22"

font-family="Arial"

text-anchor="middle"

>

${escapeXML(

  shortenText(prompt)

)}

</text>





</svg>

`

  };


}









// ======================================================
// DIAGRAM VISUAL
//
// Creates process/flow diagrams.
//
// Future:
// Can directly map to pptx.addShape()
//
// Current:
// SVG → pptx.addImage()
//
// ======================================================


function generateDiagramVisual(

  diagram

){



  const steps =


    diagram?.steps || [];






  return {


    type:

      "image",



    format:

      "svg",



    data:


`

<svg

xmlns="http://www.w3.org/2000/svg"

width="1100"

height="350"

viewBox="0 0 1100 350"

>


<defs>


<linearGradient

id="box"

x1="0"

y1="0"

x2="1"

y2="1"

>


<stop

offset="0%"

stop-color="#8b5cf6"

/>


<stop

offset="100%"

stop-color="#4f46e5"

/>


</linearGradient>


</defs>







${


steps.map(

(step,index)=>`



<rect

x="${80 + index * 240}"

y="110"

width="170"

height="90"

rx="20"

fill="url(#box)"

/>





<text

x="${165 + index * 240}"

y="165"

fill="white"

font-size="20"

font-family="Arial"

text-anchor="middle"

>

${escapeXML(step)}

</text>







${

index < steps.length - 1

?

`

<text

x="${215 + index * 240}"

y="165"

fill="white"

font-size="35"

font-family="Arial"

text-anchor="middle"

>

→

</text>

`

:

""

}



`

).join("")


}





</svg>

`

  };


}









// ======================================================
// HELPERS
// ======================================================


function shortenText(

  text,

  limit = 40

){


  if(!text){

    return "";

  }



  if(text.length <= limit){

    return text;

  }



  return (

    text.substring(

      0,

      limit

    )

    +

    "..."

  );


}









function escapeXML(

  value

){



  return String(

    value || ""

  )


  .replace(

    /&/g,

    "&amp;"

  )


  .replace(

    /</g,

    "&lt;"

  )


  .replace(

    />/g,

    "&gt;"

  )


  .replace(

    /"/g,

    "&quot;"

  )


  .replace(

    /'/g,

    "&apos;"

  );



}