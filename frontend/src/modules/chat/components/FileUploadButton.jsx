import { Paperclip } from "lucide-react";

export default function FileUploadButton({
  onSelect,
}) {

  const handleChange = (event) => {

    const file =
      event.target.files?.[0];


    if (!file)
      return;


    onSelect(file);


    event.target.value = "";

  };


  return (

    <label
      className="
        flex
        h-11
        w-11
        cursor-pointer
        items-center
        justify-center
        rounded-xl
        text-gray-400
        transition
        hover:bg-[#1b2236]
        hover:text-white
      "
    >

      <Paperclip size={20}/>


      <input

        type="file"

        className="hidden"

        accept="
          .pdf,
          .doc,
          .docx,
          .txt,
          .md,
          image/png,
          image/jpeg,
          image/jpg,
          image/webp
        "

        onChange={handleChange}

      />

    </label>

  );
}