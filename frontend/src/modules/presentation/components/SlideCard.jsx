import {
  Image,
  FileText,
  List,
  Network,
} from "lucide-react";



export default function SlideCard({

  slide,

  index,

}) {


  return (

    <div

      className="
        rounded-2xl
        border
        border-[#243047]
        bg-[#111827]
        p-5
        transition
        hover:border-indigo-500/50
      "

    >



      <div

        className="
          mb-4
          flex
          items-center
          justify-between
        "

      >


        <div>

          <p

            className="
              text-xs
              text-indigo-400
            "

          >

            Slide {index + 1}

          </p>


          <h3

            className="
              mt-1
              text-lg
              font-semibold
              text-white
            "

          >

            {slide.title || "Untitled Slide"}

          </h3>


        </div>



        <FileText

          size={22}

          className="
            text-violet-400
          "

        />


      </div>







      {
        slide.subtitle && (

          <p

            className="
              mb-4
              text-sm
              text-gray-400
            "

          >

            {slide.subtitle}

          </p>

        )
      }







      {
        slide.points &&
        slide.points.length > 0 && (

          <div

            className="
              mb-5
            "

          >

            <div

              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                text-gray-300
              "

            >

              <List size={16}/>

              Key Points

            </div>



            <ul

              className="
                space-y-2
                text-sm
                text-gray-400
              "

            >

              {
                slide.points.map(

                  (point,pointIndex)=>(

                    <li

                      key={pointIndex}

                      className="
                        flex
                        gap-2
                      "

                    >

                      <span
                        className="
                          text-indigo-400
                        "
                      >
                        •
                      </span>


                      {point}


                    </li>

                  )

                )
              }


            </ul>


          </div>

        )
      }








      {
        slide.imageSuggestion && (

          <div

            className="
              mb-4
              rounded-xl
              border
              border-[#243047]
              bg-[#0F172A]
              p-3
            "

          >


            <div

              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                text-cyan-300
              "

            >

              <Image size={16}/>

              Image Suggestion

            </div>



            <p

              className="
                text-sm
                text-gray-400
              "

            >

              {slide.imageSuggestion}

            </p>


          </div>

        )
      }









      {
        slide.diagramSuggestion && (

          <div

            className="
              rounded-xl
              border
              border-[#243047]
              bg-[#0F172A]
              p-3
            "

          >


            <div

              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                text-violet-300
              "

            >

              <Network size={16}/>

              Diagram Suggestion

            </div>




            <p

              className="
                text-sm
                text-gray-400
              "

            >

              {slide.diagramSuggestion}

            </p>


          </div>

        )
      }







    </div>

  );

}