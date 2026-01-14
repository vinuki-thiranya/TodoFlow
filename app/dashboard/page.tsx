import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Sidebar from "@/components/sidebar"
import DashboardContent from "@/components/dashboard-content"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={session.user} />
      <DashboardContent user={session.user} />
    </div>
  )
}
