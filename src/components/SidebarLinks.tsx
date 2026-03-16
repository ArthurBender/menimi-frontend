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
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`sidebar-link ${currentPath === link.path ? "active" : ""} ${isOpen && "expanded"}`}
        >
          <span>{link.icon}</span>
          {isOpen && t(link.labelKey)}
        </Link>
      ))}
    </div>
  )
}

export default SidebarLinks;
