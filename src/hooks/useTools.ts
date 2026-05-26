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
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => data.filter((t) => t.is_verified),
  });
}

export function useDbCategories() {
  return useQuery({
    queryKey: toolKeys.categories,
    queryFn: getCategories,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useInvalidateTools() {
  const queryClient = useQueryClient();
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: toolKeys.all }),
    invalidateCategories: () => queryClient.invalidateQueries({ queryKey: toolKeys.categories }),
  };
}
