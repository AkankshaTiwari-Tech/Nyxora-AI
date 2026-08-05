import {
  Bell,
  Search,
  Sparkles,
} from "lucide-react";


export default function DashboardHeader() {


  const hour =
    new Date().getHours();


  let greeting =
    "Good Evening";


  if (hour < 12) {

    greeting =
      "Good Morning";

  } else if (hour < 18) {

    greeting =
      "Good Afternoon";

  }


  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/[0.07]
        bg-[#080C18]/90
        px-6
        py-6
        shadow-[0_18px_60px_rgba(0,0,0,.22)]
        lg:px-7
      "
    >


      {/* ==================================================
          AMBIENT BACKGROUND GLOWS
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-24
          h-64
          w-64
          rounded-full
          bg-fuchsia-600/[0.08]
          blur-[90px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-20
          h-64
          w-64
          rounded-full
          bg-cyan-400/[0.07]
          blur-[90px]
        "
      />


      {/* ==================================================
          TOP GRADIENT ACCENT
      ================================================== */}

      <div
        className="
          absolute
          left-8
          right-8
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-violet-400/60
          to-transparent
        "
      />


      {/* ==================================================
          HEADER CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >


        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div>


          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >


            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-gradient-to-br
                from-fuchsia-500/20
                via-violet-500/20
                to-cyan-400/15
                text-violet-300
              "
            >

              <Sparkles
                size={15}
              />

            </div>


            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-slate-500
              "
            >

              Nyxora Workspace

            </span>


          </div>



          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-white
              sm:text-4xl
            "
          >

            {greeting}

            <span className="ml-2">
              👋
            </span>

          </h1>



          <p
            className="
              mt-2
              text-base
              text-slate-400
              sm:text-lg
            "
          >

            Welcome back to{" "}

            <span
              className="
                font-medium
                text-slate-300
              "
            >

              Nyxora AI Workspace

            </span>

          </p>


        </div>



        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div
          className="
            flex
            w-full
            items-center
            gap-3
            lg:w-auto
          "
        >


          {/* ==================================================
              SEARCH
          ================================================== */}

          <div
            className="
              group
              flex
              min-w-0
              flex-1
              items-center
              rounded-xl
              border
              border-white/[0.08]
              bg-[#0B1020]/90
              px-4
              py-3
              transition-all
              duration-300
              focus-within:border-violet-400/40
              focus-within:bg-[#0D1324]
              focus-within:shadow-[0_0_0_3px_rgba(124,58,237,.07),0_0_25px_rgba(124,58,237,.06)]
              lg:w-72
              lg:flex-none
            "
          >


            <Search

              size={18}

              className="
                shrink-0
                text-slate-500
                transition-colors
                duration-300
                group-focus-within:text-violet-300
              "

            />


            <input

              type="text"

              placeholder="Search workspace..."

              className="
                ml-3
                w-full
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-slate-600
              "

            />


            <div
              className="
                ml-2
                hidden
                rounded-md
                border
                border-white/[0.07]
                bg-white/[0.03]
                px-1.5
                py-0.5
                text-[10px]
                text-slate-600
                sm:block
              "
            >

              /

            </div>


          </div>



          {/* ==================================================
              NOTIFICATION BUTTON
          ================================================== */}

          <button

            type="button"

            className="
              group
              relative
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.08]
              bg-[#0B1020]/90
              transition-all
              duration-300
              hover:border-violet-400/25
              hover:bg-violet-500/[0.07]
              hover:shadow-[0_0_25px_rgba(124,58,237,.08)]
            "

          >


            <Bell

              size={19}

              className="
                text-slate-300
                transition-colors
                duration-300
                group-hover:text-violet-200
              "

            />


            {/* NOTIFICATION INDICATOR */}

            <span
              className="
                absolute
                right-[9px]
                top-[8px]
                h-2
                w-2
                rounded-full
                border
                border-[#0B1020]
                bg-fuchsia-400
                shadow-[0_0_8px_rgba(217,70,239,.9)]
              "
            />


          </button>



          {/* ==================================================
              PROFILE AVATAR
          ================================================== */}

          <button

            type="button"

            className="
              group
              relative
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-fuchsia-500
              via-violet-600
              to-cyan-400
              p-[1px]
              shadow-[0_0_22px_rgba(124,58,237,.18)]
              transition-all
              duration-300
              hover:scale-[1.04]
              hover:shadow-[0_0_28px_rgba(124,58,237,.28)]
            "

          >


            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                rounded-[11px]
                bg-[#090D1A]
                text-base
                font-bold
                text-white
              "
            >

              <span
                className="
                  nyxora-gradient-text
                "
              >

                N

              </span>


            </div>



            {/* ONLINE STATUS */}

            <span
              className="
                absolute
                -bottom-0.5
                -right-0.5
                h-3
                w-3
                rounded-full
                border-2
                border-[#080C18]
                bg-emerald-400
                shadow-[0_0_7px_rgba(52,211,153,.55)]
              "
            />


          </button>


        </div>


      </div>


    </div>

  );


}