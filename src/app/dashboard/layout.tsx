import Sidebar from "@/shared/components/sidebar";


export default function DashboardLayout({ children } : { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  )
}