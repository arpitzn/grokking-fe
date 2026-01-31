import { useEffect } from 'react';
import { FileText, Plus, Menu } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

export function ChatPage() {
  const messages = useAppStore(state => state.messages);
  const isLoadingMessages = useAppStore(state => state.isLoadingMessages);
  const isStreaming = useAppStore(state => state.isStreaming);
  const thinkingPhase = useAppStore(state => state.thinkingPhase);
  const currentThreadId = useAppStore(state => state.currentThreadId);
  const isMobile = useAppStore(state => state.isMobile);

  const sendMessage = useAppStore(state => state.sendMessage);
  const toggleKnowledgePanel = useAppStore(state => state.toggleKnowledgePanel);
  const toggleSidebar = useAppStore(state => state.toggleSidebar);
  const createNewChat = useAppStore(state => state.createNewChat);
  const fetchDocuments = useAppStore(state => state.fetchDocuments);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

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
        disabled={isStreaming || !!thinkingPhase}
        placeholder={
          isStreaming || thinkingPhase
            ? 'Waiting for response...'
            : 'Type your message...'
        }
      />
    </div>
  );
}
