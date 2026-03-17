import { MdHome, MdCalendarMonth, MdAdd } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const links = [
  { labelKey: "nav.home", path: "/", icon: <MdHome /> },
  { labelKey: "nav.calendar", path: "/calendar", icon: <MdCalendarMonth /> },
  { labelKey: "nav.newTask", path: "/new", icon: <MdAdd /> },
] as const

const SidebarLinks = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-around gap-2 md:flex-col md:items-stretch md:justify-start">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`sidebar-link justify-center ${currentPath === link.path ? "active" : ""} ${isOpen ? "md:expanded" : ""}`}
        >
          <span>{link.icon}</span>
          <span className={`hidden md:inline ${isOpen && "md:pl-2"}`}>{isOpen && t(link.labelKey)}</span>
        </Link>
      ))}
    </div>
  )
}

export default SidebarLinks;
