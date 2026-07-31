import { useState } from "react";
import {
  Send,
  Square,
  X,
} from "lucide-react";

import FileUploadButton from "./FileUploadButton";


export default function ChatInput({
  onSend,
  onStop,
  loading,
}) {

  const [message, setMessage] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);


  const handleSubmit = (e) => {

    e.preventDefault();


    if(
      !message.trim() &&
      !selectedFile
    )
      return;


    onSend({
      message,
      file:selectedFile,
    });


    setMessage("");

    setSelectedFile(null);

  };


  const removeFile = () => {

    setSelectedFile(null);

  };


  return (

    <div className="border-t border-slate-800 bg-[#050816] p-5">


      {
        selectedFile && (

          <div className="
            mb-3
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-slate-700
            bg-[#111827]
            px-4
            py-3
          ">

            <div>

              <p className="text-sm text-white">
                📎 {selectedFile.name}
              </p>

              <p className="text-xs text-gray-400">
                {selectedFile.type}
              </p>

            </div>


            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-white"
            >
              <X size={18}/>
            </button>


          </div>

        )
      }



      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-3"
      >


        <FileUploadButton
          onSelect={setSelectedFile}
        />



        <textarea

          rows={1}

          value={message}

          placeholder="Message Nyxora AI..."

          onChange={(e)=>
            setMessage(
              e.target.value
            )
          }

          className="
            flex-1
            resize-none
            rounded-2xl
            border
            border-slate-700
            bg-[#111827]
            px-4
            py-3
            text-white
            outline-none
            focus:border-violet-500
          "

        />



        {
          loading ? (

            <button

              type="button"

              onClick={onStop}

              className="
                rounded-xl
                bg-red-500
                p-3
                text-white
              "

            >

              <Square size={18}/>

            </button>


          ) : (


            <button

              type="submit"

              className="
                rounded-xl
                bg-violet-600
                p-3
                text-white
              "

            >

              <Send size={18}/>

            </button>

          )
        }


      </form>

    </div>

  );

}