import {
  Copy,
  Download,
  FileText,
  Pencil,
  Trash2,
  Eye,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  downloadWorkspacePdf,
} from "../documents/pdfs/generatePdf";

import {
  getDocumentTypeIcon,
  getDocumentTypeLabel,
} from "../utils/workspaceDocument";


export default function WorkspaceDocumentCard({
  document,
  classItem,
  student,
  onEdit,
  onDelete,
}) {


  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    viewerOpen,
    setViewerOpen,
  ] = useState(false);




  async function copyDocument() {

    try {

      await navigator.clipboard.writeText(
        document.content || ""
      );


      setCopied(true);


      setTimeout(
        () => {

          setCopied(false);

        },
        1600
      );


    } catch (error) {

      console.error(
        "Document copy failed:",
        error
      );

    }

  }





  function downloadPdf() {

    downloadWorkspacePdf({

      ...document,

      className:
        classItem?.name || "",

      studentName:
        student?.name || "",

    });

  }





  return (

    <>

      <article
        className="
          rounded-2xl
          border
          border-[#242D43]
          bg-[#0D1322]
          p-5
          transition
          hover:border-[#343E58]
        "
      >


        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >


          <div className="min-w-0">


            <div
              className="
                mb-3
                flex
                flex-wrap
                items-center
                gap-2
              "
            >


              <span
                className="
                  rounded-lg
                  bg-violet-500/10
                  px-2.5
                  py-1
                  text-xs
                  text-violet-300
                "
              >

                {getDocumentTypeIcon(
                  document.type
                )}

                {" "}

                {getDocumentTypeLabel(
                  document.type
                )}

              </span>



              {
                document.source === "ai" && (

                  <span
                    className="
                      rounded-lg
                      bg-blue-500/10
                      px-2.5
                      py-1
                      text-xs
                      text-blue-300
                    "
                  >

                    AI Generated

                  </span>

                )
              }


            </div>




            <h3
              className="
                truncate
                font-semibold
                text-white
              "
            >

              {document.title}

            </h3>




            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >

              {
                [
                  document.subject,
                  document.chapter,
                  classItem?.name,
                  student?.name,
                ]
                .filter(Boolean)
                .join(" • ")
                ||
                "No additional information"
              }

            </p>


          </div>



          <FileText
            size={22}
            className="
              shrink-0
              text-violet-400
            "
          />


        </div>





        <p
          className="
            mt-4
            line-clamp-4
            whitespace-pre-line
            text-sm
            leading-6
            text-gray-400
          "
        >

          {
            document.content ||
            "No content"
          }

        </p>





        <div
          className="
            mt-5
            flex
            flex-wrap
            gap-2
          "
        >



          <Action
            onClick={() =>
              setViewerOpen(true)
            }
          >

            <Eye size={14}/>

            Open

          </Action>





          <Action
            onClick={downloadPdf}
          >

            <Download size={14}/>

            PDF

          </Action>





          <Action
            onClick={copyDocument}
          >

            <Copy size={14}/>

            {
              copied
              ?
              "Copied"
              :
              "Copy"
            }

          </Action>





          <Action
            onClick={() =>
              onEdit(document)
            }
          >

            <Pencil size={14}/>

            Edit

          </Action>





          <Action
            danger
            onClick={() =>
              onDelete(document)
            }
          >

            <Trash2 size={14}/>

            Delete

          </Action>



        </div>


      </article>





      {
        viewerOpen && (

          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/70
              p-5
            "
          >


            <div
              className="
                max-h-[85vh]
                w-full
                max-w-4xl
                overflow-y-auto
                rounded-3xl
                border
                border-white/10
                bg-[#0D1322]
                p-6
              "
            >



              <div
                className="
                  mb-5
                  flex
                  items-center
                  justify-between
                "
              >


                <h2
                  className="
                    text-xl
                    font-semibold
                    text-white
                  "
                >

                  {document.title}

                </h2>




                <button

                  onClick={() =>
                    setViewerOpen(false)
                  }

                  className="
                    rounded-lg
                    p-2
                    text-gray-400
                    hover:bg-white/10
                    hover:text-white
                  "

                >

                  <X size={20}/>

                </button>


              </div>





              <div
                className="
                  whitespace-pre-wrap
                  leading-8
                  text-gray-200
                "
              >

                {
                  document.content ||
                  "No content available."
                }

              </div>



            </div>



          </div>

        )
      }



    </>

  );

}





function Action({
  children,
  onClick,
  danger = false,
}) {


  return (

    <button

      type="button"

      onClick={onClick}

      className={`
        flex
        items-center
        gap-2
        rounded-lg
        border
        px-3
        py-2
        text-xs
        transition

        ${
          danger

          ?

          "border-red-500/20 text-red-400 hover:bg-red-500/10"

          :

          "border-[#303A55] text-gray-300 hover:border-violet-500/50 hover:text-white"

        }
      `}

    >

      {children}

    </button>

  );

}