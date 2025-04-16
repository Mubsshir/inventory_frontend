import { NavLink, useLocation, useNavigate } from "react-router";
import { SidebarTrigger } from "../ui/sidebar";
import Cookies from "js-cookie";
import { InfoIcon, LucideLogOut, Settings, User2Icon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Store } from "@/store/Store";
import { useContext } from "react";
import Loading from "../ui/Loading";

const Header = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const context = useContext(Store);
  if (!context) {
    return <Loading />;
  }

  const { user, setIsAuth } = context;

  const pageName =
    pathname.substring(1, 2).toUpperCase() +
    pathname.substring(2, pathname.length).toLowerCase();

  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/login");
    setIsAuth && setIsAuth(false);
    Cookies.remove("token");
  };
  return (
    <header className="select-none w-auto sm:w-lvw md:w-full flex items-center justify-between h-14 shadow-red-200 shadow-md">
      <div className="flex  items-center">
        <SidebarTrigger />
        <h3 className="font-thin ml-2 text-lg sm:text-">
          {pageName || "Welcome "}
        </h3>
      </div>
      <div className="flex w-fit  items-center justify-around mr-2  px-2 py-2">
        <h3 className=" items-center space-x-1 text-lg sm:text-sm flex ">
          <span className="mr-2 text-red-500 font-bold  ">Hello</span>{" "}
          {user?.fullname || "Guest"}
          <Popover
            open={isOpen}
            onOpenChange={() => {
              setIsOpen(!isOpen);
            }}
          >
            <PopoverTrigger asChild>
              <Settings
                onClick={() => {
                  setIsOpen((prev: boolean) => !prev);
                }}
                className={`transition-transform duration-300 cursor-pointer ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            </PopoverTrigger>
            <PopoverContent className="p-0 w-56 relative sm:relative mx-auto  md:right-3 sm:right-11  right-3 ">
              <ul className="p-0 py-2 m-0 space-y-1">
                <NavLink
                  to={"/info"}
                  className={
                    "cursor-pointer hover:bg-red-500 p-1 hover:text-white flex items-center "
                  }
                >
                  <InfoIcon className="mr-2" /> Account Info
                </NavLink>
                {user?.role == "Admin" && (
                  <NavLink
                    to={"/usercreation"}
                    className={
                      "cursor-pointer hover:bg-red-500 p-1 hover:text-white flex items-center "
                    }
                  >
                    <User2Icon className="mr-2" />
                    Create New User
                  </NavLink>
                )}
                <li
                  onClick={logoutHandler}
                  className={
                    "cursor-pointer hover:bg-red-500 p-1 hover:text-white flex items-center "
                  }
                >
                  <LucideLogOut className="mr-2" />
                  Logut
                </li>
                {/* {user?.role == "Admin" && (
                  <NavLink
                    to={"/rolecreation"}
                    className={
                      "cursor-pointer hover:bg-red-500 p-1 hover:text-white flex items-center "
                    }
                  >
                    <ActivityIcon className="mr-2" />
                    Create Role
                  </NavLink>
                )} */}
                {/* {user?.role == "Admin" && (
                  <NavLink
                    to={"/rbac"}
                    className={
                      "cursor-pointer hover:bg-red-500 p-1 hover:text-white flex items-center "
                    }
                  >
                    <LucideAccessibility className="mr-2" />
                    RBAC
                  </NavLink>
                )} */}
              </ul>
            </PopoverContent>
          </Popover>
        </h3>
      </div>
    </header>
  );
};

export default Header;
