"use client";

import { useState, useRef, useEffect } from 'react';

interface BlogImageProps {
 src: string;
 alt: string;
 className?: string;
}

export default function BlogImage({ src, alt, className = "" }: BlogImageProps) {
 const [loaded, setLoaded] = useState(false);
 const imgRef = useRef<HTMLImageElement>(null);

 useEffect(() => {
 if (imgRef.current?.complete) {
 setLoaded(true);
 }
 }, []);

 return (
 <div className={`relative w-full overflow-hidden bg-slate-100 dark:bg-slate-700 ${
 !loaded ? 'aspect-[1811/868] skeleton-shimmer' : ''
 }`}>
 <img
 ref={imgRef}
 src={src}
 alt={alt}
 onLoad={() => setLoaded(true)}
 className={`${className} w-full h-auto transition-opacity duration-300 ${
 loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
 }`}
 />
 </div>
 );
}
