import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useLists(userId?: string) {
  const queryClient = useQueryClient()

  const { data: lists = [], isLoading, error } = useQuery({
    queryKey: ["lists", userId],
    queryFn: async () => {
      const response = await fetch("/api/lists")
      if (!response.ok) throw new Error("Failed to fetch lists")
      return response.json()
    },
    enabled: !!userId,
  })

  const createListMutation = useMutation({
    mutationFn: async ({ title, themeColor }: { title: string; themeColor: string }) => {
      console.log("Creating list with:", { title, themeColor })
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, themeColor }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Failed to create list:", errorData)
        throw new Error(errorData.details || "Failed to create list")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] })
    },
    onError: (error) => {
      console.error("List creation error:", error)
    },
  })

  const createList = async (title: string, themeColor: string) => {
    return createListMutation.mutateAsync({ title, themeColor })
  }

  return {
    lists,
    isLoading,
    error,
    createList,
  }
}
