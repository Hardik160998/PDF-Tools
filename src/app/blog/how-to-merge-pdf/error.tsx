'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
 // Log the error to an error reporting service
 console.error(error);
 }, [error]);

 return (
 <div className="min-h-screen container mx-auto px-4 py-20 max-w-3xl flex flex-col items-center justify-center text-center">
 <h2 className="text-2xl font-black text-slate-900 mb-4">Something went wrong!</h2>
 <p className="text-slate-600 mb-8 max-w-md">
 We encountered an error while trying to load this article. Our team has been notified.
 </p>
 <div className="flex gap-4">
 <button
 onClick={() => reset()}
 className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors"
 >
 Try again
 </button>
 <Link 
 href="/blog"
 className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
 >
 Back to Blog
 </Link>
 </div>
 </div>
 );
}
