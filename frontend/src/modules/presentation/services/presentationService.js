import {
  generateResponse,
} from "../../chat/services/geminiService";



/*
======================================================

 NYXORA AI CINEMATIC PRESENTATION ENGINE


 Flow:

 User Input
      ↓
 Gemini AI
      ↓
 Structured Slide JSON
      ↓
 Presentation Builder
      ↓
 PPT Export


 Philosophy:

 - Apple Keynote inspired
 - TED talk storytelling
 - Minimal words
 - Maximum visual impact

======================================================
*/







export async function generatePresentation({


  topic,


  subject,


  className,


  slideCount,


  theme,


  customPrompt = "",



}) {



  const prompt =


    buildPresentationPrompt({


      topic,


      subject,


      className,


      slideCount,


      theme,


      customPrompt,



    });







  let response = "";








  await generateResponse(



    prompt,



    (chunk)=>{



      response = chunk;



    }



  );








  return parsePresentationResponse(

    response

  );



}









function buildPresentationPrompt({



  topic,


  subject,


  className,


  slideCount,


  theme,


  customPrompt,



}) {



return `



You are Nyxora AI, a world-class cinematic presentation designer.



Create a premium Apple Keynote style presentation.



TOPIC:

${topic}



SUBJECT:

${subject}



AUDIENCE:

${className}



NUMBER OF SLIDES:

${slideCount}



THEME:

${theme}





CUSTOM INSTRUCTIONS:

${customPrompt || "Create a premium educational presentation."}





======================================================

CORE DESIGN RULES

======================================================



RULE 1:

This is NOT a document.

This is a visual story.



Do NOT create:

- textbook slides
- lecture notes
- paragraphs
- reports





RULE 2:

Every slide must communicate ONE idea only.



A slide is not a chapter.

A slide is a moment.





RULE 3:

Text must be extremely minimal.



Maximum:

Title:
5 words



Supporting text:
15 words



Points:
Maximum 3 words each



Never create long sentences.





======================================================

SLIDE CREATION RULES

======================================================



Create exactly ${slideCount} slides.



Each slide must have:

- one main idea
- one visual concept
- strong hierarchy
- cinematic composition






======================================================

AVAILABLE STORY SLIDES

======================================================



1. HERO SLIDE



Purpose:

Opening cinematic impact.





Structure:



{

"type":"hero",

"title":"",

"headline":"",

"visualConcept":"",

"imagePrompt":""

}







2. CONCEPT SLIDE



Purpose:

Explain one important idea.





Rules:

- No definition paragraphs
- Use metaphor
- Use minimal supporting words





Structure:



{

"type":"concept",

"title":"",

"headline":"",

"points":[

"",

"",

""

],

"visualConcept":"",

"imagePrompt":"",

"keyTakeaway":""

}







3. PROCESS SLIDE



Purpose:

Explain transformation or flow.





Rules:

- Maximum 5 steps
- Short labels only
- Clear movement





Structure:



{

"type":"process",

"title":"",

"diagram":{

"type":"flow",

"steps":[

"",

"",

""

]

},

"visualConcept":"",

"imagePrompt":""

}







4. COMPARISON SLIDE



Purpose:

Show contrast.





Structure:



{

"type":"comparison",

"title":"",

"leftTitle":"",

"leftPoints":[

""

],

"rightTitle":"",

"rightPoints":[

""

]

}







5. SUMMARY SLIDE



Purpose:

End with memorable message.





Structure:



{

"type":"summary",

"title":"",

"headline":"",

"keyTakeaway":"",

"visualConcept":"",

"imagePrompt":""

}








======================================================

VISUAL RULES

======================================================



Every slide MUST include:



visualConcept:

Describe the visual idea.





Examples:



"Human brain connected with artificial neurons"



"Plant leaf glowing with solar energy"



"Data flowing through a neural network"







imagePrompt:

Must describe:



- cinematic illustration

- professional educational visual

- clean composition

- modern design








======================================================

FORBIDDEN OUTPUT

======================================================



Never generate:



❌ 5+ bullet points



❌ Long explanations



❌ Paragraphs



❌ Wikipedia style content



❌ Generic headings like:



"Introduction"



"Overview"



"Conclusion"







Create a presentation that looks like:



- Apple keynote

- TED talk

- Premium educational documentary






Return ONLY JSON.

No markdown.

No explanation.



Required JSON format:



{

"title":"",

"description":"",


"slides":[


{

"slideNumber":1,


"type":"hero",


"title":"",


"subtitle":"",


"headline":"",


"points":[

""

],


"visualConcept":"",


"imagePrompt":"",


"visualType":"image",


"diagram":{

"type":"",

"steps":[]

},


"keyTakeaway":""


}

]

}



`;
}
// ======================================================
// PARSE PRESENTATION RESPONSE
// ======================================================


function parsePresentationResponse(

  response

){



  try {



    const cleaned =


      response

        .replace(

          /```json/g,

          ""

        )

        .replace(

          /```/g,

          ""

        )

        .trim();







    const parsed =


      JSON.parse(

        cleaned

      );







    return {



      title:


        parsed.title ||


        "Nyxora AI Presentation",






      description:


        parsed.description ||


        "",






      slides:


        normalizeSlides(

          parsed.slides || []

        ),



    };



  }

  catch(error){



    console.error(


      "Presentation JSON parsing failed:",


      error



    );







    return {



      title:


        "Generated Presentation",






      description:


        "",






      slides:


        [],



    };



  }



}









// ======================================================
// NORMALIZE SLIDES
// ======================================================


function normalizeSlides(

  slides

){



  return slides.map(

    (slide,index)=>({



      slideNumber:


        slide.slideNumber ||


        index + 1,






      type:


        slide.type ||


        "concept",






      layout:


        convertLayout(

          slide.type

        ),






      title:


        cleanText(

          slide.title

        ),






      subtitle:


        cleanText(

          slide.subtitle

        ),






      headline:


        cleanText(

          slide.headline

        ),






      points:


        limitPoints(

          slide.points

        ),






      visualConcept:


        cleanText(

          slide.visualConcept

        ),






      imagePrompt:


        cleanText(

          slide.imagePrompt

        ),






      visualType:


        slide.visualType ||


        "image",






      diagram:


        slide.diagram || {



          type:"",


          steps:[],


        },






      keyTakeaway:


        cleanText(

          slide.keyTakeaway

        ),



    })

  );



}









// ======================================================
// CONVERT AI TYPE TO PPT LAYOUT
// ======================================================


function convertLayout(

  type

){



  switch(type){



    case "hero":


      return "title";





    case "process":


      return "diagram";





    case "comparison":


      return "comparison";





    case "summary":


      return "summary";





    default:


      return "content";



  }



}









// ======================================================
// CLEAN TEXT
// ======================================================


function cleanText(

  value

){



  if(

    !value

  ){


    return "";

  }







  return String(value)

    .replace(

      /\n+/g,

      " "

    )

    .trim();



}









// ======================================================
// LIMIT POINTS
// ======================================================


function limitPoints(

  points

){



  if(

    !Array.isArray(points)

  ){


    return [];


  }







  return points

    .slice(

      0,

      3

    )

    .map(

      point => {



        const text =


          cleanText(

            point

          );







        if(

          text.length > 35

        ){



          return (

            text.substring(

              0,

              35

            )

            +

            "..."

          );


        }







        return text;



      }

    )

    .filter(

      Boolean

    );



}









// ======================================================
// END OF NYXORA AI PRESENTATION SERVICE
// ======================================================