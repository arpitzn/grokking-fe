import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { MemoryTooltip } from '@/components/ui/MemoryTooltip';
import type { Memory, MemoryType } from '@/types';
import { cn } from '@/utils/cn';

export interface MemoryRowProps {
  memory: Memory;
  onDelete: (id: string, type: MemoryType) => void;
}

export function MemoryRow({ memory, onDelete }: MemoryRowProps) {
  const isMem0 = memory.type === 'mem0';

  return (
    <div className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors">
      <MemoryTooltip text={memory.content} position="above" className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm text-zinc-700 truncate',
            'max-w-xs md:max-w-sm'
          )}
        >
          {memory.content}
        </p>
      </MemoryTooltip>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => !isMem0 && onDelete(memory.memory_id, memory.type)}
        disabled={isMem0}
        aria-label={isMem0 ? 'Cannot delete mem0 memory' : 'Delete memory'}
        className={cn(
          'h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity',
          isMem0 && 'opacity-30 cursor-not-allowed'
        )}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
