import {
  Bot,
  FileText,
  FileDown,
  ClipboardList,
  Presentation,
  FileSpreadsheet,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


export default function AITools() {

  const navigate =
    useNavigate();


  const tools = [
    {
      title: "AI Chat",
      icon: Bot,
      path: "/chat",
    },

    {
      title: "Notes Generator",
      icon: FileText,
      path: "/workspace",
    },

    {
      title: "PDF Generator",
      icon: FileDown,
      path: "/workspace",
    },

    {
      title: "Test Generator",
      icon: ClipboardList,
      path: "/chat",
    },

    {
      title: "Presentation",
      icon: Presentation,
      path: "/workspace",
    },

    {
      title: "Spreadsheet",
      icon: FileSpreadsheet,
      path: "/workspace",
    },
  ];


  return (

    <div className="mt-10">

      <h2 className="mb-5 text-2xl font-bold text-white">
        AI Tools
      </h2>


      <div
        className="
          grid
          grid-cols-2
          gap-5
          md:grid-cols-3
          xl:grid-cols-6
        "
      >

        {tools.map(
          (tool) => {

            const Icon =
              tool.icon;


            return (

              <button
                key={tool.title}
                type="button"
                onClick={() =>
                  navigate(
                    tool.path
                  )
                }
                className="
                  rounded-2xl
                  border
                  border-[#20283A]
                  bg-[#151B2F]
                  p-5
                  text-left
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:border-indigo-500/30
                  hover:bg-[#1B2340]
                "
              >

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-600
                    text-white
                  "
                >
                  <Icon size={28} />
                </div>


                <h3
                  className="
                    mt-4
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  {tool.title}
                </h3>

              </button>

            );

          }
        )}

      </div>

    </div>

  );

}