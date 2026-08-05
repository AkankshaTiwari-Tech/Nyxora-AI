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
        relative
        overflow-hidden
        border-b
        border-white/[0.07]
        bg-[#070B17]/90
        backdrop-blur-xl
      "
    >

      {/* ================================================
          HEADER AMBIENT EFFECTS
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          -top-32
          h-72
          w-72
          rounded-full
          bg-fuchsia-600/[0.08]
          blur-[110px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          right-[10%]
          -top-36
          h-72
          w-72
          rounded-full
          bg-cyan-500/[0.07]
          blur-[110px]
        "
      />


      {/* ================================================
          TOP SECTION
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          flex-wrap
          items-center
          justify-between
          gap-5
          px-6
          py-6
          lg:px-8
        "
      >

        {/* LEFT */}

        <div>

          {/* NYXORA BADGE */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-violet-400/20
              bg-violet-500/[0.07]
              px-3
              py-1.5
              text-xs
              font-medium
              text-violet-200
              shadow-[0_0_20px_rgba(139,92,246,0.08)]
            "
          >

            <Sparkles
              size={14}
              className="
                text-fuchsia-400
              "
            />

            <span>
              Nyxora Workspace
            </span>

          </div>


          {/* TITLE */}

          <h1
            className="
              mt-3
              text-2xl
              font-bold
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            Teaching Workspace
          </h1>


          {/* DESCRIPTION */}

          <p
            className="
              mt-1.5
              max-w-2xl
              text-sm
              leading-6
              text-slate-400
            "
          >
            Classes, students and AI-generated learning resources.
          </p>

        </div>


        {/* ================================================
            CREATE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={onCreate}
          className="
            group
            relative
            flex
            items-center
            gap-2
            overflow-hidden
            rounded-xl
            
            bg-gradient-to-r
            from-fuchsia-600
            via-violet-600
            to-cyan-500
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-[0_8px_30px_rgba(124,58,237,0.25)]
            transition-all
            duration-300
            hover:scale-[1.03]
            hover:shadow-[0_10px_38px_rgba(124,58,237,0.35)]
            active:scale-[0.98]
          "
        >

          {/* BUTTON SHINE */}

          <span
            className="
              pointer-events-none
              absolute
              inset-0
              -translate-x-full
              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent
              transition-transform
              duration-700
              group-hover:translate-x-full
            "
          />


          <Plus
            size={18}
            className="
              relative
              z-10
            "
          />


          <span
            className="
              relative
              z-10
            "
          >
            Create
          </span>

        </button>

      </div>


      {/* ================================================
          NAVIGATION
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          gap-2
          overflow-x-auto
          px-6
          pb-3
          lg:px-8
        "
      >

        {tabs.map((tab) => {

          const Icon =
            tab.icon;


          const active =
            activeTab ===
            tab.id;


          return (

            <button
              key={tab.id}
              type="button"
              onClick={() =>
                onTabChange(
                  tab.id
                )
              }
              className={`
                group
                relative
                flex
                shrink-0
                items-center
                gap-2
                overflow-hidden
                rounded-xl
                border
                px-4
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-300

                ${
                  active
                    ? `
                      border-violet-400/25
                      bg-gradient-to-r
                      from-fuchsia-500/10
                      via-violet-500/15
                      to-cyan-500/10
                      text-white
                      shadow-[0_5px_20px_rgba(124,58,237,0.10)]
                    `
                    : `
                      border-transparent
                      bg-transparent
                      text-slate-500
                      hover:border-white/[0.07]
                      hover:bg-white/[0.035]
                      hover:text-slate-200
                    `
                }
              `}
            >

              

              {/* ICON */}

              <span
                className={`
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  transition-all
                  duration-300

                  ${
                    active
                      ? `
                        bg-violet-500/15
                        text-violet-300
                      `
                      : `
                        text-slate-500
                        group-hover:bg-white/[0.04]
                        group-hover:text-slate-300
                      `
                  }
                `}
              >

                <Icon
                  size={16}
                />

              </span>


              {/* LABEL */}

              <span>
                {tab.label}
              </span>


              {/* ACTIVE BOTTOM GLOW */}

              {active && (

                <span
                  className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-[20%]
                    h-px
                    w-[60%]
                    bg-gradient-to-r
                    from-fuchsia-400
                    via-violet-400
                    to-cyan-400
                    shadow-[0_0_8px_rgba(139,92,246,0.7)]
                  "
                />

              )}

            </button>

          );

        })}

      </div>

    </div>

  );

}