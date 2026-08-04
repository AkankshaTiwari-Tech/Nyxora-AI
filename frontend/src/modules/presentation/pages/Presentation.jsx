import {
  Presentation as PresentationIcon,
  Sparkles,
  AlertCircle,
} from "lucide-react";


import {
  useEffect,
  useState,
} from "react";


import PresentationForm
  from "../components/PresentationForm";


import SlidePreview
  from "../components/SlidePreview";


import {
  generatePresentation,
} from "../services/presentationService";


import {
  exportPresentationToPpt,
} from "../services/pptExportService";


import {
  saveWorkspacePresentation,
  getLatestWorkspacePresentation,
} from "../services/presentationWorkspaceService";


import {
  auth,
} from "../../../firebase/firebase";


import NyxoraButton
  from "../../../components/common/NyxoraButton";






export default function Presentation() {



  const [

    slides,

    setSlides,

  ] = useState([]);





  const [

    title,

    setTitle,

  ] = useState("");





  const [

    theme,

    setTheme,

  ] = useState(

    "nyxoraPremium"

  );





  const [

    loading,

    setLoading,

  ] = useState(false);





  const [

    error,

    setError,

  ] = useState("");







  const [

    presentationId,

    setPresentationId,

  ] = useState(null);








  useEffect(()=>{


    loadWorkspacePresentation();



  },[]);








  async function loadWorkspacePresentation(){



    try {



      const user =

        auth.currentUser;





      if(!user){


        return;


      }







      const saved =

        await getLatestWorkspacePresentation({

          userId:

            user.uid,

        });







      if(saved){



        setPresentationId(

          saved.id

        );




        setTitle(

          saved.title ||

          ""

        );





        setSlides(

          saved.slides ||

          []

        );





        setTheme(

          saved.theme ||

          "nyxoraPremium"

        );



      }



    }

    catch(error){



      console.error(

        "Workspace load failed:",

        error

      );



    }



  }
    async function handleGenerate(data){


    try {


      setLoading(true);

      setError("");

      setSlides([]);







      setTheme(

        data.theme

      );







      const result =

        await generatePresentation({



          topic:

            data.topic,



          subject:

            data.subject,



          className:

            data.className,



          slideCount:

            data.slideCount,



          theme:

            data.theme,



          customPrompt:

            data.customPrompt,



        });







      const generatedTitle =

        result.title ||

        data.topic;








      const generatedSlides =

        result.slides ||

        [];








      setTitle(

        generatedTitle

      );







      setSlides(

        generatedSlides

      );







      // ==================================================
      // SAVE TO NYXORA WORKSPACE
      //
      // Generate
      //    ↓
      // Firestore Workspace
      //
      // ==================================================



      const user =

        auth.currentUser;






      if(user){



        const savedId =

          await saveWorkspacePresentation({



            userId:

              user.uid,



            title:

              generatedTitle,



            topic:

              data.topic,



            slides:

              generatedSlides,



            theme:

              data.theme,



          });






        setPresentationId(

          savedId

        );



      }






    }

    catch(error){



      console.error(

        "Presentation generation failed:",

        error

      );






      setError(


        error.message ||

        "Unable to generate presentation."


      );



    }

    finally {



      setLoading(false);



    }



  }









  function handleExport(){



    if(

      slides.length === 0

    ){


      return;


    }







    exportPresentationToPpt({



      presentation:{



        title,



        slides,



      },



      themeName:

        theme,



    });



  }
    return (



    <div


      className="
        min-h-full
        bg-[#050816]
        p-6
        text-white
      "


    >







      <div


        className="
          mb-8
          flex
          items-center
          gap-4
        "


      >




        <div


          className="
            rounded-xl
            bg-indigo-500/20
            p-3
          "


        >



          <PresentationIcon


            size={30}


            className="
              text-indigo-400
            "


          />



        </div>








        <div>



          <h1


            className="
              text-3xl
              font-bold
            "


          >


            Presentation Generator



          </h1>







          <p


            className="
              mt-1
              text-gray-400
            "


          >


            Create AI designed presentations with Nyxora AI



          </p>




        </div>





      </div>









      {


        error && (



          <div



            className="
              mb-6
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              p-4
              text-red-300
            "



          >




            <AlertCircle size={18}/>





            {error}





          </div>




        )


      }









      <div


        className="
          grid
          gap-6
          lg:grid-cols-2
        "


      >







        {/* LEFT SIDE */}




        <div>





          <PresentationForm



            onGenerate={

              handleGenerate

            }



            loading={

              loading

            }




          />





        </div>












        {/* RIGHT SIDE */}





        <div>







          {


            title && (



              <div




                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-[#20263B]
                  bg-[#0D1322]
                  p-4
                "




              >







                <div



                  className="
                    flex
                    items-center
                    gap-2
                    font-semibold
                  "



                >





                  <Sparkles



                    size={18}



                    className="
                      text-indigo-400
                    "



                  />





                  {title}





                </div>
                                <NyxoraButton



                  onClick={

                    handleExport

                  }




                  className="

                    px-4

                    py-2

                    text-sm

                  "



                >




                  Export PPTX




                </NyxoraButton>






              </div>




            )



          }












          <SlidePreview



            slides={

              slides

            }



          />






        </div>








      </div>







    </div>



  );



}