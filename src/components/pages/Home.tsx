import { Outlet } from "react-router"
import { AppSidebar } from "../layouts/app-sidebar"
import Header from "../layouts/Header"
import Loading from "../ui/Loading"
import { SidebarProvider } from "../ui/sidebar"
import { Store } from "@/store/Store"
import { useContext } from "react"
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
        <Header pagename={"Home"} username={user?.fullname||'Guest'}/>
        <section className=" overflow-hidden w-full px-2 mt-3">
          <Outlet/>
        </section>
      </main>
    </SidebarProvider>
  )
}

export default Home