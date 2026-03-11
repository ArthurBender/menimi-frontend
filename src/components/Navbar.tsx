import { useAuth } from "../api/useAuth";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { MdSettings, MdLogout } from "react-icons/md";
import { MdMenu } from "react-icons/md";

type NavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const Navbar = ({ isSidebarOpen, onToggleSidebar }: NavbarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-primary px-4 py-2 text-light">
      <button type="button" onClick={onToggleSidebar} className={`nav-link transition-all ${!isSidebarOpen && "-translate-x-17.5"}`}>
        <MdMenu />
      </button>
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
        <img src={logo} alt="Menimi logo" className="h-10 w-10" />
        <span>Menimi</span>
      </Link>

      <div className="flex gap-4">
        <Link to="/settings" className="nav-link"><MdSettings /></Link>
        <button className="nav-link" onClick={handleLogout}><MdLogout /></button>
      </div>
    </nav>
  )
}

export default Navbar;
