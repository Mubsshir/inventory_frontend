import { Outlet } from "react-router";

import { SidebarProvider } from "../ui/sidebar";
import { Toaster } from "../ui/toaster";
import AppSidebar from "./app-sidebar";
import Header from "./Header";

const HomeLayout = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <>
        <AppSidebar />
        <main className="w-full h-dvh">
          <Header />
          <section className="overflow-hidden lg:overflow-hidden h-[90%] w-full px-2 mt-3">
            <Outlet />
          </section>
        </main>
        <Toaster />
      </>
    </SidebarProvider>
  );
};

export default HomeLayout;
