import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { EmptyState } from './EmptyState';
import { CreateOrderModal } from './CreateOrderModal';
import { Button } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

export function OrdersPage() {
  const orders = useAppStore(state => state.orders);
  const zones = useAppStore(state => state.zones);
  const restaurants = useAppStore(state => state.restaurants);
  const isLoadingOrders = useAppStore(state => state.isLoadingOrders);
  const fetchOrders = useAppStore(state => state.fetchOrders);
  const fetchZones = useAppStore(state => state.fetchZones);
  const setCurrentView = useAppStore(state => state.setCurrentView);
  const selectedPersona = useAppStore(state => state.selectedPersona);
  const userId = useAppStore(state => state.userId);
  const isResolvingUser = useAppStore(state => state.isResolvingUser);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isEndCustomer = selectedPersona.persona === 'end_customer';

  // Fetch orders on mount (End Customer only)
  useEffect(() => {
    if (isEndCustomer && !isResolvingUser && userId) {
      fetchOrders();
    }
  }, [isEndCustomer, userId, isResolvingUser, fetchOrders]);

  // Fetch zones and restaurants on mount
  useEffect(() => {
    if (zones.length === 0) {
      fetchZones();
    }
  }, [zones.length, fetchZones]);

  const handleRefresh = () => {
    if (isEndCustomer && userId) {
      fetchOrders();
    }
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const handleCreateOrder = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToChat}
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Back to chat"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-zinc-900">Orders</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          aria-label="Refresh orders"
          title="Refresh"
          className="h-9 w-9"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Create Order Button (End Customer only) */}
        {isEndCustomer && (
          <div className="mb-4">
            <Button onClick={handleCreateOrder} variant="primary">
              Create Order
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoadingOrders ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState onCreateOrder={isEndCustomer ? handleCreateOrder : undefined} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {orders.map(order => (
              <OrderCard
                key={order.order_id}
                order={order}
                zones={zones}
                restaurants={restaurants}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
