// ======================================================
// NYXORA AI VISUAL GENERATION SERVICE
//
// Hybrid Visual Engine
//
// Supports:
// ✓ Gemini AI image generation
// ✓ SVG diagrams
// ✓ SVG icons
// ✓ PPT compatible assets
// ✓ Future image providers
//
// Flow:
//
// Slide JSON
//      ↓
// visualType
//      ↓
// Visual Generator
//      ↓
// PPT Export
//
// ======================================================



const IMAGE_API_URL =
  "http://localhost:5000/api/generate-image";





// ======================================================
// MAIN VISUAL ROUTER
// ======================================================


export async function generateSlideVisual({

  visualType,

  prompt,

  diagram,


}) {



  switch(visualType){



    case "image":


      return await generateImageVisual(

        prompt

      );





    case "diagram":


      return generateDiagramVisual(

        diagram

      );





    case "icon":


      return generateIconVisual(

        prompt

      );





    default:


      return null;


  }


}









// ======================================================
// GEMINI IMAGE GENERATION
//
// Returns:
// {
//   type:"image",
//   format:"base64",
//   data:"data:image/png;base64,..."
// }
//
// ======================================================


async function generateImageVisual(

  prompt

){



  try {



    const response =

      await fetch(

        IMAGE_API_URL,

        {



          method:"POST",



          headers:{



            "Content-Type":

              "application/json",



          },



          body:JSON.stringify({



            prompt:

`Create a premium cinematic educational visual.

Topic:
${prompt}

Style:
- Apple keynote presentation quality
- TED talk visual style
- realistic
- professional lighting
- clean composition
- modern educational documentary
- no text
- no labels
- no watermark`



          })



        }

      );







    const data =

      await response.json();







    if(

      !data.success ||

      !data.image

    ){


      console.error(

        "Gemini image missing"

      );


      return null;


    }







    return {


      type:

        "image",



      format:

        "base64",



      data:

        data.image,


    };




  }

  catch(error){



    console.error(

      "Visual generation failed:",

      error

    );



    return null;



  }


}
// ======================================================
// ICON VISUAL GENERATOR
//
// Used for:
// ✓ Concept cards
// ✓ Feature highlights
// ✓ Small visual elements
//
// Output:
// SVG → PPT Image
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

width="600"

height="600"

viewBox="0 0 600 600"

>



<defs>


<linearGradient

id="iconGradient"

x1="0"

y1="0"

x2="1"

y2="1"

>


<stop

offset="0%"

stop-color="#2563EB"

/>


<stop

offset="100%"

stop-color="#38BDF8"

/>


</linearGradient>


</defs>





<rect

width="600"

height="600"

rx="120"

fill="#F8FAFC"

/>





<circle

cx="300"

cy="240"

r="110"

fill="url(#iconGradient)"

/>





<text

x="300"

y="275"

fill="white"

font-size="90"

font-family="Arial"

text-anchor="middle"

>

✦

</text>







<text

x="300"

y="430"

fill="#0F172A"

font-size="24"

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
// DIAGRAM VISUAL GENERATOR
//
// Keeps SVG because:
// ✓ Faster
// ✓ Editable
// ✓ Perfect for process slides
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

width="1200"

height="400"

viewBox="0 0 1200 400"

>



<defs>


<linearGradient

id="boxGradient"

x1="0"

y1="0"

x2="1"

y2="1"

>


<stop

offset="0%"

stop-color="#2563EB"

/>


<stop

offset="100%"

stop-color="#38BDF8"

/>


</linearGradient>


</defs>





${
steps.map(

(step,index)=>`



<rect

x="${80 + index * 260}"

y="120"

width="190"

height="100"

rx="25"

fill="url(#boxGradient)"

/>





<text

x="${175 + index * 260}"

y="180"

fill="white"

font-size="22"

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

x="${225 + index * 260}"

y="180"

fill="#2563EB"

font-size="45"

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



  const value =

    String(text);



  if(

    value.length <= limit

  ){

    return value;

  }



  return (

    value.substring(

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









// ======================================================
// IMAGE FORMAT CONVERTER
//
// Makes Gemini response compatible
// with pptx.addImage()
//
// ======================================================


export function prepareVisualForPpt(

  visual

){



  if(!visual){

    return null;

  }







  if(

    visual.format === "base64"

  ){



    return {


      type:"image",


      data:

        visual.data,


    };



  }







  if(

    visual.format === "svg"

  ){



    return {


      type:"image",


      data:

        svgToDataUri(

          visual.data

        ),


    };



  }







  return visual;


}









// ======================================================
// SVG TO DATA URI
// ======================================================


function svgToDataUri(

  svg

){



  return (

    "data:image/svg+xml;base64," +

    btoa(

      unescape(

        encodeURIComponent(

          svg

        )

      )

    )

  );


}
// ======================================================
// DEFAULT VISUAL FALLBACK
//
// Keeps PPT stable if Gemini fails.
//
// IMPORTANT:
// No fake AI Visual Concept card.
//
// Returns null so PPT can skip visual.
// ======================================================


export function fallbackVisual(){

  return null;

}









// ======================================================
// CHECK VISUAL SUPPORT
// ======================================================


export function isVisualAvailable(

  visual

){


  return !!(

    visual &&

    visual.type === "image" &&

    visual.data

  );


}









// ======================================================
// VISUAL TYPE NORMALIZER
//
// Keeps compatibility with old AI JSON
// ======================================================


export function normalizeVisualType(

  type

){



  switch(type){



    case "hero":

    case "image":

      return "image";



    case "process":

    case "flow":

      return "diagram";



    case "feature":

    case "icon":

      return "icon";



    default:

      return "image";



  }


}









// ======================================================
// END NYXORA AI VISUAL ENGINE
//
// Features:
//
// ✓ Gemini image generation ready
// ✓ Real cinematic visuals
// ✓ SVG diagrams
// ✓ SVG icons
// ✓ PPT compatible
// ✓ No fake purple placeholders
// ✓ No AI Visual Concept cards
//
// ======================================================