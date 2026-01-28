import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const LoggedLayout = () => {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <Outlet />
    </div>
  )
}

export default LoggedLayout;