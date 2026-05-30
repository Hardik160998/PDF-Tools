import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-slate-500">
        <li>
          <Link href="/" className="hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span className="text-slate-900 font-semibold" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
