import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect'
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-10 w-10 rounded-full'
  };

  return (
    <div className={`animate-pulse bg-slate-200/80 ${variantStyles[variant]} ${className}`} />
  );
};

export const LoadingSkeletonTable: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-xl border border-border-custom overflow-hidden">
      <div className="px-6 py-4 border-b border-border-custom flex gap-4">
        <Skeleton className="w-1/4 h-8" />
        <Skeleton className="w-1/12 h-8 ml-auto" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton variant="circle" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-1/3" />
              <Skeleton variant="text" className="w-2/3" />
            </div>
            <Skeleton variant="text" className="w-24 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const LoadingSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-border-custom space-y-4">
          <div className="flex justify-between">
            <Skeleton variant="text" className="w-1/2 h-4" />
            <Skeleton variant="circle" className="w-8 h-8" />
          </div>
          <Skeleton variant="text" className="w-2/3 h-8" />
          <Skeleton variant="text" className="w-3/4 h-3" />
        </div>
      ))}
    </div>
  );
};
