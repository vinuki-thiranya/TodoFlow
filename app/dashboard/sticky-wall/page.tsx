"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth/client"
import { redirect } from "next/navigation"
import Sidebar from "@/components/sidebar"
import { Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotes, useCreateNote, useDeleteNote } from "@/lib/queries/notes"

export default function StickyWallPage() {
  const { data: session, isPending: isAuthLoading } = authClient.useSession()
  const { data: notes, isLoading: isNotesLoading } = useNotes()
  const createNoteMutation = useCreateNote()
  const deleteNoteMutation = useDeleteNote()

  const [showNewNote, setShowNewNote] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteColor, setNewNoteColor] = useState("#FEF08A")

  const colors = [
    { value: "#FEF08A", name: "Yellow" },
    { value: "#A7F3D0", name: "Teal" },
    { value: "#FCD34D", name: "Amber" },
    { value: "#FBCFE8", name: "Pink" },
  ]

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    redirect("/auth/login")
  }

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return

    await createNoteMutation.mutateAsync({
      title: newNoteTitle,
      content: newNoteContent,
      themeColor: newNoteColor,
    })

    setNewNoteTitle("")
    setNewNoteContent("")
    setNewNoteColor("#FEF08A")
    setShowNewNote(false)
  }

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteNoteMutation.mutateAsync(noteId)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={session.user} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Sticky Wall</h1>
        </div>

        {isNotesLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes?.map((note: any) => (
              <div
                key={note.id}
                className="p-4 rounded-lg shadow-sm cursor-default hover:shadow-md transition min-h-[12rem] relative group border border-black/5"
                style={{ backgroundColor: note.themeColor }}
              >
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-black/5 rounded"
                  disabled={deleteNoteMutation.isPending}
                >
                  <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </button>
                <h3 className="font-bold text-base mb-2 pr-6 border-b border-black/10 pb-1">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap mt-2">
                  {note.content}
                </p>
              </div>
            ))}

            {/* Add New Note Card */}
            {showNewNote ? (
              <div className="p-4 rounded-lg shadow-md bg-card border-2 border-dashed border-primary/20 min-h-[12rem] flex flex-col animate-in fade-in zoom-in duration-200">
                <Input
                  type="text"
                  placeholder="Note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="mb-2 text-sm font-bold bg-transparent border-none focus-visible:ring-0 px-0 h-auto py-1"
                  autoFocus
                />
                <textarea
                  placeholder="Note content..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="flex-1 text-sm resize-none p-0 bg-transparent border-none focus:outline-none mb-4"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        className={`w-6 h-6 rounded-full cursor-pointer border-2 shadow-sm transition-transform hover:scale-110 ${
                          newNoteColor === color.value ? "border-primary scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setNewNoteColor(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateNote} 
                      size="sm" 
                      className="h-8 shadow-sm"
                      disabled={createNoteMutation.isPending}
                    >
                      {createNoteMutation.isPending ? "..." : "Add"}
                    </Button>
                    <Button 
                      onClick={() => setShowNewNote(false)} 
                      size="sm" 
                      variant="ghost" 
                      className="h-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewNote(true)}
                className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all min-h-[12rem] flex items-center justify-center cursor-pointer group"
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Add Note</span>
                </div>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
