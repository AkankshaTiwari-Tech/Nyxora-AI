let controller = null;


// Convert image file to base64

async function fileToBase64(file) {

  return new Promise((resolve, reject) => {

    const reader =
      new FileReader();


    reader.onload = () => {

      const base64 =
        reader.result.split(",")[1];

      resolve(base64);

    };


    reader.onerror = reject;


    reader.readAsDataURL(file);

  });

}



export async function generateResponse(
  prompt,
  onChunk,
  file = null,
  history = []
) {

  controller =
    new AbortController();


  let image = null;


  if (
    file &&
    file.type.startsWith("image/")
  ) {

    const base64 =
      await fileToBase64(file);


    image = {

      data: base64,

      mimeType:
        file.type,

    };

  }



  const response =
    await fetch(
      "http://localhost:5000/api/chat",
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json",
        },


        body:JSON.stringify({

          message:prompt,

          image,

          history,

        }),


        signal:
          controller.signal,

      }
    );



  if(!response.ok){

    throw new Error(
      "Failed to connect to AI server."
    );

  }



  if(!response.body){

    throw new Error(
      "Streaming is not supported."
    );

  }



  const reader =
    response.body.getReader();


  const decoder =
    new TextDecoder();


  let fullResponse = "";



  try {

    while(true){

      const {
        done,
        value
      } =
      await reader.read();



      if(done)
        break;



      const chunk =
        decoder.decode(
          value,
          {
            stream:true,
          }
        );



      fullResponse += chunk;



      if(onChunk){

        onChunk(
          fullResponse
        );

      }

    }


    return fullResponse;



  } finally {

    controller = null;

  }

}



export function stopGeneration(){

  if(controller){

    controller.abort();

    controller = null;

  }

}