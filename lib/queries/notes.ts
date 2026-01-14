import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client"

const API_URL = "/api/notes"

// Fetch fetch notes for the current user
export function useNotes() {
  const { data: session } = authClient.useSession()

  return useQuery({
    queryKey: ["notes", session?.user.id],
    queryFn: async () => {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch notes")
      return response.json()
    },
    enabled: !!session?.user.id,
  })
}

// Create note mutation
export function useCreateNote() {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()

  return useMutation({
    mutationFn: async (noteData: {
      title: string
      content?: string
      themeColor?: string
    }) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      })
      if (!response.ok) throw new Error("Failed to create note")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", session?.user.id] })
    },
  })
}

// Delete note mutation
export function useDeleteNote() {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await fetch(`${API_URL}/${noteId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete note")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", session?.user.id] })
    },
  })
}
