import {
  generateResponse,
} from "../services/geminiService";

import {
  saveMessages,
} from "../services/chatHistoryService";


export async function streamResponse({

  prompt,

  file,

  history,

  messages,

  aiMessageId,

  activeChatId,

  setChats,

  setIsThinking,

}) {

  let finalStreamText = "";


  try {

    await generateResponse(

      prompt,

      (streamText) => {

        finalStreamText = streamText;


        // Update current tab while AI is streaming
        setChats((prev) =>
          prev.map((chat) => {

            if (
              chat.id !== activeChatId
            ) {
              return chat;
            }


            return {

              ...chat,

              messages:
                chat.messages.map(
                  (msg) =>
                    msg.id === aiMessageId
                      ? {
                          ...msg,
                          message: streamText,
                        }
                      : msg
                ),

            };

          })
        );

      },

      file,

      history

    );


    // ==========================================
    // CREATE FINAL MESSAGE ARRAY DIRECTLY
    // ==========================================

    if (finalStreamText) {

      const finalMessages =
        messages.map((msg) =>

          msg.id === aiMessageId

            ? {
                ...msg,
                message: finalStreamText,
              }

            : msg

        );


      // Save completed AI response to Firestore
      await saveMessages(
        activeChatId,
        finalMessages
      );


      console.log(
        "Final AI response saved to Firestore"
      );

    }

  }

  catch (error) {

    console.error(
      "Streaming error:",
      error
    );


    if (
      error.name !== "AbortError"
    ) {

      const errorMessage =
        "❌ Something went wrong while generating the response.";


      const errorMessages =
        messages.map((msg) =>

          msg.id === aiMessageId

            ? {
                ...msg,
                message: errorMessage,
              }

            : msg

        );


      setChats((prev) =>
        prev.map((chat) => {

          if (
            chat.id !== activeChatId
          ) {
            return chat;
          }


          return {

            ...chat,

            messages:
              chat.messages.map(
                (msg) =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        message: errorMessage,
                      }
                    : msg
              ),

          };

        })
      );


      await saveMessages(
        activeChatId,
        errorMessages
      );

    }

  }

  finally {

    setIsThinking(false);

  }

}