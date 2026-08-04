import SlideCard
  from "./SlideCard";



export default function SlidePreview({

  slides = [],

}) {


  return (

    <div

      className="
        rounded-2xl
        border
        border-[#20263B]
        bg-[#0D1322]
        p-6
      "

    >


      <h2

        className="
          mb-5
          text-xl
          font-semibold
          text-white
        "

      >

        Slide Preview

      </h2>





      {
        slides.length === 0

        ?

        (

          <div

            className="
              flex
              min-h-[350px]
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-[#303A55]
              text-gray-500
            "

          >

            Generated slides will appear here

          </div>

        )


        :


        (

          <div

            className="
              space-y-4
            "

          >

            {
              slides.map(

                (slide,index)=>(

                  <SlideCard

                    key={index}

                    slide={slide}

                    index={index}

                  />

                )

              )
            }


          </div>

        )

      }



    </div>

  );

}