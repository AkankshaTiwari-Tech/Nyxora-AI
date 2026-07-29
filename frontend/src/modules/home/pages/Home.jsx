import DashboardHeader from "../components/DashboardHeader";
import QuickActions from "../components/QuickActions";
import StatsCards from "../components/StatsCards";
import RecentFiles from "../components/RecentFiles";
import AITools from "../components/AITools";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] px-8 py-8">
      <DashboardHeader />

      <QuickActions />

      <StatsCards />

      <RecentFiles />

      <AITools />
    </main>
  );
}