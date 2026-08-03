import {
  FileText,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getDocumentTypeIcon,
  getDocumentTypeLabel,
} from "../../workspace/utils/workspaceDocument";


function formatDate(
  timestamp
) {

  if (!timestamp) {
    return "";
  }


  try {

    const date =
      timestamp?.toDate
        ? timestamp.toDate()
        : new Date(timestamp);


    return date.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  } catch {

    return "";

  }

}


export default function RecentFiles({
  documents = [],
}) {

  const navigate =
    useNavigate();


  const recentDocuments =
    [...documents]
      .sort((a, b) => {

        const aTime =
          a.updatedAt?.toMillis?.() ||
          a.createdAt?.toMillis?.() ||
          0;


        const bTime =
          b.updatedAt?.toMillis?.() ||
          b.createdAt?.toMillis?.() ||
          0;


        return bTime - aTime;

      })
      .slice(
        0,
        4
      );


  return (

    <div className="mt-10">

      <div
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >

        <h2 className="text-2xl font-bold text-white">
          Recent Files
        </h2>


        <button
          type="button"
          onClick={() =>
            navigate(
              "/workspace"
            )
          }
          className="
            text-indigo-400
            transition
            hover:text-indigo-300
          "
        >
          View All
        </button>

      </div>


      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[#20283A]
          bg-[#151B2F]
        "
      >

        {recentDocuments.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-6
              py-12
              text-center
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-indigo-500/10
                text-indigo-400
              "
            >
              <FileText size={22} />
            </div>


            <h3 className="mt-4 font-semibold text-white">
              No files yet
            </h3>


            <p
              className="
                mt-2
                max-w-sm
                text-sm
                text-gray-500
              "
            >
              Documents you create or save from Nyxora AI
              will appear here.
            </p>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/workspace"
                )
              }
              className="
                mt-5
                rounded-xl
                bg-indigo-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                hover:bg-indigo-500
              "
            >
              Open Workspace
            </button>

          </div>

        ) : (

          recentDocuments.map(
            (document) => (

              <button
                key={document.id}
                type="button"
                onClick={() =>
                  navigate(
                    "/workspace"
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-[#232B45]
                  px-6
                  py-5
                  text-left
                  transition
                  last:border-none
                  hover:bg-[#1B2340]
                "
              >

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-indigo-600
                      text-xl
                    "
                  >
                    {getDocumentTypeIcon(
                      document.type
                    )}
                  </div>


                  <div className="min-w-0">

                    <h3
                      className="
                        truncate
                        font-semibold
                        text-white
                      "
                    >
                      {document.title}
                    </h3>


                    <p className="mt-1 text-sm text-gray-400">
                      {getDocumentTypeLabel(
                        document.type
                      )}
                    </p>

                  </div>

                </div>


                <span
                  className="
                    shrink-0
                    text-sm
                    text-gray-500
                  "
                >
                  {formatDate(
                    document.updatedAt ||
                    document.createdAt
                  )}
                </span>

              </button>

            )
          )

        )}

      </div>

    </div>

  );

}