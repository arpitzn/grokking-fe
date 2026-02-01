import { useState } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatThreadDate, truncateText } from '@/utils/formatters';
import { Button, ConfirmDialog } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import type { Thread } from '@/types';

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
}

export function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteThread = useAppStore(state => state.deleteThread);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteThread(thread.conversation_id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      // Error is handled by store
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'w-full flex items-center gap-3 p-3 rounded-xl',
          'transition-all duration-150 ease-out',
          isActive
            ? 'bg-blue-50 border border-blue-200'
            : 'hover:bg-zinc-50 border border-transparent'
        )}
      >
        <button
          onClick={onClick}
          className={cn(
            'flex-1 flex items-center gap-3 text-left',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg'
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
              title={thread.title || 'New Chat'}
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
        </button>

        {/* Delete button and active indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Active indicator */}
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
          
          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="h-8 w-8 text-zinc-400 hover:text-red-600"
            aria-label={`Delete conversation: ${thread.title || 'New Chat'}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        message="You will lose this conversation and all related data."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
