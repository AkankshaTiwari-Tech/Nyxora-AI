import {
  Palette,
} from "lucide-react";

import presentationThemes
  from "../utils/presentationThemes";



export default function ThemeSelector({

  value,

  onChange,

}) {


  const themes =
    Object.entries(
      presentationThemes
    );



  return (

    <div>

      <label

        className="
          mb-2
          flex
          items-center
          gap-2
          text-sm
          text-gray-400
        "

      >

        <Palette size={16}/>

        Presentation Theme

      </label>




      <div

        className="
          grid
          gap-3
          sm:grid-cols-3
        "

      >


        {
          themes.map(

            ([key,theme]) => (

              <button

                key={key}

                type="button"

                onClick={() =>
                  onChange(key)
                }

                className={`
                  rounded-xl
                  border
                  p-3
                  text-left
                  transition

                  ${
                    value === key
                    ?
                    "border-indigo-500 bg-indigo-500/10"
                    :
                    "border-[#303A55] bg-[#111827] hover:border-indigo-400/50"
                  }
                `}

              >


                <div

                  className="
                    mb-3
                    h-10
                    rounded-lg
                  "

                  style={{

                    background:

                      `linear-gradient(
                        135deg,
                        ${theme.colors.primary},
                        ${theme.colors.secondary}
                      )`

                  }}

                />



                <p

                  className="
                    text-sm
                    font-medium
                    text-white
                  "

                >

                  {theme.name}

                </p>



                <p

                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "

                >

                  {theme.description}

                </p>


              </button>

            )

          )
        }


      </div>


    </div>

  );

}