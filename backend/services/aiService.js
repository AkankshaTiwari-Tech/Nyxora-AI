import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



const SYSTEM_PROMPT = `
You are Nyxora AI.

Identity:
- Your name is Nyxora AI.
- You are the AI assistant inside the Nyxora AI platform.
- You were created by Team Nyxora.
- Never introduce yourself as Gemini or Google AI.
- If someone asks "Who are you?", reply that you are Nyxora AI.
- If someone asks "Who created you?", reply "I was created by Team Nyxora."

User interaction:
- Be professional, friendly, intelligent and concise.
- Do not call the user by name unless the user has explicitly told you their name.
- Do not assume names.
- Use memory only when helpful.
- Never mention that you are reading memory.

Formatting:
- Use proper Markdown.
`;



const MODELS = [

  "gemini-3.6-flash",

  "gemini-3.5-flash",

  "gemini-3-flash-preview",

];



const sleep = (ms) =>
  new Promise(
    (resolve)=>
      setTimeout(resolve, ms)
  );





function createMemoryPrompt(memory){


  if(!memory)

    return "";



  return `

User Memory:

${JSON.stringify(
  memory,
  null,
  2
)}

Use this information only when helpful.

`;

}







async function streamFromModel(
  model,
  prompt,
  image = null,
  history = [],
  memory = null
){


  const contents = [];



  if(memory){

    contents.push({

      role:"user",

      parts:[

        {

          text:
            createMemoryPrompt(memory),

        },

      ],

    });

  }





  if(history && history.length > 0){


    history.forEach((msg)=>{


      if(
        msg.role === "user" ||
        msg.role === "assistant"
      ){


        contents.push({

          role:

            msg.role === "assistant"

              ? "model"

              : "user",


          parts:[

            {

              text:
                msg.message || "",

            },

          ],

        });


      }


    });


  }







  const parts = [

    {

      text:

`${SYSTEM_PROMPT}

User:
${prompt}`

    },

  ];







  if(image){


    parts.push({

      inlineData:{

        data:
          image.data,

        mimeType:
          image.mimeType,

      },

    });


  }







  contents.push({

    role:"user",

    parts,

  });







  return await ai.models.generateContentStream({

    model,

    contents,

  });


}








export async function* generateAIResponseStream(

  message,

  image = null,

  history = [],

  memory = null

){


  let lastError = null;






  for(
    const model of MODELS
  ){



    try{


      console.log(
        `🟢 Trying model: ${model}`
      );



      const response =

        await streamFromModel(

          model,

          message,

          image,

          history,

          memory

        );







      for await(
        const chunk of response
      ){


        if(chunk.text){

          yield chunk.text;

        }


      }






      console.log(

        `✅ Response generated using ${model}`

      );



      return;





    }
    catch(error){



      lastError = error;



      console.error(

        `❌ ${model} failed`,

        error.message || error

      );







      // Handle temporary overload

      if(error.status === 503){


        console.log(

          `⚠️ ${model} unavailable. Switching model...`

        );



        await sleep(3000);



        continue;


      }







      // Handle quota limit

      if(error.status === 429){


        console.log(

          `⚠️ ${model} quota exceeded. Switching model...`

        );



        continue;


      }







      console.log(

        "➡️ Switching model..."

      );



    }



  }






  throw lastError;


}