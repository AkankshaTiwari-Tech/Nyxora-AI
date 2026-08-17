import {
  generateResponse,
} from "../services/geminiService";

import {
  saveMessages,
} from "../services/chatHistoryService";


// ======================================================
// STREAM AI RESPONSE
// ======================================================

export async function streamResponse({

  // Full prompt sent to AI.
  // May contain assistant-mode instructions.
  prompt,

  // Clean original user message.
  // Used by backend memory system.
  memoryMessage,

  file,

  files,

  history,

  messages,

  aiMessageId,

  activeChatId,

  setChats,

  setIsThinking,

  userId,

  memory,

  mode,

}) {

  let finalStreamText = "";


  try {

    await generateResponse(

      prompt,

      (streamText) => {

        finalStreamText =
          streamText;


        // ==========================================
        // UPDATE CURRENT TAB DURING STREAMING
        // ==========================================

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
                          message:
                            streamText,
                        }

                      : msg

                ),

            };

          })
        );

      },

      file,

      files,

      history,


      // ==========================================
      // PERSONAL AI DATA
      // ==========================================

      userId,

      memory,


      // ==========================================
      // CLEAN MESSAGE FOR MEMORY
      // ==========================================

      memoryMessage

    );


    // ==========================================
    // SAVE FINAL RESPONSE TO FIRESTORE
    // ==========================================

    if (finalStreamText) {

      const finalMessages =
        messages.map((msg) =>

          msg.id === aiMessageId

            ? {
                ...msg,
                message:
                  finalStreamText,
              }

            : msg

        );


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
      error.name !==
      "AbortError"
    ) {

      const errorMessage =
        "❌ Something went wrong while generating the response.";


      const errorMessages =
        messages.map((msg) =>

          msg.id === aiMessageId

            ? {
                ...msg,
                message:
                  errorMessage,
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
                        message:
                          errorMessage,
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