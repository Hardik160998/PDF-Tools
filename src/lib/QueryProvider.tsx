"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useState } from "react";

const CACHE_KEY = "REACT_QUERY_CACHE";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
 const [queryClient] = useState(
 () =>
 new QueryClient({
 defaultOptions: {
 queries: {
 staleTime: Infinity,
 gcTime: Infinity,
 retry: 1,
 refetchOnMount: false,
 refetchOnWindowFocus: false,
 refetchOnReconnect: false,
 },
 },
 })
 );

 const [persister] = useState(
 () =>
 typeof window !== "undefined"
 ? createSyncStoragePersister({
 storage: window.localStorage,
 key: CACHE_KEY,
 throttleTime: 1000,
 })
 : undefined
 );

 if (!persister) {
 return (
 <QueryClientProvider client={queryClient}>
 {children}
 </QueryClientProvider>
 );
 }

 return (
 <PersistQueryClientProvider
 client={queryClient}
 persistOptions={{
 persister,
 maxAge: 7 * 24 * 60 * 60 * 1000,
 }}
 onSuccess={() => {
 queryClient.resumePausedMutations();
 }}
 >
 {children}
 </PersistQueryClientProvider>
 );
}
