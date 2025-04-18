import {
  BadgeDollarSign,
  ChartArea,
  CheckCheckIcon,
  ChevronRight,
  Database,
  DownloadIcon,
  HistoryIcon,
  LibraryBig,
  LucideDollarSign,
  LucideLogOut,
  MonitorPlay,
  SendToBack,
  StoreIcon,
  UploadCloudIcon,
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
    access: "1",
  },
  {
    title: "Consumers",
    url: "/consumers",
    icon: UserCircle2,
    access: "1",
  },
  {
    title: "Inventoy",
    url: "/inventory",
    icon: WarehouseIcon,
    access: "1",
    submenu: [
      {
        title: "Brand Categories",
        url: "/bcategory",
        icon: StoreIcon,
        access: "1",
      },
      {
        title: "Brands",
        url: "/brands",
        icon: SendToBack,
        access: "1",
      },
      {
        title: "Stocks",
        url: "/stocks",
        icon: MonitorPlay,
        access: "1",
      },
    ],
  },
  {
    title: "Sales",
    url: "/sale",
    icon: BadgeDollarSign,
    access: "1",
    submenu: [
      {
        title: "Make Sale",
        url: "/add-sale",
        icon: LucideDollarSign,
        access: "1",
      },
      {
        title: "Sales History",
        url: "/history",
        icon: HistoryIcon,
        access: "1",
      },
    ],
  },
  {
    title: "Import/Export Data",
    url: "/data",
    icon: Database,
    access: "1",
    submenu: [
      {
        title: "Import Data",
        url: "/import",
        icon: DownloadIcon,
        access: "2",
      },
      {
        title: "Approve Import Data",
        url: "/approve",
        icon: CheckCheckIcon,
        access: "2",
      },
      {
        title: "Export Data",
        url: "/export",
        icon: UploadCloudIcon,
        access: "1",
      },
    ],
  },
];

const AppSidebar = () => {
  const { state, setOpen } = useSidebar();
  const navigate = useNavigate();
  const context = useContext(Store);

  if (!context) {
    return <Loading />;
  }

  const { setIsAuth, user } = context;
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
              {items
                .filter((item) =>
                  user?.role !== "Admin" ? item.access === "1" : true
                )
                .map((item) => {
                  if (item.submenu) {
                    const filteredSubmenu = item.submenu.filter((subitem) =>
                      user?.role !== "Admin" ? subitem.access === "1" : true
                    );

                    // Skip the whole group if no submenu items are visible
                    if (filteredSubmenu.length === 0) return null;

                    return (
                      <Collapsible
                        key={item.title}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon />
                              <NavLink to={item.url}>
                                <span>{item.title}</span>
                              </NavLink>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-1 mt-1">
                            {filteredSubmenu.map((subitem) => (
                              <SidebarMenuSub key={subitem.title}>
                                <SidebarMenuSubItem className="flex items-center">
                                  <NavLink
                                    to={item.url + subitem.url}
                                    className="flex items-center space-x-1"
                                  >
                                    <subitem.icon size={18} className="mr-3" />
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
};
export default AppSidebar;
