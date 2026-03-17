import { useTranslation } from "react-i18next";
import SidebarLinks from "./SidebarLinks";

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-accent bg-primary px-2 py-1.5 text-light md:static md:flex md:min-h-screen md:shrink-0 md:flex-col md:justify-between md:border-t-0 md:p-4 md:transition-[width] md:duration-300 md:ease-in-out ${
        isOpen ? "md:w-70" : "md:w-20 md:overflow-hidden"
      }`}
    >
      <div className="hidden md:block"></div>

      <SidebarLinks isOpen={isOpen} />

      <div className={`hidden text-center text-sm font-semibold text-nowrap md:block ${!isOpen && "md:invisible"}`}>
        © {new Date().getFullYear()}. {t("common.allRightsReserved")}
      </div>
    </aside>
  )
}

export default Sidebar
