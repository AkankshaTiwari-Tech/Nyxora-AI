import {
  FileText,
  Sparkles,
  Download,
  Loader2,
  Save,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  generateResponse,
} from "../../chat/services/geminiService";

import {
  downloadWorkspacePdf,
} from "../../workspace/documents/pdfs/generatePdf";

import useWorkspace
  from "../../workspace/hooks/useWorkspace";



export default function Notes() {


  const {
    addAiDocument,
  } = useWorkspace();



  const [
    form,
    setForm,
  ] = useState({

    className: "",

    subject: "",

    chapter: "",

    topic: "",

  });



  const [
    generatedNotes,
    setGeneratedNotes,
  ] = useState("");



  const [
    loading,
    setLoading,
  ] = useState(false);



  const [
    saved,
    setSaved,
  ] = useState(false);





  const handleChange = (e)=>{

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };





  const generateNotes = async()=>{


    if(
      !form.topic &&
      !form.chapter
    ){

      return;

    }



    setLoading(true);

    setGeneratedNotes("");

    setSaved(false);



    const prompt = `

You are Nyxora AI Study Material Generator.

Create detailed exam oriented study notes.

Class:
${form.className}

Subject:
${form.subject}

Chapter:
${form.chapter}

Topic:
${form.topic}


Format:

# Topic Name

## Introduction

## Important Concepts

## Definitions

## Key Points

## Examples

## Summary

## Practice Questions


Make it clear and student friendly.

`;



    try {


      await generateResponse(

        prompt,


        (chunk)=>{

          setGeneratedNotes(
            chunk
          );

        }

      );


    } catch(error){


      console.error(
        error
      );


      setGeneratedNotes(
        "Failed to generate notes."
      );


    } finally {


      setLoading(false);


    }


  };






  const saveToWorkspace = async()=>{


    if(!generatedNotes){

      return;

    }



    await addAiDocument({

      title:
        form.topic ||
        "AI Generated Notes",


      type:
        "Study Material",


      subject:
        form.subject,


      chapter:
        form.chapter,


      className:
        form.className,


      content:
        generatedNotes,


      source:
        "Nyxora AI Notes Generator",


      status:
        "saved",

    });



    setSaved(true);


  };






  const exportPDF = async()=>{


    await downloadWorkspacePdf({

      title:
        form.topic ||
        "Study Material",


      type:
        "Study Material",


      subject:
        form.subject,


      chapter:
        form.chapter,


      content:
        generatedNotes,


    });


  };






  return (

    <div
      className="
        min-h-screen
        bg-[#070B18]
        p-6
        md:p-10
        text-white
      "
    >


      <div
        className="
          mb-10
          flex
          items-center
          gap-4
        "
      >

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-violet-500/10
            border
            border-violet-500/30
          "
        >

          <FileText
            size={28}
            className="text-violet-300"
          />

        </div>


        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            AI Notes Generator
          </h1>


          <p
            className="
              text-sm
              text-gray-400
            "
          >
            Generate and save study material with Nyxora AI
          </p>


        </div>


      </div>





      <div
        className="
          mb-8
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
        "
      >


        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >

          {
            [
              {
                name:"className",
                placeholder:"Class"
              },
              {
                name:"subject",
                placeholder:"Subject"
              },
              {
                name:"chapter",
                placeholder:"Chapter"
              },
              {
                name:"topic",
                placeholder:"Topic"
              },

            ].map((item)=>(


              <input

                key={item.name}

                name={item.name}

                value={form[item.name]}

                onChange={handleChange}

                placeholder={item.placeholder}

                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-[#0E1424]
                  px-4
                  py-3
                  outline-none
                  focus:border-violet-500
                "

              />


            ))
          }


        </div>



        <button

          onClick={generateNotes}

          disabled={loading}

          className="
            mt-6
            flex
            items-center
            gap-2
            rounded-xl
            bg-violet-600
            px-6
            py-3
            hover:bg-violet-500
          "

        >

          {
            loading ?

            <Loader2
              size={18}
              className="animate-spin"
            />

            :

            <Sparkles
              size={18}
            />

          }


          Generate Notes


        </button>


      </div>





      {
        generatedNotes && (


          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
            "
          >


            <div
              className="
                mb-6
                flex
                flex-wrap
                gap-3
              "
            >


              <button

                onClick={saveToWorkspace}

                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-emerald-600
                  px-4
                  py-2
                  text-sm
                  hover:bg-emerald-500
                "

              >

                <Save size={16}/>

                {
                  saved
                  ?
                  "Saved"
                  :
                  "Save Workspace"
                }


              </button>



              <button

                onClick={exportPDF}

                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-4
                  py-2
                  text-sm
                "

              >

                <Download size={16}/>

                Export PDF


              </button>


            </div>




            <div
              className="
                whitespace-pre-wrap
                leading-8
                text-gray-200
              "
            >

              {generatedNotes}

            </div>


          </div>


        )
      }


    </div>

  );

}