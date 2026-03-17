import { Outlet } from "react-router-dom";

import { usePreferences } from "../preferences/usePreferences";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const LoggedLayout = () => {
  const { isSidebarOpen, setIsSidebarOpen } = usePreferences();

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="h-full w-full border-t border-accent px-4 py-4 pb-24 md:border-l md:px-20 md:py-10 md:pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LoggedLayout;
