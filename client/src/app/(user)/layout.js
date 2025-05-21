import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";


export default function Layout({ children }) {
  return (
    <SidebarProvider className="flex h-screen w-full">
      <AppSidebar />

      <main className="flex h-screen w-full">
        <SidebarTrigger />
        {children}
        <spam className="absolute top-0 right-0 size-16 mr-5 z-999">
     
        </spam>
      </main>
    </SidebarProvider>
  );
}
