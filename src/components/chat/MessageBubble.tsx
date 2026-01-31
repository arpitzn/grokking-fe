import { User, Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatMessageTime } from '@/utils/formatters';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-in-up',
        isUser && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-blue-600' : 'bg-zinc-100'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-zinc-600" />
        )}
      </div>

      {/* Message content */}
      <div
        className={cn(
          'flex flex-col gap-1 max-w-[80%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-zinc-100 text-zinc-900 rounded-bl-md'
          )}
        >
          {message.content || (
            <span className="text-zinc-400 italic">Waiting for response...</span>
          )}
          {/* Streaming cursor */}
          {isStreaming && isAssistant && message.content && (
            <span className="inline-block w-2 h-4 ml-1 bg-zinc-600 animate-pulse" />
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-zinc-400 px-1">
          {formatMessageTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}
