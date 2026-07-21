import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = ''
}) => {
  return (
    <nav className={`flex text-xs font-medium text-text-custom/60 ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link 
            href="/admin" 
            className="inline-flex items-center hover:text-primary transition-colors gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            Admin
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 mx-1" />
              {isLast || !item.href ? (
                <span className="text-text-custom font-semibold">{item.label}</span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
