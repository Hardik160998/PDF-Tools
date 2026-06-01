"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllTools, getCategories } from "@/lib/supabase";

export const toolKeys = {
  all: ["tools"] as const,
  categories: ["categories"] as const,
};

export function useAllTools() {
  return useQuery({
    queryKey: toolKeys.all,
    queryFn: getAllTools,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    select: (data) => data.filter((t) => t.is_verified),
  });
}

export function useDbCategories() {
  return useQuery({
    queryKey: toolKeys.categories,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useInvalidateTools() {
  const queryClient = useQueryClient();
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: toolKeys.all }),
    invalidateCategories: () => queryClient.invalidateQueries({ queryKey: toolKeys.categories }),
  };
}
