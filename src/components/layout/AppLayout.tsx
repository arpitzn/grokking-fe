import { useEffect } from 'react';
import { ThreadSidebar } from '@/components/threads';
import { ChatPage } from '@/components/chat';
import { KnowledgePanel } from '@/components/knowledge';
import { EscalatedTicketsPage } from '@/components/escalated-tickets';
import { OrdersPage } from '@/components/orders';
import { useAppStore } from '@/store/appStore';

export function AppLayout() {
  const setIsMobile = useAppStore(state => state.setIsMobile);
  const currentView = useAppStore(state => state.currentView);

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
      {/* Thread Sidebar - only show for chat view */}
      {currentView === 'chat' && <ThreadSidebar />}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {currentView === 'chat' ? (
          <ChatPage />
        ) : currentView === 'escalated-tickets' ? (
          <EscalatedTicketsPage />
        ) : (
          <OrdersPage />
        )}
      </main>

      {/* Knowledge Panel (Slide-out) - only show for chat view */}
      {currentView === 'chat' && <KnowledgePanel />}
    </div>
  );
}
