import {
  Copy,
  Check,
  Pencil,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  FolderPlus,
} from "lucide-react";


export default function MessageToolbar({
  copied,

  onCopy,
  onRegenerate,
  onEdit,

  onSaveToWorkspace,

  role,
}) {

  return (

    <div
      className="
        mt-5
        flex
        items-center
        gap-4
        border-t
        border-slate-700
        pt-4
        text-gray-400
      "
    >

      {/* COPY */}

      <button
        type="button"

        onClick={
          onCopy
        }

        className="
          transition
          hover:text-white
        "

        title="Copy"
      >

        {copied ? (

          <Check size={18} />

        ) : (

          <Copy size={18} />

        )}

      </button>


      {/* EDIT USER PROMPT */}

      {onEdit && (

        <button
          type="button"

          onClick={
            onEdit
          }

          className="
            transition
            hover:text-yellow-400
          "

          title="Edit Prompt"
        >

          <Pencil size={18} />

        </button>

      )}


      {/* REGENERATE AI RESPONSE */}

      {onRegenerate && (

        <button
          type="button"

          onClick={
            onRegenerate
          }

          className="
            transition
            hover:text-blue-400
          "

          title="Regenerate"
        >

          <RotateCcw size={18} />

        </button>

      )}


      {/* =============================================== */}
      {/* SAVE AI RESPONSE TO WORKSPACE                   */}
      {/* =============================================== */}

      {role === "assistant" &&
        onSaveToWorkspace && (

          <button
            type="button"

            onClick={
              onSaveToWorkspace
            }

            className="
              transition
              hover:text-violet-400
            "

            title="Save to Workspace"
          >

            <FolderPlus size={18} />

          </button>

        )}


      {/* LIKE */}

      <button
        type="button"

        className="
          transition
          hover:text-green-400
        "

        title="Like"
      >

        <ThumbsUp size={18} />

      </button>


      {/* DISLIKE */}

      <button
        type="button"

        className="
          transition
          hover:text-red-400
        "

        title="Dislike"
      >

        <ThumbsDown size={18} />

      </button>

    </div>

  );

}