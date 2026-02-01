import { useState } from 'react';
import { MemoryRow } from './MemoryRow';
import { MemoryEmptyState } from './MemoryEmptyState';
import { ConfirmDialog } from '@/components/ui';
import type { Memory, MemoryType } from '@/types';

export interface MemoryListProps {
  memories: Memory[];
  onDelete: (id: string, type: MemoryType) => void;
}

export function MemoryList({ memories, onDelete }: MemoryListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState<MemoryType | null>(null);

  const handleDeleteClick = (id: string, type: MemoryType) => {
    setConfirmDeleteId(id);
    setConfirmDeleteType(type);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId && confirmDeleteType) {
      onDelete(confirmDeleteId, confirmDeleteType);
      setConfirmDeleteId(null);
      setConfirmDeleteType(null);
    }
  };

  if (memories.length === 0) {
    return <MemoryEmptyState />;
  }

  return (
    <>
      <div className="space-y-1">
        {memories.map(memory => (
          <MemoryRow
            key={memory.memory_id}
            memory={memory}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => {
          setConfirmDeleteId(null);
          setConfirmDeleteType(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Memory"
        message="Are you sure you want to delete this memory?"
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}
