import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


// ======================================================
// GEMINI IMAGE GENERATION
// ======================================================

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        prompt
      } = req.body;


      if(!prompt){

        return res.status(400).json({

          success:false,

          message:
            "Image prompt required."

        });

      }



      const response =
        await fetch(

          "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key="

          +

          process.env.GEMINI_API_KEY,

          {

            method:"POST",

            headers:{

              "Content-Type":
                "application/json",

            },


            body:JSON.stringify({

              instances:[

                {

                  prompt

                }

              ],


              parameters:{

                sampleCount:1,

              }

            })


          }

        );





      const data =
        await response.json();





      if(!response.ok){

        console.error(data);


        return res.status(500).json({

          success:false,

          message:
            "Gemini image generation failed."

        });

      }





      const imageData =

        data
        ?.predictions
        ?. [0]
        ?.bytesBase64Encoded;





      if(!imageData){

        return res.status(500).json({

          success:false,

          message:
            "No image returned."

        });

      }






      res.json({

        success:true,


        image:

          `data:image/png;base64,${imageData}`


      });



    }

    catch(error){


      console.error(

        "Image generation error:",

        error

      );


      res.status(500).json({

        success:false,

        message:
          error.message

      });


    }


  }

);



export default router;