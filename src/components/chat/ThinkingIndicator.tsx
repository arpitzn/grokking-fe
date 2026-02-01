import { Brain, Search, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ThinkingPhase } from '@/types';

interface ThinkingIndicatorProps {
  phase: ThinkingPhase;
}

const phaseConfig = {
  understanding: {
    icon: Brain,
    text: 'Understanding your question...',
  },
  searching: {
    icon: Search,
    text: 'Searching knowledge base...',
  },
  generating: {
    icon: Sparkles,
    text: 'Generating response...',
  },
  memory: {
    icon: Brain,
    text: 'Accessing memory...',
  },
  planning: {
    icon: Brain,
    text: 'Planning response...',
  },
};

export function ThinkingIndicator({ phase }: ThinkingIndicatorProps) {
  if (!phase) return null;

  const { icon: Icon, text } = phaseConfig[phase];

  return (
    <div className="flex items-center gap-3 text-zinc-500 py-3 animate-fade-in">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100">
        <Icon className="w-4 h-4 animate-spin-slow" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{text}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={cn(
                'w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce-dot'
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
