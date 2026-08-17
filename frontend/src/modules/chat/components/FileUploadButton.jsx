import {
  Paperclip,
} from "lucide-react";


export default function FileUploadButton({
  onSelect,
}) {


  const handleChange =
    (
      event
    ) => {

      const files =
        Array.from(
          event.target.files ||
          []
        );


      if (
        files.length ===
        0
      ) {

        return;

      }


      // ====================================================
      // KEEP BACKWARD COMPATIBILITY
      //
      // The first argument remains the first selected file
      // so the current single-file ChatInput continues to
      // work until we update it in the next step.
      //
      // The second argument contains all selected files.
      // ====================================================

      onSelect(
        files[0],
        files
      );


      // Allow selecting the same file again.

      event.target.value =
        "";

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

      <Paperclip
        size={20}
      />


      <input

        type="file"

        className="hidden"

        multiple

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

        onChange={
          handleChange
        }

      />

    </label>

  );

}