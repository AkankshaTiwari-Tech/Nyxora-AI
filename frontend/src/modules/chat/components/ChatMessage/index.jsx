import { useEffect, useState } from "react";
import {
  FileText,
  File,
} from "lucide-react";

import MessageAvatar from "./MessageAvatar";
import MessageToolbar from "./MessageToolbar";
import ThinkingIndicator from "./ThinkingIndicator";
import MessageContent from "./MessageContent";


export default function ChatMessage({
  message,
  thinking = false,
  onRegenerate,
  onEdit,
}) {

  const {
    id,
    role,
    message: text,
    file,
  } = message;


  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    editing,
    setEditing,
  ] = useState(false);


  const [
    editedText,
    setEditedText,
  ] = useState(text);


  useEffect(() => {

    setEditedText(text);

  }, [text]);


  const copyMessage = async () => {

    try {

      await navigator.clipboard.writeText(
        text
      );


      setCopied(true);


      setTimeout(() => {

        setCopied(false);

      },2000);


    } catch(error){

      console.error(error);

    }

  };


  const handleSave = () => {

    if(!editedText.trim())
      return;


    setEditing(false);


    onEdit?.(
      id,
      editedText
    );

  };


  const getFileIcon = () => {

    if(
      file?.type ===
      "application/pdf"
    ){

      return (
        <FileText
          size={22}
          className="text-red-400"
        />
      );

    }


    return (
      <File
        size={22}
        className="text-blue-400"
      />
    );

  };


  return (

    <div
      className={`flex gap-4 ${
        role==="user"
          ? "justify-end"
          : "justify-start"
      }`}
    >

      {
        role==="assistant" && (
          <MessageAvatar role={role}/>
        )
      }


      <div
        className={`max-w-[85%] rounded-3xl px-6 py-5 shadow-md ${
          role==="assistant"
          ? "bg-[#111827] text-gray-100"
          : "bg-violet-600 text-white"
        }`}
      >


        {
          thinking ? (

            <ThinkingIndicator/>

          ) : editing ? (


            <div className="space-y-4">


              <textarea

                rows={4}

                value={editedText}

                onChange={(e)=>
                  setEditedText(
                    e.target.value
                  )
                }

                className="w-full resize-none rounded-xl bg-[#111827] p-4 text-white outline-none"

              />


              <div className="flex justify-end gap-3">


                <button

                  onClick={()=>
                    setEditing(false)
                  }

                  className="rounded-lg border border-slate-600 px-4 py-2"

                >
                  Cancel
                </button>


                <button

                  onClick={handleSave}

                  className="rounded-lg bg-violet-600 px-4 py-2"

                >
                  Save
                </button>


              </div>


            </div>


          ) : (


            <>


              {
                file && (

                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-black/20 p-3">


                    {getFileIcon()}


                    <div>

                      <p className="text-sm font-medium">
                        {file.name}
                      </p>


                      <p className="text-xs text-gray-400">
                        {file.type}
                      </p>

                    </div>


                  </div>

                )
              }



              <MessageContent
                message={text}
              />



              <MessageToolbar

                copied={copied}

                onCopy={copyMessage}


                onRegenerate={
                  role==="assistant"
                    ? onRegenerate
                    : undefined
                }


                onEdit={
                  role==="user"
                    ? ()=>
                      setEditing(true)
                    : undefined
                }

              />


            </>


          )

        }


      </div>



      {
        role==="user" && (

          <MessageAvatar role={role}/>

        )
      }


    </div>

  );

}