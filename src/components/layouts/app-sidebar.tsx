import {
  ChartArea,
  ChevronRight,
  LibraryBig,
  LucideLogOut,
  MonitorPlay,
  SendToBack,
  StoreIcon,
  UserCircle2,
  WarehouseIcon,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Store } from "@/store/Store";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import Loading from "../ui/Loading";
import Cookies from "js-cookie";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";

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
    title: "Inventoy",
    url: "/inventory",
    icon: WarehouseIcon,
    submenu: [
      {
        title: "Brand Categories",
        url: "/bcategory",
        icon: StoreIcon,
      },
      {
        title: "Brands",
        url: "/brands",
        icon: SendToBack,
      },
      {
        title: "Stocks",
        url: "/stocks",
        icon: MonitorPlay,
      },
    ],
  },
];

export function AppSidebar() {
  const { state, setOpen } = useSidebar();
  const navigate = useNavigate();
  const context = useContext(Store);

  if (!context) {
    return <Loading />;
  }

  const { setIsAuth } = context;
  const logoutHandler = () => {
    navigate("/login");
    setIsAuth && setIsAuth(false);
    Cookies.remove("token");
  };

  return (
    <Sidebar collapsible={"icon"}>
      <SidebarHeader>
        <div className="flex items-start justify-center  rounded-md py-2">
          <LibraryBig
            size={32}
            className="cursor-pointer"
            color="gray"
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
              {items.map((item) => {
                if (item.submenu) {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            {"  "}
                            <item.icon />
                            <NavLink to={"/"}>
                              <span>{item.title}</span>
                            </NavLink>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 mt-1">
                          {item.submenu.map((subitem) => (
                            <SidebarMenuSub key={subitem.title}>
                              <SidebarMenuSubItem>
                                <NavLink
                                  to={item.url + subitem.url}
                                  className={"flex items-center space-x-1 "}
                                >
                                  <span>{subitem.title}</span>
                                </NavLink>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          ))}
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon className="mr-2" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton onClick={logoutHandler}>
          <LucideLogOut color="red" />
          Logut
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
