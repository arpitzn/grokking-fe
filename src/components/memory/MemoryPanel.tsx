import { useEffect } from 'react';
import { Panel } from '@/components/ui';
import { MemoryList } from './MemoryList';
import { useAppStore } from '@/store/appStore';

export function MemoryPanel() {
  const isOpen = useAppStore(state => state.isMemoryPanelOpen);
  const memories = useAppStore(state => state.memories);
  const memoriesLastFetched = useAppStore(state => state.memoriesLastFetched);

  const togglePanel = useAppStore(state => state.toggleMemoryPanel);
  const fetchMemories = useAppStore(state => state.fetchMemories);
  const deleteMemory = useAppStore(state => state.deleteMemory);

  // Fetch memories when panel opens (only if data is stale)
  useEffect(() => {
    if (isOpen) {
      const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

      const isStale =
        !memoriesLastFetched ||
        Date.now() - memoriesLastFetched > STALE_THRESHOLD_MS;

      if (isStale) {
        fetchMemories();
      }
    }
  }, [isOpen, fetchMemories, memoriesLastFetched]);

  return (
    <Panel
      isOpen={isOpen}
      onClose={togglePanel}
      title="Saved Memories"
    >
      <MemoryList memories={memories} onDelete={deleteMemory} />
    </Panel>
  );
}
