import type { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const PageTitle = ({ title, description, actions }: PageTitleProps) => (
  <div className="flex items-start justify-between gap-4">
    <div className="border-l-4 border-primary pl-4">
      <h2 className="text-3xl font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-primary">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
);

export default PageTitle;
