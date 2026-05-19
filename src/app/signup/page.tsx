import AuthPageContent from "@/components/AuthPageContent";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading auth portal...</div>}>
      <AuthPageContent initialMode="signup" />
    </Suspense>
  );
}
