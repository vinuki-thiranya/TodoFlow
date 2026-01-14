import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useTags(userId?: string) {
  const queryClient = useQueryClient()

  const { data: tags = [], isLoading, error } = useQuery({
    queryKey: ["tags", userId],
    queryFn: async () => {
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      return response.json()
    },
    enabled: !!userId,
  })

  const createTagMutation = useMutation({
    mutationFn: async ({ label, backgroundColor, textColor }: { label: string; backgroundColor: string; textColor: string }) => {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, backgroundColor, textColor }),
      })
      if (!response.ok) throw new Error("Failed to create tag")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
    },
  })

  const createTag = async (label: string, backgroundColor: string, textColor: string) => {
    return createTagMutation.mutateAsync({ label, backgroundColor, textColor })
  }

  return {
    tags,
    isLoading,
    error,
    createTag,
  }
}
