"use client";

import dynamic from "next/dynamic";

const RedactPdfLoader = () => (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-shadow duration-300 p-6 sm:p-10 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden animate-pulse">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="relative text-center space-y-4 mb-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-700">
                <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-red-500 animate-spin" />
            </div>
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
        <div className="w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 sm:p-20 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-md mb-4 animate-bounce" />
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-full mb-2" />
            <div className="h-4 w-52 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
    </div>
);

const RedactPdfClient = dynamic(() => import("./RedactPdf"), {
    ssr: false,
    loading: () => <RedactPdfLoader />,
});

export default function RedactPdfWrapper({ id }: { id: string }) {
    return <RedactPdfClient id={id} />;
}
