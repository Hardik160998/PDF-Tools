"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllTools, getCategories } from "@/lib/supabase";

export const toolKeys = {
 all: ["tools"] as const,
 categories: ["categories"] as const,
};

export function useAllTools(initialData?: any[]) {
 return useQuery({
 queryKey: toolKeys.all,
 queryFn: getAllTools,
 initialData,
 staleTime: Infinity,
 gcTime: 1000 * 60 * 60, // 1 hour
 refetchOnMount: false,
 refetchOnWindowFocus: false,
 refetchOnReconnect: false,
 select: (data) => data.filter((t) => t.is_verified),
 });
}

export function useDbCategories(initialData?: any[]) {
 return useQuery({
 queryKey: toolKeys.categories,
 queryFn: getCategories,
 initialData,
 staleTime: Infinity,
 gcTime: 1000 * 60 * 60,
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
