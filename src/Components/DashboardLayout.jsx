import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          currentPage={currentPage}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
