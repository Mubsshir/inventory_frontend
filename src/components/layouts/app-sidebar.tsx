import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ClockArrowDown, icons } from "lucide-react";
import { NavLink } from "react-router";

export function AppSidebar() {
  const projects = [
    {
      name: "Inventory",
      url: "/",
      icon: icons.AlarmClock,
    },
  ];
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h3 className="text-xl ">
          <span className="text-red-600 font-bold">Inventory</span> Manager
        </h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton asChild>
                  <NavLink to={project.url}>
                    <project.icon />
                    <span>{project.name}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
