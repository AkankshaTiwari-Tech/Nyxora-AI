import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";


const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "classes",
    label: "Classes",
    icon: BookOpen,
  },
  {
    id: "students",
    label: "Students",
    icon: Users,
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
  },
];


export default function WorkspaceHeader({
  activeTab,
  onTabChange,
  onCreate,
}) {

  return (

    <div
      className="
        border-b
        border-[#20263B]
        bg-[#050816]
      "
    >

      {/* TOP */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          px-6
          py-5
          lg:px-8
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-violet-400
            "
          >
            <Sparkles size={15} />

            Nyxora Workspace
          </div>


          <h1
            className="
              mt-1
              text-2xl
              font-semibold
              text-white
            "
          >
            Teaching Workspace
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Classes, students and AI-generated learning resources.
          </p>

        </div>


        <button
          type="button"
          onClick={onCreate}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-violet-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-violet-500
          "
        >
          <Plus size={17} />

          Create
        </button>

      </div>


      {/* NAVIGATION */}

      <div
        className="
          flex
          gap-1
          overflow-x-auto
          px-6
          lg:px-8
        "
      >

        {tabs.map((tab) => {

          const Icon =
            tab.icon;

          const active =
            activeTab === tab.id;


          return (

            <button
              key={tab.id}
              type="button"
              onClick={() =>
                onTabChange(tab.id)
              }
              className={`
                flex
                shrink-0
                items-center
                gap-2
                border-b-2
                px-4
                py-3
                text-sm
                font-medium
                transition

                ${
                  active
                    ? `
                      border-violet-500
                      text-violet-300
                    `
                    : `
                      border-transparent
                      text-gray-500
                      hover:text-gray-200
                    `
                }
              `}
            >
              <Icon size={17} />

              {tab.label}
            </button>

          );

        })}

      </div>

    </div>

  );

}