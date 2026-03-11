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
        <div className="border-t border-l border-accent h-full w-full px-20 py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LoggedLayout;
