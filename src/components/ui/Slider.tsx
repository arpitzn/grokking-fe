import { forwardRef, useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      required,
      helpText,
      error,
      min = 0,
      max = 100,
      step = 1,
      value,
      onChange,
      showValue = true,
      id,
      ...props
    },
    ref
  ) => {
    const sliderId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const helpTextId = helpText ? `${sliderId}-help` : undefined;
    const errorId = error ? `${sliderId}-error` : undefined;
    const [internalValue, setInternalValue] = useState(value ?? min);
    const sliderRef = useRef<HTMLInputElement>(null);

    // Sync internal value with external value prop
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const currentValue = value !== undefined ? value : internalValue;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <div className="flex items-center gap-1.5 mb-1">
            <label
              htmlFor={sliderId}
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

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex-1 relative">
              <input
                ref={ref || sliderRef}
                id={sliderId}
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={handleChange}
                className={cn(
                  'w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer',
                  'focus:outline-none',
                  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm',
                  '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-sm',
                  error && '[&::-webkit-slider-thumb]:bg-red-500 [&::-moz-range-thumb]:bg-red-500',
                  'transition-all duration-150'
                )}
                style={{
                  background: `linear-gradient(to right, ${
                    error ? '#ef4444' : '#2563eb'
                  } 0%, ${error ? '#ef4444' : '#2563eb'} ${percentage}%, #e4e4e7 ${percentage}%, #e4e4e7 100%)`,
                }}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={cn(errorId, helpTextId)}
                {...props}
              />
            </div>
            {showValue && (
              <div
                className={cn(
                  'min-w-[2.5rem] text-sm font-medium text-center px-1.5 py-0.5 rounded',
                  error ? 'text-red-600' : 'text-zinc-700'
                )}
              >
                {currentValue.toFixed(step < 1 ? 1 : 0)}
              </div>
            )}
          </div>

          {/* Min/Max labels */}
          <div className="flex justify-between text-xs text-zinc-500 px-0.5">
            <span>{min}</span>
            <span>{max}</span>
          </div>
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

Slider.displayName = 'Slider';

export { Slider };
