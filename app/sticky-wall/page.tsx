import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Sidebar from "@/components/sidebar"
import StickyWallContent from "./sticky-wall-content"

export default async function StickyWallPage() {
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
        <StickyWallContent user={session.user} />
      </main>
    </div>
  )
}
