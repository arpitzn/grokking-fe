import { useEffect, useRef } from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ThinkingStream } from './ThinkingStream';
import { SkeletonMessage } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import type { Message, ThinkingPhase } from '@/types';

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  isStreaming?: boolean;
  thinkingPhase: ThinkingPhase;
}

export function ChatMessages({
  messages,
  isLoading = false,
  isStreaming = false,
  thinkingPhase,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const thinkingEntries = useAppStore(state => state.thinkingEntries);

  // Check if last assistant message has content (response has started)
  const lastMessage = messages[messages.length - 1];
  const hasResponseContent = lastMessage?.role === 'assistant' && lastMessage?.content;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinkingPhase, thinkingEntries]);

  // Empty state
  if (!isLoading && messages.length === 0 && !thinkingPhase && thinkingEntries.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Start a conversation
        </h3>
        <p className="text-sm text-zinc-500 max-w-sm">
          Ask me anything! I can help answer questions about your uploaded documents
          or provide general assistance.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Loading state */}
      {isLoading && (
        <div className="space-y-6">
          <SkeletonMessage />
          <SkeletonMessage isUser />
          <SkeletonMessage />
        </div>
      )}

      {/* Messages */}
      {!isLoading &&
        messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          const isLastAssistantMessage =
            isLastMessage && message.role === 'assistant';

          // If we're showing thinking stream and this is the last assistant message with no content
          // Don't render it - show thinking indicator instead
          if (thinkingEntries.length > 0 && isLastAssistantMessage && !message.content) {
            return null;
          }

          return (
            <MessageBubble
              key={message.message_id}
              message={message}
              isStreaming={isStreaming && isLastAssistantMessage}
            />
          );
        })}

      {/* Thinking indicator - shows CoT with faded styling, disappears when response starts */}
      {thinkingEntries.length > 0 && !hasResponseContent && (
        <div className="flex gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex-1 bg-zinc-50/50 rounded-xl p-4 border border-zinc-100/50">
            <ThinkingStream entries={thinkingEntries} currentPhase={thinkingPhase} />
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
