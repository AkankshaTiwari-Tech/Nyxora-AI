let controller = null;


// ======================================================
// FILE TO BASE64
// ======================================================

async function fileToBase64(file) {

  return new Promise((resolve, reject) => {

    const reader =
      new FileReader();


    reader.onload = () => {

      const base64 =
        reader.result.split(",")[1];

      resolve(base64);

    };


    reader.onerror =
      reject;


    reader.readAsDataURL(file);

  });

}


// ======================================================
// GENERATE RESPONSE
// ======================================================

export async function generateResponse(

  prompt,

  onChunk,

  file = null,

  history = [],

  userId = null,

  memory = null,

  memoryMessage = null

) {

  controller =
    new AbortController();


  // ====================================================
  // PREPARE IMAGE
  // ====================================================

  let image = null;


  if (
    file &&
    file.type.startsWith("image/")
  ) {

    const base64 =
      await fileToBase64(file);


    image = {

      data:
        base64,

      mimeType:
        file.type,

    };

  }


  // ====================================================
  // SEND REQUEST
  // ====================================================

  const response =
    await fetch(

      "http://localhost:5000/api/chat",

      {

        method:
          "POST",


        headers: {

          "Content-Type":
            "application/json",

        },


        body:
          JSON.stringify({

            // Full internal prompt used
            // for AI generation.
            message:
              prompt,

            // Clean original user message
            // used by backend memory.
            memoryMessage:
              memoryMessage ??
              prompt,

            image,

            history,

            userId,

            memory,

          }),


        signal:
          controller.signal,

      }

    );


  // ====================================================
  // HANDLE HTTP ERROR
  // ====================================================

  if (!response.ok) {

    let errorMessage =
      "Failed to connect to AI server.";


    try {

      const errorText =
        await response.text();


      if (errorText) {

        errorMessage =
          errorText;

      }

    } catch {

      // Keep default error.

    }


    throw new Error(
      errorMessage
    );

  }


  // ====================================================
  // STREAM VALIDATION
  // ====================================================

  if (!response.body) {

    throw new Error(
      "Streaming is not supported."
    );

  }


  const reader =
    response.body.getReader();


  const decoder =
    new TextDecoder();


  let fullResponse = "";


  // ====================================================
  // READ STREAM
  // ====================================================

  try {

    while (true) {

      const {
        done,
        value,
      } =
        await reader.read();


      if (done) {

        break;

      }


      const chunk =
        decoder.decode(

          value,

          {
            stream: true,
          }

        );


      fullResponse +=
        chunk;


      if (onChunk) {

        onChunk(
          fullResponse
        );

      }

    }


    // Flush remaining decoder data.

    const remaining =
      decoder.decode();


    if (remaining) {

      fullResponse +=
        remaining;


      if (onChunk) {

        onChunk(
          fullResponse
        );

      }

    }


    return fullResponse;

  }


  finally {

    controller = null;

  }

}


// ======================================================
// STOP GENERATION
// ======================================================

export function stopGeneration() {

  if (controller) {

    controller.abort();

    controller = null;

  }

}