import { useEffect } from 'react';
import { ThreadSidebar } from '@/components/threads';
import { ChatPage } from '@/components/chat';
import { KnowledgePanel } from '@/components/knowledge';
import { useAppStore } from '@/store/appStore';

export function AppLayout() {
  const setIsMobile = useAppStore(state => state.setIsMobile);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Thread Sidebar */}
      <ThreadSidebar />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <ChatPage />
      </main>

      {/* Knowledge Panel (Slide-out) */}
      <KnowledgePanel />
    </div>
  );
}
