import { Outlet } from "react-router-dom"
import { Header } from "@/components/layout/Header"

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="w-full px-4 text-center text-sm text-muted-foreground">
          Web phim này làm ra để dành cho bé Nga 🍄
        </div>
      </footer>
    </div>
  )
}
