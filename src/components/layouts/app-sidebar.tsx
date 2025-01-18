import {
  Calendar,
  ChartArea,
  ChartNoAxesColumnDecreasing,
  Inbox,
  LibraryBig,
  LifeBuoyIcon,
  LucideLogOut,
  Search,
  Settings,
  UserCircle2,
  Users2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Store } from "@/store/Store";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import Loading from "../ui/Loading";
import Cookies from "js-cookie";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartArea,
  },
  {
    title: "Consumers",
    url: "/consumers",
    icon: UserCircle2,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state, setOpen } = useSidebar();
  const navigate=useNavigate();
  const context=useContext(Store);

  if(!context){
    return <Loading/>
  }

  const {setIsAuth}=context;
  const logoutHandler=()=>{
    navigate('/login')
    setIsAuth&&setIsAuth(false)
    Cookies.remove('token')
  }

  return (
    <Sidebar collapsible={"icon"}>
      <SidebarHeader>
        <div className="flex items-start justify-center  rounded-md py-2">
          <LibraryBig
            size={32}
            className="cursor-pointe  " color="gray" 
            onClick={() => {
              setOpen(true);
            }}
          />
          {state != "collapsed" && (
            <h3 className="ml-2 w-full text-lg">
              {" "}
              Inventory <span className="text-red-500 font-bold">Manager</span>
            </h3>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton onClick={logoutHandler}>
          <LucideLogOut color="red" />Logut
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
