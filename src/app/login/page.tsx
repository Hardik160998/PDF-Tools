import AuthPageContent from "@/components/AuthPageContent";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading auth portal...</div>}>
      <AuthPageContent initialMode="login" />
    </Suspense>
  );
}
