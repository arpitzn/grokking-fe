import { MessageSquare } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatThreadDate, truncateText } from '@/utils/formatters';
import type { Thread } from '@/types';

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
}

export function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl text-left',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
        isActive
          ? 'bg-blue-50 border border-blue-200'
          : 'hover:bg-zinc-50 border border-transparent'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          isActive ? 'bg-blue-100' : 'bg-zinc-100'
        )}
      >
        <MessageSquare
          className={cn(
            'w-5 h-5',
            isActive ? 'text-blue-600' : 'text-zinc-500'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'text-sm font-medium truncate',
            isActive ? 'text-blue-900' : 'text-zinc-900'
          )}
        >
          {truncateText(thread.title || 'New Chat', 30)}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-500">
            {thread.message_count} message{thread.message_count !== 1 ? 's' : ''}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-xs text-zinc-400">
            {formatThreadDate(thread.updated_at)}
          </span>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
      )}
    </button>
  );
}
