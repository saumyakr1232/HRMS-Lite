import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <Loader2 className={`animate-spin text-brand-600 ${sizes[size]} ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-100 animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-ink-muted">Loading...</p>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="h-10 rounded-lg animate-shimmer" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4" style={{ animationDelay: `${i * 80}ms` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-8 flex-1 rounded-md animate-shimmer" style={{ animationDelay: `${j * 40}ms` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 bg-surface-raised border border-border-default rounded-2xl">
      <div className="h-4 w-24 rounded animate-shimmer mb-3" />
      <div className="h-8 w-16 rounded animate-shimmer" />
    </div>
  );
}
