import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Outlet />
    </div>
  );
}