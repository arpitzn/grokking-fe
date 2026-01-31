import { forwardRef } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, required, helpText, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const helpTextId = helpText ? `${selectId}-help` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="w-full">
      {label && (
        <div className="flex items-center gap-1.5 mb-1">
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-zinc-700"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {helpText && (
            <div className="group relative">
              <Info className="w-3.5 h-3.5 text-zinc-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-64 p-2 text-xs text-zinc-600 bg-white border border-zinc-200 rounded-lg shadow-lg">
                {helpText}
              </div>
            </div>
          )}
        </div>
      )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-3 py-2 pr-8 text-sm bg-white border rounded-lg transition-all duration-150',
              'appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
              'disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed',
              'h-[40px]',
              error
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-zinc-200',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={cn(errorId, helpTextId)}
            {...props}
          >
            {!props.value && (
              <option value="">Select {label?.toLowerCase() || 'option'}</option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none flex-shrink-0" />
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
