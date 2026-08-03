import {
  MessageSquarePlus,
  FileText,
  FileDown,
  ClipboardList,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


export default function QuickActions() {

  const navigate =
    useNavigate();


  const actions = [

    {
      title: "New Chat",

      description:
        "Start a new AI conversation",

      icon:
        MessageSquarePlus,

      action: () =>
        navigate(
          "/chat",
          {
            state: {
              createNewChat: true,
            },
          }
        ),
    },


    {
      title: "Create Note",

      description:
        "Create a Workspace note",

      icon:
        FileText,

      action: () =>
        navigate(
          "/workspace"
        ),
    },


    {
      title: "Generate PDF",

      description:
        "Create a downloadable document",

      icon:
        FileDown,

      action: () =>
        navigate(
          "/workspace"
        ),
    },


    {
      title: "Create Test",

      description:
        "Generate a test with Nyxora AI",

      icon:
        ClipboardList,

      action: () =>
        navigate(
          "/chat",
          {
            state: {
              createNewChat: true,
              assistantMode: "test",
            },
          }
        ),
    },

  ];


  return (

    <div className="mt-10">

      <h2 className="mb-5 text-2xl font-bold text-white">
        Quick Actions
      </h2>


      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {actions.map(
          (action) => {

            const Icon =
              action.icon;


            return (

              <button
                key={
                  action.title
                }
                type="button"
                onClick={
                  action.action
                }
                className="
                  rounded-2xl
                  border
                  border-[#20283A]
                  bg-[#151B2F]
                  p-6
                  text-left
                  transition-all
                  duration-300
                  hover:scale-[1.02]
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
                  <Icon
                    size={28}
                  />
                </div>


                <h3
                  className="
                    mt-5
                    text-xl
                    font-semibold
                    text-white
                  "
                >
                  {action.title}
                </h3>


                <p
                  className="
                    mt-2
                    text-gray-400
                  "
                >
                  {action.description}
                </p>

              </button>

            );

          }
        )}

      </div>

    </div>

  );

}