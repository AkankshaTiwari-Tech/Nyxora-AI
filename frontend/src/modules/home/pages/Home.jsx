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
        min-h-screen
        bg-[#050816]
        px-8
        py-8
      "
    >

      <DashboardHeader />


      <QuickActions />


      {loading ? (

        <div
          className="
            mt-10
            rounded-2xl
            border
            border-[#20283A]
            bg-[#151B2F]
            p-8
            text-center
            text-gray-400
          "
        >
          Loading your Nyxora data...
        </div>

      ) : (

        <>

          <StatsCards
            chats={chats}
            documents={documents}
          />


          <RecentFiles
            documents={documents}
          />

        </>

      )}


      <AITools />

    </main>

  );

}