import { Outlet } from "react-router";
import { AppSidebar } from "../layouts/app-sidebar";
import Header from "../layouts/Header";

import { SidebarProvider } from "../ui/sidebar";

import { Toaster } from "../ui/toaster";
const Home = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="w-full h-dvh">
        <Header />
        <section className=" overflow-hidden lg:overflow-hidden  h-[90%] w-full px-2 mt-3 ">
          <Outlet />
        </section>
      </main>
      <Toaster />
    </SidebarProvider>
  );
};

export default Home;
