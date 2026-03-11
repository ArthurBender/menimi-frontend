import type { PropsWithChildren } from "react";

import backgroundImage from "../assets/background.png";

interface AuthLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
}

const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <div
        className="hidden flex-1 bg-cover bg-center bg-no-repeat lg:block"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <aside className="flex min-h-screen w-full flex-col bg-white px-4 py-8 lg:w-[30rem] lg:px-8">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex flex-col items-center gap-2 pt-4 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-sm text-primary/70">{description}</p>
          </div>

          <div className="flex flex-1 flex-col pt-8">
            {children}
          </div>

          <div className="pt-6 text-center text-sm font-semibold text-nowrap">© {new Date().getFullYear()}. All rights reserved.</div>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;
