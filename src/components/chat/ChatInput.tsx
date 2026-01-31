import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-zinc-200 bg-white p-4">
      <div
        className={cn(
          'flex items-end gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl',
          'focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500',
          'transition-all duration-150'
        )}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400',
            'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[24px] max-h-[200px]'
          )}
          aria-label="Message input"
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          size="icon"
          className="flex-shrink-0 h-9 w-9 rounded-xl"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="mt-2 text-xs text-center text-zinc-400">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
