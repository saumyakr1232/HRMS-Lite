import { AlertCircle } from 'lucide-react';

export default function Input({
  label,
  error,
  required = false,
  className = '',
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 text-sm bg-surface-raised border rounded-lg
          placeholder:text-ink-faint
          focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
          ${error ? 'border-danger ring-1 ring-danger/20' : 'border-border-default hover:border-border-strong'}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
