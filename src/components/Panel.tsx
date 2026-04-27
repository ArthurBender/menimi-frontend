import { useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

interface PanelProps extends PropsWithChildren {
  title?: string;
  icon?: ReactNode;
  isCollapsible?: boolean;
}

const Panel = ({ title, icon, isCollapsible = false, children }: PanelProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-primary shadow-md">
      {title && (
        isCollapsible ? (
          <button
            type="button"
            className="flex w-full items-center gap-3 px-5 py-3 bg-surface"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {icon && <span className="text-xl text-primary">{icon}</span>}
            <h3 className="flex-1 text-left text-xl font-semibold">{title}</h3>
            <span className="text-primary">
              {isOpen ? <MdExpandLess size={30} /> : <MdExpandMore size={30} />}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3 px-5 py-3 bg-surface">
            {icon && <span className="text-lg text-primary">{icon}</span>}
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
        )
      )}
      {isOpen && (
        <div className={title ? "border-t border-primary px-6 py-6" : "px-6 py-6"}>{children}</div>
      )}
    </div>
  );
};

export default Panel;
