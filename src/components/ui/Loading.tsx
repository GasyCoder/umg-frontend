import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-3",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        "rounded-full border-indigo-500 border-t-transparent animate-spin",
        sizeStyles[size],
        className
      )}
    />
  );
}

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message = "Chargement..." }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">{message}</p>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={clsx(
        "bg-slate-200 dark:bg-slate-700 animate-pulse",
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 flex gap-4"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
