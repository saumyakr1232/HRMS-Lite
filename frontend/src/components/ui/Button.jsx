import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 shadow-sm shadow-brand-700/20',
  danger:
    'bg-danger text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-600/20',
  outline:
    'border border-border-strong text-ink bg-surface-raised hover:bg-surface-sunken active:bg-stone-200',
  ghost:
    'text-ink-muted hover:text-ink hover:bg-surface-sunken active:bg-stone-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer whitespace-nowrap
        ${variants[variant]} ${sizes[size]}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin -ml-0.5 h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
}
