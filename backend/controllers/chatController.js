import {
  generateAIResponseStream,
} from "../services/aiService.js";

import {
  saveMemory,
} from "../services/memoryService.js";


export async function chatWithAI(req, res) {


  try {


    const {
      message,
      image,
      history,
      memory,
      userId,
    } = req.body;



    if (
      (!message ||
        message.trim() === "") &&
      !image
    ) {


      return res.status(400).json({

        reply:
          "Message or image is required.",

      });

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


    res.setHeader(
      "Connection",
      "keep-alive"
    );



    for await (
      const chunk of generateAIResponseStream(

        message ||
        "Analyze this image.",

        image,

        history || [],

        memory || null

      )
    ) {


      fullResponse += chunk;


      res.write(chunk);


    }



    res.end();



    // Automatic memory extraction

    if(userId) {


      const extractedMemory = {

        lastTopic:
          message?.slice(0,100) || "",


        lastInteraction:
          new Date().toISOString(),

      };



      await saveMemory(
        userId,
        extractedMemory
      );


    }



  } catch(error) {


    console.error(
      "Chat Controller Error:",
      error
    );



    if(error.status === 503) {


      return res.status(503).json({

        reply:
          "🚦 Nyxora AI is currently experiencing high demand. Please try again in a few moments.",

      });


    }



    if(error.status === 404) {


      return res.status(404).json({

        reply:
          "⚠️ The selected AI model is unavailable. Please try again later.",

      });


    }



    return res.status(500).json({

      reply:
        "❌ Something went wrong while generating the response. Please try again.",

    });


  }

}