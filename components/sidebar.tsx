"use client"

import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Menu,
  Plus,
  LogOut,
  Settings,
  Search,
  LayoutDashboard,
  CheckSquare2,
  Calendar,
  Columns3,
  User,
} from "lucide-react"
import { useLists } from "@/hooks/use-lists"
import { useTags } from "@/hooks/use-tags"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SidebarProps {
  user: any
}

export default function Sidebar({ user }: SidebarProps) {
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [showNewTagInput, setShowNewTagInput] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [newTagName, setNewTagName] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const router = useRouter()

  const { lists, createList } = useLists(user?.id)
  const { tags, createTag } = useTags(user?.id)

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/auth/login")
  }

  const handleCreateList = async () => {
    if (newListName.trim()) {
      await createList(newListName, "#EF4444")
      setNewListName("")
      setShowNewListInput(false)
    }
  }


  const handleCreateTag = async () => {
    if (newTagName.trim()) {
      await createTag(newTagName, "#D1D5DB", "#374151")
      setNewTagName("")
      setShowNewTagInput(false)
    }
  }


  

  const listColors: { [key: string]: string } = {
    "#EF4444": "bg-red-200",
    "#3B82F6": "bg-blue-200",
    "#FBBF24": "bg-yellow-200",
  }

  return (
    <>
      <aside
        className={`${sidebarOpen ? "w-72" : "w-20"} bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 h-screen`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          {sidebarOpen && (
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Search tasks..." className="bg-background pl-10" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">

          {/* Tasks Section */}
          <div className="mb-8">
            {sidebarOpen && (
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tasks</h2>
            )}
            <nav className="space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start text-base" title="Dashboard">
                  <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="mr-auto ml-2">Dashboard</span>
                      <span className="text-muted-foreground text-sm">12</span>
                    </>
                  )}
                </Button>
              </Link>
              <Link href="/today">
                <Button variant="ghost" className="w-full justify-start text-base" title="Today">
                  <CheckSquare2 className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="mr-auto ml-2">Today</span>
                      <span className="text-muted-foreground text-sm">5</span>
                    </>
                  )}
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="ghost" className="w-full justify-start text-base" title="Calendar">
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="mr-auto ml-2">Calendar</span>}
                </Button>
              </Link>
              <Link href="/dashboard/sticky-wall">
                <Button variant="ghost" className="w-full justify-start text-base" title="Sticky Wall">
                  <Columns3 className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="mr-auto ml-2">Sticky Wall</span>}
                </Button>
              </Link>
            </nav>
          </div>

          {/* Lists Section */}
          {sidebarOpen && (
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Lists</h2>
              <div className="space-y-2">
                {lists.map((list: any) => (
                  <Link key={list.id} href={`/tasks?list=${list.id}`}>
                    <Button variant="ghost" className="w-full justify-start">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          listColors[list.color as keyof typeof listColors] || "bg-gray-200"
                        }`}
                      />
                      <span className="mr-auto">{list.name}</span>
                    </Button>
                  </Link>
                ))}
                {showNewListInput ? (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="List name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={handleCreateList}>
                      Add
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-primary"
                    onClick={() => setShowNewListInput(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New List
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Tags Section */}
          {sidebarOpen && (
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: any) => (
                  <button
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: tag.bg_color,
                      color: tag.text_color,
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
                {showNewTagInput ? (
                  <Input
                    type="text"
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCreateTag()}
                    className="text-sm px-3 py-1 h-auto"
                  />
                ) : (
                  <button
                    className="px-3 py-1 rounded-full text-sm text-sidebar-primary border border-dashed border-sidebar-primary cursor-pointer hover:bg-primary/10"
                    onClick={() => setShowNewTagInput(true)}
                  >
                    + Add Tag
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-base"
            onClick={() => setShowProfileModal(true)}
            title="Profile"
          >
            <User className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="ml-2">Profile</span>}
          </Button>
          {sidebarOpen && (
            <>
              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start text-base">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-base text-red-600 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </>
          )}
        </div>
      </aside>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user?.name || "No Name Set"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.userRole || "User"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p className="text-sm">
                <span className="font-semibold">User ID:</span> {user?.id?.slice(0, 8)}...
              </p>
              <p className="text-sm">
                <span className="font-semibold">Status:</span> Active
              </p>
            </div>
            <Link href="/settings">
              <Button className="w-full" onClick={() => setShowProfileModal(false)}>
                Change Password
              </Button>
            </Link>
            <Button
              className="w-full text-red-600 hover:text-red-700 bg-transparent"
              variant="outline"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
