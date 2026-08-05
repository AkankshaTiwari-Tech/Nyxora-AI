import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


dotenv.config();


const router = express.Router();



// ======================================================
// GEMINI IMAGE MODELS
// ======================================================


const IMAGE_MODELS = [

  "gemini-2.5-flash-image",

  "gemini-3.1-flash-image",

  "gemini-3-pro-image"

];




// ======================================================
// GEMINI IMAGE GENERATION
// ======================================================


async function generateGeminiImage(

  prompt

){


  const ai =

  new GoogleGenAI({

    apiKey:

      process.env.GEMINI_API_KEY

  });




  let lastError = null;




  for(

    const model of IMAGE_MODELS

  ){


    try{


      console.log(

        "Trying Gemini image model:",

        model

      );





      const response =

      await ai.models.generateContent({

        model,


        contents:[

          {

            role:"user",


            parts:[

              {

                text:

`Create a premium presentation image.

Topic:
${prompt}

Style:
- Apple keynote quality
- Professional educational visual
- Realistic
- Cinematic lighting
- Clean composition
- No text
- No watermark`

              }

            ]

          }

        ]


      });







      const imagePart =

      response

      ?.candidates

      ?. [0]

      ?.content

      ?.parts

      ?.find(

        part =>

        part.inlineData

      );







      if(imagePart){


        return {

          source:"gemini",


          image:

          `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`

        };


      }



      throw new Error(

        "No Gemini image returned"

      );



    }


    catch(error){


      console.log(

        model,

        "failed:",

        error.message

      );


      lastError = error;


    }


  }





  throw lastError;

}









// ======================================================
// PEXELS FREE IMAGE FALLBACK
// ======================================================


async function generatePexelsImage(

  prompt

){



  if(

    !process.env.PEXELS_API_KEY

  ){


    throw new Error(

      "Pexels API key missing."

    );


  }





  const response =

  await fetch(

`https://api.pexels.com/v1/search?query=${encodeURIComponent(prompt)}&per_page=1`,

    {


      headers:{


        Authorization:

        process.env.PEXELS_API_KEY


      }


    }

  );





  const data =

  await response.json();






  const imageUrl =

  data

  ?.photos

  ?. [0]

  ?.src

  ?.large;






  if(!imageUrl){


    throw new Error(

      "No Pexels image found."

    );


  }







  const imageResponse =

  await fetch(

    imageUrl

  );





  const buffer =

  await imageResponse.arrayBuffer();






  const base64 =

  Buffer

  .from(buffer)

  .toString("base64");







  return {


    source:"pexels",


    image:

    `data:image/jpeg;base64,${base64}`


  };


}









// ======================================================
// FINAL IMAGE GENERATOR
//
// Gemini first
// Pexels fallback
// ======================================================


async function generateImage(

 prompt

){



  try{


    return await generateGeminiImage(

      prompt

    );


  }


  catch(error){



    console.log(

      "Gemini image unavailable."

    );



    return await generatePexelsImage(

      prompt

    );


  }


}









// ======================================================
// POST /api/generate-image
// ======================================================


router.post(

"/",

async(req,res)=>{


try{


const {

prompt

}=req.body;





if(!prompt){


return res.status(400).json({


success:false,


message:

"Image prompt required."


});


}






const result =

await generateImage(

prompt

);






return res.json({


success:true,


image:

result.image,


source:

result.source



});





}

catch(error){



console.error(

"Image generation failed:",

error

);





return res.status(500).json({


success:false,


message:

error.message



});


}



}

);






export default router;