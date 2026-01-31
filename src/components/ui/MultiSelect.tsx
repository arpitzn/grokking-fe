import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface MultiSelectOption {
  value: string;
  label: string;
  group?: string; // Optional group name for grouping
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  placeholder?: string;
  searchable?: boolean;
  id?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  required,
  helpText,
  error,
  placeholder = 'Select options',
  id,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const helpTextId = helpText ? `${selectId}-help` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Use all options (no search filtering)
  const filteredOptions = options;

  // Group options by group name
  const groupedOptions: Record<string, MultiSelectOption[]> = {};
  const ungroupedOptions: MultiSelectOption[] = [];

  filteredOptions.forEach((option) => {
    if (option.group) {
      if (!groupedOptions[option.group]) {
        groupedOptions[option.group] = [];
      }
      groupedOptions[option.group].push(option);
    } else {
      ungroupedOptions.push(option);
    }
  });

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeItem = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const isSelected = (optionValue: string) => value.includes(optionValue);

  // Get selected options with labels
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  // Helper to get label for a value
  const getLabel = (val: string) => {
    return options.find((opt) => opt.value === val)?.label || val;
  };

  // Badge component for selected items
  const Badge = ({
    children,
    onRemove,
  }: {
    children: React.ReactNode;
    onRemove: () => void;
  }) => {
    const handleRemove = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      onRemove();
    };

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap flex-shrink-0">
        <span
          role="button"
          tabIndex={0}
          onClick={handleRemove}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRemove(e);
            }
          }}
          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors -ml-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </span>
        {children}
      </span>
    );
  };

  return (
    <div className={cn('w-full', className)}>
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
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-20 w-64 p-2 text-xs text-zinc-600 bg-white border border-zinc-200 rounded-lg shadow-lg">
                {helpText}
              </div>
            </div>
          )}
        </div>
      )}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-3 py-2 pr-8 text-sm bg-white border rounded-lg transition-all duration-150',
            'flex items-center gap-2 text-left',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
            'disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed',
            'h-[40px]',
            error
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-zinc-200',
            isOpen && 'ring-2 ring-blue-500/20 border-blue-500'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={cn(errorId, helpTextId)}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            {selectedOptions.length === 0 ? (
              <span className="text-zinc-900 leading-normal">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <Badge key={opt.value} onRemove={() => removeItem(opt.value)}>
                  {opt.label}
                </Badge>
              ))
            )}
          </div>
        </button>
        <ChevronDown
          className={cn(
            'absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none flex-shrink-0 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />

        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-80 overflow-hidden flex flex-col">
            <div className="overflow-y-auto max-h-80">
              {/* Grouped options */}
              {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <div key={groupName} className="py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide bg-zinc-50">
                    {groupName}
                  </div>
                  {groupOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
                      className={cn(
                        'w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-zinc-50 transition-colors',
                        isSelected(option.value) && 'bg-blue-50'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 border rounded flex items-center justify-center flex-shrink-0',
                          isSelected(option.value)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-zinc-300'
                        )}
                      >
                        {isSelected(option.value) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="flex-1">{option.label}</span>
                    </button>
                  ))}
                </div>
              ))}

              {/* Ungrouped options */}
              {ungroupedOptions.length > 0 && (
                <div className="py-1">
                  {ungroupedOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
                      className={cn(
                        'w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-zinc-50 transition-colors',
                        isSelected(option.value) && 'bg-blue-50'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 border rounded flex items-center justify-center flex-shrink-0',
                          isSelected(option.value)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-zinc-300'
                        )}
                      >
                        {isSelected(option.value) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="flex-1">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredOptions.length === 0 && (
                <div className="px-3 py-4 text-sm text-zinc-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
