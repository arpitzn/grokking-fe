import { useState, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TooltipProps {
  filterType: string;
  filterValue: string;
  badgeType: 'category' | 'persona' | 'issue_type' | 'priority' | 'doc_weight';
  children: ReactNode;
  className?: string;
}

const badgeBackgroundColors = {
  category: 'bg-blue-100',
  persona: 'bg-green-100',
  issue_type: 'bg-purple-100',
  priority: 'bg-orange-100',
  doc_weight: 'bg-gray-100',
};

const badgeTextColors = {
  category: 'text-blue-700',
  persona: 'text-green-700',
  issue_type: 'text-purple-700',
  priority: 'text-orange-700',
  doc_weight: 'text-gray-700',
};

const badgeArrowColors = {
  category: 'border-t-blue-100',
  persona: 'border-t-green-100',
  issue_type: 'border-t-purple-100',
  priority: 'border-t-orange-100',
  doc_weight: 'border-t-gray-100',
};

export function Tooltip({
  filterType,
  filterValue,
  badgeType,
  children,
  className,
}: TooltipProps) {
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
          'absolute left-0 bottom-full mb-1 z-20',
          'w-fit min-w-0 max-w-[200px]',
          'px-2 py-1.5 rounded-lg',
          'transition-all duration-150 ease-out',
          badgeBackgroundColors[badgeType],
          badgeTextColors[badgeType],
          'shadow-lg',
          isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        )}
        role="tooltip"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold whitespace-nowrap">{filterType}</span>
        </div>
        {/* Arrow pointing down */}
        <div
          className={cn(
            'absolute left-3 bottom-0 translate-y-full w-0 h-0',
            'border-l-[8px] border-r-[8px] border-t-[8px]',
            'border-l-transparent border-r-transparent',
            badgeArrowColors[badgeType]
          )}
        />
      </div>
    </div>
  );
}
