import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface NewChatButtonProps {
  onClick: () => void;
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="primary"
      className="w-full justify-start gap-3 h-12"
    >
      <Plus className="w-5 h-5" />
      <span>New Chat</span>
    </Button>
  );
}
