import {
  generateResponse,
} from "../services/geminiService";


export async function streamResponse({
  prompt,
  file,
  history,
  aiMessageId,
  activeChatId,
  setChats,
  setIsThinking,
}) {

  try {

    await generateResponse(
      prompt,

      (streamText) => {

        setChats((prev) =>

          prev.map((chat) => {

            if (
              chat.id !== activeChatId
            )
              return chat;


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

      history

    );


  } catch(error) {

    if(
      error.name !== "AbortError"
    ) {

      setChats((prev) =>

        prev.map((chat) => {

          if(
            chat.id !== activeChatId
          )
            return chat;


          return {

            ...chat,

            messages:
              chat.messages.map(
                (msg) =>

                  msg.id === aiMessageId

                    ? {
                        ...msg,
                        message:
                          "❌ Something went wrong while generating the response.",
                      }

                    : msg
              ),

          };

        })

      );

    }

  } finally {

    setIsThinking(false);

  }

}