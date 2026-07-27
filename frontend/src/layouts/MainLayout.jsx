import React from "react";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {children}
    </div>
  );
}