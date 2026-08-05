import DashboardHeader
  from "../components/DashboardHeader";

import QuickActions
  from "../components/QuickActions";

import StatsCards
  from "../components/StatsCards";

import RecentFiles
  from "../components/RecentFiles";

import AITools
  from "../components/AITools";


import useWorkspace
  from "../../workspace/hooks/useWorkspace";

import useChatHistory
  from "../../chat/hooks/useChatHistory";


export default function Home() {

  const {
    documents,
    loading: workspaceLoading,
  } = useWorkspace();


  const {
    chats,
    loading: chatsLoading,
  } = useChatHistory();


  const loading =
    workspaceLoading ||
    chatsLoading;


  return (

    <main
      className="
        nyxora-page
        nyxora-grid-bg
        relative
        min-h-screen
        overflow-hidden
        px-5
        py-6
        sm:px-6
        lg:px-8
        lg:py-8
      "
    >


      {/* ==================================================
          AMBIENT BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[420px]
          w-[420px]
          rounded-full
          bg-fuchsia-600/[0.045]
          blur-[130px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[20%]
          h-[450px]
          w-[450px]
          rounded-full
          bg-violet-600/[0.045]
          blur-[140px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          bottom-[-220px]
          left-[30%]
          h-[480px]
          w-[480px]
          rounded-full
          bg-cyan-500/[0.035]
          blur-[150px]
        "
      />


      {/* ==================================================
          DASHBOARD CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1600px]
        "
      >


        {/* HEADER */}

        <DashboardHeader />


        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <section
          className="
            mt-7
          "
        >

          <QuickActions />

        </section>


        {/* ==================================================
            WORKSPACE DATA
        ================================================== */}

        {loading ? (

          <div
            className="
              nyxora-card
              nyxora-fade-in
              mt-7
              flex
              min-h-[170px]
              items-center
              justify-center
              overflow-hidden
              p-8
            "
          >


            <div
              className="
                flex
                flex-col
                items-center
                justify-center
              "
            >


              {/* LOADER */}

              <div
                className="
                  relative
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                "
              >

                <div
                  className="
                    absolute
                    inset-0
                    animate-spin
                    rounded-full
                    border-2
                    border-transparent
                    border-r-cyan-400
                    border-t-violet-500
                  "
                />


                <div
                  className="
                    h-5
                    w-5
                    rounded-full
                    bg-gradient-to-br
                    from-fuchsia-500
                    via-violet-500
                    to-cyan-400
                    shadow-[0_0_18px_rgba(124,58,237,.35)]
                  "
                />

              </div>


              <p
                className="
                  mt-4
                  text-sm
                  font-medium
                  text-slate-300
                "
              >

                Loading your Nyxora data...

              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-slate-600
                "
              >

                Preparing your workspace

              </p>


            </div>


          </div>

        ) : (

          <>

            {/* STATS */}

            <section
              className="
                mt-7
              "
            >

              <StatsCards
                chats={chats}
                documents={documents}
              />

            </section>


            {/* RECENT FILES */}

            <section
              className="
                mt-7
              "
            >

              <RecentFiles
                documents={documents}
              />

            </section>

          </>

        )}


        {/* ==================================================
            AI TOOLS
        ================================================== */}

        <section
          className="
            mt-7
            pb-8
          "
        >

          <AITools />

        </section>


      </div>


    </main>

  );

}