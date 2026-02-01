import { Brain } from 'lucide-react';
import { Button } from '@/components/ui';

export interface MemoryIconButtonProps {
  onClick: () => void;
}

export function MemoryIconButton({ onClick }: MemoryIconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="Open saved memories"
      title="Saved Memories"
      className="h-9 w-9"
    >
      <Brain className="w-5 h-5" />
    </Button>
  );
}
