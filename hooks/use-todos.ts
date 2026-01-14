import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useTodos() {
  const queryClient = useQueryClient()

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch("/api/todos")
      if (!response.ok) throw new Error("Failed to fetch todos")
      return response.json()
    },
  })

  const createTodo = useMutation({
    mutationFn: async ({ name, listId, description, dueAt }: { name: string, listId: string, description?: string, dueAt?: string }) => {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, listId, description, dueAt }),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })

  const updateTodo = useMutation({
    mutationFn: async ({ id, ...data }: { id: string, [key: string]: any }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })

  return {
    todos,
    isLoading,
    createTodo: createTodo.mutateAsync,
    updateTodo: updateTodo.mutateAsync,
  }
}