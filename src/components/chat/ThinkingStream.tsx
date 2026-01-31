import { useEffect, useRef } from 'react';
import { Brain, Search, Sparkles, Database } from 'lucide-react';
import type { ThinkingEntry, ThinkingPhase } from '@/types';

interface ThinkingStreamProps {
  entries: ThinkingEntry[];
  currentPhase: ThinkingPhase;
}

const phaseConfig: Record<
  Exclude<ThinkingPhase, null>,
  { icon: typeof Brain; label: string }
> = {
  memory: { icon: Database, label: 'Loading context' },
  planning: { icon: Brain, label: 'Analyzing' },
  searching: { icon: Search, label: 'Searching knowledge base' },
  generating: { icon: Sparkles, label: 'Generating response' },
};

export function ThinkingStream({ entries, currentPhase }: ThinkingStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="max-h-[90px] overflow-y-auto space-y-3 text-sm scrollbar-thin">
      {entries.map((entry, idx) => {
        if (!entry.phase) return null;
        const config = phaseConfig[entry.phase];
        const Icon = config?.icon;
        return (
          <div key={idx} className="animate-fade-in">
            {/* Faded phase label - zinc-400 */}
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span className="font-medium text-xs uppercase tracking-wide">
                {config?.label}
              </span>
            </div>
            {/* Faded content - zinc-500 (distinguishable from real response) */}
            <p className="pl-5 text-zinc-500 leading-relaxed text-sm">
              {entry.content}
            </p>
          </div>
        );
      })}

      {/* Show loading indicator for current phase if no entry yet */}
      {currentPhase && !entries.some(e => e.phase === currentPhase) && (() => {
        const CurrentIcon = phaseConfig[currentPhase]?.icon;
        return (
          <div className="flex items-center gap-2 text-zinc-400">
            {CurrentIcon && <CurrentIcon className="w-3.5 h-3.5 animate-pulse" />}
            <span className="animate-pulse text-xs uppercase tracking-wide">
              {phaseConfig[currentPhase]?.label}...
            </span>
          </div>
        );
      })()}

      {/* Scroll anchor */}
      <div ref={scrollRef} />
    </div>
  );
}
