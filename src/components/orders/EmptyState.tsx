import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

interface EmptyStateProps {
  onCreateOrder?: () => void;
}

export function EmptyState({ onCreateOrder }: EmptyStateProps) {
  const selectedPersona = useAppStore(state => state.selectedPersona);
  const isEndCustomer = selectedPersona.persona === 'end_customer';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
        <ShoppingCart className="w-12 h-12 text-zinc-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 mb-2">No orders yet</h3>
      <p className="text-sm text-zinc-500 mb-6 text-center max-w-md">
        {isEndCustomer
          ? 'Start ordering by creating your first order'
          : 'Orders will appear here once they are created'}
      </p>
      {isEndCustomer && onCreateOrder && (
        <Button onClick={onCreateOrder} variant="default">
          Create Order
        </Button>
      )}
    </div>
  );
}
