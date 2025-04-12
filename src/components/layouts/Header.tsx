import { useLocation } from "react-router";
import { SidebarTrigger } from "../ui/sidebar";

type HeaderProps = {
  username: string;
};

const Header: React.FC<HeaderProps> = ({ username }) => {
  const { pathname } = useLocation();

  const pageName =
    pathname.substring(1, 2).toUpperCase() +
    pathname.substring(2, pathname.length).toLowerCase();

  return (
    <header className="w-auto sm:w-lvw md:w-full flex items-center justify-between h-14 shadow-red-200 shadow-md">
      <div className="flex  items-center">
        <SidebarTrigger />
        <h3 className="font-thin ml-2 text-lg sm:text-">
          {pageName || "Welcome "}
        </h3>
      </div>
      <div className="flex w-fit  items-center justify-around mr-2  px-2 py-2">
        <h3 className="   inline-block text-lg sm:text-sm ">
          <span className="mr-2 text-red-500 font-bold  ">Hello</span>{" "}
          {username || "Guest"}
        </h3>
      </div>
    </header>
  );
};

export default Header;
