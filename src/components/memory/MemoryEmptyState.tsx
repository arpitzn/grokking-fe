import { Brain } from 'lucide-react';

export function MemoryEmptyState() {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-3">
        <Brain className="w-6 h-6 text-zinc-400" />
      </div>
      <p className="text-sm text-zinc-500">No saved memories yet</p>
    </div>
  );
}
