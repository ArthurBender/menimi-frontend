import { MdHome, MdCalendarMonth, MdAdd } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Home", path: "/", icon: <MdHome /> },
  { name: "Calendar", path: "/calendar", icon: <MdCalendarMonth /> },
  { name: "New Task", path: "/new", icon: <MdAdd /> },
]

const SidebarLinks = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`sidebar-link ${currentPath === link.path ? "active" : ""} ${isOpen && "expanded"}`}
        >
          <span>{link.icon}</span>
          {isOpen && link.name}
        </Link>
      ))}
    </div>
  )
}

export default SidebarLinks;