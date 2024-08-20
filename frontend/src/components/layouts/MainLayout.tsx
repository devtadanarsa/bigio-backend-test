import { FC } from "react";
import { GiBookshelf } from "react-icons/gi";
import { MdDashboard, MdLibraryBooks } from "react-icons/md";
import { useLocation } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface MainLayoutProps {
  children: React.ReactNode;
  breadcrumbs: {
    label: string;
    href: string;
  }[];
}

const MainLayout: FC<MainLayoutProps> = ({ children, breadcrumbs }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex">
      <aside className="w-1/6 h-screen border-r py-8">
        <div className="flex justify-center items-center gap-3">
          <GiBookshelf className="text-3xl text-primary" />
          <p className="text-2xl text-primary font-semibold">StoryKu</p>
        </div>

        <div className="mt-8">
          <NavigationButton
            path="/"
            label="Dashboard"
            icon={<MdDashboard />}
            isActive={pathname === "/"}
          />
          <NavigationButton
            path="/stories"
            label="Story Management"
            icon={<MdLibraryBooks />}
            isActive={pathname === "/stories"}
          />
        </div>
      </aside>

      <div className="w-5/6 px-5 py-8">
        <BreadcrumbList className="text-black">
          {breadcrumbs.map((breadcrumb, index) => (
            <>
              <BreadcrumbItem key={index}>
                <BreadcrumbLink
                  href={breadcrumb.href}
                  className="hover:underline"
                >
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </>
          ))}
        </BreadcrumbList>
        <main className="py-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
