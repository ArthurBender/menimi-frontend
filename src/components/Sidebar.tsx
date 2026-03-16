import { useTranslation } from "react-i18next";
import SidebarLinks from "./SidebarLinks";

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside className={`min-h-screen shrink-0 bg-primary text-light transition-width duration-300 ease-in-out
      flex flex-col justify-between p-4 ${isOpen ? "w-60" : "w-20 overflow-hidden"}`}
    >
      <div></div>

      <SidebarLinks isOpen={isOpen} />

      <div className={`text-center font-semibold text-sm text-nowrap ${!isOpen && "invisible"}`}>
        © {new Date().getFullYear()}. {t("common.allRightsReserved")}
      </div>
    </aside>
  )
}

export default Sidebar
