import {
  Sparkles,
  WandSparkles,
} from "lucide-react";


import {
  useState,
} from "react";


import NyxoraButton
  from "../../../components/common/NyxoraButton";





const promptPresets = {


  Academic:

    "Create a detailed academic presentation. Include definitions, diagrams, examples, important concepts and a conclusion slide.",


  Professional:

    "Create a professional business-style presentation with clean structure, modern visuals, real-world examples and key insights.",


  Startup:

    "Create a startup pitch style presentation with problem, solution, market impact, innovation and future scope.",


  Visual:

    "Create a highly visual presentation with minimal text, diagrams, infographics and modern AI-style designs.",


};





export default function PresentationForm({

  onGenerate,

  loading,

}) {


  const [

    topic,

    setTopic,

  ] = useState("");



  const [

    subject,

    setSubject,

  ] = useState("");



  const [

    className,

    setClassName,

  ] = useState("");



  const [

    slideCount,

    setSlideCount,

  ] = useState(10);



  const [

    customPrompt,

    setCustomPrompt,

  ] = useState("");





  // ====================================================
  // GENERATE
  //
  // Presentation theme selection has been removed.
  // Nyxora Premium is handled internally by the
  // Presentation page / PPT export engine.
  // ====================================================

  function handleSubmit(e) {


    e.preventDefault();


    onGenerate({


      topic,

      subject,

      className,

      slideCount,

      customPrompt,


    });


  }





  return (

    <form

      onSubmit={handleSubmit}


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
          mb-6
          text-xl
          font-semibold
          text-white
        "

      >

        Presentation Details

      </h2>



      <Input

        label="Topic"

        value={topic}

        setValue={setTopic}

        placeholder="Example: Photosynthesis"

      />



      <Input

        label="Subject"

        value={subject}

        setValue={setSubject}

        placeholder="Example: Science"

      />



      <Input

        label="Class"

        value={className}

        setValue={setClassName}

        placeholder="Example: Class 8"

      />





      {/* =================================================
          NUMBER OF SLIDES
      ================================================= */}


      <div className="mb-5">


        <label

          className="
            mb-2
            block
            text-sm
            text-gray-400
          "

        >

          Number of Slides

        </label>



        <select

          value={slideCount}


          onChange={(e) =>

            setSlideCount(

              Number(e.target.value)

            )

          }


          className="
            w-full
            rounded-xl
            border
            border-[#303A55]
            bg-[#111827]
            px-4
            py-3
            text-white
          "

        >


          <option value={5}>
            5 Slides
          </option>


          <option value={10}>
            10 Slides
          </option>


          <option value={15}>
            15 Slides
          </option>


          <option value={20}>
            20 Slides
          </option>


        </select>


      </div>





      {/* =================================================
          AI DESIGN INSTRUCTIONS
      ================================================= */}


      <div

        className="
          mt-6
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          p-5
          shadow-lg
          shadow-violet-900/20
        "

      >


        <div

          className="
            mb-4
            flex
            items-center
            gap-3
          "

        >


          <div

            className="
              rounded-xl
              bg-violet-500/20
              p-2
            "

          >

            <WandSparkles

              size={20}

              className="
                text-violet-300
              "

            />

          </div>



          <div>


            <h3

              className="
                font-semibold
                text-white
              "

            >

              AI Design Instructions

            </h3>


            <p

              className="
                text-xs
                text-gray-400
              "

            >

              Guide Nyxora AI for better results

            </p>


          </div>


        </div>





        {/* =================================================
            PROMPT PRESETS
        ================================================= */}


        <div

          className="
            mb-4
            flex
            flex-wrap
            gap-2
          "

        >


          {

            Object.keys(promptPresets).map(

              (preset) => (


                <button

                  key={preset}

                  type="button"


                  onClick={() =>

                    setCustomPrompt(

                      promptPresets[preset]

                    )

                  }


                  className="
                    rounded-lg
                    border
                    border-violet-400/30
                    bg-violet-500/10
                    px-3
                    py-2
                    text-xs
                    text-violet-200
                    transition
                    hover:bg-violet-500/20
                  "

                >

                  {preset}

                </button>


              )

            )

          }


        </div>





        {/* =================================================
            CUSTOM AI PROMPT
        ================================================= */}


        <textarea

          value={customPrompt}


          onChange={(e) =>

            setCustomPrompt(

              e.target.value

            )

          }


          placeholder="
Example:

Create a professional BCA presentation.
Add diagrams, examples, modern visuals and conclusion.
          "


          rows={6}


          className="
            w-full
            resize-none
            rounded-xl
            border
            border-white/10
            bg-black/20
            px-4
            py-3
            text-sm
            text-white
            outline-none
            placeholder:text-gray-500
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-500/20
          "

        />


      </div>





      {/* =================================================
          GENERATE BUTTON
      ================================================= */}


      <NyxoraButton

        type="submit"

        loading={loading}

        icon={Sparkles}

        className="
          mt-6
          w-full
          font-semibold
        "

      >


        {

          loading

            ?

            "Generating..."

            :

            "Generate Presentation"

        }


      </NyxoraButton>


    </form>

  );

}





// ======================================================
// REUSABLE INPUT
// ======================================================

function Input({

  label,

  value,

  setValue,

  placeholder,

}) {


  return (


    <div className="mb-4">


      <label

        className="
          mb-2
          block
          text-sm
          text-gray-400
        "

      >

        {label}

      </label>



      <input

        value={value}


        onChange={(e) =>

          setValue(

            e.target.value

          )

        }


        placeholder={placeholder}


        className="
          w-full
          rounded-xl
          border
          border-[#303A55]
          bg-[#111827]
          px-4
          py-3
          text-white
          outline-none
          focus:border-violet-500
          focus:ring-2
          focus:ring-violet-500/20
        "

      />


    </div>

  );

}