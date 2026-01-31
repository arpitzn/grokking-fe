import { useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { ThreadItem } from './ThreadItem';
import { NewChatButton } from './NewChatButton';
import { Button, SkeletonThread } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';

export function ThreadSidebar() {
  const threads = useAppStore(state => state.threads);
  const currentThreadId = useAppStore(state => state.currentThreadId);
  const isLoadingThreads = useAppStore(state => state.isLoadingThreads);
  const isSidebarOpen = useAppStore(state => state.isSidebarOpen);
  const isMobile = useAppStore(state => state.isMobile);

  const fetchThreads = useAppStore(state => state.fetchThreads);
  const selectThread = useAppStore(state => state.selectThread);
  const createNewChat = useAppStore(state => state.createNewChat);
  const toggleSidebar = useAppStore(state => state.toggleSidebar);

  // Fetch threads on mount
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleSelectThread = (threadId: string) => {
    selectThread(threadId);
    // Close sidebar on mobile after selection
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleCreateNewChat = () => {
    createNewChat();
    // Close sidebar on mobile after creation
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Don't render if closed on desktop
  if (!isSidebarOpen && !isMobile) {
    return null;
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-zinc-900">Chats</h2>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* New chat button */}
      <div className="p-4">
        <NewChatButton onClick={handleCreateNewChat} />
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin">
        {isLoadingThreads ? (
          // Loading skeleton
          <>
            <SkeletonThread />
            <SkeletonThread />
            <SkeletonThread />
          </>
        ) : threads.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <p className="text-sm text-zinc-500">No conversations yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          // Thread list
          threads.map(thread => (
            <ThreadItem
              key={thread.conversation_id}
              thread={thread}
              isActive={thread.conversation_id === currentThreadId}
              onClick={() => handleSelectThread(thread.conversation_id)}
            />
          ))
        )}
      </div>
    </div>
  );

  // Mobile: Overlay sidebar
  if (isMobile) {
    if (!isSidebarOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50',
            'animate-slide-in-left'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <aside
      className={cn(
        'w-80 bg-white border-r border-zinc-200 flex-shrink-0',
        'transition-all duration-300'
      )}
    >
      {sidebarContent}
    </aside>
  );
}
