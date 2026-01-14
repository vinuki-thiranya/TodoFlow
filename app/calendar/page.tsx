import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Sidebar from "@/components/sidebar"
import CalendarContent from "./calendar-content"

export default async function CalendarPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={session.user} />
      <main className="flex-1 p-8 overflow-auto">
        <CalendarContent user={session.user} />
      </main>
    </div>
  )
}