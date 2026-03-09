import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Select({
  label,
  error,
  required = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none px-3.5 py-2.5 pr-10 text-sm bg-surface-raised border rounded-lg cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
            ${!props.value ? 'text-ink-faint' : 'text-ink'}
            ${error ? 'border-danger ring-1 ring-danger/20' : 'border-border-default hover:border-border-strong'}`}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none" />
      </div>
      {error && (
        <p className="text-xs text-danger flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
