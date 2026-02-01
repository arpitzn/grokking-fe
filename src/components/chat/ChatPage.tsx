import { useEffect } from 'react';
import { FileText, Plus, Menu, AlertTriangle, ShoppingCart } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui';
import { PersonaSelector } from '@/components/persona';
import { MemoryIconButton, MemoryPanel } from '@/components/memory';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';

export function ChatPage() {
  const messages = useAppStore(state => state.messages);
  const isLoadingMessages = useAppStore(state => state.isLoadingMessages);
  const isStreaming = useAppStore(state => state.isStreaming);
  const thinkingPhase = useAppStore(state => state.thinkingPhase);
  const currentThreadId = useAppStore(state => state.currentThreadId);
  const isMobile = useAppStore(state => state.isMobile);
  const isResolvingUser = useAppStore(state => state.isResolvingUser);

  const sendMessage = useAppStore(state => state.sendMessage);
  const toggleKnowledgePanel = useAppStore(state => state.toggleKnowledgePanel);
  const toggleMemoryPanel = useAppStore(state => state.toggleMemoryPanel);
  const toggleSidebar = useAppStore(state => state.toggleSidebar);
  const createNewChat = useAppStore(state => state.createNewChat);
  const fetchDocuments = useAppStore(state => state.fetchDocuments);
  const fetchEscalatedTickets = useAppStore(state => state.fetchEscalatedTickets);
  const fetchMemories = useAppStore(state => state.fetchMemories);
  const setCurrentView = useAppStore(state => state.setCurrentView);
  const escalatedTicketsCount = useAppStore(state => state.escalatedTicketsCount);
  const selectedPersona = useAppStore(state => state.selectedPersona);
  const userId = useAppStore(state => state.userId);

  // Fetch documents and escalated tickets when persona/user changes (only if not end_customer)
  useEffect(() => {
    // Skip fetch for End Customer, if resolving, or if no userId
    if (selectedPersona.persona === 'end_customer' || isResolvingUser || !userId) {
      return;
    }
    
    fetchDocuments();
    
    // Fetch escalated tickets for Area Manager and Customer Care Rep
    if (selectedPersona.persona === 'area_manager' || selectedPersona.persona === 'customer_care_rep') {
      fetchEscalatedTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPersona.persona, selectedPersona.subcategory, userId, isResolvingUser]); // Only depend on primitive values

  // Fetch memories when persona/user changes (for ALL personas including end_customer)
  useEffect(() => {
    // Skip if resolving or if no userId
    if (isResolvingUser || !userId) {
      return;
    }
    
    fetchMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPersona.persona, selectedPersona.subcategory, userId, isResolvingUser]); // Only depend on primitive values

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleEscalatedTicketsClick = () => {
    setCurrentView('escalated-tickets');
  };

  const handleOrdersClick = () => {
    setCurrentView('orders');
  };

  // Show escalated tickets icon only for Area Manager and Customer Care Rep
  const showEscalatedTicketsIcon =
    selectedPersona.persona === 'area_manager' || selectedPersona.persona === 'customer_care_rep';

  // Show orders icon only for End Customer
  const showOrdersIcon = selectedPersona.persona === 'end_customer';

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="h-9 w-9"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-zinc-900">
            {currentThreadId ? 'Chat' : 'New Chat'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {showEscalatedTicketsIcon && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEscalatedTicketsClick}
                aria-label="View escalated tickets"
                title="Escalated Tickets"
                className="h-9 w-9"
              >
                <AlertTriangle className="w-5 h-5" />
              </Button>
              {escalatedTicketsCount > 0 && (
                <span
                  className={cn(
                    'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5',
                    'flex items-center justify-center rounded-full text-[10px] font-semibold',
                    'bg-red-500 text-white border-2 border-white'
                  )}
                  aria-label={`${escalatedTicketsCount} escalated tickets`}
                >
                  {escalatedTicketsCount > 99 ? '99+' : escalatedTicketsCount}
                </span>
              )}
            </div>
          )}
          {showOrdersIcon && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOrdersClick}
              aria-label="View orders"
              title="Orders"
              className="h-9 w-9"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          )}
          {selectedPersona.persona !== 'end_customer' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleKnowledgePanel}
              aria-label="Open knowledge base"
              title="Knowledge Base"
              className="h-9 w-9"
            >
              <FileText className="w-5 h-5" />
            </Button>
          )}
          <MemoryIconButton onClick={toggleMemoryPanel} />
          <Button
            variant="ghost"
            size="icon"
            onClick={createNewChat}
            aria-label="New chat"
            title="New Chat"
            className="h-9 w-9"
          >
            <Plus className="w-5 h-5" />
          </Button>
          <PersonaSelector />
        </div>
      </header>

      {/* Messages area */}
      <ChatMessages
        messages={messages}
        isLoading={isLoadingMessages}
        isStreaming={isStreaming}
        thinkingPhase={thinkingPhase}
      />

      {/* Input area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isStreaming || !!thinkingPhase || isResolvingUser}
        placeholder={
          isResolvingUser
            ? 'Resolving user...'
            : isStreaming || thinkingPhase
            ? 'Waiting for response...'
            : 'Type your message...'
        }
      />

      {/* Memory Panel */}
      <MemoryPanel />
    </div>
  );
}
