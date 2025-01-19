import { Outlet } from "react-router"
import { AppSidebar } from "../layouts/app-sidebar"
import Header from "../layouts/Header"
import Loading from "../ui/Loading"
import { SidebarProvider } from "../ui/sidebar"
import { Store } from "@/store/Store"
import { useContext } from "react"
import { Toaster } from "../ui/toaster"
const Home = () => {
  const context=useContext(Store);
  if(!context){
    return <Loading/>
  }

  const {user}=context;
  

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar/>
      <main className="w-full h-lvh">
        <Header  username={user?.fullname||'Guest'}/>
        <section className=" overflow-hidden  w-full px-2 mt-3 h-5/6">
          <Outlet/>
        </section>
      </main>
      <Toaster />
    </SidebarProvider>
  )
}

export default Home