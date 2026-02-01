import { AlertTriangle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="text-lg font-medium text-zinc-900 mb-2">No escalated tickets found</h3>
      <p className="text-sm text-zinc-500 text-center max-w-md">
        There are currently no complaint tickets with critical or high severity.
      </p>
    </div>
  );
}
