type SidebarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={`min-h-screen shrink-0 bg-primary text-light transition-all duration-300 ease-in-out ${isOpen ? "w-100" : "w-15 overflow-hidden"}`}
    >
    </aside>
  )
}

export default Sidebar
