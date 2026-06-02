export default function Loading() {
 return (
 <div className="min-h-screen container mx-auto px-4 pt-10 pb-20 max-w-3xl animate-pulse">
 <div className="h-4 w-24 bg-slate-200 rounded mb-8"></div>
 
 <div className="flex items-center gap-4 mb-6">
 <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0"></div>
 <div className="w-full">
 <div className="h-8 w-3/4 bg-slate-200 rounded mb-2"></div>
 <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
 </div>
 </div>
 
 <div className="w-full aspect-[1200/630] bg-slate-200 rounded-2xl mb-8"></div>
 
 <div className="space-y-4">
 <div className="h-4 w-full bg-slate-200 rounded"></div>
 <div className="h-4 w-full bg-slate-200 rounded"></div>
 <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
 </div>
 </div>
 );
}
