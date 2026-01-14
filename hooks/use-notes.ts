import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useNotes() {
  const queryClient = useQueryClient()

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch("/api/notes")
      if (!response.ok) throw new Error("Failed to fetch notes")
      return response.json()
    },
  })

  const createNote = useMutation({
    mutationFn: async ({ title, content, themeColor }: { title: string, content: string, themeColor: string }) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, themeColor }),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })

  return {
    notes,
    isLoading,
    createNote: createNote.mutateAsync,
    deleteNote: deleteNote.mutateAsync,
  }
}
