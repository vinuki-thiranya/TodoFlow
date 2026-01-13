import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client"

const API_URL = "/api"


// Fetch todos with proper role-based filtering
export function useTodos(listId?: string) {
  const { data: session } = authClient.useSession()

  return useQuery({
    queryKey: ["todos", listId, session?.user.id],
    queryFn: async () => {
      const url = listId ? `${API_URL}/todos?listId=${listId}` : `${API_URL}/todos`
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch todos")
      return response.json()
    },
    enabled: !!session?.user.id,
  })
}




// Create todo mutation
export function useCreateTodo() {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()

  return useMutation({
    mutationFn: async (todoData: {
      name: string
      listId: string
      description?: string
      state?: string
      dueAt?: Date
    }) => {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      })
      if (!response.ok) throw new Error("Failed to create todo")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}




// Update todo mutation
export function useUpdateTodo() {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
        id: string
        updates: Partial<{
        name: string
        description: string
        state: string
        dueAt: Date
        listId: string
      }>
    }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed to update todo")
      return response.json()
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}

// Delete todo mutation with role-based permissions
export function useDeleteTodo() {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()


  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete todo")
      return response.json()
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}