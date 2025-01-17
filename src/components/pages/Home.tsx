import { AppSidebar } from "../layouts/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"

const Home = () => {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main>
        <SidebarTrigger/>
      </main>
    </SidebarProvider>
  )
}

export default Home