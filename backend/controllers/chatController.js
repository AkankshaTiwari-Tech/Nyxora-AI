import {
  generateAIResponseStream,
} from "../services/aiService.js";

import {
  saveMemory,
  getMemory,
} from "../services/memoryService.js";

import {
  extractMemory,
} from "../services/memoryExtractor.js";



export async function chatWithAI(req, res) {


  try {


    const {
      message,
      image,
      history,
      userId,
    } = req.body;



    console.log(
      "Memory User ID:",
      userId
    );



    if(
      (!message ||
      message.trim()==="") &&
      !image
    ){

      return res.status(400).json({

        reply:
          "Message or image is required.",

      });

    }




    let userMemory = null;



    if(userId){


      userMemory =
        await getMemory(userId);


      console.log(
        "Loaded Memory:",
        userMemory
      );


    }




    let fullResponse = "";



    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );


    res.setHeader(
      "Transfer-Encoding",
      "chunked"
    );


    res.setHeader(
      "Cache-Control",
      "no-cache"
    );



    for await(
      const chunk of generateAIResponseStream(

        message ||
        "Analyze this image.",

        image,

        history || [],

        userMemory

      )
    ){


      fullResponse += chunk;


      res.write(chunk);


    }



    res.end();





    // Automatic memory extraction

    if(userId && message){


      const extractedMemory =
        await extractMemory(
          message
        );



      if(
        Object.keys(extractedMemory)
        .length > 0
      ){


        await saveMemory(

          userId,

          extractedMemory

        );


        console.log(
          "Smart memory extracted and saved"
        );


      }


    }



  } catch(error) {


    console.error(
      "Chat Controller Error:",
      error
    );



    if(!res.headersSent){


      return res.status(500).json({

        reply:
          "❌ Something went wrong.",

      });


    }


  }


}