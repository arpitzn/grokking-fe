import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface MemoryTooltipProps {
  text: string;
  children: ReactNode;
  position?: 'above' | 'below';
  className?: string;
}

export function MemoryTooltip({
  text,
  children,
  position = 'above',
  className,
}: MemoryTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    // Toggle on mobile tap
    setIsVisible(prev => !prev);
  };

  return (
    <div
      className={cn('group relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      <div
        className={cn(
          'absolute z-20',
          'w-fit min-w-0 max-w-xs',
          'px-3 py-2 rounded-lg',
          'bg-zinc-900 text-white text-sm',
          'transition-all duration-150 ease-out',
          'shadow-lg',
          position === 'above' ? 'left-0 bottom-full mb-1' : 'left-0 top-full mt-1',
          isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="tooltip"
      >
        <div className="whitespace-normal break-words">{text}</div>
        {/* Arrow */}
        <div
          className={cn(
            'absolute left-3 w-0 h-0',
            'border-l-[8px] border-r-[8px]',
            position === 'above'
              ? 'top-full border-t-[8px] border-t-zinc-900 border-l-transparent border-r-transparent'
              : 'bottom-full border-b-[8px] border-b-zinc-900 border-l-transparent border-r-transparent'
          )}
        />
      </div>
    </div>
  );
}
